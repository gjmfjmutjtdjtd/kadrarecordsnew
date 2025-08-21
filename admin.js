const loginModal = document.getElementById('loginModal');

const adminPanel = document.getElementById('adminPanel');

const loginForm = document.getElementById('loginForm');

const loginInput = document.getElementById('loginInput');

const passwordInput = document.getElementById('passwordInput');

const loginError = document.getElementById('loginError');

const logoutBtn = document.getElementById('logoutBtn');



const releaseForm = document.getElementById('release-form');

const releaseDateInput = document.getElementById('release-date');

const releaseTitleInput = document.getElementById('timer-title');

const msgSuccess = document.getElementById('msg-success');



const ADMIN_LOGIN = 'thekadrainfo';

const ADMIN_PASSWORD = 'Ioioiohyadfg';



function isLoggedIn() {

    return sessionStorage.getItem('adminLogged') === 'true';

}



function showAdminPanel() {

    loginModal.style.display = 'none';

    adminPanel.style.display = 'block';

    loadSettingsToAdmin();

}



function showLogin() {

    loginModal.style.display = 'flex';

    adminPanel.style.display = 'none';

    loginError.textContent = '';

    loginForm.reset();

    loginInput.focus();

}



function loadSettingsToAdmin() {

    const savedDate = localStorage.getItem('releaseDate');

    const savedTitle = localStorage.getItem('releaseTitle') || 'Релиз через';



    if (savedDate) {

        const d = new Date(savedDate);

        if (!isNaN(d)) {

            const localISO = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

            releaseDateInput.value = localISO;

        }

    }

    releaseTitleInput.value = savedTitle;

}



loginForm.addEventListener('submit', (e) => {

    e.preventDefault();

    const loginVal = loginInput.value.trim();

    const passwordVal = passwordInput.value;



    if (loginVal === ADMIN_LOGIN && passwordVal === ADMIN_PASSWORD) {

        sessionStorage.setItem('adminLogged', 'true');

        showAdminPanel();

    } else {

        loginError.textContent = 'Неверный логин или пароль.';

    }

});



releaseForm.addEventListener('submit', e => {

    e.preventDefault();

    const localDateStr = releaseDateInput.value;

    if (!localDateStr) {

        alert('Пожалуйста, укажите дату релиза');

        return;

    }

    const localDate = new Date(localDateStr);

    if (isNaN(localDate)) {

        alert('Некорректный формат даты');

        return;

    }

    const utcISO = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000).toISOString();

    localStorage.setItem('releaseDate', utcISO);

    let title = releaseTitleInput.value.trim();

    if (!title) {

        title = 'Релиз через';

    }

    localStorage.setItem('releaseTitle', title);

    msgSuccess.style.display = 'block';

    setTimeout(() => { msgSuccess.style.display = 'none'; }, 3000);

});



logoutBtn.addEventListener('click', () => {

    sessionStorage.removeItem('adminLogged');

    window.location.href = 'index.html';

});



window.addEventListener('load', () => {

    if (isLoggedIn()) {

        showAdminPanel();

    } else {

        showLogin();

    }

});
// admin.js
// ... существующая логика ...

document.addEventListener('DOMContentLoaded', () => {
    // ... существующий код в этом блоке ...

    const gptChatContainer = document.getElementById('gptChatContainer');
    const chatHistory = document.getElementById('chatHistory');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');

    // Функция для отображения/скрытия контейнера чата после входа
    const showChatContainer = () => {
        // Убедись, что этот вызов не конфликтует с существующим `toggleModal`
        // Лучше всего вставить его в `loadSavedData()` или после него
        if (localStorage.getItem('loggedIn')) {
            gptChatContainer.style.display = 'block';
        }
    };
    
    // Вызываем, чтобы показать чат после входа
    showChatContainer();

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        addMessage(message, 'user-message');
        chatInput.value = '';

        try {
            // Замени 'YOUR_API_KEY' на свой ключ GPT API
            const apiKey = 'sk-proj-mig39JxvON8p2oPlHpWKxWxFoSJavzST2bVMY1maFctCStAcpjBDzFUunniq233c4xrJ0QZarfT3BlbkFJqQOSUwABLzFOfPnq5lTcQfP3xC96N8l_U1M3FmoWjPwRcsuj61fw1VydhWbjoasf4L9imcfnAAYOUR_API_KEYsk-proj-mig39JxvON8p2oPlHpWKxWxFoSJavzST2bVMY1maFctCStAcpjBDzFUunniq233c4xrJ0QZarfT3BlbkFJqQOSUwABLzFOfPnq5lTcQfP3xC96N8l_U1M3FmoWjPwRcsuj61fw1VydhWbjoasf4L9imcfnAA';
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo', // Или любая другая модель, которую ты хочешь использовать
                    messages: [{ role: 'user', content: message }]
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const data = await response.json();
            const botMessage = data.choices[0].message.content;
            addMessage(botMessage, 'bot-message');

        } catch (error) {
            console.error('Error fetching from GPT API:', error);
            addMessage('Произошла ошибка. Пожалуйста, попробуйте позже.', 'bot-message');
        }
    });

    function addMessage(text, className) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', className);
        messageDiv.textContent = text;
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight; // Прокрутка вниз
    }
});
