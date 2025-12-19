// game.js

// --- 1. Состояние Игры ---
let gameState = {
    money: 0,
    lemonadePerClick: 1, // Сколько получаем за клик
    lemonadePerSecond: 0 // Пассивный доход
};

// --- 2. Улучшения (Магазин) ---
const UPGRADES = [
    { 
        id: 'child', 
        name: 'Соседский ребенок', 
        baseCost: 10, 
        lps: 0.1, // Лимонад в секунду
        count: 0 
    },
    { 
        id: 'stand', 
        name: 'Уличный ларек', 
        baseCost: 100, 
        lps: 1, 
        count: 0 
    },
    { 
        id: 'truck', 
        name: 'Фудтрак с лимонадом', 
        baseCost: 1000, 
        lps: 10, 
        count: 0 
    }
];

// --- 3. Вспомогательные функции (для HTML) ---

function logMessage(message) {
    const outputElement = document.getElementById('output');
    outputElement.innerHTML = message + '<br>' + outputElement.innerHTML;
}

function displayStatus() {
    const statusElement = document.getElementById('status-display');
    
    // Форматирование денег до 2 знаков после запятой (для удобства)
    const formattedMoney = gameState.money.toFixed(2); 
    
    statusElement.innerHTML = `
        💰 **Деньги:** ${formattedMoney} монет<br>
        ⏱️ **Лимонад в секунду (ЛПС):** ${gameState.lemonadePerSecond.toFixed(1)}
    `;
    
    // Также обновляем список улучшений
    renderUpgrades(); 
}

// --- 4. Основная Логика ---

// Функция, вызываемая по клику
function sellLemonade() {
    gameState.money += gameState.lemonadePerClick;
    logMessage(`Продан стакан! +${gameState.lemonadePerClick.toFixed(2)} монет.`);
    displayStatus();
}

// Функция для покупки улучшений
function buyUpgrade(upgradeId) {
    const upgrade = UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return;

    // Стоимость: делаем экспоненциальный рост (цена = базовая * 1.15^количество)
    const cost = upgrade.baseCost * Math.pow(1.15, upgrade.count);
    
    if (gameState.money >= cost) {
        // 1. Списываем деньги
        gameState.money -= cost;
        // 2. Увеличиваем счетчик
        upgrade.count++;
        // 3. Обновляем ЛПС
        updateLPS(); 
        
        logMessage(`🛒 Куплено: **${upgrade.name}**! Теперь у вас их ${upgrade.count}.`);
    } else {
        logMessage(`⚠️ Не хватает денег для покупки ${upgrade.name}. Нужно ${cost.toFixed(2)} монет.`);
    }

    displayStatus();
}

// Пересчет пассивного дохода
function updateLPS() {
    let newLPS = 0;
    for (const upgrade of UPGRADES) {
        newLPS += upgrade.lps * upgrade.count;
    }
    gameState.lemonadePerSecond = newLPS;
}

// Отображение списка улучшений
function renderUpgrades() {
    const upgradesList = document.getElementById('upgrades-list');
    upgradesList.innerHTML = ''; // Очищаем список

    for (const upgrade of UPGRADES) {
        // Вычисляем текущую цену
        const cost = upgrade.baseCost * Math.pow(1.15, upgrade.count);
        
        const card = document.createElement('div');
        card.className = 'upgrade-card';
        card.innerHTML = `
            <strong>${upgrade.name}</strong> (У вас: ${upgrade.count})<br>
            Доход: +${upgrade.lps.toFixed(1)} ЛПС<br>
            Цена: ${cost.toFixed(2)} монет
            <button onclick="buyUpgrade('${upgrade.id}')" 
                    ${gameState.money < cost ? 'disabled' : ''} 
                    class="action-button">
                Купить
            </button>
        `;
        upgradesList.appendChild(card);
    }
}

// --- 5. Пассивный доход (Интервал) ---

// Функция, которая выполняется каждую секунду
function passiveIncome() {
    if (gameState.lemonadePerSecond > 0) {
        // Добавляем доход за 1 секунду
        gameState.money += gameState.lemonadePerSecond;
        displayStatus();
    }
}

// Запускаем пассивный доход каждую 1000 миллисекунд (1 секунда)
setInterval(passiveIncome, 1000);


// --- 6. Инициализация (Привязка кнопок и первый запуск) ---

document.getElementById('sell-button').addEventListener('click', sellLemonade);

// Первое отображение при загрузке
displayStatus();
logMessage("Игра началась. Нажимайте на кнопку!");
