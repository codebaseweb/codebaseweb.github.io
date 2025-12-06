
// ===== Герой, предметы, утилиты =====
const state = {
  name: "Странник",
  cls: null,      // "warrior" | "monk" | "sorcerer"
  hp: 24,
  maxHp: 24,
  gold: 0,
  level: 1,
  baseDmg: 4,
  inventory: [],
  weapon: null,
  location: "intro",
  flags: {}
};

const $status = document.getElementById("status");
const $output = document.getElementById("output");
const $choices = document.getElementById("choices");
const $restart = document.getElementById("restart");

function say(text) { $output.innerHTML = `<p>${text}</p>`; }
function choices(list) {
  $choices.innerHTML = "";
  list.forEach(({ text, action }) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = text;
    btn.onclick = action;
    $choices.appendChild(btn);
  });
}

function showStatus() {
  const w = state.weapon ? renderItem(state.weapon) : "без оружия";
  $status.innerHTML = `
    <div class="card"><div class="label">Класс</div><div class="value">${renderClass(state.cls)}</div></div>
    <div class="card"><div class="label">Здоровье</div><div class="value">${state.hp}/${state.maxHp}</div></div>
    <div class="card"><div class="label">Золото</div><div class="value">${state.gold}</div></div>
    <div class="card"><div class="label">Оружие</div><div class="value">${w}</div></div>
  `;
}

function randInt(min, max){ return Math.floor(Math.random()*(max-min+1))+min; }
function chance(p){ return Math.random() < p; } // p: 0..1

// ===== Предметы и редкости =====
function makeWeapon(name, minDmg, maxDmg, rarity) {
  return { type: "weapon", name, minDmg, maxDmg, rarity }; // rarity: "normal" | "magic" | "rare"
}
function renderItem(item){
  if(!item) return "";
  const cls = item.rarity==="magic"?"item-magic": item.rarity==="rare"?"item-rare":"";
  return `<span class="${cls}">${item.name} [${item.minDmg}-${item.maxDmg}]</span>`;
}
function equip(item){
  if(item.type==="weapon"){
    state.weapon = item;
    say(`Ты экипировал: ${item.name}.`);
  }
}

// ===== Классы героя =====
function setClass(cls){
  state.cls = cls;
  if(cls==="warrior"){ state.maxHp = 28; state.hp = 28; state.baseDmg = 5; }
  if(cls==="monk"){ state.maxHp = 24; state.hp = 24; state.baseDmg = 5; state.flags.dodge = 0.15; }
  if(cls==="sorcerer"){ state.maxHp = 20; state.hp = 20; state.baseDmg = 3; state.flags.arcane = 1; }
}

// ===== Урон =====
function rollHeroDmg(){
  const base = state.baseDmg;
  const w = state.weapon ? randInt(state.weapon.minDmg, state.weapon.maxDmg) : 0;
  const crit = chance(0.12) ? 2 : 1;
  return (base + w) * crit;
}

function heal(amount){
  state.hp = Math.min(state.hp + amount, state.maxHp);
}

// ===== Бой =====
function combat(enemy, onWin){
  say(`Тебя встречает ${enemy.name}.`);
  const loop = () => {
    choices([
      { text: "Атаковать", action: () => {
        // Герой бьёт
        const dmg = rollHeroDmg();
        enemy.hp -= dmg;
        say(`Ты наносишь ${dmg} урона. У ${enemy.name} осталось ${Math.max(enemy.hp,0)} HP.`);
        if(enemy.hp<=0){
          const gold = enemy.gold || 0;
          state.gold += gold;
          say(`Ты свершил правосудие над ${enemy.name}. Золото: +${gold}.`);
          lootDrop(enemy);
          choices([{ text: "Продолжить", action: onWin }]);
          return;
        }
        // Враг отвечает
        let edmg = randInt(enemy.minDmg, enemy.maxDmg);
        // Уклонение монаха
        if(state.cls==="monk" && chance(state.flags.dodge || 0)){ edmg = 0; }
        // Магическая защита (чуть снижает)
        if(state.cls==="sorcerer"){ edmg = Math.max(0, edmg-1); }
        state.hp -= edmg;
        if(edmg===0){
          say(`Ты уклонился от удара ${enemy.name}.`);
        } else {
          say(`${enemy.name} ранит тебя на ${edmg}. Твоё здоровье: ${Math.max(state.hp,0)}.`);
        }
        if(state.hp<=0){
          say("Тьма поглотила тебя. Игра окончена.");
          choices([{ text: "Начать заново", action: restart }]);
          return;
        }
        loop();
      }},
      { text: "Использовать лечебный флакон", action: () => {
        const idx = state.inventory.findIndex(i=>i.type==="potion");
        if(idx>-1){
          const p = state.inventory.splice(idx,1)[0];
          heal(p.heal);
          say(`Ты выпиваешь флакон (+${p.heal} HP).`);
        } else {
          say("Флаконов не осталось.");
        }
        loop();
      }},
      { text: "Отступить", action: () => goto("camp") }
    ]);
    showStatus();
  };
  loop();
}

