const fs = require('fs');
const path = require('path');

if (!fs.existsSync('js')) fs.mkdirSync('js');
if (!fs.existsSync('css')) fs.mkdirSync('css');

const preview = JSON.parse(fs.readFileSync('js_data_preview.json', 'utf8'));

// Sort FE exams logically (SU26, SP26, FA25, SU25, SP2025, FA2024...)
preview.feExams.sort((a, b) => {
  // Put 50-question sets first
  if (b.totalQuestions !== a.totalQuestions) {
    return b.totalQuestions - a.totalQuestions;
  }
  return a.title.localeCompare(b.title);
});

// Sort PE exams logically
const semOrder = { 'SP26': 1, 'FA25': 2, 'SU25': 3, 'SP25': 4, 'FA24': 5, 'SU24': 6, 'SP24': 7, 'SU23': 8 };
preview.peExams.sort((a, b) => {
  const oA = semOrder[a.semester] || 99;
  const oB = semOrder[b.semester] || 99;
  if (oA !== oB) return oA - oB;
  return a.title.localeCompare(b.title);
});

const templates = [
  {
    id: 'charter',
    name: '1. Project Charter (Tôn chỉ dự án)',
    category: 'Initiation',
    content: `PROJECT CHARTER
1. Project Name: [Tên dự án]
2. Project Purpose / Description: [Mô tả ngắn gọn dự án làm gì, giải quyết vấn đề gì]
3. Customer / Sponsor: [Tên khách hàng / Nhà tài trợ, VD: FPT University]
4. Project Objectives & Success Criteria (SMART):
   - Objective 1: [Mục tiêu cụ thể + con số đo lường + thời hạn]
   - Objective 2: [Mục tiêu cụ thể + con số đo lường + thời hạn]
5. Timeframe: [Từ tháng/năm đến tháng/năm, VD: 01/2026 - 05/2026 (4 months)]
6. Project Milestones:
   - Milestone 1 - Initiation: [Thời gian] - Complete Project Charter & Stakeholder analysis.
   - Milestone 2 - Planning: [Thời gian] - Complete WBS, Schedule, and Budget plan.
   - Milestone 3 - Execution: [Thời gian] - Complete System Development & Testing.
   - Milestone 4 - Closure: [Thời gian] - Final product handover & Project sign-off.
7. Constraints:
   - Scope: Must deliver all core features defined in the requirements.
   - Time: Must be completed strictly within [số tháng/tuần].
   - Cost: Total budget must not exceed [số tiền].
   - Quality: System must pass 100% of UAT test cases with zero critical bugs.
8. Project Roles & Team Members:
   - [Tên thành viên 1] - Project Manager (PM)
   - [Tên thành viên 2] - Business Analyst (BA)
   - [Tên thành viên 3] - UI/UX Designer
   - [Tên thành viên 4] - Developer
   - [Tên thành viên 5] - Tester / QA
9. High-Level Requirements:
   - Requirement 1: [Chức năng chính 1]
   - Requirement 2: [Chức năng chính 2]
   - Requirement 3: [Chức năng chính 3]`
  },
  {
    id: 'smart_scope',
    name: '2. Mục tiêu SMART & Phạm vi (In/Out Scope)',
    category: 'Scope',
    content: `SMART OBJECTIVES:
1. Objective 1: [Tên mục tiêu]
   - Specific: Develop and deploy [tên tính năng/hệ thống] for [đối tượng sử dụng].
   - Measurable: Achieve [con số cụ thể, VD: 95% accuracy / response time under 3 seconds].
   - Achievable: Realistic with the current team of [số lượng] members and available tech stack.
   - Relevant: Directly supports the core goal of [mục tiêu lớn của dự án].
   - Time-bound: Complete by [thời gian cụ thể, sớm hơn deadline dự án 1 tháng].

PROJECT SCOPE:
1. In-Scope Items:
   - [Tính năng/Công việc 1 lấy từ đề bài]
   - [Tính năng/Công việc 2 lấy từ đề bài]
   - [Tính năng/Công việc 3 lấy từ đề bài]
2. Out-of-Scope Items:
   - Translating documents into other unsupported languages.
   - Providing physical hardware devices for end-users.
   - Long-term system maintenance after warranty period.
3. Deliverables:
   - Deliverable 1: Fully functional [Tên hệ thống] deployed on production.
   - Deliverable 2: Processed and digitized database/dataset.
   - Deliverable 3: Technical documentation and User Manuals.`
  },
  {
    id: 'wbs',
    name: '3. Phân cấp công việc (WBS)',
    category: 'Planning',
    content: `WORK BREAKDOWN STRUCTURE (WBS)
1. [Tên Dự Án]
   1.1 Initiation & Planning
       1.1.1 Project Charter Approval
       1.1.2 Requirement Gathering & Analysis
       1.1.3 Project Plan & Schedule Creation
   1.2 System Design
       1.2.1 Database Architecture Design
       1.2.2 UI/UX Wireframe & Prototype Design
   1.3 Development / Execution
       1.3.1 Frontend Development
       1.3.2 Backend & API Development
       1.3.3 Data Processing & Integration
   1.4 Testing & Deployment
       1.4.1 Unit & Integration Testing
       1.4.2 User Acceptance Testing (UAT)
       1.4.3 Production Deployment & User Training
   1.5 Project Closure
       1.5.1 Final Deliverable Handover
       1.5.2 Project Sign-off & Lessons Learned`
  },
  {
    id: 'raci',
    name: '4. Danh sách Hoạt động & Ma trận RACI',
    category: 'Schedule & Roles',
    content: `PROJECT ACTIVITIES & RELATIONSHIPS (Phase: Execution)
- Activity A: Gather and finalize requirements (Duration: 1 week) - Predecessor: None
- Activity B: Design database schema (Duration: 1 week) - Predecessor: A (FS)
- Activity C: Design UI/UX mockups (Duration: 2 weeks) - Predecessor: A (FS)
- Activity D: Develop Backend APIs (Duration: 3 weeks) - Predecessor: B (FS)
- Activity E: Develop Frontend interface (Duration: 3 weeks) - Predecessor: C (FS), D (SS)
- Activity F: Integrate APIs with Frontend (Duration: 2 weeks) - Predecessor: E (FS)
- Activity G: System Testing & Bug Fixing (Duration: 2 weeks) - Predecessor: F (FS)
- Activity H: User Acceptance Testing (UAT) (Duration: 1 week) - Predecessor: G (FS)
- Activity I: Deployment to Production (Duration: 1 week) - Predecessor: H (FS)
- Activity J: Final Handover & Sign-off (Duration: 1 week) - Predecessor: I (FS)

RACI MATRIX (Format chuẩn EOS không kẻ bảng)
Roles: PM (Project Manager), BA (Business Analyst), DES (Designer), DEV (Developer), QA (Tester)
- Activity A (Gather requirements): PM (A), BA (R), DES (C), DEV (C), QA (I)
- Activity B (Design database): PM (A), BA (C), DES (I), DEV (R), QA (I)
- Activity C (Design UI/UX): PM (A), BA (C), DES (R), DEV (I), QA (I)
- Activity D (Develop Backend): PM (A), BA (I), DES (I), DEV (R), QA (C)
- Activity E (Develop Frontend): PM (A), BA (I), DES (C), DEV (R), QA (C)
- Activity F (Integration): PM (A), BA (I), DES (I), DEV (R), QA (C)
- Activity G (System Testing): PM (A), BA (I), DES (I), DEV (C), QA (R)
- Activity H (UAT): PM (A), BA (R), DES (I), DEV (C), QA (C)
- Activity I (Deployment): PM (A), BA (I), DES (I), DEV (R), QA (C)
- Activity J (Final Handover): PM (R, A), BA (C), DES (I), DEV (I), QA (I)`
  },
  {
    id: 'stakeholder',
    name: '5. Phân tích Các bên liên quan (Stakeholders)',
    category: 'Stakeholders',
    content: `STAKEHOLDER ANALYSIS (Power - Interest Grid)
1. Stakeholder 1: [Tên bên liên quan, VD: Project Sponsor / Board of Directors]
   - Role/Interest: Provides funding, sets strategic vision, and approves major milestones.
   - Power: High | Interest: High
   - Quadrant & Strategy: Manage Closely (Engage actively in steering committee meetings, send weekly reports).
   - Engagement Level: Current: Supportive -> Desired: Leading

2. Stakeholder 2: [Tên bên liên quan, VD: End-Users / Department Staff]
   - Role/Interest: Directly operates the software for daily business tasks.
   - Power: Low | Interest: High
   - Quadrant & Strategy: Keep Informed (Consult during requirement & UAT phases, provide comprehensive user guides).
   - Engagement Level: Current: Neutral -> Desired: Supportive

3. Stakeholder 3: [Tên bên liên quan, VD: Compliance / Legal Department]
   - Role/Interest: Ensures regulatory, copyright, and data privacy standards.
   - Power: High | Interest: Low
   - Quadrant & Strategy: Keep Satisfied (Share audit reports, confirm compliance checklist).
   - Engagement Level: Current: Neutral -> Desired: Supportive`
  },
  {
    id: 'risk',
    name: '6. Quản lý Rủi ro (Risk Management Plan)',
    category: 'Risk',
    content: `RISK MANAGEMENT PLAN
1. Risk 1: Scope Creep (Yêu cầu thay đổi liên tục)
   - Description: Client/Stakeholders frequently request additional features during development.
   - Category/Impact: Scope, Time, and Cost (High impact).
   - Probability: Medium
   - Strategy: Mitigate
   - Mitigation Plan: Clearly freeze requirements after planning phase; enforce formal Change Request workflow.
   - Contingency Plan: Re-evaluate project milestones, re-prioritize backlog, or negotiate budget expansion.

2. Risk 2: Key Personnel Turnover (Nhân sự cốt lõi nghỉ việc)
   - Description: Lead backend engineer or PM leaves the project mid-way.
   - Category/Impact: Time and Quality (High impact).
   - Probability: Low
   - Strategy: Transfer / Mitigate
   - Mitigation Plan: Maintain modular architecture, standard documentation, and conduct daily code reviews.
   - Contingency Plan: Assign tasks to cross-trained team members or contract a pre-vetted external expert.`
  },
  {
    id: 'budget',
    name: '7. Ngân sách & 5 Phương pháp ước lượng chi phí',
    category: 'Cost',
    content: `COST BUDGET & 5 ESTIMATION METHODS
1. Labor Cost (Chi phí nhân sự): $[Số tiền]
   - Description: Salaries for PM, BA, Designers, Developers, and Testers.
   - Estimation Method: Bottom-up Estimation (Calculated by multiplying estimated task hours by respective hourly wage rates).

2. Software & Tooling Cost (Chi phí phần mềm/công cụ): $[Số tiền]
   - Description: Cloud hosting (AWS/Azure), database subscriptions, Figma licenses, domain.
   - Estimation Method: Parametric Estimation (Unit cost per user/month multiplied by duration and headcount).

3. Training & Onboarding Cost (Chi phí đào tạo): $[Số tiền]
   - Description: User manuals, instructional webinars, and admin training sessions.
   - Estimation Method: Expert Judgment (Consulted with senior technical instructors based on past rollouts).

4. Operational & Overhead Cost (Chi phí vận hành): $[Số tiền]
   - Description: Office utilities, high-speed fiber internet, and testing hardware devices.
   - Estimation Method: Analogous Estimation (Derived from historical records of similar prior software projects).

5. Contingency Reserve (Quỹ dự phòng rủi ro): $[Số tiền]
   - Description: Dedicated financial buffer for unforeseen technical hurdles and scope adjustments.
   - Estimation Method: Percentage Reserve Analysis (Allocated as 10% of total project baseline budget).`
  },
  {
    id: 'cpm_evm',
    name: '8. Sơ đồ mạng (CPM) & Công thức EVM chuẩn',
    category: 'Schedule & EVM',
    content: `CRITICAL PATH METHOD (CPM) & EVM CALCULATION

1. NETWORK PATHS & CRITICAL PATH:
- Path 1: Start -> A -> B -> D -> G -> End = [Thời gian 1] weeks
- Path 2: Start -> A -> C -> E -> G -> End = [Thời gian 2] weeks
- Path 3: Start -> A -> C -> F -> G -> End = [Thời gian 3] weeks
=> Critical Path: [Tên đường có tổng thời gian dài nhất]
=> Minimum Project Duration: [Thời gian đường găng] weeks.

2. ACTIVITY FLOAT & FLEXIBILITY:
- Float (Slack) = LS - ES = LF - EF
- Activities on Critical Path have Float = 0 (No flexibility).
- Activity with maximum positive Float is the MOST FLEXIBLE activity.

3. EARNED VALUE MANAGEMENT (EVM) CALCULATION:
- Given:
  * BAC (Budget at Completion) = $[Tổng ngân sách]
  * Planned % = [X]%
  * Actual % = [Y]%
  * Actual Cost (AC) = $[Chi phí thực tế đã chi]
- Planned Value (PV) = Planned % * BAC = $[Kết quả PV]
- Earned Value (EV) = Actual % * BAC = $[Kết quả EV]
- Cost Variance (CV) = EV - AC = $[Kết quả CV]
- Schedule Variance (SV) = EV - PV = $[Kết quả SV]
- Cost Performance Index (CPI) = EV / AC = [Chỉ số CPI]
- Schedule Performance Index (SPI) = EV / PV = [Chỉ số SPI]
- Evaluation & Recommendations:
  * If SPI < 1: Project is Behind Schedule. Action: Apply Fast Tracking (parallelize tasks) and Crashing (add staff/overtime on critical path).
  * If CPI < 1: Project is Over Budget. Action: Optimize resource allocation, control scope creep, reduce non-critical expenses.`
  }
];

const guideContent = fs.readFileSync('PMG201c_Templates.md', 'utf8');

const jsContent = `/**
 * PMG201c Exam Practice Hub Data Store
 * Generated automatically
 */

const APP_DATA = ${JSON.stringify({
  peExams: preview.peExams,
  feExams: preview.feExams,
  templates: templates,
  guideMarkdown: guideContent
}, null, 2)};
`;

fs.writeFileSync('js/data.js', jsContent);
console.log('js/data.js created successfully! PE exams:', preview.peExams.length, 'FE exams:', preview.feExams.length);
