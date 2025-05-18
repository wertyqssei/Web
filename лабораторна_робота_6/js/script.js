document.addEventListener('DOMContentLoaded', function() {
    class FilterSystem {
        constructor(data) {
            this.allData = data;
            this.filteredData = [...data];
            this.filters = {
                search: '',
                categories: [],
                price: {
                    min: null,
                    max: null
                },
                rating: null,
                inStock: true
            };
            this.sortType = 'name-asc';
            
            this.initUI();
            this.setupEventListeners();
            this.renderProducts();
            this.generateCategoryFilters();
        }
        
        initUI() {
            this.productsContainer = document.getElementById('products-container');
            this.noResultsEl = document.getElementById('no-results');
            this.searchInput = document.getElementById('search-input');
            this.searchButton = document.getElementById('search-button');
            this.categoryFiltersContainer = document.getElementById('category-filters');
            this.minPriceInput = document.getElementById('min-price');
            this.maxPriceInput = document.getElementById('max-price');
            this.applyPriceButton = document.getElementById('apply-price');
            this.inStockCheckbox = document.getElementById('in-stock');
            this.ratingFilters = document.querySelectorAll('#rating-filters input');
            this.resetFiltersButton = document.getElementById('reset-filters');
            this.sortSelect = document.getElementById('sort-select');
            this.activeFiltersContainer = document.getElementById('active-filters');
        }
        
        setupEventListeners() {
            this.searchButton.addEventListener('click', () => {
                this.setFilter('search', this.searchInput.value.trim());
            });
            
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.setFilter('search', this.searchInput.value.trim());
                }
            });
            
            this.applyPriceButton.addEventListener('click', () => {
                const minPrice = this.minPriceInput.value ? parseInt(this.minPriceInput.value) : null;
                const maxPrice = this.maxPriceInput.value ? parseInt(this.maxPriceInput.value) : null;
                
                this.setFilter('price', { min: minPrice, max: maxPrice });
            });
            
            this.inStockCheckbox.addEventListener('change', () => {
                this.setFilter('inStock', this.inStockCheckbox.checked);
            });
            
            this.ratingFilters.forEach(radioBtn => {
                radioBtn.addEventListener('change', () => {
                    const rating = radioBtn.checked ? parseInt(radioBtn.value) : null;
                    this.setFilter('rating', rating);
                });
            });
            
            this.resetFiltersButton.addEventListener('click', () => {
                this.resetFilters();
            });
            
            this.sortSelect.addEventListener('change', () => {
                this.setSortType(this.sortSelect.value);
            });
            
            window.addEventListener('beforeunload', () => {
                this.saveFiltersToLocalStorage();
            });
            
            this.loadFiltersFromLocalStorage();
        }
        
        generateCategoryFilters() {
            const categories = [...new Set(this.allData.map(item => item.category))];
            
            categories.forEach(category => {
                const filterOption = document.createElement('div');
                filterOption.className = 'filter-option';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `category-${category.toLowerCase().replace(/\s+/g, '-')}`;
                checkbox.value = category;
                
                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.textContent = category;
                
                checkbox.addEventListener('change', () => {
                    const selectedCategories = Array.from(this.categoryFiltersContainer.querySelectorAll('input:checked'))
                        .map(input => input.value);
                    
                    this.setFilter('categories', selectedCategories);
                });
                
                filterOption.appendChild(checkbox);
                filterOption.appendChild(label);
                this.categoryFiltersContainer.appendChild(filterOption);
            });
        }
        
        setFilter(filterType, value) {
            this.filters[filterType] = value;
            this.applyFilters();
            this.updateActiveFilters();
        }
        
        setSortType(sortType) {
            this.sortType = sortType;
            this.applyFilters();
        }
        
        applyFilters() {
            this.filteredData = this.allData.filter(item => {
                if (this.filters.search && !item.name.toLowerCase().includes(this.filters.search.toLowerCase())) {
                    return false;
                }
                
                if (this.filters.categories.length > 0 && !this.filters.categories.includes(item.category)) {
                    return false;
                }
                
                if (this.filters.price.min && item.price < this.filters.price.min) {
                    return false;
                }
                
                if (this.filters.price.max && item.price > this.filters.price.max) {
                    return false;
                }
                
                if (this.filters.rating && item.rating < this.filters.rating) {
                    return false;
                }
                
                if (this.filters.inStock && !item.inStock) {
                    return false;
                }
                
                return true;
            });
            
            this.sortData();
            
            this.renderProducts();
        }
        
        sortData() {
            switch (this.sortType) {
                case 'name-asc':
                    this.filteredData.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name-desc':
                    this.filteredData.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                case 'price-asc':
                    this.filteredData.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    this.filteredData.sort((a, b) => b.price - a.price);
                    break;
                case 'rating-desc':
                    this.filteredData.sort((a, b) => b.rating - a.rating);
                    break;
            }
        }
        
        renderProducts() {
            this.productsContainer.innerHTML = '';
            
            if (this.filteredData.length === 0) {
                this.noResultsEl.style.display = 'block';
                return;
            } else {
                this.noResultsEl.style.display = 'none';
            }
            
            this.filteredData.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                
                productCard.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-details">
                        <div class="product-title">${product.name}</div>
                        <div class="product-category">${product.category}</div>
                        <div class="product-rating">${this.generateRatingStars(product.rating)}</div>
                        <div class="product-price">
                            <div class="price">${product.price} грн</div>
                            <div class="stock-status ${product.inStock ? '' : 'out-of-stock'}">
                                ${product.inStock ? 'В наявності' : 'Немає в наявності'}
                            </div>
                        </div>
                    </div>
                `;
                
                this.productsContainer.appendChild(productCard);
            });
        }
        
        generateRatingStars(rating) {
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 >= 0.5;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
            
            let starsHTML = '';
            
            for (let i = 0; i < fullStars; i++) {
                starsHTML += '★';
            }
            
            if (hasHalfStar) {
                starsHTML += '★';
            }
            
            for (let i = 0; i < emptyStars; i++) {
                starsHTML += '☆';
            }
            
            return starsHTML;
        }
        
        updateActiveFilters() {
            this.activeFiltersContainer.innerHTML = '';
            
            if (this.filters.search) {
                this.addActiveFilter('Пошук: ' + this.filters.search, () => {
                    this.searchInput.value = '';
                    this.setFilter('search', '');
                });
            }
            
            if (this.filters.categories.length > 0) {
                this.filters.categories.forEach(category => {
                    this.addActiveFilter('Категорія: ' + category, () => {
                        const checkbox = document.getElementById(`category-${category.toLowerCase().replace(/\s+/g, '-')}`);
                        if (checkbox) {
                            checkbox.checked = false;
                        }
                        
                        const newCategories = this.filters.categories.filter(c => c !== category);
                        this.setFilter('categories', newCategories);
                    });
                });
            }
            
            if (this.filters.price.min || this.filters.price.max) {
                let priceText = 'Ціна: ';
                if (this.filters.price.min) {
                    priceText += `від ${this.filters.price.min} грн`;
                }
                if (this.filters.price.min && this.filters.price.max) {
                    priceText += ' ';
                }
                if (this.filters.price.max) {
                    priceText += `до ${this.filters.price.max} грн`;
                }
                
                this.addActiveFilter(priceText, () => {
                    this.minPriceInput.value = '';
                    this.maxPriceInput.value = '';
                    this.setFilter('price', { min: null, max: null });
                });
            }
            
            if (this.filters.rating) {
                this.addActiveFilter(`Рейтинг: ${this.filters.rating}★ і вище`, () => {
                    this.ratingFilters.forEach(radio => {
                        radio.checked = false;
                    });
                    this.setFilter('rating', null);
                });
            }
            
            if (this.filters.inStock) {
                this.addActiveFilter('Тільки в наявності', () => {
                    this.inStockCheckbox.checked = false;
                    this.setFilter('inStock', false);
                });
            }
        }
        
        addActiveFilter(text, removeCallback) {
            const filterTag = document.createElement('div');
            filterTag.className = 'active-filter';
            
            filterTag.innerHTML = `
                ${text}
                <button>✕</button>
            `;
            
            filterTag.querySelector('button').addEventListener('click', removeCallback);
            
            this.activeFiltersContainer.appendChild(filterTag);
        }
        
        resetFilters() {
            this.searchInput.value = '';
            this.minPriceInput.value = '';
            this.maxPriceInput.value = '';
            this.inStockCheckbox.checked = true;
            
            this.ratingFilters.forEach(radio => {
                radio.checked = false;
            });
            
            const categoryCheckboxes = this.categoryFiltersContainer.querySelectorAll('input');
            categoryCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            
            this.filters = {
                search: '',
                categories: [],
                price: {
                    min: null,
                    max: null
                },
                rating: null,
                inStock: true
            };
            
            this.applyFilters();
            this.updateActiveFilters();
        }
        
        saveFiltersToLocalStorage() {
            localStorage.setItem('filters', JSON.stringify(this.filters));
            localStorage.setItem('sortType', this.sortType);
        }
        
        loadFiltersFromLocalStorage() {
            const savedFilters = localStorage.getItem('filters');
            const savedSortType = localStorage.getItem('sortType');
            
            if (savedFilters) {
                this.filters = JSON.parse(savedFilters);
                
                this.searchInput.value = this.filters.search;
                this.minPriceInput.value = this.filters.price.min || '';
                this.maxPriceInput.value = this.filters.price.max || '';
                this.inStockCheckbox.checked = this.filters.inStock;
                
                this.filters.categories.forEach(category => {
                    const checkbox = document.getElementById(`category-${category.toLowerCase().replace(/\s+/g, '-')}`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });
                
                if (this.filters.rating) {
                    const ratingRadio = document.getElementById(`rating-${this.filters.rating}`);
                    if (ratingRadio) {
                        ratingRadio.checked = true;
                    }
                }
                
                this.updateActiveFilters();
            }
            
            if (savedSortType) {
                this.sortType = savedSortType;
                this.sortSelect.value = savedSortType;
            }
            
            this.applyFilters();
        }
    }
    
    const filterSystem = new FilterSystem(products);
}); 