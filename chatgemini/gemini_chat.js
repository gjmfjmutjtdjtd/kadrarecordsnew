document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatHistory = document.getElementById('chat-history');
    const errorMessage = document.getElementById('error-message');
    
    const notesInput = document.getElementById('notes-input');
    const saveNotesButton = document.getElementById('save-notes-button');
    const notesStatusMessage = document.getElementById('notes-status-message');

    const API_KEY = 'AIzaSyAwqbsmNGi_0IE20gk_kgMLJRwmdJmwSPU';

    const SYSTEM_PROMPT = `Ты — дружелюбный ассистент по вопросам звукозаписи и музыкальной индустрии. Отвечай на вопросы только по этой теме.
Если пользователь задаст вопрос, не относящийся к теме, вежливо ответь, что ты можешь помочь только с вопросами о музыке и звукозаписи.
Но самое главное ты еще и крутой сонграйтер, ты делаешь текста в стиле : - Повторяющийся припев как мантра, с протяжными звуками или буквами
- Припев — красивая, необычная лексика, описывающая девушку и ощущения
- Куплеты — короткие строки, визуальный язык, уличный и модный сленг
- Часто используется точная внутренняя рифма
- Темы: уличная романтика, тусовки, стиль, ночь, боль, отношения, тоска
- Настроения: от дерзкого до чувственного, от стильного до меланхоличного
- Атмосфера: городская ночь, фары, алкоголь, дым, холод, роскошь
- Интонация — полу-певаемая, музыкально ритмичная

**ЦА:** молодёжь 16–28 лет, городской ритм, соцсети, визуальность, эмоции, стиль

**Лингвистика:**
- Простые, но образные слова
- Повторения как мантра (по запросу)
- Строгий чёрный список: «сердце», «вектор», «мгла», «изумруд», «бойский», «сальса», «на зорю», «кораллы у моря»
- Расширенный словарь: синонимы и уличный сленг
- Точные рифмы по умолчанию

**Структура трека:**
1. Припев (мантраобразный)
2. Куплет
3. Припев
4. Куплет
5. Бридж (опционально)
6. Финальный припев

**Визуальный образ:**
- Уличная мода + luxury streetwear
- Городские ночные мотивы: машины, фонари, неон
- Атмосфера: татуировки, цепи, энергетика улицы
- Молодёжный lifestyle: вечеринки, соцсети, дерзость.`;

    const conversationHistory = [
        {
            role: "user",
            parts: [{ text: SYSTEM_PROMPT }]
        },
        {
            role: "model",
            parts: [{ text: "ОК" }]
        }
    ];

    function addMessage(text, className, role) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', className);
        messageDiv.textContent = text;
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        conversationHistory.push({
            role: role,
            parts: [{ text: text }]
        });
    }
    
    function loadNotes() {
        const savedNotes = localStorage.getItem('userNotes');
        if (savedNotes) {
            notesInput.value = savedNotes;
        }
    }
    
    function saveNotes() {
        const notes = notesInput.value;
        localStorage.setItem('userNotes', notes);
        notesStatusMessage.textContent = 'Заметки сохранены!';
        setTimeout(() => {
            notesStatusMessage.textContent = '';
        }, 3000);
    }

    saveNotesButton.addEventListener('click', saveNotes);
    
    loadNotes();

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = userInput.value.trim();
        if (!message) return;

        addMessage(message, 'user-message', 'user');
        userInput.value = '';
        errorMessage.textContent = '';

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: conversationHistory
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${response.statusText}. Details: ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            const botMessage = data.candidates[0].content.parts[0].text;
            addMessage(botMessage, 'bot-message', 'model');

        } catch (error) {
            console.error('Error fetching from Gemini API:', error);
            errorMessage.textContent = 'Произошла ошибка. Пожалуйста, попробуйте позже.';
            addMessage('Произошла ошибка. Пожалуйста, попробуйте позже.', 'bot-message', 'model');
        }
    });
});
