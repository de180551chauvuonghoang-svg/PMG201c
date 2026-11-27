const fs = require('fs');
let content = fs.readFileSync('js/fe_questions.js', 'utf8');
content = content.replace('const FE_QUESTIONS_TEXT =', 'global.FE_QUESTIONS_TEXT =');
eval(content);

const allExams = global.FE_QUESTIONS_TEXT;

const list = [
  // Cụm 1: Process Groups
  ['PMG201c_FESP24_1814', 13], // Time and resources -> Executing (C)
  ['PMG201c_RESP24_1862', 4],  // Best time to assign PM -> Initiating (A)
  ['PMG201c_SP26_FE_6358', 24], // Scope statement created -> Planning (B)
  ['PMG201c_SU25_RE_4834', 41], // Create detailed budget -> Planning (B)
  ['PMG201c_RESP24_1862', 42], // Completing requirements -> Executing (C)

  // Cụm 2: Power/Interest Grid
  ['PMG201c_SP26_FE_6358', 46], // Low/Low -> Monitor (A)
  ['PMG201c_FA2024_FE_3127', 48], // Low int/High pow -> Keep Satisfied (B)
  ['PMG201c_SU26_FE_7251', 44], // High int/Low pow -> Keep Informed (D)
  ['PMG201c_SP2025_FE_3814', 48], // High int/High pow -> Manage Closely (C)

  // Cụm 3: Stakeholder Engagement
  ['PMG201c_FA2024_FE_3127', 49], // Assist any way -> Supportive (A)
  ['PMG201c_SP26_FE_6358', 14],  // Explain benefits to outside -> Leading (D)
  ['PMG201c_FA2024_RE_3167', 50], // Neither opposed nor supportive -> Neutral (B)

  // Cụm 4: RACI Matrix
  ['PMG201c_FA2024_FE_3127', 37], // Informed -> Kept updated (C)
  ['PMG201c_SU25_RE_4834', 6],   // Accountable -> Making final decision (B)
  ['PMG201c_SP26_RE_6506', 49],  // Responsible -> Completing work (A)
  ['PMG201c_SP26_FE_6358', 2],   // Consulted -> Providing subject matter expertise (A)

  // Cụm 5: Dependencies
  ['PMG201c_FA2024_RE_3167', 4],  // Cannot be completed any other way -> Mandatory (C)
  ['PMG201c_SU26_FEHCM_7269', 17], // Local govt approval before building -> External (D)
  ['PMG201c_FA2024_FE_3127', 17], // Test system refreshed with test data -> Internal (B)
  ['PMG201c_FESP24_1814', 34],   // Activity involves government agency -> External (D)

  // Cụm 6: Conflict Resolution
  ['PMG201c_SU25_RE_4834', 20],  // Morning & Afternoon -> Compromising (A)
  ['PMG201c_FA2024_FE_3127', 36], // Suppose other PM will support in future -> Smoothing (B)

  // Cụm 7: PDM Relationships (Online modules)
  ['PMG201c_SU26_FEHCM_7269', 18], // Review begin before develop finish -> Start to finish (B)
  ['PMG201c_FA25_RE_5711', 14],   // Develop begin before review begin -> Start to start (D)
  ['PMG201c_FE_SU2023_646', 5],    // Develop finish before review finish -> Finish to finish (D)

  // Cụm 8: Negative Risk Response (Threats)
  ['PMG201c_FA2024_FE_3127', 45], // Accept risk -> not consider but establish contingency (A)
  ['PMG201c_SU25_FE_4759', 41],   // Mitigate risk -> reduce probability and/or impact (D)

  // Cụm 9: Positive Risk Response (Opportunities)
  ['PMG201c_FA2024_RE_3167', 40], // Exploit risk -> add steps to make certain opportunity captured (B)
  ['PMG201c_SU26_FEHCM_7269', 45], // Enhance risk -> increase probability and/or impact (D)

  // Cụm 10: Communication Flow
  ['PMG201c_SU26_FEHCM_7269', 40], // Downward -> Direct reports (C)
  ['PMG201c_SP26_RE_6506', 36],   // Upward -> Senior management (A)
  ['PMG201c_FA2024_FE_3127', 40], // Lateral -> Peers (D)

  // Cụm 11: Communication Channels
  ['PMG201c_FA2024_RE_3167', 33], // 8 people -> 28 channels (C)
  ['PMG201c_SP26_RE_6506', 37],   // 1 more dev added (9 people) -> 36 channels (D)

  // Cụm 12: Constraint vs Assumption
  ['PMG201c_RESP24_1862', 37],    // Sponsor informed: at most 50% -> Constraint (D)
  ['PMG201c_FA2024_FE_3127', 12], // You thinking: at least 50% -> Assumption (D)

  // Cụm 13: Estimating Techniques
  ['PMG201c_FESP24_1814', 50],    // Similar project adding/subtracting -> Analogous (B)
  ['PMG201c_SU26_FEHCM_7269', 23], // 20,000 hrs, 25% larger, $25/hr -> Parametric (A)
  ['PMG201c_SU26_FE_7251', 48],   // Not previously done by company -> Three-point (B)

  // Cụm 14: SPI
  ['PMG201c_FE_SU2023_646', 27],  // SPI > 1 -> Ahead of schedule (C)
  ['PMG201c_SP2025_FE_3814', 28], // SPI < 1 -> Behind schedule (B)

  // Cụm 15: CPI
  ['PMG201c_FE_FA2023_1189', 50], // CPI > 1 -> under budget (B)
  ['PMG201c_FA2024_RE_3167', 49], // CPI < 1 -> over budget (C)

  // Cụm 16: Matrix Organization
  ['PMG201_TE2_SU2023_676', 7],   // 3 types: Weak, Balanced and Strong (C)
  ['PMG201c_FA2024_FE_3127', 2],  // Not mentioned one: Medium Matrix (A)

  // Cụm 17: Cost Categories (Direct/Indirect vs Variable/Fixed)
  ['PMG201c_SP26_FE_6358', 3],    // Direct or Indirect (A, B)
  ['PMG201c_SU25_FE_4759', 18],   // Variable or Fixed (A, B)

  // Cụm 18: Critical Path Duration on Network Table
  ['PMG201c_FA2024_FE_3127', 20], // Critical path = 14 (D)
  ['PMG201c_SU26_FEHCM_7269', 20], // Critical path = 9 (B)
  ['PMG201c_SP2025_RE_3866', 20]  // Critical path = 11 (C)
];

let allExist = true;
list.forEach(([examKey, num], idx) => {
  const imgPath = 'FE/' + examKey + '/Cau_' + String(num).padStart(2, '0') + '.webp';
  if (!fs.existsSync(imgPath)) {
    console.log('Missing image at index ' + (idx+1) + ': ' + imgPath);
    allExist = false;
  }
});

console.log('All 50 images exist on disk?', allExist);
