class ImageSlider {
    constructor() {
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
        this.autoplayDelay = 5000;
        this.isPlaying = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }
    
    init() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.autoplayBtn.addEventListener('click', () => this.toggleAutoplay());
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        const slider = document.querySelector('.slider-container');
        slider.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        slider.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        this.updateCounter();
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSliderPosition();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSliderPosition();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSliderPosition();
    }
    
    updateSliderPosition() {
        const slidesContainer = document.querySelector('.slides');
        const offset = -this.currentSlide * 100;
        slidesContainer.style.transform = `translateX(${offset}%)`;
        
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
        
        this.updateCounter();
        
        this.resetProgress();
    }
    
    updateCounter() {
        this.sliderCounter.textContent = `${this.currentSlide + 1} / ${this.totalSlides}`;
    }
    
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
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplayDelay);
        
        this.animateProgress();
    }
    
    stopAutoplay() {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
        this.resetProgress();
    }
    
    animateProgress() {
        let start = 0;
        const duration = this.autoplayDelay;
        const progressInterval = 50; 
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
    
    resetProgress() {
        this.progressBar.style.width = '0%';
        if (this.isPlaying) {
            this.animateProgress();
        }
    }
    
    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }
    
    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }
    
    handleSwipe() {
        const swipeThreshold = 75; // Мінімальна відстань для визначення свайпу
        const swipeDistance = this.touchStartX - this.touchEndX;
        
        if (swipeDistance > swipeThreshold) {
            this.nextSlide();
        } else if (swipeDistance < -swipeThreshold) {
            this.prevSlide();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const slider = new ImageSlider();
}); 