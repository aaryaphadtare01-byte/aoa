/**
 * AOA Code Library - Application Logic
 * =====================================
 * Offline-first, vanilla JavaScript implementation.
 * Zero external libraries or network dependencies.
 * Supports: Search, Navigation, Copy with fallback, In-Browser Code Pasting & LocalStorage persistence.
 */

(function () {
  'use strict';

  // State Management
  let currentAlgoId = null;
  let activeSearchQuery = "";
  let activeFilter = "all"; // 'all', 'practicals', 'placeholders'

  // DOM Elements Cache
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const sidebarNavList = document.getElementById('sidebarNavList');
  const sidebarTotalCount = document.getElementById('sidebarTotalCount');
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const appSidebar = document.getElementById('appSidebar');

  // Filter Buttons
  const filterAllBtn = document.getElementById('filterAllBtn');
  const filterPracticalsBtn = document.getElementById('filterPracticalsBtn');
  const filterPlaceholdersBtn = document.getElementById('filterPlaceholdersBtn');
  
  // Main Panel Elements
  const mainPanel = document.getElementById('mainPanel');
  const algoTitle = document.getElementById('algoTitle');
  const algoCategoryBreadcrumb = document.getElementById('algoCategoryBreadcrumb');
  const timeComplexityEl = document.getElementById('timeComplexity');
  const spaceComplexityEl = document.getElementById('spaceComplexity');
  const codeLinesCountEl = document.getElementById('codeLinesCount');
  const codeCharCountEl = document.getElementById('codeCharCount');
  const codeGutter = document.getElementById('codeGutter');
  const codeContent = document.getElementById('codeContent');
  const emptyStateBox = document.getElementById('emptyStateBox');
  const emptyStateAlgoName = document.getElementById('emptyStateAlgoName');
  const emptyStateAlgoId = document.getElementById('emptyStateAlgoId');
  const codeEditorPanel = document.getElementById('codeEditorPanel');
  
  // Action Buttons
  const copyCodeBtn = document.getElementById('copyCodeBtn');
  const pasteCodeBtn = document.getElementById('pasteCodeBtn');
  const copyAllBtn = document.getElementById('copyAllBtn');
  const printBtn = document.getElementById('printBtn');
  const togglePlaceholdersBtn = document.getElementById('togglePlaceholdersBtn');
  const emptyStatePasteBtn = document.getElementById('emptyStatePasteBtn');
  
  // Toast
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  
  // Offline Copy Fallback Modal
  const fallbackModal = document.getElementById('fallbackModal');
  const fallbackModalTextarea = document.getElementById('fallbackModalTextarea');
  const fallbackModalClose = document.getElementById('fallbackModalClose');
  const fallbackModalCopyBtn = document.getElementById('fallbackModalCopyBtn');
  const fallbackAlgoName = document.getElementById('fallbackAlgoName');

  // Paste / Edit Code Modal
  const pasteModal = document.getElementById('pasteModal');
  const pasteModalAlgoName = document.getElementById('pasteModalAlgoName');
  const pasteModalTextarea = document.getElementById('pasteModalTextarea');
  const pasteModalClose = document.getElementById('pasteModalClose');
  const pasteModalCancelBtn = document.getElementById('pasteModalCancelBtn');
  const savePastedCodeBtn = document.getElementById('savePastedCodeBtn');
  const pasteFromClipboardBtn = document.getElementById('pasteFromClipboardBtn');
  const clearPasteTextareaBtn = document.getElementById('clearPasteTextareaBtn');
  const resetToDefaultBtn = document.getElementById('resetToDefaultBtn');

  /**
   * Helper: Get stored custom code from localStorage
   */
  function getCustomCode(algoId) {
    try {
      return localStorage.getItem('aoa_custom_' + algoId);
    } catch (e) {
      return null;
    }
  }

  /**
   * Helper: Save custom code to localStorage
   */
  function saveCustomCode(algoId, code) {
    try {
      localStorage.setItem('aoa_custom_' + algoId, code);
      return true;
    } catch (e) {
      console.warn("localStorage write failed:", e);
      return false;
    }
  }

  /**
   * Helper: Remove custom code from localStorage
   */
  function removeCustomCode(algoId) {
    try {
      localStorage.removeItem('aoa_custom_' + algoId);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Helper: Check if an algorithm has valid code, considering the placeholder preview mode
   */
  function hasCode(algo) {
    if (window.AOA_CONFIG && window.AOA_CONFIG.showAllAsPlaceholders) {
      return false;
    }
    const custom = getCustomCode(algo.id);
    if (custom !== null && custom.trim().length > 0) {
      return true;
    }
    return Boolean(algo && algo.code && algo.code.trim().length > 0);
  }

  /**
   * Helper: Get current code for an algorithm (custom code from localStorage takes precedence)
   */
  function getAlgorithmCode(algo) {
    if (window.AOA_CONFIG && window.AOA_CONFIG.showAllAsPlaceholders) {
      return "";
    }
    const custom = getCustomCode(algo.id);
    if (custom !== null) {
      return custom;
    }
    return (algo && algo.code) ? algo.code : "";
  }

  /**
   * Safe HTML escaping
   */
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Offline C Syntax Highlighting (OnlineGDB / VS Code Dark Palette)
   * Pure vanilla JS tokenizer that never modifies source code text.
   */
  function highlightC(sourceCode) {
    const escaped = escapeHtml(sourceCode);
    
    return escaped
      // Multi-line & single-line comments
      .replace(/(\/\*[\s\S]*?\*\/|\/\/[^\r\n]*)/g, '<span class="c-comment">$1</span>')
      // Strings & chars
      .replace(/(&quot;.*?&quot;|&#39;.*?&#39;)/g, '<span class="c-string">$1</span>')
      // Preprocessor directives (#include, #define)
      .replace(/(^|\n)(\s*#\s*[a-zA-Z_]+[^\r\n]*)/g, '$1<span class="c-preprocessor">$2</span>')
      // Types
      .replace(/\b(int|float|double|char|void|long|short|unsigned|signed|struct|typedef|enum|union|const|static|size_t)\b/g, '<span class="c-type">$1</span>')
      // Keywords
      .replace(/\b(return|if|else|while|for|do|break|continue|switch|case|default|goto|sizeof)\b/g, '<span class="c-keyword">$1</span>')
      // Function names before parenthesis (printf, scanf, main, etc.)
      .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/g, '<span class="c-function">$1</span>')
      // Numbers
      .replace(/\b([0-9]+(\.[0-9]+)?)\b/g, '<span class="c-number">$1</span>');
  }

  /**
   * Render Sidebar with Categories and Algorithms
   */
  function renderSidebar() {
    sidebarNavList.innerHTML = '';
    const query = activeSearchQuery.trim().toLowerCase();

    // Group algorithms by category
    const categoryMap = new Map();
    CATEGORIES.forEach(cat => categoryMap.set(cat, []));

    let totalMatchCount = 0;

    ALGORITHMS.forEach(algo => {
      // Filter check
      if (activeFilter === 'practicals' && !algo.labNumber) {
        return;
      }
      if (activeFilter === 'placeholders' && hasCode(algo)) {
        return;
      }

      // Search match check
      const nameMatch = algo.name.toLowerCase().includes(query);
      const catMatch = algo.category.toLowerCase().includes(query);
      const notesMatch = algo.notes ? algo.notes.toLowerCase().includes(query) : false;

      if (!query || nameMatch || catMatch || notesMatch) {
        if (!categoryMap.has(algo.category)) {
          categoryMap.set(algo.category, []);
        }
        categoryMap.get(algo.category).push(algo);
        totalMatchCount++;
      }
    });

    sidebarTotalCount.textContent = `${totalMatchCount} shown`;

    if (totalMatchCount === 0) {
      const emptyLi = document.createElement('div');
      emptyLi.className = 'sidebar-no-results';
      emptyLi.innerHTML = `No algorithms found.<br><button class="btn btn-sm" style="margin-top: 0.75rem;" onclick="window.AOA.clearSearch()">Reset filters & search</button>`;
      sidebarNavList.appendChild(emptyLi);
      return;
    }

    CATEGORIES.forEach(categoryName => {
      const algos = categoryMap.get(categoryName) || [];
      if (algos.length === 0) return;

      const groupDiv = document.createElement('div');
      groupDiv.className = 'category-group';

      const titleDiv = document.createElement('div');
      titleDiv.className = 'category-title';
      titleDiv.innerHTML = `<span>${categoryName}</span><span class="category-count">${algos.length}</span>`;
      groupDiv.appendChild(titleDiv);

      const ul = document.createElement('ul');
      ul.className = 'algo-nav-list';

      algos.forEach(algo => {
        const li = document.createElement('li');
        const isActive = algo.id === currentAlgoId;
        const codeAvailable = hasCode(algo);
        const hasCustom = getCustomCode(algo.id) !== null;

        li.className = `algo-nav-item ${isActive ? 'active' : ''}`;
        li.setAttribute('data-id', algo.id);
        li.tabIndex = 0;
        li.setAttribute('role', 'button');
        li.setAttribute('aria-label', `${algo.name} (${algo.category})`);

        let badgeHtml = '';
        if (hasCustom) {
          badgeHtml = `<span class="custom-saved-badge" title="Locally Saved / Pasted Code">Custom</span>`;
        } else if (algo.labNumber) {
          badgeHtml = `<span class="status-badge lab" title="College Lab Practical #${algo.labNumber}">Lab #${algo.labNumber}</span>`;
        } else if (codeAvailable) {
          badgeHtml = `<span class="status-badge ready" title="C Code Available">Ready</span>`;
        } else {
          badgeHtml = `<span class="status-badge empty" title="Empty Placeholder (No Code Yet)">Pending</span>`;
        }

        li.innerHTML = `
          <span class="algo-nav-name" title="${escapeHtml(algo.name)}">${escapeHtml(algo.name)}</span>
          ${badgeHtml}
        `;

        li.addEventListener('click', () => {
          selectAlgorithm(algo.id);
          if (window.innerWidth <= 768) {
            appSidebar.classList.remove('open');
          }
        });

        li.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectAlgorithm(algo.id);
          }
        });

        ul.appendChild(li);
      });

      groupDiv.appendChild(ul);
      sidebarNavList.appendChild(groupDiv);
    });

    // Auto-scroll active item into view
    const activeItem = sidebarNavList.querySelector('.algo-nav-item.active');
    if (activeItem) {
      activeItem.scrollIntoView({ block: 'nearest' });
    }
  }

  /**
   * Select and Display an Algorithm
   */
  function selectAlgorithm(algoId) {
    const algo = ALGORITHMS.find(a => a.id === algoId);
    if (!algo) return;

    currentAlgoId = algo.id;
    window.location.hash = algo.id;

    // Header & Breadcrumb
    const labPrefix = algo.labNumber ? `[Practical #${algo.labNumber}] ` : '';
    algoTitle.textContent = `${labPrefix}${algo.name}`;
    algoCategoryBreadcrumb.textContent = algo.category;
    document.title = `${algo.name} - AOA Code Library`;

    // Metadata
    timeComplexityEl.textContent = algo.timeComplexity || "O(—)";
    spaceComplexityEl.textContent = algo.spaceComplexity || "O(—)";

    // Practical Notes & I/O
    const inputOutputBox = document.getElementById('inputOutputBox');
    const practicalNotesBox = document.getElementById('practicalNotesBox');
    
    if (algo.inputOutput) {
      inputOutputBox.textContent = algo.inputOutput;
      document.getElementById('inputOutputCard').style.display = 'block';
    } else {
      document.getElementById('inputOutputCard').style.display = 'none';
    }

    if (algo.notes) {
      practicalNotesBox.textContent = algo.notes;
      document.getElementById('practicalNotesCard').style.display = 'block';
    } else {
      document.getElementById('practicalNotesCard').style.display = 'none';
    }

    // Code & Empty State Management
    const rawCode = getAlgorithmCode(algo);
    const codeAvailable = rawCode.trim().length > 0;

    if (codeAvailable) {
      emptyStateBox.style.display = 'none';
      codeEditorPanel.style.display = 'flex';
      
      const lines = rawCode.split('\n');
      codeLinesCountEl.textContent = `${lines.length} lines`;
      codeCharCountEl.textContent = `${rawCode.length} chars`;

      // Build Line Number Gutter
      let gutterHtml = '';
      for (let i = 1; i <= lines.length; i++) {
        gutterHtml += `<span class="gutter-line">${i}</span>`;
      }
      codeGutter.innerHTML = gutterHtml;

      // Render Code with syntax highlighting
      codeContent.innerHTML = `<code>${highlightC(rawCode)}</code>`;

      // Enable Action Buttons
      copyCodeBtn.disabled = false;
      copyAllBtn.disabled = false;
      copyCodeBtn.title = "Copy C Source Code to clipboard";
      copyAllBtn.title = "Copy Complete C Program";
    } else {
      // Empty State Box
      codeEditorPanel.style.display = 'none';
      emptyStateBox.style.display = 'flex';
      emptyStateAlgoName.textContent = algo.name;
      emptyStateAlgoId.textContent = algo.id;

      codeLinesCountEl.textContent = `0 lines`;
      codeCharCountEl.textContent = `0 chars`;

      // Disable Copy Buttons
      copyCodeBtn.disabled = true;
      copyAllBtn.disabled = true;
      copyCodeBtn.title = "No code available to copy";
      copyAllBtn.title = "No code available to copy";
    }

    renderSidebar();
    mainPanel.scrollTop = 0;
  }

  /**
   * Copy Handler with Offline-Safe Fallback
   */
  function copySelectedCode(copyType) {
    const algo = ALGORITHMS.find(a => a.id === currentAlgoId);
    if (!algo) return;

    const rawCode = getAlgorithmCode(algo);
    if (!rawCode || rawCode.trim().length === 0) {
      showToast("No C code has been added for this algorithm yet.");
      return;
    }

    const textToCopy = rawCode;

    // Strategy 1: Modern Clipboard API
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          handleCopySuccess(copyType);
        })
        .catch(err => {
          console.warn("Clipboard API writeText failed, trying document.execCommand fallback", err);
          execCommandFallback(textToCopy, copyType, algo.name);
        });
    } else {
      execCommandFallback(textToCopy, copyType, algo.name);
    }
  }

  /**
   * Fallback using document.execCommand('copy') with textarea
   */
  function execCommandFallback(text, copyType, algoName) {
    let copySuccessful = false;
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      document.body.appendChild(textarea);
      
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      
      copySuccessful = document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch (e) {
      copySuccessful = false;
    }

    if (copySuccessful) {
      handleCopySuccess(copyType);
    } else {
      openManualCopyModal(text, algoName);
    }
  }

  function handleCopySuccess(copyType) {
    const label = copyType === 'all' ? 'All C program code copied!' : 'C source code copied to clipboard!';
    showToast(`✓ ${label}`);

    const activeBtn = copyType === 'all' ? copyAllBtn : copyCodeBtn;
    const origHtml = activeBtn.innerHTML;
    activeBtn.innerHTML = `<span>✓ Copied!</span>`;
    setTimeout(() => {
      activeBtn.innerHTML = origHtml;
    }, 1800);
  }

  function openManualCopyModal(text, algoName) {
    fallbackAlgoName.textContent = algoName;
    fallbackModalTextarea.value = text;
    fallbackModal.classList.add('show');
    
    setTimeout(() => {
      fallbackModalTextarea.focus();
      fallbackModalTextarea.select();
    }, 100);
  }

  function closeManualCopyModal() {
    fallbackModal.classList.remove('show');
  }

  /**
   * Paste / Edit Code Modal Handlers
   */
  function openPasteModal() {
    const algo = ALGORITHMS.find(a => a.id === currentAlgoId);
    if (!algo) return;

    pasteModalAlgoName.textContent = algo.name;
    const currentCode = getAlgorithmCode(algo);
    pasteModalTextarea.value = currentCode;
    pasteModal.classList.add('show');

    setTimeout(() => {
      pasteModalTextarea.focus();
    }, 100);
  }

  function closePasteModal() {
    pasteModal.classList.remove('show');
  }

  function savePastedCode() {
    const algo = ALGORITHMS.find(a => a.id === currentAlgoId);
    if (!algo) return;

    const newCode = pasteModalTextarea.value;
    if (!newCode.trim()) {
      removeCustomCode(algo.id);
      showToast(`Removed custom code for ${algo.name}`);
    } else {
      saveCustomCode(algo.id, newCode);
      showToast(`✓ Code saved to library for ${algo.name}!`);
    }

    closePasteModal();
    selectAlgorithm(algo.id);
  }

  function resetToDefault() {
    const algo = ALGORITHMS.find(a => a.id === currentAlgoId);
    if (!algo) return;

    removeCustomCode(algo.id);
    pasteModalTextarea.value = algo.code || "";
    showToast(`Reset to default original code for ${algo.name}`);
  }

  function pasteFromClipboard() {
    if (navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
      navigator.clipboard.readText()
        .then(text => {
          pasteModalTextarea.value = text;
          showToast("✓ Pasted from clipboard!");
        })
        .catch(() => {
          pasteModalTextarea.focus();
          pasteModalTextarea.select();
          showToast("Press Ctrl+V to paste your code");
        });
    } else {
      pasteModalTextarea.focus();
      pasteModalTextarea.select();
      showToast("Press Ctrl+V to paste your code");
    }
  }

  /**
   * Toast Notification Helper
   */
  let toastTimer = null;
  function showToast(message) {
    if (toastTimer) clearTimeout(toastTimer);
    toastMessage.textContent = message;
    toastNotification.classList.add('show');
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 2500);
  }

  /**
   * Filter Tab Switcher
   */
  function setSidebarFilter(filterName) {
    activeFilter = filterName;
    [filterAllBtn, filterPracticalsBtn, filterPlaceholdersBtn].forEach(btn => {
      if (btn) {
        btn.classList.toggle('active', btn.dataset.filter === filterName);
      }
    });
    renderSidebar();
  }

  /**
   * Toggle All-Placeholders Mode
   */
  function togglePlaceholdersMode() {
    window.AOA_CONFIG.showAllAsPlaceholders = !window.AOA_CONFIG.showAllAsPlaceholders;
    const isPlaceholderMode = window.AOA_CONFIG.showAllAsPlaceholders;

    if (isPlaceholderMode) {
      togglePlaceholdersBtn.classList.add('btn-toggle-active');
      togglePlaceholdersBtn.innerHTML = `<span>Mode: All Empty Placeholders</span>`;
      showToast("Switched to All Placeholders Mode");
    } else {
      togglePlaceholdersBtn.classList.remove('btn-toggle-active');
      togglePlaceholdersBtn.innerHTML = `<span>Mode: Lab Practicals (11 Loaded)</span>`;
      showToast("Switched to Lab Practicals Mode");
    }

    if (currentAlgoId) {
      selectAlgorithm(currentAlgoId);
    } else {
      renderSidebar();
    }
  }

  /**
   * Event Listeners Setup
   */
  function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', (e) => {
      activeSearchQuery = e.target.value;
      searchClearBtn.style.display = activeSearchQuery ? 'block' : 'none';
      renderSidebar();
    });

    searchClearBtn.addEventListener('click', () => {
      window.AOA.clearSearch();
    });

    // Sidebar filter buttons
    if (filterAllBtn) filterAllBtn.addEventListener('click', () => setSidebarFilter('all'));
    if (filterPracticalsBtn) filterPracticalsBtn.addEventListener('click', () => setSidebarFilter('practicals'));
    if (filterPlaceholdersBtn) filterPlaceholdersBtn.addEventListener('click', () => setSidebarFilter('placeholders'));

    // Copy buttons
    copyCodeBtn.addEventListener('click', () => copySelectedCode('code'));
    copyAllBtn.addEventListener('click', () => copySelectedCode('all'));
    
    // Paste / Edit button
    pasteCodeBtn.addEventListener('click', openPasteModal);
    if (emptyStatePasteBtn) emptyStatePasteBtn.addEventListener('click', openPasteModal);

    // Print button
    printBtn.addEventListener('click', () => {
      window.print();
    });

    // Toggle Mode Button
    togglePlaceholdersBtn.addEventListener('click', togglePlaceholdersMode);

    // Sidebar Mobile Toggle
    sidebarToggleBtn.addEventListener('click', () => {
      appSidebar.classList.toggle('open');
    });

    // Fallback Modal Buttons
    fallbackModalClose.addEventListener('click', closeManualCopyModal);
    fallbackModalCopyBtn.addEventListener('click', () => {
      fallbackModalTextarea.select();
      document.execCommand('copy');
      showToast("✓ Copied to clipboard!");
      closeManualCopyModal();
    });

    fallbackModal.addEventListener('click', (e) => {
      if (e.target === fallbackModal) {
        closeManualCopyModal();
      }
    });

    // Paste Modal Buttons
    pasteModalClose.addEventListener('click', closePasteModal);
    pasteModalCancelBtn.addEventListener('click', closePasteModal);
    savePastedCodeBtn.addEventListener('click', savePastedCode);
    pasteFromClipboardBtn.addEventListener('click', pasteFromClipboard);
    clearPasteTextareaBtn.addEventListener('click', () => {
      pasteModalTextarea.value = '';
      pasteModalTextarea.focus();
    });
    resetToDefaultBtn.addEventListener('click', resetToDefault);

    pasteModal.addEventListener('click', (e) => {
      if (e.target === pasteModal) {
        closePasteModal();
      }
    });

    // Global Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl+K or '/' to focus search
      if ((e.ctrlKey && e.key.toLowerCase() === 'k') || (e.key === '/' && document.activeElement !== searchInput && document.activeElement.tagName !== 'TEXTAREA')) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }

      // Escape key clears search or closes modal
      if (e.key === 'Escape') {
        if (pasteModal.classList.contains('show')) {
          closePasteModal();
        } else if (fallbackModal.classList.contains('show')) {
          closeManualCopyModal();
        } else if (document.activeElement === searchInput || activeSearchQuery) {
          window.AOA.clearSearch();
          searchInput.blur();
        }
      }

      // Keyboard navigation in search results: ArrowUp and ArrowDown
      if (document.activeElement === searchInput && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        const visibleItems = Array.from(sidebarNavList.querySelectorAll('.algo-nav-item'));
        if (visibleItems.length > 0) {
          e.preventDefault();
          visibleItems[0].focus();
        }
      }
    });

    // Listen for hashchange
    window.addEventListener('hashchange', () => {
      const hashId = window.location.hash.replace('#', '');
      if (hashId && hashId !== currentAlgoId) {
        selectAlgorithm(hashId);
      }
    });
  }

  /**
   * Public Global API
   */
  window.AOA = {
    selectAlgorithm: selectAlgorithm,
    clearSearch: function () {
      searchInput.value = '';
      activeSearchQuery = '';
      activeFilter = 'all';
      if (filterAllBtn) setSidebarFilter('all');
      searchClearBtn.style.display = 'none';
      renderSidebar();
      searchInput.focus();
    },
    togglePlaceholders: togglePlaceholdersMode,
    openPasteModal: openPasteModal
  };

  /**
   * App Initialization
   */
  function init() {
    setupEventListeners();

    // Default to Selection Sort (Lab #1) or hash
    const initialHash = window.location.hash.replace('#', '');
    const validInitial = ALGORITHMS.find(a => a.id === initialHash);
    
    renderSidebar();

    if (validInitial) {
      selectAlgorithm(validInitial.id);
    } else {
      // Prefer Selection Sort (Lab #1) as initial algorithm
      const selectionSort = ALGORITHMS.find(a => a.id === 'selection-sort');
      if (selectionSort) {
        selectAlgorithm(selectionSort.id);
      } else if (ALGORITHMS.length > 0) {
        selectAlgorithm(ALGORITHMS[0].id);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
