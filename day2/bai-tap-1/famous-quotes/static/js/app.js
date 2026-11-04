/**
 * Bilingual Famous Quotes Web App
 * Plain Vanilla JavaScript implementation
 */

(() => {
  'use strict';

  // --- Constants & Storage Keys ---
  const STORAGE_KEY = 'famous_quotes_favorites_v1';
  const THEME_KEY = 'famous_quotes_theme_v1';

  // --- DOM Elements ---
  const heroCard = document.getElementById('hero-quote-card');
  const heroQuoteEn = document.getElementById('hero-quote-en');
  const heroQuoteVi = document.getElementById('hero-quote-vi');
  const heroAuthor = document.getElementById('hero-author');
  const heroCategory = document.getElementById('hero-category');
  const heroFavBtn = document.getElementById('btn-hero-fav');
  const heroCopyBtn = document.getElementById('btn-hero-copy');
  const nextRandomBtn = document.getElementById('btn-next-random');
  const topRandomBtn = document.getElementById('btn-random-quote');

  const btnSpeakEn = document.getElementById('btn-speak-en');
  const btnSpeakVi = document.getElementById('btn-speak-vi');

  const btnThemeToggle = document.getElementById('btn-theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('btn-clear-search');
  const categorySelect = document.getElementById('category-select');
  const categoryPillsContainer = document.getElementById('category-pills');

  const resultsSection = document.getElementById('results-section');
  const resultsCount = document.getElementById('results-count');
  const resultsHeading = document.getElementById('results-heading');
  const quotesGrid = document.getElementById('quotes-grid');

  const favCountBadge = document.getElementById('fav-count-badge');
  const btnOpenFav = document.getElementById('btn-open-favorites');
  const favModal = document.getElementById('fav-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCloseModalFooter = document.getElementById('btn-close-modal-footer');
  const modalFavList = document.getElementById('fav-modal-list');
  const modalFavCount = document.getElementById('modal-fav-count');
  const btnClearAllFav = document.getElementById('btn-clear-all-fav');
  const btnExportCsv = document.getElementById('btn-export-csv');

  const toastEl = document.getElementById('toast');

  // --- State ---
  let currentQuote = null;
  let activeCategory = 'all';
  let searchDebounceTimer = null;

  // --- Theme Service (Dark / Light) ---
  const ThemeService = {
    getPreferredTheme() {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored) return stored;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    },

    setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(THEME_KEY, theme);
      if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
      }
      if (btnThemeToggle) {
        btnThemeToggle.title = theme === 'dark' ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối';
      }
    },

    toggle() {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      this.setTheme(nextTheme);
      showToast(nextTheme === 'dark' ? 'Đã bật chế độ Tối (Dark mode) 🌙' : 'Đã bật chế độ Sáng (Light mode) ☀️');
    },

    init() {
      const theme = this.getPreferredTheme();
      this.setTheme(theme);
    }
  };

  // --- Text-to-Speech (Web Speech API) Service ---
  const SpeechService = {
    activeBtn: null,

    speak(text, lang = 'en-US', btn = null) {
      if (!('speechSynthesis' in window)) {
        showToast('Trình duyệt của bạn không hỗ trợ tính năng phát âm');
        return;
      }

      // If already speaking, cancel previous
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        if (this.activeBtn) {
          this.activeBtn.classList.remove('is-speaking');
        }
        // If user clicked the same active button, just stop
        if (this.activeBtn === btn) {
          this.activeBtn = null;
          return;
        }
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.92; // Clear, easy to follow

      // Find matching voice
      const voices = window.speechSynthesis.getVoices();
      const langPrefix = lang.slice(0, 2);
      const voice = voices.find(v => v.lang.toLowerCase().startsWith(langPrefix));
      if (voice) utterance.voice = voice;

      if (btn) {
        this.activeBtn = btn;
        btn.classList.add('is-speaking');
      }

      utterance.onend = () => {
        if (btn) btn.classList.remove('is-speaking');
        this.activeBtn = null;
      };

      utterance.onerror = () => {
        if (btn) btn.classList.remove('is-speaking');
        this.activeBtn = null;
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // --- Favorites (localStorage) Service ---
  const FavoritesService = {
    getAll() {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
      } catch (err) {
        console.error('Error reading favorites from localStorage', err);
        return [];
      }
    },

    saveAll(favorites) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
        this.updateBadge();
      } catch (err) {
        console.error('Error saving favorites to localStorage', err);
      }
    },

    has(id) {
      const list = this.getAll();
      return list.some(item => item.id === id);
    },

    toggle(quote) {
      let list = this.getAll();
      const exists = list.some(item => item.id === quote.id);
      if (exists) {
        list = list.filter(item => item.id !== quote.id);
        showToast('Đã xóa khỏi danh sách yêu thích');
      } else {
        list.unshift(quote);
        showToast('Đã thêm vào danh sách yêu thích ❤️');
      }
      this.saveAll(list);
      return !exists;
    },

    remove(id) {
      let list = this.getAll();
      list = list.filter(item => item.id !== id);
      this.saveAll(list);
      showToast('Đã xóa khỏi danh sách yêu thích');
    },

    clear() {
      localStorage.removeItem(STORAGE_KEY);
      this.updateBadge();
      showToast('Đã xóa toàn bộ danh ngôn yêu thích');
    },

    updateBadge() {
      const count = this.getAll().length;
      if (favCountBadge) favCountBadge.textContent = count;
      if (modalFavCount) modalFavCount.textContent = count;
    }
  };

  // --- CSV Export Helper ---
  function exportFavoritesToCSV() {
    const favorites = FavoritesService.getAll();
    if (!favorites || favorites.length === 0) {
      showToast('Chưa có danh ngôn yêu thích nào để xuất CSV! 🤍');
      return;
    }

    const escapeCsvField = (text) => {
      if (text === null || text === undefined) return '""';
      const str = String(text).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = ['ID', 'Category', 'Author', 'Quote_EN', 'Quote_VI'];
    const rows = [headers.join(',')];

    favorites.forEach(q => {
      const row = [
        escapeCsvField(q.id),
        escapeCsvField(q.category),
        escapeCsvField(q.author),
        escapeCsvField(q.quote_en),
        escapeCsvField(q.quote_vi)
      ];
      rows.push(row.join(','));
    });

    const csvContent = '\uFEFF' + rows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `danh_ngon_yeu_thich_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);

    showToast(`Đã xuất ${favorites.length} danh ngôn ra file CSV! 📥`);
  }

  // --- UI Toast Notification ---
  let toastTimer = null;
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2500);
  }

  // --- Copy Helper ---
  async function copyQuoteText(quote) {
    const text = `“${quote.quote_en}”\n“${quote.quote_vi}”\n— ${quote.author} (${quote.category})`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast('Đã sao chép danh ngôn vào clipboard! 📋');
    } catch (err) {
      console.error('Failed to copy', err);
      showToast('Không thể sao chép văn bản');
    }
  }

  // --- API Fetchers ---
  async function fetchRandomQuote(category = 'all') {
    try {
      let url = '/api/quotes/random';
      if (category && category !== 'all') {
        url += `?category=${encodeURIComponent(category)}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch random quote');
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      return data.categories || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async function fetchQuotes(query = '', category = 'all') {
    try {
      const params = new URLSearchParams();
      if (query) params.append('search', query);
      if (category && category !== 'all') params.append('category', category);

      const res = await fetch(`/api/quotes?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch quotes');
      const data = await res.json();
      return data.quotes || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  // --- Render Functions ---
  function renderHeroQuote(quote) {
    if (!quote) return;
    currentQuote = quote;

    heroQuoteEn.textContent = `“${quote.quote_en}”`;
    heroQuoteVi.textContent = `“${quote.quote_vi}”`;
    heroAuthor.textContent = quote.author;
    heroCategory.textContent = quote.category;

    syncHeroFavButton();
  }

  function syncHeroFavButton() {
    if (!currentQuote) return;
    const isFav = FavoritesService.has(currentQuote.id);
    if (isFav) {
      heroFavBtn.classList.add('is-favorite');
      heroFavBtn.title = 'Bỏ khỏi yêu thích (Phím tắt: F)';
    } else {
      heroFavBtn.classList.remove('is-favorite');
      heroFavBtn.title = 'Thêm vào yêu thích (Phím tắt: F)';
    }
  }

  function renderCategoryPills(categories) {
    categoryPillsContainer.innerHTML = '';

    const allPill = document.createElement('button');
    allPill.className = `pill ${activeCategory === 'all' ? 'active' : ''}`;
    allPill.textContent = 'Tất cả (100)';
    allPill.dataset.category = 'all';
    categoryPillsContainer.appendChild(allPill);

    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.name;
      opt.textContent = `${cat.name} (${cat.count})`;
      categorySelect.appendChild(opt);

      const pill = document.createElement('button');
      pill.className = `pill ${activeCategory === cat.name ? 'active' : ''}`;
      pill.textContent = `${cat.name} (${cat.count})`;
      pill.dataset.category = cat.name;
      categoryPillsContainer.appendChild(pill);
    });
  }

  function updateActivePill(category) {
    const pills = categoryPillsContainer.querySelectorAll('.pill');
    pills.forEach(p => {
      if (p.dataset.category.toLowerCase() === category.toLowerCase()) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
  }

  function renderSearchResults(quotes, query, category) {
    quotesGrid.innerHTML = '';

    const hasSearch = Boolean(query && query.trim());
    const hasCategoryFilter = category && category !== 'all';

    if (!hasSearch && !hasCategoryFilter) {
      resultsSection.style.display = 'none';
      return;
    }

    resultsSection.style.display = 'flex';
    resultsCount.textContent = `${quotes.length} câu`;

    if (hasSearch && hasCategoryFilter) {
      resultsHeading.textContent = `Kết quả cho "${query}" trong chủ đề "${category}"`;
    } else if (hasSearch) {
      resultsHeading.textContent = `Kết quả tìm kiếm cho "${query}"`;
    } else {
      resultsHeading.textContent = `Danh sách danh ngôn chủ đề "${category}"`;
    }

    if (quotes.length === 0) {
      quotesGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <p>Không tìm thấy danh ngôn nào phù hợp với từ khóa của bạn.</p>
        </div>
      `;
      return;
    }

    quotes.forEach(quote => {
      const isFav = FavoritesService.has(quote.id);
      const card = document.createElement('div');
      card.className = 'grid-item-card';
      card.innerHTML = `
        <div class="grid-card-top">
          <span class="category-tag">${escapeHtml(quote.category)}</span>
          <div class="grid-actions">
            <button class="icon-button btn-speak-grid" title="Phát âm tiếng Anh">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            </button>
            <button class="icon-button btn-copy-grid" title="Sao chép">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
            <button class="icon-button fav-btn ${isFav ? 'is-favorite' : ''} btn-fav-grid" title="Yêu thích">
              <svg class="heart-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
        </div>
        <p class="grid-quote-en">“${escapeHtml(quote.quote_en)}”</p>
        <p class="grid-quote-vi">“${escapeHtml(quote.quote_vi)}”</p>
        <div class="grid-card-bottom">
          <span class="grid-author">— ${escapeHtml(quote.author)}</span>
        </div>
      `;

      // Speak event
      const speakBtn = card.querySelector('.btn-speak-grid');
      speakBtn.addEventListener('click', () => {
        SpeechService.speak(quote.quote_en, 'en-US', speakBtn);
      });

      // Copy event
      card.querySelector('.btn-copy-grid').addEventListener('click', () => {
        copyQuoteText(quote);
      });

      // Fav toggle event
      const favBtn = card.querySelector('.btn-fav-grid');
      favBtn.addEventListener('click', () => {
        const added = FavoritesService.toggle(quote);
        if (added) {
          favBtn.classList.add('is-favorite');
        } else {
          favBtn.classList.remove('is-favorite');
        }
        syncHeroFavButton();
      });

      quotesGrid.appendChild(card);
    });
  }

  function renderFavoritesModal() {
    const favorites = FavoritesService.getAll();
    modalFavList.innerHTML = '';
    FavoritesService.updateBadge();

    if (favorites.length === 0) {
      modalFavList.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🤍</div>
          <p>Bạn chưa lưu danh ngôn nào.</p>
          <p style="font-size: 0.85rem; margin-top: 6px; color: var(--text-light);">
            Bấm vào biểu tượng trái tim ở bất kỳ danh ngôn nào để lưu vào đây!
          </p>
        </div>
      `;
      return;
    }

    favorites.forEach(quote => {
      const item = document.createElement('div');
      item.className = 'grid-item-card';
      item.innerHTML = `
        <div class="grid-card-top">
          <span class="category-tag">${escapeHtml(quote.category)}</span>
          <div class="grid-actions">
            <button class="icon-button btn-speak-fav" title="Phát âm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            </button>
            <button class="icon-button btn-copy-fav" title="Sao chép">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
            <button class="icon-button danger-text btn-del-fav" title="Xóa khỏi yêu thích">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
        <p class="grid-quote-en">“${escapeHtml(quote.quote_en)}”</p>
        <p class="grid-quote-vi">“${escapeHtml(quote.quote_vi)}”</p>
        <div class="grid-card-bottom">
          <span class="grid-author">— ${escapeHtml(quote.author)}</span>
        </div>
      `;

      const speakBtn = item.querySelector('.btn-speak-fav');
      speakBtn.addEventListener('click', () => {
        SpeechService.speak(quote.quote_en, 'en-US', speakBtn);
      });

      item.querySelector('.btn-copy-fav').addEventListener('click', () => {
        copyQuoteText(quote);
      });

      item.querySelector('.btn-del-fav').addEventListener('click', () => {
        FavoritesService.remove(quote.id);
        renderFavoritesModal();
        syncHeroFavButton();
        refreshGridFavButtons();
      });

      modalFavList.appendChild(item);
    });
  }

  function refreshGridFavButtons() {
    if (resultsSection.style.display !== 'none') {
      executeSearch();
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- Actions & Search Handler ---
  async function loadNewRandomQuote() {
    heroCard.style.opacity = '0.5';
    heroCard.style.transform = 'scale(0.99)';
    const quote = await fetchRandomQuote(activeCategory);
    setTimeout(() => {
      renderHeroQuote(quote);
      heroCard.style.opacity = '1';
      heroCard.style.transform = 'scale(1)';
    }, 150);
  }

  async function executeSearch() {
    const query = searchInput.value.trim();
    const category = activeCategory;

    if (query) {
      clearSearchBtn.style.display = 'block';
    } else {
      clearSearchBtn.style.display = 'none';
    }

    if (!query && category === 'all') {
      resultsSection.style.display = 'none';
      return;
    }

    const quotes = await fetchQuotes(query, category);
    renderSearchResults(quotes, query, category);
  }

  // --- Modal Handlers ---
  function openModal() {
    renderFavoritesModal();
    favModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    favModal.style.display = 'none';
    document.body.style.overflow = '';
  }

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    // Theme toggle
    if (btnThemeToggle) {
      btnThemeToggle.addEventListener('click', () => {
        ThemeService.toggle();
      });
    }

    // Speech buttons on hero card
    if (btnSpeakEn) {
      btnSpeakEn.addEventListener('click', () => {
        if (currentQuote) {
          SpeechService.speak(currentQuote.quote_en, 'en-US', btnSpeakEn);
        }
      });
    }

    if (btnSpeakVi) {
      btnSpeakVi.addEventListener('click', () => {
        if (currentQuote) {
          SpeechService.speak(currentQuote.quote_vi, 'vi-VN', btnSpeakVi);
        }
      });
    }

    // Next/Random quote buttons
    nextRandomBtn.addEventListener('click', loadNewRandomQuote);
    topRandomBtn.addEventListener('click', loadNewRandomQuote);

    // Hero action buttons
    heroFavBtn.addEventListener('click', () => {
      if (!currentQuote) return;
      FavoritesService.toggle(currentQuote);
      syncHeroFavButton();
    });

    heroCopyBtn.addEventListener('click', () => {
      if (currentQuote) copyQuoteText(currentQuote);
    });

    // Search input
    searchInput.addEventListener('input', () => {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(executeSearch, 250);
    });

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearSearchBtn.style.display = 'none';
      executeSearch();
      searchInput.focus();
    });

    // Category select dropdown
    categorySelect.addEventListener('change', (e) => {
      activeCategory = e.target.value;
      updateActivePill(activeCategory);
      executeSearch();
      loadNewRandomQuote();
    });

    // Category pills container
    categoryPillsContainer.addEventListener('click', (e) => {
      const pill = e.target.closest('.pill');
      if (!pill) return;
      const cat = pill.dataset.category;
      activeCategory = cat;
      categorySelect.value = cat;
      updateActivePill(cat);
      executeSearch();
      loadNewRandomQuote();
    });

    // Favorites Modal buttons
    btnOpenFav.addEventListener('click', openModal);
    btnCloseModal.addEventListener('click', closeModal);
    btnCloseModalFooter.addEventListener('click', closeModal);

    // Clear all favorites
    btnClearAllFav.addEventListener('click', () => {
      if (confirm('Bạn có chắc chắn muốn xóa toàn bộ danh ngôn đã lưu không?')) {
        FavoritesService.clear();
        renderFavoritesModal();
        syncHeroFavButton();
      }
    });

    // Export favorites to CSV
    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', exportFavoritesToCSV);
    }

    favModal.addEventListener('click', (e) => {
      if (e.target === favModal) closeModal();
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      const isInputFocused = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);

      if (e.key === 'Escape' && favModal.style.display === 'flex') {
        closeModal();
        return;
      }

      if (isInputFocused || favModal.style.display === 'flex') return;

      if (e.code === 'Space' || e.key === 'ArrowRight') {
        e.preventDefault();
        loadNewRandomQuote();
      } else if (e.key === 'f' || e.key === 'F') {
        if (currentQuote) {
          FavoritesService.toggle(currentQuote);
          syncHeroFavButton();
        }
      } else if (e.key === 'c' || e.key === 'C') {
        if (currentQuote) copyQuoteText(currentQuote);
      } else if (e.key === 's' || e.key === 'S') {
        if (currentQuote && btnSpeakEn) {
          SpeechService.speak(currentQuote.quote_en, 'en-US', btnSpeakEn);
        }
      } else if (e.key === '/') {
        e.preventDefault();
        searchInput.focus();
      }
    });
  }

  // --- Initialization ---
  async function init() {
    ThemeService.init();
    FavoritesService.updateBadge();
    setupEventListeners();

    // Fetch categories and populate
    const categories = await fetchCategories();
    renderCategoryPills(categories);

    // Fetch initial random quote
    await loadNewRandomQuote();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
