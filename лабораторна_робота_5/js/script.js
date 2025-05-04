document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const passwordInput = document.getElementById('password');
    const strengthIndicator = document.querySelector('.strength-indicator');
    const strengthText = document.querySelector('.strength-text');
    const requirementItems = {
        length: document.getElementById('req-length'),
        lowercase: document.getElementById('req-lowercase'),
        uppercase: document.getElementById('req-uppercase'),
        digit: document.getElementById('req-digit'),
        special: document.getElementById('req-special')
    };
    const notification = document.getElementById('notification');
    
    const validator = new Validator(form);
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const { checks, strength } = validator.checkPasswordStrength(password);
        
        strengthIndicator.className = 'strength-indicator';
        if (strength) {
            strengthIndicator.classList.add(strength);
        }
        
        switch (strength) {
            case 'weak':
                strengthText.textContent = 'Слабкий пароль';
                break;
            case 'medium':
                strengthText.textContent = 'Середній пароль';
                break;
            case 'strong':
                strengthText.textContent = 'Надійний пароль';
                break;
            case 'very-strong':
                strengthText.textContent = 'Дуже надійний пароль';
                break;
            default:
                strengthText.textContent = 'Надійність паролю';
        }
        
        for (const [requirement, element] of Object.entries(requirementItems)) {
            if (checks[requirement]) {
                element.classList.add('valid');
            } else {
                element.classList.remove('valid');
            }
        }
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        clearErrors();
        
        if (validator.validateForm()) {
            showNotification('Реєстрація успішна! Дякуємо за реєстрацію.', false);
            
            form.reset();
            
            strengthIndicator.className = 'strength-indicator';
            strengthText.textContent = 'Надійність паролю';
            
            for (const element of Object.values(requirementItems)) {
                element.classList.remove('valid');
            }
        } else {
            showErrors(validator.getErrors());
        }
    });
    
    function clearErrors() {
        const errorElements = form.querySelectorAll('.error');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
        
        const formGroups = form.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('has-error');
        });
    }
    
    function showErrors(errors) {
        for (const [field, message] of Object.entries(errors)) {
            const errorElement = document.getElementById(`${field}Error`);
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
                
                const formGroup = errorElement.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.add('has-error');
                }
            }
        }
    }
    
    function showNotification(message, isError = false) {
        notification.textContent = message;
        notification.className = 'notification show';
        
        if (isError) {
            notification.classList.add('error');
        }
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
});