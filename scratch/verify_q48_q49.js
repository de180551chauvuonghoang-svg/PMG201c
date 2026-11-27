const fs = require('fs');
const code = fs.readFileSync('js/fe_questions.js', 'utf8');
eval(code.replace('const FE_QUESTIONS_TEXT =', 'global.FE_QUESTIONS_TEXT ='));
const list = global.FE_QUESTIONS_TEXT['PMG201c_SPECIAL_TRICK_EXAM'];
console.log('Q48:', JSON.stringify(list[47], null, 2));
console.log('Q49:', JSON.stringify(list[48], null, 2));
console.log('Q50:', JSON.stringify(list[49], null, 2));
