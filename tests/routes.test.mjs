import { JSDOM } from 'jsdom';
import fs from 'node:fs';

const bundle = fs.readFileSync('tests/.build/bundle.js', 'utf8');

const ROUTES = ['/', '/courses', '/courses/complete-digital-marketing-masterclass', '/resources',
  '/free', '/about', '/contact', '/consultation', '/signin', '/cart', '/legal/terms',
  '/legal/privacy', '/legal/refunds', '/dashboard', '/checkout', '/definitely-not-a-page'];

let failures = 0;

for (const route of ROUTES) {
  const dom = new JSDOM(`<!doctype html><html lang="en"><body><div id="root"></div></body></html>`, {
    url: 'http://localhost' + route,
    pretendToBeVisual: true,
    runScripts: 'outside-only',
  });
  const { window } = dom;
  const errors = [];
  window.matchMedia ||= (q) => ({ matches: false, media: q, addEventListener(){}, removeEventListener(){}, addListener(){}, removeListener(){} });
  window.scrollTo = () => {};
  window.HTMLMediaElement.prototype.load = () => {};
  const origError = console.error;
  console.error = (...a) => { const s = a.map(String).join(' '); if (!/not wrapped in act|Warning: ReactDOM/.test(s)) errors.push(s); };
  window.addEventListener('error', (e) => errors.push('window.onerror: ' + e.message));

  try {
    window.eval(bundle);
    await window.__render(route);
    await new Promise((r) => setTimeout(r, 1200));
    const text = window.document.getElementById('root').textContent || '';
    const ok = text.trim().length > 40 && errors.length === 0;
    if (!ok) failures++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${route.padEnd(46)} ${text.trim().length} chars`);
    for (const e of errors.slice(0, 3)) console.log('        ! ' + e.slice(0, 300).replace(/\n/g, ' '));
  } catch (err) {
    failures++;
    console.log(`CRASH ${route}`);
    console.log('        ! ' + String(err.stack || err).slice(0, 600));
  } finally {
    console.error = origError;
    window.close();
  }
}
console.log(failures === 0 ? '\nAll routes rendered cleanly.' : `\n${failures} route(s) failed.`);
if (failures > 0) process.exitCode = 1;
