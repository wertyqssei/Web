document.addEventListener('DOMContentLoaded', function() {
    console.log('🖼️ Лабораторна робота №8: Оптимізація зображень');
    
    // Lazy loading з IntersectionObserver
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                observer.unobserve(img);
                
                console.log(`✅ Зображення завантажено: ${img.alt}`);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
    
    // Плавна анімація секцій
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        sectionObserver.observe(section);
    });
      // Статистика завантаження
    setTimeout(() => {
        const totalImages = document.querySelectorAll('img').length;
        const loadedImages = document.querySelectorAll('img:not([data-src])').length;
        console.log(`📊 Статистика: ${loadedImages}/${totalImages} зображень завантажено`);
    }, 3000);
    
    // Анімація прогрес-барів у статистиці
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.progress-fill');
                progressBars.forEach((bar, index) => {
                    setTimeout(() => {
                        bar.style.width = bar.style.width || (bar.closest('.before') ? '85%' : '25%');
                    }, index * 200);
                });
                
                // Анімація цифр покращення
                const improvementValue = entry.target.querySelector('.improvement-value');
                if (improvementValue) {
                    setTimeout(() => {
                        animateNumber(improvementValue, 0, 74, 2000);
                    }, 800);
                }
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // Функція анімації чисел
    function animateNumber(element, start, end, duration) {
        const range = end - start;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (range * easeOut));
            
            element.textContent = current + '%';
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
});
