const CacheManager = {
    data: new Map(),
    images: new Map(),    api: new Map(),
    
    set(type, key, value) {
        this[type].set(key, value);
    },
    
    get(type, key) {
        return this[type].get(key);
    },
    
    has(type, key) {
        return this[type].has(key);
    },
    
    clear(type) {
        this[type].clear();    },
    
    getStats() {
        return {
            data: this.data.size,
            images: this.images.size,
            api: this.api.size,
            total: this.data.size + this.images.size + this.api.size
        };
    }
};

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;    notification.textContent = message;
    
    const colors = {
        success: 'var(--success)',
        error: 'var(--error)',
        info: 'var(--primary)'
    };
    
    notification.style.background = colors[type] || colors.success;    document.body.appendChild(notification);
      setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

class UserFormManager {
    constructor() {
        this.form = document.getElementById('userForm');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            this.loadSavedData();
        }
    }
    
    handleSubmit(event) {
        event.preventDefault();
        
        const formData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            bio: document.getElementById('bio').value,
            timestamp: Date.now()        };
        
        localStorage.setItem('userData', JSON.stringify(formData));
        
        CacheManager.set('data', 'userForm', formData);
        
        this.updateCacheStatus();
        showNotification('Дані користувача збережено!');
    }
    
    loadSavedData() {
        const savedData = localStorage.getItem('userData');
        if (savedData) {
            const data = JSON.parse(savedData);
            document.getElementById('username').value = data.username || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('bio').value = data.bio || '';
            this.updateCacheStatus();
        }
    }
    
    clearForm() {
        localStorage.removeItem('userData');
        CacheManager.clear('data');
        this.form.reset();
        this.updateCacheStatus();
        showNotification('Форму очищено!', 'error');
    }
    
    updateCacheStatus() {
        const statusElement = document.getElementById('formCacheStatus');
        if (statusElement) {
            const data = localStorage.getItem('userData');
            if (data) {
                const userData = JSON.parse(data);
                statusElement.textContent = `Збережено: ${userData.username}`;
            } else {
                statusElement.textContent = 'Порожній';
            }
        }
    }
}

class GalleryManager {
    constructor() {
        this.gallery = document.getElementById('gallery');
        this.cacheKey = 'imageGallery';
        this.init();
    }
      init() {
        const cachedGallery = sessionStorage.getItem('galleryCache');
        if (cachedGallery) {
            this.gallery.innerHTML = cachedGallery;
            CacheManager.set('images', this.cacheKey, cachedGallery);
            this.updateCacheStatus('Завантажено з sessionStorage');
        }
    }
      async loadGallery() {
        if (CacheManager.has('images', this.cacheKey)) {
            this.gallery.innerHTML = CacheManager.get('images', this.cacheKey);
            this.updateCacheStatus('Завантажено з кешу пам\'яті');
            showNotification('Галерея завантажена з кешу!', 'info');
            return;        }
        
        this.gallery.innerHTML = '<div class="loading"></div>';
        this.updateCacheStatus('Завантажується...');
        
        try {            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const images = Array.from({length: 8}, (_, i) => 
                `https://picsum.photos/200/200?random=${i + 1}`
            );
            
            const galleryHTML = images.map(src => 
                `<img src="${src}" alt="Зображення ${src.split('=')[1]}" loading="lazy">`            ).join('');
            
            this.gallery.innerHTML = galleryHTML;
            
            CacheManager.set('images', this.cacheKey, galleryHTML);
            sessionStorage.setItem('galleryCache', galleryHTML);
            
            this.updateCacheStatus(`Кешовано: ${images.length} зображень`);
            showNotification('Галерею завантажено та кешовано!');
            
        } catch (error) {
            this.gallery.innerHTML = '<p>❌ Помилка завантаження галереї</p>';
            showNotification('Помилка завантаження галереї!', 'error');
        }
    }
    
    updateCacheStatus(status) {
        const statusElement = document.getElementById('imageCacheStatus');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }
}

