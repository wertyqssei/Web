function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Демонстрація завантаження контенту
function loadHeavyContent(buttonId, targetId) {
    const button = document.getElementById(buttonId);
    const target = document.getElementById(targetId);
    
    if (button && target) {
        button.addEventListener('click', () => {
            button.disabled = true;
            button.textContent = 'Завантажується...';
            
            setTimeout(() => {
                target.innerHTML = '<p>✅ Важкий контент завантажено!</p>';
                button.textContent = 'Завантажено';
            }, 2000);
        });
    }
}

// Ініціалізація
document.addEventListener('DOMContentLoaded', () => {
    initLazyLoading();
    loadHeavyContent('load-demo-btn', 'heavy-content-target');
    loadHeavyContent('load-images-btn', 'image-loading-target');
    loadHeavyContent('load-modules-btn', 'module-loading-target');
});

console.log('Lazy loading JS loaded');
