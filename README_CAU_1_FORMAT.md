# 📘 HƯỚNG DẪN & KHUNG MẪU FORMAT VIẾT CÂU 1 (PE PMG201c)
> **Tài liệu chuẩn dành cho phần mềm thi EOS** (Viết bằng Tiếng Anh, phân cấp bằng gạch đầu dòng và số, không dùng bảng kẻ phức tạp).

---

## 📑 MỤC LỤC
1. [Tổng quan về Câu 1 trong đề thi PE](#1-tổng-quan-về-câu-1)
2. [Bộ tiêu chí chuẩn 5 thành phần bắt buộc (Core Elements)](#2-bộ-tiêu-chí-5-thành-phần-bắt-buộc)
3. [DẠNG 1: FORMAT CÂU 1 CHO ĐỀ MỞ (OPEN PROJECT)](#3-dạng-1-format-câu-1-cho-đề-mở-open-project)
   - [Khung sườn mẫu (Template)](#31-khung-sườn-mẫu-đề-mở)
   - [Bài mẫu hoàn chỉnh đạt điểm tối đa (Sample Answer)](#32-bài-mẫu-hoàn-chỉnh-đề-mở)
4. [DẠNG 2: FORMAT CÂU 1 CHO ĐỀ ĐÓNG (CLOSED CASE STUDY)](#4-dạng-2-format-câu-1-cho-đề-đóng-closed-case-study)
   - [Chiến thuật bóc tách dữ kiện từ đề bài](#41-chiến-thuật-bóc-tách-dữ-kiện-từ-đề-bài)
   - [Khung sườn mẫu (Template)](#42-khung-sườn-mẫu-đề-đóng)
   - [Bài mẫu hoàn chỉnh áp dụng Case Study thực tế (Sample Answer: SU26 PE 01)](#43-bài-mẫu-hoàn-chỉnh-đề-đóng)
5. [Các lỗi sai thường gặp khiến bị trừ điểm (Common Traps)](#5-các-lỗi-sai-thường-gặp)
6. [Checklist tự chấm điểm Câu 1 trước khi nộp](#6-checklist-tự-chấm-điểm-câu-1)

---

## 1. TỔNG QUAN VỀ CÂU 1
- **Tên câu hỏi:** Thường là **Request 1** hoặc **Question 1** (Chiếm **20% – 30%** tổng số điểm bài thi PE, tương đương 2.0 – 3.0 điểm).
- **Chủ đề cốt lõi:** **Khởi tạo dự án (Project Initiation)**.
- **Yêu cầu phổ biến:** Viết **Project Charter Statement** (Tuyên ngôn tôn chỉ dự án) hoặc **Project Description** (Mô tả chi tiết đặc trưng dự án).

---

## 2. BỘ TIÊU CHÍ 5 THÀNH PHẦN BẮT BUỘC
Dù đề mở hay đề đóng, bài viết Câu 1 muốn đạt điểm tối đa **bắt buộc phải có đủ 5 phần**:

| STT | Thành phần | Nội dung trọng tâm cần viết |
| :---: | :--- | :--- |
| **1** | **Project Title / Name** | Tên dự án ngắn gọn, rõ ràng, chuyên nghiệp. |
| **2** | **Justifications & Purpose** | - Mục đích dự án làm gì.<br>- **Ít nhất 2 lý do** thuyết phục cần triển khai dự án (*Why implement this project*). |
| **3** | **Customer / Sponsor** | Phân định rõ ai là **Customer** (người thụ hưởng/sử dụng) và ai là **Sponsor** (người rót tiền/phê duyệt). |
| **4** | **Project Constraints** | **BẮT BUỘC đủ 4 ràng buộc (Triple Constraints + Quality):**<br>- **Scope Constraint:** In-scope & Out-of-scope.<br>- **Time Constraint:** Thời gian bắt đầu, kết thúc, tổng số tháng/tuần.<br>- **Cost Constraint:** Ngân sách tối đa không được vượt quá.<br>- **Quality Constraint:** Tiêu chuẩn chất lượng (UAT test, lỗi = 0, % hài lòng). |
| **5** | **Milestones / Timeframe** | 4 mốc thời gian lớn ứng với vòng đời dự án (*Initiation $\rightarrow$ Planning $\rightarrow$ Execution $\rightarrow$ Closure*). |

---

## 3. DẠNG 1: FORMAT CÂU 1 CHO ĐỀ MỞ (OPEN PROJECT)

> **Nhận diện đề:** Đề yêu cầu: *"Select one project in your studying fields at FU (e.g. software project for SE), give the solutions or answers for following requests based on your understanding & assumptions."*

### 3.1. Khung sườn mẫu (Đề mở)
```text
REQUEST 1: PROJECT CHARTER STATEMENT / PROJECT DESCRIPTION

1. Project Name:
   [Tên dự án phần mềm của bạn, VD: FPT Student Learning Management System (SLM)]

2. Project Purpose & Justifications:
   - Purpose: The primary purpose of this project is to develop and deploy an automated, centralized [Tên loại hệ thống] that streamlines [nghiệp vụ chính] and enhances user experience for [đối tượng hưởng lợi].
   - Justification 1 (Operational Efficiency): [Lý do 1: Hiện tại quy trình thủ công tốn thời gian, dễ sai sót, cần tự động hóa].
   - Justification 2 (Data Centralization & Transparency): [Lý do 2: Cần hệ thống tập trung dữ liệu minh bạch, truy xuất báo cáo thời gian thực].
   - Justification 3 (Scalability & Accessibility): [Lý do 3: Hỗ trợ người dùng truy cập mọi lúc mọi nơi trên nền tảng Web/Mobile].

3. Customer and Project Sponsor:
   - Project Customer: [Người dùng cuối, VD: Faculty lecturers, department heads, and students of FPT University].
   - Project Sponsor: [Người cấp tiền/phê duyệt, VD: The Board of Directors / Academic Affairs Department of FPT University].

4. Project Objectives (SMART Goals):
   - Objective 1: Deliver a fully functional system that automates 100% of core workflows within 4 months.
   - Objective 2: Ensure system response time is under 2.0 seconds with a concurrent capacity of at least 5,000 active users.
   - Objective 3: Achieve at least 90% positive user satisfaction score in post-deployment surveys.

5. Project Constraints:
   - Scope Constraint:
     + In-scope: Design, development, testing, and deployment of core modules ([Module 1], [Module 2], [Module 3]), database integration, and user documentation.
     + Out-of-scope: Hardware infrastructure procurement, third-party ERP payroll modules, and lifetime free on-site maintenance.
   - Time Constraint: The project must be completed within strictly [Số tháng] months (from [Tháng/Năm] to [Tháng/Năm]). The deadline is non-negotiable.
   - Cost Constraint: Total project budget is capped at $[Số tiền] (VND [Số tiền]) and must not be exceeded under any circumstances.
   - Quality Constraint: The system must pass 100% of User Acceptance Testing (UAT) test cases with zero critical (severity-1) bugs prior to production release.

6. Project Milestones:
   - Milestone 1 (Initiation): Month 1, Week 2 - Formal Project Charter approval and Stakeholder Register sign-off.
   - Milestone 2 (Planning): Month 1, Week 4 - Detailed WBS, Project Schedule, and Cost Baseline approved.
   - Milestone 3 (Execution & Development): Month 3, Week 2 - Core system development and internal testing completed.
   - Milestone 4 (Testing & UAT): Month 3, Week 4 - Client UAT sign-off and user training finished.
   - Milestone 5 (Closure): Month 4, Week 4 - Production deployment, final project handover, and lessons learned archiving.

7. Project Roles & Resources:
   - Project Manager (PM): 1 person (Overall management, schedule, budget, and stakeholder reporting).
   - Business Analyst (BA): 1 person (Requirement analysis and specification documentation).
   - Developers (Frontend & Backend): 3 persons (Architecture, coding, and API integration).
   - QA / Tester: 1 person (Writing test cases, manual & automated testing).
```

---

### 3.2. Bài mẫu hoàn chỉnh (Đề mở - Chuẩn 10/10)
```text
REQUEST 1: PROJECT CHARTER STATEMENT

1. Project Name:
   FPT University Student Learning Management (SLM) System

2. Project Purpose & Justifications:
   - Purpose: The purpose of the SLM project is to build an integrated, cloud-based learning management portal that centralizes coursework management, grading workflows, and online assignment tracking for both faculty members and students.
   - Justification 1: Currently, learning materials and assignment submissions are fragmented across multiple unofficial channels (Google Drive, email, and social groups), resulting in lost submissions, grading inconsistencies, and high administrative overhead.
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
   - QA / Automation Tester: 1 engineer (Executes regression, security, and load testing).
```

---

## 4. DẠNG 2: FORMAT CÂU 1 CHO ĐỀ ĐÓNG (CLOSED CASE STUDY)

> **Nhận diện đề:** Đề bài cho sẵn một đoạn kịch bản về một sự kiện, chiến dịch hoặc bài toán thực tế (VD: Đề SU26 PE 01 về *Lễ hội ẩm thực Flavours of Vietnam*, Đề SU26 PE 02 về *Định hướng nghề nghiệp tại NEU*...).

### 4.1. Chiến thuật bóc tách dữ kiện từ đề bài
Khi đọc đoạn văn bản kịch bản đề bài cho, hãy dùng bút gạch chân ngay 5 cụm từ khóa sau:
1. **Tên dự án:** Đặt trong dấu ngoặc kép hoặc sau chữ *"called / named..."*.
2. **Khách hàng & Sponsor:** Cơ quan/tổ chức tổ chức dự án (VD: *People's Committee, University, Corporate Partner*).
3. **Mục đích & Lý do:** Thường nằm sau cụm *"The goal is to... / In order to resolve..."*.
4. **Con số ngân sách & Thời gian:** Tìm ký hiệu tiền tệ (*VND, USD, billion*) và mốc thời gian (*3 days, 4 months*).
5. **Giới hạn phạm vi:** Tìm các từ phủ định như *"The scope does not include... / Excluded from the project..."*.

---

### 4.2. Khung sườn mẫu (Đề đóng)
```text
QUESTION 1: NARRATIVE CHARTER STATEMENT

1. Project Title:
   [Lấy chính xác tên dự án trong kịch bản đề cho]

2. Project Purpose & Justifications:
   - Project Purpose: [Trích xuất mục đích chính từ đoạn văn kịch bản đề bài].
   - Reason 1: [Trích xuất nguyên nhân / bài toán thực tế mà đề bài nêu ra].
   - Reason 2: [Trích xuất lợi ích chiến lược / đối tượng thụ hưởng mà đề bài nhắm tới].

3. Customer and Project Sponsor:
   - Customer: [Đối tượng tham gia / thụ hưởng dịch vụ trong đề bài].
   - Sponsor: [Tổ chức / Cơ quan chi tiền tài trợ ngân sách trong đề bài].

4. Project Constraints (Extracted strictly from Scenario):
   - Scope Constraint:
     + In-scope: [Các hạng mục đề bài liệt kê cần thực hiện].
     + Out-of-scope: [Các hạng mục đề bài nêu rõ KHÔNG THUỘC phạm vi dự án].
   - Time Constraint: [Thời gian chuẩn bị và thời gian diễn ra dự án theo đúng con số trong đề].
   - Cost / Budget Constraint: [Tổng kinh phí đề cho, nguồn vốn từ đâu, ghi rõ không được vượt quá].
   - Quality / Compliance Constraint: [Các tiêu chuẩn pháp lý, an toàn, vệ sinh, điểm số hài lòng đề yêu cầu].

5. Project Objectives & Success Criteria:
   - Objective 1: [Chỉ số định lượng đề nêu, VD: số lượng người tham gia, tỷ lệ phần trăm].
   - Objective 2: [Chỉ số an toàn, chất lượng, VD: 0 tai nạn, 0 sự cố].
   - Objective 3: [Chỉ số đánh giá sau dự án, VD: điểm khảo sát >= 4.0/5.0].
```

---

### 4.3. Bài mẫu hoàn chỉnh (Đề đóng - Áp dụng Đề SU26 PE 01 thực tế)
> **Bối cảnh đề SU26 PE 01:** UBND Quận Hoàn Kiếm phối hợp Hiệp hội Du lịch Hà Nội tổ chức Lễ hội ẩm thực "Flavours of Vietnam" tại Hồ Hoàn Kiếm, quy mô 200 gian hàng, ngân sách 3.2 tỷ VND, chuẩn bị 4 tháng, không bán hàng online hay hội chợ thương mại.

```text
QUESTION 1: NARRATIVE PROJECT CHARTER STATEMENT

1. Project Title:
   "Flavours of Vietnam" Local Food and Culture Festival 2026

2. Project Purpose & Justifications:
   - Purpose: To organize a high-profile, three-day local culinary and cultural festival at the Hoan Kiem Lake walking street area, celebrating the traditional gastronomy of all 63 Vietnamese provinces.
   - Reason 1 (Stimulate Tourism): To boost domestic travel demand and attract international visitors to Hanoi during the post-summer off-peak tourist season.
   - Reason 2 (Cultural Preservation & Promotion): To showcase national culinary heritages, connect regional craft artisans with the public, and support local food vendors.
   - Reason 3 (Community Engagement): To create a vibrant cultural destination that generates high social media engagement and promotes Hanoi's friendly tourism image.

3. Customer and Project Sponsor:
   - Customer: Domestic citizens, international tourists visiting Hanoi, and 200 participating food & craft vendors.
   - Project Sponsors: Hoan Kiem District People's Committee (contributing VND 2.0 billion from district cultural fund) and corporate co-sponsors (providing VND 1.2 billion in commercial sponsorship).

4. Project Constraints (Based on Official Scenario):
   - Scope Constraint:
     + In-Scope: Organizing a food market with 200 standard vendor stalls, constructing 3 outdoor folk art stages, setting up a traditional craft experience workshop, establishing a social media photo check-in zone, and arranging security/waste management.
     + Out-of-Scope: Industrial commercial product trade fairs, heavy machinery exhibitions, and any e-commerce / online sales activities under the festival brand.
   - Time Constraint: Total project preparation duration is strictly 4 months before the festival opening date. The live event operates continuously for exactly 3 days (Friday through Sunday).
   - Cost / Budget Constraint: Total allocated expenditure must not exceed VND 3.2 billion (VND 2.0 billion public fund + VND 1.2 billion private sponsorship). Zero budget overrun permitted.
   - Quality & Regulatory Constraint: Must secure 100% of municipal event permits, comply strictly with Hanoi Department of Health food safety & hygiene standards, and adhere to local environmental noise and waste disposal regulations.

5. Project Objectives & Success Criteria:
   - Objective 1 (Footfall Target): Attract a minimum of 50,000 visitors to the festival across the 3 operational days.
   - Objective 2 (Safety Target): Maintain an absolute zero incident record regarding food poisoning, fire hazards, and public security breaches.
   - Objective 3 (Vendor Satisfaction): Achieve a vendor satisfaction rating of at least 4.0 out of 5.0 in the post-festival evaluation survey.

6. High-level Milestones:
   - Milestone 1: Secure all event permits and finalize sponsorship agreements (Month 1).
   - Milestone 2: Complete vendor vetting and booth allocation contracts for 200 stalls (Month 2).
   - Milestone 3: Stage setup, logistics rehearsal, and health inspection clearance (Month 4, Day -3).
   - Milestone 4: Festival Live Operation (Friday - Sunday).
   - Milestone 5: Site cleanup, financial audit, and event debrief report (1 week post-event).
```

---

## 5. CÁC LỖI SAI THƯỜNG GẶP KHIẾN BỊ MẤT ĐIỂM

1. ❌ **Thiếu phần Out-of-scope trong Scope Constraint:**
   - *Hậu quả:* Bị trừ 0.5 điểm vì giám khảo chấm theo tiêu chí quản trị phạm vi của PMBOK (Phải biết rõ việc gì **KHÔNG LÀM** để tránh *Scope Creep*).
   - *Cách khắc phục:* Luôn ghi ít nhất 2 ý `Out-of-scope`.

2. ❌ **Chế lại con số ngân sách hoặc thời gian trong đề đóng:**
   - *Hậu quả:* Bị đánh giá là không đọc đề, mất điểm toàn bộ phần Constraints.
   - *Cách khắc phục:* Đề cho "3.2 tỷ VND" thì phải ghi đúng "VND 3.2 billion", không được tự ý đổi thành "$10,000".

3. ❌ **Mục tiêu (Objectives) không có con số đo lường:**
   - *Ví dụ sai:* "To build a good system that helps students learn better." (Không đo lường được).
   - *Ví dụ đúng:* "To reduce student drop-out rate by 15% within the upcoming academic year."

4. ❌ **Kẻ bảng bằng ký tự gạch dọc `|` phức tạp:**
   - *Hậu quả:* Trên phần mềm EOS của trường, bảng kẻ bằng markdown hoặc HTML rất dễ bị vỡ phông, lệch dòng và biến thành một khối văn bản lộn xộn.
   - *Cách khắc phục:* Dùng phân cấp số thập phân (`1.`, `1.1`, `1.1.1`) hoặc dấu gạch ngang đầu dòng (`-`).

---

## 6. CHECKLIST TỰ CHẤM ĐIỂM CÂU 1 TRƯỚC KHI CHUYỂN SANG CÂU 2

Trước khi làm câu tiếp theo, hãy rà soát nhanh bài làm Câu 1 của bạn theo danh sách sau:
- [ ] Có **Tên dự án** rõ ràng chưa?
- [ ] Có **Mục đích** và ít nhất **2 lý do triển khai** chưa?
- [ ] Đã tách biệt rõ ràng **Customer** và **Sponsor** chưa?
- [ ] Đã có đủ **4 Ràng buộc (Constraints): Scope (In & Out), Time, Cost, Quality** chưa?
- [ ] Các mục tiêu đã có **con số định lượng (SMART)** chưa?
- [ ] Đã có danh sách **Milestones theo mốc thời gian** chưa?
- [ ] Toàn bộ bài làm được viết bằng **Tiếng Anh chuẩn chuyên ngành** chưa?

---
*Tài liệu được biên soạn đồng bộ với bộ đề thi thực tế trên Web App ôn thi PMG201c.*
