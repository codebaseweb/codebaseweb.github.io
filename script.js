// ШАГ 1: Объявляем переменные, которые будут хранить важную информацию об игре.
// 'score' - количество очков, 'scorePerClick' - сколько очков получаем за один клик.
let score = 0;
let scorePerClick = 1;

// ШАГ 2: Находим нужные элементы на странице по их ID.
// 'scoreDisplay' - это место, где мы будем показывать очки.
// 'clickButton' - это наша главная кнопка для кликов.
const scoreDisplay = document.getElementById("score-display");
const clickButton = document.getElementById("click-button");

// ШАГ 3: Создаем функцию, которая будет обновлять текст на странице.
// Мы будем вызывать эту функцию каждый раз, когда меняется score.
function updateScoreDisplay() {
    scoreDisplay.textContent = score;
}

// ШАГ 4: Создаем функцию, которая будет обрабатывать клик по кнопке.
function handleButtonClick() {
    // Увеличиваем количество очков на scorePerClick
    score = score + scorePerClick;
    
    // Обновляем текст на странице, чтобы показать новый результат
    updateScoreDisplay();
}

// ШАГ 5: Добавляем "слушателя события" на кнопку.
// Когда кто-то кликает на кнопку, вызывается наша функция handleButtonClick.
clickButton.addEventListener("click", handleButtonClick);

// ШАГ 6: При старте игры, отображаем начальное количество очков.
updateScoreDisplay();