class SettingsManager {
    constructor() {
        this.themeSelect = null;
        this.languageSelect = null;
        this.init();
    }
      init() {
        this.themeSelect = document.getElementById('theme');
        this.languageSelect = document.getElementById('language');
          this.loadSettings();
        
        if (this.themeSelect) {
            this.themeSelect.addEventListener('change', () => this.saveSettings());
        }
        if (this.languageSelect) {
            this.languageSelect.addEventListener('change', () => this.saveSettings());
        }
    }
      saveSettings() {
        if (!this.themeSelect || !this.languageSelect) {
            console.warn('Settings elements not found');
            return;
        }
        
        const settings = {
            theme: this.themeSelect.value,
            language: this.languageSelect.value,
            timestamp: Date.now()
        };
          localStorage.setItem('userSettings', JSON.stringify(settings));
        
        this.applySettings(settings);
        
        this.displayCurrentSettings(settings);
        
        showNotification('Налаштування збережено та застосовано!');
        
        console.log('Settings saved:', settings);
    }
      applySettings(settings) {
        this.applyTheme(settings.theme);
        
        this.applyLanguage(settings.language);
    }
      applyTheme(theme) {
        const body = document.body;
        
        body.classList.remove('theme-light', 'theme-dark', 'theme-auto');
        
        body.classList.add(`theme-${theme}`);
        
        const root = document.documentElement;
        
        switch(theme) {
            case 'dark':
                root.style.setProperty('--background', '#1a1a1a');
                root.style.setProperty('--card-bg', '#2d2d2d');
                root.style.setProperty('--text', '#ffffff');
                root.style.setProperty('--text-light', '#cccccc');
                root.style.setProperty('--border', '#444444');
                break;            case 'auto':
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    this.applyTheme('dark');
                } else {
                    this.applyTheme('light');
                }
                return;
            case 'light':
            default:
                root.style.setProperty('--background', '#f8f9fa');
                root.style.setProperty('--card-bg', '#fff');
                root.style.setProperty('--text', '#333');
                root.style.setProperty('--text-light', '#666');
                root.style.setProperty('--border', '#ddd');
                break;
        }
    }
    
    applyLanguage(language) {
        const translations = {
            'uk': {
                'header-title': 'Практична робота №9',
                'header-subtitle': 'Налаштування кешування та стиснення веб-ресурсів',
                'form-title': '📝 Форма користувача',
                'gallery-title': '🖼️ Галерея зображень',
                'settings-title': '⚙️ Налаштування користувача',
                'dynamic-title': '🔄 Динамічний контент'
            },
            'en': {
                'header-title': 'Practical Work #9',
                'header-subtitle': 'Web Resource Caching and Compression Settings',
                'form-title': '📝 User Form',
                'gallery-title': '🖼️ Image Gallery',
                'settings-title': '⚙️ User Settings',
                'dynamic-title': '🔄 Dynamic Content'
            },
            'ru': {
                'header-title': 'Практическая работа №9',
                'header-subtitle': 'Настройки кэширования и сжатия веб-ресурсов',
                'form-title': '📝 Форма пользователя',
                'gallery-title': '🖼️ Галерея изображений',
                'settings-title': '⚙️ Настройки пользователя',
                'dynamic-title': '🔄 Динамический контент'
            }
        };
          const texts = translations[language] || translations['uk'];
        
        const headerTitle = document.querySelector('header h1');
        const headerSubtitle = document.querySelector('header p');
          if (headerTitle) headerTitle.textContent = `🗄️ ${texts['header-title']}`;
        if (headerSubtitle) headerSubtitle.textContent = texts['header-subtitle'];
        
        const cardTitles = document.querySelectorAll('.card h3');
        const titleKeys = ['form-title', 'gallery-title', 'settings-title', 'dynamic-title'];
        
        cardTitles.forEach((title, index) => {
            if (titleKeys[index] && texts[titleKeys[index]]) {
                title.textContent = texts[titleKeys[index]];
            }        });
        document.documentElement.lang = language;
    }
      resetSettings() {
        localStorage.removeItem('userSettings');
        
        const defaultSettings = {
            theme: 'light',
            language: 'uk',
            timestamp: Date.now()
        };
        
        if (this.themeSelect) this.themeSelect.value = 'light';
        if (this.languageSelect) this.languageSelect.value = 'uk';
        
        this.applySettings(defaultSettings);
        this.displayCurrentSettings(defaultSettings);
        
        showNotification('Налаштування скинуто до значень за замовчуванням!', 'info');
        
        console.log('Settings reset to default');
    }
      loadSettings() {
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {            try {
                const settings = JSON.parse(savedSettings);
                
                if (this.themeSelect && settings.theme) {
                    this.themeSelect.value = settings.theme;
                }
                if (this.languageSelect && settings.language) {
                    this.languageSelect.value = settings.language;
                }
                
                this.applySettings(settings);
                
                this.displayCurrentSettings(settings);
                
                console.log('Settings loaded:', settings);
            } catch (error) {
                console.error('Error loading settings:', error);
            }        } else {
            const defaultSettings = {
                theme: 'light',
                language: 'uk',
                timestamp: Date.now()
            };
            
            this.applySettings(defaultSettings);
            this.displayCurrentSettings(defaultSettings);
        }
    }
      displayCurrentSettings(settings) {
        const display = document.getElementById('currentSettings');
        if (display) {
            const date = new Date(settings.timestamp).toLocaleString('uk-UA');
            const themeText = {
                'light': 'Світла',
                'dark': 'Темна', 
                'auto': 'Автоматична'
            };
            const langText = {
                'uk': 'Українська',
                'en': 'English',
                'ru': 'Русский'
            };
            
            display.innerHTML = `
                <div style="display: grid; gap: 0.5rem;">
                    <div><strong>🎨 Тема:</strong> ${themeText[settings.theme] || settings.theme}</div>
                    <div><strong>🌍 Мова:</strong> ${langText[settings.language] || settings.language}</div>
                    <div><strong>🕐 Оновлено:</strong> ${date}</div>
                    <div style="margin-top: 0.5rem; padding: 0.5rem; background: rgba(74, 144, 226, 0.1); border-radius: 4px; font-size: 0.9rem;">
                        ✅ Налаштування активні та збережені в LocalStorage
                    </div>
                </div>
            `;
        }
    }
}

