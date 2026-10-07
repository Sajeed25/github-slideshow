/* Pathwise engine — pure functions over a user "career graph" object.
 * No DOM, no network; runs in the browser and in Node (see tests/engine.test.js).
 *
 * user = { name, stage, goal, studying, interests[], city, lookingFor,
 *          skills: { [name]: { level 1-5, assessed bool } },
 *          evidence: [{ id, type, title, desc, skills[], outcome, statement }],
 *          apps: [{ oppId, history[], at, match }], interview: { best, attempts } }
 *
 * Design rule: MATCH answers "do I fit?" (declared level vs need).
 * READINESS answers "can I prove it?" (declared level discounted by evidence).
 * That gap is the product: it tells people what to verify and build next. */
const D = typeof require !== 'undefined' ? require('./data.js') : window.CareerData;

const STATUS = ['applied', 'viewed', 'shortlisted', 'interview', 'offer'];
const PROJECT_TYPES = ['project', 'open-source', 'hackathon', 'competition', 'freelance'];
const EXPERIENCE_TYPES = ['internship', 'freelance', 'leadership', 'hackathon', 'competition'];
const WEIGHTS = { skills: 0.35, projects: 0.2, assessments: 0.15, resume: 0.1, experience: 0.1, interview: 0.1 };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const clone = (o) => JSON.parse(JSON.stringify(o));

function blankUser() {
  return { name: '', stage: 'student', goal: 'ai', studying: '', interests: [], city: '', lookingFor: 'either',
    skills: {}, evidence: [], apps: [], interview: { best: 0, attempts: 0 }, reports: [], history: [], resumeFix: {} };
}

/* ---------- skills & evidence ---------- */
function careerReqs(careerId) {
  return D.CAREERS[careerId].skills.map(([name, need, w]) => ({ name, need, w }));
}
function projectBacked(user, skill) {
  return user.evidence.some((e) => e.type !== 'leadership' && e.skills.includes(skill));
}
function confidence(user, skill) {
  const s = user.skills[skill];
  if (!s) return 'None';
  const a = !!s.assessed, p = projectBacked(user, skill);
  return a && p ? 'High' : a || p ? 'Medium' : 'Low';
}
function strength(user, name, need, proven) {
  const s = user.skills[name];
  if (!s) return 0;
  let v = Math.min(s.level / need, 1);
  if (proven) v *= 0.6 + (s.assessed ? 0.25 : 0) + (projectBacked(user, name) ? 0.15 : 0);
  return v;
}
function coverage(user, reqs, proven) {
  let num = 0, den = 0;
  for (const r of reqs) { num += r.w * strength(user, r.name, r.need, proven); den += r.w; }
  return den ? num / den : 0;
}
function skillGaps(user, careerId) {
  return careerReqs(careerId)
    .map((r) => { const have = user.skills[r.name] ? user.skills[r.name].level : 0; return { ...r, have, gap: Math.max(0, r.need - have) }; })
    .filter((g) => g.gap > 0)
    .sort((a, b) => b.w * b.gap - a.w * a.gap);
}

/* ---------- resume completeness (used in readiness) ---------- */
function resumeChecklist(user) {
  const fix = user.resumeFix || {};
  return [
    ['summary', 'Add a career goal and what you study', !!(user.goal && user.studying)],
    ['skills', 'List at least 3 skills', Object.keys(user.skills).length >= 3],
    ['project', 'Add at least one project or experience', user.evidence.length >= 1],
    ['metrics', 'Give one project a measurable outcome', user.evidence.some((e) => /\d/.test(e.outcome || ''))],
    ['verified', 'Verify one skill with an assessment', Object.values(user.skills).some((s) => s.assessed)],
    ['city', 'Add your preferred location', !!user.city],
  ].map(([key, label, ok]) => ({ key, label, ok: ok || !!fix[key] }));
}

