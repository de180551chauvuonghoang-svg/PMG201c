const fs = require('fs');
const path = require('path');

console.log('=== BẮT ĐẦU QUÉT VÀ CẬP NHẬT TẤT CẢ ĐỀ THI LÊN WEB APP ===');

// 1. Quét toàn bộ đề PE
const PE_DIR = path.join(__dirname, 'PE');
const semOrder = { 'SU26': 1, 'SP26': 2, 'FA25': 3, 'SU25': 4, 'SP25': 5, 'FA24': 6, 'SU24': 7, 'SP24': 8, 'SU23': 9 };
const peExams = [];

if (fs.existsSync(PE_DIR)) {
  const semesters = fs.readdirSync(PE_DIR).filter(f => fs.statSync(path.join(PE_DIR, f)).isDirectory());

  semesters.forEach(sem => {
    const semDir = path.join(PE_DIR, sem);
    const subdirs = fs.readdirSync(semDir).filter(f => fs.statSync(path.join(semDir, f)).isDirectory());

    subdirs.forEach(sub => {
      const examDir = path.join(semDir, sub);
      const files = fs.readdirSync(examDir).filter(f => {
        const ext = path.extname(f).toLowerCase();
        return ['.pdf', '.png', '.jpg', '.jpeg', '.jfif', '.webp'].includes(ext);
      });

      if (files.length > 0) {
        // Ưu tiên file pdf hoặc file ảnh đầu tiên
        const file = files[0];
        const ext = path.extname(file).toLowerCase();
        const type = ext === '.pdf' ? 'pdf' : 'image';
        
        // Chuẩn hóa tiêu đề hiển thị
        let displayTitle = `${sem} - ${sub}`;
        if (type === 'image') displayTitle += ' 🖼️';

        peExams.push({
          id: `${sem}_${sub}`,
          semester: sem,
          title: displayTitle,
          filename: file,
          type: type,
          path: `PE/${sem}/${sub}/${file}`
        });
      } else {
        console.log(`⚠️ Thư mục trống: PE/${sem}/${sub}`);
      }
    });
  });
}

// Sắp xếp các đề PE theo kỳ mới nhất trước (SU26 -> SP26 -> FA25 ...)
peExams.sort((a, b) => {
  const oA = semOrder[a.semester] || 99;
  const oB = semOrder[b.semester] || 99;
  if (oA !== oB) return oA - oB;
  return a.title.localeCompare(b.title);
});

console.log(`✓ Đã quét thành công ${peExams.length} đề PE từ các học kỳ:`, [...new Set(peExams.map(p => p.semester))]);

// 2. Quét toàn bộ đề FE
const FE_DIR = path.join(__dirname, 'FE');
const feExams = [];

if (fs.existsSync(FE_DIR)) {
  const feDirs = fs.readdirSync(FE_DIR).filter(f => fs.statSync(path.join(FE_DIR, f)).isDirectory());

  feDirs.forEach(folderName => {
    const examDir = path.join(FE_DIR, folderName);
    const files = fs.readdirSync(examDir).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return ['.webp', '.png', '.jpg', '.jpeg'].includes(ext);
    });

    // Sắp xếp các câu hỏi theo số thứ tự Cau_01, Cau_02...
    files.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/) || '0', 10);
      const numB = parseInt(b.match(/\d+/) || '0', 10);
      return numA - numB;
    });

    // Định dạng tiêu đề hiển thị đẹp
    let title = folderName.replace(/^PMG201c?_?/i, '').replace(/_/g, ' ');
    if (folderName === 'PMG201_TE2_SU2023_676') title = 'TE2 SU2023 676';

    feExams.push({
      id: folderName,
      title: `${title} (${files.length} câu)`,
      folder: `FE/${folderName}`,
      totalQuestions: files.length,
      questions: files
    });
  });
}

// Sắp xếp đề FE: Ưu tiên bộ 50 câu lên đầu, sau đó sắp theo chữ cái
feExams.sort((a, b) => {
  if (b.totalQuestions !== a.totalQuestions) {
    return b.totalQuestions - a.totalQuestions;
  }
  return a.title.localeCompare(b.title);
});

console.log(`✓ Đã quét thành công ${feExams.length} bộ đề FE với tổng số ${feExams.reduce((s, e) => s + e.totalQuestions, 0)} câu hỏi!`);

// 3. Đọc templates và cẩm nang
const guideMarkdown = fs.existsSync('PMG201c_Templates.md') ? fs.readFileSync('PMG201c_Templates.md', 'utf8') : '';

