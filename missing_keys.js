const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const k in obj) {
    if (typeof obj[k] === 'object') {
      keys = keys.concat(getKeys(obj[k], prefix + k + '.'));
    } else {
      keys.push(prefix + k);
    }
  }
  return keys;
}

const trKeys = getKeys(JSON.parse(fs.readFileSync('client/messages/tr.json', 'utf8')));

// Find all tsx files in admin directories
const stdout = execSync('dir /s /b client\\src\\app\\[locale]\\admin\\*.tsx client\\src\\components\\admin\\*.tsx').toString();
const files = stdout.split('\r\n').filter(Boolean);

let missingKeys = new Set();

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  
  // Find namespace
  const nsMatch = content.match(/useTranslations\('([^']+)'\)/);
  if (!nsMatch) continue;
  const ns = nsMatch[1];
  
  // Find all t('...')
  const tMatches = [...content.matchAll(/t\('([^']+)'\)/g)];
  for (const match of tMatches) {
    const key = match[1];
    const fullKey = ns + '.' + key;
    if (!trKeys.includes(fullKey)) {
      missingKeys.add(fullKey);
    }
  }
}

console.log(JSON.stringify(Array.from(missingKeys), null, 2));