/* ---------- Career Readiness Score ---------- */
function readiness(user, careerId) {
  const reqs = careerReqs(careerId);
  const names = reqs.map((r) => r.name);
  const rel = user.evidence.filter((e) => PROJECT_TYPES.includes(e.type) && e.skills.some((s) => names.includes(s)));
  const totalW = reqs.reduce((a, r) => a + r.w, 0);
  const assessedW = reqs.filter((r) => user.skills[r.name] && user.skills[r.name].assessed).reduce((a, r) => a + r.w, 0);
  const expN = user.evidence.filter((e) => EXPERIENCE_TYPES.includes(e.type)).length;
  const checklist = resumeChecklist(user);
  const parts = {
    skills: Math.round(coverage(user, reqs, true) * 100),
    projects: Math.round(Math.min(1, rel.length / 3) * 80 + (rel.some((e) => /\d/.test(e.outcome || '')) ? 20 : 0)),
    assessments: Math.round((assessedW / totalW) * 100),
    resume: Math.round((checklist.filter((c) => c.ok).length / checklist.length) * 100),
    experience: Math.round(Math.min(1, expN / 2) * 100),
    interview: Math.round(user.interview ? user.interview.best : 0),
  };
  let total = 0;
  for (const k in WEIGHTS) total += WEIGHTS[k] * parts[k];
  return { total: Math.round(total), parts, gaps: skillGaps(user, careerId) };
}

/* ---------- Next Best Action: every action's impact is simulated, not guessed ---------- */
function nextActions(user, careerId) {
  const base = readiness(user, careerId).total;
  const gaps = skillGaps(user, careerId);
  const out = [];
  const add = (a, mutate) => {
    const u = clone(user); mutate(u);
    const delta = readiness(u, careerId).total - base;
    if (delta > 0) out.push({ ...a, delta });
  };
  const held = careerReqs(careerId).filter((r) => user.skills[r.name]).map((r) => r.name);
  gaps.slice(0, 2).forEach((g) => {
    const hrs = D.LEARN_HOURS[Math.min(2, g.gap - 1)];
    add({ kind: 'learn', skill: g.name, title: `Learn ${g.name} to ${D.LEVELS[g.need]} level`, why: `${g.name} is a ${g.w >= 3 ? 'core' : 'key'} skill for ${D.CAREERS[careerId].title} (about ${hrs} focused hours).`, href: '#/path' },
      (u) => { u.skills[g.name] = { level: g.need, assessed: false }; });
    add({ kind: 'project', skill: g.name, title: `Build a project that uses ${g.name}`, why: `Proof beats claims. Try: ${D.CAREERS[careerId].project}.`, href: `#/evidence?skills=${encodeURIComponent([g.name].concat(held.slice(0, 1)).join(','))}` },
      (u) => { if (!u.skills[g.name]) u.skills[g.name] = { level: g.need, assessed: false };
        u.evidence.push({ id: 'sim', type: 'project', title: 'sim', desc: '', skills: [g.name].concat(held.slice(0, 2)), outcome: '50+ users' }); });
  });
  const unverified = careerReqs(careerId).filter((r) => user.skills[r.name] && !user.skills[r.name].assessed && D.QUIZ[r.name]).sort((a, b) => b.w - a.w)[0];
  if (unverified) add({ kind: 'verify', skill: unverified.name, title: `Verify your ${unverified.name} skill`, why: 'A 3-question check turns a claim into verified evidence recruiters trust.', href: `#/quiz/${encodeURIComponent(unverified.name)}` },
    (u) => { u.skills[unverified.name].assessed = true; });
  if (!user.interview || user.interview.best < 70) add({ kind: 'interview', title: 'Practice a mock interview', why: 'Interview readiness is 10% of your score and most freshers skip it.', href: '#/interview' },
    (u) => { u.interview = { best: Math.max(70, (u.interview || {}).best || 0), attempts: 1 }; });
  const open = resumeChecklist(user).find((c) => !c.ok);
  if (open) add({ kind: 'resume', title: open.label, why: 'A complete profile is what recruiters and the matching engine read.', href: open.key === 'metrics' || open.key === 'project' ? '#/evidence' : '#/profile' },
    (u) => { u.resumeFix = Object.assign({}, u.resumeFix, { [open.key]: true }); });
  return out.sort((a, b) => b.delta - a.delta);
}

