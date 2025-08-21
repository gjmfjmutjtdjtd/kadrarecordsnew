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
