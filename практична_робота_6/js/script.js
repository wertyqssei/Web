class RickAndMortyApp {
    constructor() {
        this.API_URL = 'https://rickandmortyapi.com/api/character';
        this.currentPage = 1;
        this.searchTerm = '';
        this.statusFilter = '';
        this.genderFilter = '';
        this.totalPages = 0;
        this.isLoading = false;
        this.charactersData = null;
        
        this.initElements();
        this.setupEventListeners();
        this.loadFromLocalStorage();
        this.fetchCharacters();
    }
    
    initElements() {
        this.characterContainer = document.getElementById('characters-container');
        this.loaderElement = document.getElementById('loader');
        this.errorContainer = document.getElementById('error-container');
        this.prevPageBtn = document.getElementById('prev-page');
        this.nextPageBtn = document.getElementById('next-page');
        this.currentPageElement = document.getElementById('current-page');
        this.searchInput = document.getElementById('search-input');
        this.searchBtn = document.getElementById('search-btn');
        this.statusFilterSelect = document.getElementById('status-filter');
        this.genderFilterSelect = document.getElementById('gender-filter');
        this.characterTemplate = document.getElementById('character-template');
    }
    
    setupEventListeners() {
        this.prevPageBtn.addEventListener('click', () => this.changePage(this.currentPage - 1));
        this.nextPageBtn.addEventListener('click', () => this.changePage(this.currentPage + 1));
        
        this.searchBtn.addEventListener('click', () => {
            this.searchTerm = this.searchInput.value.trim();
            this.resetPage();
            this.fetchCharacters();
        });
        
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchTerm = this.searchInput.value.trim();
                this.resetPage();
                this.fetchCharacters();
            }
        });
        
        this.statusFilterSelect.addEventListener('change', () => {
            this.statusFilter = this.statusFilterSelect.value;
            this.resetPage();
            this.fetchCharacters();
        });
        
        this.genderFilterSelect.addEventListener('change', () => {
            this.genderFilter = this.genderFilterSelect.value;
            this.resetPage();
            this.fetchCharacters();
        });
    }
    
    async fetchCharacters() {
        this.showLoader();
        this.hideError();
        
        const cacheKey = this.getCacheKey();
        const cachedData = this.getFromCache(cacheKey);
        
        if (cachedData) {
            this.processCharactersData(cachedData);
            this.hideLoader();
            return;
        }
        
        try {
            let url = `${this.API_URL}?page=${this.currentPage}`;
            
            if (this.searchTerm) {
                url += `&name=${encodeURIComponent(this.searchTerm)}`;
            }
            
            if (this.statusFilter) {
                url += `&status=${encodeURIComponent(this.statusFilter)}`;
            }
            
            if (this.genderFilter) {
                url += `&gender=${encodeURIComponent(this.genderFilter)}`;
            }
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Помилка запиту: ${response.status}`);
            }
            
            const data = await response.json();
            this.saveToCache(cacheKey, data);
            this.processCharactersData(data);
        } catch (error) {
            this.showError(error.message);
            this.characterContainer.innerHTML = '';
        } finally {
            this.hideLoader();
        }
    }
    
    processCharactersData(data) {
        this.charactersData = data;
        this.totalPages = data.info.pages;
        this.renderCharacters(data.results);
        this.updatePagination();
        this.saveToLocalStorage();
    }
    
    renderCharacters(characters) {
        this.characterContainer.innerHTML = '';
        
        if (characters.length === 0) {
            this.showError('Персонажів не знайдено. Спробуйте змінити параметри пошуку.');
            return;
        }
        
        characters.forEach(character => {
            const characterCard = this.createCharacterCard(character);
            this.characterContainer.appendChild(characterCard);
        });
    }
    
    createCharacterCard(character) {
        const template = this.characterTemplate.content.cloneNode(true);
        
        const characterImg = template.querySelector('.character-image img');
        characterImg.src = character.image;
        characterImg.alt = character.name;
        
        template.querySelector('.character-name').textContent = character.name;
        
        const statusIndicator = template.querySelector('.status-indicator');
        statusIndicator.classList.add(`status-${character.status.toLowerCase()}`);
        
        template.querySelector('.status-text').textContent = this.translateStatus(character.status);
        template.querySelector('.species-text').textContent = character.species;
        template.querySelector('.location-text').textContent = character.location.name;
        template.querySelector('.origin-text').textContent = character.origin.name;
        template.querySelector('.gender-text').textContent = this.translateGender(character.gender);
        
        return template;
    }
    
    translateStatus(status) {
        const statusMap = {
            'Alive': 'Живий',
            'Dead': 'Мертвий',
            'unknown': 'Невідомо'
        };
        
        return statusMap[status] || status;
    }
    
    translateGender(gender) {
        const genderMap = {
            'Male': 'Чоловіча',
            'Female': 'Жіноча',
            'Genderless': 'Безстатеві',
            'unknown': 'Невідомо'
        };
        
        return genderMap[gender] || gender;
    }
    
    updatePagination() {
        this.currentPageElement.textContent = `Сторінка ${this.currentPage} з ${this.totalPages}`;
        this.prevPageBtn.disabled = this.currentPage <= 1;
        this.nextPageBtn.disabled = this.currentPage >= this.totalPages;
    }
    
    changePage(newPage) {
        if (newPage < 1 || newPage > this.totalPages) {
            return;
        }
        
        this.currentPage = newPage;
        this.fetchCharacters();
    }
    
    resetPage() {
        this.currentPage = 1;
    }
    
    showLoader() {
        this.isLoading = true;
        this.loaderElement.classList.remove('hidden');
    }
    
    hideLoader() {
        this.isLoading = false;
        this.loaderElement.classList.add('hidden');
    }
    
    showError(message) {
        this.errorContainer.textContent = message;
        this.errorContainer.style.display = 'block';
    }
    
    hideError() {
        this.errorContainer.style.display = 'none';
    }
    
    getCacheKey() {
        return `rm_${this.currentPage}_${this.searchTerm}_${this.statusFilter}_${this.genderFilter}`;
    }
    
    getFromCache(key) {
        const cachedItem = localStorage.getItem(key);
        if (!cachedItem) return null;
        
        try {
            const { data, timestamp } = JSON.parse(cachedItem);
            
            const cacheLifespan = 30 * 60 * 1000; // 30 хвилин у мілісекундах
            if (Date.now() - timestamp > cacheLifespan) {
                localStorage.removeItem(key);
                return null;
            }
            
            return data;
        } catch (error) {
            localStorage.removeItem(key);
            return null;
        }
    }
    
    saveToCache(key, data) {
        const cacheData = {
            data,
            timestamp: Date.now()
        };
        
        try {
            localStorage.setItem(key, JSON.stringify(cacheData));
            this.cleanCache();
        } catch (error) {
            console.warn('Помилка збереження в локальне сховище:', error);
        }
    }
    
    cleanCache() {
        const maxCacheItems = 20;
        const keys = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('rm_')) {
                keys.push(key);
            }
        }
        
        if (keys.length > maxCacheItems) {
            keys.sort((a, b) => {
                const aData = JSON.parse(localStorage.getItem(a));
                const bData = JSON.parse(localStorage.getItem(b));
                return aData.timestamp - bData.timestamp;
            });
            
            const keysToRemove = keys.slice(0, keys.length - maxCacheItems);
            keysToRemove.forEach(key => localStorage.removeItem(key));
        }
    }
    
    saveToLocalStorage() {
        const appState = {
            currentPage: this.currentPage,
            searchTerm: this.searchTerm,
            statusFilter: this.statusFilter,
            genderFilter: this.genderFilter
        };
        
        try {
            localStorage.setItem('rickAndMortyAppState', JSON.stringify(appState));
        } catch (error) {
            console.warn('Помилка збереження стану додатку:', error);
        }
    }
    
    loadFromLocalStorage() {
        try {
            const savedState = localStorage.getItem('rickAndMortyAppState');
            if (savedState) {
                const state = JSON.parse(savedState);
                this.currentPage = state.currentPage || 1;
                this.searchTerm = state.searchTerm || '';
                this.statusFilter = state.statusFilter || '';
                this.genderFilter = state.genderFilter || '';
                
                if (this.searchTerm) {
                    this.searchInput.value = this.searchTerm;
                }
                
                if (this.statusFilter) {
                    this.statusFilterSelect.value = this.statusFilter;
                }
                
                if (this.genderFilter) {
                    this.genderFilterSelect.value = this.genderFilter;
                }
            }
        } catch (error) {
            console.warn('Помилка завантаження стану додатку:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RickAndMortyApp();
}); 