/* ---------- Fraud shield ---------- */
const FRAUD_RULES = [
  [/(registration|processing|training|kit|joining|security|application|placement)\s*(fee|fees|deposit|charges?)|refundable deposit|pay\s*(rs\.?|₹|inr)\s*[\d,]+/i, 50, 'Asks you to pay money. Real employers never charge to apply or to start a job.'],
  [/(100%|guaranteed|guarantee)\s*(job|placement|selection)|placement guarantee|no interview|selection guaranteed/i, 30, 'Promises a guaranteed job or skips the interview.'],
  [/whatsapp|telegram/i, 25, 'Recruiter wants to talk only on a chat app.'],
  [/limited seats|hurry|last chance|apply now or|immediate joining/i, 10, 'Uses pressure and urgency.'],
];
function assessFraudText({ text = '', contact = '', verified = true, pay = '' }) {
  const flags = [];
  let score = 0;
  const all = `${text} ${contact}`;
  for (const [re, pts, msg] of FRAUD_RULES) if (re.test(all)) { score += pts; flags.push(msg); }
  if (/@(gmail|yahoo|outlook|hotmail)\./i.test(contact) && !verified) { score += 20; flags.push('Uses a free email address instead of a company domain.'); }
  const lpa = /(\d{2,3})\s*lpa/i.exec(`${pay} ${text}`);
  if (lpa && +lpa[1] >= 30 && /no experience|fresher|trainee/i.test(text)) { score += 25; flags.push('Salary looks unrealistic for an entry-level role.'); }
  if (!verified) { score += 10; flags.push('Company is not verified.'); }
  return { score, risk: score >= 50 ? 'high' : score >= 25 ? 'medium' : 'low', flags };
}
function assessFraud(opp) {
  return assessFraudText({ text: `${opp.title}. ${opp.desc}`, contact: opp.contact, verified: opp.company.verified, pay: opp.pay });
}

/* ---------- Opportunity matching ---------- */
function related(a, b) {
  if (!a || !b) return 0.5;
  return a === b ? 1 : D.RELATED[`${a}|${b}`] || D.RELATED[`${b}|${a}`] || 0.1;
}
function matchOpp(user, opp) {
  const reqs = opp.skills.map(([name, need, must]) => ({ name, need, w: must ? 2 : 1 }));
  const fit = reqs.length ? coverage(user, reqs, false) : 0;
  const proven = reqs.length ? coverage(user, reqs, true) : 0;
  const goal = related(user.goal, opp.career);
  const loc = opp.remote || (user.city && opp.city === user.city) ? 1 : 0.3;
  const wantsIntern = user.lookingFor === 'internship', wantsJob = user.lookingFor === 'job';
  const isIntern = ['internship', 'apprenticeship'].includes(opp.type), isJob = ['job', 'campus'].includes(opp.type);
  const typeFit = user.lookingFor === 'either' || (wantsIntern && isIntern) || (wantsJob && isJob) ? 1 : !isIntern && !isJob ? 0.7 : 0.3;
  const score = reqs.length ? Math.round(100 * (0.55 * fit + 0.25 * goal + 0.12 * loc + 0.08 * typeFit)) : 0;
  const matched = [], partial = [], missing = [];
  for (const r of reqs) {
    const s = user.skills[r.name];
    (!s ? missing : s.level >= r.need ? matched : partial).push({ name: r.name, need: r.need, have: s ? s.level : 0, must: r.w === 2 });
  }
  const p = 0.5 * fit + 0.5 * proven;
  const prob = p >= 0.7 ? 'High' : p >= 0.45 ? 'Medium' : 'Low';
  const risk = assessFraud(opp).risk;
  const gapNames = missing.concat(partial).map((m) => m.name);
  const best = bestEvidenceFor(user, reqs.map((r) => r.name));
  let advice;
  if (risk === 'high') advice = 'Do not apply. This listing shows scam signals.';
  else if (prob === 'High') advice = `Apply now — you are a strong candidate${best ? `. Lead with "${best.title}".` : '.'}`;
  else if (fit >= 0.6) advice = `Apply anyway — your gaps are learnable${gapNames.length ? ` (${gapNames.slice(0, 2).join(', ')})` : ''}${best ? `. Lead with "${best.title}".` : '.'}`;
  else advice = `Build first: ${gapNames.slice(0, 2).join(' and ') || 'core skills'}. Then apply — you will convert far better.`;
  return { score, fit, proven, matched, partial, missing, prob, advice, risk };
}
function bestEvidenceFor(user, skillNames) {
  let best = null, n = 0;
  for (const e of user.evidence) { const c = e.skills.filter((s) => skillNames.includes(s)).length; if (c > n) { n = c; best = e; } }
  return best;
}
function rankOpps(user) {
  return D.OPPS.map((o) => ({ opp: o, m: matchOpp(user, o), fraud: assessFraud(o) })).sort((a, b) => b.m.score - a.m.score);
}

