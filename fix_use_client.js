const fs = require('fs');
const { execSync } = require('child_process');

const stdout = execSync('dir /s /b client\\src\\app\\[locale]\\admin\\*.tsx client\\src\\components\\admin\\*.tsx').toString();
const files = stdout.split('\r\n').filter(Boolean);

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  let lines = content.split('\n');
  
  const useClientIndex = lines.findIndex(l => {
    const trimmed = l.trim().replace(/;$/, ''); // remove trailing semicolon
    return trimmed === "'use client'" || trimmed === '"use client"';
  });
  
  if (useClientIndex > 0) {
    // Found 'use client' but not on first line
    console.log(`Fixing ${f}`);
    
    // Remove the 'use client' line
    const useClientLine = lines.splice(useClientIndex, 1)[0];
    
    // Add it to the top
    lines.unshift(useClientLine);
    
    fs.writeFileSync(f, lines.join('\n'));
  }
}
