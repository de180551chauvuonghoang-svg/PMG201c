const fs = require('fs');

let content = fs.readFileSync('js/fe_questions.js', 'utf8');
content = content.replace('const FE_QUESTIONS_TEXT =', 'global.FE_QUESTIONS_TEXT =');
eval(content);

const allExams = global.FE_QUESTIONS_TEXT;

function findQ(examKey, num) {
  const exam = allExams[examKey];
  if (!exam) return null;
  return exam.find(q => q.number === num);
}

// 18 Pure Clusters definition (Exact 50 questions, Q23 placeholder disabled)
const clustersDef = [
  {
    clusterNum: 1,
    title: "5 Quy Trình Dự Án (Process Groups)",
    optionsOverview: "Initiating | Planning | Executing | Monitoring & Controlling | Closing",
    questions: [
      {
        exam: 'PMG201c_FESP24_1814',
        num: 13,
        trickKeyword: "Time and resources",
        trickTip: "Giai đoạn tốn nhiều thời gian và tài nguyên nhất của dự án luôn là Executing (Thực thi).",
        ansDesc: "Executing (C)"
      },
      {
        exam: 'PMG201c_RESP24_1862',
        num: 4,
        trickKeyword: "Best time to assign a project manager",
        trickTip: "Thời điểm lý tưởng nhất để bổ nhiệm Project Manager là ngay trong giai đoạn Khởi tạo (Initiating).",
        ansDesc: "Initiating (A)"
      },
      {
        exam: 'PMG201c_SP26_FE_6358',
        num: 24,
        trickKeyword: "Project Scope Statement created",
        trickTip: "Bản tuyên bố phạm vi dự án (Project Scope Statement) được lập trong giai đoạn Lập kế hoạch (Planning).",
        ansDesc: "Planning (B)"
      },
      {
        exam: 'PMG201c_SU25_RE_4834',
        num: 41,
        trickKeyword: "Create a detailed project budget",
        trickTip: "Lập dự toán ngân sách chi tiết (Detailed Project Budget) thuộc giai đoạn Lập kế hoạch (Planning).",
        ansDesc: "Planning (B)"
      },
      {
        exam: 'PMG201c_RESP24_1862',
        num: 42,
        trickKeyword: "Completing the requirements of the project",
        trickTip: "Tập trung hoàn thành các yêu cầu công việc thực tế của dự án là quy trình Thực thi (Executing).",
        ansDesc: "Executing (C)"
      }
    ]
  },
  {
    clusterNum: 2,
    title: "Ma Trận Quyền Hạn & Mức Độ Quan Tâm (Power / Interest Grid)",
    optionsOverview: "Monitor | Keep Satisfied | Keep Informed | Manage Closely",
    questions: [
      {
        exam: 'PMG201c_SP26_FE_6358',
        num: 46,
        trickKeyword: "low interest / low power",
        trickTip: "Thấp cả hai ➔ Chỉ cần theo dõi tối thiểu (Monitor with minimum effort).",
        ansDesc: "Monitor (A)"
      },
      {
        exam: 'PMG201c_FA2024_FE_3127',
        num: 48,
        trickKeyword: "low interest / high power (hoặc high power / low interest)",
        trickTip: "Quyền lực cao nhưng ít quan tâm ➔ Làm họ hài lòng (Keep Satisfied) để không bị cản trở.",
        ansDesc: "Keep Satisfied (B)"
      },
      {
        exam: 'PMG201c_SU26_FE_7251',
        num: 44,
        trickKeyword: "high interest / low power",
        trickTip: "Quan tâm nhiều nhưng quyền lực thấp ➔ Luôn cập nhật thông tin cho họ (Keep Informed).",
        ansDesc: "Keep Informed (D)"
      },
      {
        exam: 'PMG201c_SP2025_FE_3814',
        num: 48,
        trickKeyword: "high interest / high power",
        trickTip: "Cả hai đều cao (nhân vật VIP/quyết định) ➔ Quản lý chặt chẽ, sát sao nhất (Manage Closely).",
        ansDesc: "Manage Closely (C)"
      }
    ]
  },
  {
    clusterNum: 3,
    title: "Mức Độ Tham Gia Của Stakeholder (Stakeholder Engagement Levels)",
    optionsOverview: "Unaware | Resistant | Neutral | Supportive | Leading",
    questions: [
      {
        exam: 'PMG201c_FA2024_FE_3127',
        num: 49,
        trickKeyword: "willing to assist you in any way",
        trickTip: "Sẵn sàng hỗ trợ bạn mọi cách khi cần ➔ Supportive (Ủng hộ).",
        ansDesc: "Supportive (A)"
      },
      {
        exam: 'PMG201c_SP26_FE_6358',
        num: 14,
        trickKeyword: "talking to people outside the team to explain the benefits",
        trickTip: "Chủ động đi truyền bá, giải thích lợi ích dự án ra bên ngoài ➔ Leading (Dẫn dắt / Tiên phong).",
        ansDesc: "Leading (D)"
      },
      {
        exam: 'PMG201c_FA2024_RE_3167',
        num: 50,
        trickKeyword: "neither opposed to your project nor is supportive",
        trickTip: "Không phản đối cũng không nhiệt tình ủng hộ ➔ Neutral (Trung lập).",
        ansDesc: "Neutral (B)"
      }
    ]
  },
  {
    clusterNum: 4,
    title: "Ma Trận Phân Công Trách Nhiệm RACI (RAM)",
    optionsOverview: "Completing the work (R) | Making the final decision (A) | Providing subject matter expertise (C) | Being kept updated about project progress (I)",
    questions: [
      {
        exam: 'PMG201c_SU26_FEHCM_7269',
        num: 37,
        trickKeyword: "those responsible persons are",
        trickTip: "Responsible (R) = Người trực tiếp bắt tay thực hiện công việc (Completing the work - Đáp án D).",
        ansDesc: "Completing the work (D)"
      },
      {
        exam: 'PMG201c_SU25_RE_4834',
        num: 6,
        trickKeyword: "those accountable persons are",
        trickTip: "Accountable (A) = Người chịu trách nhiệm giải trình cuối cùng / ra quyết định chốt (Making the final decision - Đáp án B).",
        ansDesc: "Making the final decision (B)"
      },
      {
        exam: 'PMG201c_SP26_FE_6358',
        num: 2,
        trickKeyword: "those consulted persons are",
        trickTip: "Consulted (C) = Chuyên gia cố vấn, tham vấn ý kiến chuyên môn (Providing subject matter expertise - Đáp án A).",
        ansDesc: "Providing subject matter expertise (A)"
      },
      {
        exam: 'PMG201c_FA2024_FE_3127',
        num: 37,
        trickKeyword: "those informed persons are",
        trickTip: "Informed (I) = Người được cập nhật tiến độ dự án (Being kept updated about project progress - Đáp án C).",
        ansDesc: "Being kept updated about project progress (C)"
      }
    ]
  },
  {
    clusterNum: 5,
    title: "Phân Loại Quan Hệ Phụ Thuộc (Dependency Types)",
    optionsOverview: "Discretionary | Internal | Mandatory | External",
    questions: [
      {
        exam: 'PMG201c_FA2024_RE_3167',
        num: 4,
        trickKeyword: "cannot be completed any other way",
        trickTip: "Bản chất vật lý hoặc quy định bắt buộc, không thể làm cách nào khác ➔ Mandatory (Bắt buộc / Hard logic).",
        ansDesc: "Mandatory (C)"
      },
      {
        exam: 'PMG201c_SU26_FEHCM_7269',
        num: 17,
        trickKeyword: "local government approval of proposed building design",
        trickTip: "Phụ thuộc vào cơ quan chính quyền bên ngoài quyền hạn của đội dự án ➔ External (Bên ngoài).",
        ansDesc: "External (D)"
      },
      {
        exam: 'PMG201c_FA2024_FE_3127',
        num: 17,
        trickKeyword: "test system must be refreshed with your test data",
        trickTip: "Đội dự án tự chuẩn bị dữ liệu kiểm thử trước khi chạy test ➔ Phụ thuộc nội bộ do chính dự án kiểm soát ➔ Internal (Nội bộ - Đáp án B).",
        ansDesc: "Internal (B)"
      }
    ]
  },
  {
    clusterNum: 6,
    title: "Phương Pháp Giải Quyết Xung Đột (Conflict Resolution)",
    optionsOverview: "Compromising | Smoothing | Confronting | Forcing",
    questions: [
      {
        exam: 'PMG201c_SU25_RE_4834',
        num: 20,
        trickKeyword: "work in the morning and afternoon (cưa đôi mỗi bên nửa ngày)",
        trickTip: "Mỗi bên chịu thiệt nhượng bộ một nửa để chia sẻ nguồn lực ➔ Compromising (Thỏa hiệp - Đáp án A).",
        ansDesc: "Compromising (A)"
      },
      {
        exam: 'PMG201c_FA2024_FE_3127',
        num: 36,
        trickKeyword: "suppose that the other project manager will support you in the future",
        trickTip: "Nhường hẳn nhân sự cho đối phương để giữ hòa khí và hy vọng tương lai được hỗ trợ lại ➔ Smoothing / Accommodating (Xoa dịu / Nhượng bộ - Đáp án B).",
        ansDesc: "Smoothing (B)"
      }
    ]
  },
  {
    clusterNum: 7,
    title: "Mối Quan Hệ Thứ Tự PDM (Precedence Diagramming Method)",
    optionsOverview: "Finish to start | Start to finish | Finish to finish | Start to start",
    questions: [
      {
        exam: 'PMG201c_SU26_FEHCM_7269',
        num: 18,
        trickKeyword: "review needs to BEGIN before develop can FINISH",
        trickTip: "Bắt đầu cái này trước khi cái kia kết thúc ➔ Start to Finish (SF - Đáp án B).",
        ansDesc: "Start to finish (B)"
      },
      {
        // Câu 23: Placeholder bị loại bỏ theo yêu cầu, không hiện ảnh, không hiện đáp án
        isPlaceholder: true,
        trickKeyword: "Câu 23 đã loại bỏ (Không hiển thị ảnh và đáp án)",
        trickTip: "Câu hỏi này đã được bỏ qua khỏi nội dung thi theo yêu cầu của bạn để giữ nguyên thứ tự 50 câu.",
        ansDesc: "Đã bỏ qua"
      },
      {
        exam: 'PMG201c_FE_SU2023_646',
        num: 5,
        trickKeyword: "develop needs to FINISH before review can FINISH",
        trickTip: "Kết thúc cái này trước khi cái kia kết thúc ➔ Finish to Finish (FF - Đáp án D).",
        ansDesc: "Finish to finish (D)"
      }
    ]
  },
  {
    clusterNum: 8,
    title: "Chiến Lược Ứng Phó Rủi Ro Tiêu Cực (Negative Risks / Threats)",
    optionsOverview: "Accept | Avoid | Transfer | Mitigate",
    questions: [
      {
        exam: 'PMG201c_FA2024_FE_3127',
        num: 45,
        trickKeyword: "accept a risk",
        trickTip: "Chấp nhận rủi ro = Không chủ động thay đổi kế hoạch nhưng lập kế hoạch dự phòng (actively do not consider but establish contingency plan).",
        ansDesc: "Accept (A)"
      },
      {
        exam: 'PMG201c_SP26_FE_6358',
        num: 26,
        trickKeyword: "transfer a risk",
        trickTip: "Chuyển giao rủi ro = Thay đổi kế hoạch để bên thứ ba chịu trách nhiệm về rủi ro (another party will be responsible for the risk - ví dụ mua bảo hiểm, thuê ngoài).",
        ansDesc: "Transfer (C)"
      },
      {
        exam: 'PMG201c_SU25_FE_4759',
        num: 41,
        trickKeyword: "mitigate a risk",
        trickTip: "Giảm thiểu rủi ro = Giảm xác suất và/hoặc tác động (reduce probability and/or impact).",
        ansDesc: "Mitigate (D)"
      }
    ]
  },
  {
    clusterNum: 9,
    title: "Chiến Lược Ứng Phó Cơ Hội Tích Cực (Positive Risks / Opportunities)",
    optionsOverview: "Accept | Exploit | Share | Enhance",
    questions: [
      {
        exam: 'PMG201c_FA2024_RE_3167',
        num: 40,
        trickKeyword: "exploit a risk / opportunity",
        trickTip: "Khai thác cơ hội (Exploit) = Bổ sung các bước để chắc chắn 100% cơ hội xảy ra (make certain the opportunity is captured).",
        ansDesc: "Exploit (B)"
      },
      {
        exam: 'PMG201c_SU26_FEHCM_7269',
        num: 45,
        trickKeyword: "enhance a risk / opportunity",
        trickTip: "Nâng cao cơ hội (Enhance) = Làm tăng xác suất và/hoặc tác động tích cực (increase the probability and/or impact).",
        ansDesc: "Enhance (D)"
      }
    ]
  },
  {
    clusterNum: 10,
    title: "Chiều Hướng Giao Tiếp (Communication Flow)",
    optionsOverview: "Senior management | Social groups | Direct reports | Peers",
    questions: [
      {
        exam: 'PMG201c_SU26_FEHCM_7269',
        num: 40,
        trickKeyword: "Downward communication",
        trickTip: "Giao tiếp từ trên xuống = Gửi cho cấp dưới trực tiếp (Your direct reports / subordinates).",
        ansDesc: "Direct reports (C)"
      },
      {
        exam: 'PMG201c_SP26_RE_6506',
        num: 36,
        trickKeyword: "Upward communication",
        trickTip: "Giao tiếp từ dưới lên = Báo cáo ban lãnh đạo cấp cao (Your senior management).",
        ansDesc: "Senior management (A)"
      },
      {
        exam: 'PMG201c_FA2024_FE_3127',
        num: 40,
        trickKeyword: "Lateral communication",
        trickTip: "Giao tiếp ngang hàng = Trao đổi cùng đồng nghiệp ngang cấp (Your peers).",
        ansDesc: "Peers (D)"
      }
    ]
  },
  {
    clusterNum: 11,
    title: "Tính Số Kênh Giao Tiếp [ N*(N-1)/2 ]",
    optionsOverview: "28 | 36 | 45 | 55",
    questions: [
      {
        exam: 'PMG201c_FA2024_RE_3167',
        num: 33,
        trickKeyword: "yourself + tester + 5 devs + communicator = 8 người",
        trickTip: "N = 8 người ➔ Công thức 8 * 7 / 2 = 28 kênh giao tiếp (Đáp án C).",
        ansDesc: "28 channels (C)"
      },
      {
        exam: 'PMG201c_SP26_RE_6506',
        num: 37,
        trickKeyword: "thêm 1 developer vì chậm tiến độ = 9 người",
        trickTip: "N = 9 người ➔ Công thức 9 * 8 / 2 = 36 kênh giao tiếp (Đáp án D).",
        ansDesc: "36 channels (D)"
      }
    ]
  },
  {
    clusterNum: 12,
    title: "Ràng Buộc (Constraint) vs Giả Định (Assumption)",
    optionsOverview: "Poor planning | Wishful thinking | A project demand | A constraint / An assumption",
    questions: [
      {
        exam: 'PMG201c_RESP24_1862',
        num: 37,
        trickKeyword: "sponsor informed you: assigned AT MOST 50%",
        trickTip: "Nhà tài trợ áp đặt mức trần tối đa không được vượt quá ➔ Ràng buộc: A constraint (Đáp án D).",
        ansDesc: "A constraint (D)"
      },
      {
        exam: 'PMG201c_FA2024_FE_3127',
        num: 12,
        trickKeyword: "you do so thinking that: assigned AT LEAST 50%",
        trickTip: "Bạn tự suy nghĩ/kỳ vọng trong lúc lên kế hoạch mà chưa được xác thực ➔ Giả định: An assumption (Đáp án D).",
        ansDesc: "An assumption (D)"
      }
    ]
  },
  {
    clusterNum: 13,
    title: "Phương Pháp Ước Tính (Estimating Techniques)",
    optionsOverview: "Analogous | Parametric | Three-point | Bottom-up",
    questions: [
      {
        exam: 'PMG201c_FESP24_1814',
        num: 50,
        trickKeyword: "looking at a similar project and adding or subtracting",
        trickTip: "Dựa vào dự án tương tự trong quá khứ rồi cộng trừ điều chỉnh ➔ Analogous estimating (Ước tính tương tự - Đáp án B).",
        ansDesc: "Analogous (B)"
      },
      {
        exam: 'PMG201c_SU26_FEHCM_7269',
        num: 23,
        trickKeyword: "20,000 hours, 25% larger, $25 per hour",
        trickTip: "Có tham số toán học và đơn giá nhân chia cụ thể ($25/h) ➔ Parametric estimating (Ước tính tham số - Đáp án A).",
        ansDesc: "Parametric (A)"
      },
      {
        exam: 'PMG201c_SU26_FE_7251',
        num: 48,
        trickKeyword: "NOT been previously done by company",
        trickTip: "Công ty chưa từng làm bao giờ, độ bất định cao ➔ Ước tính 3 điểm: Three-point estimating (Đáp án B).",
        ansDesc: "Three-point (B)"
      }
    ]
  },
  {
    clusterNum: 14,
    title: "Chỉ Số Tiến Độ SPI (Schedule Performance Index)",
    optionsOverview: "on schedule | behind schedule | ahead of schedule",
    questions: [
      {
        exam: 'PMG201c_FE_SU2023_646',
        num: 27,
        trickKeyword: "SPI is greater than 1 (> 1)",
        trickTip: "SPI > 1 là tiến độ vượt kỳ vọng ➔ ahead of schedule (Trước tiến độ - Đáp án C).",
        ansDesc: "ahead of schedule (C)"
      },
      {
        exam: 'PMG201_TE2_SU2023_676',
        num: 33,
        trickKeyword: "SPI is lesser than 1 (< 1)",
        trickTip: "SPI < 1 là tiến độ chậm ➔ behind schedule (Sau tiến độ / trễ - Đáp án B).",
        ansDesc: "behind schedule (B)"
      }
    ]
  },
  {
    clusterNum: 15,
    title: "Chỉ Số Chi Phí CPI (Cost Performance Index)",
    optionsOverview: "on budget | under budget | over budget",
    questions: [
      {
        exam: 'PMG201c_FE_FA2023_1189',
        num: 50,
        trickKeyword: "CPI is greater than 1 (> 1)",
        trickTip: "CPI > 1 là chi phí tốt, ít tốn kém hơn kế hoạch ➔ under budget (Dưới ngân sách / Tiết kiệm - Đáp án B).",
        ansDesc: "under budget (B)"
      },
      {
        exam: 'PMG201c_FA2024_RE_3167',
        num: 49,
        trickKeyword: "CPI is lesser than 1 (< 1)",
        trickTip: "CPI < 1 là chi phí tệ, tiêu hao vượt kế hoạch ➔ over budget (Vượt ngân sách - Đáp án C).",
        ansDesc: "over budget (C)"
      }
    ]
  },
  {
    clusterNum: 16,
    title: "Mô Hình Tổ Chức Ma Trận (Matrix Organizations)",
    optionsOverview: "Medium Matrix | Weak Matrix | Balanced Matrix | Strong Matrix",
    questions: [
      {
        exam: 'PMG201_TE2_SU2023_676',
        num: 7,
        trickKeyword: "three types of matrix organizations, they are:",
        trickTip: "3 dạng tổ chức ma trận trong giáo trình PMBOK là: Weak, Balanced and Strong (Đáp án C).",
        ansDesc: "Weak, Balanced and Strong (C)"
      },
      {
        exam: 'PMG201c_FA2024_FE_3127',
        num: 2,
        trickKeyword: "the NOT mentioned one is:",
        trickTip: "Loại KHÔNG ĐƯỢC đề cập trong 3 loại ma trận là: Medium Matrix (Không có khái niệm ma trận vừa - Đáp án A).",
        ansDesc: "Medium Matrix (A)"
      }
    ]
  },
  {
    clusterNum: 17,
    title: "Phân Loại Chi Phí (Cost Categories: Direct/Indirect & Variable/Fixed)",
    optionsOverview: "Direct vs Indirect | Variable vs Fixed",
    questions: [
      {
        exam: 'PMG201c_SP26_FE_6358',
        num: 3,
        trickKeyword: "A cost can be either direct or indirect",
        trickTip: "Direct cost: trực tiếp vào dự án. Indirect cost: chi phí chung/overhead (Đáp án A, B).",
        ansDesc: "Direct: attributable, Indirect: overhead (A, B)"
      },
      {
        exam: 'PMG201c_SU25_FE_4759',
        num: 18,
        trickKeyword: "A cost can be either variable or fixed",
        trickTip: "Variable cost: thay đổi theo sản lượng. Fixed cost: không đổi theo sản lượng (Đáp án A, B).",
        ansDesc: "Variable: changes, Fixed: does not change (A, B)"
      }
    ]
  },
  {
    clusterNum: 18,
    title: "Công Thức Tính Tiến Độ CPM (Forward Pass & Backward Pass)",
    optionsOverview: "Take early start plus duration (EF) | Take late finish minus duration (LS)",
    questions: [
      {
        exam: 'PMG201c_SU2024_1_2527',
        num: 19,
        trickKeyword: "To calculate early finish (EF) of an activity, you will:",
        trickTip: "Công thức Forward pass tính thời điểm kết thúc sớm: EF = ES + Duration ➔ Chọn 'Take its early start plus its estimated duration' (Đáp án A).",
        ansDesc: "Take its early start plus its estimated duration (A)"
      },
      {
        exam: 'PMG201c_SP26_RE_6506',
        num: 15,
        trickKeyword: "To calculate late start (LS) of an activity, you will:",
        trickTip: "Công thức Backward pass tính thời điểm bắt đầu muộn: LS = LF - Duration ➔ Chọn 'Take its late finish minus its estimated duration' (Đáp án C).",
        ansDesc: "Take its late finish minus its estimated duration (C)"
      },
      {
        exam: 'PMG201c_FA2024_FE_3127',
        num: 20,
        trickKeyword: "Activity list critical path: A(2), B(4), C(6), D(3), E(7), F(2)",
        trickTip: "Bài toán Critical Path kinh điển: Các đường Start-End gồm: (1) A-C-D=11; (2) A-B-D=9; (3) E-B-D=14; (4) E-F=9. Đường dài nhất là 14 ngày (Start ➔ E ➔ B ➔ D ➔ End). Giá trị đường găng luôn luôn bằng 14!",
        ansDesc: "14 (D)"
      }
    ]
  }
];