/* ---------- Application analytics ---------- */
function statusOf(app) { return app.history[app.history.length - 1]; }
function analytics(user) {
  const apps = user.apps, n = apps.length;
  const reached = (st) => apps.filter((a) => a.history.includes(st)).length;
  const responded = apps.filter((a) => a.history.length > 1).length;
  const funnel = { applied: n, viewed: reached('viewed'), shortlisted: reached('shortlisted'), interview: reached('interview'), offer: reached('offer') };
  const rate = (arr) => (arr.length ? arr.filter((a) => a.history.length > 1).length / arr.length : 0);
  const group = (fn) => {
    const g = {};
    apps.forEach((a) => { const o = D.OPPS.find((x) => x.id === a.oppId); if (o) (g[fn(o)] = g[fn(o)] || []).push(a); });
    return Object.entries(g).filter(([, v]) => v.length >= 3).map(([k, v]) => ({ key: k, n: v.length, rate: rate(v) })).sort((a, b) => b.rate - a.rate);
  };
  const byCareer = group((o) => o.career || 'other'), byType = group((o) => o.type);
  const insights = [];
  if (n === 0) insights.push('No applications yet. Start with roles above 70% match — they convert best.');
  else {
    insights.push(`You have applied to ${n} role${n > 1 ? 's' : ''}; ${Math.round((responded / n) * 100)}% got any response.`);
    if (byCareer.length) { const b = byCareer[0], t = D.CAREERS[b.key] ? D.CAREERS[b.key].title : 'Other'; insights.push(`Your strongest response rate is for ${t} roles (${Math.round(b.rate * 100)}% of ${b.n}).`); }
    const hi = apps.filter((a) => a.match >= 80), lo = apps.filter((a) => a.match < 80);
    if (hi.length >= 3 && lo.length >= 3) insights.push(`Roles at 80%+ match got ${Math.round(rate(hi) * 100)}% responses vs ${Math.round(rate(lo) * 100)}% below 80%.`);
    if (n >= 8 && responded / n < 0.2) insights.push('Response rate is low. Fewer, better-matched applications will beat volume.');
  }
  return { n, responded, rate: n ? responded / n : 0, funnel, byCareer, byType, insights };
}

/* ---------- Resume intelligence (resume vs job) ---------- */
function optimizeResume(user, opp) {
  const reqs = opp.skills.map(([name]) => name);
  const have = reqs.filter((r) => user.skills[r]);
  const gaps = reqs.filter((r) => !user.skills[r]);
  const weak = user.evidence.filter((e) => !/\d/.test(e.outcome || ''));
  const relevantFirst = user.evidence.filter((e) => e.skills.some((s) => reqs.includes(s)));
  const kw = reqs.length ? have.length / reqs.length : 0;
  const quant = user.evidence.length ? 1 - weak.length / user.evidence.length : 0;
  return { ats: Math.round(70 * kw + 30 * quant), include: have, gaps, weak, lead: relevantFirst.slice(0, 2) };
}

/* ---------- Experience Builder: turn raw activity into structured evidence ---------- */
const VERBS = { project: 'Built', 'open-source': 'Contributed to', hackathon: 'Competed in', competition: 'Competed in', freelance: 'Delivered', leadership: 'Led', internship: 'Worked on' };
function buildStatement(e) {
  const using = e.skills && e.skills.length ? ` using ${e.skills.join(', ')}` : '';
  const desc = e.desc ? ` — ${e.desc.replace(/[.\s]+$/, '')}` : '';
  const out = e.outcome ? `. Result: ${e.outcome}` : '';
  return `${VERBS[e.type] || 'Built'} ${e.title}${using}${desc}${out}.`.replace(/\.\.$/, '.');
}

