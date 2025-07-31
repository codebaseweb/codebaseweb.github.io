// Объявление переменных разных типов
let userName = "Василий";
let userAge = 25;
let isStudent = true;
let score = 98.5;

// Вывод значений переменных в консоль
console.log("Имя пользователя:", userName);
console.log("Возраст пользователя:", userAge);
console.log("Является ли студентом:", isStudent);
console.log("Баллы:", score);

// Изменение значения переменной
userAge = userAge + 1; // Увеличиваем возраст на 1
console.log("Новый возраст пользователя:", userAge);

// Объявление константы
const GREETING_MESSAGE = "Добро пожаловать!";
console.log(GREETING_MESSAGE);

// Попробуйте раскомментировать следующую строку и увидите ошибку в консоли
// GREETING_MESSAGE = "Привет!";

// Проверка типов данных
console.log("Тип userName:", typeof userName);
console.log("Тип userAge:", typeof userAge);
console.log("Тип isStudent:", typeof isStudent);
console.log("Тип nullValue:", typeof null); // Помним про особенность null
let notDefined;
console.log("Тип notDefined:", typeof notDefined);