// 10 Khung mẫu thi chuẩn EOS (bao gồm 2 mẫu Câu 1 riêng biệt cho Đề Mở và Đề Đóng)
const templates = [
  {
    id: 'charter_open',
    name: '1.1 [CÂU 1] Project Charter - Đề Mở (Tự chọn đề)',
    category: 'Initiation',
    content: `REQUEST 1: PROJECT CHARTER STATEMENT

1. Project Name:
   FPT University Student Learning Management (SLM) System

2. Project Purpose & Justifications:
   - Purpose: The purpose of the SLM project is to build an integrated, cloud-based learning management portal that centralizes coursework management, grading workflows, and online assignment tracking for both faculty members and students.
   - Justification 1: Currently, learning materials and assignment submissions are fragmented across multiple unofficial channels, resulting in lost submissions, grading inconsistencies, and high administrative overhead.
   - Justification 2: The university requires an automated, audit-ready grading repository that connects directly with the central Academic Portal to generate real-time grade transcripts and attendance analytics.
   - Justification 3: Provides 24/7 self-service access for students to monitor their continuous academic standing, submit homework, and receive immediate instructor feedback.

3. Customer and Project Sponsor:
   - Customer: Over 25,000 university students, 600 academic lecturers, and department academic officers at FPT University.
   - Sponsor: Academic Affairs Directorate and the Board of Trustees of FPT University (authorizes capital expenditure and project charter).

4. Project Objectives (SMART):
   - Objective 1: Develop and launch 4 core modules (Course Catalog, Assignment Submission, Gradebook, and Attendance Tracker) within a 4-month timeframe.
   - Objective 2: Ensure system stability with 99.8% server uptime and page response times below 1.5 seconds under 3,000 concurrent student connections.
   - Objective 3: Achieve a minimum of 90% positive adoption and satisfaction rating from surveyed lecturers and students within the first semester of rollout.

5. Project Constraints:
   - Scope Constraint:
     + In-scope: Software UI/UX design, backend RESTful APIs, database migration, role-based access control, UAT verification, and end-user training guides.
     + Out-of-scope: University tuition fee payment gateway processing, physical classroom attendance hardware installation, and third-party commercial LMS licensing.
   - Time Constraint: The project schedule is strictly time-boxed to 16 calendar weeks (4 months), commencing on February 1, 2026, and completing on May 25, 2026.
   - Cost Constraint: Total expenditure is capped at $15,000 (equivalent to VND 375,000,000), covering labor costs, cloud server hosting, and security auditing.
   - Quality Constraint: Zero Severity-1 (blocker) and Severity-2 (critical) defects allowed at release. Must comply with ISO/IEC 25010 software quality standards and GDPR personal data protection principles.

6. Project Milestones:
   - Milestone 1 (Project Kick-off & Charter Approval): End of Week 2.
   - Milestone 2 (Detailed Architecture & WBS Baselined): End of Week 4.
   - Milestone 3 (Core Module Code Freeze & Alpha Testing): End of Week 10.
   - Milestone 4 (Beta Testing & UAT Acceptance Sign-off): End of Week 14.
   - Milestone 5 (Production Handover & Project Closure): End of Week 16.

7. Key Roles & Assigned Headcount:
   - Project Manager: 1 lead (Responsible for triple constraint management and CCB governance).
   - Business Analyst: 1 senior (Translates academic regulations into technical user stories).
   - Software Engineers: 2 Full-stack Developers (Spring Boot & React framework).
   - QA / Automation Tester: 1 engineer (Executes regression, security, and load testing).`
  },
  {
    id: 'charter_closed',
    name: '1.2 [CÂU 1] Project Charter - Đề Đóng (Theo kịch bản)',
    category: 'Initiation',
    content: `QUESTION 1: NARRATIVE PROJECT CHARTER STATEMENT

1. Project Title:
   [Điền chính xác tên dự án trong kịch bản đề cho, VD: "Flavours of Vietnam" Local Food and Culture Festival 2026]

2. Project Purpose & Justifications:
   - Purpose: [Trích xuất mục đích chính từ đoạn văn kịch bản đề bài].
   - Reason 1 (Strategic Impact): [Trích xuất bài toán thực tế hoặc mục tiêu thúc đẩy kinh tế/du lịch đề bài nêu].
   - Reason 2 (Target Beneficiaries): [Trích xuất đối tượng hưởng lợi trực tiếp từ dự án].
   - Reason 3 (Community / Brand Value): [Lợi ích quảng bá hoặc kết nối cộng đồng].

3. Customer and Project Sponsor:
   - Customer: [Đối tượng người tham gia / người thụ hưởng dịch vụ trong đề bài].
   - Project Sponsor(s): [Cơ quan / Đơn vị cấp vốn ngân sách và nhà tài trợ thương mại theo đúng con số trong đề].

4. Project Constraints (Extracted strictly from Scenario):
   - Scope Constraint:
     + In-Scope: [Các hạng mục đề bài liệt kê cụ thể cần tổ chức/xây dựng].
     + Out-of-Scope: [Các hạng mục đề bài nêu rõ KHÔNG THUỘC phạm vi dự án].
   - Time Constraint: [Thời gian chuẩn bị và thời gian triển khai thực tế theo đúng kịch bản đề bài].
   - Cost / Budget Constraint: [Tổng kinh phí đề cho, phân bổ nguồn vốn, ghi rõ không được vượt quá].
   - Quality & Regulatory Constraint: [Các giấy phép cần xin, tiêu chuẩn an toàn, vệ sinh, PCCC, hoặc điểm hài lòng yêu cầu].

5. Project Objectives & Success Criteria:
   - Objective 1: [Chỉ số định lượng người tham gia hoặc hoàn thành theo đề].
   - Objective 2: [Chỉ số an toàn, bảo mật: 0 tai nạn, 0 sự cố].
   - Objective 3: [Chỉ số đánh giá sau sự kiện: điểm khảo sát >= 4.0/5.0].

6. High-level Milestones:
   - Milestone 1: Secure all administrative permits and execute sponsorship agreements.
   - Milestone 2: Complete vendor onboarding, logistics vetting, and contracts.
   - Milestone 3: Operational rehearsal, health & safety inspection clearance.
   - Milestone 4: Live event / project operational rollout.
   - Milestone 5: Site teardown, financial auditing, and final closure report.`
  },
  {
    id: 'wbs_waterfall',
    name: '2. WBS Mô hình Waterfall (Thác nước)',
    category: 'Scope & WBS',
    content: `WORK BREAKDOWN STRUCTURE (WBS) - WATERFALL MODEL
1. Initiation Phase
   1.1 Conduct Stakeholder Kick-off Meeting
   1.2 Draft & Finalize Project Charter
   1.3 Identify Project Stakeholders & Create Stakeholder Register
   1.4 Secure Formal Charter Sign-off
2. Planning Phase
   2.1 Scope Planning & Detailed Requirements Specification
   2.2 Develop Work Breakdown Structure (WBS) & Dictionary
   2.3 Construct Project Schedule & Critical Path Network Diagram
   2.4 Estimate Project Budget & Resource Allocation Matrix (RAM)
   2.5 Formulate Risk Management Plan & Risk Register
3. Design Phase
   3.1 Architectural System Design
   3.2 Database Schema & ERD Design
   3.3 UI/UX Wireframing & Interactive Prototyping
   3.4 Technical Architecture Review & Client Approval
4. Development Phase
   4.1 Database Setup & Backend API Development
   4.2 Core Business Logic Implementation
   4.3 Frontend Interface & User Interaction Coding
   4.4 Third-party API & Payment Gateway Integration
5. Testing & Verification Phase
   5.1 Unit Testing & Code Quality Reviews
   5.2 Integration & End-to-End System Testing
   5.3 Security, Vulnerability & Performance Benchmark Testing
   5.4 User Acceptance Testing (UAT) with Client
6. Deployment & Closure Phase
   6.1 Production Server Setup & Cloud Deployment
   6.2 User Training Workshops & Operation Manual Delivery
   6.3 System Handover & Final Project Acceptance Sign-off
   6.4 Document Lessons Learned & Archive Project Records`
  },
  {
    id: 'wbs_agile',
    name: '3. WBS Mô hình Agile / Scrum (Lặp)',
    category: 'Scope & WBS',
    content: `WORK BREAKDOWN STRUCTURE (WBS) - AGILE / SCRUM MODEL
1. Project Envisioning & Sprint 0
   1.1 Create Product Vision & High-level Roadmap
   1.2 Build & Prioritize Initial Product Backlog
   1.3 Define Definition of Done (DoD) & Acceptance Criteria
   1.4 Setup Development Environments, CI/CD Pipeline & GitHub Repository
2. Sprint 1 - Core Foundations & Authentication
   2.1 Sprint Planning & Task Breakdown
   2.2 User Management & Authentication Service (Login/Register/OAuth)
   2.3 Database Schema Migration & Base API Setup
   2.4 Daily Standups & Continuous Integration
   2.5 Sprint 1 Review (Live Demo) & Retrospective
3. Sprint 2 - Primary Feature Module Development
   3.1 Sprint Planning & Backlog Refinement
   3.2 Implement Core Business Workflows
   3.3 Frontend Component Building & API Binding
   3.4 Automated Testing & Code Review
   3.5 Sprint 2 Review & Retrospective
4. Sprint 3 - Advanced Features & Integration
   4.1 Sprint Planning & Estimations
   4.2 Implement Reporting, Analytics & Search Filters
   4.3 Payment & Notification Integration
   4.4 System Integration & Performance Tuning
   4.5 Sprint 3 Review & Retrospective
5. Release & Project Closure
   5.1 Final Regression Testing & Bug Fixing
   5.2 Production Release & Deployment
   5.3 Handover Documentation & User Training
   5.4 Final Project Retrospective & Archive`
  },
  {
    id: 'ram_raci',
    name: '4. Ma trận Phân công Trách nhiệm (RAM / RACI)',
    category: 'Resource',
    content: `RESPONSIBILITY ASSIGNMENT MATRIX (RAM - RACI CHART)
Roles:
- PM: Project Manager
- BA: Business Analyst
- DEV: Development Team (Frontend & Backend)
- QA: Quality Assurance / Tester
- SP: Project Sponsor / Client

Tasks / Deliverables                  | PM | BA | DEV | QA | SP
--------------------------------------|----|----|-----|----|---
1. Develop Project Charter            | A  | C  |  I  | I  | R
2. Collect & Document Requirements   | A  | R  |  C  | C  | C
3. System Architecture & UI Design    | A  | C  |  R  | I  | I
4. Core System Coding & Integration   | A  | I  |  R  | I  | I
5. Unit & System Testing             | A  | I  |  C  | R  | I
6. User Acceptance Testing (UAT)      | A  | C  |  I  | C  | R
7. Production Deployment              | A  | I  |  R  | C  | I
8. Final Project Sign-off & Handover  | R  | I  |  I  | I  | A

Key:
- R (Responsible): The doer of the activity.
- A (Accountable): The sole decision-maker with final approval/veto authority.
- C (Consulted): Subject matter expert consulted for opinions/advice.
- I (Informed): Kept updated on progress and results.`
  },
  {
    id: 'stakeholder',
    name: '5. Phân tích Bên liên quan (Stakeholder Matrix)',
    category: 'Stakeholder',
    content: `STAKEHOLDER ANALYSIS & ENGAGEMENT PLAN
1. Stakeholder 1: Project Sponsor (Ban Giám đốc / Nhà tài trợ)
   - Role/Interest: Ultimate project owner, funds the budget, expects on-time ROI.
   - Power: High | Interest: High
   - Quadrant & Strategy: Manage Closely (Weekly status reports, executive milestone meetings).
   - Engagement Level: Current: Supportive -> Desired: Leading

2. Stakeholder 2: End-Users / Department Staff
   - Role/Interest: Directly operates the software for daily business tasks.
   - Power: Low | Interest: High
   - Quadrant & Strategy: Keep Informed (Consult during requirement & UAT phases, provide comprehensive user guides).
   - Engagement Level: Current: Neutral -> Desired: Supportive

3. Stakeholder 3: Compliance & Legal Department
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

// Tạo nội dung file js/data.js mới
const dataJsContent = `/**
 * PMG201c Exam Practice Hub Data Store
 * Generated dynamically by scanning workspace PE and FE folders
 * Updated at: ${new Date().toISOString()}
 */

const APP_DATA = ${JSON.stringify({
  peExams: peExams,
  feExams: feExams,
  templates: templates,
  guideMarkdown: guideMarkdown
}, null, 2)};
`;

fs.writeFileSync('js/data.js', dataJsContent, 'utf8');
console.log(`\n🎉 THÀNH CÔNG: Đã cập nhật toàn bộ dữ liệu đề vào js/data.js!`);
console.log(`- Tổng số đề PE: ${peExams.length} đề`);
console.log(`- Tổng số bộ đề FE: ${feExams.length} đề`);
console.log(`- Các học kỳ PE hiện có: ${[...new Set(peExams.map(p => p.semester))].join(', ')}`);
