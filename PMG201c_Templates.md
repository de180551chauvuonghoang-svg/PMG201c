# TỔNG HỢP KIẾN THỨC & FORMAT VIẾT BÀI THI PMG201c (EOS)

Tài liệu tổng hợp toàn bộ kiến thức trọng tâm, công thức tính toán và bộ khung mẫu (Templates) chuẩn trình bày trên phần mềm thi **EOS** (không hỗ trợ kẻ bảng hay vẽ hình) cho môn Quản trị dự án (**PMG201c / PMG202c**).

---

## PHẦN I: CHIẾN THUẬT & PHÂN LOẠI ĐỀ THI

### 1. Phân biệt 2 dạng đề thi
* **Đề mở (Open Project):** Tự chọn một dự án đã từng làm (SWP, SE...) để giải quyết 5–6 yêu cầu (*requests*). 
  * *Chiến thuật:* Chuẩn bị sẵn một "Dự án mẫu" với đầy đủ thông tin và áp dụng bộ khung trả lời cố định.
* **Đề đóng (Closed Case):** Đề cho sẵn kịch bản dự án chi tiết hoặc một chủ đề ngắn gọn (IT, Kinh tế, Marketing) kèm 8–9 câu hỏi.
  * *Chiến thuật:* Đọc kỹ đề, gạch chân các từ khóa (tên tổ chức/cá nhân, con số ngân sách, thời gian, chức năng chính) để bóc tách dữ kiện đưa vào khung lý thuyết.

### 2. Nền tảng Quy trình & Vai trò dự án (SDLC & Roles)
* **5 Giai đoạn phát triển phần mềm (SDLC):**
  1. *Requirement Gathering* (Thu thập yêu cầu)
  2. *System & UI/UX Design* (Thiết kế hệ thống & giao diện)
  3. *Development* (Lập trình / Xây dựng)
  4. *Testing* (Kiểm thử: Unit, Integration, Acceptance test)
  5. *Release / Deployment* (Bàn giao & Triển khai)
* **Các vai trò chính (Roles):**
  * **PM (Project Manager):** Quản lý tiến độ, chi phí, phân bổ nguồn lực và báo cáo.
  * **BA (Business Analyst):** Giao tiếp khách hàng, phân tích nghiệp vụ và viết tài liệu yêu cầu.
  * **UI/UX Designer:** Thiết kế trải nghiệm và giao diện người dùng.
  * **Developer (Dev):** Lập trình hệ thống (Frontend, Backend).
  * **Tester / QA:** Kiểm thử chất lượng phần mềm, tìm lỗi (bugs).

---

## PHẦN II: TỔNG HỢP LÝ THUYẾT & CÔNG THỨC TÍNH TOÁN

### 1. Khởi tạo & Phạm vi dự án (Initiation & Scope)
* **Project Charter (Tuyên ngôn dự án):** Văn bản chính thức khởi động dự án, gồm: Tên dự án, Mục đích (*Purpose*), Khách hàng/Nhà tài trợ (*Customer/Sponsor*), Mục tiêu (*Objectives*), Thời gian (*Timeframe*), Cột mốc (*Milestones*: Initiation, Planning, Execution, Closure), Ràng buộc (*Constraints*: Scope, Time, Cost, Quality), Thành viên (*Roles*), Yêu cầu bậc cao (*High-level Requirements*).
* **Mục tiêu SMART:**
  * **S (Specific):** Cụ thể làm gì, cho hệ thống nào.
  * **M (Measurable):** Con số định lượng cụ thể (VD: 150.000 tài liệu, tốc độ < 3s, độ chính xác 95%).
  * **A (Achievable):** Khả thi dựa trên nguồn lực, công nghệ hiện có.
  * **R (Relevant):** Liên quan và đóng góp trực tiếp vào mục tiêu chung/khách hàng.
  * **T (Time-bound):** Giới hạn thời gian (Mẹo: Đặt mốc sớm hơn thời gian kết thúc dự án 1–2 tháng để chừa thời gian kiểm thử).
