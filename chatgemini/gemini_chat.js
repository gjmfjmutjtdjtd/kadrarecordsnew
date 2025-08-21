document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatHistory = document.getElementById('chat-history');
    const errorMessage = document.getElementById('error-message');

    // Замените на ваш API-ключ Gemini
    const API_KEY = 'AIzaSyAwqbsmNGi_0IE20gk_kgMLJRwmdJmwSPU';

    function addMessage(text, className) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', className);
        messageDiv.textContent = text;
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = userInput.value.trim();
        if (!message) return;

        addMessage(message, 'user-message');
        userInput.value = '';
        errorMessage.textContent = '';

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [{
                                text: "Ты — дружелюбный ассистент по вопросам звукозаписи и музыкальной индустрии. Отвечай на вопросы только по этой теме. Если пользователь задаст вопрос, не относящийся к теме, вежливо ответь, что ты можешь помочь только с вопросами о музыке и звукозаписи."
                            }]
                        },
                        {
                            role: "model",
                            parts: [{
                                text: "ОК"
                            }]
                        },
                        {
                            role: "user",
                            parts: [{
                                text: message
                            }]
                        }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${response.statusText}. Details: ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            const botMessage = data.candidates[0].content.parts[0].text;
            addMessage(botMessage, 'bot-message');

        } catch (error) {
            console.error('Error fetching from Gemini API:', error);
            errorMessage.textContent = 'Произошла ошибка. Пожалуйста, попробуйте позже.';
            addMessage('Произошла ошибка. Пожалуйста, попробуйте позже.', 'bot-message');
        }
    });
});
