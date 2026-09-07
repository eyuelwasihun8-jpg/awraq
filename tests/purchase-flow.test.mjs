import { JSDOM } from 'jsdom';
import fs from 'node:fs';
const bundle = fs.readFileSync('tests/.build/bundle.js', 'utf8');

const dom = new JSDOM(`<!doctype html><html lang="en"><body><div id="root"></div></body></html>`,
  { url: 'http://localhost/', pretendToBeVisual: true, runScripts: 'outside-only' });
const { window } = dom;
const doc = window.document;
window.matchMedia ||= (q) => ({ matches: false, media: q, addEventListener(){}, removeEventListener(){}, addListener(){}, removeListener(){} });
window.scrollTo = () => {};
window.HTMLMediaElement.prototype.load = () => {};
const errors = [];
const orig = console.error;
console.error = (...a) => { const s = a.map(String).join(' '); if (!/not wrapped in act/.test(s)) errors.push(s); };
window.addEventListener('error', (e) => errors.push('onerror: ' + e.message));

const wait = (ms = 400) => new Promise((r) => setTimeout(r, ms));
const text = () => doc.getElementById('root').textContent || '';
const findByText = (sel, re) => [...doc.querySelectorAll(sel)].find((n) => re.test(n.textContent || ''));
const click = async (node, label) => {
  if (!node) throw new Error(`could not find: ${label}`);
  node.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
  await wait();
};
const type = async (input, value) => {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(input, value);
  input.dispatchEvent(new window.Event('input', { bubbles: true }));
  await wait(60);
};

const steps = [];
const step = (name, ok, detail = '') => { steps.push({ name, ok, detail }); };

window.eval(bundle);
await window.__render('/courses/complete-digital-marketing-masterclass');
await wait(1500);

step('course page renders', /Complete Digital Marketing Masterclass/.test(text()));
step('price is formatted, not "ETB 199.00"', /Br\s?199|ETB\s?199/.test(text()) && !/ETB 199\.00/.test(text()), text().match(/Br[\s\u00a0]?[\d,]+/)?.[0] ?? '');
step('locked lessons are not clickable buttons',
  [...doc.querySelectorAll('button,a')].every((n) => !/Enrol to unlock/.test(n.textContent || '')));

// Add to cart
await click(findByText('button', /^Add to cart$/), 'Add to cart');
step('add to cart works', /In your cart|Go to cart/.test(text()) || (window.localStorage.getItem('awraq.state.v2')||'').includes('masterclass'));

// Cart
window.history.pushState({}, '', '/cart');
window.dispatchEvent(new window.PopStateEvent('popstate'));
await wait(800);
step('cart lists the item', /Complete Digital Marketing Masterclass/.test(text()) && /Continue to payment/.test(text()));

// Checkout requires auth -> should land on sign in
await click(findByText('a', /Continue to payment/), 'Continue to payment');
await wait(900);
step('checkout is guarded by auth', /Welcome back|Sign in/.test(text()));
step('sign-in fields start empty',
  [...doc.querySelectorAll('input')].every((i) => i.value === ''),
  [...doc.querySelectorAll('input')].map((i) => `${i.type}="${i.value}"`).join(' '));

// Sign in
const emailInput = doc.querySelector('input[type="email"]');
const pwInput = doc.querySelector('input[type="password"]');
await type(emailInput, 'test@example.com');
await type(pwInput, 'hunter2!!');
await click(findByText('button', /^Sign in$/), 'submit sign in');
await wait(1000);
step('sign in returns to checkout', /Checkout|Order summary/.test(text()), text().slice(0, 60));

// Validation: submit with nothing filled
await click(findByText('button', /^Pay /), 'Pay');
await wait(400);
step('checkout validates before charging', /valid Ethiopian mobile|accept the terms/.test(text()));

// Fill in and pay
const phone = doc.querySelector('input[type="tel"]');
await type(phone, '0911234567');
const cb = doc.querySelector('input[type="checkbox"]');
cb.click();
await wait(200);
step('terms checkbox toggles', cb.checked === true, `checked=${cb.checked}`);
await click(findByText('button', /^Pay /), 'Pay again');
await wait(2600);
step('payment succeeds and issues an order ref', /Payment complete/.test(text()) && /AWQ-\d{6}-/.test(text()), text().match(/AWQ-[\w-]+/)?.[0] ?? text().slice(0,80));

// Dashboard
window.history.pushState({}, '', '/dashboard');
window.dispatchEvent(new window.PopStateEvent('popstate'));
await wait(900);
step('dashboard shows the purchased course', /Complete Digital Marketing Masterclass/.test(text()));
step('dashboard does not loop', errors.filter((e) => /Maximum update depth/.test(e)).length === 0);

// Player
window.history.pushState({}, '', '/learn/complete-digital-marketing-masterclass');
window.dispatchEvent(new window.PopStateEvent('popstate'));
await wait(1200);
step('player renders a real <video> with a source',
  Boolean(doc.querySelector('video')?.getAttribute('src')),
  doc.querySelector('video')?.getAttribute('src')?.slice(0, 60) ?? 'none');

// Complete every lesson
let guard = 0;
while (guard++ < 40) {
  const btn = findByText('button', /Mark complete/);
  if (!btn) break;
  await click(btn, 'mark complete');
  await wait(160);
}
step('finishing all lessons unlocks the certificate', /Course complete/.test(text()), `${guard} clicks`);

// Certificate
window.history.pushState({}, '', '/certificate/complete-digital-marketing-masterclass');
window.dispatchEvent(new window.PopStateEvent('popstate'));
await wait(900);
const certText = text();
step('certificate renders with a stable id', /AWQ-MAST-/.test(certText), certText.match(/AWQ-[\w-]+/)?.[0] ?? '');
const firstDate = certText.match(/Issued .*?\d{4}/)?.[0];
window.history.pushState({}, '', '/dashboard');
window.dispatchEvent(new window.PopStateEvent('popstate'));
await wait(500);
window.history.pushState({}, '', '/certificate/complete-digital-marketing-masterclass');
window.dispatchEvent(new window.PopStateEvent('popstate'));
await wait(700);
const secondDate = text().match(/Issued .*?\d{4}/)?.[0];
step('certificate date is stable across visits', Boolean(firstDate) && firstDate === secondDate, `${firstDate} / ${secondDate}`);

console.error = orig;
let bad = 0;
for (const s of steps) { if (!s.ok) bad++; console.log(`${s.ok ? 'PASS' : 'FAIL'}  ${s.name}${s.detail ? `  →  ${s.detail}` : ''}`); }
if (errors.length) { console.log('\nConsole errors:'); errors.slice(0, 6).forEach((e) => console.log('  ! ' + e.slice(0, 240).replace(/\n/g,' '))); }
console.log(bad === 0 ? '\nFull purchase → learn → certificate flow passes.' : `\n${bad} step(s) failed.`);
if (bad > 0 || errors.length > 0) process.exitCode = 1;
