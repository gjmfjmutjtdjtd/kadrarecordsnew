document.addEventListener('DOMContentLoaded', () => {
    const songItems = document.querySelectorAll('.song-item');
    const playerContainer = document.getElementById('player-container');
    const embedContent = document.getElementById('embed-content');
    const closeBtn = document.querySelector('.close-btn');
    const touchOverlay = document.querySelector('.touch-overlay');

    let startX = 0;
    let isDragging = false;
    let currentDelta = 0;
    let isClosing = false;

    // --- ЛОГИКА СВАЙПА ---
    touchOverlay.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        playerContainer.style.transition = 'none'; // Отключаем анимацию при начале свайпа
        e.preventDefault(); 
        e.stopPropagation();
    });

    touchOverlay.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;
        currentDelta = deltaX;
        
        if (deltaX > 0) {
            playerContainer.style.transform = `translateX(${-100 + (deltaX / window.innerWidth) * 100}%)`;
        }
    });

    touchOverlay.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        playerContainer.style.transition = 'transform 0.3s ease-in-out'; // Включаем анимацию обратно
        
        if (currentDelta > 100) {
            isClosing = true;
            closePlayer();
        } else {
            playerContainer.style.transform = `translateX(-100%)`; // Возвращаем на место
        }
    });

    // --- ЛОГИКА ДЛЯ КЛИКОВ И КНОПОК ---
    songItems.forEach(item => {
        item.addEventListener('click', () => {
            isClosing = false;
            const embedCode = item.dataset.embedCode;
            showPlayer(embedCode);
        });
    });

    document.addEventListener('click', (event) => {
        if (playerContainer.classList.contains('open') && !isClosing) {
            if (!event.target.closest('.player-container') && !event.target.closest('.song-item')) {
                closePlayer();
            }
        }
    });

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        closePlayer();
    });

    function showPlayer(embedCode) {
        embedContent.innerHTML = embedCode;
        playerContainer.classList.add('open');
        playerContainer.style.transition = 'transform 0.3s ease-in-out';
        playerContainer.style.transform = 'translateX(-100%)';
    }

    function closePlayer() {
        playerContainer.classList.remove('open');
        embedContent.innerHTML = '';
        playerContainer.style.transform = `translateX(0)`;
    }
});