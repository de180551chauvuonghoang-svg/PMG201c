const fs = require('fs');
const content = fs.readFileSync('js/fe_questions.js', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('"PMG201c_SP26_RE_6506": [')) {
    for (let j = i; j < i + 400; j++) {
      if (lines[j].includes('"number": 15')) {
        console.log('Found Q15 at line', j + 1);
        console.log(lines.slice(j - 1, j + 15).join('\n'));
        break;
      }
    }
    break;
  }
}