// Construct new special exam questions
const newSpecialQuestions = [];
let questionCounter = 1;

clustersDef.forEach(cluster => {
  cluster.questions.forEach(qDef => {
    if (qDef.isPlaceholder) {
      newSpecialQuestions.push({
        number: questionCounter++,
        type: "single",
        instruction: "(Câu đã loại bỏ)",
        question: "Câu 23 đã được loại bỏ khỏi bài thi (Không hiển thị ảnh, không có đáp án và không tính điểm). Vui lòng nhấn [Câu tiếp (➔)] để làm tiếp Câu 24.",
        options: {},
        answer: [],
        explanation: "Câu hỏi này đã được bỏ qua theo yêu cầu để giữ nguyên vẹn thứ tự các câu hỏi trong đề thi.",
        imagePath: "",
        sourceExam: "",
        sourceIndex: 23,
        disabled: true
      });
      return;
    }

    const origQ = findQ(qDef.exam, qDef.num);
    if (!origQ) {
      console.error(`ERROR: Question not found: ${qDef.exam} Q${qDef.num}`);
      process.exit(1);
    }

    const cleanImgPath = `${qDef.exam}/Cau_${String(qDef.num).padStart(2, '0')}.webp`;
    const explanation = `💡 [MẸO NHỚ CỤM ${cluster.clusterNum}: ${cluster.title}]:\n• Từ khóa nhận diện: "${qDef.trickKeyword}"\n• Bí quyết giải: ${qDef.trickTip}\n• Đáp án chuẩn: [${origQ.answer.join(', ')}] ${qDef.ansDesc}\n• Nguồn đề gốc: Trích từ đề ${qDef.exam.replace('PMG201c_', '').replace('PMG201_', '').replace(/_/g, ' ')} (Câu ${qDef.num})`;

    newSpecialQuestions.push({
      number: questionCounter++,
      type: origQ.type || "single",
      instruction: origQ.instruction || (origQ.answer.length > 1 ? "(Choose 2 answers)" : "(Choose 1 answer)"),
      question: origQ.question,
      options: origQ.options,
      answer: origQ.answer,
      explanation: explanation,
      imagePath: cleanImgPath,
      sourceExam: qDef.exam,
      sourceIndex: qDef.num
    });
  });
});