/* ---------- Career simulator ---------- */
function simulate(careerId, startYear) {
  return D.CAREERS[careerId].path.map(([off, title, skills, exp, pay]) => ({ year: startYear + off, title, skills, exp, pay }));
}

/* ---------- Mock interview scoring (HEURISTIC: keyword/structure/clarity; LLM scoring is on the roadmap) ---------- */
function scoreAnswer(answer, keywords) {
  const text = (answer || '').toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const hits = keywords.filter((k) => text.includes(k)).length;
  const relevance = Math.min(1, hits / Math.max(3, Math.ceil(keywords.length / 2)));
  const markers = ['first', 'then', 'because', 'result', 'so that', 'for example', 'finally', 'situation', 'outcome'].filter((m) => text.includes(m)).length;
  const structure = Math.min(1, markers / 3);
  const clarity = words.length < 15 ? words.length / 15 : words.length > 220 ? 0.6 : 1;
  const specificity = /\d/.test(text) ? 1 : 0.4;
  const total = Math.round(10 * (0.4 * relevance + 0.25 * structure + 0.2 * clarity + 0.15 * specificity));
  return { total, relevance, structure, clarity, specificity };
}

/* ---------- Copilot: grounded answers computed from the graph, not free text ---------- */
function copilot(user, q, ctxOppId) {
  const t = (q || '').toLowerCase();
  const c = user.goal, ctx = ctxOppId ? D.OPPS.find((o) => o.id === ctxOppId) : null;
  const r = readiness(user, c), career = D.CAREERS[c];
  const L = (lines, links) => ({ lines, links: links || [] });
  if (ctx && /(chance|fit|apply|why|match|good|probab|prepare|missing|skill)/.test(t)) {
    const m = matchOpp(user, ctx);
    if (/prepare/.test(t)) return L([`To prepare for ${ctx.title}: ${m.missing.concat(m.partial).slice(0, 3).map((x) => x.name).join(', ') || 'revise your strongest project'}. Then rehearse 3 questions.`], [{ label: 'Mock interview', href: '#/interview' }]);
    if (/missing|skill/.test(t)) return L(m.missing.length + m.partial.length ? [`Gaps for this role: ${m.missing.concat(m.partial).map((x) => `${x.name} (need ${D.LEVELS[x.need]})`).join(', ')}.`] : ['You meet every listed skill requirement.']);
    if (/why/.test(t)) return L([`You are a ${m.score}% match. ${m.matched.length ? 'You cover ' + m.matched.map((x) => x.name).join(', ') + '.' : 'No requirement is fully met yet.'}`]);
    return L([`Match ${m.score}%. Shortlist probability: ${m.prob}.`, m.advice]);
  }
  if (/(next|what should i do|start|where)/.test(t)) {
    const a = nextActions(user, c)[0];
    return a ? L([`Your best next move: ${a.title}.`, `Estimated impact: +${a.delta}% career readiness. ${a.why}`], [{ label: 'Start', href: a.href }]) : L(['You have covered the main levers. Apply to your top matches.'], [{ label: 'Explore', href: '#/explore' }]);
  }
  if (/(ready|readiness|score)/.test(t)) {
    const p = Object.entries(r.parts).sort((a, b) => b[1] - a[1]);
    return L([`You are ${r.total}% ready for ${career.title}.`, `Strongest: ${p[0][0]} (${p[0][1]}). Weakest: ${p[p.length - 1][0]} (${p[p.length - 1][1]}).`], [{ label: 'See breakdown', href: '#/profile' }]);
  }
  if (/(miss|gap|lack|learn)/.test(t)) return L(r.gaps.length ? [`For ${career.title} you are still missing: ${r.gaps.slice(0, 4).map((g) => g.name).join(', ')}.`] : [`No skill gaps against the ${career.title} baseline.`], [{ label: 'Your learning path', href: '#/path' }]);
  if (/(resume|cv|ats)/.test(t)) { const open = resumeChecklist(user).filter((x) => !x.ok); return L([`Your profile is ${r.parts.resume}% complete.`].concat(open.slice(0, 2).map((x) => `To do: ${x.label}.`)), [{ label: 'Edit profile', href: '#/profile' }]); }
  if (/(interview|mock)/.test(t)) return L([user.interview.attempts ? `Your best mock interview score is ${user.interview.best}/100 over ${user.interview.attempts} attempt(s).` : 'You have not done a mock interview yet.'], [{ label: 'Practice now', href: '#/interview' }]);
  if (/(simulat|future|career look|years)/.test(t)) return L([`See how a ${career.title} path could unfold. These are estimates, not guarantees.`], [{ label: 'Open simulator', href: '#/sim' }]);
  if (/(application|response|rate|analytic)/.test(t)) return L(analytics(user).insights, [{ label: 'Applications', href: '#/apps' }]);
  if (/(scam|fee|fraud|safe|legit|pay)/.test(t)) return L(['Real employers don\'t charge you to apply for a job. Never pay registration, kit or security fees.', 'Paste any suspicious listing into the checker.'], [{ label: 'Open fraud checker', href: '#/safety' }]);
  if (/project/.test(t)) return L([`A strong ${career.title} project: ${career.project}.`], [{ label: 'Add to profile', href: '#/evidence' }]);
  if (/^(hi|hello|hey)/.test(t)) return L([`Hi ${user.name || 'there'}. You are ${r.total}% ready for ${career.title}. Ask me what to do next.`]);
  return L(['I can help with: your next best action, readiness, skill gaps, resume, interviews, application results or spotting scams.']);
}

