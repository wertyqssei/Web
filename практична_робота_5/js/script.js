document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const phoneInput = document.getElementById('phone');
    const birthdateInput = document.getElementById('birthdate');
    const termsCheckbox = document.getElementById('terms');
    const submitButton = document.getElementById('submit-button');
    const successMessage = document.getElementById('success-message');
    
    const passwordStrengthMeter = document.getElementById('password-strength-meter');
    const passwordStrengthText = document.getElementById('password-strength-text');
    
    usernameInput.addEventListener('input', function() {
        validateUsername();
        checkFormValidity();
    });
    
    emailInput.addEventListener('input', function() {
        validateEmail();
        checkFormValidity();
    });
    
    passwordInput.addEventListener('input', function() {
        validatePassword();
        if (confirmPasswordInput.value.length > 0) {
            validateConfirmPassword();
        }
        checkFormValidity();
    });
    
    confirmPasswordInput.addEventListener('input', function() {
        validateConfirmPassword();
        checkFormValidity();
    });
    
    phoneInput.addEventListener('input', function() {
        validatePhone();
        checkFormValidity();
    });
    
    birthdateInput.addEventListener('change', function() {
        validateBirthdate();
        checkFormValidity();
    });
    
    termsCheckbox.addEventListener('change', function() {
        validateTerms();
        checkFormValidity();
    });
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const isUsernameValid = validateUsername();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isPhoneValid = validatePhone();
        const isBirthdateValid = validateBirthdate();
        const isTermsChecked = validateTerms();
        
        if (isUsernameValid && isEmailValid && isPasswordValid && 
            isConfirmPasswordValid && isPhoneValid && isBirthdateValid && isTermsChecked) {
            
            form.reset();
            
            successMessage.style.display = 'block';
        }
    });
    
    function validateUsername() {
        const username = usernameInput.value.trim();
        const usernameGroup = usernameInput.closest('.form-group');
        const usernameError = document.getElementById('username-error');
        
        usernameGroup.classList.remove('has-error', 'has-success');
        
        if (username.length < 3 || username.length > 20) {
            usernameGroup.classList.add('has-error');
            usernameError.textContent = 'Ім\'я повинно містити від 3 до 20 символів';
            return false;
        }
        
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            usernameGroup.classList.add('has-error');
            usernameError.textContent = 'Ім\'я може містити лише латинські букви, цифри, _ та -';
            return false;
        }
        
        usernameGroup.classList.add('has-success');
        return true;
    }
    
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailGroup = emailInput.closest('.form-group');
        const emailError = document.getElementById('email-error');
        
        emailGroup.classList.remove('has-error', 'has-success');
        
        if (email.length === 0) {
            emailGroup.classList.add('has-error');
            emailError.textContent = 'Введіть email адресу';
            return false;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailGroup.classList.add('has-error');
            emailError.textContent = 'Введіть коректну email адресу';
            return false;
        }
        
        emailGroup.classList.add('has-success');
        return true;
    }
    
    function validatePassword() {
        const password = passwordInput.value;
        const passwordGroup = passwordInput.closest('.form-group');
        const passwordError = document.getElementById('password-error');
        
        passwordGroup.classList.remove('has-error', 'has-success');
        passwordStrengthMeter.className = 'password-strength-meter';
        
        if (password.length === 0) {
            passwordStrengthText.textContent = 'Надійність пароля';
            passwordGroup.classList.add('has-error');
            passwordError.textContent = 'Введіть пароль';
            return false;
        }
        
        if (password.length < 8) {
            passwordStrengthMeter.classList.add('strength-weak');
            passwordStrengthText.textContent = 'Слабкий пароль';
            passwordGroup.classList.add('has-error');
            passwordError.textContent = 'Пароль повинен містити не менше 8 символів';
            return false;
        }
        
        const hasLowerCase = /[a-z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        const strength = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecial].filter(Boolean).length;
        
        if (strength === 1) {
            passwordStrengthMeter.classList.add('strength-weak');
            passwordStrengthText.textContent = 'Слабкий пароль';
            passwordGroup.classList.add('has-error');
            passwordError.textContent = 'Пароль повинен містити великі літери, малі літери, цифри та спеціальні символи';
            return false;
        } else if (strength === 2) {
            passwordStrengthMeter.classList.add('strength-weak');
            passwordStrengthText.textContent = 'Слабкий пароль';
            passwordGroup.classList.add('has-error');
            passwordError.textContent = 'Пароль повинен містити більше різних типів символів';
            return false;
        } else if (strength === 3) {
            passwordStrengthMeter.classList.add('strength-medium');
            passwordStrengthText.textContent = 'Середній пароль';
            passwordGroup.classList.add('has-success');
            return true;
        } else {
            passwordStrengthMeter.classList.add('strength-strong');
            passwordStrengthText.textContent = 'Надійний пароль';
            passwordGroup.classList.add('has-success');
            return true;
        }
    }
    
    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const confirmPasswordGroup = confirmPasswordInput.closest('.form-group');
        const confirmPasswordError = document.getElementById('confirm-password-error');
        
        confirmPasswordGroup.classList.remove('has-error', 'has-success');
        
        if (confirmPassword.length === 0) {
            confirmPasswordGroup.classList.add('has-error');
            confirmPasswordError.textContent = 'Підтвердіть пароль';
            return false;
        }
        
        if (password !== confirmPassword) {
            confirmPasswordGroup.classList.add('has-error');
            confirmPasswordError.textContent = 'Паролі не співпадають';
            return false;
        }
        
        confirmPasswordGroup.classList.add('has-success');
        return true;
    }
    
    function validatePhone() {
        const phone = phoneInput.value.trim();
        const phoneGroup = phoneInput.closest('.form-group');
        const phoneError = document.getElementById('phone-error');
        
        phoneGroup.classList.remove('has-error', 'has-success');
        
        if (!/^\+?\d{10,13}$/.test(phone)) {
            phoneGroup.classList.add('has-error');
            phoneError.textContent = 'Введіть коректний номер телефону';
            return false;
        }
        
        phoneGroup.classList.add('has-success');
        return true;
    }
    
    function validateBirthdate() {
        const birthdate = birthdateInput.value;
        const birthdateGroup = birthdateInput.closest('.form-group');
        const birthdateError = document.getElementById('birthdate-error');
        
        birthdateGroup.classList.remove('has-error', 'has-success');
        
        if (!birthdate) {
            birthdateGroup.classList.add('has-error');
            birthdateError.textContent = 'Виберіть дату народження';
            return false;
        }
        
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        if (age < 18) {
            birthdateGroup.classList.add('has-error');
            birthdateError.textContent = 'Ви повинні бути старше 18 років';
            return false;
        }
        
        birthdateGroup.classList.add('has-success');
        return true;
    }
    
    function validateTerms() {
        const isChecked = termsCheckbox.checked;
        const termsGroup = termsCheckbox.closest('.form-group');
        const termsError = document.getElementById('terms-error');
        
        termsGroup.classList.remove('has-error', 'has-success');
        
        if (!isChecked) {
            termsGroup.classList.add('has-error');
            termsError.textContent = 'Ви повинні погодитись з умовами';
            return false;
        }
        
        termsGroup.classList.add('has-success');
        return true;
    }
    
    function checkFormValidity() {
        const isUsernameValid = validateUsername();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isPhoneValid = validatePhone();
        const isBirthdateValid = validateBirthdate();
        const isTermsChecked = validateTerms();
        
        if (isUsernameValid && isEmailValid && isPasswordValid && 
            isConfirmPasswordValid && isPhoneValid && isBirthdateValid && isTermsChecked) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    }
});