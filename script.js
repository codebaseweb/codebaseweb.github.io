// ШАГ 1: Нам нужно найти нужные элементы на странице, чтобы ими управлять.
// Мы находим элемент с id="main-text" и сохраняем его в переменной.
const mainTextParagraph = document.getElementById("main-text");

// Мы находим элемент с id="change-text-button" и сохраняем его в другой переменной.
const changeTextButton = document.getElementById("change-text-button");


// ШАГ 2: Теперь, когда у нас есть кнопка, мы хотим, чтобы она что-то делала,
// когда на неё нажимают. Мы добавляем "слушателя событий".
// Он будет слушать, когда произойдёт событие "click" (клик мыши).
changeTextButton.addEventListener("click", function() {

    // ШАГ 3: Когда кнопка нажата, мы хотим изменить текст в абзаце.
    // Мы обращаемся к переменной, где хранится наш абзац, и меняем его свойство textContent.
    mainTextParagraph.textContent = "Текст изменён благодаря мне)!";

});

