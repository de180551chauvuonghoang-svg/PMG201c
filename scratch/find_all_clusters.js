const fs = require('fs');
let content = fs.readFileSync('js/fe_questions.js', 'utf8');
content = content.replace('const FE_QUESTIONS_TEXT =', 'global.FE_QUESTIONS_TEXT =');
eval(content);

const allExams = global.FE_QUESTIONS_TEXT;

// Collect all unique questions across all regular exams (ignore default_pmg201c and SPECIAL_TRICK_EXAM)
const uniqueQuestions = new Map();

for (const [examKey, qList] of Object.entries(allExams)) {
  if (examKey === 'default_pmg201c' || examKey === 'PMG201c_SPECIAL_TRICK_EXAM') continue;
  
  qList.forEach((q, idx) => {
    if (!q.question || !q.options) return;
    // Normalize question text
    const cleanQ = q.question.toLowerCase().replace(/\s+/g, ' ').trim();
    if (cleanQ.startsWith('true or false') || cleanQ.includes('true/false')) return; // ignore true/false
    
    // Check if options are true/false
    const optVals = Object.values(q.options).map(v => v.toLowerCase().trim());
    if (optVals.includes('true') && optVals.includes('false')) return;
    
    if (!uniqueQuestions.has(cleanQ)) {
      uniqueQuestions.set(cleanQ, {
        rawQuestion: q.question,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation,
        exam: examKey,
        num: q.number || (idx + 1),
        imagePath: q.imagePath || ''
      });
    }
  });
}

console.log('Total non-True/False unique questions:', uniqueQuestions.size);

// Group unique questions by normalized options set
const optionGroups = new Map();

for (const [qText, qData] of uniqueQuestions.entries()) {
  // Normalize each option string
  const normOpts = Object.values(qData.options)
    .map(v => v.toLowerCase().replace(/[^a-z0-9]/g, '').trim())
    .filter(Boolean)
    .sort()
    .join('###');
    
  if (!normOpts || normOpts.length < 5) continue;
  
  if (!optionGroups.has(normOpts)) {
    optionGroups.set(normOpts, []);
  }
  optionGroups.get(normOpts).push(qData);
}

// Find groups with > 1 question
const clusters = [];
for (const [key, group] of optionGroups.entries()) {
  if (group.length > 1) {
    clusters.push(group);
  }
}

console.log('Found option groups with > 1 question:', clusters.length);
clusters.sort((a, b) => b.length - a.length);

clusters.forEach((group, i) => {
  console.log('\n=== GROUP ' + (i + 1) + ' (' + group.length + ' questions) ===');
  const optSummary = Object.entries(group[0].options).map(([k,v]) => k + ': ' + v).join(' | ');
  console.log('Options:', optSummary);
  group.forEach((q, j) => {
    console.log('  Q' + (j + 1) + ' [Ans: ' + JSON.stringify(q.answer) + '] [' + q.exam + ' Q' + q.num + ']: ' + q.rawQuestion.substring(0, 85) + '...');
  });
});