/* ---------- Cohort tools (recruiter + college views). Cohort data is SYNTHETIC. ---------- */
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function makeCohort(n, seed) {
  const R = rng(seed), pick = (a) => a[Math.floor(R() * a.length)], ids = Object.keys(D.CAREERS), out = [];
  for (let i = 0; i < n; i++) {
    const q = Math.pow(R(), 1.4), goal = pick(ids), u = blankUser();
    u.name = `${pick(D.FIRST_NAMES)} ${pick(D.LAST_INITIALS)}.`; u.goal = goal; u.city = pick(D.CITIES); u.studying = 'B.Tech';
    u.lookingFor = pick(['internship', 'job', 'either']);
    for (const [name, need] of D.CAREERS[goal].skills) if (R() < 0.3 + 0.65 * q) u.skills[name] = { level: clamp(Math.round(1 + q * 3.2 * (0.6 + R() * 0.8)), 1, 5), assessed: R() < q * 0.55 };
    const extra = pick(D.SKILLS); if (R() < 0.6 && !u.skills[extra]) u.skills[extra] = { level: 2, assessed: false };
    const held = Object.keys(u.skills), ev = Math.floor(q * 3.2 + R() * 0.8);
    for (let k = 0; k < ev && held.length; k++) u.evidence.push({ id: `c${i}-${k}`, type: pick(['project', 'project', 'hackathon', 'internship']), title: 'Project', desc: '', skills: held.slice(0, 1 + Math.floor(R() * 3)), outcome: R() < q ? '100+ users' : '' });
    u.interview = { best: R() < q ? Math.round(35 + q * 55) : 0, attempts: 1 };
    u.id = `s${i}`;
    out.push(u);
  }
  return out;
}
function cohortStats(cohort) {
  const s = { total: cohort.length, complete: 0, placementReady: 0, internshipReady: 0, intervene: 0, gaps: {} };
  for (const u of cohort) {
    const r = readiness(u, u.goal).total;
    if (Object.keys(u.skills).length >= 3 && u.evidence.length >= 1 && u.city) s.complete++;
    if (r >= 60) s.placementReady++;
    if (r >= 40) s.internshipReady++;
    if (r < 25 || u.evidence.length === 0) s.intervene++;
    skillGaps(u, u.goal).forEach((g) => { s.gaps[g.name] = (s.gaps[g.name] || 0) + 1; });
  }
  s.topGaps = Object.entries(s.gaps).sort((a, b) => b[1] - a[1]).slice(0, 5);
  return s;
}
function parseTalentQuery(q) {
  const t = (q || '').toLowerCase();
  const skills = D.SKILLS.filter((s) => new RegExp(`(^|[^a-z])${s.toLowerCase().replace(/[+.]/g, '\\$&')}($|[^a-z])`).test(t));
  const city = D.CITIES.find((c) => t.includes(c.toLowerCase().split(' ')[0]));
  const intent = /(analytics|analyst|data analy)/.test(t) ? 'data' : /(\bai\b|\bml\b|machine learning)/.test(t) ? 'ai' : /frontend|front-end/.test(t) ? 'frontend' : /backend|software/.test(t) ? 'backend' : /design|\bux\b/.test(t) ? 'ux' : null;
  return { skills, city, intent };
}
function talentSearch(cohort, q) {
  const f = parseTalentQuery(q);
  const res = cohort.filter((u) => f.skills.every((s) => u.skills[s]) && (!f.city || u.city === f.city) && (!f.intent || u.goal === f.intent))
    .map((u) => ({ u, score: f.skills.length ? Math.round(100 * f.skills.reduce((a, s) => a + strength(u, s, 3, true), 0) / f.skills.length) : readiness(u, u.goal).total }))
    .sort((a, b) => b.score - a.score);
  return { filters: f, results: res };
}