// ===== Лут =====
function lootDrop(enemy){
  // Базовый шанс лута
  const drops = [];
  if(chance(0.6)) drops.push({ type:"gold", amount: randInt(2, 8) });
  if(chance(0.35)){
    // Генерация оружия с редкостью
    const roll = Math.random();
    let rarity = "normal";
    if(roll>0.85) rarity = "rare";
    else if(roll>0.6) rarity = "magic";
    const wpool = [
      makeWeapon("Клинок падшего", 2, 6, rarity),
      makeWeapon("Святое копьё", 3, 7, rarity),
      makeWeapon("Посох тления", 1, 8, rarity)
    ];
    drops.push(wpool[randInt(0, wpool.length-1)]);
  }
  if(chance(0.4)) drops.push({ type:"potion", name:"Лечебный флакон", heal: 6 });

  if(drops.length===0){ say("С трупа не удалось ничего полезного добыть."); return; }

  // Показ лута и выбор
  const lines = drops.map(d=>{
    if(d.type==="gold"){ return `Золото: +${d.amount}`; }
    if(d.type==="potion"){ return `Предмет: ${d.name} (+${d.heal} HP)`; }
    if(d.type==="weapon"){ return `Оружие: ${d.name} [${d.minDmg}-${d.maxDmg}] (${d.rarity})`; }
    return "Находка.";
  }).join("<br/>");
  say(`Добыча:<br/>${lines}`);
  drops.forEach(d=>{
    if(d.type==="gold"){ state.gold += d.amount; }
    else { state.inventory.push(d); }
  });
  choices([
    { text: "Забрать всё", action: ()=> {
      say("Ты собираешь трофеи и осматриваешься.");
      showStatus();
    }},
    { text: "Экипировать лучшее оружие", action: ()=> {
      const best = state.inventory.filter(i=>i.type==="weapon").sort((a,b)=> (b.minDmg+b.maxDmg)-(a.minDmg+a.maxDmg))[0];
      if(best){ equip(best); }
      showStatus();
    }}
  ]);
}

