/* Pathwise — UI. Vanilla JS, hash router, no build step. All user text goes through esc(). */
(() => {
  const D = CareerData, E = CareerEngine;
  const KEY = 'pathwise.v1';
  const root = document.getElementById('root');
  let U = null, toastT, cohort = null;
  const view = { ex: { type: 'all', q: '' }, ob: null, chat: [], quiz: null, iv: null, rec: { opp: 'o3', q: 'Find students in Hyderabad who know Python + SQL and are interested in Data Analytics' }, pathC: null, simC: null };

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const today = () => new Date().toISOString().slice(0, 10);
  const careerName = (id) => (D.CAREERS[id] ? D.CAREERS[id].title : 'Open');

  function load() {
    try { const s = localStorage.getItem(KEY); if (s) U = Object.assign(E.blankUser(), JSON.parse(s)); } catch (e) { /* storage blocked: run in memory */ }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(U)); } catch (e) { /* ignore */ } }
  function toast(msg) {
    clearTimeout(toastT);
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; toastT = setTimeout(() => t.remove(), 2600);
  }

  /* ---------- small components ---------- */
  const ring = (v, s = 96) => { const r = 40, c = 2 * Math.PI * r; return `<div class="ring" style="--s:${s}px" role="img" aria-label="${v} percent"><svg viewBox="0 0 100 100"><circle class="t" cx="50" cy="50" r="${r}"/><circle class="p" cx="50" cy="50" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - v / 100)}"/></svg><b>${v}%</b></div>`; };
  const bar = (v, cls = '') => `<div class="bar ${cls}" role="img" aria-label="${v} percent"><i style="width:${v}%"></i></div>`;
  const pill = (t, c = '') => `<span class="pill ${c}">${esc(t)}</span>`;
  const verifiedBadge = (v) => (v ? pill('✓ Verified company', 'ok') : pill('Unverified', 'warn'));
  const icons = {
    home: '<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>', explore: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    apps: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/>', copilot: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
    profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
  };
  function shell(cur, html) {
    const tabs = [['home', 'Home', '#/home'], ['explore', 'Explore', '#/explore'], ['apps', 'Applications', '#/apps'], ['copilot', 'Copilot', '#/copilot'], ['profile', 'Profile', '#/profile']];
    return `<main class="app">${html}</main><nav class="bottom" aria-label="Main"><div class="in">${tabs.map(([k, l, h]) => `<a href="${h}" class="${k === cur ? 'on' : ''}" ${k === cur ? 'aria-current="page"' : ''}><svg viewBox="0 0 24 24">${icons[k]}</svg>${l}</a>`).join('')}</div></nav>`;
  }
  const back = (href, label = 'Back') => `<a href="${href}" class="small muted" style="display:inline-block;margin-bottom:10px">← ${label}</a>`;
  const scamLine = '<div class="banner ok small"><b>Real employers don\'t charge you to apply for a job.</b> Never pay registration, kit or security fees. <a href="#/safety">Learn how we check</a></div>';

  /* ---------- Landing ---------- */
  function landing() {
    return `<header class="topbar"><a class="logo" href="#/"><i></i>Pathwise</a><div class="row"><a class="small" href="#/recruiter">Recruiters</a><a class="small" href="#/college">Colleges</a></div></header>
    <section class="hero"><p class="eyebrow" style="margin-bottom:14px">The Career OS</p><h1>Your next career move, figured out.</h1>
      <p class="lead">Discover what you're good at, what you should learn, and the opportunities where you can actually get hired.</p>
      <div class="cta"><button class="btn primary" data-act="start">Build My Career Profile</button><a class="btn" href="#/explore-public">Explore Opportunities</a></div>
      <p class="small muted" style="margin-top:14px">Free for students · no resume needed to start · <a href="#" data-act="demo">try it as a demo student (Rahul)</a></p></section>
    <section class="block"><h2 style="text-align:center;margin-bottom:12px">Where are you in your journey?</h2>
      <div class="journey">${D.STAGES.map(([k, l, d]) => `<button data-act="start" data-stage="${k}"><b>${l}</b><span>${d}</span></button>`).join('')}</div></section>
    <section class="block"><div class="grid g3">
      ${[['A living career profile', 'Not a resume. A graph of your skills, projects and results that updates as you grow.'], ['Match ≠ Readiness', 'We tell you if you fit a role, and whether you can prove it. The gap is your to-do list.'], ['Your next best action', 'Every action\'s impact on your readiness is calculated, so you always know what moves the needle.'], ['Verified skills', 'Quick assessments and project evidence turn claims into proof recruiters trust.'], ['Fraud shield', 'Fee requests, fake recruiters and guaranteed-job promises are flagged before you waste a day.'], ['Honest analytics', 'See which roles actually respond to you, and stop applying blindly.']].map(([t, d]) => `<div class="card"><h3>${t}</h3><p class="muted small" style="margin-top:6px">${d}</p></div>`).join('')}</div></section>
    <section class="block">${scamLine}</section>
    <section class="block"><div class="grid g2"><a class="card tap" href="#/recruiter"><p class="eyebrow">For recruiters</p><h3>Who is actually qualified?</h3><p class="muted small">Ranked, explained candidates instead of 400 resumes.</p></a><a class="card tap" href="#/college"><p class="eyebrow">For colleges</p><h3>Know your placement readiness</h3><p class="muted small">Cohort analytics and where to intervene.</p></a></div></section>
    <footer>Pathwise prototype · sample data only · salary and path figures are illustrative estimates</footer>`;
  }

  /* ---------- Onboarding (conversational, one question at a time) ---------- */
  const STUDY = ['B.Tech / BE — CS or IT', 'B.Tech / BE — other', 'BCA / BSc', 'MCA / MSc', 'MBA', 'Diploma', 'Self-taught', 'Working professional'];
  const BUILD = ['Web apps', 'AI / chatbots', 'Dashboards', 'Mobile apps', 'Games', 'Designs', 'Automations', 'Research'];
  const OB_STEPS = ['goal', 'study', 'build', 'skills', 'work', 'city', 'looking', 'name'];
  function onboarding() {
    const o = view.ob, step = OB_STEPS[o.step];
    const dots = `<div class="dots" aria-hidden="true">${OB_STEPS.map((_, i) => `<i class="${i <= o.step ? 'on' : ''}"></i>`).join('')}</div>`;
    const sel = (list, key, multi) => `<div class="chips">${list.map((x) => `<button class="chip ${multi ? ((o[key] || []).includes(x) ? 'on' : '') : o[key] === x ? 'on' : ''}" data-act="ob-set" data-k="${key}" data-v="${esc(x)}" data-multi="${multi ? 1 : 0}">${esc(x)}</button>`).join('')}</div>`;
    let q = '', body = '', can = true;
    if (step === 'goal') {
      q = 'What are you trying to become?';
      body = `<div>${Object.entries(D.CAREERS).map(([id, c]) => `<button class="card tap opt" data-act="ob-goal" data-v="${id}"><b>${c.title}</b><br><span class="muted small">${c.blurb}</span></button>`).join('')}<button class="card tap opt" data-act="ob-goal" data-v="?"><b>I'm not sure yet</b><br><span class="muted small">Answer one question and we'll suggest a direction</span></button></div>`; can = null;
    } else if (step === 'work') {
      q = 'Which kind of work sounds most like you?';
      body = `<div>${Object.entries(D.CAREERS).map(([id, c]) => `<button class="card tap opt" data-act="ob-goal" data-v="${id}"><b>${c.enjoy}</b></button>`).join('')}</div>`; can = null;
    } else if (step === 'study') { q = 'What are you studying?'; body = sel(STUDY, 'studying', false); can = !!o.studying; }
    else if (step === 'build') { q = 'What do you enjoy building?'; body = `<p class="muted small" style="margin-bottom:10px">Pick any</p>${sel(BUILD, 'interests', true)}`; }
    else if (step === 'skills') {
      const sug = (o.goal ? D.CAREERS[o.goal].skills.map((s) => s[0]) : []).concat(D.SKILLS.filter((s) => !(o.goal && D.CAREERS[o.goal].skills.some((x) => x[0] === s))));
      q = 'What skills do you already have?'; body = `<p class="muted small" style="margin-bottom:10px">Be honest — you'll be able to verify these later. You can skip this.</p>${sel(sug, 'skillList', true)}`;
    } else if (step === 'city') { q = 'Where do you want to work?'; body = sel(D.CITIES.concat(['Anywhere (remote)']), 'city', false); can = !!o.city; }
    else if (step === 'looking') { q = 'Are you looking for an internship or your first job?'; body = `<div class="chips">${[['internship', 'Internship'], ['job', 'First job'], ['either', 'Open to both']].map(([k, l]) => `<button class="chip ${o.lookingFor === k ? 'on' : ''}" data-act="ob-set" data-k="lookingFor" data-v="${k}" data-multi="0">${l}</button>`).join('')}</div>`; can = !!o.lookingFor; }
    else { q = 'Last thing — what should we call you?'; body = `<form data-form="ob-finish" class="stack"><input name="name" placeholder="Your first name" maxlength="40" autocomplete="given-name" required value="${esc(o.name || '')}" aria-label="Your first name"><button class="btn primary block" type="submit">Build my career profile</button></form>`; can = null; }
    const next = can === null ? '' : `<button class="btn primary block" data-act="ob-next" ${can ? '' : 'disabled'} style="margin-top:20px">Continue</button>`;
    return `<div class="ob"><div class="row between" style="margin-bottom:14px"><a href="#/" class="small muted">← Exit</a>${o.step > 0 ? '<button class="small chip" data-act="ob-back">Back</button>' : ''}</div>${dots}<div class="body"><h1>${q}</h1><div style="margin-top:16px">${body}${next}</div></div></div>`;
  }
  function startOb(stage) { view.ob = { step: 0, goal: null, studying: '', interests: [], skillList: [], city: '', lookingFor: '', name: '', stage: stage || 'student' }; location.hash = '#/onboard'; }
  function obFinish(name) {
    const o = view.ob, u = E.blankUser();
    Object.assign(u, { name: name.trim(), stage: o.stage, goal: o.goal || 'ai', studying: o.studying, interests: o.interests, city: o.city === 'Anywhere (remote)' ? '' : o.city, lookingFor: o.lookingFor || 'either' });
    o.skillList.forEach((s) => { u.skills[s] = { level: 3, assessed: false }; });
    u.history = [{ d: today(), score: E.readiness(u, u.goal).total }];
    U = u; save(); view.chat = []; location.hash = '#/home';
  }

  /* ---------- Home ---------- */
  const greet = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; };
  function snapshot() {
    const r = E.readiness(U, U.goal).total;
    if (!U.history.length || U.history[U.history.length - 1].d !== today()) { U.history.push({ d: today(), score: r }); U.history = U.history.slice(-60); save(); }
    return r;
  }
  function home() {
    const r = E.readiness(U, U.goal), total = snapshot();
    const base = U.history.find((h) => (Date.now() - new Date(h.d)) / 864e5 <= 35) || U.history[0];
    const delta = total - base.score;
    const acts = E.nextActions(U, U.goal), best = acts[0];
    const ranked = E.rankOpps(U).filter((x) => x.fraud.risk !== 'high' && x.m.score >= 50);
    const count = (f) => ranked.filter((x) => f(x.opp)).length;
    const gaps = r.gaps.slice(0, 3).map((g) => g.name);
    const line = total >= 60 ? 'You are closer to your first offer than you think. Apply to your top matches.' : gaps.length ? `You are closer to your first ${careerName(U.goal)} role than you think. Close ${gaps[0]} first.` : 'Keep building evidence — your profile is strong.';
    return shell('home', `<div class="stack">
      <div><p class="muted">${greet()}, ${esc(U.name)}.</p><h2>Here's what matters today.</h2></div>
      <div class="card"><p class="eyebrow">Your career readiness</p><div class="row" style="margin-top:10px;gap:16px">${ring(total, 96)}<div class="grow"><h3>${careerName(U.goal)}</h3><p class="small ${delta >= 0 ? 'ok-t' : 'bad-t'}">${U.history.length < 2 || base === U.history[U.history.length - 1] ? 'Day 1 — this is your baseline' : (delta >= 0 ? '↑ ' : '↓ ') + Math.abs(delta) + '% this month'}</p><a class="small" href="#/profile">See breakdown →</a></div></div></div>
      ${best ? `<div class="card" style="border-color:var(--brand)"><p class="eyebrow">Your next best action</p><h3 style="margin:6px 0 4px">${esc(best.title)}</h3><p class="muted small">${esc(best.why)}</p><div class="row between" style="margin-top:12px"><span class="pill ok">Estimated impact +${best.delta}% readiness</span><a class="btn primary" href="${best.href}">Start</a></div></div>` : ''}
      <div class="card"><p class="eyebrow">Opportunities for you</p><div class="row" style="margin-top:10px;gap:20px"><a href="#/explore" data-set-type="job"><div class="kpi">${count((o) => ['job', 'campus'].includes(o.type))}</div><span class="small muted">jobs</span></a><a href="#/explore" data-set-type="internship"><div class="kpi">${count((o) => ['internship', 'apprenticeship'].includes(o.type))}</div><span class="small muted">internships</span></a><a href="#/explore" data-set-type="project"><div class="kpi">${count((o) => ['project', 'freelance'].includes(o.type))}</div><span class="small muted">projects</span></a><a href="#/explore" data-set-type="hackathon"><div class="kpi">${count((o) => ['hackathon', 'competition'].includes(o.type))}</div><span class="small muted">hackathons</span></a></div></div>
      <a class="card tap" href="#/copilot"><p class="eyebrow">Career Copilot</p><p style="margin-top:6px">“${esc(line)}”</p></a>
      <div class="grid g2" style="gap:10px"><a class="card tap" href="#/path"><b>Your path</b><br><span class="small muted">Learn → build → verify → apply</span></a><a class="card tap" href="#/sim"><b>Career simulator</b><br><span class="small muted">What could 2030 look like?</span></a><a class="card tap" href="#/interview"><b>Mock interview</b><br><span class="small muted">Practice with instant feedback</span></a><a class="card tap" href="#/safety"><b>Fraud shield</b><br><span class="small muted">Check any listing</span></a></div>
      ${scamLine}</div>`);
  }

  /* ---------- Explore ---------- */
  const TYPES = [['all', 'All'], ['job', 'Jobs'], ['internship', 'Internships'], ['project', 'Projects'], ['hackathon', 'Hackathons'], ['freelance', 'Freelance'], ['apprenticeship', 'Apprenticeships'], ['campus', 'Campus']];
  const typeLabel = { job: 'Job', internship: 'Internship', apprenticeship: 'Apprenticeship', freelance: 'Freelance', project: 'Project', hackathon: 'Hackathon', competition: 'Competition', campus: 'Campus drive' };
  function applied(oppId) { return U.apps.find((a) => a.oppId === oppId); }
  function jobCard(x) {
    const { opp: o, m, fraud } = x, bad = fraud.risk === 'high', a = applied(o.id);
    const cta = o.type === 'hackathon' || o.type === 'competition' ? 'Register' : o.type === 'project' ? 'Join' : 'Apply';
    return `<article class="card job stack" style="${bad ? 'border-color:var(--bad)' : ''}">
      <div class="row between" style="align-items:flex-start"><div><span class="tiny muted">${typeLabel[o.type]}</span><h3>${esc(o.title)}</h3><p class="small muted">${esc(o.company.name)} · ${esc(o.city)}${o.remote && o.city !== 'Remote' ? ' / Remote' : ''}</p><p class="small"><b>${esc(o.pay)}</b></p></div>${bad ? '' : `<div style="text-align:center">${ring(m.score, 58)}<div class="tiny muted">AI match</div></div>`}</div>
      ${bad ? `<div class="banner bad small"><b>Flagged by fraud shield.</b> ${fraud.flags.slice(0, 2).map(esc).join(' ')}</div>` :
        `<ul class="plain small why">${m.matched.slice(0, 4).map((s) => `<li class="ok-t">✓ ${esc(s.name)}</li>`).join('')}${m.partial.concat(m.missing).slice(0, 2).map((s) => `<li class="warn-t">△ ${esc(s.name)} <span class="muted">(${s.have ? 'level up' : 'missing'})</span></li>`).join('')}</ul>`}
      <div class="row wrap">${bad ? `<a class="btn" href="#/job/${o.id}">Why flagged?</a>` : a ? `<span class="pill ok">${esc(E.statusOf(a))}</span><a class="btn" href="#/job/${o.id}">Details</a>` : `<button class="btn primary" data-act="apply" data-id="${o.id}">${cta}</button><a class="btn" href="#/job/${o.id}">Why this?</a>`}</div></article>`;
  }
  function exploreList() {
    const t = view.ex.type, q = view.ex.q.trim().toLowerCase();
    const items = E.rankOpps(U).filter((x) => (t === 'all' || x.opp.type === t || (t === 'hackathon' && x.opp.type === 'competition')) && (!q || `${x.opp.title} ${x.opp.company.name} ${x.opp.skills.map((s) => s[0]).join(' ')}`.toLowerCase().includes(q)));
    const ok = items.filter((x) => x.fraud.risk !== 'high'), bad = items.filter((x) => x.fraud.risk === 'high');
    return (ok.length ? ok.map(jobCard).join('') : '<p class="muted">Nothing matches. Try another filter.</p>') + (bad.length ? `<h3 style="margin-top:8px">Flagged listings (${bad.length})</h3>${bad.map(jobCard).join('')}` : '');
  }
  function explore() {
    return shell('explore', `<div class="stack"><div><h2>Explore</h2><p class="muted small">Jobs, internships, projects and hackathons — all ranked against your career graph.</p></div>
      <input type="search" id="q" placeholder="Search roles, companies, skills" value="${esc(view.ex.q)}" aria-label="Search">
      <div class="scroll" role="tablist">${TYPES.map(([k, l]) => `<button class="chip ${view.ex.type === k ? 'on' : ''}" data-act="ex-type" data-v="${k}">${l}</button>`).join('')}</div>
      ${scamLine}<div id="list" class="stack">${exploreList()}</div></div>`);
  }
  function explorePublic() { U = U || E.demoUser(); toast('Showing sample matches for a demo student'); location.hash = '#/explore'; return ''; }

  /* ---------- Job detail ---------- */
  function jobPage(id) {
    const o = D.OPPS.find((x) => x.id === id); if (!o) return shell('explore', '<p>Not found. <a href="#/explore">Back</a></p>');
    const m = E.matchOpp(U, o), f = E.assessFraud(o), a = applied(o.id), bad = f.risk === 'high';
    const rr = E.optimizeResume(U, o);
    const trust = [[o.company.verified, 'Company verified'], [o.company.verified, 'Recruiter verified'], [!bad, 'Listing passed fraud checks'], [o.company.hiring.startsWith('Active') || o.company.verified, o.company.hiring]];
    return shell('explore', `<div class="stack">${back('#/explore', 'Explore')}
      <div><span class="tiny muted">${typeLabel[o.type]}</span><h2>${esc(o.title)}</h2><p class="muted">${esc(o.company.name)} · ${esc(o.city)}${o.remote ? ' · Remote OK' : ''}</p><p><b>${esc(o.pay)}</b></p></div>
      ${bad ? `<div class="banner bad"><b>Do not apply.</b> This listing shows scam signals:<ul>${f.flags.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>Real employers don't charge you to apply for a job.</div>` :
        `<div class="card"><div class="row" style="gap:16px">${ring(m.score, 84)}<div><h3>${m.score}% AI match</h3><p class="small muted">Shortlist probability: <b>${m.prob}</b></p></div></div>
        <p style="margin-top:12px"><b>Recommendation:</b> ${esc(m.advice)}</p>
        <ul class="plain small" style="margin-top:10px">${m.matched.map((s) => `<li class="ok-t">✓ ${esc(s.name)} <span class="muted">(${D.LEVELS[s.have]} — needs ${D.LEVELS[s.need]})</span></li>`).join('')}${m.partial.map((s) => `<li class="warn-t">△ ${esc(s.name)} <span class="muted">(you: ${D.LEVELS[s.have]}, need: ${D.LEVELS[s.need]})</span></li>`).join('')}${m.missing.map((s) => `<li class="bad-t">✗ ${esc(s.name)} <span class="muted">(${s.must ? 'must-have' : 'nice to have'})</span></li>`).join('')}</ul></div>`}
      <p>${esc(o.desc)}</p>
      <div class="card"><p class="eyebrow">Trust</p><ul class="plain small" style="margin-top:6px">${trust.map(([ok, l]) => `<li class="${ok ? 'ok-t' : 'warn-t'}">${ok ? '✓' : '△'} ${esc(l)}</li>`).join('')}</ul></div>
      ${bad ? '' : `<div class="row">${a ? `<span class="pill ok">You applied · ${esc(E.statusOf(a))}</span>` : `<button class="btn primary grow" data-act="apply" data-id="${o.id}">Apply</button>`}</div>
      <details class="card"><summary><b>Optimize my resume for this job</b></summary><div class="stack small" style="margin-top:10px"><p>ATS keyword fit: <b>${rr.ats}/100</b></p>
        ${rr.include.length ? `<p><b>Surface these skills:</b> ${rr.include.map(esc).join(', ')}</p>` : ''}
        ${rr.lead.length ? `<p><b>Lead with:</b> ${rr.lead.map((e) => esc(e.title)).join('; ')}</p>` : ''}
        ${rr.weak.length ? `<p class="warn-t"><b>Add a measurable result to:</b> ${rr.weak.map((e) => esc(e.title)).join(', ')}</p>` : ''}
        ${rr.gaps.length ? `<p class="muted">Don't list ${rr.gaps.map(esc).join(', ')} until you can show it. Build or verify it first.</p>` : ''}</div></details>`}
      <div class="card"><p class="eyebrow">Ask Career Copilot</p><div class="chips" style="margin-top:8px">${['What are my chances?', 'Why am I a good fit?', 'What skills am I missing?', 'Should I apply?', 'How should I prepare?'].map((q) => `<button class="chip" data-act="job-ask" data-q="${q}" data-id="${o.id}">${q}</button>`).join('')}</div><div id="jobchat" class="stack small" style="margin-top:10px" aria-live="polite"></div></div>
      <div class="row"><button class="btn danger" data-act="report" data-id="${o.id}" data-what="job">Report job</button><button class="btn danger" data-act="report" data-id="${o.id}" data-what="recruiter">Report recruiter</button><button class="btn danger" data-act="report" data-id="${o.id}" data-what="company">Report company</button></div></div>`);
  }
  const answerHtml = (r) => r.lines.map((l) => `<p>${esc(l)}</p>`).join('') + (r.links.length ? `<p>${r.links.map((l) => `<a class="btn" href="${l.href}">${esc(l.label)}</a>`).join(' ')}</p>` : '');

  /* ---------- Applications ---------- */
  function apps() {
    const a = E.analytics(U), nextOf = (s) => E.STATUS[E.STATUS.indexOf(s) + 1];
    const fun = [['Applied', a.funnel.applied], ['Viewed', a.funnel.viewed], ['Shortlisted', a.funnel.shortlisted], ['Interview', a.funnel.interview], ['Offer', a.funnel.offer]];
    return shell('apps', `<div class="stack"><h2>Applications</h2>
      <div class="card"><p class="eyebrow">Career analytics</p><ul class="plain" style="margin-top:8px">${a.insights.map((i) => `<li>• ${esc(i)}</li>`).join('')}</ul>
      ${a.n ? `<div class="stack small" style="margin-top:12px">${fun.map(([l, v]) => `<div><div class="row between"><span>${l}</span><b>${v}</b></div>${bar(a.n ? Math.round((v / a.n) * 100) : 0)}</div>`).join('')}</div>` : ''}</div>
      ${U.apps.length ? '' : '<a class="btn primary" href="#/explore">Find opportunities</a>'}
      ${U.apps.map((ap, i) => { const o = D.OPPS.find((x) => x.id === ap.oppId); if (!o) return ''; const s = E.statusOf(ap), final = s === 'offer' || s === 'rejected';
        return `<div class="card"><div class="row between"><div><a href="#/job/${o.id}"><b>${esc(o.title)}</b></a><p class="small muted">${esc(o.company.name)} · ${ap.match}% match at apply time</p></div>${pill(s, s === 'offer' ? 'ok' : s === 'rejected' ? 'bad' : '')}</div>
        <div class="row small muted" style="margin-top:8px;gap:4px;flex-wrap:wrap">${ap.history.map((h) => `<span>${h}</span>`).join(' → ')}</div>
        ${final ? '' : `<div class="row" style="margin-top:10px"><button class="btn" data-act="advance" data-i="${i}">Simulate: ${nextOf(s)}</button><button class="btn" data-act="reject" data-i="${i}">Simulate: rejected</button></div>`}</div>`; }).join('')}
      <p class="tiny muted">Status buttons simulate employer updates in this prototype. In production, statuses sync from recruiters' ATS actions.</p></div>`);
  }

  /* ---------- Copilot ---------- */
  function copilotView() {
    if (!view.chat.length) { const a = E.nextActions(U, U.goal)[0], r = E.readiness(U, U.goal).total; view.chat.push({ me: false, r: { lines: [`Hi ${U.name}. You are ${r}% ready for ${careerName(U.goal)}.`].concat(a ? [`Best next move: ${a.title} (+${a.delta}% readiness).`] : []), links: a ? [{ label: 'Start', href: a.href }] : [] } }); }
    return shell('copilot', `<div class="stack"><h2>Career Copilot</h2><p class="muted small">Answers come from your career graph, not generic advice.</p>
      <div class="chat" id="chat" aria-live="polite">${view.chat.map((c) => (c.me ? `<div class="chatbub me">${esc(c.t)}</div>` : `<div class="chatbub bot stack small">${answerHtml(c.r)}</div>`)).join('')}</div>
      <div class="scroll">${['What should I do next?', 'How ready am I?', 'What skills am I missing?', 'How are my applications doing?', 'Is this a scam?', 'Suggest a project'].map((q) => `<button class="chip" data-act="ask" data-q="${q}">${q}</button>`).join('')}</div>
      <form data-form="ask" class="row"><input name="q" placeholder="Ask anything about your career" autocomplete="off" aria-label="Ask Career Copilot"><button class="btn primary">Send</button></form></div>`);
  }

  /* ---------- Profile ---------- */
  function profile() {
    const r = E.readiness(U, U.goal), cl = E.resumeChecklist(U);
    const sk = Object.entries(U.skills);
    const trust = [[Object.values(U.skills).some((s) => s.assessed), 'Verified skills', 'Take a 3-question check'], [U.evidence.length > 0, 'Projects & experience added', 'Add evidence'], [false, 'Verified identity', 'Coming soon: DigiLocker / Aadhaar-based check'], [false, 'Verified education', 'Coming soon: college & degree verification']];
    return shell('profile', `<div class="stack">
      <div class="row between"><div><h2>${esc(U.name)}</h2><p class="muted small">${esc(U.studying || 'Student')} · ${esc(U.city || 'Open to remote')} · ${U.lookingFor === 'either' ? 'Open to internship or job' : U.lookingFor === 'job' ? 'Looking for first job' : 'Looking for internship'}</p></div></div>
      <div><label for="goal">Target career</label><select id="goal" data-change="goal">${Object.entries(D.CAREERS).map(([k, c]) => `<option value="${k}" ${U.goal === k ? 'selected' : ''}>${c.title}</option>`).join('')}</select></div>
      <div class="card"><p class="eyebrow">Career readiness</p><div class="row" style="gap:16px;margin:10px 0">${ring(r.total, 88)}<p class="small muted">Readiness counts what you can <b>prove</b>. Your match for roles counts what you claim. Close the gap with projects and verification.</p></div>
        <div class="stack small">${Object.entries(r.parts).map(([k, v]) => `<div><div class="row between"><span style="text-transform:capitalize">${k}</span><b>${v}</b></div>${bar(v, v >= 70 ? 'ok' : v < 35 ? 'warn' : '')}</div>`).join('')}</div></div>
      <div class="card"><div class="row between"><h3>Skills</h3><span class="tiny muted">Tap level to change</span></div><div class="stack" style="margin-top:8px">
        ${sk.length ? sk.map(([n, s]) => { const c = E.confidence(U, n); return `<div class="row between wrap"><div><b>${esc(n)}</b> <button class="chip" style="min-height:30px;padding:2px 10px" data-act="level" data-s="${esc(n)}" aria-label="Change ${esc(n)} level">${D.LEVELS[s.level]}</button></div><div class="row">${pill(c + ' confidence', c === 'High' ? 'ok' : c === 'Medium' ? '' : 'warn')}${s.assessed ? pill('✓ Assessed', 'ok') : D.QUIZ[n] ? `<a class="btn" style="min-height:32px;padding:4px 12px" href="#/quiz/${encodeURIComponent(n)}">Verify</a>` : ''}</div></div>`; }).join('') : '<p class="muted small">No skills yet.</p>'}
        <select data-change="addskill" aria-label="Add a skill"><option value="">+ Add a skill</option>${D.SKILLS.filter((s) => !U.skills[s]).map((s) => `<option>${s}</option>`).join('')}</select></div></div>
      <div class="card"><div class="row between"><h3>Projects & experience</h3><a class="btn primary" href="#/evidence">Add</a></div><div class="stack small" style="margin-top:10px">${U.evidence.length ? U.evidence.map((e) => `<div><span class="pill">${esc(e.type)}</span> ${/\d/.test(e.outcome || '') ? '' : pill('Add a result', 'warn')}<p>${esc(e.statement || e.title)}</p><button class="small chip" data-act="del-ev" data-id="${esc(e.id)}">Remove</button></div>`).join('') : '<p class="muted">Nothing yet. Turn projects, hackathons and open-source work into structured career evidence.</p>'}</div></div>
      <div class="card"><p class="eyebrow">Trust layer</p><ul class="plain small" style="margin-top:6px">${trust.map(([ok, l, hint]) => `<li class="${ok ? 'ok-t' : 'muted'}">${ok ? '✓' : '○'} ${l}${ok ? '' : ` — ${hint}`}</li>`).join('')}</ul></div>
      <div class="card"><p class="eyebrow">Profile checklist</p><ul class="plain small" style="margin-top:6px">${cl.map((c) => `<li class="${c.ok ? 'ok-t' : ''}">${c.ok ? '✓' : '○'} ${c.label}</li>`).join('')}</ul></div>
      <button class="btn danger block" data-act="reset">Reset my data</button></div>`);
  }

  /* ---------- Experience Builder ---------- */
  function evidencePage(params) {
    const pre = (params.get('skills') || '').split(',').filter(Boolean);
    const names = Object.keys(U.skills).concat(pre.filter((s) => !U.skills[s]));
    return shell('profile', `<div class="stack">${back('#/profile', 'Profile')}<h2>Experience Builder</h2><p class="muted small">Turn what you've done into evidence recruiters can read in five seconds.</p>
      <form data-form="evidence" class="stack" id="evform"><div><label for="t">What kind of experience?</label><select id="t" name="type">${E.PROJECT_TYPES.concat(['internship', 'leadership']).map((k) => `<option value="${k}">${k}</option>`).join('')}</select></div>
      <div><label for="ti">What did you build or do?</label><input id="ti" name="title" required maxlength="80" placeholder="e.g. a React e-commerce platform"></div>
      <div><label for="d">One line on how (optional)</label><input id="d" name="desc" maxlength="140" placeholder="e.g. cart, checkout and admin dashboard"></div>
      <div><label>Skills used</label><div class="chips">${names.concat(D.SKILLS.filter((s) => !names.includes(s)).slice(0, 8)).map((s) => `<label class="chip ${pre.includes(s) ? 'on' : ''}" style="margin:0;font-weight:500"><input type="checkbox" name="skills" value="${esc(s)}" ${pre.includes(s) ? 'checked' : ''} style="width:auto;min-height:0"> ${esc(s)}</label>`).join('')}</div></div>
      <div><label for="o">Result (numbers win)</label><input id="o" name="outcome" maxlength="100" placeholder="e.g. 200+ test users, or 2nd of 120 teams"></div>
      <div class="card" style="background:var(--brand-soft)"><p class="eyebrow">Preview</p><p class="small muted" id="before">Before: “Built a website.”</p><p id="preview" style="margin-top:6px"><b>After: —</b></p></div>
      <button class="btn primary block">Save to my career graph</button></form></div>`);
  }
  function evFromForm(form) {
    const f = new FormData(form);
    return { type: f.get('type'), title: String(f.get('title') || '').trim(), desc: String(f.get('desc') || '').trim(), skills: f.getAll('skills'), outcome: String(f.get('outcome') || '').trim() };
  }

  /* ---------- Learning path ---------- */
  function pathPage(params) {
    const cid = params.get('c') || U.goal, c = D.CAREERS[cid], r = E.readiness(U, cid), top = E.rankOpps(U).filter((x) => x.opp.career === cid && x.fraud.risk !== 'high').slice(0, 3);
    return shell('home', `<div class="stack">${back('#/home', 'Home')}<p class="eyebrow">Your path to</p><h2>${c.title}</h2>
      <div class="scroll">${Object.entries(D.CAREERS).map(([k, x]) => `<a class="chip ${k === cid ? 'on' : ''}" href="#/path?c=${k}">${x.title}</a>`).join('')}</div>
      <div class="card row" style="gap:14px">${ring(r.total, 72)}<p class="small">You are <b>${r.total}%</b> ready. ${r.gaps.length ? `Biggest gaps: <b>${r.gaps.slice(0, 3).map((g) => g.name).join(', ')}</b>.` : 'No skill gaps — focus on proof.'}</p></div>
      <div class="card"><p class="eyebrow">Step 1 · Learn what's missing</p><div class="stack" style="margin-top:8px">${r.gaps.length ? r.gaps.slice(0, 4).map((g) => `<div><b>${g.name}</b> <span class="small muted">(${g.have ? D.LEVELS[g.have] : 'none'} → ${D.LEVELS[g.need]})</span><ul class="plain small muted">${(D.LEARN[g.name] || ['Core ' + g.name + ' fundamentals']).map((t, i) => `<li>${esc(t)} · ~${D.LEARN_HOURS[i]}h</li>`).join('')}</ul></div>`).join('') : '<p class="small muted">You meet every baseline skill.</p>'}</div></div>
      <div class="card"><p class="eyebrow">Step 2 · Build proof</p><p style="margin:6px 0 10px">${esc(c.project)}</p><a class="btn" href="#/evidence?skills=${encodeURIComponent(r.gaps.slice(0, 2).map((g) => g.name).join(','))}">Add a project</a></div>
      <div class="card"><p class="eyebrow">Step 3 · Verify</p><p class="small muted" style="margin:6px 0 10px">Turn claims into verified skills.</p><div class="chips">${c.skills.filter(([n]) => D.QUIZ[n]).map(([n]) => `<a class="chip ${U.skills[n] && U.skills[n].assessed ? 'on' : ''}" href="#/quiz/${encodeURIComponent(n)}">${U.skills[n] && U.skills[n].assessed ? '✓ ' : ''}${n}</a>`).join('') || '<span class="small muted">No assessments for this career yet.</span>'}</div></div>
      <div class="card"><p class="eyebrow">Step 4 · Apply</p><div class="stack" style="margin-top:8px">${top.map((x) => `<a href="#/job/${x.opp.id}"><div class="row between"><span>${esc(x.opp.title)} <span class="muted small">· ${esc(x.opp.company.name)}</span></span><b>${x.m.score}%</b></div></a>`).join('') || '<p class="small muted">No listings yet.</p>'}</div></div>
      <div class="card small"><p class="eyebrow">Market snapshot (illustrative)</p><p style="margin-top:6px"><b>Hiring in:</b> ${c.demand.join(', ')}<br><b>Typical employers:</b> ${c.companies}<br><b>Entry salary:</b> ${c.path[2][4]}</p></div></div>`);
  }

  /* ---------- Simulator ---------- */
  function simPage(params) {
    const cid = params.get('c') || U.goal, steps = E.simulate(cid, new Date().getFullYear());
    return shell('home', `<div class="stack">${back('#/home', 'Home')}<h2>What could my career look like?</h2>
      <div class="scroll">${Object.entries(D.CAREERS).map(([k, x]) => `<a class="chip ${k === cid ? 'on' : ''}" href="#/sim?c=${k}">${x.title}</a>`).join('')}</div>
      <div class="banner warn small">These are estimates based on illustrative data, not guarantees. Real outcomes depend on your effort, market conditions and luck.</div>
      <div class="timeline">${steps.map((s) => `<div class="st card"><p class="eyebrow">${s.year}</p><h3>${esc(s.title)}</h3><p class="small muted">${esc(s.exp)}</p><p class="small" style="margin-top:6px"><b>Skills:</b> ${esc(s.skills)}</p><p class="small"><b>Estimated pay:</b> ${esc(s.pay)}</p></div>`).join('')}</div>
      <a class="btn primary block" href="#/path?c=${cid}">See my path to ${D.CAREERS[cid].title}</a></div>`);
  }

  /* ---------- Quiz ---------- */
  function quizPage(skill) {
    const qs = D.QUIZ[skill]; if (!qs) return shell('profile', '<p>No assessment for this skill yet. <a href="#/profile">Back</a></p>');
    if (!view.quiz || view.quiz.skill !== skill) view.quiz = { skill, i: 0, score: 0 };
    const z = view.quiz;
    if (z.i >= qs.length) {
      const pass = z.score >= 2;
      return shell('profile', `<div class="stack">${back('#/profile', 'Profile')}<div class="card stack"><h2>${esc(skill)}: ${z.score}/${qs.length}</h2>${pass ? `<div class="banner ok"><b>Skill verified.</b> ${esc(skill)} now counts as assessment-verified on your profile.</div>` : '<div class="banner warn">Not yet. Review the basics and try again.</div>'}<div class="row"><a class="btn primary" href="#/profile">Back to profile</a><button class="btn" data-act="quiz-retry">Retry</button></div></div><p class="tiny muted">Prototype assessment: 3 questions, no proctoring. Production uses large item banks, timing, and proctoring/plagiarism checks.</p></div>`);
    }
    const [q, opts] = qs[z.i];
    return shell('profile', `<div class="stack">${back('#/profile', 'Profile')}<p class="eyebrow">${esc(skill)} · Question ${z.i + 1} of ${qs.length}</p>${bar(Math.round((z.i / qs.length) * 100))}<h2>${esc(q)}</h2>${opts.map((o, i) => `<button class="btn block" style="justify-content:flex-start;border-radius:14px" data-act="quiz-ans" data-i="${i}">${esc(o)}</button>`).join('')}</div>`);
  }

  /* ---------- Interview coach ---------- */
  function interviewPage() {
    const v = view.iv;
    if (!v) return shell('home', `<div class="stack">${back('#/home', 'Home')}<h2>Interview coach</h2><p class="muted small">Pick a round. You'll answer three questions and get feedback on relevance, structure, clarity and specifics.</p>
      ${[['technical', 'Technical', `Role-specific for ${careerName(U.goal)}`], ['behavioral', 'Behavioral', 'Teamwork, failure, ownership'], ['hr', 'HR', 'Introduction and motivation']].map(([k, l, d]) => `<button class="card tap" style="text-align:left;width:100%;font:inherit;color:inherit" data-act="iv-start" data-v="${k}"><b>${l}</b><br><span class="small muted">${d}</span></button>`).join('')}
      <p class="tiny muted">Scoring is a transparent heuristic (keywords, structure, clarity, numbers), not a human or LLM judge. Use it for practice, not as a verdict.</p></div>`);
    const qs = v.mode === 'technical' ? D.INTERVIEW.technical[U.goal] : D.INTERVIEW[v.mode];
    if (v.i >= qs.length) {
      const avg = v.scores.reduce((a, s) => a + s.total, 0) / qs.length, strong = ['relevance', 'structure', 'clarity', 'specificity'].map((k) => [k, v.scores.reduce((a, s) => a + s[k], 0) / qs.length]).sort((a, b) => b[1] - a[1]);
      return shell('home', `<div class="stack">${back('#/home', 'Home')}<div class="card stack"><h2>${avg.toFixed(1)} / 10</h2><p>Strongest: <b>${strong[0][0]}</b>. Improve: <b>${strong[3][0]}</b>.</p>${v.scores.map((s, i) => `<p class="small">Q${i + 1}: ${s.total}/10</p>`).join('')}<div class="row"><button class="btn primary" data-act="iv-done">Done</button><button class="btn" data-act="iv-reset">Another round</button></div></div></div>`);
    }
    const fb = v.fb;
    return shell('home', `<div class="stack">${back('#/home', 'Home')}<p class="eyebrow">${esc(v.mode)} · Question ${v.i + 1} of ${qs.length}</p><h2>${esc(qs[v.i][0])}</h2>
      ${fb ? `<div class="card stack"><h3>${fb.total}/10</h3>${[['Relevance', fb.relevance], ['Structure', fb.structure], ['Clarity', fb.clarity], ['Specifics', fb.specificity]].map(([l, x]) => `<div class="small"><div class="row between"><span>${l}</span><b>${Math.round(x * 100)}</b></div>${bar(Math.round(x * 100))}</div>`).join('')}<p class="small muted">${fb.structure < 0.6 ? 'Tip: use a clear order — situation, action, result. ' : ''}${fb.specificity < 1 ? 'Add one concrete number. ' : ''}${fb.relevance < 0.6 ? 'Mention the key concepts the question is testing.' : ''}</p><button class="btn primary" data-act="iv-next">Next</button></div>`
        : `<form data-form="iv" class="stack"><textarea name="a" rows="7" placeholder="Type your answer as you would say it" required aria-label="Your answer"></textarea><button class="btn primary">Get feedback</button></form>`}</div>`);
  }

  /* ---------- Safety ---------- */
  function safety() {
    return shell('home', `<div class="stack">${back('#/home', 'Home')}<h2>Fraud shield</h2><div class="banner ok"><b>Real employers don't charge you to apply for a job.</b></div>
      <p class="muted small">Paste a message or job post. We check for fee requests, guaranteed-job promises, chat-only recruiters and other scam patterns.</p>
      <form data-form="scam" class="stack"><textarea name="t" rows="6" placeholder="Paste the job post or recruiter message" aria-label="Listing text"></textarea><input name="c" placeholder="Recruiter contact (email / WhatsApp), optional" aria-label="Recruiter contact"><button class="btn primary">Check listing</button></form><div id="scamres" aria-live="polite"></div>
      <div class="card small"><p class="eyebrow">How we protect you</p><ul class="plain" style="margin-top:6px"><li>✓ Every employer and recruiter is verified before posting</li><li>✓ Automated checks on every listing, every edit</li><li>✓ Report a job, recruiter or company in one tap</li><li>✓ Repeat offenders are banned by device, domain and payment signals (roadmap)</li></ul></div></div>`);
  }

  /* ---------- Recruiter ---------- */
  function recruiter() {
    cohort = cohort || E.makeCohort(300, 42);
    const roles = D.OPPS.filter((o) => ['job', 'internship'].includes(o.type) && o.skills.length);
    const opp = D.OPPS.find((o) => o.id === view.rec.opp) || roles[0];
    const ranked = cohort.map((u) => ({ u, m: E.matchOpp(u, opp) })).sort((a, b) => b.m.score - a.m.score || b.m.proven - a.m.proven).slice(0, 6);
    const ts = E.talentSearch(cohort, view.rec.q);
    const tag = (u, n) => `${esc(n)}${u.skills[n] && u.skills[n].assessed ? ' ✓' : ''}`;
    const cand = (u, label, extra) => `<tr><td><b>${esc(u.name)}</b><br><span class="tiny muted">${esc(u.city)} · ${esc(careerName(u.goal))}</span></td><td><b>${label}</b></td><td class="small">${extra}</td></tr>`;
    return `<header class="topbar"><a class="logo" href="#/"><i></i>Pathwise <span class="pill">Recruiter</span></a></header><div class="wide stack">
      <div><h2>Who is actually qualified?</h2><p class="muted small">Sample data: 300 synthetic candidates. Ranked by fit, with proof shown.</p></div>
      <div class="card stack"><label for="role">Open role</label><select id="role" data-change="recrole">${roles.map((o) => `<option value="${o.id}" ${o.id === opp.id ? 'selected' : ''}>${esc(o.title)} — ${esc(o.company.name)}</option>`).join('')}</select>
        <table><thead><tr><th>Candidate</th><th>Match</th><th>Why</th></tr></thead><tbody>${ranked.map(({ u, m }) => cand(u, m.score + '%', `${m.matched.map((s) => `<span class="ok-t">✓ ${tag(u, s.name)}</span>`).join(' · ') || '—'}${m.missing.length ? `<br><span class="warn-t">△ ${m.missing.slice(0, 2).map((s) => esc(s.name)).join(', ')}</span>` : ''}<br><span class="muted">${u.evidence.length} project(s) · proven ${Math.round(m.proven * 100)}% · interview ${u.interview.best || '–'}</span>`)).join('')}</tbody></table></div>
      <div class="card stack"><h3>Talent search</h3><form data-form="talent" class="row"><input name="q" value="${esc(view.rec.q)}" aria-label="Talent search"><button class="btn primary">Search</button></form>
        <p class="small muted">Understood: ${ts.filters.skills.length ? ts.filters.skills.map((s) => pill(s)).join(' ') : ''} ${ts.filters.city ? pill(ts.filters.city) : ''} ${ts.filters.intent ? pill('Intent: ' + careerName(ts.filters.intent)) : ''} · <b>${ts.results.length}</b> candidate${ts.results.length === 1 ? "" : "s"}</p>
        <table><tbody>${ts.results.slice(0, 6).map(({ u, score }) => cand(u, score, Object.keys(u.skills).slice(0, 5).map((n) => tag(u, n)).join(', '))).join('') || '<tr><td>No matches</td></tr>'}</tbody></table></div>
      <p class="tiny muted"><a href="#/">← Back to Pathwise</a> · Candidates are fictional, generated for the demo.</p></div>`;
  }

  /* ---------- College ---------- */
  function college() {
    cohort = cohort || E.makeCohort(300, 42);
    const s = E.cohortStats(cohort), pct = (v) => Math.round((v / s.total) * 100);
    const rows = [['Students', s.total, 100], ['Profiles complete', s.complete, pct(s.complete)], ['Internship-ready', s.internshipReady, pct(s.internshipReady)], ['Placement-ready', s.placementReady, pct(s.placementReady)], ['Need intervention', s.intervene, pct(s.intervene)]];
    return `<header class="topbar"><a class="logo" href="#/"><i></i>Pathwise <span class="pill">College</span></a></header><div class="wide stack">
      <div><h2>Placement readiness</h2><p class="muted small">Sample cohort of ${s.total} synthetic students — same readiness engine as the student app.</p></div>
      <div class="grid g3">${rows.map(([l, v, p]) => `<div class="card"><p class="eyebrow">${l}</p><div class="kpi">${v}</div>${bar(p, l === 'Need intervention' ? 'warn' : '')}<p class="tiny muted">${p}% of cohort</p></div>`).join('')}</div>
      <div class="card"><h3>Top skill gaps to teach</h3><div class="stack" style="margin-top:10px">${s.topGaps.map(([n, c]) => `<div><div class="row between small"><span>${esc(n)}</span><b>${c} students</b></div>${bar(Math.round((c / s.total) * 100), 'warn')}</div>`).join('')}</div></div>
      <p class="tiny muted"><a href="#/">← Back to Pathwise</a></p></div>`;
  }

  /* ---------- Router ---------- */
  const needUser = new Set(['home', 'explore', 'job', 'apps', 'copilot', 'profile', 'evidence', 'path', 'sim', 'quiz', 'interview', 'safety']);
  function render() {
    const [path, qs] = location.hash.slice(1).split('?'), parts = (path || '/').split('/').filter(Boolean), page = parts[0] || '', params = new URLSearchParams(qs || '');
    if (needUser.has(page) && !U) { location.hash = '#/'; return; }
    if (page === 'explore-public') { explorePublic(); return; }
    const pages = {
      '': landing, onboard: () => { if (!view.ob) startOb(); return onboarding(); }, home, explore, job: () => jobPage(parts[1]), apps, copilot: copilotView, profile,
      evidence: () => evidencePage(params), path: () => pathPage(params), sim: () => simPage(params), quiz: () => quizPage(decodeURIComponent(parts[1] || '')), interview: interviewPage, safety, recruiter, college,
    };
    root.innerHTML = (pages[page] || landing)();
    document.title = 'Pathwise — Your Career OS';
    window.scrollTo(0, 0);
    const f = root.querySelector('input[autofocus]'); if (f) f.focus();
  }
  const rerender = () => { const y = window.scrollY; render(); window.scrollTo(0, y); };

  /* ---------- Actions ---------- */
  function applyTo(id) {
    const o = D.OPPS.find((x) => x.id === id); if (!o || applied(id)) return;
    if (E.assessFraud(o).risk === 'high') { toast('Blocked: this listing looks like a scam'); return; }
    U.apps.push({ oppId: id, history: ['applied'], at: today(), match: E.matchOpp(U, o).score }); save(); toast(o.type === 'hackathon' ? 'Registered — it will appear as career evidence if you place' : 'Applied. We\'ll track every stage for you.'); rerender();
  }
  const A = {
    start: (el) => startOb(el.dataset.stage), demo: () => { U = E.demoUser(); save(); view.chat = []; location.hash = '#/home'; },
    'ob-set': (el) => { const o = view.ob, k = el.dataset.k, v = el.dataset.v; if (el.dataset.multi === '1') { const key = k === 'interests' ? 'interests' : 'skillList'; o[key] = o[key].includes(v) ? o[key].filter((x) => x !== v) : o[key].concat(v); } else o[k] = v; rerender(); },
    'ob-goal': (el) => { const o = view.ob; if (el.dataset.v === '?') { o.step = OB_STEPS.indexOf('work'); } else { o.goal = el.dataset.v; o.step = OB_STEPS.indexOf('study'); } rerender(); },
    'ob-next': () => { const o = view.ob; o.step++; if (OB_STEPS[o.step] === 'work' && o.goal) o.step++; rerender(); },
    'ob-back': () => { const o = view.ob; o.step = Math.max(0, o.step - 1); if (OB_STEPS[o.step] === 'work' && o.goal) o.step = 0; rerender(); },
    apply: (el) => applyTo(el.dataset.id),
    'ex-type': (el) => { view.ex.type = el.dataset.v; rerender(); },
    advance: (el) => { const a = U.apps[+el.dataset.i], n = E.STATUS[E.STATUS.indexOf(E.statusOf(a)) + 1]; if (n) a.history.push(n); save(); rerender(); },
    reject: (el) => { U.apps[+el.dataset.i].history.push('rejected'); save(); rerender(); },
    'job-ask': (el) => { const r = E.copilot(U, el.dataset.q, el.dataset.id); document.getElementById('jobchat').innerHTML = `<div class="chatbub bot stack">${answerHtml(r)}</div>`; },
    report: (el) => { U.reports.push({ id: el.dataset.id, what: el.dataset.what, at: today() }); save(); toast(`Report saved (${el.dataset.what}). In production this goes to our trust & safety queue.`); },
    ask: (el) => ask(el.dataset.q),
    level: (el) => { const s = U.skills[el.dataset.s]; s.level = (s.level % 5) + 1; save(); rerender(); },
    'del-ev': (el) => { U.evidence = U.evidence.filter((e) => e.id !== el.dataset.id); save(); rerender(); },
    reset: () => { if (confirm('Delete all your data from this browser?')) { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } U = null; view.chat = []; view.ob = null; location.hash = '#/'; } },
    'quiz-ans': (el) => { const z = view.quiz, qs = D.QUIZ[z.skill]; if (+el.dataset.i === qs[z.i][2]) z.score++; z.i++; if (z.i >= qs.length && z.score >= 2) { U.skills[z.skill] = Object.assign({ level: 3 }, U.skills[z.skill], { assessed: true }); save(); } rerender(); },
    'quiz-retry': () => { view.quiz = null; rerender(); },
    'iv-start': (el) => { view.iv = { mode: el.dataset.v, i: 0, scores: [], fb: null }; rerender(); },
    'iv-next': () => { view.iv.i++; view.iv.fb = null; rerender(); },
    'iv-reset': () => { view.iv = null; rerender(); },
    'iv-done': () => { const v = view.iv, avg = Math.round((v.scores.reduce((a, s) => a + s.total, 0) / v.scores.length) * 10); U.interview = { best: Math.max(U.interview.best || 0, avg), attempts: (U.interview.attempts || 0) + 1 }; save(); view.iv = null; toast('Interview score saved to your readiness'); location.hash = '#/home'; },
  };
  function ask(q) { view.chat.push({ me: true, t: q }, { me: false, r: E.copilot(U, q) }); rerender(); const c = document.getElementById('chat'); if (c) c.lastElementChild.scrollIntoView({ block: 'end' }); }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-set-type]'); if (t) view.ex.type = t.dataset.setType;
    const el = e.target.closest('[data-act]'); if (!el) return;
    e.preventDefault(); if (A[el.dataset.act]) A[el.dataset.act](el);
  });
  document.addEventListener('input', (e) => {
    if (e.target.id === 'q') { view.ex.q = e.target.value; document.getElementById('list').innerHTML = exploreList(); }
    const f = e.target.closest('#evform');
    if (f) { const ev = evFromForm(f); document.getElementById('preview').innerHTML = ev.title ? `<b>After:</b> ${esc(E.buildStatement(ev))}` : '<b>After: —</b>'; f.querySelectorAll('label.chip').forEach((l) => l.classList.toggle('on', l.querySelector('input').checked)); }
  });
  document.addEventListener('change', (e) => {
    const k = e.target.dataset.change; if (!k) return;
    if (k === 'goal') { U.goal = e.target.value; save(); rerender(); }
    if (k === 'addskill' && e.target.value) { U.skills[e.target.value] = { level: 3, assessed: false }; save(); rerender(); }
    if (k === 'recrole') { view.rec.opp = e.target.value; rerender(); }
  });
  document.addEventListener('submit', (e) => {
    const k = e.target.dataset.form; if (!k) return; e.preventDefault();
    const f = new FormData(e.target);
    if (k === 'ob-finish') obFinish(String(f.get('name') || 'Friend'));
    if (k === 'ask') { const q = String(f.get('q') || '').trim(); if (q) ask(q); }
    if (k === 'evidence') { const ev = evFromForm(e.target); ev.id = 'e' + Date.now(); ev.statement = E.buildStatement(ev); ev.skills.forEach((s) => { if (!U.skills[s]) U.skills[s] = { level: 2, assessed: false }; }); U.evidence.push(ev); save(); toast('Added to your career graph'); location.hash = '#/profile'; }
    if (k === 'iv') { const v = view.iv, qs = v.mode === 'technical' ? D.INTERVIEW.technical[U.goal] : D.INTERVIEW[v.mode]; v.fb = E.scoreAnswer(String(f.get('a')), qs[v.i][1]); v.scores.push(v.fb); rerender(); }
    if (k === 'scam') { const r = E.assessFraudText({ text: String(f.get('t')), contact: String(f.get('c')), verified: false }); document.getElementById('scamres').innerHTML = r.risk === 'low' && r.flags.length <= 1 ? '<div class="banner ok"><b>No strong scam signals found.</b> Still verify the company yourself, and never pay to apply.</div>' : `<div class="banner ${r.risk === 'high' ? 'bad' : 'warn'}"><b>${r.risk === 'high' ? 'High risk — do not proceed.' : 'Be careful.'}</b><ul>${r.flags.filter((x) => x !== 'Company is not verified.').map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`; }
    if (k === 'talent') { view.rec.q = String(f.get('q')); rerender(); }
  });
  window.addEventListener('hashchange', render);
  load(); render();
})();