console.log(`Generated ${newSpecialQuestions.length} pure trick questions for Special Exam.`);

// Update fe_questions.js
let feJs = fs.readFileSync('js/fe_questions.js', 'utf8');

const specialJson = JSON.stringify(newSpecialQuestions, null, 2)
  .split('\n')
  .map(line => '    ' + line)
  .join('\n')
  .trim();

// Replace PMG201c_SPECIAL_TRICK_EXAM array
const startMarker = '"PMG201c_SPECIAL_TRICK_EXAM":';
const startIdx = feJs.lastIndexOf(startMarker);
if (startIdx === -1) {
  console.error('Could not find PMG201c_SPECIAL_TRICK_EXAM in fe_questions.js');
  process.exit(1);
}
const endIdx = feJs.indexOf('\n};', startIdx);
if (endIdx === -1) {
  console.error('Could not find end of object in fe_questions.js');
  process.exit(1);
}

feJs = feJs.substring(0, startIdx) + '"PMG201c_SPECIAL_TRICK_EXAM": ' + specialJson + feJs.substring(endIdx);

fs.writeFileSync('js/fe_questions.js', feJs, 'utf8');
console.log('Updated js/fe_questions.js successfully.');

// Now generate meo_nho_cum_cau_hoi_fe.md
let mdContent = `# BẢNG TỔNG HỢP MẸO NHỚ 18 CỤM CÂU HỎI FE DỄ NHẦM LẪN (PMG201c)
> **Dành cho sinh viên ôn thi FE PMG201c**: Tổng hợp đầy đủ **18 Cụm câu hỏi** có **bộ đáp án giống nhau nhưng câu hỏi khác nhau thì đáp án sẽ khác nhau**. Toàn bộ 50 câu này đã được tích hợp thành **⭐ ĐỀ ĐẶC BIỆT: 50 Câu Mẹo Nhớ Cụm Dễ Nhầm** trên hệ thống thi thử (riêng Câu 23 đã được bỏ qua không tính điểm).

---

`;