class DynamicContentManager {
    constructor() {
        this.cacheKey = 'dynamicApiData';
    }
      async loadDynamicContent() {
        const contentElement = document.getElementById('dynamicContent');
        
        if (CacheManager.has('api', this.cacheKey)) {
            contentElement.innerHTML = CacheManager.get('api', this.cacheKey);
            this.updateApiCacheStatus('Дані з кешу');
            showNotification('Контент завантажено з кешу!', 'info');
            return;
        }
        
        contentElement.innerHTML = '<div class="loading"></div> Завантаження даних...';
        this.updateApiCacheStatus('Завантажується...');
        
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const data = {
                users: Math.floor(Math.random() * 1000) + 500,
                posts: Math.floor(Math.random() * 5000) + 2000,
                comments: Math.floor(Math.random() * 10000) + 5000,
                online: Math.floor(Math.random() * 100) + 50,
                loadTime: Date.now()
            };
            
            const contentHTML = `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    <div><strong>👥 Користувачі:</strong> ${data.users.toLocaleString()}</div>
                    <div><strong>📝 Пости:</strong> ${data.posts.toLocaleString()}</div>
                    <div><strong>💬 Коментарі:</strong> ${data.comments.toLocaleString()}</div>
                    <div><strong>🟢 Онлайн:</strong> ${data.online}</div>
                </div>
                <p style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-light);">
                    Завантажено: ${new Date(data.loadTime).toLocaleString('uk-UA')}
                </p>
            `;
            
            contentElement.innerHTML = contentHTML;
            
            CacheManager.set('api', this.cacheKey, contentHTML);
            
            this.updateApiCacheStatus(`Кешовано: ${Object.keys(data).length} елементів`);
            showNotification('Динамічний контент завантажено!');
            
        } catch (error) {
            contentElement.innerHTML = '<p>❌ Помилка завантаження даних</p>';
            showNotification('Помилка завантаження контенту!', 'error');
        }
    }
    
    showCacheStatistics() {
        const contentElement = document.getElementById('dynamicContent');
        const stats = {
            localStorage: Object.keys(localStorage).length,
            sessionStorage: Object.keys(sessionStorage).length,
            memoryCache: CacheManager.getStats().total,
            totalSize: JSON.stringify(localStorage).length + JSON.stringify(sessionStorage).length
        };
        
        const statsHTML = `
            <h4 style="color: var(--primary); margin-bottom: 1rem;">📊 Статистика кешування</h4>
            <div style="display: grid; gap: 0.75rem;">
                <div><strong>LocalStorage:</strong> ${stats.localStorage} ключів</div>
                <div><strong>SessionStorage:</strong> ${stats.sessionStorage} ключів</div>
                <div><strong>Memory Cache:</strong> ${stats.memoryCache} елементів</div>
                <div><strong>Загальний розмір:</strong> ~${(stats.totalSize / 1024).toFixed(2)} KB</div>
            </div>
            <div style="margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                <strong>Детальна статистика пам'яті:</strong><br>
                Data Cache: ${CacheManager.getStats().data} елементів<br>
                Images Cache: ${CacheManager.getStats().images} елементів<br>
                API Cache: ${CacheManager.getStats().api} елементів
            </div>
        `;
        
        contentElement.innerHTML = statsHTML;
        showNotification('Статистика кешу відображена!', 'info');
    }
    
    updateApiCacheStatus(status) {
        const statusElement = document.getElementById('apiCacheStatus');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Практична робота №9 - Кешування та стиснення ініціалізована');
    
    window.userFormManager = new UserFormManager();
    window.galleryManager = new GalleryManager();
    window.settingsManager = new SettingsManager();
    window.dynamicContentManager = new DynamicContentManager();
    window.clearForm = () => userFormManager.clearForm();
    window.loadGallery = () => galleryManager.loadGallery();
    window.loadDynamicContent = () => dynamicContentManager.loadDynamicContent();
    window.showCacheStats = () => dynamicContentManager.showCacheStatistics();
    window.resetSettings = () => settingsManager.resetSettings();
    
    
    setTimeout(() => {
        const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        
        const userData = localStorage.getItem('userData');
        if (userData) {
            try {
                const data = JSON.parse(userData);
                if (data.timestamp && data.timestamp < oneWeekAgo) {
                    localStorage.removeItem('userData');
                    console.log('Застарілі дані користувача видалено');
                }
            } catch (error) {
                console.error('Error checking user data:', error);
            }
        }
    }, 1000);
});
