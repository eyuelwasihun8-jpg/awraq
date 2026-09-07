/**
 * Shared JSDOM harness.
 *
 * The repo previously had no tests of any kind (AUDIT.md §M8). These are
 * deliberately not unit tests: for a store, the questions that matter are
 * "does a purchase grant access?" and "does the certificate date stay put?",
 * and those only have answers when the whole app is running.
 *
 * JSDOM rather than a real browser because the build environment cannot
 * download a Chromium binary. It is enough to catch render crashes, effect
 * loops and broken flows — the three things that were actually shipped.
 */
import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';

const BUNDLE = path.join(process.cwd(), 'tests/.build/bundle.js');

export function loadBundle() {
  if (!fs.existsSync(BUNDLE)) {
    throw new Error('Run `npm run test:build` first (or use `npm test`).');
  }
  return fs.readFileSync(BUNDLE, 'utf8');
}

export function createPage(url = 'http://localhost/') {
  const dom = new JSDOM('<!doctype html><html lang="en"><body><div id="root"></div></body></html>', {
    url,
    pretendToBeVisual: true,
    runScripts: 'outside-only',
  });
  const { window } = dom;

  // JSDOM gaps the app legitimately relies on.
  window.matchMedia ||= (query) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  });
  window.scrollTo = () => {};
  window.HTMLMediaElement.prototype.load = () => {};

  const errors = [];
  const original = console.error;
  console.error = (...args) => {
    const message = args.map(String).join(' ');
    // React's act() advice is noise here; everything else is a real defect.
    if (!/not wrapped in act/.test(message)) errors.push(message);
  };
  window.addEventListener('error', (event) => errors.push(`onerror: ${event.message}`));

  return {
    window,
    document: window.document,
    errors,
    restore: () => {
      console.error = original;
      window.close();
    },
  };
}

export const wait = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