* **Phạm vi (Scope):**
  * *In-scope:* Các tính năng/công việc cam kết thực hiện trong đề bài.
  * *Out-of-scope:* Các việc nằm ngoài trách nhiệm (VD: dịch thuật nội dung, cung cấp phần cứng cho người dùng cuối, bảo trì trọn đời miễn phí).
  * *Deliverables:* Sản phẩm bàn giao cụ thể (Phần mềm hoàn chỉnh, Dữ liệu đã xử lý, Tài liệu hướng dẫn sử dụng).

### 2. Cấu trúc phân rã công việc (WBS) & Cấu trúc tổ chức
* **WBS (Work Breakdown Structure):** Chia nhỏ dự án theo cấp bậc số thập phân để dễ trình bày trên EOS:
  * Cấp 1 (`1.`): Tên dự án.
  * Cấp 2 (`1.1`, `1.2`...): Các giai đoạn chính.
  * Cấp 3 (`1.1.1`, `1.1.2`...): Các gói công việc / sản phẩm bàn giao.
  * Cấp 4 (`1.1.1.1`...): Các nhiệm vụ chi tiết.
* **3 Cấu trúc tổ chức dự án:**
  * *Functional (Chức năng):* Chia theo phòng ban chuyên môn, làm song song.
  * *Projectized (Theo dự án):* Team độc lập hoàn toàn cho từng dự án lớn, PM có toàn quyền.
  * *Matrix (Ma trận):* Kết hợp cả hai, PM điều phối linh hoạt nhân sự từ các phòng ban.

### 3. Phân công trách nhiệm (Ma trận RACI) & Các bên liên quan (Stakeholders)
* **Ma trận RACI:**
  * **R (Responsible):** Người trực tiếp làm.
  * **A (Accountable):** Người chịu trách nhiệm cuối cùng & phê duyệt (chỉ có 1 người/công việc).
  * **C (Consulted):** Người được tham vấn ý kiến trước khi làm.
  * **I (Informed):** Người được thông báo kết quả/tiến độ.
* **Phân tích Stakeholders (Power–Interest Grid):**
  * *High Power – High Interest:* **Manage Closely** (Quản lý chặt chẽ, tương tác thường xuyên).
  * *High Power – Low Interest:* **Keep Satisfied** (Giữ cho hài lòng, báo cáo tóm tắt).
  * *Low Power – High Interest:* **Keep Informed** (Cập nhật thông tin đầy đủ).
  * *Low Power – Low Interest:* **Monitor** (Theo dõi định kỳ, tốn ít nỗ lực).
  * *Engagement Levels:* Unaware -> Resistant -> Neutral -> Supportive -> Leading.

### 4. Quản lý Rủi ro (Risk Management)
* Đánh giá dựa trên **Probability** (Khả năng xảy ra: Low/Medium/High) và **Impact** (Tác động: Cost, Time, Scope, Quality).
* **4 Chiến lược phản ứng rủi ro (AMTA):**
  * **Avoid (Tránh né):** Loại bỏ hoàn toàn nguyên nhân gây rủi ro.
  * **Mitigate (Giảm thiểu - Phòng chống):** Hành động trước khi rủi ro xảy ra để giảm xác suất/thiệt hại.
  * **Transfer (Chuyển giao):** Đẩy rủi ro sang bên thứ ba (mua bảo hiểm, thuê ngoài/outsource).
  * **Accept (Chấp nhận):** Chấp nhận rủi ro và chuẩn bị kế hoạch khắc phục (*Contingency Plan*) nếu nó xảy ra.

### 5. Quản lý Tiến độ & Đường găng (CPM - Critical Path Method)
* **4 loại quan hệ công việc:**
  * **FS (Finish-to-Start):** A xong thì B mới bắt đầu (Phổ biến nhất).
  * **SS (Start-to-Start):** A bắt đầu thì B bắt đầu.
  * **FF (Finish-to-Finish):** A xong thì B mới xong.
  * **SF (Start-to-Finish):** A bắt đầu thì B kết thúc (Hiếm gặp).
