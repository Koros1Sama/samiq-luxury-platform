import fs from 'fs';
import path from 'path';

// Regex for Unicode emojis (pictographs, emoticons, dingbats, etc.)
// Excludes standard typography arrows (\u2190-\u2193) and bullets (\u2022)
const EMOJI_REGEX = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git' && file !== 'qa-out') {
        walkDir(fullPath, fileList);
      }
    } else if (/\.(tsx?|jsx?|json|css|md)$/.test(file)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const files = walkDir(path.resolve(process.cwd(), 'src'));
let violationsCount = 0;
const violations = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  lines.forEach((line, lineIdx) => {
    const match = line.match(EMOJI_REGEX);
    if (match) {
      violationsCount++;
      violations.push({
        file: path.relative(process.cwd(), file),
        line: lineIdx + 1,
        match: match[0],
        snippet: line.trim().slice(0, 80),
      });
    }
  });
}

console.log('========================================================================');
console.log('                 EMOJI SCANNER REPORT (ZERO EMOJI MANDATE)              ');
console.log('========================================================================');
console.log(`Audited ${files.length} source files in src/...`);

if (violationsCount === 0) {
  console.log('Result: PASS. Found 0 emojis across all production source files in src/.');
} else {
  console.error(`Result: FAIL. Found ${violationsCount} emoji violation(s):`);
  violations.forEach((v) => {
    console.error(`  - ${v.file}:${v.line} -> Emoji: "${v.match}" | snippet: ${v.snippet}`);
  });
  process.exit(1);
}