/* ---------- Demo persona from the product brief ---------- */
function demoUser() {
  const u = blankUser();
  Object.assign(u, { name: 'Rahul', stage: 'builder', goal: 'ai', studying: 'B.Tech Computer Science', city: 'Hyderabad', lookingFor: 'internship', interests: ['AI / chatbots', 'Dashboards', 'Web apps'] });
  u.skills = { Python: { level: 3, assessed: true }, Java: { level: 3, assessed: false }, SQL: { level: 3, assessed: false }, React: { level: 3, assessed: false }, JavaScript: { level: 3, assessed: false }, Git: { level: 2, assessed: false } };
  u.evidence = [
    { id: 'd1', type: 'project', title: 'AI Chatbot', desc: 'answers admission FAQs for a college', skills: ['Python', 'NLP', 'APIs'], outcome: '200+ test users' },
    { id: 'd2', type: 'project', title: 'E-commerce application', desc: 'cart, checkout and admin panel', skills: ['React', 'JavaScript', 'SQL'], outcome: '' },
    { id: 'd3', type: 'project', title: 'Data analytics dashboard', desc: 'tracks campus event attendance', skills: ['SQL', 'Python'], outcome: '' },
  ];
  u.evidence.forEach((e) => { e.statement = buildStatement(e); });
  ['NLP', 'APIs'].forEach((s) => { if (!u.skills[s]) u.skills[s] = { level: s === 'NLP' ? 2 : 2, assessed: false }; });
  const seq = [['o3', ['applied', 'viewed', 'shortlisted', 'interview']], ['o18', ['applied', 'viewed']], ['o4', ['applied', 'viewed', 'shortlisted']], ['o10', ['applied']], ['o2', ['applied', 'viewed', 'shortlisted']], ['o1', ['applied', 'viewed', 'rejected']], ['o5', ['applied']], ['o6', ['applied', 'viewed', 'rejected']], ['o7', ['applied']], ['o11', ['applied', 'viewed']], ['o16', ['applied']], ['o17', ['applied']]];
  u.apps = seq.map(([oppId, history], i) => ({ oppId, history, at: `2026-0${6 + (i % 4)}-1${i % 9}`, match: matchOpp(u, D.OPPS.find((o) => o.id === oppId)).score }));
  u.interview = { best: 0, attempts: 0 };
  u.history = [{ d: '2026-09-07', score: Math.max(0, readiness(u, 'ai').total - 8) }];
  return u;
}

const CareerEngine = { STATUS, PROJECT_TYPES, EXPERIENCE_TYPES, WEIGHTS, blankUser, careerReqs, confidence, projectBacked, skillGaps, resumeChecklist, readiness, nextActions,
  assessFraud, assessFraudText, matchOpp, rankOpps, statusOf, analytics, optimizeResume, buildStatement, simulate, scoreAnswer, copilot, makeCohort, cohortStats, parseTalentQuery, talentSearch, demoUser, clone };
if (typeof module !== 'undefined' && module.exports) module.exports = CareerEngine; else window.CareerEngine = CareerEngine;
