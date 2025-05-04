class Validator {
    constructor(form) {
        this.form = form;
        this.errors = {};
    }

    isNotEmpty(value) {
        return value.trim() !== '';
    }

    hasMinLength(value, minLength) {
        return value.length >= minLength;
    }

    matchesPattern(value, pattern) {
        return pattern.test(value);
    }

    isValidEmail(value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return this.matchesPattern(value, emailPattern);
    }

    isValidPhone(value) {
        const phonePattern = /^\+380\d{9}$/;
        return this.matchesPattern(value, phonePattern);
    }

    checkPasswordStrength(password) {
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            digit: /\d/.test(password),
            special: /[!@#$%^&*]/.test(password)
        };
        
        const passedChecks = Object.values(checks).filter(check => check).length;
        
        let strength = '';
        if (passedChecks <= 2) {
            strength = 'weak';
        } else if (passedChecks === 3) {
            strength = 'medium';
        } else if (passedChecks === 4) {
            strength = 'strong';
        } else {
            strength = 'very-strong';
        }
        
        return {
            checks,
            strength
        };
    }

    doPasswordsMatch(password, confirmPassword) {
        return password === confirmPassword;
    }

    isAdult(birthdate) {
        const today = new Date();
        const birth = new Date(birthdate);
        
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age >= 18;
    }

    validateForm() {
        const username = this.form.username.value;
        const email = this.form.email.value;
        const password = this.form.password.value;
        const confirmPassword = this.form.confirmPassword.value;
        const phone = this.form.phone.value;
        const birthdate = this.form.birthdate.value;
        const terms = this.form.terms.checked;
        
        this.errors = {};
        
        if (!this.isNotEmpty(username)) {
            this.errors.username = "Ім'я користувача є обов'язковим";
        } else if (!this.hasMinLength(username, 3)) {
            this.errors.username = "Ім'я користувача повинно містити не менше 3 символів";
        }
        
        if (!this.isNotEmpty(email)) {
            this.errors.email = "Email є обов'язковим";
        } else if (!this.isValidEmail(email)) {
            this.errors.email = "Введіть коректний email";
        }
        
        if (!this.isNotEmpty(password)) {
            this.errors.password = "Пароль є обов'язковим";
        } else {
            const passwordResults = this.checkPasswordStrength(password);
            if (!passwordResults.checks.length) {
                this.errors.password = "Пароль повинен містити не менше 8 символів";
            } else if (!(passwordResults.checks.lowercase && passwordResults.checks.uppercase && passwordResults.checks.digit)) {
                this.errors.password = "Пароль повинен містити великі та малі літери, а також цифри";
            }
        }
        
        if (!this.isNotEmpty(confirmPassword)) {
            this.errors.confirmPassword = "Підтвердження паролю є обов'язковим";
        } else if (!this.doPasswordsMatch(password, confirmPassword)) {
            this.errors.confirmPassword = "Паролі не збігаються";
        }
        
        if (!this.isNotEmpty(phone)) {
            this.errors.phone = "Телефон є обов'язковим";
        } else if (!this.isValidPhone(phone)) {
            this.errors.phone = "Введіть коректний номер телефону (+380XXXXXXXXX)";
        }
        
        if (!this.isNotEmpty(birthdate)) {
            this.errors.birthdate = "Дата народження є обов'язковою";
        } else if (!this.isAdult(birthdate)) {
            this.errors.birthdate = "Вам має бути не менше 18 років";
        }
        
        if (!terms) {
            this.errors.terms = "Ви повинні погодитись з умовами";
        }
        
        return Object.keys(this.errors).length === 0;
    }

    getErrors() {
        return this.errors;
    }
}