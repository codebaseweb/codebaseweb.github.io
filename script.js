// 1. Получаем ссылки на HTML-элементы
const paragraph = document.getElementById("paragraphToChange");
const changeTextBtn = document.getElementById("changeTextButton");
const changeStyleBtn = document.getElementById("changeStyleButton");
const toggleHighlightBtn = document.getElementById("toggleHighlightButton");
const showPromptBtn = document.getElementById("showPromptButton");
const messageDiv = document.getElementById("message");

// 2. Добавляем обработчик события для кнопки "Изменить текст"
changeTextBtn.addEventListener("click", function() {
    paragraph.textContent = "Текст успешно изменён с помощью JavaScript!";
    messageDiv.innerHTML = "<p>Вы изменили текст параграфа.</p>"; // Используем innerHTML для вставки тега
    messageDiv.classList.remove("error"); // Убираем возможный класс ошибки
});

// 3. Добавляем обработчик события для кнопки "Изменить стиль"
changeStyleBtn.addEventListener("click", function() {
    paragraph.style.color = "green";
    paragraph.style.fontSize = "24px";
    paragraph.style.fontWeight = "bold";
    messageDiv.innerHTML = "<p>Вы изменили стиль параграфа.</p>";
    messageDiv.classList.remove("error");
});

// 4. Добавляем обработчик события для кнопки "Переключить подсветку"
toggleHighlightBtn.addEventListener("click", function() {
    paragraph.classList.toggle("highlight"); // Добавляем/удаляем класс "highlight"
    if (paragraph.classList.contains("highlight")) { // Проверяем, есть ли класс
        messageDiv.innerHTML = "<p>Подсветка включена.</p>";
    } else {
        messageDiv.innerHTML = "<p>Подсветка выключена.</p>";
    }
    messageDiv.classList.remove("error");
});

// 5. Добавляем обработчик события для кнопки "Спросить имя"
showPromptBtn.addEventListener("click", function() {
    const userName = prompt("Как вас зовут?"); // prompt() - запрашивает ввод у пользователя
    if (userName) { // Если пользователь ввел что-то (не нажал Отмена)
        messageDiv.innerHTML = `<p>Привет, <strong>${userName}</strong>! Рад познакомиться.</p>`;
        messageDiv.classList.remove("error");
    } else {
        messageDiv.innerHTML = "<p class='error'>Вы не ввели имя.</p>";
        messageDiv.classList.add("error"); // Добавляем класс ошибки
    }
});

// Инициализационное сообщение при загрузке страницы
window.addEventListener("load", function() { // Событие load срабатывает, когда страница полностью загружена
    console.log("Страница и все ресурсы загружены!");
    messageDiv.innerHTML = "<p>Нажмите на кнопки, чтобы увидеть изменения!</p>";
});