* **Công thức tính 4 chỉ số thời gian:**
  * **Tính xuôi (Forward Pass - Tìm ES, EF):** Bắt đầu từ `Start` ($\text{ES} = 0$).
    $$\text{EF} = \text{ES} + \text{Duration}$$
    *(Nếu một công việc có nhiều nhánh hội tụ vào: $\text{ES} = \max(\text{EF các việc trước})$)*
  * **Tính ngược (Backward Pass - Tìm LF, LS):** Bắt đầu từ `End` ($\text{LF} = \text{Tổng thời gian đường găng}$).
    $$\text{LS} = \text{LF} - \text{Duration}$$
    *(Nếu một công việc rẽ ra nhiều nhánh sau: $\text{LF} = \min(\text{LS các việc sau})$)*
* **Đường găng (Critical Path) & Độ trễ (Float/Slack):**
  * **Critical Path:** Đường đi từ `Start` đến `End` có tổng thời gian **DÀI NHẤT**. Đây cũng chính là **thời gian tối thiểu (Minimum Duration)** để hoàn thành toàn bộ dự án.
  * **Float (Slack):** Độ linh hoạt của công việc:
    $$\text{Float} = \text{LS} - \text{ES} = \text{LF} - \text{EF}$$
    *(Công việc trên đường găng có $\text{Float} = 0$. Công việc có $\text{Float} > 0$ là công việc có độ linh hoạt cao nhất - Most flexibility).*
* **2 Kỹ thuật rút ngắn tiến độ:**
  * **Crashing:** Bổ sung thêm nguồn lực (nhân sự, tăng ca, tiền bạc) vào các việc trên đường găng để giảm thời gian.
  * **Fast Tracking:** Làm song song (gối đầu) các công việc vốn được lên kế hoạch làm tuần tự.

### 6. Quản lý Chi phí & Giá trị thu được (Cost & EVM)
* **5 Phương pháp ước lượng chi phí:**
  1. *Bottom-up Estimation:* Tính chi tiết từng đầu việc nhỏ rồi cộng lại (Dùng cho *Labor Cost*: $\text{Số giờ} \times \text{Đơn giá}$).
  2. *Parametric Estimation:* Tính theo đơn giá $\times$ số lượng (Dùng cho *Software/Tools Licenses*).
  3. *Expert Judgment:* Tham khảo ý kiến chuyên gia (Dùng cho *Training Cost*).
  4. *Analogous Estimation:* So sánh số liệu từ các dự án tương tự trong quá khứ (Dùng cho *Overhead/Materials*).
  5. *Percentage / Reserve Analysis:* Trích tỷ lệ % (5%–10%) trên tổng chi phí làm quỹ dự phòng (*Contingency Reserve*).
* **Công thức EVM (Earned Value Management):**
  * **BAC (Budget at Completion):** Tổng ngân sách dự kiến ban đầu.
  * **PV (Planned Value):** Giá trị kế hoạch tính đến thời điểm hiện tại:
    $$\text{PV} = \%\text{ Tiến độ kế hoạch} \times \text{BAC}$$
  * **EV (Earned Value):** Giá trị thực tế đã hoàn thành:
    $$\text{EV} = \%\text{ Công việc hoàn thành thực tế} \times \text{BAC}$$
  * **SPI (Schedule Performance Index - Chỉ số hiệu suất tiến độ):**
    $$\text{SPI} = \frac{\text{EV}}{\text{PV}}$$
    * $\text{SPI} < 1$: Dự án đang **chậm tiến độ** (*Behind schedule*) $\rightarrow$ Đề xuất dùng *Crashing* và *Fast Tracking*.
    * $\text{SPI} > 1$: Dự án đang **vượt tiến độ** (*Ahead of schedule*).
    * $\text{SPI} = 1$: Đúng tiến độ (*On schedule*).

---

## PHẦN III: FORMAT MẪU VIẾT BÀI CHUẨN TRÊN EOS (TEMPLATES)

