const fs = require('fs');
const path = require('path');

const dirs = [
  'C:\\site-project\\hostihub\\client\\src\\app\\[locale]\\admin',
  'C:\\site-project\\hostihub\\client\\src\\components\\admin'
];

const localeDir = 'C:\\site-project\\hostihub\\client\\messages';
const locales = ['en', 'de', 'tr'];
let translations = {};

locales.forEach(loc => {
  const p = path.join(localeDir, `${loc}.json`);
  if (fs.existsSync(p)) {
    translations[loc] = JSON.parse(fs.readFileSync(p, 'utf8'));
  } else {
    translations[loc] = {};
  }
  if (!translations[loc].Admin) translations[loc].Admin = {};
});

function slugify(text) {
  return text
    .trim()
    .replace(/[\s_]+/g, '')
    .replace(/[^\w]/g, '')
    .substring(0, 15);
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Ensure useTranslations is imported
  if (!content.includes('useTranslations')) {
    content = `import { useTranslations } from 'next-intl';\n` + content;
  }

  // Ensure t is defined
  if (!content.includes('const t = useTranslations(')) {
    content = content.replace(/export (default )?function (\w+)\([^)]*\) {/, (match) => {
      return `${match}\n  const t = useTranslations('Admin');`;
    });
  }

  let match;
  // Match text inside JSX tags
  const regex = />([^<>{}\n]+)</g;
  let matches = [];
  while ((match = regex.exec(content)) !== null) {
    matches.push(match);
  }

  for (let i = matches.length - 1; i >= 0; i--) {
    const m = matches[i];
    const text = m[1].trim();
    if (text.length > 1 && /[a-zA-ZğüşöçİĞÜŞÖÇ]/.test(text) && !text.match(/^[0-9\W]+$/)) {
      const key = slugify(text) || `Key${Math.floor(Math.random()*1000)}`;
      
      // Update translations
      locales.forEach(loc => {
        if (!translations[loc].Admin[key]) {
          translations[loc].Admin[key] = text; // Just putting original text for all for now to save time
        }
      });

      // Update content
      const start = m.index + 1; // after >
      const end = m.index + m[0].length - 1; // before <
      content = content.substring(0, start) + `{t('${key}')}` + content.substring(end);
    }
  }

  // also replace hardcoded attributes like placeholder="..."
  const attrRegex = /placeholder="([^"]+)"/g;
  let attrMatches = [];
  while ((match = attrRegex.exec(content)) !== null) {
    attrMatches.push(match);
  }

  for (let i = attrMatches.length - 1; i >= 0; i--) {
    const m = attrMatches[i];
    const text = m[1].trim();
    if (text.length > 1) {
      const key = slugify(text) || `Key${Math.floor(Math.random()*1000)}`;
      
      locales.forEach(loc => {
        if (!translations[loc].Admin[key]) {
          translations[loc].Admin[key] = text;
        }
      });

      const start = m.index;
      const end = m.index + m[0].length;
      content = content.substring(0, start) + `placeholder={t('${key}')}` + content.substring(end);
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else {
      processFile(fullPath);
    }
  }
}

dirs.forEach(traverse);

locales.forEach(loc => {
  const p = path.join(localeDir, `${loc}.json`);
  fs.writeFileSync(p, JSON.stringify(translations[loc], null, 2), 'utf8');
});

console.log('Done!');
