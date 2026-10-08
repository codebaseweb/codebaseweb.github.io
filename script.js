// 1. Создаем "коробки" (переменные) для хранения данных игры
let coins = 0;          // Сколько монет у игрока
let autoClickers = 0;   // Сколько авто-кликеров куплено
let upgradeCost = 10;   // Сколько стоит первый апгрейд

// Находим элементы на странице, чтобы постоянно их обновлять
const coinsDisplay = document.getElementById("coins");
const cpsDisplay = document.getElementById("cps");
const clickBtn = document.getElementById("clickBtn");
const upgradeBtn = document.getElementById("upgradeBtn");

// 2. Функция для обычного клика мышкой
clickBtn.onclick = function() {
    coins = coins + 1; // Добавляем 1 монетку
    updateUI();        // Обновляем текст на экране
};

// 3. Функция покупки авто-кликера
upgradeBtn.onclick = function() {
    // Условие: проверяем, хватает ли у игрока монет
    if (coins >= upgradeCost) {
        coins = coins - upgradeCost; // Забираем монеты за покупку
        autoClickers = autoClickers + 1; // Увеличиваем количество авто-кликеров
        upgradeCost = Math.round(upgradeCost * 1.5); // Увеличиваем цену следующего апгрейда на 50%
        
        updateUI(); // Обновляем экран
    }
};

// 4. Функция авто-клика (срабатывает сама каждую секунду)
setInterval(function() {
    if (autoClickers > 0) {
        coins = coins + autoClickers; // Добавляем монеты от авто-кликеров
        updateUI();
    }
}, 1000); // 1000 миллисекунд = 1 секунда

// 5. Вспомогательная функция, которая обновляет все тексты и кнопки на экране
function updateUI() {
    coinsDisplay.innerText = coins; // Меняем баланс
    cpsDisplay.innerText = autoClickers; // Меняем скорость авто-клика
    
    // Меняем текст на кнопке магазина, показывая новую цену
    upgradeBtn.innerText = "Купить Авто-кликер (Цена: " + upgradeCost + " 🪙)";
    
    // Условие: если монет хватает на апгрейд — делаем кнопку активной, если нет — выключаем
    if (coins >= upgradeCost) {
        upgradeBtn.disabled = false;
    } else {
        upgradeBtn.disabled = true;
    }
}
