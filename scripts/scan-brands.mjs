import fs from 'fs';
import path from 'path';

// English forbidden brand names list (word-boundary case-insensitive)
const EN_FORBIDDEN_BRANDS = [
  'CeraVe',
  'Ordinary',
  'Roche',
  'Posay',
  'Nécessaire',
  'Necessaire',
  'YSL',
  'Yves',
  'Maybelline',
  'Fenty',
  'Cosrx',
  'Joseon',
];

// Arabic forbidden brand names list (substring match)
const AR_FORBIDDEN_BRANDS = [
  'سيرافي',
  'أورديناري',
  'اورديناري',
  'لاروش',
  'بوزيه',
  'إيف سان لوران',
  'ايف سان لوران',
  'ميبيلين',
  'فينتي',
  'كوسركس',
];

// Forbidden old slogans (substring match)
const FORBIDDEN_SLOGANS = [
  'أصلي وتقليد',
  'اصلي وتقليد',
];

// Word-boundary case-insensitive regex for English brands
const EN_BRAND_REGEX = new RegExp(`\\b(${EN_FORBIDDEN_BRANDS.join('|')})\\b`, 'i');
// Substring match regex for Arabic brands and old slogans
const AR_REGEX = new RegExp(`(${[...AR_FORBIDDEN_BRANDS, ...FORBIDDEN_SLOGANS].join('|')})`);

function walkDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!['node_modules', '.next', '.git', 'qa-out'].includes(file)) {
        walkDir(fullPath, fileList);
      }
    } else if (/\.(tsx?|jsx?|json|css|md|html|mjs|cjs|svg)$/.test(file)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const targetDirs = ['src', 'data', 'public'].map((d) => path.resolve(process.cwd(), d));
const files = targetDirs.flatMap((dir) => walkDir(dir));

let violationsCount = 0;
const violations = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  lines.forEach((line, lineIdx) => {
    const enMatch = line.match(EN_BRAND_REGEX);
    const arMatch = line.match(AR_REGEX);
    const match = enMatch || arMatch;
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
console.log('                 BRAND SCANNER REPORT (NEUTRAL CATALOG MANDATE)         ');
console.log('========================================================================');
console.log(`Audited ${files.length} text files across src/, data/, public/...`);
console.log(`Protected English Brands: ${EN_FORBIDDEN_BRANDS.join(', ')}`);
console.log(`Protected Arabic Brands: ${AR_FORBIDDEN_BRANDS.join(', ')}`);
console.log(`Protected Old Slogans: ${FORBIDDEN_SLOGANS.join(', ')}`);

if (violationsCount === 0) {
  console.log('Result: PASS. Found 0 forbidden brand names or slogans across all audited files.');
} else {
  console.error(`Result: FAIL. Found ${violationsCount} brand violation(s):`);
  violations.forEach((v) => {
    console.error(`  - ${v.file}:${v.line} -> Violation: "${v.match}" | snippet: ${v.snippet}`);
  });
  process.exit(1);
}
