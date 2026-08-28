import fs from 'fs';
import vm from 'node:vm';

const htmlContent = fs.readFileSync('D:/Web THCS Đồng Tân/index.html', 'utf8');

// Extract all <script> contents
const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let scriptIndex = 0;

console.log("Analyzing index.html script tags...");

const sandbox = {
  console: console,
  window: {
    location: {
      protocol: 'file:',
      href: 'file:///D:/Web%20THCS%20Đồng%20Tân/index.html',
      pathname: '/D:/Web%20THCS%20Đồng%20Tân/index.html',
      origin: 'null'
    },
    document: {
      createElement: () => ({ relList: { supports: () => false } }),
      querySelectorAll: () => [],
      getElementById: () => ({ innerHTML: '', children: [] }),
      head: { appendChild: () => {} },
      body: { appendChild: () => {} }
    },
    localStorage: {
      getItem: () => null,
      setItem: () => {}
    }
  },
  document: {
    createElement: () => ({ relList: { supports: () => false } }),
    querySelectorAll: () => [],
    getElementById: () => ({ innerHTML: '', children: [] }),
    head: { appendChild: () => {} },
    body: { appendChild: () => {} }
  },
  navigator: { userAgent: 'Chrome' },
  fetch: () => Promise.reject(new Error("TypeError: Failed to fetch on file://")),
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval
};

vm.createContext(sandbox);

while ((match = scriptRegex.exec(htmlContent)) !== null) {
  const code = match[1];
  if (!code.trim()) continue;
  scriptIndex++;
  console.log(`Executing Script #${scriptIndex} (${code.length} bytes)...`);
  try {
    vm.runInContext(code, sandbox);
    console.log(`✅ Script #${scriptIndex} executed successfully!`);
  } catch (err) {
    console.error(`❌ Script #${scriptIndex} FAILED with error:`, err);
  }
}
