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

    // 3. Модуль обновления интерфейса 
    // Обновление индикатора сложности
    function updateStrengthIndicator(strength) {
        strengthBar.style.width = `${strength}%`;
        
        if (strength < 40) {
            strengthBar.style.backgroundColor = 'var(--danger)';
            strengthText.textContent = 'Слабый пароль';
            strengthText.style.color = 'var(--danger)';
        } else if (strength < 70) {
            strengthBar.style.backgroundColor = 'var(--warning)';
            strengthText.textContent = 'Средний пароль';
            strengthText.style.color = 'var(--warning)';
        } else {
            strengthBar.style.backgroundColor = 'var(--success)';
            strengthText.textContent = 'Надежный пароль';
            strengthText.style.color = 'var(--success)';
        }
    }
    
    // Обновление отображения требований
    function updateRequirements(checks) {
        for (const [key, isValid] of Object.entries(checks)) {
            const icon = requirements[key].querySelector('i');
            if (isValid) {
                icon.classList.remove('fa-circle', 'far');
                icon.classList.add('fa-check', 'fas', 'valid');
                requirements[key].style.color = 'var(--dark)';
            } else {
                icon.classList.remove('fa-check', 'fas', 'valid');
                icon.classList.add('fa-circle', 'far');
                requirements[key].style.color = '#858796';
            }
        }
    }
    
    //4. Основной модуль 
    // Генерация надежного пароля
    function generateStrongPassword() {
        const length = 12;
        const lowercase = 'abcdefghjkmnpqrstuvwxyz';
        const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        const numbers = '23456789';
        const symbols = '!@#$%^&*';
        
        let charset = '';
        let password = '';
        
        // Добавляем хотя бы по одному символу из каждой категории
        password += getRandomChar(lowercase);
        password += getRandomChar(uppercase);
        password += getRandomChar(numbers);
        password += getRandomChar(symbols);
        
        // Формируем полный набор символов
        charset = lowercase + uppercase + numbers + symbols;
        
        // Добираем остаток пароля
        for (let i = password.length; i < length; i++) {
            password += getRandomChar(charset);
        }
        
        // Перемешиваем символы
        return shuffleString(password);
    }
    
    // Получение случайного символа из строки
    function getRandomChar(string) {
        const randomValues = new Uint32Array(1);
        window.crypto.getRandomValues(randomValues);
        return string[randomValues[0] % string.length];
    }
    
    // Перемешивание строки
    function shuffleString(string) {
        const array = string.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }
});