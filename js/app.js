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
    feInstantFeedback: localStorage.getItem('pmg_fe_instant_feedback') !== 'false', // Instant right/wrong on click
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
    peRequirementSelect: document.getElementById('peRequirementSelect'),
    peGradeReqBtn: document.getElementById('peGradeReqBtn'),
    peGradeModal: document.getElementById('peGradeModal'),
    peGradeModalTitle: document.getElementById('peGradeModalTitle'),
    peGradeModalBody: document.getElementById('peGradeModalBody'),
    closePeGradeModalBtn: document.getElementById('closePeGradeModalBtn'),
    closePeGradeModalBtn2: document.getElementById('closePeGradeModalBtn2'),
    copyPeGradeFeedbackBtn: document.getElementById('copyPeGradeFeedbackBtn'),
    autoInsertPeFixBtn: document.getElementById('autoInsertPeFixBtn'),

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
    feSaveBtn: document.getElementById('feSaveBtn'),
    feSaveBtnSidebar: document.getElementById('feSaveBtnSidebar'),
    feSaveIndicator: document.getElementById('feSaveIndicator'),
    feSaveText: document.getElementById('feSaveText'),
    feBackupBtn: document.getElementById('feBackupBtn'),
    feBackupModal: document.getElementById('feBackupModal'),
    closeBackupModalBtn: document.getElementById('closeBackupModalBtn'),
    cancelBackupModalBtn: document.getElementById('cancelBackupModalBtn'),
    btnExportCurrentExam: document.getElementById('btnExportCurrentExam'),
    btnExportAllExams: document.getElementById('btnExportAllExams'),
    btnTriggerImportBackup: document.getElementById('btnTriggerImportBackup'),
    feImportBackupFile: document.getElementById('feImportBackupFile'),
    feBackupCurrentExamTitle: document.getElementById('feBackupCurrentExamTitle'),
    feBackupDoneCount: document.getElementById('feBackupDoneCount'),
    feBackupFlagCount: document.getElementById('feBackupFlagCount'),
    feBackupStatusText: document.getElementById('feBackupStatusText'),
    feBackupLastSaved: document.getElementById('feBackupLastSaved'),
    btnInstantFeedbackToggle: document.getElementById('btnInstantFeedbackToggle'),
    instantFeedbackText: document.getElementById('instantFeedbackText'),
    feInstantResultBar: document.getElementById('feInstantResultBar'),
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

    // PE Requirement Grader Listeners
    if (elements.peGradeReqBtn) {
      elements.peGradeReqBtn.addEventListener('click', handleGradePEClick);
    }
    if (elements.closePeGradeModalBtn) {
      elements.closePeGradeModalBtn.addEventListener('click', () => {
        elements.peGradeModal.classList.remove('active');
      });
    }
    if (elements.closePeGradeModalBtn2) {
      elements.closePeGradeModalBtn2.addEventListener('click', () => {
        elements.peGradeModal.classList.remove('active');
      });
    }
    if (elements.copyPeGradeFeedbackBtn) {
      elements.copyPeGradeFeedbackBtn.addEventListener('click', handleCopyPeFeedback);
    }
    if (elements.autoInsertPeFixBtn) {
      elements.autoInsertPeFixBtn.addEventListener('click', handleAutoInsertPeFix);
    }

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
  // PE REQUIREMENT GRADER & FIX GUIDE ENGINE
  // =========================================================================
  let lastPeGradeResult = null;

  function handleGradePEClick() {
    const text = elements.peTextarea.value.trim();
    if (!text) {
      showToast('Vui lòng nhập hoặc viết bài làm PE trước khi nộp chấm điểm!', 'warning');
      return;
    }

    const reqType = elements.peRequirementSelect ? elements.peRequirementSelect.value : 'req1';
    const result = gradePERequirement(text, reqType);
    lastPeGradeResult = result;

    renderPEGradeModal(result);
    elements.peGradeModal.classList.add('active');
  }

  function handleAutoInsertPeFix() {
    if (!lastPeGradeResult || !lastPeGradeResult.sampleFixCode) {
      showToast('Không có nội dung mẫu sửa lỗi cho bài này!', 'warning');
      return;
    }
    const currentVal = elements.peTextarea.value.trim();
    if (currentVal.length > 0) {
      elements.peTextarea.value = currentVal + '\n\n' + lastPeGradeResult.sampleFixCode + '\n';
    } else {
      elements.peTextarea.value = lastPeGradeResult.sampleFixCode + '\n';
    }
    updatePEWordCount();
    savePEContent();
    elements.peGradeModal.classList.remove('active');
    showToast('🎉 Đã tự động chèn khung mẫu chuẩn sửa lỗi vào bài làm của bạn!', 'success', 3500);
  }

  function handleCopyPeFeedback() {
    if (!lastPeGradeResult) return;
    let copyText = `BÁO CÁO ĐÁNH GIÁ & CHẤM ĐIỂM REQUIREMENT BÀI THI PE (PMG201c EOS)\n`;
    copyText += `Yêu cầu: ${lastPeGradeResult.title}\n`;
    copyText += `Điểm số: ${lastPeGradeResult.score} / ${lastPeGradeResult.maxScore} (${lastPeGradeResult.badgeText})\n`;
    copyText += `Độ dài bài làm: ${lastPeGradeResult.wordCount} từ\n`;
    copyText += `--------------------------------------------------------\n`;
    copyText += `1. KẾT QUẢ TIÊU CHÍ CHẤM THI EOS:\n`;
    lastPeGradeResult.criteria.forEach(c => {
      copyText += `[${c.passed ? '✓ ĐẠT' : '✕ CHƯA ĐẠT'}] ${c.name} (${c.points}/${c.maxPoints}đ): ${c.note}\n`;
    });
    if (lastPeGradeResult.fixes && lastPeGradeResult.fixes.length > 0) {
      copyText += `\n2. NHỮNG ĐIỂM CẦN FIX & LƯU Ý KHI VIẾT:\n`;
      lastPeGradeResult.fixes.forEach(f => {
        copyText += `* ${f.title}\n  ${f.message}\n`;
      });
    }
    navigator.clipboard.writeText(copyText).then(() => {
      showToast('Đã sao chép toàn bộ nhận xét vào Clipboard!', 'success');
    });
  }

  function renderPEGradeModal(result) {
    if (!elements.peGradeModalBody) return;
    elements.peGradeModalTitle.textContent = `🎯 Đánh Giá: ${result.title}`;

    let html = `
      <!-- Score Overview Card -->
      <div class="pe-score-card">
        <div>
          <div style="font-size:0.85rem; color:var(--text-muted); font-weight:600; text-transform:uppercase;">
            Điểm Đánh Giá Chuẩn EOS
          </div>
          <div class="pe-score-big">${result.score} <span style="font-size:1.1rem; color:var(--text-muted); font-weight:500;">/ ${result.maxScore}</span></div>
          <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">
            Độ dài bài viết: <strong>${result.wordCount} từ</strong> • Trạng thái: <span class="pe-score-badge ${result.badgeClass}">${result.badgeText}</span>
          </div>
        </div>
        <div style="text-align:right;">
          <div class="pe-score-badge ${result.badgeClass}" style="font-size:1rem; padding:8px 16px;">
            ${result.badgeText}
          </div>
        </div>
      </div>
    `;

    // 1. Checklist
    html += `
      <div style="margin-bottom:16px;">
        <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-main); margin-bottom:8px; display:flex; align-items:center; gap:6px;">
          <span>📋</span> 1. Kết Quả Kiểm Tra Tiêu Chí Chấm Thi EOS
        </h4>
        <div class="pe-checklist-section">
    `;

    result.criteria.forEach(c => {
      html += `
        <div class="pe-checklist-item ${c.passed ? 'passed' : 'failed'}">
          <div class="pe-check-icon ${c.passed ? 'passed' : 'failed'}">
            ${c.passed ? '✓' : '✕'}
          </div>
          <div style="flex:1;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <strong style="color:${c.passed ? 'var(--text-main)' : 'var(--danger)'};">${c.name}</strong>
              <span style="font-weight:700; font-size:0.82rem; color:${c.passed ? 'var(--success)' : 'var(--danger)'};">
                ${c.points}/${c.maxPoints}đ
              </span>
            </div>
            <div style="font-size:0.82rem; color:var(--text-muted); margin-top:2px;">${c.note}</div>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    // 2. Fixes & Advice
    if (result.fixes && result.fixes.length > 0) {
      html += `
        <div style="margin-bottom:16px;">
          <h4 style="font-size:0.95rem; font-weight:700; color:var(--danger); margin-bottom:8px; display:flex; align-items:center; gap:6px;">
            <span>⚠️</span> 2. Những Điểm Cần FIX & Lưu Ý Quan Trọng Khi Viết Bài
          </h4>
          <div class="pe-fix-container">
      `;

      result.fixes.forEach(f => {
        html += `
          <div class="pe-fix-alert">
            <strong>${f.title}</strong>
            <div>${f.message}</div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    }

    // 3. Sample Fix Code
    if (result.sampleFixCode) {
      html += `
        <div style="margin-bottom:8px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <h4 style="font-size:0.95rem; font-weight:700; color:var(--primary); display:flex; align-items:center; gap:6px; margin:0;">
              <span>💡</span> 3. Khung Mẫu Chuẩn EOS Để Sửa Bài (Fix Suggestion)
            </h4>
            <span style="font-size:0.75rem; color:var(--text-muted);">Format Text không kẻ bảng đạt điểm tối đa</span>
          </div>
          <div class="pe-sample-code-box">
            <pre>${escapeHtml(result.sampleFixCode)}</pre>
          </div>
        </div>
      `;
    }

    elements.peGradeModalBody.innerHTML = html;
  }

  function gradePERequirement(text, reqType = 'req1') {
    text = (text || '').trim();
    const lower = text.toLowerCase();

    // Auto-detect requirement based on keywords if needed
    if (reqType === 'auto') {
      if (lower.includes('critical path') || lower.includes('evm') || lower.includes('spi') || lower.includes('cpi')) {
        reqType = 'req5';
      } else if (lower.includes('risk') || lower.includes('mitigation') || lower.includes('contingency')) {
        reqType = 'req4';
      } else if (lower.includes('wbs') || lower.includes('raci') || lower.includes('breakdown structure')) {
        reqType = 'req3';
      } else if (lower.includes('budget') || lower.includes('bottom-up') || lower.includes('parametric') || (lower.includes('cost') && lower.includes('labor'))) {
        reqType = 'req2';
      } else {
        reqType = 'req1';
      }
    }

    if (reqType === 'all') {
      return gradeAllPERequirements(text, lower);
    }

    if (reqType === 'req1') return evaluateReq1Charter(text, lower);
    if (reqType === 'req2') return evaluateReq2Budget(text, lower);
    if (reqType === 'req3') return evaluateReq3WBS(text, lower);
    if (reqType === 'req4') return evaluateReq4Risk(text, lower);
    if (reqType === 'req5') return evaluateReq5CPM(text, lower);

    return evaluateReq1Charter(text, lower);
  }

  function evaluateReq1Charter(text, lower) {
    const words = text ? text.split(/\s+/).length : 0;
    const criteria = [];
    const fixes = [];

    // 1. Project Title
    const hasTitle = /(project\s*(name|title)|tên\s*dự\s*án)/i.test(text);
    criteria.push({
      name: '1. Tên Dự Án (Project Name / Title)',
      passed: hasTitle,
      points: hasTitle ? 1.0 : 0.0,
      maxPoints: 1.0,
      note: hasTitle ? 'Đã nêu rõ tên dự án cụ thể.' : 'Chưa có mục Project Name / Title rõ ràng.'
    });
    if (!hasTitle) {
      fixes.push({
        title: '⚠️ THIẾU TÊN DỰ ÁN CỤ THỂ (PROJECT NAME)',
        message: 'Hãy mở đầu bằng: "1. Project Name: [Tên dự án đầy đủ và chuyên nghiệp]" (Ví dụ: FPT University Student Learning Management System).'
      });
    }

    // 2. Project Purpose
    const hasPurpose = /(purpose|mục\s*đích|description|tổng\s*quan)/i.test(text);
    criteria.push({
      name: '2. Mục Đích Dự Án (Project Purpose)',
      passed: hasPurpose,
      points: hasPurpose ? 1.5 : 0.0,
      maxPoints: 1.5,
      note: hasPurpose ? 'Đã giải thích mục đích tổng quan của dự án.' : 'Thiếu phần trình bày mục đích và bối cảnh thành lập dự án.'
    });

    // 3. Justifications (At least 2 business reasons)
    const hasJustification = /(justification|reason|lý\s*do|bởi\s*vì|why|chứng\s*minh)/i.test(text);
    const hasMultipleJustifications = /(justification\s*1|reason\s*1|justification\s*2|lý\s*do\s*1|lý\s*do\s*2)/i.test(text) || (text.match(/justification/gi) || []).length >= 2;
    const justPoints = hasMultipleJustifications ? 1.5 : (hasJustification ? 0.75 : 0.0);
    criteria.push({
      name: '3. Ít Nhất 2 Lý Do Chứng Minh (Business Justifications)',
      passed: hasMultipleJustifications,
      points: justPoints,
      maxPoints: 1.5,
      note: hasMultipleJustifications
        ? 'Đã cung cấp tối thiểu 2 lý do kinh doanh chứng minh nhu cầu dự án.'
        : (hasJustification ? 'Mới nêu 1 lý do, đề bài thi PE EOS luôn yêu cầu ít nhất 2 lý do chứng minh.' : 'Thiếu phần Business Justifications.')
    });
    if (!hasMultipleJustifications) {
      fixes.push({
        title: '⚠️ CẦN TỐI THIỂU 2 LÝ DO KINH DOANH (JUSTIFICATIONS)',
        message: 'Giám khảo luôn tìm kiếm ít nhất 2 lý do thuyết phục tổ chức đầu tư vào dự án (VD: Justification 1: Hệ thống cũ bị phân mảnh gây thất thoát dữ liệu; Justification 2: Đáp ứng yêu cầu chuyển đổi số và giám sát kiểm định chất lượng).'
      });
    }

    // 4. Customer & Sponsor
    const hasCustomer = /(customer|khách\s*hàng|beneficiar|người\s*dùng)/i.test(text);
    const hasSponsor = /(sponsor|nhà\s*tài\s*trợ|chủ\s*đầu\s*tư|director|board)/i.test(text);
    const hasStakeholders = hasCustomer && hasSponsor;
    criteria.push({
      name: '4. Xác Định Khách Hàng (Customer) & Nhà Tài Trợ (Sponsor)',
      passed: hasStakeholders,
      points: hasStakeholders ? 1.0 : (hasCustomer || hasSponsor ? 0.5 : 0.0),
      maxPoints: 1.0,
      note: hasStakeholders
        ? 'Đã chỉ định rõ đối tượng khách hàng sử dụng và nhà tài trợ phê duyệt vốn.'
        : 'Cần phân biệt rõ: Customer là người thụ hưởng sản phẩm, Sponsor là bên cấp tiền và phê duyệt Charter.'
    });

    // 5. In-Scope & Out-of-Scope (Super Important!)
    const hasInScope = /(in-scope|in\s*scope|trong\s*phạm\s*vi)/i.test(text);
    const hasOutScope = /(out-of-scope|out\s*of\s*scope|ngoài\s*phạm\s*vi)/i.test(text);
    const scopePassed = hasInScope && hasOutScope;
    let scopePoints = 0;
    if (hasInScope && hasOutScope) scopePoints = 2.0;
    else if (hasInScope) scopePoints = 1.0;
    criteria.push({
      name: '5. Phạm Vi Dự Án (Bắt buộc đủ cả In-Scope VÀ Out-of-Scope)',
      passed: scopePassed,
      points: scopePoints,
      maxPoints: 2.0,
      note: scopePassed
        ? 'Rất tốt! Đã có đầy đủ cả ranh giới Trong phạm vi (In-scope) và Ngoài phạm vi (Out-of-scope).'
        : (hasInScope ? 'ĐÃ CÓ In-scope nhưng THIẾU Out-of-Scope! Đây là lỗi bị trừ điểm nhiều nhất trong PE.' : 'Thiếu hoàn toàn mục phân định Scope.')
    });
    if (!hasOutScope) {
      fixes.push({
        title: '⚠️ LỖI BỊ TRỪ ĐIỂM NẶNG NHẤT: THIẾU OUT-OF-SCOPE (NGOÀI PHẠM VI)',
        message: 'Trong barem chấm thi EOS, thí sinh bị trừ từ 1.0 đến 1.5 điểm nếu không viết Out-of-Scope. Dự án không thể làm tất cả mọi thứ! Hãy bổ sung ngay ít nhất 2 mục Out-of-scope:\n- Out-of-scope 1: Cung cấp thiết bị phần cứng/smartphone cho người dùng cuối.\n- Out-of-scope 2: Dịch thuật nội dung sang các ngôn ngữ khác ngoài tiếng Việt và Anh.\n- Out-of-scope 3: Bảo trì và nâng cấp tính năng miễn phí sau thời hạn bảo hành 6 tháng.'
      });
    }

    // 6. Time, Cost, Quality Constraints
    const hasTime = /(time|thời\s*gian|duration|weeks|months|deadline|lịch\s*trình)/i.test(text);
    const hasCost = /(cost|chi\s*phí|budget|ngân\s*sách|\$|vnd)/i.test(text);
    const hasQuality = /(quality|chất\s*lượng|tiêu\s*chuẩn|bug|iso|uptime)/i.test(text);
    const constrPassed = hasTime && hasCost && hasQuality;
    let constrPoints = 0;
    if (hasTime) constrPoints += 0.5;
    if (hasCost) constrPoints += 0.5;
    if (hasQuality) constrPoints += 0.5;
    criteria.push({
      name: '6. Bộ 3 Ràng Buộc (Time, Cost, Quality Constraints)',
      passed: constrPassed,
      points: constrPoints,
      maxPoints: 1.5,
      note: constrPassed
        ? 'Đã bao quát đủ ràng buộc Thời gian (Time), Chi phí (Cost), và Tiêu chuẩn chất lượng (Quality).'
        : `Còn thiếu: ${[!hasTime && 'Time', !hasCost && 'Cost', !hasQuality && 'Quality'].filter(Boolean).join(', ')}.`
    });

    // 7. Milestones
    const hasMilestones = /(milestone|cột\s*mốc|mốc\s*thời\s*gian|week\s*\d+|giai\s*đoạn)/i.test(text);
    criteria.push({
      name: '7. Các Mốc Quan Trọng (Key Milestones)',
      passed: hasMilestones,
      points: hasMilestones ? 1.5 : 0.0,
      maxPoints: 1.5,
      note: hasMilestones ? 'Đã liệt kê các cột mốc chính của dự án.' : 'Thiếu danh sách Key Milestones.'
    });

    const totalScore = parseFloat(criteria.reduce((sum, c) => sum + c.points, 0).toFixed(1));
    const badge = totalScore >= 8.5 ? { text: 'Xuất sắc', class: 'high' } : (totalScore >= 5.0 ? { text: 'Đạt yêu cầu', class: 'medium' } : { text: 'Cần sửa chữa', class: 'low' });

    if (words < 120) {
      fixes.unshift({
        title: '⚠️ BÀI VIẾT QUÁ NGẮN CHO CÂU 1 (PROJECT CHARTER)',
        message: `Bài làm hiện tại chỉ có ${words} từ. Một bản Project Charter chuẩn đạt điểm 9-10 trên phần mềm EOS thường dài từ 250 - 450 từ với đầy đủ các mục đánh số rõ ràng.`
      });
    }

    const sampleFixCode = `REQUEST 1: PROJECT CHARTER STATEMENT

1. Project Name:
   FPT University Student Learning Management (SLM) System

2. Project Purpose & Justifications:
   - Purpose: Centralize learning resources, online submissions, and real-time grading analytics for faculty and students.
   - Justification 1: Eliminates fragmented submission channels and minimizes lost homework records.
   - Justification 2: Provides direct API integration with the central Academic Portal for automated transcripts.
   - Justification 3: Enables 24/7 self-service grade and attendance tracking for students.

3. Customer and Project Sponsor:
   - Customer: Over 25,000 university students, 600 lecturers, and academic department staff.
   - Project Sponsor: Academic Affairs Directorate and University Board of Trustees.

4. Project Constraints:
   - Scope Constraint:
     + In-scope: UI/UX design, core backend RESTful APIs, database schema migration, role-based access control, UAT verification.
     + Out-of-scope: Hardware device procurement, third-party LMS commercial licensing, multi-language localization beyond VN/EN.
   - Time Constraint: Strictly limited to 16 calendar weeks (4 months), commencing Feb 1, 2026 and baselined to end May 25, 2026.
   - Cost Constraint: Fixed capital ceiling of $15,000 (VND 375,000,000), covering labor, AWS cloud servers, and security audits.
   - Quality Constraint: Zero Severity-1 blocker bugs at release; 99.8% server uptime; complies with ISO/IEC 25010.

5. Key Milestones:
   - Milestone 1 (Charter Sign-off & Kick-off): End of Week 2.
   - Milestone 2 (Architecture Baselined & WBS): End of Week 4.
   - Milestone 3 (Core Code Freeze & Alpha Testing): End of Week 10.
   - Milestone 4 (Beta Testing & UAT Sign-off): End of Week 14.
   - Milestone 5 (Production Rollout & Closure): End of Week 16.`;

    return {
      reqType: 'req1',
      title: 'Requirement 1: Project Charter & Constraints',
      score: totalScore,
      maxScore: 10,
      badgeText: badge.text,
      badgeClass: badge.class,
      wordCount: words,
      criteria,
      fixes,
      sampleFixCode
    };
  }

  function evaluateReq2Budget(text, lower) {
    const words = text ? text.split(/\s+/).length : 0;
    const criteria = [];
    const fixes = [];

    // 1. Labor Cost
    const hasLabor = /(labor|personnel|nhân\s*sự|lương|salary|wage|hourly)/i.test(text);
    criteria.push({
      name: '1. Chi Phí Nhân Sự (Labor Cost)',
      passed: hasLabor,
      points: hasLabor ? 2.0 : 0.0,
      maxPoints: 2.0,
      note: hasLabor ? 'Đã liệt kê chi phí cho các thành viên/vai trò dự án.' : 'Thiếu khoản mục Labor Cost (chi phí nhân sự).'
    });

    // 2. Software & Tooling
    const hasSoftware = /(software|license|cloud|hosting|aws|azure|bản\s*quyền|công\s*cụ)/i.test(text);
    criteria.push({
      name: '2. Chi Phí Phần Mềm / Bản Quyền / Máy Chủ (Software & Tools)',
      passed: hasSoftware,
      points: hasSoftware ? 1.5 : 0.0,
      maxPoints: 1.5,
      note: hasSoftware ? 'Đã có chi phí bản quyền công cụ, hạ tầng đám mây.' : 'Thiếu chi phí Software, Tooling hoặc Cloud Server.'
    });

    // 3. Training Cost
    const hasTraining = /(training|onboarding|đào\s*tạo|hướng\s*dẫn|workshop)/i.test(text);
    criteria.push({
      name: '3. Chi Phí Đào Tạo & Chuyển Giao (Training Cost)',
      passed: hasTraining,
      points: hasTraining ? 1.5 : 0.0,
      maxPoints: 1.5,
      note: hasTraining ? 'Đã dự toán chi phí đào tạo người dùng và tài liệu.' : 'Thiếu khoản mục Training & User Manuals.'
    });

    // 4. Overhead & Operational Cost
    const hasOverhead = /(overhead|operational|vận\s*hành|tiện\s*ích|utility|internet)/i.test(text);
    criteria.push({
      name: '4. Chi Phí Vận Hành & Tiện Ích (Overhead & Operational)',
      passed: hasOverhead,
      points: hasOverhead ? 1.5 : 0.0,
      maxPoints: 1.5,
      note: hasOverhead ? 'Đã có chi phí vận hành chung và thiết bị phụ trợ.' : 'Thiếu khoản mục Overhead / Operational Cost.'
    });

    // 5. Contingency Reserve
    const hasContingency = /(contingency|dự\s*phòng|reserve|buffer|10%|5%)/i.test(text);
    criteria.push({
      name: '5. Quỹ Dự Phòng Rủi Ro (Contingency Reserve 5% - 10%)',
      passed: hasContingency,
      points: hasContingency ? 1.5 : 0.0,
      maxPoints: 1.5,
      note: hasContingency ? 'Đã trích lập quỹ dự phòng rủi ro ngân sách.' : 'Thiếu khoản mục Contingency Reserve dự phòng rủi ro.'
    });
    if (!hasContingency) {
      fixes.push({
        title: '⚠️ BẮT BUỘC TRÍCH LẬP QUỸ DỰ PHÒNG (CONTINGENCY RESERVE)',
        message: 'Trong Quản trị dự án chuẩn PMI, mọi bảng ngân sách bắt buộc phải có Contingency Reserve (thường trích từ 5% đến 10% tổng baseline) để phòng ngừa rủi ro phát sinh kỹ thuật.'
      });
    }

    // 6. Estimation Methods Named
    const hasMethods = /(bottom-up|parametric|analogous|expert\s*judgment|reserve\s*analysis|phương\s*pháp\s*ước\s*lượng)/i.test(text);
    const methodCount = (text.match(/bottom-up|parametric|analogous|expert\s*judgment|reserve\s*analysis/gi) || []).length;
    const methodPassed = methodCount >= 3 || hasMethods;
    criteria.push({
      name: '6. Nêu Tên Các Phương Pháp Ước Lượng Chi Phí (Estimation Methods)',
      passed: methodPassed,
      points: methodCount >= 3 ? 2.0 : (hasMethods ? 1.0 : 0.0),
      maxPoints: 2.0,
      note: methodCount >= 3
        ? 'Rất tốt! Đã gắn rõ tên phương pháp ước lượng chuẩn cho từng khoản chi.'
        : (hasMethods ? 'Cần nêu rõ tên phương pháp cho từng khoản mục (Bottom-up, Parametric, Analogous, Expert Judgment, Reserve Analysis).' : 'Thiếu tên các phương pháp ước lượng!')
    });
    if (methodCount < 3) {
      fixes.push({
        title: '⚠️ THIẾU TÊN PHƯƠNG PHÁP ƯỚC LƯỢNG CHI PHÍ CHUẨN',
        message: 'Đề bài PMG201c luôn yêu cầu "Explain cost estimation methods". Nếu bạn chỉ ghi số tiền mà không gắn tên phương pháp, bạn sẽ bị mất 30-40% số điểm câu này. Hãy gắn chuẩn:\n- Labor Cost: Bottom-up Estimation (Tính số giờ * đơn giá lương/giờ).\n- Software Cost: Parametric Estimation (Đơn giá theo đầu người/tháng * số user).\n- Training Cost: Expert Judgment (Tham vấn chuyên gia giảng dạy).\n- Overhead Cost: Analogous Estimation (Dựa trên lịch sử các dự án cũ).\n- Contingency: Reserve Analysis (Trích 10% tổng ngân sách).'
      });
    }

    const totalScore = parseFloat(criteria.reduce((sum, c) => sum + c.points, 0).toFixed(1));
    const badge = totalScore >= 8.5 ? { text: 'Xuất sắc', class: 'high' } : (totalScore >= 5.0 ? { text: 'Đạt yêu cầu', class: 'medium' } : { text: 'Cần sửa chữa', class: 'low' });

    const sampleFixCode = `REQUEST 2: COST BUDGET & 5 ESTIMATION METHODS

1. Labor Cost (Chi phí nhân sự): $9,500
   - Description: Salaries for PM ($2,500), BA ($2,000), 2 Developers ($3,500), and QA Tester ($1,500).
   - Estimation Method: Bottom-up Estimation (Calculated by multiplying estimated task hours by respective hourly wage rates across the WBS).

2. Software & Tooling Cost (Chi phí phần mềm & công cụ): $1,800
   - Description: AWS Cloud hosting subscriptions ($1,000), Figma design licenses ($300), and automated testing tools ($500).
   - Estimation Method: Parametric Estimation (Unit license price multiplied by user accounts and duration).

3. Training & Onboarding Cost (Chi phí đào tạo): $1,200
   - Description: Instructional webinars, user training sessions, and printed operational manuals.
   - Estimation Method: Expert Judgment (Estimated through consultation with senior academic instructors based on previous LMS rollouts).

4. Operational & Overhead Cost (Chi phí vận hành): $1,000
   - Description: High-speed internet access, cloud database backup drives, and test mobile devices.
   - Estimation Method: Analogous Estimation (Derived from actual expense logs of prior university IT system deployments).

5. Contingency Reserve (Quỹ dự phòng rủi ro 10%): $1,500
   - Description: Dedicated financial safety buffer for unforeseen technical defects and change requests.
   - Estimation Method: Percentage Reserve Analysis (Allocated as exactly 10% of total baseline project budget).

=> Total Project Budget: $15,000 (VND 375,000,000)`;

    return {
      reqType: 'req2',
      title: 'Requirement 2: Cost Budget & Estimation Methods',
      score: totalScore,
      maxScore: 10,
      badgeText: badge.text,
      badgeClass: badge.class,
      wordCount: words,
      criteria,
      fixes,
      sampleFixCode
    };
  }

  function evaluateReq3WBS(text, lower) {
    const words = text ? text.split(/\s+/).length : 0;
    const criteria = [];
    const fixes = [];

    // 1. Hierarchy decimal
    const hasHierarchy = /\b\d+\.\d+(\.\d+)?\b/.test(text);
    criteria.push({
      name: '1. Cấu Trúc Phân Rã WBS Tối Thiểu 3 Cấp (1., 1.1, 1.1.1)',
      passed: hasHierarchy,
      points: hasHierarchy ? 3.0 : 1.0,
      maxPoints: 3.0,
      note: hasHierarchy ? 'Đã áp dụng định dạng số phân cấp thập phân chuẩn EOS.' : 'Cần trình bày WBS theo các cấp số: 1. -> 1.1 -> 1.1.1.'
    });

    // 2. Lifecycle Phases
    const hasPhases = /(initiation|planning|design|development|testing|deployment|closure|khởi\s*tạo|kế\s*hoạch|thiết\s*kế|lập\s*trình|kiểm\s*thử)/i.test(text);
    criteria.push({
      name: '2. Đầy Đủ Các Giai Đoạn Phát Triển (Lifecycle Phases)',
      passed: hasPhases,
      points: hasPhases ? 2.5 : 0.5,
      maxPoints: 2.5,
      note: hasPhases ? 'Bao quát đủ các giai đoạn từ Initiation, Planning đến Testing và Closure.' : 'Thiếu các giai đoạn phát triển chính.'
    });

    // 3. RACI Matrix presence
    const hasRACI = /(raci|ram|matrix|ma\s*trận|responsible|accountable|consulted|informed)/i.test(text);
    criteria.push({
      name: '3. Ma Trận Phân Công Trách Nhiệm (RACI Matrix / RAM)',
      passed: hasRACI,
      points: hasRACI ? 2.5 : 0.0,
      maxPoints: 2.5,
      note: hasRACI ? 'Đã lập ma trận RACI phân công công việc.' : 'Thiếu phần RACI Matrix / RAM.'
    });
    if (!hasRACI) {
      fixes.push({
        title: '⚠️ THIẾU MA TRẬN PHÂN CÔNG TRÁCH NHIỆM RACI',
        message: 'Requirement 3 thường yêu cầu WBS kết hợp với RACI Matrix. Hãy liệt kê các công việc và phân định rõ 4 vai trò: R (Responsible), A (Accountable), C (Consulted), I (Informed).'
      });
    }

    // 4. Single 'A' rule
    const hasRolesRule = /only\s*one\s*a|duy\s*nhất\s*1\s*a|sole\s*decision/i.test(text) || (hasRACI && /(pm|ba|dev|qa)/i.test(text));
    criteria.push({
      name: '4. Quy Tắc Duy Nhất 1 Chữ "A" (Accountable) Cho Mỗi Hoạt Động',
      passed: hasRolesRule,
      points: hasRolesRule ? 2.0 : 0.5,
      maxPoints: 2.0,
      note: hasRolesRule ? 'Đã tuân thủ quy tắc quản trị chuẩn: Mỗi công việc chỉ có duy nhất 1 người chịu trách nhiệm tối cao (A).' : 'Cần lưu ý: Mỗi dòng công việc trong RACI CHỈ ĐƯỢC CÓ DUY NHẤT 1 chữ A.'
    });
    fixes.push({
      title: '💡 LƯU Ý KHI LÀM RACI TRÊN EOS',
      message: 'Trên phần mềm EOS không kẻ được bảng HTML, bạn hãy viết theo định dạng liệt kê từng dòng rất sáng sủa:\n- Activity 1.1 (Develop Charter): PM (A), BA (C), DEV (I), QA (I), SP (R)\n- Activity 1.2 (Collect Requirements): PM (A), BA (R), DEV (C), QA (C)\nĐảm bảo trên mỗi dòng chỉ có DUY NHẤT 1 chữ A!'
    });

    const totalScore = parseFloat(criteria.reduce((sum, c) => sum + c.points, 0).toFixed(1));
    const badge = totalScore >= 8.5 ? { text: 'Xuất sắc', class: 'high' } : (totalScore >= 5.0 ? { text: 'Đạt yêu cầu', class: 'medium' } : { text: 'Cần sửa chữa', class: 'low' });

    const sampleFixCode = `REQUEST 3: WORK BREAKDOWN STRUCTURE (WBS) & RACI MATRIX

1. WORK BREAKDOWN STRUCTURE (WBS):
1. FPT University SLM System
   1.1 Initiation & Project Governance
       1.1.1 Conduct Stakeholder Kick-off Meeting
       1.1.2 Draft & Formalize Project Charter
       1.1.3 Identify Stakeholders & Build Stakeholder Register
   1.2 Planning & Requirements Analysis
       1.2.1 Scope Definition & Requirements Traceability Matrix
       1.2.2 Work Breakdown Structure (WBS) & Schedule Network
       1.2.3 Cost Budget & Resource Allocation Matrix
       1.2.4 Formulate Risk Register & Response Strategy
   1.3 System & Architectural Design
       1.3.1 Technical Architecture & Cloud Database Schema
       1.3.2 UI/UX Wireframing & Responsive Prototypes
   1.4 Core Development & Implementation
       1.4.1 Database Migration & RESTful Backend APIs
       1.4.2 Frontend Web Interface & Portal Views
       1.4.3 Academic Portal Integration & Authentication
   1.5 Testing & Quality Assurance
       1.5.1 Unit Testing & Code Peer Reviews
       1.5.2 Integration & End-to-End System Testing
       1.5.3 Security, Vulnerability & Stress Testing
       1.5.4 User Acceptance Testing (UAT) with Faculty
   1.6 Deployment & Project Closure
       1.6.1 Cloud Production Setup & Deployment
       1.6.2 User Training Workshops & Manuals
       1.6.3 System Handover & Charter Sign-off

2. RACI RESPONSIBILITY MATRIX:
Roles: PM (Project Manager), BA (Business Analyst), DEV (Developers), QA (Testers), SP (Sponsor)
- Task 1.1.2 (Project Charter): PM (A), BA (C), DEV (I), QA (I), SP (R)
- Task 1.2.1 (Requirements): PM (A), BA (R), DEV (C), QA (C), SP (C)
- Task 1.3.1 (Architecture): PM (A), BA (C), DEV (R), QA (I), SP (I)
- Task 1.4.1 (Backend Coding): PM (A), BA (I), DEV (R), QA (C), SP (I)
- Task 1.4.2 (Frontend Coding): PM (A), BA (I), DEV (R), QA (C), SP (I)
- Task 1.5.2 (System Testing): PM (A), BA (I), DEV (C), QA (R), SP (I)
- Task 1.5.4 (Client UAT): PM (A), BA (C), DEV (I), QA (C), SP (R)
- Task 1.6.3 (Final Sign-off): PM (R), BA (I), DEV (I), QA (I), SP (A)
(*Note: Rule strictly enforced - exactly one Accountable 'A' per activity).`;

    return {
      reqType: 'req3',
      title: 'Requirement 3: WBS & RACI Matrix',
      score: totalScore,
      maxScore: 10,
      badgeText: badge.text,
      badgeClass: badge.class,
      wordCount: words,
      criteria,
      fixes,
      sampleFixCode
    };
  }

  function evaluateReq4Risk(text, lower) {
    const words = text ? text.split(/\s+/).length : 0;
    const criteria = [];
    const fixes = [];

    // 1. Identification
    const hasMultipleRisks = /(risk\s*1|rủi\s*ro\s*1|risk\s*2|rủi\s*ro\s*2)/i.test(text) || (text.match(/risk/gi) || []).length >= 3;
    criteria.push({
      name: '1. Nhận Diện Ít Nhất 3-4 Rủi Ro Điển Hình (Risk Identification)',
      passed: hasMultipleRisks,
      points: hasMultipleRisks ? 3.0 : 1.0,
      maxPoints: 3.0,
      note: hasMultipleRisks ? 'Đã liệt kê nhiều rủi ro đa dạng (Scope, Personnel, Technology, Timeline).' : 'Cần nhận diện tối thiểu 3-4 rủi ro thực tế.'
    });

    // 2. Probability & Impact
    const hasPI = /(probability|impact|low|medium|high|xác\s*suất|mức\s*độ|tác\s*động)/i.test(text);
    criteria.push({
      name: '2. Đánh Giá Xác Suất & Tác Động (Probability & Impact Assessment)',
      passed: hasPI,
      points: hasPI ? 2.0 : 0.0,
      maxPoints: 2.0,
      note: hasPI ? 'Đã phân tích mức độ Probability (Low/Medium/High) và Impact.' : 'Thiếu phần đánh giá Probability và Impact cho từng rủi ro.'
    });

    // 3. Mitigation Plan
    const hasMitigation = /(mitigation|phòng\s*ngừa|giảm\s*thiểu|prevent|trước\s*khi)/i.test(text);
    criteria.push({
      name: '3. Kế Hoạch Phòng Ngừa Trước (Mitigation Plan)',
      passed: hasMitigation,
      points: hasMitigation ? 2.5 : 0.5,
      maxPoints: 2.5,
      note: hasMitigation ? 'Đã có các biện pháp hành động trước để giảm thiểu rủi ro.' : 'Thiếu Mitigation Plan (Kế hoạch phòng ngừa).'
    });

    // 4. Contingency Plan
    const hasContingencyPlan = /(contingency|khắc\s*phục|ứng\s*phó|fallback|khi\s*xảy\s*ra)/i.test(text);
    criteria.push({
      name: '4. Kế Hoạch Khắc Phục Khi Rủi Ro Kích Hoạt (Contingency Plan)',
      passed: hasContingencyPlan,
      points: hasContingencyPlan ? 2.5 : 0.5,
      maxPoints: 2.5,
      note: hasContingencyPlan ? 'Đã có kế hoạch dự phòng Contingency khi rủi ro kích hoạt.' : 'Thiếu Contingency Plan (Kế hoạch khắc phục dự phòng).'
    });

    if (!hasMitigation || !hasContingencyPlan) {
      fixes.push({
        title: '⚠️ PHÂN BIỆT RÕ RÀNG MITIGATION VÀ CONTINGENCY',
        message: 'Mỗi rủi ro bắt buộc phải có ĐỦ 2 kế hoạch:\n- Mitigation Plan (Hành động phòng chống TRƯỚC): VD: review code hàng ngày, ký cam kết chốt scope, training backup.\n- Contingency Plan (Hành động cứu vãn SAU KHI rủi ro nổ ra): VD: kích hoạt quỹ dự phòng 10%, thuê chuyên gia ngoài cấp tốc, cắt giảm tính năng non-critical.'
      });
    }

    const totalScore = parseFloat(criteria.reduce((sum, c) => sum + c.points, 0).toFixed(1));
    const badge = totalScore >= 8.5 ? { text: 'Xuất sắc', class: 'high' } : (totalScore >= 5.0 ? { text: 'Đạt yêu cầu', class: 'medium' } : { text: 'Cần sửa chữa', class: 'low' });

    const sampleFixCode = `REQUEST 4: RISK MANAGEMENT PLAN & REGISTER

1. Risk 1: Scope Creep (Yêu cầu thay đổi liên tục từ các bên liên quan)
   - Description: Faculty and academic officers continuously request new report filters after design baseline.
   - Category / Impact: High (Impacts Schedule and Budget).
   - Probability: Medium (Likely to occur in academic software).
   - Strategy: Mitigate
   - Mitigation Plan (Phòng ngừa trước): Freeze functional requirements at Milestone 2; enforce a formal Change Control Board (CCB) process where any change requires impact analysis and Sponsor sign-off.
   - Contingency Plan (Khắc phục khi xảy ra): Re-prioritize the backlog, move non-critical features to Version 2.0, or negotiate timeline extension.

2. Risk 2: Key Personnel Turnover (Lập trình viên chủ chốt nghỉ việc)
   - Description: Lead backend engineer departs unexpectedly mid-development.
   - Category / Impact: High (Impacts Schedule and Quality).
   - Probability: Low
   - Strategy: Mitigate / Transfer
   - Mitigation Plan (Phòng ngừa trước): Enforce clean architecture, comprehensive API Swagger documentation, peer code reviews, and pair programming to prevent knowledge silos.
   - Contingency Plan (Khắc phục khi xảy ra): Reassign modules to cross-trained team members or contract a pre-vetted external senior engineer using the Contingency Reserve.

3. Risk 3: Integration Failure with Legacy Academic Portal
   - Description: The university's central database API experiences slow response or data schema mismatch.
   - Category / Impact: High (Impacts System functionality).
   - Probability: Medium
   - Strategy: Mitigate
   - Mitigation Plan (Phòng ngừa trước): Build a mock API service in Sprint 1 to test edge cases early; align schemas with the IT Department.
   - Contingency Plan (Khắc phục khi xảy ra): Implement local caching and asynchronous message queuing (RabbitMQ) so student submissions are stored locally without data loss.`;

    return {
      reqType: 'req4',
      title: 'Requirement 4: Risk Management Plan',
      score: totalScore,
      maxScore: 10,
      badgeText: badge.text,
      badgeClass: badge.class,
      wordCount: words,
      criteria,
      fixes,
      sampleFixCode
    };
  }

  function evaluateReq5CPM(text, lower) {
    const words = text ? text.split(/\s+/).length : 0;
    const criteria = [];
    const fixes = [];

    // 1. Precedence & Duration
    const hasPrecedence = /(predecessor|duration|relationship|fs|ss|ff|tuần|week|day)/i.test(text);
    criteria.push({
      name: '1. Bảng Quan Hệ Công Việc & Thời Gian (Activity Precedence & Duration)',
      passed: hasPrecedence,
      points: hasPrecedence ? 2.0 : 0.5,
      maxPoints: 2.0,
      note: hasPrecedence ? 'Đã xác định các công việc, Duration và mối quan hệ phụ thuộc (FS, SS).' : 'Thiếu bảng quan hệ công việc và thời lượng.'
    });

    // 2. Critical Path & Duration
    const hasCriticalPath = /(critical\s*path|đường\s*găng|minimum\s*duration|thời\s*gian\s*tối\s*thiểu)/i.test(text);
    criteria.push({
      name: '2. Liệt Kê Các Đường Mạng & Xác Định Critical Path',
      passed: hasCriticalPath,
      points: hasCriticalPath ? 2.5 : 0.5,
      maxPoints: 2.5,
      note: hasCriticalPath ? 'Đã liệt kê các đường đi từ Start đến End và tìm ra Critical Path.' : 'Thiếu các đường mạng hoặc chưa chốt Critical Path.'
    });

    // 3. Float & Flexibility
    const hasFloat = /(float|slack|es|ef|ls|lf|flexible|linh\s*hoạt)/i.test(text);
    criteria.push({
      name: '3. Công Thức Tính Float & Công Việc Linh Hoạt Nhất (Most Flexible Activity)',
      passed: hasFloat,
      points: hasFloat ? 2.0 : 0.0,
      maxPoints: 2.0,
      note: hasFloat ? 'Đã tính Float = LS - ES và chỉ rõ công việc linh hoạt nhất.' : 'Thiếu công thức tính Float hoặc xác định công việc có Float lớn nhất.'
    });

    // 4. EVM formulas
    const hasEVM = /(pv|ev|ac|cv|sv|cpi|spi|bac|earned\s*value)/i.test(text);
    criteria.push({
      name: '4. Tính Toán & Đánh Giá EVM (PV, EV, AC, CV, SV, CPI, SPI)',
      passed: hasEVM,
      points: hasEVM ? 2.0 : 0.5,
      maxPoints: 2.0,
      note: hasEVM ? 'Đã áp dụng đầy đủ các công thức EVM để đánh giá tiến độ và ngân sách.' : 'Thiếu tính toán các chỉ số EVM.'
    });

    // 5. Crashing & Fast Tracking
    const hasCorrective = /(crashing|fast\s*tracking|rút\s*ngắn|khắc\s*phục|biện\s*pháp)/i.test(text);
    criteria.push({
      name: '5. Đề Xuất Rút Ngắn Tiến Độ Khi SPI < 1 (Crashing & Fast Tracking)',
      passed: hasCorrective,
      points: hasCorrective ? 1.5 : 0.0,
      maxPoints: 1.5,
      note: hasCorrective ? 'Đã đề xuất 2 kỹ thuật chuẩn PMI: Crashing và Fast Tracking.' : 'Thiếu đề xuất kỹ thuật Crashing và Fast Tracking.'
    });
    if (!hasCorrective) {
      fixes.push({
        title: '⚠️ BẮT BUỘC KẾT LUẬN BẰNG CRASHING VÀ FAST TRACKING',
        message: 'Khi phân tích bài toán EVM thấy SPI < 1 (dự án bị chậm tiến độ - Behind Schedule), giám khảo luôn chấm điểm phần đề xuất giải pháp. Bạn bắt buộc phải ghi:\n1. Fast Tracking: Thực hiện song song các công việc vốn được lên kế hoạch làm tuần tự (Tăng rủi ro).\n2. Crashing: Bổ sung thêm nguồn lực hoặc tăng ca vào các công việc trên Đường Găng (Tăng chi phí).'
      });
    }

    const totalScore = parseFloat(criteria.reduce((sum, c) => sum + c.points, 0).toFixed(1));
    const badge = totalScore >= 8.5 ? { text: 'Xuất sắc', class: 'high' } : (totalScore >= 5.0 ? { text: 'Đạt yêu cầu', class: 'medium' } : { text: 'Cần sửa chữa', class: 'low' });

    const sampleFixCode = `REQUEST 5: CRITICAL PATH METHOD (CPM) & EVM CALCULATION

1. NETWORK PATHS & CRITICAL PATH:
- Path 1: Start -> A -> B -> D -> G -> End = 2 + 3 + 4 + 3 = 12 weeks
- Path 2: Start -> A -> C -> E -> G -> End = 2 + 4 + 6 + 3 = 15 weeks
- Path 3: Start -> A -> C -> F -> G -> End = 2 + 4 + 2 + 3 = 11 weeks
=> Critical Path: Path 2 (Start -> A -> C -> E -> G -> End).
=> Minimum Project Duration: 15 weeks.

2. ACTIVITY FLOAT & FLEXIBILITY:
- Float (Slack) = LS - ES = LF - EF
- Activities on Critical Path (A, C, E, G): Float = 0 (Zero flexibility).
- Activity B: Duration = 3, ES = 2, EF = 5 | LS = 5, LF = 8 | Float = 8 - 5 = 3 weeks.
- Activity D: Duration = 4, ES = 5, EF = 9 | LS = 8, LF = 12 | Float = 12 - 9 = 3 weeks.
- Activity F: Duration = 2, ES = 6, EF = 8 | LS = 10, LF = 12 | Float = 12 - 8 = 4 weeks.
=> Most Flexible Activity: Activity F (because it possesses the maximum positive Float of 4 weeks).

3. EARNED VALUE MANAGEMENT (EVM) CALCULATION:
- Given:
  * BAC (Budget at Completion) = $15,000
  * Planned % Completion = 60%
  * Actual % Completion = 45%
  * Actual Cost (AC) = $8,000
- Planned Value (PV) = 60% * $15,000 = $9,000
- Earned Value (EV) = 45% * $15,000 = $6,750
- Schedule Variance (SV) = EV - PV = $6,750 - $9,000 = -$2,250 (< 0: Behind schedule)
- Cost Variance (CV) = EV - AC = $6,750 - $8,000 = -$1,250 (< 0: Over budget)
- Schedule Performance Index (SPI) = EV / PV = $6,750 / $9,000 = 0.75 (< 1: Behind schedule)
- Cost Performance Index (CPI) = EV / AC = $6,750 / $8,000 = 0.84 (< 1: Over budget)

4. PROJECT STATUS EVALUATION & CORRECTIVE ACTIONS:
- Evaluation: Since SPI = 0.75 (< 1) and CPI = 0.84 (< 1), the project is currently BEHIND SCHEDULE and OVER BUDGET.
- Corrective Actions to bring project back on schedule:
  1. Fast Tracking: Re-sequence sequential tasks to run in parallel (e.g., develop Frontend and Backend simultaneously).
  2. Crashing: Inject additional resources and overtime onto Critical Path activities (Activities C and E) to compress schedule.`;

    return {
      reqType: 'req5',
      title: 'Requirement 5: Critical Path Method & EVM',
      score: totalScore,
      maxScore: 10,
      badgeText: badge.text,
      badgeClass: badge.class,
      wordCount: words,
      criteria,
      fixes,
      sampleFixCode
    };
  }

  function gradeAllPERequirements(text, lower) {
    const r1 = evaluateReq1Charter(text, lower);
    const r2 = evaluateReq2Budget(text, lower);
    const r3 = evaluateReq3WBS(text, lower);
    const r4 = evaluateReq4Risk(text, lower);
    const r5 = evaluateReq5CPM(text, lower);

    const avgScore = parseFloat(((r1.score + r2.score + r3.score + r4.score + r5.score) / 5).toFixed(1));
    const badge = avgScore >= 8.5 ? { text: 'Xuất sắc', class: 'high' } : (avgScore >= 5.0 ? { text: 'Đạt yêu cầu', class: 'medium' } : { text: 'Cần sửa chữa', class: 'low' });

    const combinedCriteria = [
      { name: 'Req 1: Project Charter & 4 Constraints', passed: r1.score >= 5.0, points: r1.score, maxPoints: 10, note: r1.badgeText },
      { name: 'Req 2: Cost Budget & 5 Estimation Methods', passed: r2.score >= 5.0, points: r2.score, maxPoints: 10, note: r2.badgeText },
      { name: 'Req 3: WBS Hierarchy & RACI Matrix', passed: r3.score >= 5.0, points: r3.score, maxPoints: 10, note: r3.badgeText },
      { name: 'Req 4: Risk Register & Response Strategy', passed: r4.score >= 5.0, points: r4.score, maxPoints: 10, note: r4.badgeText },
      { name: 'Req 5: CPM Critical Path & EVM Calculation', passed: r5.score >= 5.0, points: r5.score, maxPoints: 10, note: r5.badgeText }
    ];

    const combinedFixes = [...r1.fixes, ...r2.fixes, ...r3.fixes, ...r4.fixes, ...r5.fixes];
    const words = text ? text.split(/\s+/).length : 0;

    return {
      reqType: 'all',
      title: 'Tổng Hợp Toàn Bộ Bài Làm PE (5 Requirements)',
      score: avgScore,
      maxScore: 10,
      badgeText: badge.text,
      badgeClass: badge.class,
      wordCount: words,
      criteria: combinedCriteria,
      fixes: combinedFixes,
      sampleFixCode: r1.sampleFixCode + '\n\n' + r2.sampleFixCode + '\n\n' + r3.sampleFixCode + '\n\n' + r4.sampleFixCode + '\n\n' + r5.sampleFixCode
    };
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
    // Sort FE Exams chronologically (2023 -> 2024 -> 2025 -> 2026)
    function getExamChronologicalScore(exam) {
      const id = (exam.id || '').toUpperCase();
      if (id.includes('SPECIAL')) return -1000; // Pinned to the very top

      let year = 2024;
      if (/2023|SU23|FA23/.test(id)) year = 2023;
      else if (/2024|SP24|SU24|FA24/.test(id)) year = 2024;
      else if (/2025|SP25|SU25|FA25/.test(id)) year = 2025;
      else if (/2026|SP26|SU26|FA26/.test(id)) year = 2026;
      
      let term = 2; // SP=1, SU=2, FA=3
      if (/SP/.test(id)) term = 1;
      else if (/SU/.test(id)) term = 2;
      else if (/FA/.test(id)) term = 3;
      
      let type = 1; // FE=1, RE=2
      if (/RE/.test(id)) type = 2;
      
      const match = id.match(/_(\d+)$/);
      const code = match ? parseInt(match[1], 10) : 0;
      return year * 10000000 + term * 1000000 + type * 100000 + code;
    }

    APP_DATA.feExams.sort((a, b) => getExamChronologicalScore(a) - getExamChronologicalScore(b));

    // Populate FE Exams
    elements.feExamSelect.innerHTML = APP_DATA.feExams.map(e => {
      const cleanTitle = (e.title || '').replace(/\s*\(\d+\s*câu\)/gi, '').trim();
      return `<option value="${e.id}">${cleanTitle} (${e.totalQuestions} câu)</option>`;
    }).join('');

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

    // Instant feedback toggle
    if (elements.btnInstantFeedbackToggle) {
      updateInstantFeedbackToggleUI();
      elements.btnInstantFeedbackToggle.addEventListener('click', () => {
        state.feInstantFeedback = !state.feInstantFeedback;
        localStorage.setItem('pmg_fe_instant_feedback', state.feInstantFeedback);
        updateInstantFeedbackToggleUI();
        updateOptionsUI();
        renderPalette();
        showToast(
          state.feInstantFeedback
            ? '⚡ Đã BẬT chế độ hiện đúng/sai tức thì khi chọn!'
            : 'Đã TẮT chế độ hiện đúng/sai tức thì',
          'info'
        );
      });
    }

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
        const qIndex = state.feQuestionIndex;
        const qData = typeof getFEQuestionText === 'function' ? getFEQuestionText(state.feExamId, qIndex) : null;
        if (!qData) {
          showToast('Đề thi này hiện đang xem bằng ảnh chụp gốc. Bấm [✏️ Sửa text] hoặc [📥 Nạp Text Đề] nếu muốn tạo bản văn bản!', 'warning');
          return;
        }
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

    // Submit & Reset & Save
    elements.feSubmitBtn.addEventListener('click', submitFEExam);
    elements.feSubmitBtnSidebar.addEventListener('click', submitFEExam);
    elements.feResetExamBtn.addEventListener('click', resetFEExam);

    if (elements.feSaveBtn) elements.feSaveBtn.addEventListener('click', handleManualFESave);
    if (elements.feSaveBtnSidebar) elements.feSaveBtnSidebar.addEventListener('click', handleManualFESave);
    if (elements.feBackupBtn) elements.feBackupBtn.addEventListener('click', openBackupModal);
    if (elements.closeBackupModalBtn) elements.closeBackupModalBtn.addEventListener('click', closeBackupModal);
    if (elements.cancelBackupModalBtn) elements.cancelBackupModalBtn.addEventListener('click', closeBackupModal);
    if (elements.btnExportCurrentExam) elements.btnExportCurrentExam.addEventListener('click', () => exportExamProgress(false));
    if (elements.btnExportAllExams) elements.btnExportAllExams.addEventListener('click', () => exportExamProgress(true));
    if (elements.btnTriggerImportBackup) elements.btnTriggerImportBackup.addEventListener('click', () => elements.feImportBackupFile.click());
    if (elements.feImportBackupFile) {
      elements.feImportBackupFile.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          importExamProgress(e.target.files[0]);
          e.target.value = '';
        }
      });
    }

    // Keyboard Shortcuts
    window.addEventListener('keydown', handleKeyboardShortcuts);

    // Initial load first exam (or restore last active exam)
    const savedExamId = localStorage.getItem('pmg201c_last_fe_exam');
    const initialExamId = (savedExamId && APP_DATA.feExams.some(e => e.id === savedExamId))
      ? savedExamId
      : (APP_DATA.feExams.length > 0 ? APP_DATA.feExams[0].id : null);

    if (initialExamId) {
      loadFEExam(initialExamId);
    }
  }

  function loadFEExam(examId) {
    state.feExamId = examId;
    elements.feExamSelect.value = examId;
    try {
      localStorage.setItem('pmg201c_last_fe_exam', examId);
    } catch (e) {}
    state.feQuestionIndex = 0;
    state.feZoomLevel = 1.0;

    if (!state.feAnswers[examId]) state.feAnswers[examId] = {};
    if (!state.feQuestionModes[examId]) state.feQuestionModes[examId] = {};
    if (!state.feFlags[examId]) state.feFlags[examId] = {};
    if (!state.feNotes[examId]) state.feNotes[examId] = {};

    // Tự động kiểm tra xem đề này có bản Text rõ nét không
    const hasText = typeof hasFEExamText === 'function' ? hasFEExamText(examId) : (typeof getFEQuestionText === 'function' && getFEQuestionText(examId, 0) !== null);
    const userPref = localStorage.getItem('pmg_fe_view_mode');

    if (hasText) {
      state.feViewMode = userPref === 'image' ? 'image' : 'text';
    } else {
      // Đề chưa có bản text -> Tự động chuyển sang xem ảnh chụp gốc của chính đề đó để người học thấy ngay câu hỏi chính xác
      state.feViewMode = 'image';
    }

    loadCurrentQuestion();
    renderPalette();
  }

  function loadCurrentQuestion() {
    const exam = APP_DATA.feExams.find(e => e.id === state.feExamId);
    if (!exam) return;

    const qIndex = state.feQuestionIndex;
    const totalQ = exam.questions.length;

    // Get Text Question Data first to resolve potential custom imagePath
    let qData = null;
    if (typeof getFEQuestionText === 'function') {
      qData = getFEQuestionText(state.feExamId, qIndex);
    }

    const filename = exam.questions[qIndex] || `Cau_${String(qIndex + 1).padStart(2, '0')}.webp`;
    let imagePath = `${exam.folder}/${filename}?v=4.1`;
    if (qData && qData.imagePath) {
      imagePath = qData.imagePath.startsWith('FE/') ? `${qData.imagePath}?v=4.1` : `FE/${qData.imagePath}?v=4.1`;
    }

    elements.feQuestionNumber.textContent = qIndex + 1;
    elements.feQuestionImage.src = imagePath;
    elements.feQuestionImage.alt = `Câu ${qIndex + 1}`;

    // Reset zoom
    state.feZoomLevel = 1.0;
    applyFEZoom();

    // Kiểm tra xem câu này có bị vô hiệu hóa / loại bỏ theo yêu cầu không
    const isQuestionDisabled = !!(qData && qData.disabled);

    if (isQuestionDisabled) {
      if (elements.feTextContainer) elements.feTextContainer.style.display = 'flex';
      if (elements.feImageWrapper) elements.feImageWrapper.style.display = 'none';
      if (elements.feOptionsGrid) elements.feOptionsGrid.style.display = 'none';
      if (elements.feClearAnswerBtn) elements.feClearAnswerBtn.style.display = 'none';
      if (elements.btnViewImage) elements.btnViewImage.style.display = 'none';
      if (elements.btnViewText) elements.btnViewText.style.display = 'none';

      if (elements.feTextInstruction) {
        elements.feTextInstruction.textContent = '(Câu đã loại bỏ)';
      }
      if (elements.feTextContent) {
        elements.feTextContent.innerHTML = `
          <div style="text-align:center; padding: 48px 16px; color: var(--text-muted); line-height: 1.8;">
            <div style="font-size: 2.5rem; margin-bottom: 8px;">🚫</div>
            <h3 style="color: var(--text-main); margin-bottom: 8px;">Câu ${qIndex + 1} đã được loại bỏ khỏi đề thi</h3>
            <p style="font-size: 0.95rem;">Câu này không hiển thị ảnh, không có đáp án và không tính điểm để bảo toàn tuyệt đối thứ tự 50 câu.<br>Bạn hãy nhấn <strong>[Câu tiếp (➔)]</strong> hoặc bấm trên Bảng Câu Hỏi để làm tiếp <strong>Câu ${qIndex + 2}</strong>.</p>
          </div>
        `;
      }
      if (elements.feTextOptionsList) elements.feTextOptionsList.innerHTML = '';
      if (elements.btnToggleExplanation) elements.btnToggleExplanation.style.display = 'none';
      if (elements.feTextExplanationBox) elements.feTextExplanationBox.style.display = 'none';
    } else {
      if (elements.feOptionsGrid) elements.feOptionsGrid.style.display = '';
      if (elements.feClearAnswerBtn) elements.feClearAnswerBtn.style.display = '';
      if (elements.btnViewImage) elements.btnViewImage.style.display = '';
      if (elements.btnViewText) elements.btnViewText.style.display = '';

      // Toggle Text vs Image View
      // Nếu ở chế độ image, hoặc câu hỏi này chưa có text -> Bật chế độ xem ảnh chụp gốc
      const showImage = (state.feViewMode === 'image') || (!qData);
      if (showImage) {
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

      // Always enforce multi mode for 2-answer questions from question metadata
      const isMultiQuestion = qData.type === 'multi' || (Array.isArray(qData.answer) && qData.answer.length > 1);
      if (isMultiQuestion) {
        state.feQuestionModes[state.feExamId][qIndex] = 'multi';
      } else if (!state.feQuestionModes[state.feExamId][qIndex] && qData.type) {
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

  function updateInstantFeedbackToggleUI() {
    if (!elements.btnInstantFeedbackToggle) return;
    elements.btnInstantFeedbackToggle.classList.toggle('active', !!state.feInstantFeedback);
    if (elements.instantFeedbackText) {
      elements.instantFeedbackText.textContent = state.feInstantFeedback
        ? 'Hiện đúng/sai ngay: BẬT'
        : 'Hiện đúng/sai ngay: TẮT';
    }
  }

  function updateOptionsUI() {
    const qIndex = state.feQuestionIndex;
    const mode = state.feQuestionModes[state.feExamId][qIndex] || 'single';
    const chosen = state.feAnswers[state.feExamId][qIndex] || [];

    let qData = null;
    if (typeof getFEQuestionText === 'function') {
      qData = getFEQuestionText(state.feExamId, qIndex);
    }
    const hasKey = qData && Array.isArray(qData.answer) && qData.answer.length > 0;
    const correctList = hasKey ? qData.answer : [];
    const isInstantOn = !!state.feInstantFeedback;

    // Sync Circular Buttons below
    elements.feOptionsGrid.querySelectorAll('.opt-btn').forEach(btn => {
      const opt = btn.dataset.option;
      const isSelected = chosen.includes(opt);
      btn.classList.toggle('active', isSelected);
      btn.classList.toggle('multi', isSelected && mode === 'multi');

      // Instant feedback styling for circular buttons
      btn.classList.remove('instant-correct', 'instant-wrong', 'instant-target');
      if (isInstantOn && hasKey && chosen.length > 0) {
        if (isSelected) {
          btn.classList.add(correctList.includes(opt) ? 'instant-correct' : 'instant-wrong');
        } else if (correctList.includes(opt)) {
          btn.classList.add('instant-target');
        }
      }
    });

    // Sync Text Option Items in the Text Card above
    if (elements.feTextOptionsList) {
      elements.feTextOptionsList.querySelectorAll('.text-opt-item').forEach(item => {
        const opt = item.dataset.option;
        const isSelected = chosen.includes(opt);
        item.classList.toggle('active', isSelected);
        item.classList.toggle('multi', isSelected && mode === 'multi');

        // Remove old target tags
        const oldTag = item.querySelector('.instant-target-tag');
        if (oldTag) oldTag.remove();

        item.classList.remove('instant-correct', 'instant-wrong', 'instant-target');
        if (isInstantOn && hasKey && chosen.length > 0) {
          if (isSelected) {
            item.classList.add(correctList.includes(opt) ? 'instant-correct' : 'instant-wrong');
          } else if (correctList.includes(opt)) {
            item.classList.add('instant-target');
            const targetBadge = document.createElement('span');
            targetBadge.className = 'instant-target-tag';
            targetBadge.innerHTML = '✓ Đáp án chuẩn';
            item.appendChild(targetBadge);
          }
        }
      });
    }

    // Instant Feedback Result Bar & Explanation Auto-Display
    if (elements.feInstantResultBar) {
      if (isInstantOn && hasKey && chosen.length > 0) {
        const sortedChosen = [...chosen].sort().join(', ');
        const sortedKey = [...correctList].sort().join(', ');

        if (mode === 'single') {
          const isCorrect = correctList.includes(chosen[0]);
          if (isCorrect) {
            elements.feInstantResultBar.className = 'fe-instant-result-bar correct';
            elements.feInstantResultBar.innerHTML = `
              <div style="display:flex; align-items:center; gap:8px;">
                <span>🎉</span>
                <span><strong>Chính xác!</strong> Bạn đã chọn đúng đáp án <strong>[ ${sortedKey} ]</strong></span>
              </div>
              <span style="font-size:0.78rem; font-weight:700; background:rgba(22,163,74,0.15); padding:2px 8px; border-radius:4px;">+1 Điểm</span>
            `;
          } else {
            elements.feInstantResultBar.className = 'fe-instant-result-bar wrong';
            elements.feInstantResultBar.innerHTML = `
              <div style="display:flex; align-items:center; gap:8px;">
                <span>❌</span>
                <span><strong>Chưa chính xác!</strong> Bạn chọn <strong>[ ${sortedChosen} ]</strong>. Đáp án chuẩn là <strong>[ ${sortedKey} ]</strong></span>
              </div>
              <button class="btn btn-outline btn-sm" id="btnTryAgainAns" style="font-size:0.75rem; padding:2px 8px;">Chọn lại</button>
            `;
            const btnTryAgain = elements.feInstantResultBar.querySelector('#btnTryAgainAns');
            if (btnTryAgain) {
              btnTryAgain.onclick = () => clearCurrentAnswer();
            }
          }
        } else {
          // Multi choice
          if (chosen.length >= 2) {
            const isMatch = sortedChosen === sortedKey;
            if (isMatch) {
              elements.feInstantResultBar.className = 'fe-instant-result-bar correct';
              elements.feInstantResultBar.innerHTML = `
                <div style="display:flex; align-items:center; gap:8px;">
                  <span>🎉</span>
                  <span><strong>Xuất sắc!</strong> Bạn đã chọn đúng cả 2 đáp án: <strong>[ ${sortedKey} ]</strong></span>
                </div>
                <span style="font-size:0.78rem; font-weight:700; background:rgba(22,163,74,0.15); padding:2px 8px; border-radius:4px;">+1 Điểm</span>
              `;
            } else {
              elements.feInstantResultBar.className = 'fe-instant-result-bar wrong';
              elements.feInstantResultBar.innerHTML = `
                <div style="display:flex; align-items:center; gap:8px;">
                  <span>❌</span>
                  <span><strong>Chưa hoàn toàn chính xác!</strong> Bạn chọn [ ${sortedChosen} ]. Đáp án chuẩn: <strong>[ ${sortedKey} ]</strong></span>
                </div>
                <button class="btn btn-outline btn-sm" id="btnTryAgainAns" style="font-size:0.75rem; padding:2px 8px;">Chọn lại</button>
              `;
              const btnTryAgain = elements.feInstantResultBar.querySelector('#btnTryAgainAns');
              if (btnTryAgain) {
                btnTryAgain.onclick = () => clearCurrentAnswer();
              }
            }
          } else {
            // 1 option chosen out of 2
            const isPartiallyCorrect = correctList.includes(chosen[0]);
            if (isPartiallyCorrect) {
              elements.feInstantResultBar.className = 'fe-instant-result-bar correct';
              elements.feInstantResultBar.innerHTML = `
                <span>✨ <strong>Đúng 1 đáp án!</strong> Phương án <strong>[ ${chosen[0]} ]</strong> là chính xác. Hãy chọn thêm 1 đáp án nữa.</span>
              `;
            } else {
              elements.feInstantResultBar.className = 'fe-instant-result-bar wrong';
              elements.feInstantResultBar.innerHTML = `
                <span>❌ Phương án <strong>[ ${chosen[0]} ]</strong> không chính xác. Hãy chọn phương án khác!</span>
              `;
            }
          }
        }

        elements.feInstantResultBar.style.display = 'flex';

        // Auto display explanation if available
        if (qData.explanation && elements.feTextExplanationBox) {
          elements.feTextExplanationBox.style.display = 'block';
        }
      } else {
        elements.feInstantResultBar.style.display = 'none';
      }
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
    if (state.feAnswers[state.feExamId]) {
      delete state.feAnswers[state.feExamId][qIndex];
    }
    if (state.feExamResults[state.feExamId]) {
      delete state.feExamResults[state.feExamId][qIndex];
    }
    saveFEPersistence();
    updateOptionsUI();
    renderPalette();
    updateSubsetCounts();
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
      let isQuestionDisabled = false;
      if (typeof getFEQuestionText === 'function') {
        const qd = getFEQuestionText(state.feExamId, idx);
        if (qd && qd.disabled) isQuestionDisabled = true;
      }

      if (isQuestionDisabled) {
        btn.style.opacity = '0.35';
        btn.title = 'Câu này đã được loại bỏ khỏi đề thi';
      } else if (state.fePracticeSubset !== 'all' && !activeIndices.includes(idx)) {
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

      if (elements.feSaveIndicator && elements.feSaveText) {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        elements.feSaveIndicator.className = 'save-indicator saved';
        elements.feSaveText.textContent = `Đã lưu (${timeStr})`;
      }
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  function handleManualFESave() {
    saveFEPersistence();
    const answers = state.feAnswers[state.feExamId] || {};
    const doneCount = Object.keys(answers).filter(k => answers[k] && answers[k].length > 0).length;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    if (elements.feSaveText) {
      elements.feSaveText.textContent = `Đã lưu (${timeStr})`;
    }
    if (elements.feSaveIndicator) {
      elements.feSaveIndicator.className = 'save-indicator saved';
    }
    showToast(`Đã lưu bài làm thành công! (${doneCount}/50 câu đã chọn)`);
  }

  function openBackupModal() {
    const exam = APP_DATA.feExams.find(e => e.id === state.feExamId);
    const answers = state.feAnswers[state.feExamId] || {};
    const flags = state.feFlags[state.feExamId] || {};
    const results = state.feExamResults[state.feExamId] || {};
    const doneCount = Object.keys(answers).filter(k => answers[k] && answers[k].length > 0).length;
    const flagCount = Object.keys(flags).filter(k => !!flags[k]).length;
    const hasResults = Object.keys(results).length > 0;

    if (elements.feBackupCurrentExamTitle) {
      const cleanTitle = exam ? (exam.title || '').replace(/\s*\(\d+\s*câu\)/gi, '').trim() : state.feExamId;
      elements.feBackupCurrentExamTitle.textContent = `Bộ đề hiện tại: ${cleanTitle}`;
    }
    if (elements.feBackupDoneCount) elements.feBackupDoneCount.textContent = `${doneCount}/50 câu`;
    if (elements.feBackupFlagCount) elements.feBackupFlagCount.textContent = `${flagCount} câu`;
    if (elements.feBackupStatusText) elements.feBackupStatusText.textContent = hasResults ? 'Đã nộp & chấm điểm' : (doneCount > 0 ? 'Đang làm dở' : 'Chưa bắt đầu');
    if (elements.feBackupLastSaved) {
      const now = new Date();
      elements.feBackupLastSaved.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }

    if (elements.feBackupModal) elements.feBackupModal.classList.add('active');
  }

  function closeBackupModal() {
    if (elements.feBackupModal) elements.feBackupModal.classList.remove('active');
  }

  function exportExamProgress(allExams = false) {
    const exportData = {
      app: 'PMG201c_Hub',
      version: '5.3',
      exportDate: new Date().toISOString(),
      type: allExams ? 'all_exams' : 'single_exam',
      examId: allExams ? null : state.feExamId,
      answers: allExams ? state.feAnswers : { [state.feExamId]: state.feAnswers[state.feExamId] || {} },
      modes: allExams ? state.feQuestionModes : { [state.feExamId]: state.feQuestionModes[state.feExamId] || {} },
      flags: allExams ? state.feFlags : { [state.feExamId]: state.feFlags[state.feExamId] || {} },
      notes: allExams ? state.feNotes : { [state.feExamId]: state.feNotes[state.feExamId] || {} },
      results: allExams ? state.feExamResults : { [state.feExamId]: state.feExamResults[state.feExamId] || {} }
    };

    const filename = allExams 
      ? `PMG201c_ToanBoBaiLam_${new Date().toISOString().slice(0, 10)}.json`
      : `PMG201c_${state.feExamId}_BaiLam_${new Date().toISOString().slice(0, 10)}.json`;

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Đã xuất file bài làm thành công!');
  }

  function importExamProgress(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result);
        if (!data || !data.answers) {
          showToast('File không đúng định dạng bài làm PMG201c!', 'error');
          return;
        }

        if (data.type === 'all_exams' || !data.examId) {
          Object.assign(state.feAnswers, data.answers || {});
          if (data.modes) Object.assign(state.feQuestionModes, data.modes || {});
          if (data.flags) Object.assign(state.feFlags, data.flags || {});
          if (data.notes) Object.assign(state.feNotes, data.notes || {});
          if (data.results) Object.assign(state.feExamResults, data.results || {});
        } else {
          const id = data.examId;
          const examAnswers = data.answers[id] || data.answers;
          state.feAnswers[id] = Object.assign({}, state.feAnswers[id] || {}, examAnswers);
          if (data.modes) state.feQuestionModes[id] = Object.assign({}, state.feQuestionModes[id] || {}, data.modes[id] || data.modes);
          if (data.flags) state.feFlags[id] = Object.assign({}, state.feFlags[id] || {}, data.flags[id] || data.flags);
          if (data.notes) state.feNotes[id] = Object.assign({}, state.feNotes[id] || {}, data.notes[id] || data.notes);
          if (data.results) state.feExamResults[id] = Object.assign({}, state.feExamResults[id] || {}, data.results[id] || data.results);
        }

        saveFEPersistence();
        loadCurrentQuestion();
        renderPalette();
        updateSubsetCounts();
        closeBackupModal();
        showToast('Đã nạp và khôi phục bài làm thành công!');
      } catch (err) {
        console.error(err);
        showToast('Lỗi đọc file bài làm: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
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
      state.feAnswers[state.feExamId] = {};
      state.feFlags[state.feExamId] = {};
      state.feExamResults[state.feExamId] = {};
      state.feNotes[state.feExamId] = {};
      state.fePracticeSubset = 'all';
      if (elements.fePracticeSubsetSelect) {
        elements.fePracticeSubsetSelect.value = 'all';
      }
      if (elements.feCustomPracticeBanner) {
        elements.feCustomPracticeBanner.style.display = 'none';
      }
      if (state.feMode === 'exam') {
        startFETimer();
      }
      saveFEPersistence();
      state.feQuestionIndex = 0;
      loadCurrentQuestion();
      renderPalette();
      updateSubsetCounts();
      showToast('Đã làm mới đề thi! Bạn có thể làm lại từ đầu.', 'info');
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
      let qData = null;
      if (typeof getFEQuestionText === 'function') {
        qData = getFEQuestionText(state.feExamId, i);
        if (qData && qData.answer) correctKey = qData.answer;
      }

      if (qData && qData.disabled) {
        state.feExamResults[state.feExamId][i] = 'skipped';
        continue;
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
    // Ctrl + S (or Cmd + S) -> Save Exam Progress
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      if (state.currentView === 'feView') {
        handleManualFESave();
      } else if (state.currentView === 'peView') {
        savePEContent();
        showToast('Đã lưu bài thi tự luận PE thành công!');
      }
      return;
    }

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
