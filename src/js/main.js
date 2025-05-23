//1 . Модуль элементов HTML
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('pass');
    const togglePassword = document.getElementById('tpass'); 
    const strengthBar = document.getElementById('sb');
    const strengthText = document.getElementById('st');
    const generateBtn = document.getElementById('g-3');
    const copyBtn = document.getElementById('cbtn');
    const tooltip = document.getElementById('too');

    //2. Модуль управления паролем
    // Элементы требований
    const requirements = {
        length: document.getElementById('l-r'),
        lower: document.getElementById('lr'),
        upper: document.getElementById('ur'),
        number: document.getElementById('nr'), 
        special: document.getElementById('sr')
    };
    
    // Переключение видимости пароля
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' 
            ? '<i class="far fa-eye"></i>' 
            : '<i class="far fa-eye-slash"></i>';
    });
    
    // Проверка пароля при вводе
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const result = checkPasswordStrength(password);
        updateStrengthIndicator(result.strength);
        updateRequirements(result.checks);
    });
    
    // Генерация пароля
    generateBtn.addEventListener('click', function() {
        const password = generateStrongPassword();
        passwordInput.value = password;
        passwordInput.dispatchEvent(new Event('input'));
    });
    
    // Копирование пароля
    copyBtn.addEventListener('click', function() {
        if (passwordInput.value) {
            passwordInput.select();
            document.execCommand('copy');
            
            // Показываем подсказку
            tooltip.classList.add('show');
            setTimeout(() => {
                tooltip.classList.remove('show');
            }, 2000);
            
        }
    });
    
    // Проверка сложности пароля
    function checkPasswordStrength(password) {
        const checks = {
            length: password.length >= 8,
            lower: /[a-z]/.test(password),
            upper: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*]/.test(password)
        };
        
        let strength = 0;
        
        // За длину (максимум 50 баллов)
        strength += Math.min(password.length * 5, 50);
        
        // За разнообразие символов
        const fulfilledChecks = Object.values(checks).filter(Boolean).length;
        strength += fulfilledChecks * 10;
        
        // Штраф за повторяющиеся символы
        if (/(.)\1\1/.test(password)) {
            strength -= 20;
        }
        
        // Проверка на слабые пароли
        const weakPasswords = ['123456', 'password', 'qwerty', '111111'];
        if (weakPasswords.includes(password.toLowerCase())) {
            strength = Math.min(strength, 20);
        }
        
        return {
            strength: Math.max(0, Math.min(100, strength)),
            checks
        };
    }
});