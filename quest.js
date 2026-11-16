<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Мой локальный ИИ на JS</title>
    <style>
        body { font-family: sans-serif; max-width: 600px; margin: 30px auto; padding: 20px; background: #121212; color: #e0e0e0; }
        #chat { height: 300px; border: 1px solid #333; background: #1e1e1e; padding: 15px; overflow-y: scroll; margin-bottom: 15px; border-radius: 8px; }
        .message { margin-bottom: 10px; line-height: 1.4; }
        .user { color: #4fc3f7; }
        .bot { color: #81c784; }
        .system { color: #ffb74d; font-style: italic; }
        input[type="text"] { width: 75%; padding: 10px; background: #2d2d2d; border: 1px solid #444; color: #fff; border-radius: 4px; }
        button { width: 20%; padding: 10px; background: #0288d1; color: white; border: none; border-radius: 4px; cursor: pointer; }
        button:disabled { background: #555; cursor: not-allowed; }
    </style>
</head>
<body>

    <h2>Локальный ИИ на Transformers.js</h2>
    <div id="chat">
        <div class="message system" id="status">Загружаю модель в память устройства... Пожалуйста, подожди (это происходит только один раз).</div>
    </div>

    <input type="text" id="userInput" placeholder="Введи сообщение..." disabled>
    <button id="sendBtn" onclick="sendMessage()" disabled>Отправить</button>

    <!-- Подключаем Transformers.js через ESM-модуль -->
    <script type="module">
        import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0';

        let generator = null;
        const chatDiv = document.getElementById('chat');
        const userInput = document.getElementById('userInput');
        const sendBtn = document.getElementById('sendBtn');
        const statusDiv = document.getElementById('status');

        async function initAI() {
            try {
                // Создаем пайплайн генерации текста. 
                // Используем компактную модель, которая быстро работает на обычном железе.
                generator = await pipeline('text-generation', 'Xenova/gpt2');
                
                statusDiv.textContent = 'Модель успешно загружена! Модельный ИИ готов к работе.';
                userInput.disabled = false;
                sendBtn.disabled = false;
            } catch (err) {
                statusDiv.textContent = 'Ошибка загрузки модели: ' + err.message;
                console.error(err);
            }
        }

        initAI();

        // Делаем функцию доступной глобально для кнопки
        window.sendMessage = async function() {
            const text = userInput.value.trim();
            if (!text || !generator) return;

            // Выводим сообщение пользователя
            chatDiv.innerHTML += `<div class="message user"><b>Ты:</b> ${text}</div>`;
            userInput.value = '';
            chatDiv.scrollTop = chatDiv.scrollHeight;

            // Временный блок для ответа бота
            const botMsgId = 'msg-' + Date.now();
            chatDiv.innerHTML += `<div class="message bot" id="${botMsgId}"><b>ИИ думает...</b></div>`;
            chatDiv.scrollTop = chatDiv.scrollHeight;

            try {
                // Запускаем генерацию текста моделью
                const output = await generator(text, {
                    max_new_tokens: 50,  // Максимальная длина ответа в токенах
                    temperature: 0.7,    // Креативность (выше — разнообразнее, ниже — строже)
                    do_sample: true,
                });

                // Извлекаем сгенерированный текст (обрезаем повтор промпта пользователя)
                let generatedText = output[0].generated_text;
                
                // Обновляем блок ответа
                document.getElementById(botMsgId).innerHTML = `<b>ИИ:</b> ${generatedText}`;
            } catch (err) {
                document.getElementById(botMsgId).innerHTML = `<b>Ошибка:</b> Не удалось сгенерировать ответ.`;
                console.error(err);
            }
            chatDiv.scrollTop = chatDiv.scrollHeight;
        };

        // Отправка по нажатию Enter
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    </script>
</body>
</html>

