/**
 * PMG201c Exam Practice Hub - Application Controller
 * Full interactive logic for PE and FE exam prep
 */

(function () {
  'use strict';

  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================
  const state = {
    currentView: 'peView',
    theme: localStorage.getItem('pmg_theme') || 'light',

    // PE State
    peSemester: '',
    peExamId: '',
    peTimer: {
      duration: 90 * 60, // seconds
      remaining: 90 * 60,
      running: false,
      intervalId: null,
      mode: 'countdown' // 'countdown' or 'countup'
    },

    // FE State
    feExamId: '',
    feQuestionIndex: 0,
    feZoomLevel: 1.0,
    feViewMode: localStorage.getItem('pmg_fe_view_mode') || 'text', // 'text' (default crisp text) or 'image'
    feMode: 'practice', // 'practice' or 'exam'
    feFilter: 'all',
    fePracticeSubset: 'all', // 'all', 'wrong', 'flagged', 'wrong_flagged'
    feExamResults: {},       // { [examId]: { [qIndex]: 'correct' | 'wrong' | 'unanswered' } }
    feAnswers: {},      // { [examId]: { [qIndex]: ['A'] or ['A', 'C'] } }
    feQuestionModes: {},// { [examId]: { [qIndex]: 'single' | 'multi' } }
    feFlags: {},        // { [examId]: { [qIndex]: boolean } }
    feNotes: {},        // { [examId]: { [qIndex]: string } }
    feTimer: {
      remaining: 60 * 60,
      running: false,
      intervalId: null
    }
  };

  // Restore cached FE state
  try {
    const savedAnswers = localStorage.getItem('pmg_fe_answers');
    if (savedAnswers) state.feAnswers = JSON.parse(savedAnswers);

    const savedModes = localStorage.getItem('pmg_fe_modes');
    if (savedModes) state.feQuestionModes = JSON.parse(savedModes);

    const savedFlags = localStorage.getItem('pmg_fe_flags');
    if (savedFlags) state.feFlags = JSON.parse(savedFlags);

    const savedNotes = localStorage.getItem('pmg_fe_notes');
    if (savedNotes) state.feNotes = JSON.parse(savedNotes);

    const savedResults = localStorage.getItem('pmg_fe_results');
    if (savedResults) state.feExamResults = JSON.parse(savedResults);
  } catch (e) {
    console.error('Error loading FE state from localStorage:', e);
  }

  // =========================================================================
  // DOM ELEMENT REFERENCES
  // =========================================================================
  const elements = {
    // Header
    navButtons: document.querySelectorAll('.nav-btn'),
    viewPanels: document.querySelectorAll('.view-panel'),
    themeToggle: document.getElementById('themeToggle'),
    themeIconSun: document.getElementById('themeIconSun'),
    themeIconMoon: document.getElementById('themeIconMoon'),
    btnQuickFormula: document.getElementById('btnQuickFormula'),

    // PE Elements
    peSemesterSelect: document.getElementById('peSemesterSelect'),
    peExamSelect: document.getElementById('peExamSelect'),
    peTimerDisplay: document.getElementById('peTimerDisplay'),
    peTimerToggleBtn: document.getElementById('peTimerToggleBtn'),
    peTimerResetBtn: document.getElementById('peTimerResetBtn'),
    peTimerPreset: document.getElementById('peTimerPreset'),
    peTimerPlayIcon: document.getElementById('peTimerPlayIcon'),
    peTimerPauseIcon: document.getElementById('peTimerPauseIcon'),
    peTimerBadge: document.getElementById('peTimerBadge'),
    peTemplateInsertSelect: document.getElementById('peTemplateInsertSelect'),
    peCopyBtn: document.getElementById('peCopyBtn'),
    peDownloadBtn: document.getElementById('peDownloadBtn'),
    peClearEditorBtn: document.getElementById('peClearEditorBtn'),
    peOpenExternalBtn: document.getElementById('peOpenExternalBtn'),
    peExamTitle: document.getElementById('peExamTitle'),
    peViewerContent: document.getElementById('peViewerContent'),
    peTextarea: document.getElementById('peTextarea'),
    peWordCount: document.getElementById('peWordCount'),
    peCharCount: document.getElementById('peCharCount'),
    peLineCount: document.getElementById('peLineCount'),
    peSaveIndicator: document.getElementById('peSaveIndicator'),
    peSaveText: document.getElementById('peSaveText'),
    peSplitPane: document.getElementById('peSplitPane'),
    peLeftPane: document.getElementById('peLeftPane'),
    peRightPane: document.getElementById('peRightPane'),
    peResizer: document.getElementById('peResizer'),

    // FE Elements
    feExamSelect: document.getElementById('feExamSelect'),
    fePracticeSubsetSelect: document.getElementById('fePracticeSubsetSelect'),
    feCustomPracticeBanner: document.getElementById('feCustomPracticeBanner'),
    feCustomBannerIcon: document.getElementById('feCustomBannerIcon'),
    feCustomBannerTitle: document.getElementById('feCustomBannerTitle'),
    feCustomBannerSubtitle: document.getElementById('feCustomBannerSubtitle'),
    btnExitCustomPractice: document.getElementById('btnExitCustomPractice'),
    feModeSelect: document.getElementById('feModeSelect'),
    feTimerBadge: document.getElementById('feTimerBadge'),
    feTimerDisplay: document.getElementById('feTimerDisplay'),
    feSubmitBtn: document.getElementById('feSubmitBtn'),
    feResetExamBtn: document.getElementById('feResetExamBtn'),
    feQuestionNumber: document.getElementById('feQuestionNumber'),
    feSelectionModeTag: document.getElementById('feSelectionModeTag'),
    feModeIcon: document.getElementById('feModeIcon'),
    feModeText: document.getElementById('feModeText'),
    btnModeSingle: document.getElementById('btnModeSingle'),
    btnModeMulti: document.getElementById('btnModeMulti'),
    feFlagBtn: document.getElementById('feFlagBtn'),
    feFlagIcon: document.getElementById('feFlagIcon'),
    feFlagText: document.getElementById('feFlagText'),

    // View Mode & Text Question Elements
    btnViewText: document.getElementById('btnViewText'),
    btnViewImage: document.getElementById('btnViewImage'),
    btnEditQuestionText: document.getElementById('btnEditQuestionText'),
    btnImportExamText: document.getElementById('btnImportExamText'),
    feTextContainer: document.getElementById('feTextContainer'),
    feImageWrapper: document.getElementById('feImageWrapper'),
    feTextInstruction: document.getElementById('feTextInstruction'),
    feTextContent: document.getElementById('feTextContent'),
    feTextOptionsList: document.getElementById('feTextOptionsList'),
    btnToggleExplanation: document.getElementById('btnToggleExplanation'),
    feTextExplanationBox: document.getElementById('feTextExplanationBox'),
    feTextExplanationContent: document.getElementById('feTextExplanationContent'),

    feQuestionImage: document.getElementById('feQuestionImage'),
    feZoomInBtn: document.getElementById('feZoomInBtn'),
    feZoomOutBtn: document.getElementById('feZoomOutBtn'),
    feZoomResetBtn: document.getElementById('feZoomResetBtn'),
    feFullscreenBtn: document.getElementById('feFullscreenBtn'),
    feSelectedDisplay: document.getElementById('feSelectedDisplay'),
    feOptionsGrid: document.getElementById('feOptionsGrid'),
    feClearChoiceBtn: document.getElementById('feClearChoiceBtn'),
    fePrevBtn: document.getElementById('fePrevBtn'),
    feNextBtn: document.getElementById('feNextBtn'),
    feNotesToggle: document.getElementById('feNotesToggle'),
    feNotesArrow: document.getElementById('feNotesArrow'),
    feNotesInput: document.getElementById('feNotesInput'),
    feCountDone: document.getElementById('feCountDone'),
    feCountEmpty: document.getElementById('feCountEmpty'),
    feCountFlag: document.getElementById('feCountFlag'),
    feCountWrong: document.getElementById('feCountWrong'),
    fePaletteGrid: document.getElementById('fePaletteGrid'),
    feSubmitBtnSidebar: document.getElementById('feSubmitBtnSidebar'),
    paletteFilters: document.querySelectorAll('.palette-filters .filter-btn'),

    // Guide Elements
    guideSearchInput: document.getElementById('guideSearchInput'),
    guideTocList: document.getElementById('guideTocList'),
    guideArticle: document.getElementById('guideArticle'),

    // Modals
    formulaModal: document.getElementById('formulaModal'),
    closeFormulaModalBtn: document.getElementById('closeFormulaModalBtn'),
    confirmFormulaModalBtn: document.getElementById('confirmFormulaModalBtn'),
    submitModal: document.getElementById('submitModal'),
    closeSubmitModalBtn: document.getElementById('closeSubmitModalBtn'),
    closeSubmitModalBtn2: document.getElementById('closeSubmitModalBtn2'),
    submitModalBody: document.getElementById('submitModalBody'),
    exportResultsBtn: document.getElementById('exportResultsBtn'),
    fullscreenImgModal: document.getElementById('fullscreenImgModal'),
    fullscreenImg: document.getElementById('fullscreenImg'),

    // Edit Question Modal
    feEditQuestionModal: document.getElementById('feEditQuestionModal'),
    feEditQNum: document.getElementById('feEditQNum'),
    feEditQType: document.getElementById('feEditQType'),
    feEditQText: document.getElementById('feEditQText'),
    feEditOptA: document.getElementById('feEditOptA'),
    feEditOptB: document.getElementById('feEditOptB'),
    feEditOptC: document.getElementById('feEditOptC'),
    feEditOptD: document.getElementById('feEditOptD'),
    feEditQExplanation: document.getElementById('feEditQExplanation'),
    saveEditQBtn: document.getElementById('saveEditQBtn'),
    cancelEditQBtn: document.getElementById('cancelEditQBtn'),
    closeEditQModalBtn: document.getElementById('closeEditQModalBtn'),

    // Import Exam Modal
    feImportExamModal: document.getElementById('feImportExamModal'),
    feImportTextarea: document.getElementById('feImportTextarea'),
    feImportStats: document.getElementById('feImportStats'),
    btnFillSampleImport: document.getElementById('btnFillSampleImport'),
    btnResetToDefaultExam: document.getElementById('btnResetToDefaultExam'),
    confirmImportModalBtn: document.getElementById('confirmImportModalBtn'),
    cancelImportModalBtn: document.getElementById('cancelImportModalBtn'),
    closeImportModalBtn: document.getElementById('closeImportModalBtn'),

    toastContainer: document.getElementById('toastContainer')
  };

  // =========================================================================
  // UTILITIES & HELPERS
  // =========================================================================
  function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }

  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function downloadTextFile(filename, text) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  // =========================================================================
  // THEME MANAGEMENT
  // =========================================================================
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pmg_theme', theme);
    if (theme === 'dark') {
      elements.themeIconSun.style.display = 'none';
      elements.themeIconMoon.style.display = 'block';
    } else {
      elements.themeIconSun.style.display = 'block';
      elements.themeIconMoon.style.display = 'none';
    }
  }

  elements.themeToggle.addEventListener('click', () => {
    applyTheme(state.theme === 'light' ? 'dark' : 'light');
  });

  // =========================================================================
  // VIEW NAVIGATION
  // =========================================================================
  function switchView(targetViewId) {
    state.currentView = targetViewId;
    elements.navButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === targetViewId);
    });
    elements.viewPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === targetViewId);
    });
    localStorage.setItem('pmg_active_view', targetViewId);
  }

  elements.navButtons.forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  // =========================================================================
  // PE MODULE (PRACTICAL EXAM - TỰ LUẬN)
  // =========================================================================
  function initPEModule() {
    // Populate Semesters
    const semesters = [...new Set(APP_DATA.peExams.map(e => e.semester))];
    elements.peSemesterSelect.innerHTML = semesters.map(sem => `<option value="${sem}">${sem}</option>`).join('');

    // Semester change handler
    elements.peSemesterSelect.addEventListener('change', () => {
      state.peSemester = elements.peSemesterSelect.value;
      populatePEExams();
    });

    // Exam change handler
    elements.peExamSelect.addEventListener('change', () => {
      loadPEExam(elements.peExamSelect.value);
    });

    // Populate Templates in Quick Insert dropdown
    elements.peTemplateInsertSelect.innerHTML = '<option value="">⚡ Chèn Mẫu Chuẩn (Quick Insert)...</option>' +
      APP_DATA.templates.map(t => `<option value="${t.id}">${t.name}</option>`).join('');

    elements.peTemplateInsertSelect.addEventListener('change', () => {
      const templateId = elements.peTemplateInsertSelect.value;
      if (!templateId) return;
      const t = APP_DATA.templates.find(item => item.id === templateId);
      if (t) {
        insertTextAtCursor(elements.peTextarea, '\n\n' + t.content + '\n\n');
        updatePEWordCount();
        savePEContent();
        showToast(`Đã chèn mẫu: ${t.name}`, 'success');
      }
      elements.peTemplateInsertSelect.value = '';
    });

    // Textarea input & stats
    elements.peTextarea.addEventListener('input', () => {
      updatePEWordCount();
      triggerAutoSavePE();
    });

    // Tab key support in textarea
    elements.peTextarea.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        insertTextAtCursor(elements.peTextarea, '    ');
      }
    });

    // Copy & Download
    elements.peCopyBtn.addEventListener('click', () => {
      const text = elements.peTextarea.value;
      if (!text.trim()) {
        showToast('Bài làm chưa có nội dung để sao chép', 'warning');
        return;
      }
      navigator.clipboard.writeText(text).then(() => {
        showToast('Đã sao chép toàn bộ bài làm vào Clipboard!', 'success');
      }).catch(() => {
        showToast('Không thể truy cập Clipboard', 'error');
      });
    });

    elements.peDownloadBtn.addEventListener('click', () => {
      const text = elements.peTextarea.value;
      const examName = elements.peExamSelect.value || 'PE_Exam';
      const filename = `${examName}_BaiLam_PMG201c.txt`;
      downloadTextFile(filename, text);
      showToast(`Đã tải về: ${filename}`, 'success');
    });

    elements.peClearEditorBtn.addEventListener('click', () => {
      if (confirm('Bạn có chắc chắn muốn làm mới toàn bộ bài viết này không?')) {
        elements.peTextarea.value = '';
        updatePEWordCount();
        savePEContent();
        showToast('Đã làm mới bài làm', 'info');
      }
    });

    // Timer buttons
    elements.peTimerToggleBtn.addEventListener('click', togglePETimer);
    elements.peTimerResetBtn.addEventListener('click', resetPETimer);
    elements.peTimerPreset.addEventListener('change', () => {
      const val = elements.peTimerPreset.value;
      if (val === 'free') {
        state.peTimer.mode = 'countup';
        state.peTimer.remaining = 0;
      } else {
        state.peTimer.mode = 'countdown';
        state.peTimer.duration = parseInt(val, 10) * 60;
        state.peTimer.remaining = state.peTimer.duration;
      }
      updatePETimerDisplay();
    });

    // Resizer logic
    initSplitPaneResizer();

    // Initial load
    if (semesters.length > 0) {
      state.peSemester = semesters[0];
      elements.peSemesterSelect.value = state.peSemester;
      populatePEExams();
    }
  }

  function populatePEExams() {
    const exams = APP_DATA.peExams.filter(e => e.semester === state.peSemester);
    elements.peExamSelect.innerHTML = exams.map(e => `<option value="${e.id}">${e.title} (${e.filename})</option>`).join('');
    if (exams.length > 0) {
      loadPEExam(exams[0].id);
    }
  }

  function loadPEExam(examId) {
    state.peExamId = examId;
    elements.peExamSelect.value = examId;
    const exam = APP_DATA.peExams.find(e => e.id === examId);
    if (!exam) return;

    elements.peExamTitle.textContent = `Đề thi: ${exam.title}`;

    // Render Viewer Content
    elements.peViewerContent.innerHTML = '';
    if (exam.type === 'pdf') {
      const iframe = document.createElement('iframe');
      iframe.className = 'doc-viewer-iframe';
      iframe.src = `${exam.path}#view=FitH&toolbar=1`;
      elements.peViewerContent.appendChild(iframe);
    } else {
      const wrap = document.createElement('div');
      wrap.className = 'doc-viewer-image-wrap';
      const img = document.createElement('img');
      img.className = 'doc-viewer-image';
      img.src = exam.path;
      img.alt = exam.title;
      wrap.appendChild(img);
      elements.peViewerContent.appendChild(wrap);
    }

    elements.peOpenExternalBtn.onclick = () => {
      window.open(exam.path, '_blank');
    };

    // Restore text for this exam
    const saved = localStorage.getItem(`pmg_pe_content_${examId}`) || '';
    elements.peTextarea.value = saved;
    updatePEWordCount();
  }

  function insertTextAtCursor(textarea, text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);
    textarea.value = before + text + after;
    textarea.selectionStart = textarea.selectionEnd = start + text.length;
    textarea.focus();
  }

  function updatePEWordCount() {
    const text = elements.peTextarea.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = elements.peTextarea.value.length;
    const lines = elements.peTextarea.value.split('\n').length;

    elements.peWordCount.textContent = `Số từ: ${words} từ`;
    elements.peCharCount.textContent = `Ký tự: ${chars}`;
    elements.peLineCount.textContent = `Dòng: ${lines}`;
  }

  let autoSaveTimeout = null;
  function triggerAutoSavePE() {
    elements.peSaveIndicator.className = 'save-indicator saving';
    elements.peSaveText.textContent = 'Đang lưu...';
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      savePEContent();
      elements.peSaveIndicator.className = 'save-indicator saved';
      elements.peSaveText.textContent = 'Đã lưu tự động';
    }, 600);
  }

  function savePEContent() {
    if (!state.peExamId) return;
    localStorage.setItem(`pmg_pe_content_${state.peExamId}`, elements.peTextarea.value);
  }

  function togglePETimer() {
    if (state.peTimer.running) {
      clearInterval(state.peTimer.intervalId);
      state.peTimer.running = false;
      elements.peTimerPlayIcon.style.display = 'block';
      elements.peTimerPauseIcon.style.display = 'none';
      showToast('Đã tạm dừng đếm thời gian', 'info');
    } else {
      state.peTimer.running = true;
      elements.peTimerPlayIcon.style.display = 'none';
      elements.peTimerPauseIcon.style.display = 'block';
      showToast('Bắt đầu tính giờ làm bài PE!', 'success');

      state.peTimer.intervalId = setInterval(() => {
        if (state.peTimer.mode === 'countup') {
          state.peTimer.remaining++;
        } else {
          if (state.peTimer.remaining > 0) {
            state.peTimer.remaining--;
          } else {
            clearInterval(state.peTimer.intervalId);
            state.peTimer.running = false;
            elements.peTimerPlayIcon.style.display = 'block';
            elements.peTimerPauseIcon.style.display = 'none';
            elements.peTimerBadge.className = 'timer-badge danger';
            showToast('HẾT GIỜ LÀM BÀI THI PE!', 'error', 6000);
          }
        }
        updatePETimerDisplay();
      }, 1000);
    }
  }

  function resetPETimer() {
    clearInterval(state.peTimer.intervalId);
    state.peTimer.running = false;
    elements.peTimerPlayIcon.style.display = 'block';
    elements.peTimerPauseIcon.style.display = 'none';
    elements.peTimerBadge.className = 'timer-badge';
    if (state.peTimer.mode === 'countup') {
      state.peTimer.remaining = 0;
    } else {
      state.peTimer.remaining = state.peTimer.duration;
    }
    updatePETimerDisplay();
  }

  function updatePETimerDisplay() {
    elements.peTimerDisplay.textContent = formatTime(state.peTimer.remaining);
    if (state.peTimer.mode === 'countdown') {
      if (state.peTimer.remaining <= 300 && state.peTimer.remaining > 60) {
        elements.peTimerBadge.className = 'timer-badge warning';
      } else if (state.peTimer.remaining <= 60 && state.peTimer.remaining > 0) {
        elements.peTimerBadge.className = 'timer-badge danger';
      } else if (state.peTimer.remaining === 0) {
        elements.peTimerBadge.className = 'timer-badge danger';
      } else {
        elements.peTimerBadge.className = 'timer-badge';
      }
    }
  }

  function initSplitPaneResizer() {
    let isResizing = false;
    elements.peResizer.addEventListener('mousedown', (e) => {
      isResizing = true;
      elements.peResizer.classList.add('resizing');
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const containerRect = elements.peSplitPane.getBoundingClientRect();
      const pointerRelativeX = e.clientX - containerRect.left;
      const minWidth = 280;
      const maxWidth = containerRect.width - 280;
      if (pointerRelativeX >= minWidth && pointerRelativeX <= maxWidth) {
        const percent = (pointerRelativeX / containerRect.width) * 100;
        elements.peLeftPane.style.width = `${percent}%`;
      }
    });

    window.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        elements.peResizer.classList.remove('resizing');
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }
    });
  }

  // =========================================================================
  // FE TEXT EXAM PARSER
  // =========================================================================
  function parseExamImportText(rawText) {
    if (rawText.trim().startsWith('[') || rawText.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(rawText);
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === 'object') return Object.values(parsed);
      } catch (e) {}
    }

    const questions = [];
    // Split by questions: e.g. "Câu 1:", "Question 1:", "1.", or lines starting with numbers
    const blocks = rawText.split(/(?:^|\n)(?=(?:Câu|Question|\b\d+[\.:\)])\s*\d+)/i);

    blocks.forEach(block => {
      const trimmed = block.trim();
      if (!trimmed) return;

      const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) return;

      const qLine = lines[0];
      const qText = qLine.replace(/^(?:Câu|Question)?\s*\d+[\.:\)]\s*/i, '').trim();

      const isMulti = /choose\s*2\s*answers/i.test(trimmed) || /chọn\s*2/i.test(trimmed);
      const instruction = isMulti ? '(Choose 2 answers)' : '(Choose 1 answer)';

      const options = {};
      let explanation = '';
      const answers = [];

      lines.slice(1).forEach(l => {
        const optMatch = l.match(/^([A-F])[\.:\)]\s*(.*)$/i);
        if (optMatch) {
          const key = optMatch[1].toUpperCase();
          options[key] = optMatch[2].trim();
          return;
        }

        const ansMatch = l.match(/^(?:Đáp án|Answer)[\.:\)]\s*(.*)$/i);
        if (ansMatch) {
          const ansStr = ansMatch[1].toUpperCase();
          ['A', 'B', 'C', 'D', 'E', 'F'].forEach(k => {
            if (ansStr.includes(k)) answers.push(k);
          });
          return;
        }

        const explMatch = l.match(/^(?:Giải thích|Explanation)[\.:\)]\s*(.*)$/i);
        if (explMatch) {
          explanation = explMatch[1].trim();
        }
      });

      if (Object.keys(options).length > 0 || qText) {
        questions.push({
          number: questions.length + 1,
          type: isMulti ? 'multi' : 'single',
          instruction: instruction,
          question: qText || 'Nội dung câu hỏi',
          options: Object.keys(options).length > 0 ? options : { "A": "Phương án A", "B": "Phương án B", "C": "Phương án C", "D": "Phương án D" },
          answer: answers,
          explanation: explanation
        });
      }
    });

    return questions;
  }

  // =========================================================================
  // FE MODULE (FINAL EXAM - TRẮC NGHIỆM)
  // =========================================================================
  function initFEModule() {
    // Populate FE Exams
    elements.feExamSelect.innerHTML = APP_DATA.feExams.map(e =>
      `<option value="${e.id}">${e.title} (${e.totalQuestions} câu)</option>`
    ).join('');

    elements.feExamSelect.addEventListener('change', () => {
      state.fePracticeSubset = 'all';
      if (elements.fePracticeSubsetSelect) elements.fePracticeSubsetSelect.value = 'all';
      loadFEExam(elements.feExamSelect.value);
    });

    // Custom Practice Subset (Wrong / Flagged / All)
    if (elements.fePracticeSubsetSelect) {
      elements.fePracticeSubsetSelect.addEventListener('change', () => {
        setPracticeSubset(elements.fePracticeSubsetSelect.value, false);
      });
    }

    if (elements.btnExitCustomPractice) {
      elements.btnExitCustomPractice.addEventListener('click', () => {
        setPracticeSubset('all', false);
        showToast('Đã quay lại hiển thị toàn bộ 50 câu', 'info');
      });
    }

    // FE Mode change
    elements.feModeSelect.addEventListener('change', () => {
      state.feMode = elements.feModeSelect.value;
      if (state.feMode === 'exam') {
        elements.feTimerBadge.style.display = 'flex';
        startFETimer();
        showToast('Bắt đầu chế độ Thi Thử: Thời gian 60 phút!', 'warning');
      } else {
        elements.feTimerBadge.style.display = 'none';
        stopFETimer();
        showToast('Chuyển sang chế độ Luyện Tập Tự Do', 'info');
      }
    });

    // Mode Toggle buttons (Single vs Multi)
    elements.btnModeSingle.addEventListener('click', () => setQuestionMode('single'));
    elements.btnModeMulti.addEventListener('click', () => setQuestionMode('multi'));

    // Option Buttons Click
    elements.feOptionsGrid.querySelectorAll('.opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const opt = btn.dataset.option;
        handleOptionClick(opt);
      });
    });

    // Clear choice
    elements.feClearChoiceBtn.addEventListener('click', () => {
      clearCurrentAnswer();
    });

    // Navigation
    elements.fePrevBtn.addEventListener('click', () => changeFEQuestion(-1));
    elements.feNextBtn.addEventListener('click', () => changeFEQuestion(1));

    // Flag button
    elements.feFlagBtn.addEventListener('click', toggleCurrentFlag);

    // Zoom buttons
    elements.feZoomInBtn.addEventListener('click', () => zoomFEImage(0.15));
    elements.feZoomOutBtn.addEventListener('click', () => zoomFEImage(-0.15));
    elements.feZoomResetBtn.addEventListener('click', () => {
      state.feZoomLevel = 1.0;
      applyFEZoom();
    });
    elements.feFullscreenBtn.addEventListener('click', openFullscreenImage);
    elements.feQuestionImage.addEventListener('click', openFullscreenImage);

    // Notes toggle & input
    elements.feNotesToggle.addEventListener('click', () => {
      const isHidden = elements.feNotesInput.style.display === 'none';
      elements.feNotesInput.style.display = isHidden ? 'block' : 'none';
      elements.feNotesArrow.textContent = isHidden ? '▲' : '▼';
    });

    elements.feNotesInput.addEventListener('input', () => {
      saveCurrentNotes();
    });

    // Palette filters
    elements.paletteFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.paletteFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.feFilter = btn.dataset.filter;
        renderPalette();
      });
    });

    // View Mode & Text Toggle Handlers
    if (elements.btnViewText) {
      elements.btnViewText.addEventListener('click', () => {
        state.feViewMode = 'text';
        localStorage.setItem('pmg_fe_view_mode', 'text');
        loadCurrentQuestion();
        showToast('Đã chuyển sang Chế độ Text sắc nét', 'info');
      });
    }

    if (elements.btnViewImage) {
      elements.btnViewImage.addEventListener('click', () => {
        state.feViewMode = 'image';
        localStorage.setItem('pmg_fe_view_mode', 'image');
        loadCurrentQuestion();
        showToast('Đã chuyển sang Xem ảnh chụp gốc', 'info');
      });
    }

    if (elements.btnToggleExplanation) {
      elements.btnToggleExplanation.addEventListener('click', () => {
        const isVisible = elements.feTextExplanationBox.style.display !== 'none';
        elements.feTextExplanationBox.style.display = isVisible ? 'none' : 'block';
      });
    }

    // Edit Question Text Handlers
    if (elements.btnEditQuestionText) {
      elements.btnEditQuestionText.addEventListener('click', () => {
        const qIndex = state.feQuestionIndex;
        let qData = typeof getFEQuestionText === 'function' ? getFEQuestionText(state.feExamId, qIndex) : null;
        
        elements.feEditQNum.textContent = qIndex + 1;
        const currentMode = state.feQuestionModes[state.feExamId][qIndex] || (qData ? qData.type : 'single');
        elements.feEditQType.value = currentMode === 'multi' ? 'multi' : 'single';
        elements.feEditQText.value = qData ? qData.question : '';
        elements.feEditOptA.value = qData && qData.options ? (qData.options['A'] || '') : '';
        elements.feEditOptB.value = qData && qData.options ? (qData.options['B'] || '') : '';
        elements.feEditOptC.value = qData && qData.options ? (qData.options['C'] || '') : '';
        elements.feEditOptD.value = qData && qData.options ? (qData.options['D'] || '') : '';
        elements.feEditQExplanation.value = qData ? (qData.explanation || '') : '';

        elements.feEditQuestionModal.classList.add('active');
      });
    }

    if (elements.closeEditQModalBtn) {
      elements.closeEditQModalBtn.addEventListener('click', () => {
        elements.feEditQuestionModal.classList.remove('active');
      });
    }
    if (elements.cancelEditQBtn) {
      elements.cancelEditQBtn.addEventListener('click', () => {
        elements.feEditQuestionModal.classList.remove('active');
      });
    }

    if (elements.saveEditQBtn) {
      elements.saveEditQBtn.addEventListener('click', () => {
        const qIndex = state.feQuestionIndex;
        const qType = elements.feEditQType.value;
        const questionText = elements.feEditQText.value.trim();
        const optA = elements.feEditOptA.value.trim();
        const optB = elements.feEditOptB.value.trim();
        const optC = elements.feEditOptC.value.trim();
        const optD = elements.feEditOptD.value.trim();
        const expl = elements.feEditQExplanation.value.trim();

        if (!questionText) {
          showToast('Vui lòng nhập nội dung câu hỏi!', 'error');
          return;
        }

        // Get or init custom store for this exam
        let customStore = {};
        try {
          const raw = localStorage.getItem('pmg201c_fe_custom_text_' + state.feExamId);
          if (raw) customStore = JSON.parse(raw);
        } catch (e) {}

        customStore[qIndex] = {
          number: qIndex + 1,
          type: qType,
          instruction: qType === 'multi' ? '(Choose 2 answers)' : '(Choose 1 answer)',
          question: questionText,
          options: {
            "A": optA || "Phương án A",
            "B": optB || "Phương án B",
            "C": optC || "Phương án C",
            "D": optD || "Phương án D"
          },
          explanation: expl
        };

        localStorage.setItem('pmg201c_fe_custom_text_' + state.feExamId, JSON.stringify(customStore));
        state.feQuestionModes[state.feExamId][qIndex] = qType;
        saveFEPersistence();

        elements.feEditQuestionModal.classList.remove('active');
        loadCurrentQuestion();
        showToast(`Đã lưu nội dung text câu ${qIndex + 1} thành công!`, 'success');
      });
    }

    // Batch Import Exam Handlers
    if (elements.btnImportExamText) {
      elements.btnImportExamText.addEventListener('click', () => {
        elements.feImportExamModal.classList.add('active');
        elements.feImportStats.textContent = 'Nhập văn bản hoặc bấm nút Nạp Ngân Hàng Đề bên trên';
      });
    }
    if (elements.closeImportModalBtn) {
      elements.closeImportModalBtn.addEventListener('click', () => {
        elements.feImportExamModal.classList.remove('active');
      });
    }
    if (elements.cancelImportModalBtn) {
      elements.cancelImportModalBtn.addEventListener('click', () => {
        elements.feImportExamModal.classList.remove('active');
      });
    }

    if (elements.btnFillSampleImport) {
      elements.btnFillSampleImport.addEventListener('click', () => {
        if (typeof FE_QUESTIONS_TEXT !== 'undefined' && FE_QUESTIONS_TEXT['default_pmg201c']) {
          const list = FE_QUESTIONS_TEXT['default_pmg201c'];
          let formattedText = '';
          list.forEach(q => {
            formattedText += `Câu ${q.number}: ${q.question} ${q.instruction || ''}\n`;
            if (q.options) {
              Object.keys(q.options).forEach(k => {
                formattedText += `${k}. ${q.options[k]}\n`;
              });
            }
            if (q.answer && q.answer.length) {
              formattedText += `Đáp án: ${q.answer.join(', ')}\n`;
            }
            if (q.explanation) {
              formattedText += `Giải thích: ${q.explanation}\n`;
            }
            formattedText += '\n';
          });
          elements.feImportTextarea.value = formattedText;
          elements.feImportStats.textContent = `Đã điền ${list.length} câu hỏi PMG201c chuẩn vào khung soạn thảo!`;
          showToast('Đã điền 50 câu hỏi chuẩn vào khung nạp', 'info');
        }
      });
    }

    if (elements.btnResetToDefaultExam) {
      elements.btnResetToDefaultExam.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn khôi phục dữ liệu gốc cho bộ đề này?')) {
          localStorage.removeItem('pmg201c_fe_custom_text_' + state.feExamId);
          elements.feImportExamModal.classList.remove('active');
          loadCurrentQuestion();
          showToast('Đã khôi phục dữ liệu mặc định cho đề này', 'info');
        }
      });
    }

    if (elements.confirmImportModalBtn) {
      elements.confirmImportModalBtn.addEventListener('click', () => {
        const text = elements.feImportTextarea.value.trim();
        if (!text) {
          showToast('Vui lòng dán văn bản đề thi hoặc bấm Nạp ngân hàng đề!', 'error');
          return;
        }

        const parsed = parseExamImportText(text);
        if (parsed.length === 0) {
          showToast('Không tìm thấy câu hỏi hợp lệ trong văn bản!', 'error');
          return;
        }

        const customStore = {};
        parsed.forEach((q, idx) => {
          customStore[idx] = q;
        });

        localStorage.setItem('pmg201c_fe_custom_text_' + state.feExamId, JSON.stringify(customStore));
        elements.feImportExamModal.classList.remove('active');
        state.feViewMode = 'text';
        localStorage.setItem('pmg_fe_view_mode', 'text');
        loadCurrentQuestion();
        showToast(`Đã nạp thành công ${parsed.length} câu hỏi dạng Text rõ nét!`, 'success');
      });
    }

    // Submit
    elements.feSubmitBtn.addEventListener('click', submitFEExam);
    elements.feSubmitBtnSidebar.addEventListener('click', submitFEExam);
    elements.feResetExamBtn.addEventListener('click', resetFEExam);

    // Keyboard Shortcuts
    window.addEventListener('keydown', handleKeyboardShortcuts);

    // Initial load first exam
    if (APP_DATA.feExams.length > 0) {
      loadFEExam(APP_DATA.feExams[0].id);
    }
  }

  function loadFEExam(examId) {
    state.feExamId = examId;
    elements.feExamSelect.value = examId;
    state.feQuestionIndex = 0;
    state.feZoomLevel = 1.0;

    if (!state.feAnswers[examId]) state.feAnswers[examId] = {};
    if (!state.feQuestionModes[examId]) state.feQuestionModes[examId] = {};
    if (!state.feFlags[examId]) state.feFlags[examId] = {};
    if (!state.feNotes[examId]) state.feNotes[examId] = {};

    loadCurrentQuestion();
    renderPalette();
  }

  function loadCurrentQuestion() {
    const exam = APP_DATA.feExams.find(e => e.id === state.feExamId);
    if (!exam) return;

    const qIndex = state.feQuestionIndex;
    const totalQ = exam.questions.length;
    const filename = exam.questions[qIndex] || `Cau_${String(qIndex + 1).padStart(2, '0')}.webp`;
    const imagePath = `${exam.folder}/${filename}`;

    elements.feQuestionNumber.textContent = qIndex + 1;
    elements.feQuestionImage.src = imagePath;
    elements.feQuestionImage.alt = `Câu ${qIndex + 1}`;

    // Reset zoom
    state.feZoomLevel = 1.0;
    applyFEZoom();

    // Toggle Text vs Image View
    if (state.feViewMode === 'image') {
      if (elements.feTextContainer) elements.feTextContainer.style.display = 'none';
      if (elements.feImageWrapper) elements.feImageWrapper.style.display = 'flex';
      if (elements.btnViewImage) elements.btnViewImage.classList.add('active');
      if (elements.btnViewText) elements.btnViewText.classList.remove('active');
    } else {
      if (elements.feTextContainer) elements.feTextContainer.style.display = 'flex';
      if (elements.feImageWrapper) elements.feImageWrapper.style.display = 'none';
      if (elements.btnViewText) elements.btnViewText.classList.add('active');
      if (elements.btnViewImage) elements.btnViewImage.classList.remove('active');
    }

    // Get Text Question Data
    let qData = null;
    if (typeof getFEQuestionText === 'function') {
      qData = getFEQuestionText(state.feExamId, qIndex);
    }

    if (qData) {
      // Set Instruction badge
      if (elements.feTextInstruction) {
        elements.feTextInstruction.textContent = qData.instruction || (qData.type === 'multi' ? '(Choose 2 answers)' : '(Choose 1 answer)');
      }

      // Set Main question text
      if (elements.feTextContent) {
        elements.feTextContent.textContent = qData.question;
      }

      // Render options list
      if (elements.feTextOptionsList) {
        elements.feTextOptionsList.innerHTML = '';
        if (qData.options) {
          Object.keys(qData.options).forEach(optKey => {
            const item = document.createElement('div');
            item.className = 'text-opt-item';
            item.dataset.option = optKey;
            item.innerHTML = `
              <div class="text-opt-badge">${optKey}</div>
              <div class="text-opt-content">${escapeHtml(qData.options[optKey])}</div>
            `;
            item.addEventListener('click', () => {
              handleOptionClick(optKey);
            });
            elements.feTextOptionsList.appendChild(item);
          });
        }
      }

      // Handle explanation
      if (elements.btnToggleExplanation) {
        if (qData.explanation) {
          elements.feTextExplanationContent.textContent = qData.explanation;
          elements.btnToggleExplanation.style.display = 'inline-flex';
        } else {
          elements.btnToggleExplanation.style.display = 'none';
          elements.feTextExplanationBox.style.display = 'none';
        }
      }

      // Set Question Mode according to question metadata if not set
      if (!state.feQuestionModes[state.feExamId][qIndex] && qData.type) {
        state.feQuestionModes[state.feExamId][qIndex] = qData.type;
      }
    } else {
      // No text data fallback
      if (elements.feTextInstruction) {
        elements.feTextInstruction.textContent = 'Chưa có bản Text';
      }
      if (elements.feTextContent) {
        elements.feTextContent.innerHTML = `
          <div style="font-weight:normal; font-size:1rem; color:var(--text-muted); line-height:1.7; padding:12px 0;">
            Câu hỏi này hiện chỉ có trong bản ảnh chụp gốc.<br>
            👉 Bấm nút <strong>[ 🖼️ Ảnh gốc ]</strong> ở trên để xem ảnh câu hỏi.<br>
            👉 Hoặc bấm nút <strong>[ ✏️ Sửa text ]</strong> / <strong>[ 📥 Nạp Text Đề ]</strong> để nhập hoặc dán nội dung văn bản rõ nét!
          </div>
        `;
      }
      if (elements.feTextOptionsList) {
        elements.feTextOptionsList.innerHTML = '';
      }
      if (elements.btnToggleExplanation) {
        elements.btnToggleExplanation.style.display = 'none';
      }
      if (elements.feTextExplanationBox) {
        elements.feTextExplanationBox.style.display = 'none';
      }
    }

    // Determine selection mode for this question
    // If not set, check if already chosen answers length > 1, else default to 'single'
    let mode = state.feQuestionModes[state.feExamId][qIndex];
    if (!mode) {
      const chosen = state.feAnswers[state.feExamId][qIndex] || [];
      mode = chosen.length > 1 ? 'multi' : (qData && qData.type ? qData.type : 'single');
      state.feQuestionModes[state.feExamId][qIndex] = mode;
    }
    updateModeUI(mode);

    // Update active options
    updateOptionsUI();

    // Update flag status
    const isFlagged = !!state.feFlags[state.feExamId][qIndex];
    elements.feFlagBtn.classList.toggle('btn-primary', isFlagged);
    elements.feFlagBtn.classList.toggle('btn-outline', !isFlagged);
    elements.feFlagText.textContent = isFlagged ? 'Đã đánh dấu (F)' : 'Đánh dấu (F)';
    elements.feFlagIcon.setAttribute('fill', isFlagged ? 'currentColor' : 'none');

    // Update notes
    elements.feNotesInput.value = state.feNotes[state.feExamId][qIndex] || '';

    // Handle Custom Practice Banner
    const activeIndices = getActiveQuestionIndices();
    if (state.fePracticeSubset !== 'all' && elements.feCustomPracticeBanner) {
      elements.feCustomPracticeBanner.style.display = 'flex';
      elements.feCustomPracticeBanner.className = 'custom-practice-banner';

      const curPos = activeIndices.indexOf(qIndex) + 1;
      const count = activeIndices.length;

      if (state.fePracticeSubset === 'wrong') {
        elements.feCustomBannerIcon.textContent = '❌';
        elements.feCustomBannerTitle.textContent = `Chế độ Ôn Luyện: ${count} Câu Làm Sai`;
        elements.feCustomBannerSubtitle.textContent = `Đang ở câu ${qIndex + 1} (${curPos}/${count} câu sai). Hãy suy nghĩ và chọn lại đáp án đúng!`;
      } else if (state.fePracticeSubset === 'flagged') {
        elements.feCustomPracticeBanner.classList.add('flagged-mode');
        elements.feCustomBannerIcon.textContent = '🚩';
        elements.feCustomBannerTitle.textContent = `Chế độ Ôn Luyện: ${count} Câu Đánh Dấu`;
        elements.feCustomBannerSubtitle.textContent = `Đang ở câu ${qIndex + 1} (${curPos}/${count} câu cờ). Xem lại các câu bạn từng phân vân!`;
      } else {
        elements.feCustomPracticeBanner.classList.add('combined-mode');
        elements.feCustomBannerIcon.textContent = '🎯';
        elements.feCustomBannerTitle.textContent = `Bộ Đề Ôn Trọng Tâm: ${count} Câu Sai & Đánh Dấu`;
        elements.feCustomBannerSubtitle.textContent = `Đang ở câu ${qIndex + 1} (${curPos}/${count} câu ôn luyện).`;
      }

      elements.feQuestionNumber.textContent = `${qIndex + 1} [${curPos}/${count}]`;
    } else {
      if (elements.feCustomPracticeBanner) elements.feCustomPracticeBanner.style.display = 'none';
      elements.feQuestionNumber.textContent = qIndex + 1;
    }

    // Update navigation buttons
    const activePos = activeIndices.indexOf(qIndex);
    elements.fePrevBtn.disabled = activePos <= 0;
    elements.feNextBtn.disabled = activePos >= activeIndices.length - 1 || activePos === -1;

    renderPalette();
    updateSubsetCounts();
  }

  function setQuestionMode(mode) {
    const qIndex = state.feQuestionIndex;
    state.feQuestionModes[state.feExamId][qIndex] = mode;
    saveFEPersistence();
    updateModeUI(mode);

    // If switching to single and currently has multiple selections, keep only the first
    const current = state.feAnswers[state.feExamId][qIndex] || [];
    if (mode === 'single' && current.length > 1) {
      state.feAnswers[state.feExamId][qIndex] = [current[0]];
      saveFEPersistence();
      updateOptionsUI();
      renderPalette();
    }
  }

  function updateModeUI(mode) {
    if (mode === 'multi') {
      elements.btnModeMulti.classList.add('active');
      elements.btnModeSingle.classList.remove('active');
      elements.feSelectionModeTag.className = 'mode-tag multi';
      elements.feModeIcon.textContent = '☑️';
      elements.feModeText.textContent = 'Chọn 2 đáp án (Multi)';
    } else {
      elements.btnModeSingle.classList.add('active');
      elements.btnModeMulti.classList.remove('active');
      elements.feSelectionModeTag.className = 'mode-tag single';
      elements.feModeIcon.textContent = '🔘';
      elements.feModeText.textContent = 'Chọn 1 đáp án (Single)';
    }
  }

  function handleOptionClick(opt) {
    const qIndex = state.feQuestionIndex;
    const mode = state.feQuestionModes[state.feExamId][qIndex] || 'single';
    let current = state.feAnswers[state.feExamId][qIndex] ? [...state.feAnswers[state.feExamId][qIndex]] : [];

    if (mode === 'single') {
      // Toggle if already selected, or select new
      if (current.includes(opt)) {
        current = [];
      } else {
        current = [opt];
      }
    } else {
      // Multi-choice (max 2 options for EOS standard)
      if (current.includes(opt)) {
        current = current.filter(x => x !== opt);
      } else {
        if (current.length >= 2) {
          // If already 2 selected, replace the earliest one
          current.shift();
        }
        current.push(opt);
      }
    }

    state.feAnswers[state.feExamId][qIndex] = current;

    // Auto evaluate if question has key answers
    if (!state.feExamResults[state.feExamId]) state.feExamResults[state.feExamId] = {};
    const wasWrong = state.feExamResults[state.feExamId][qIndex] === 'wrong';
    const evalRes = evaluateQuestion(state.feExamId, qIndex);
    if (evalRes) {
      state.feExamResults[state.feExamId][qIndex] = evalRes;
      if (wasWrong && evalRes === 'correct') {
        showToast(`🎉 Rất tốt! Bạn đã sửa đúng câu ${qIndex + 1}!`, 'success', 2500);
      }
    } else if (current.length === 0) {
      delete state.feExamResults[state.feExamId][qIndex];
    }

    saveFEPersistence();
    updateOptionsUI();
    renderPalette();
    updateSubsetCounts();
  }

  function updateOptionsUI() {
    const qIndex = state.feQuestionIndex;
    const mode = state.feQuestionModes[state.feExamId][qIndex] || 'single';
    const chosen = state.feAnswers[state.feExamId][qIndex] || [];

    // Sync Circular Buttons below
    elements.feOptionsGrid.querySelectorAll('.opt-btn').forEach(btn => {
      const opt = btn.dataset.option;
      const isSelected = chosen.includes(opt);
      btn.classList.toggle('active', isSelected);
      btn.classList.toggle('multi', isSelected && mode === 'multi');
    });

    // Sync Text Option Items in the Text Card above
    if (elements.feTextOptionsList) {
      elements.feTextOptionsList.querySelectorAll('.text-opt-item').forEach(item => {
        const opt = item.dataset.option;
        const isSelected = chosen.includes(opt);
        item.classList.toggle('active', isSelected);
        item.classList.toggle('multi', isSelected && mode === 'multi');
      });
    }

    if (chosen.length === 0) {
      elements.feSelectedDisplay.textContent = 'Chưa chọn';
      elements.feSelectedDisplay.style.color = 'var(--text-muted)';
    } else {
      const text = chosen.sort().join(', ');
      const limit = mode === 'multi' ? '2' : '1';
      elements.feSelectedDisplay.textContent = `Đã chọn: [ ${text} ] (${chosen.length}/${limit})`;
      elements.feSelectedDisplay.style.color = mode === 'multi' ? 'var(--purple)' : 'var(--primary)';
    }
  }

  function clearCurrentAnswer() {
    const qIndex = state.feQuestionIndex;
    delete state.feAnswers[state.feExamId][qIndex];
    saveFEPersistence();
    updateOptionsUI();
    renderPalette();
    showToast(`Đã bỏ chọn câu ${qIndex + 1}`, 'info');
  }

  function toggleCurrentFlag() {
    const qIndex = state.feQuestionIndex;
    const current = !state.feFlags[state.feExamId][qIndex];
    state.feFlags[state.feExamId][qIndex] = current;
    saveFEPersistence();
    elements.feFlagBtn.classList.toggle('btn-primary', current);
    elements.feFlagBtn.classList.toggle('btn-outline', !current);
    elements.feFlagText.textContent = current ? 'Đã đánh dấu (F)' : 'Đánh dấu (F)';
    elements.feFlagIcon.setAttribute('fill', current ? 'currentColor' : 'none');
    renderPalette();
  }

  function saveCurrentNotes() {
    const qIndex = state.feQuestionIndex;
    state.feNotes[state.feExamId][qIndex] = elements.feNotesInput.value;
    saveFEPersistence();
  }

  // =========================================================================
  // EVALUATION & CUSTOM PRACTICE SUBSET (WRONG / FLAGGED)
  // =========================================================================
  function evaluateQuestion(examId, qIndex) {
    if (typeof getFEQuestionText !== 'function') return null;
    const qData = getFEQuestionText(examId, qIndex);
    if (!qData || !qData.answer || !Array.isArray(qData.answer) || qData.answer.length === 0) {
      return null;
    }

    const userAns = state.feAnswers[examId]?.[qIndex] || [];
    if (userAns.length === 0) return 'unanswered';

    const normalizedUser = [...userAns].sort().join(',');
    const normalizedCorrect = [...qData.answer].sort().join(',');

    return normalizedUser === normalizedCorrect ? 'correct' : 'wrong';
  }

  function getActiveQuestionIndices() {
    const exam = APP_DATA.feExams.find(e => e.id === state.feExamId);
    if (!exam) return [];
    const total = exam.questions.length;
    const all = Array.from({ length: total }, (_, i) => i);

    if (state.fePracticeSubset === 'wrong') {
      const wrong = all.filter(i => state.feExamResults[state.feExamId]?.[i] === 'wrong');
      return wrong.length > 0 ? wrong : all;
    }
    if (state.fePracticeSubset === 'flagged') {
      const flagged = all.filter(i => !!state.feFlags[state.feExamId]?.[i]);
      return flagged.length > 0 ? flagged : all;
    }
    if (state.fePracticeSubset === 'wrong_flagged') {
      const combined = all.filter(i => state.feExamResults[state.feExamId]?.[i] === 'wrong' || !!state.feFlags[state.feExamId]?.[i]);
      return combined.length > 0 ? combined : all;
    }

    return all;
  }

  function updateSubsetCounts() {
    const exam = APP_DATA.feExams.find(e => e.id === state.feExamId);
    if (!exam) return;
    const total = exam.questions.length;
    const results = state.feExamResults[state.feExamId] || {};
    const flags = state.feFlags[state.feExamId] || {};

    let wrongCount = 0;
    let flagCount = 0;
    let combinedCount = 0;

    for (let i = 0; i < total; i++) {
      const isWrong = results[i] === 'wrong';
      const isFlag = !!flags[i];
      if (isWrong) wrongCount++;
      if (isFlag) flagCount++;
      if (isWrong || isFlag) combinedCount++;
    }

    if (elements.fePracticeSubsetSelect) {
      const opts = elements.fePracticeSubsetSelect.options;
      if (opts[0]) opts[0].textContent = `📚 Toàn bộ câu hỏi (${total} câu)`;
      if (opts[1]) opts[1].textContent = `❌ Chỉ làm các câu SAI (${wrongCount})`;
      if (opts[2]) opts[2].textContent = `🚩 Chỉ làm câu ĐÁNH DẤU (${flagCount})`;
      if (opts[3]) opts[3].textContent = `🎯 Kết hợp: Câu SAI + ĐÁNH DẤU (${combinedCount})`;
    }

    if (elements.feCountWrong) {
      elements.feCountWrong.textContent = wrongCount;
    }
  }

  function setPracticeSubset(subset, resetAnswersForTarget = false) {
    const exam = APP_DATA.feExams.find(e => e.id === state.feExamId);
    if (!exam) return;

    state.fePracticeSubset = subset;
    if (elements.fePracticeSubsetSelect) {
      elements.fePracticeSubsetSelect.value = subset;
    }

    const active = getActiveQuestionIndices();
    if (subset !== 'all' && active.length === 0) {
      showToast('Hiện chưa có câu nào trong nhóm này!', 'info');
      state.fePracticeSubset = 'all';
      if (elements.fePracticeSubsetSelect) elements.fePracticeSubsetSelect.value = 'all';
      loadCurrentQuestion();
      renderPalette();
      return;
    }

    // Optional: Reset answers for wrong questions so user can re-attempt cleanly
    if (resetAnswersForTarget && subset === 'wrong') {
      active.forEach(idx => {
        delete state.feAnswers[state.feExamId][idx];
      });
      saveFEPersistence();
      showToast(`Đã làm mới ${active.length} câu sai để bạn tự chọn lại từ đầu!`, 'info');
    }

    // Switch to first item in active subset if current is not in it
    if (subset !== 'all' && !active.includes(state.feQuestionIndex)) {
      state.feQuestionIndex = active[0];
    }

    loadCurrentQuestion();
    renderPalette();
    updateSubsetCounts();
  }

  function changeFEQuestion(delta) {
    const exam = APP_DATA.feExams.find(e => e.id === state.feExamId);
    if (!exam) return;

    const active = getActiveQuestionIndices();
    if (active.length === 0) return;

    let currPos = active.indexOf(state.feQuestionIndex);
    if (currPos === -1) {
      currPos = 0;
    } else {
      currPos += delta;
    }

    if (currPos >= 0 && currPos < active.length) {
      state.feQuestionIndex = active[currPos];
      loadCurrentQuestion();
    }
  }

  function zoomFEImage(delta) {
    state.feZoomLevel = Math.max(0.6, Math.min(2.5, state.feZoomLevel + delta));
    applyFEZoom();
  }

  function applyFEZoom() {
    elements.feQuestionImage.style.transform = `scale(${state.feZoomLevel})`;
  }

  function openFullscreenImage() {
    elements.fullscreenImg.src = elements.feQuestionImage.src;
    elements.fullscreenImgModal.classList.add('active');
  }

  elements.fullscreenImgModal.addEventListener('click', () => {
    elements.fullscreenImgModal.classList.remove('active');
  });

  // Palette rendering
  function renderPalette() {
    const exam = APP_DATA.feExams.find(e => e.id === state.feExamId);
    if (!exam) return;

    elements.fePaletteGrid.innerHTML = '';
    const answers = state.feAnswers[state.feExamId] || {};
    const flags = state.feFlags[state.feExamId] || {};
    const results = state.feExamResults[state.feExamId] || {};
    const activeIndices = getActiveQuestionIndices();

    let doneCount = 0;
    let flagCount = 0;
    let wrongCount = 0;

    exam.questions.forEach((_, idx) => {
      const isAnswered = answers[idx] && answers[idx].length > 0;
      const isFlagged = !!flags[idx];
      const isCurrent = idx === state.feQuestionIndex;
      const qResult = results[idx]; // 'correct' | 'wrong' | 'unanswered'
      const isWrong = qResult === 'wrong';
      const isCorrect = qResult === 'correct';

      if (isAnswered) doneCount++;
      if (isFlagged) flagCount++;
      if (isWrong) wrongCount++;

      // Filter check
      if (state.feFilter === 'done' && !isAnswered) return;
      if (state.feFilter === 'empty' && isAnswered) return;
      if (state.feFilter === 'flag' && !isFlagged) return;
      if (state.feFilter === 'wrong' && !isWrong) return;

      const btn = document.createElement('button');
      btn.className = 'palette-btn';
      btn.textContent = idx + 1;
      if (isCurrent) btn.classList.add('current');
      if (isAnswered) btn.classList.add('answered');
      if (isFlagged) btn.classList.add('flagged');
      if (isWrong) btn.classList.add('wrong');
      if (isCorrect) btn.classList.add('correct');

      // If active custom practice subset is on, highlight/fade items
      if (state.fePracticeSubset !== 'all' && !activeIndices.includes(idx)) {
        btn.style.opacity = '0.35';
      } else {
        btn.style.opacity = '1';
      }

      btn.addEventListener('click', () => {
        state.feQuestionIndex = idx;
        loadCurrentQuestion();
      });

      elements.fePaletteGrid.appendChild(btn);
    });

    elements.feCountDone.textContent = doneCount;
    elements.feCountEmpty.textContent = exam.questions.length - doneCount;
    elements.feCountFlag.textContent = flagCount;
    if (elements.feCountWrong) {
      elements.feCountWrong.textContent = wrongCount;
    }
  }

  function saveFEPersistence() {
    try {
      localStorage.setItem('pmg_fe_answers', JSON.stringify(state.feAnswers));
      localStorage.setItem('pmg_fe_modes', JSON.stringify(state.feQuestionModes));
      localStorage.setItem('pmg_fe_flags', JSON.stringify(state.feFlags));
      localStorage.setItem('pmg_fe_notes', JSON.stringify(state.feNotes));
      localStorage.setItem('pmg_fe_results', JSON.stringify(state.feExamResults));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  function startFETimer() {
    clearInterval(state.feTimer.intervalId);
    state.feTimer.remaining = 60 * 60;
    state.feTimer.running = true;
    updateFETimerDisplay();

    state.feTimer.intervalId = setInterval(() => {
      if (state.feTimer.remaining > 0) {
        state.feTimer.remaining--;
        updateFETimerDisplay();
      } else {
        clearInterval(state.feTimer.intervalId);
        state.feTimer.running = false;
        showToast('HẾT THỜI GIAN THI THỬ 60 PHÚT!', 'error', 6000);
        submitFEExam();
      }
    }, 1000);
  }

  function stopFETimer() {
    clearInterval(state.feTimer.intervalId);
    state.feTimer.running = false;
  }

  function updateFETimerDisplay() {
    elements.feTimerDisplay.textContent = formatTime(state.feTimer.remaining);
    if (state.feTimer.remaining <= 300) {
      elements.feTimerBadge.className = 'timer-badge danger';
    } else {
      elements.feTimerBadge.className = 'timer-badge';
    }
  }

  function resetFEExam() {
    if (confirm('Bạn có chắc muốn xóa toàn bộ câu trả lời và làm lại từ đầu bộ đề này không?')) {
      delete state.feAnswers[state.feExamId];
      delete state.feFlags[state.feExamId];
      saveFEPersistence();
      state.feQuestionIndex = 0;
      loadCurrentQuestion();
      showToast('Đã làm mới đề thi!', 'info');
    }
  }

  function submitFEExam() {
    const exam = APP_DATA.feExams.find(e => e.id === state.feExamId);
    if (!exam) return;

    const answers = state.feAnswers[state.feExamId] || {};
    const flags = state.feFlags[state.feExamId] || {};
    const total = exam.questions.length;

    let done = 0;
    let multiCount = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let flaggedCount = 0;

    if (!state.feExamResults[state.feExamId]) state.feExamResults[state.feExamId] = {};

    const answerLines = [];

    for (let i = 0; i < total; i++) {
      const ans = answers[i] || [];
      const mode = state.feQuestionModes[state.feExamId]?.[i] || (ans.length > 1 ? 'multi' : 'single');
      const isFlag = !!flags[i];
      if (isFlag) flaggedCount++;

      let correctKey = null;
      if (typeof getFEQuestionText === 'function') {
        const qData = getFEQuestionText(state.feExamId, i);
        if (qData && qData.answer) correctKey = qData.answer;
      }

      let evalStatus = 'unanswered';
      if (ans.length > 0) {
        done++;
        if (ans.length > 1) multiCount++;

        if (correctKey && correctKey.length > 0) {
          const userStr = [...ans].sort().join(',');
          const keyStr = [...correctKey].sort().join(',');
          if (userStr === keyStr) {
            evalStatus = 'correct';
            correctCount++;
          } else {
            evalStatus = 'wrong';
            wrongCount++;
          }
        } else {
          evalStatus = 'answered';
        }
      } else {
        if (correctKey && correctKey.length > 0) {
          evalStatus = 'wrong'; // Chưa làm cũng tính là sai khi nộp bài
          wrongCount++;
        }
      }

      state.feExamResults[state.feExamId][i] = evalStatus;

      const ansStr = ans.length > 0 ? ans.sort().join(', ') : 'Chưa chọn';
      const keyStr = correctKey && correctKey.length > 0 ? correctKey.sort().join(', ') : 'Đang cập nhật';
      const flagStr = isFlag ? '🚩' : '';
      const modeStr = mode === 'multi' ? '(Chọn 2)' : '(Chọn 1)';

      answerLines.push({
        num: i + 1,
        mode: modeStr,
        answer: ansStr,
        key: keyStr,
        status: evalStatus,
        flag: flagStr
      });
    }

    saveFEPersistence();
    renderPalette();
    updateSubsetCounts();

    const score = ((correctCount / total) * 10).toFixed(1);
    const isPass = parseFloat(score) >= 5.0;
    const combinedCount = answerLines.filter(l => l.status === 'wrong' || l.flag === '🚩').length;

    // Build modal content
    let html = `
      <div style="background:var(--bg-main); border:1.5px solid var(--border-color); padding:18px 20px; border-radius:var(--radius-md); margin-bottom:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
        <div>
          <div style="font-size:0.85rem; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Kết Quả Đánh Giá</div>
          <div style="display:flex; align-items:baseline; gap:10px; margin-top:4px;">
            <span style="font-size:2.2rem; font-weight:800; color:${isPass ? 'var(--success)' : 'var(--danger)'};">${score}</span>
            <span style="font-size:1.1rem; color:var(--text-muted); font-weight:600;">/ 10 Điểm</span>
            <span style="padding:4px 10px; border-radius:var(--radius-full); font-size:0.8rem; font-weight:800; background:${isPass ? '#dcfce7; color:#15803d;' : '#fee2e2; color:#b91c1c;'}">
              ${isPass ? '✓ ĐẠT (PASS)' : '✕ CHƯA ĐẠT (CẦN ÔN LẠI)'}
            </span>
          </div>
        </div>

        <div style="display:flex; gap:16px; text-align:center;">
          <div>
            <div style="font-size:1.3rem; font-weight:800; color:var(--success);">${correctCount}</div>
            <div style="font-size:0.75rem; color:var(--text-muted)">Câu đúng</div>
          </div>
          <div>
            <div style="font-size:1.3rem; font-weight:800; color:var(--danger);">${wrongCount}</div>
            <div style="font-size:0.75rem; color:var(--text-muted)">Câu sai</div>
          </div>
          <div>
            <div style="font-size:1.3rem; font-weight:800; color:var(--warning);">${flaggedCount}</div>
            <div style="font-size:0.75rem; color:var(--text-muted)">Đánh dấu</div>
          </div>
          <div>
            <div style="font-size:1.3rem; font-weight:800; color:var(--primary);">${done}/${total}</div>
            <div style="font-size:0.75rem; color:var(--text-muted)">Hoàn thành</div>
          </div>
        </div>
      </div>

      <!-- Quick Action Cards to Practice Wrong / Flagged Questions -->
      <div style="margin-bottom:16px;">
        <div style="font-weight:700; font-size:0.88rem; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
          <span>🎯 Chế Độ Ôn Luyện Trọng Tâm Dành Cho Bạn:</span>
        </div>
        <div class="modal-actions-grid">
          ${wrongCount > 0 ? `
            <div class="action-card-btn btn-wrong" id="btnActionPracticeWrong" title="Bấm để làm lại toàn bộ các câu sai">
              <div class="action-card-title" style="color:var(--danger);">
                <span>❌ Làm Lại ${wrongCount} Câu SAI</span>
              </div>
              <div class="action-card-sub">Làm mới đáp án các câu sai để bạn tự suy nghĩ & chọn lại từ đầu</div>
            </div>
          ` : ''}

          ${flaggedCount > 0 ? `
            <div class="action-card-btn btn-flagged" id="btnActionPracticeFlagged" title="Bấm để xem lại các câu đã đánh dấu">
              <div class="action-card-title" style="color:#b45309;">
                <span>🚩 Ôn Tập ${flaggedCount} Câu ĐÁNH DẤU</span>
              </div>
              <div class="action-card-sub">Kiểm tra lại các câu bạn từng phân vân khi làm bài</div>
            </div>
          ` : ''}

          ${(wrongCount > 0 || flaggedCount > 0) ? `
            <div class="action-card-btn btn-combined" id="btnActionPracticeCombined" title="Bấm để ôn tập cả câu sai và câu đánh dấu">
              <div class="action-card-title" style="color:var(--purple);">
                <span>🎯 Bộ Câu Yếu (${combinedCount} câu)</span>
              </div>
              <div class="action-card-sub">Kết hợp toàn bộ câu sai & câu gắn cờ thành 1 phiên ôn tập</div>
            </div>
          ` : ''}
        </div>
      </div>

      <h4 style="margin-bottom:10px; font-size:0.9rem;">Bảng Chi Tiết Kết Quả Từng Câu:</h4>
      <div style="max-height:260px; overflow-y:auto; border:1px solid var(--border-color); border-radius:var(--radius-sm);">
        <table style="width:100%; border-collapse:collapse; font-size:0.83rem;">
          <thead>
            <tr style="background:var(--bg-main); text-align:left; border-bottom:1px solid var(--border-color);">
              <th style="padding:8px 10px;">Câu</th>
              <th style="padding:8px 10px;">Loại câu</th>
              <th style="padding:8px 10px;">Đáp án bạn chọn</th>
              <th style="padding:8px 10px;">Đáp án chuẩn</th>
              <th style="padding:8px 10px;">Đánh giá</th>
              <th style="padding:8px 10px;">Cờ</th>
            </tr>
          </thead>
          <tbody>
    `;

    answerLines.forEach(line => {
      const isCorrect = line.status === 'correct';
      const isWrong = line.status === 'wrong';
      const isUnanswered = line.answer === 'Chưa chọn';

      let statusBadge = '<span style="color:var(--text-muted)">-</span>';
      if (isCorrect) {
        statusBadge = '<span style="color:var(--success); font-weight:700;">✓ Đúng</span>';
      } else if (isWrong) {
        statusBadge = '<span style="color:var(--danger); font-weight:700;">✕ Sai</span>';
      }

      html += `
        <tr style="border-bottom:1px solid var(--border-color); ${isWrong ? 'background:rgba(239,68,68,0.05);' : ''}">
          <td style="padding:8px 10px; font-weight:700;">Câu ${line.num}</td>
          <td style="padding:8px 10px;"><span style="font-size:0.75rem; color:var(--text-muted);">${line.mode}</span></td>
          <td style="padding:8px 10px; font-weight:600; color:${isCorrect ? 'var(--success)' : (isWrong ? 'var(--danger)' : 'var(--text-muted)')};">${line.answer}</td>
          <td style="padding:8px 10px; font-weight:700; color:var(--primary);">${line.key}</td>
          <td style="padding:8px 10px;">${statusBadge}</td>
          <td style="padding:8px 10px;">${line.flag}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    elements.submitModalBody.innerHTML = html;
    elements.submitModal.classList.add('active');

    // Attach Action Card Click Events
    const btnWrong = document.getElementById('btnActionPracticeWrong');
    if (btnWrong) {
      btnWrong.addEventListener('click', () => {
        elements.submitModal.classList.remove('active');
        setPracticeSubset('wrong', true);
      });
    }

    const btnFlagged = document.getElementById('btnActionPracticeFlagged');
    if (btnFlagged) {
      btnFlagged.addEventListener('click', () => {
        elements.submitModal.classList.remove('active');
        setPracticeSubset('flagged', false);
      });
    }

    const btnCombined = document.getElementById('btnActionPracticeCombined');
    if (btnCombined) {
      btnCombined.addEventListener('click', () => {
        elements.submitModal.classList.remove('active');
        setPracticeSubset('wrong_flagged', false);
      });
    }

    // Export handler
    elements.exportResultsBtn.onclick = () => {
      let exportText = `BẢNG KẾT QUẢ BÀI THI PMG201c FE\n`;
      exportText += `Bộ đề: ${exam.title}\n`;
      exportText += `Thời gian xuất: ${new Date().toLocaleString()}\n`;
      exportText += `Điểm số: ${score}/10 (${isPass ? 'ĐẠT' : 'CHƯA ĐẠT'})\n`;
      exportText += `Thống kê: ${correctCount} Đúng | ${wrongCount} Sai | ${flaggedCount} Đánh dấu | ${done}/${total} Hoàn thành\n`;
      exportText += `--------------------------------------------------------\n`;
      answerLines.forEach(l => {
        exportText += `Câu ${String(l.num).padStart(2, '0')}: Đã chọn [ ${l.answer} ] | Chuẩn [ ${l.key} ] | ${l.status.toUpperCase()} ${l.flag ? '[FLAG]' : ''}\n`;
      });
      downloadTextFile(`${exam.id}_KetQua.txt`, exportText);
      showToast('Đã xuất file kết quả bài thi!', 'success');
    };
  }

  // Keyboard shortcut listener
  function handleKeyboardShortcuts(e) {
    if (state.currentView !== 'feView') return;
    // Don't trigger if typing in notes or input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      changeFEQuestion(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      changeFEQuestion(1);
    } else if (['a', 'A'].includes(e.key)) {
      e.preventDefault();
      handleOptionClick('A');
    } else if (['b', 'B'].includes(e.key)) {
      e.preventDefault();
      handleOptionClick('B');
    } else if (['c', 'C'].includes(e.key)) {
      e.preventDefault();
      handleOptionClick('C');
    } else if (['d', 'D'].includes(e.key)) {
      e.preventDefault();
      handleOptionClick('D');
    } else if (['e', 'E'].includes(e.key)) {
      e.preventDefault();
      handleOptionClick('E');
    } else if (['f', 'F'].includes(e.key)) {
      e.preventDefault();
      toggleCurrentFlag();
    }
  }

  // =========================================================================
  // STUDY GUIDE MODULE
  // =========================================================================
  function initGuideModule() {
    const md = APP_DATA.guideMarkdown || '';
    renderGuideMarkdown(md);

    // Search filter
    elements.guideSearchInput.addEventListener('input', () => {
      const query = elements.guideSearchInput.value.toLowerCase().trim();
      const items = elements.guideTocList.querySelectorAll('.toc-item');
      items.forEach(it => {
        const text = it.textContent.toLowerCase();
        it.style.display = text.includes(query) ? 'block' : 'none';
      });
    });
  }

  function renderGuideMarkdown(markdown) {
    // Basic Markdown parser for headings, code blocks, lists, and formatting
    const lines = markdown.split('\n');
    let html = '';
    let inCodeBlock = false;
    let codeBuffer = '';
    const tocItems = [];

    lines.forEach((line, idx) => {
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBuffer = '';
        } else {
          inCodeBlock = false;
          const escaped = escapeHtml(codeBuffer);
          html += `<pre><code>${escaped}</code><button class="copy-code-btn" data-code="${encodeURIComponent(codeBuffer)}">Sao chép</button></pre>`;
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer += line + '\n';
        return;
      }

      // Headings
      if (line.startsWith('# ')) {
        const text = line.substring(2).trim();
        const id = 'heading-' + idx;
        html += `<h1 id="${id}">${escapeHtml(text)}</h1>`;
        tocItems.push({ level: 1, text, id });
      } else if (line.startsWith('## ')) {
        const text = line.substring(3).trim();
        const id = 'heading-' + idx;
        html += `<h2 id="${id}">${escapeHtml(text)}</h2>`;
        tocItems.push({ level: 2, text, id });
      } else if (line.startsWith('### ')) {
        const text = line.substring(4).trim();
        const id = 'heading-' + idx;
        html += `<h3 id="${id}">${escapeHtml(text)}</h3>`;
        tocItems.push({ level: 3, text, id });
      } else if (line.startsWith('* ') || line.startsWith('- ')) {
        html += `<li>${formatInline(line.substring(2))}</li>`;
      } else if (/^\d+\.\s/.test(line)) {
        html += `<li>${formatInline(line.replace(/^\d+\.\s/, ''))}</li>`;
      } else if (line.trim() === '---') {
        html += '<hr style="border:none; border-top:1px solid var(--border-color); margin:28px 0;">';
      } else if (line.trim()) {
        html += `<p>${formatInline(line)}</p>`;
      }
    });

    elements.guideArticle.innerHTML = html;

    // Build TOC
    elements.guideTocList.innerHTML = tocItems.map(item => `
      <li>
        <a class="toc-item" href="#${item.id}" style="padding-left:${item.level * 10}px">
          ${escapeHtml(item.text)}
        </a>
      </li>
    `).join('');

    // Smooth scroll for TOC links
    elements.guideTocList.querySelectorAll('.toc-item').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Copy code button handler
    elements.guideArticle.querySelectorAll('.copy-code-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = decodeURIComponent(btn.dataset.code);
        navigator.clipboard.writeText(code).then(() => {
          const original = btn.textContent;
          btn.textContent = '✓ Đã chép!';
          setTimeout(() => btn.textContent = original, 2000);
          showToast('Đã sao chép khung mẫu vào clipboard!', 'success');
        });
      });
    });
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatInline(str) {
    let out = escapeHtml(str);
    // Bold
    out = out.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    out = out.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Code
    out = out.replace(/`(.*?)`/g, '<code>$1</code>');
    return out;
  }

  // =========================================================================
  // FORMULA & SUBMIT MODALS
  // =========================================================================
  elements.btnQuickFormula.addEventListener('click', () => {
    elements.formulaModal.classList.add('active');
  });

  elements.closeFormulaModalBtn.addEventListener('click', () => {
    elements.formulaModal.classList.remove('active');
  });

  elements.confirmFormulaModalBtn.addEventListener('click', () => {
    elements.formulaModal.classList.remove('active');
  });

  elements.formulaModal.addEventListener('click', (e) => {
    if (e.target === elements.formulaModal) {
      elements.formulaModal.classList.remove('active');
    }
  });

  elements.closeSubmitModalBtn.addEventListener('click', () => {
    elements.submitModal.classList.remove('active');
  });

  elements.closeSubmitModalBtn2.addEventListener('click', () => {
    elements.submitModal.classList.remove('active');
  });

  // =========================================================================
  // BOOTSTRAP APP
  // =========================================================================
  function initApp() {
    applyTheme(state.theme);
    initPEModule();
    initFEModule();
    initGuideModule();

    // Restore active view
    const lastView = localStorage.getItem('pmg_active_view') || 'peView';
    switchView(lastView);

    console.log('PMG201c Exam Practice Hub loaded successfully!');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