// ===== Сцены =====
const scenes = {
  intro: {
    enter(){
      say("Ночь над Тристрамом. Колокол молчит. Ты идёшь к часовне, где шёпот зовёт из катакомб.");
      choices([
        { text: "Выбрать класс: Воин", action: ()=> { setClass("warrior"); goto("camp"); } },
        { text: "Выбрать класс: Монах", action: ()=> { setClass("monk"); goto("camp"); } },
        { text: "Выбрать класс: Колдун", action: ()=> { setClass("sorcerer"); goto("camp"); } }
      ]);
    }
  },

  camp: {
    enter(){
      say("Лагерь у мостика Тристрама. Костёр потрескивает. Путь ведёт к лесу и в часовню.");
      choices([
        { text: "Идти в Часовню", action: ()=> goto("chapelEntrance") },
        { text: "Пойти в лес", action: ()=> goto("forest") },
        { text: "Осмотреть лагерь", action: ()=> {
          if(!state.flags.cache){
            state.flags.cache = true;
            state.gold += 10;
            state.inventory.push({ type:"potion", name:"Лечебный флакон", heal: 6 });
            say("Ты находишь тайник: 10 золота и флакон.");
          } else {
            say("Ничего нового.");
          }
          choices([{ text: "Вернуться", action: ()=> goto("camp") }]);
        }},
      ]);
    }
  },

  forest: {
    enter(){
      say("Тёмный лес. Глаза в кустах. Демоны любят охотиться здесь.");
      choices([
        { text: "Встретить падшего", action: ()=> {
          const enemy = { name:"Падший демон", hp: 12, minDmg:1, maxDmg:4, gold: 4 };
          combat(enemy, ()=> goto("forest"));
        }},
        { text: "Обыскать чащу", action: ()=> {
          if(chance(0.5)){
            const herb = { type:"potion", name:"Флакон травника", heal: 5 };
            state.inventory.push(herb);
            say("Ты находишь лечебный флакон травника.");
          } else {
            say("Только шорохи и пустота.");
          }
          choices([{ text:"Вернуться", action: ()=> goto("forest") }]);
        }},
        { text: "Вернуться к лагерю", action: ()=> goto("camp") }
      ]);
    }
  },

  chapelEntrance: {
    enter(){
      say("Вход в часовню Тристрама. Дверь приоткрыта. Внутри пахнет пеплом.");
      choices([
        { text: "Спуститься в катакомбы", action: ()=> goto("catacombs") },
        { text: "Осмотреть хоры", action: ()=> {
          if(!state.flags.chapelKey){
            state.flags.chapelKey = true;
            state.inventory.push({ type:"key", name:"Ключ катакомб" });
            say("Под пюпитром ты находишь ржавый ключ.");
          } else {
            say("Ты уже забрал ключ.");
          }
          choices([{ text:"Назад", action: ()=> goto("chapelEntrance") }]);
        }},
        { text: "Вернуться в лагерь", action: ()=> goto("camp") }
      ]);
    }
  },

  catacombs: {
    enter(){
      say("Катакомбы. Кости хрустят под ногами. Тьма зовёт.");
      choices([
        { text:"Продвигаться глубже", action: ()=> {
          const enemy = { name:"Скелет-воин", hp: 16, minDmg:2, maxDmg:5, gold: 7 };
          combat(enemy, ()=> goto("catacombs"));
        }},
        { text:"Алтарь крови", action: ()=> {
          if(!state.flags.bloodAltar){
            state.flags.bloodAltar = true;
            say("Ты жертвуешь немного крови и чувствуешь силу.");
            state.baseDmg += 1;
            state.hp = Math.max(1, state.hp-2);
          } else {
            say("Алтарь молчит. Ему достаточно.");
          }
          choices([{ text:"Вернуться", action: ()=> goto("catacombs") }]);
        }},
        { text:"Врата к склепу", action: ()=> {
          if(!state.flags.chapelKey){
            say("Нужен ключ катакомб.");
            choices([{ text:"Назад", action: ()=> goto("catacombs") }]);
          } else {
            goto("crypt");
          }
        }},
        { text:"Вернуться к входу", action: ()=> goto("chapelEntrance") }
      ]);
    }
  },

  crypt: {
    enter(){
      say("Склеп. Холодные камни и шёпот имен. На пьедестале лежит реликвия.");
      choices([
        { text:"Взять реликвию", action: ()=> {
          if(!state.flags.relic){
            state.flags.relic = true;
            state.inventory.push({ type:"quest", name:"Реликвия души" });
            say("Ты берёшь реликвию. Воздух дрожит.");
          } else { say("Пьедестал пуст."); }
          choices([{ text:"Назад", action: ()=> goto("crypt") }]);
        }},
        { text:"Покинуть склеп", action: ()=> goto("catacombs") }
      ]);

      // Босс
      if(state.flags.relic && !state.flags.bossDefeated){
        const enemy = { name:"Сторож Лазаря", hp: 24, minDmg:3, maxDmg:7, gold: 20 };
        combat(enemy, ()=> {
          state.flags.bossDefeated = true;
          say("Сторож пал. Тишина возвращается, но ненадолго.");
          choices([{ text:"Вернуться к склепу", action: ()=> goto("crypt") }]);
        });
      }
    }
  }
};

// ===== Инициализация =====
function goto(sceneId){
  const scene = scenes[sceneId];
  if(!scene){ say("Тропа теряется в тумане."); return; }
  state.location = sceneId;
  scene.enter();
  showStatus();
}

function restart(){
  state.name = "Странник";
  state.cls = null;
  state.maxHp = 24; state.hp = 24;
  state.gold = 0;
  state.level = 1;
  state.baseDmg = 4;
  state.inventory = [];
  state.weapon = null;
  state.location = "intro";
  state.flags = {};
  goto("intro");
}

$restart.addEventListener("click", restart);
restart();
