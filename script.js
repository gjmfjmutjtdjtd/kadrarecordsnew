// Переменные для основных элементов
const releaseTitleElem = document.getElementById('release-title');
const releaseCountdownElem = document.getElementById('release-countdown');
const presaveButton = document.getElementById('presave-button');

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

// ======== Функции для таймера релиза ========
function loadSettings() {
    const title = localStorage.getItem('releaseTitle') || 'Релиз через';
    const dateStr = localStorage.getItem('releaseDate');
    releaseTitleElem.textContent = title;

    if(dateStr) {
        updateCountdown(new Date(dateStr));
    } else {
        releaseCountdownElem.textContent = 'Дата не установлена';
    }
}

function updateCountdown(targetDate) {
    if (window.releaseInterval) {
        clearInterval(window.releaseInterval);
    }

    function tick() {
        const now = new Date();
        const diff = targetDate - now;

        if(diff <= 0) {
            releaseCountdownElem.textContent = 'Уже в сети!';
            presaveButton.textContent = 'Слушать';
            presaveButton.classList.remove('disabled');
            presaveButton.href = 'https://example.com/stream-link'; // <-- СЮДА ВСТАВЬТЕ ССЫЛКУ НА РЕЛИЗ
            clearInterval(window.releaseInterval);
            return;
        }

        const days = Math.floor(diff / (1000*60*60*24));
        const hours = Math.floor((diff / (1000*60*60)) % 24);
        const minutes = Math.floor((diff / (1000*60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        releaseCountdownElem.textContent =
            `${days}д ${hours}ч ${minutes}м ${seconds}с`;
        
        // Кнопка остается неактивной до истечения времени
        presaveButton.classList.add('disabled');
        presaveButton.href = 'https://example.com/presave-link'; // <-- СЮДА ВСТАВЬТЕ ССЫЛКУ НА ПРЕДЗАКАЗ
    }
    tick();
    window.releaseInterval = setInterval(tick, 1000);
}

// ======== Функции для формы заявки ========
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        console.log('Данные заявки:', { name, phone });
        formMessage.textContent = 'Отправка...';
        formMessage.style.color = '#fff';
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            formMessage.textContent = 'Спасибо! Ваша заявка успешно отправлена.';
            formMessage.style.color = 'var(--green-light)';
            contactForm.reset();
        } catch (error) {
            formMessage.textContent = 'Произошла ошибка при отправке заявки. Попробуйте ещё раз.';
            formMessage.style.color = '#ff5555';
        }
    });
}

// ======== Логика для промо-баннера ========
(() => {
    const promoBannerBlock = document.getElementById('promo-banner-block');
    if (!promoBannerBlock) return;
    const timerEl = promoBannerBlock.querySelector('.timer');
    const countdownDuration = 1800; // 30 минут в секундах
    let countdownInterval;

    function formatTime(seconds) {
        if (seconds <= 0) return '00:00';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
    }

    function startOrResumeTimer() {
        let endTime = parseInt(localStorage.getItem('promoBannerEndTime'), 10) || 0;
        let lastShownTime = parseInt(localStorage.getItem('promoBannerLastShown'), 10) || 0;
        const now = Date.now();
        
        if (endTime <= now) {
            const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
            if (now - lastShownTime < twoDaysInMs) {
                promoBannerBlock.style.display = 'none';
                return;
            } else {
                endTime = now + countdownDuration * 1000;
                localStorage.setItem('promoBannerEndTime', endTime);
                localStorage.setItem('promoBannerLastShown', now);
            }
        }
        
        promoBannerBlock.style.display = 'flex';

        function tick() {
            const currentTime = Date.now();
            const remaining = Math.floor((endTime - currentTime) / 1000);

            if (remaining < 0) {
                clearInterval(countdownInterval);
                timerEl.textContent = '00:00';
                timerEl.classList.add('inactive');
                promoBannerBlock.style.display = 'none';
                localStorage.setItem('promoBannerLastShown', currentTime);
                return;
            }

            timerEl.textContent = formatTime(remaining);
        }

        tick();
        countdownInterval = setInterval(tick, 1000);
    }
    
    startOrResumeTimer();
})();

// ======== Действия при загрузке страницы ========
window.addEventListener('load', () => {
    loadSettings();
});
document.addEventListener('DOMContentLoaded', () => {
    const releaseCountdown = document.getElementById('release-countdown');
    const presaveButton = document.getElementById('presave-button');
    const releaseTitle = document.getElementById('release-title');

    // Установите дату релиза
    const releaseDate = new Date('August 20, 2025 10:00:00');

    // Получаем ссылку из localStorage
    const releaseLink = localStorage.getItem('releaseTrackLink');

    function updateTimer() {
        const now = new Date();
        const difference = releaseDate - now;

        if (difference <= 0) {
            clearInterval(timerInterval);
            releaseTitle.textContent = 'Релиз!';
            releaseCountdown.textContent = 'Уже здесь!';
            presaveButton.textContent = 'Слушать!';
            presaveButton.href = releaseLink || '#'; // Используем сохраненную ссылку
            presaveButton.classList.remove('disabled');
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        releaseCountdown.textContent = `${days}д ${hours}ч ${minutes}м ${seconds}с`;
    }

    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
});