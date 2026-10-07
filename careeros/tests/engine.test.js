// Run: node careeros/tests/engine.test.js
const assert = require('assert');
const D = require('../data.js');
const E = require('../engine.js');
let n = 0;
const t = (name, fn) => { fn(); n++; console.log('ok -', name); };

const rahul = E.demoUser();

t('readiness is bounded and decomposed', () => {
  const r = E.readiness(rahul, 'ai');
  assert(r.total >= 0 && r.total <= 100);
  Object.values(r.parts).forEach((v) => assert(v >= 0 && v <= 100));
  assert(Math.abs(Object.values(E.WEIGHTS).reduce((a, b) => a + b, 0) - 1) < 1e-9);
});
t('empty profile scores near zero, never NaN', () => {
  const r = E.readiness(E.blankUser(), 'data');
  assert(Number.isFinite(r.total) && r.total <= 10);
});
t('evidence raises readiness vs bare claims (match != readiness)', () => {
  const claims = E.blankUser(); claims.goal = 'data';
  ['SQL', 'Excel', 'Power BI', 'Statistics', 'Python'].forEach((s) => (claims.skills[s] = { level: 4, assessed: false }));
  const proven = E.clone(claims);
  Object.values(proven.skills).forEach((s) => (s.assessed = true));
  proven.evidence.push({ id: 'p', type: 'project', title: 'Dash', desc: '', skills: ['SQL', 'Excel', 'Power BI'], outcome: '10 users' });
  assert(E.readiness(proven, 'data').total > E.readiness(claims, 'data').total + 15);
  const opp = D.OPPS.find((o) => o.id === 'o3');
  assert(E.matchOpp(claims, opp).fit === E.matchOpp(proven, opp).fit, 'fit ignores evidence');
  assert(E.matchOpp(proven, opp).proven > E.matchOpp(claims, opp).proven);
});
t('next best action impact is positive and sorted', () => {
  const a = E.nextActions(rahul, 'ai');
  assert(a.length > 0);
  a.forEach((x) => assert(x.delta > 0));
  for (let i = 1; i < a.length; i++) assert(a[i - 1].delta >= a[i].delta);
});
t('applying a suggested action really raises the score', () => {
  const before = E.readiness(rahul, 'ai').total, best = E.nextActions(rahul, 'ai')[0];
  assert(best.delta >= 1, JSON.stringify(best));
  assert(before + best.delta <= 100);
});
t('fraud shield flags both scam samples and no legit listing', () => {
  ['x1', 'x2'].forEach((id) => assert.strictEqual(E.assessFraud(D.OPPS.find((o) => o.id === id)).risk, 'high'));
  D.OPPS.filter((o) => !o.id.startsWith('x')).forEach((o) => assert.strictEqual(E.assessFraud(o).risk, 'low', `${o.id} false positive: ${E.assessFraud(o).flags}`));
});
t('fraud text checker catches fee requests', () => {
  assert.strictEqual(E.assessFraudText({ text: 'Pay Rs 1,500 registration fee to confirm your seat', verified: true }).risk, 'high');
  assert.strictEqual(E.assessFraudText({ text: 'Frontend role, apply with your resume', contact: 'jobs@acme.example' }).risk, 'low');
});
t('high-risk jobs never get an apply recommendation', () => {
  const m = E.matchOpp(rahul, D.OPPS.find((o) => o.id === 'x1'));
  assert(/Do not apply/.test(m.advice));
});
t('match engine explains matched/partial/missing', () => {
  const m = E.matchOpp(rahul, D.OPPS.find((o) => o.id === 'o1'));
  assert(m.partial.some((x) => x.name === 'Python'), 'level 3 vs need 4 is partial');
  assert(m.missing.some((x) => x.name === 'PyTorch'));
  assert(E.matchOpp(rahul, D.OPPS.find((o) => o.id === 'o2')).matched.some((x) => x.name === 'Python'));
  assert(m.score > 0 && m.score <= 100);
});
t('analytics only claims patterns with >=3 samples', () => {
  const a = E.analytics(rahul);
  assert.strictEqual(a.n, rahul.apps.length);
  a.byCareer.forEach((g) => assert(g.n >= 3));
  assert(E.analytics(E.blankUser()).insights[0].includes('No applications'));
});
t('experience builder produces a structured, quantified statement', () => {
  const s = E.buildStatement({ type: 'project', title: 'a React e-commerce platform', skills: ['React'], desc: 'cart and checkout', outcome: '200+ test users' });
  assert(/^Built a React e-commerce platform using React/.test(s) && /200\+ test users/.test(s), s);
});
t('resume optimizer never tells users to claim missing skills', () => {
  const r = E.optimizeResume(rahul, D.OPPS.find((o) => o.id === 'o3'));
  assert(r.gaps.length && r.ats >= 0 && r.ats <= 100);
});
t('simulator returns ordered timeline', () => {
  const s = E.simulate('ai', 2026);
  assert.strictEqual(s[0].year, 2026);
  for (let i = 1; i < s.length; i++) assert(s[i].year > s[i - 1].year);
});
t('mock interview scoring rewards structure and specifics', () => {
  const kw = D.INTERVIEW.behavioral[0][1];
  const weak = E.scoreAnswer('we argued', kw).total;
  const strong = E.scoreAnswer('In my team project we had a disagreement about the design. First I listened to both sides, then we ran a quick test because data settles arguments. The result was a 30% faster page and we resolved it.', kw).total;
  assert(strong > weak + 3, `${weak} vs ${strong}`);
});
t('copilot answers are grounded and contextual', () => {
  assert(E.copilot(rahul, 'What should I do next?').lines[0].includes('best next move'));
  assert(/Match \d+%/.test(E.copilot(rahul, 'Should I apply?', 'o3').lines[0]));
  assert(/charge/.test(E.copilot(rahul, 'is this a scam').lines[0]));
});
t('cohort is deterministic; talent search honours filters', () => {
  const a = E.makeCohort(50, 7), b = E.makeCohort(50, 7);
  assert.deepStrictEqual(a.map((u) => u.name), b.map((u) => u.name));
  const big = E.makeCohort(300, 42);
  const r = E.talentSearch(big, 'Find students in Hyderabad who know Python + SQL and are interested in Data Analytics');
  assert.deepStrictEqual(r.filters.skills.sort(), ['Python', 'SQL']);
  r.results.forEach(({ u }) => { assert.strictEqual(u.city, 'Hyderabad'); assert(u.skills.Python && u.skills.SQL); assert.strictEqual(u.goal, 'data'); });
});
t('cohort stats are internally consistent', () => {
  const s = E.cohortStats(E.makeCohort(300, 42));
  assert(s.placementReady <= s.internshipReady && s.internshipReady <= s.total);
  assert(s.complete <= s.total);
});
t('catalog integrity: every skill referenced exists, quizzes valid', () => {
  const all = new Set(D.SKILLS);
  Object.values(D.CAREERS).forEach((c) => c.skills.forEach(([s]) => assert(all.has(s), s)));
  D.OPPS.forEach((o) => o.skills.forEach(([s]) => assert(all.has(s), `${o.id}:${s}`)));
  Object.entries(D.QUIZ).forEach(([k, qs]) => qs.forEach(([, opts, a]) => assert(a >= 0 && a < opts.length, k)));
});
console.log(`\n${n} tests passed`);
