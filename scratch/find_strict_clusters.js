const fs = require('fs');
let content = fs.readFileSync('js/fe_questions.js', 'utf8');
content = content.replace('const FE_QUESTIONS_TEXT =', 'global.FE_QUESTIONS_TEXT =');
eval(content);

const allExams = global.FE_QUESTIONS_TEXT;

// Collect unique questions
const uniqueQuestions = new Map();

for (const [examKey, qList] of Object.entries(allExams)) {
  if (examKey === 'default_pmg201c' || examKey === 'PMG201c_SPECIAL_TRICK_EXAM') continue;
  
  qList.forEach((q, idx) => {
    if (!q.question || !q.options) return;
    const cleanQ = q.question.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
    if (cleanQ.startsWith('true or false') || cleanQ.includes('true false')) return;
    
    const optVals = Object.values(q.options).map(v => v.toLowerCase().trim());
    if (optVals.includes('true') && optVals.includes('false')) return;
    
    if (!uniqueQuestions.has(cleanQ)) {
      uniqueQuestions.set(cleanQ, {
        cleanQ,
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

// Group by normalized options
const optionGroups = new Map();

for (const [qText, qData] of uniqueQuestions.entries()) {
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

// Filter only groups with DIFFERENT questions AND DIFFERENT answers
const trickClusters = [];
for (const [key, group] of optionGroups.entries()) {
  const uniqueQTexts = new Set(group.map(q => q.cleanQ));
  const uniqueAnswers = new Set(group.map(q => q.answer.sort().join(',')));
  
  if (uniqueQTexts.size > 1 && uniqueAnswers.size > 1) {
    trickClusters.push(group);
  }
}

trickClusters.sort((a, b) => b.length - a.length);

console.log('Total True Trick Clusters (Same Options, Different Question, Different Answer):', trickClusters.length);

trickClusters.forEach((group, i) => {
  console.log('\n======================================================');
  console.log('CLUSTERS ' + (i + 1) + ' (' + group.length + ' questions)');
  const optSummary = Object.entries(group[0].options).map(([k,v]) => '[' + k + '] ' + v).join('\n  ');
  console.log('Options:\n  ' + optSummary);
  console.log('Questions:');
  group.forEach((q, j) => {
    console.log('  ' + (j + 1) + '. [Ans: ' + JSON.stringify(q.answer) + '] [' + q.exam + ' Q' + q.num + ']:');
    console.log('     ' + q.rawQuestion);
  });
});