clustersDef.forEach(cluster => {
  mdContent += `## 📌 CỤM ${cluster.clusterNum}: ${cluster.title}\n`;
  mdContent += `**Bộ Options nhận diện chung:** \`${cluster.optionsOverview}\`\n\n`;

  cluster.questions.forEach((qDef, idx) => {
    if (qDef.isPlaceholder) {
      mdContent += `### ${idx + 1}. Câu 23: [ĐÃ LOẠI BỎ KHỎI ĐỀ THI]\n`;
      mdContent += `- *Câu hỏi này đã được bỏ qua theo yêu cầu để giữ nguyên vẹn thứ tự các câu khác (không tính điểm).*\n\n`;
      return;
    }

    const origQ = findQ(qDef.exam, qDef.num);
    const examDisplayName = qDef.exam.replace('PMG201c_', '').replace('PMG201_', '').replace(/_/g, ' ');
    const specialQNum = newSpecialQuestions.find(q => q.sourceExam === qDef.exam && q.sourceIndex === qDef.num).number;

    mdContent += `### ${idx + 1}. Câu "${qDef.trickKeyword}" ➔ Đáp án: \`${origQ.answer.join(', ')}\` (${qDef.ansDesc})\n`;
    mdContent += `- **Câu hỏi trong đề:** *"${origQ.question}"*\n`;
    mdContent += `- **Từ khóa then chốt:** \`${qDef.trickKeyword}\`\n`;
    mdContent += `- **Mẹo nhớ siêu tốc:** ${qDef.trickTip}\n`;
    mdContent += `- **Vị trí tìm thấy:**\n`;
    mdContent += `  * **Bộ đề ⭐ ĐỀ ĐẶC BIỆT** ➔ **Câu ${specialQNum}**\n`;
    mdContent += `  * **Đề gốc \`${examDisplayName}\`** ➔ **Câu ${qDef.num}**\n\n`;
  });

  mdContent += `---\n\n`;
});

fs.writeFileSync('meo_nho_cum_cau_hoi_fe.md', mdContent, 'utf8');
console.log('Updated meo_nho_cum_cau_hoi_fe.md in workspace.');

const artifactPath = 'C:/Users/RinHeoShiThui/.gemini/antigravity/brain/6fd82ed7-f027-4766-9a5f-5060ec09d3b5/meo_nho_cum_cau_hoi_fe.md';
fs.writeFileSync(artifactPath, mdContent, 'utf8');
console.log('Updated artifact meo_nho_cum_cau_hoi_fe.md.');