*Lưu ý: Trên phần mềm EOS không thể kẻ bảng hay chèn ảnh, bạn hãy sử dụng dấu gạch ngang (`-`), dấu mũi tên (`->`) và đánh số phân cấp rõ ràng theo các mẫu dưới đây.*

### Template 1: Viết Project Charter
```text
PROJECT CHARTER
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
   - Requirement 3: [Chức năng chính 3]
```

### Template 2: Viết Mục tiêu SMART & Phạm vi (In/Out Scope)
```text
SMART OBJECTIVES:
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
   - [Công việc ngoài lề 1, VD: Translating documents into other languages]
   - [Công việc ngoài lề 2, VD: Providing physical hardware devices for end-users]
   - [Công việc ngoài lề 3, VD: Long-term system maintenance after warranty period]
3. Deliverables:
   - Deliverable 1: Fully functional [Tên phần mềm/hệ thống] deployed on production.
   - Deliverable 2: Processed and digitized database/dataset.
   - Deliverable 3: Technical documentation and User Manuals.
```

### Template 3: Viết Cấu trúc phân rã công việc (WBS)
```text
WORK BREAKDOWN STRUCTURE (WBS)
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
       1.5.2 Project Sign-off & Lessons Learned
```

### Template 4: Liệt kê Hoạt động (Activities) & Ma trận RACI
```text
PROJECT ACTIVITIES & RELATIONSHIPS (Phase: Execution)
- Activity A: Gather and finalize requirements (Duration: 1 week) - Predecessor: None
- Activity B: Design database schema (Duration: 1 week) - Predecessor: A (FS)
- Activity C: Design UI/UX mockups (Duration: 2 weeks) - Predecessor: A (FS)
- Activity D: Develop Backend APIs (Duration: 3 weeks) - Predecessor: B (FS)
- Activity E: Develop Frontend interface (Duration: 3 weeks) - Predecessor: C (FS), D (SS)
... (Liệt kê tối thiểu 10 hoạt động)

RACI MATRIX (Format liệt kê dòng cho EOS)
Roles: PM (Project Manager), BA (Business Analyst), DES (Designer), DEV (Developer), QA (Tester)
- Activity A (Gather requirements): PM (A), BA (R), DES (C), DEV (C), QA (I)
- Activity B (Design database): PM (A), BA (C), DES (I), DEV (R), QA (I)
- Activity C (Design UI/UX): PM (A), BA (C), DES (R), DEV (I), QA (I)
- Activity D (Develop Backend): PM (A), BA (I), DES (I), DEV (R), QA (C)
- Activity E (Develop Frontend): PM (A), BA (I), DES (C), DEV (R), QA (C)
... (Liệt kê đủ cho 10 hoạt động, đảm bảo mỗi dòng chỉ có duy nhất một chữ A)
```

### Template 5: Phân tích Các bên liên quan (Stakeholder Analysis)
```text
STAKEHOLDER ANALYSIS (Power - Interest Grid)
1. Stakeholder 1: [Tên bên liên quan, VD: Project Sponsor / University Board]
   - Role/Interest: Provides budget and approves final outcomes.
   - Power: High | Interest: High
   - Quadrant & Strategy: Manage Closely (Engage regularly, involve in key decisions, send weekly status reports).
   - Engagement Level: Current: Supportive -> Desired: Leading

2. Stakeholder 2: [Tên bên liên quan, VD: End-Users / Students]
   - Role/Interest: Directly uses the system for daily tasks.
   - Power: Low | Interest: High
   - Quadrant & Strategy: Keep Informed (Update on progress, gather feedback during UAT, provide training).
   - Engagement Level: Current: Neutral -> Desired: Supportive
```

