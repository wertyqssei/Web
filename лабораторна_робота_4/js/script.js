function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.toggle('error', isError);
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function createMenuItems(menuItems, container, level = 0) {
    if (!menuItems || !menuItems.length) return;
    
    const ul = document.createElement('ul');
    ul.className = level === 0 ? 'menu' : 'submenu';
    
    menuItems.forEach(item => {
        const li = document.createElement('li');
        
        const a = document.createElement('a');
        a.href = item.link || '#';
        a.textContent = item.title;
        
        if (item.active) {
            a.classList.add('active');
        }
        
        if (item.submenu && item.submenu.length > 0) {
            a.classList.add('has-submenu');
            a.setAttribute('aria-haspopup', 'true');
            a.setAttribute('aria-expanded', 'false');
        }
        
        li.appendChild(a);
        
        if (item.submenu && item.submenu.length) {
            createMenuItems(item.submenu, li, level + 1);
        }
        
        ul.appendChild(li);
    });
    
    container.appendChild(ul);
}

function openModal() {
    document.getElementById('modal').classList.add('active');
    document.querySelector('.backdrop').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    document.querySelector('.backdrop').classList.remove('active');
    document.body.style.overflow = '';
}

let currentImageIndex = 0;
let totalImages = 0;

function openGallery(index) {
    currentImageIndex = index;
    totalImages = document.querySelectorAll('.gallery-item').length;
    updateGalleryImage();
    document.getElementById('fullscreenGallery').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeGallery() {
    document.getElementById('fullscreenGallery').classList.remove('active');
    document.body.style.overflow = '';
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
    updateGalleryImage();
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % totalImages;
    updateGalleryImage();
}

function updateGalleryImage() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const currentItem = galleryItems[currentImageIndex];
    const image = currentItem.querySelector('img');
    
    const fullscreenImage = document.getElementById('fullscreenImage');
    fullscreenImage.src = image.src;
    fullscreenImage.alt = image.alt;
    
    document.getElementById('galleryCounter').textContent = `${currentImageIndex + 1} / ${totalImages}`;
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function toggleScrollButton() {
    const scrollBtn = document.getElementById('scrollTop');
    
    if (window.scrollY > 300) {
        scrollBtn.classList.add('visible');
    } else {
        scrollBtn.classList.remove('visible');
    }
}

function validateForm(form) {
    let isValid = true;
    const formElements = form.elements;
    
    form.querySelectorAll('.has-error').forEach(el => {
        el.classList.remove('has-error');
    });
    
    for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i];
        
        if (element.required && element.value.trim() === '') {
            const formGroup = element.closest('.form-group');
            formGroup.classList.add('has-error');
            isValid = false;
        }
    }
    
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value.trim() !== '') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value)) {
            const formGroup = emailField.closest('.form-group');
            formGroup.classList.add('has-error');
            isValid = false;
        }
    }
    
    return isValid;
}

function submitForm(e) {
    e.preventDefault();
    
    const form = e.target;
    
    if (validateForm(form)) {
        showNotification('Форма успішно відправлена! Ми зв\'яжемося з вами найближчим часом.');
        form.reset();
    } else {
        showNotification('Будь ласка, перевірте правильність заповнення форми.', true);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const menuContainer = document.getElementById('menuContainer');
    createMenuItems(menuData.items, menuContainer);
    
    const burgerMenu = document.querySelector('.burger-menu');
    const menuWrapper = document.querySelector('.menu-container');
    const backdrop = document.querySelector('.backdrop');
    
    burgerMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        menuWrapper.classList.toggle('active');
        backdrop.classList.toggle('active');
        
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !expanded);
    });
    
    backdrop.addEventListener('click', function() {
        burgerMenu.classList.remove('active');
        menuWrapper.classList.remove('active');
        backdrop.classList.remove('active');
        burgerMenu.setAttribute('aria-expanded', 'false');
        closeModal();
    });
    
    const menuLinks = document.querySelectorAll('.menu a.has-submenu');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                
                const submenu = this.nextElementSibling;
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                const siblingLinks = this.parentElement.parentElement.querySelectorAll('a.has-submenu');
                siblingLinks.forEach(siblingLink => {
                    if (siblingLink !== this) {
                        siblingLink.classList.remove('active');
                        siblingLink.setAttribute('aria-expanded', 'false');
                        
                        if (siblingLink.nextElementSibling) {
                            siblingLink.nextElementSibling.classList.remove('active');
                        }
                    }
                });
                
                this.classList.toggle('active');
                this.setAttribute('aria-expanded', !isExpanded);
                
                if (submenu) {
                    submenu.classList.toggle('active');
                }
            }
        });
    });
    
    const allMenuLinks = document.querySelectorAll('.menu a');
    
    allMenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!(this.classList.contains('has-submenu') && window.innerWidth <= 768)) {
                allMenuLinks.forEach(l => l.classList.remove('active'));
                
                this.classList.add('active');
            }
        });
    });
    
    document.getElementById('openModal').addEventListener('click', openModal);
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelModal').addEventListener('click', closeModal);
    document.getElementById('confirmModal').addEventListener('click', function() {
        closeModal();
        showNotification('Дякуємо за підтвердження!');
    });
    
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            openGallery(index);
        });
    });
    
    document.getElementById('closeGallery').addEventListener('click', closeGallery);
    document.getElementById('prevImage').addEventListener('click', prevImage);
    document.getElementById('nextImage').addEventListener('click', nextImage);
    
    document.addEventListener('keydown', function(e) {
        if (document.getElementById('fullscreenGallery').classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === 'Escape') {
                closeGallery();
            }
        } else if (document.getElementById('modal').classList.contains('active') && e.key === 'Escape') {
            closeModal();
        }
    });
    
    document.getElementById('scrollTop').addEventListener('click', scrollToTop);
    window.addEventListener('scroll', toggleScrollButton);
    toggleScrollButton();
    
    document.getElementById('contactForm').addEventListener('submit', submitForm);
    
    const formInputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.required) {
                const formGroup = this.closest('.form-group');
                
                if (this.value.trim() === '') {
                    formGroup.classList.add('has-error');
                } else {
                    if (this.type === 'email') {
                        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        formGroup.classList.toggle('has-error', !emailPattern.test(this.value));
                    } else {
                        formGroup.classList.remove('has-error');
                    }
                }
            }
        });
    });
});