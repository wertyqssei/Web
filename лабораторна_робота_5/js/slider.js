class ImageSlider {
    constructor() {
        // Ініціалізація слайдера
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.autoplayBtn = document.getElementById('autoplayBtn');
        this.sliderCounter = document.getElementById('sliderCounter');
        this.progressBar = document.getElementById('progress');
        this.totalSlides = this.slides.length;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000; // 5 секунд
        this.isPlaying = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }
    
    init() {
        // Встановлення обробників подій
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.autoplayBtn.addEventListener('click', () => this.toggleAutoplay());
        
        // Додання обробників для навігаційних точок
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Додання обробників для свайпів
        const slider = document.querySelector('.slider-container');
        slider.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        slider.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Оновлення лічильника слайдів
        this.updateCounter();
    }
    
    // Метод для переходу до наступного слайда
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSliderPosition();
    }
    
    // Метод для переходу до попереднього слайда
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSliderPosition();
    }
    
    // Метод для переходу до конкретного слайда
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSliderPosition();
    }
    
    // Оновлення позиції слайдера
    updateSliderPosition() {
        const slidesContainer = document.querySelector('.slides');
        const offset = -this.currentSlide * 100;
        slidesContainer.style.transform = `translateX(${offset}%)`;
        
        // Оновлення активних точок
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
        
        // Оновлення лічильника
        this.updateCounter();
        
        // Скидання прогресу
        this.resetProgress();
    }
    
    // Оновлення лічильника слайдів
    updateCounter() {
        this.sliderCounter.textContent = `${this.currentSlide + 1} / ${this.totalSlides}`;
    }
    
    // Увімкнення/вимкнення автопрогравання
    toggleAutoplay() {
        if (this.isPlaying) {
            this.stopAutoplay();
            this.autoplayBtn.textContent = '▶';
        } else {
            this.startAutoplay();
            this.autoplayBtn.textContent = '❚❚';
        }
        this.isPlaying = !this.isPlaying;
    }
    
    // Запуск автопрогравання
    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplayDelay);
        
        // Запуск анімації прогресу
        this.animateProgress();
    }
    
    // Зупинка автопрогравання
    stopAutoplay() {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
        this.resetProgress();
    }
    
    // Анімація прогресу
    animateProgress() {
        let start = 0;
        const duration = this.autoplayDelay;
        const progressInterval = 50; // Оновлення кожні 50мс
        const steps = duration / progressInterval;
        const increment = 100 / steps;
        
        const progressAnimation = setInterval(() => {
            start += increment;
            this.progressBar.style.width = `${start}%`;
            
            if (start >= 100) {
                clearInterval(progressAnimation);
            }
        }, progressInterval);
    }
    
    // Скидання прогресу
    resetProgress() {
        this.progressBar.style.width = '0%';
        if (this.isPlaying) {
            this.animateProgress();
        }
    }
    
    // Обробка свайпу (початок)
    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }
    
    // Обробка свайпу (кінець)
    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }
    
    // Визначення напрямку свайпу
    handleSwipe() {
        const swipeThreshold = 75; // Мінімальна відстань для визначення свайпу
        const swipeDistance = this.touchStartX - this.touchEndX;
        
        if (swipeDistance > swipeThreshold) {
            // Свайп вліво - наступний слайд
            this.nextSlide();
        } else if (swipeDistance < -swipeThreshold) {
            // Свайп вправо - попередній слайд
            this.prevSlide();
        }
    }
}

// Ініціалізація слайдера при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    const slider = new ImageSlider();
}); 