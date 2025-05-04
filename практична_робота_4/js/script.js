const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('open-modal');
const closeModalBtn = document.getElementById('close-modal');
const confirmModalBtn = document.getElementById('confirm-modal');

openModalBtn.addEventListener('click', function() {
    modal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', function() {
    modal.style.display = 'none';
});

confirmModalBtn.addEventListener('click', function() {
    modal.style.display = 'none';
    alert('Підтверджено!');
});

window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

const feedbackForm = document.getElementById('feedback-form');

feedbackForm.addEventListener('submit', function(event) {
    let isValid = true;
    
    const errorFields = document.querySelectorAll('.has-error');
    errorFields.forEach(field => field.classList.remove('has-error'));
    
    const nameInput = document.getElementById('name');
    if (!nameInput.value.trim()) {
        isValid = false;
        nameInput.parentElement.classList.add('has-error');
    }
    
    const emailInput = document.getElementById('email');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value)) {
        isValid = false;
        emailInput.parentElement.classList.add('has-error');
    }
    
    const topicSelect = document.getElementById('topic');
    if (!topicSelect.value) {
        isValid = false;
        topicSelect.parentElement.classList.add('has-error');
    }
    
    const messageTextarea = document.getElementById('message');
    if (!messageTextarea.value.trim()) {
        isValid = false;
        messageTextarea.parentElement.classList.add('has-error');
    }
    
    if (!isValid) {
        event.preventDefault();
    } else {
        event.preventDefault();
        alert('Форма успішно відправлена!');
        feedbackForm.reset();
    }
});

const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');

galleryItems.forEach(item => {
    item.addEventListener('click', function() {
        const imgSrc = this.querySelector('img').src;
        const caption = this.getAttribute('data-caption');
        
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = caption;
        lightbox.style.display = 'flex';
    });
});

lightbox.addEventListener('click', function(event) {
    if (event.target === lightbox) {
        lightbox.style.display = 'none';
    }
});

const dropdownBtn = document.getElementById('dropdown-btn');
const dropdownContent = document.getElementById('dropdown-content');

dropdownBtn.addEventListener('click', function() {
    dropdownContent.classList.toggle('show');
});

window.addEventListener('click', function(event) {
    if (!event.target.matches('#dropdown-btn')) {
        if (dropdownContent.classList.contains('show')) {
            dropdownContent.classList.remove('show');
        }
    }
});

const scrollSection = document.getElementById('scroll-demo');
const scrollToTopBtn = document.getElementById('scroll-to-top');

scrollSection.addEventListener('scroll', function() {
    if (scrollSection.scrollTop > 100) {
        scrollToTopBtn.style.opacity = '1';
    } else {
        scrollToTopBtn.style.opacity = '0';
    }
});

scrollToTopBtn.addEventListener('click', function() {
    scrollToTop();
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}