### Template 6: Quản lý Rủi ro (Risk Management)
```text
RISK MANAGEMENT PLAN
1. Risk 1: [Tên rủi ro, VD: Scope Creep - Khách hàng thay đổi yêu cầu liên tục]
   - Description: Stakeholders request additional features after design phase is locked.
   - Category/Impact: Scope, Time, and Cost (High impact).
   - Probability: Medium
   - Strategy: Mitigate
   - Mitigation Plan (Phòng chống): Define clear In-scope/Out-of-scope in Project Charter and require formal Change Request approval.
   - Contingency Plan (Khắc phục): Re-prioritize backlog features or negotiate timeline/budget extension with the sponsor.

2. Risk 2: [Tên rủi ro, VD: Key Developer leaves the project]
   - Description: A core backend developer resigns unexpectedly during the coding phase.
   - Category/Impact: Time and Quality (High impact).
   - Probability: Low
   - Strategy: Transfer / Mitigate
   - Mitigation Plan: Enforce strict code documentation, peer code reviews, and knowledge sharing across the team.
   - Contingency Plan: Reallocate tasks to backup developers or hire an external contractor immediately.
```

### Template 7: Quản lý Ngân sách & Ước lượng chi phí (Cost Budget)
```text
COST BUDGET & ESTIMATION METHODS
1. Labor Cost (Chi phí nhân sự): $[Số tiền]
   - Description: Salaries for PM, BA, Developers, and Testers working on the project.
   - Estimation Method: Bottom-up Estimation (Calculated by multiplying estimated working hours of each task by hourly wage rates).

2. Software & Tools Cost (Chi phí phần mềm & công cụ): $[Số tiền]
   - Description: Licenses for cloud servers, IDE, design tools (Figma), and project management software.
   - Estimation Method: Parametric Estimation (Calculated based on unit price per license multiplied by number of users/months).

3. Training Cost (Chi phí đào tạo): $[Số tiền]
   - Description: Workshops and training materials for end-users and staff to operate the new system.
   - Estimation Method: Expert Judgment (Estimated based on consultation with senior trainers and past training sessions).

4. Overhead & Materials Cost (Chi phí vận hành & vật tư): $[Số tiền]
   - Description: Office utilities, internet, backup hard drives, and printed manuals.
   - Estimation Method: Analogous Estimation (Referenced from actual operational expenses of similar past projects).

5. Contingency Reserve (Quỹ dự phòng rủi ro): $[Số tiền]
   - Description: Reserved budget to handle unexpected risks and scope adjustments.
   - Estimation Method: Percentage Reserve Analysis (Calculated as 10% of the total estimated baseline cost).
```

### Template 8: Trình bày bài toán Đường găng (CPM) & EVM
```text
1. NETWORK PATHS & CRITICAL PATH
- Path 1: Start -> A -> B -> D -> End = [Tổng thời gian] weeks
- Path 2: Start -> A -> C -> E -> End = [Tổng thời gian] weeks
- Path 3: Start -> A -> C -> F -> End = [Tổng thời gian] weeks
=> Critical Path: [Đường có tổng thời gian lớn nhất]
=> Minimum Project Duration: [Số tuần của đường găng] weeks.

2. SCHEDULE TABLE (ES, EF, LS, LF, FLOAT)
- Activity A (Duration: X): ES = 0, EF = X | LS = 0, LF = X | Float = 0
- Activity B (Duration: Y): ES = X, EF = X+Y | LS = ..., LF = ... | Float = ...
...
=> Most Flexible Activity: Activity [Tên việc] (because it has the highest Float of [số] weeks).

3. EARNED VALUE MANAGEMENT (EVM) CALCULATION
- Given: BAC = $[Số tiền], Planned Progress = [X]%, Actual Progress = [Y]%
- Planned Value (PV) = [X]% * $[BAC] = $[Kết quả PV]
- Earned Value (EV) = [Y]% * $[BAC] = $[Kết quả EV]
- Schedule Performance Index (SPI) = EV / PV = [Kết quả EV] / [Kết quả PV] = [Chỉ số SPI]
- Evaluation: Since SPI < 1 ([Chỉ số SPI] < 1), the project is currently BEHIND SCHEDULE.
- Corrective Actions: To bring the project back on track, the PM should apply Fast Tracking (performing sequential tasks in parallel) and Crashing (adding more resources/overtime to critical path activities).
```