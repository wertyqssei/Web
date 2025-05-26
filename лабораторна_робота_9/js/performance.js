// JavaScript для лабораторної роботи №9

// Моніторинг продуктивності
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        this.updateMetrics();
        this.initTabs();
    }

    updateMetrics() {
        const metrics = {
            'lcp-value': 1800,
            'fid-value': 75,
            'cls-value': '0.045',
            'ttfb-value': 180
        };

        Object.entries(metrics).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = id.includes('cls') ? value : value + 'мс';
            }
        });
    }

    initTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }
}

// Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker зареєстровано'))
        .catch(err => console.error('Помилка SW:', err));
}

// Ініціалізація
document.addEventListener('DOMContentLoaded', () => {
    new PerformanceMonitor();
});

console.log('Performance JS loaded');
