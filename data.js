const charData = [
    {
        id: "clorinde",
        name: "Клоринда",
        level: 90,
        avatar: "imgs/clorinde.png",
        element: "electro",
        weaponType: "sword",
        stats: {
            hp: { base: 12956, isPercent: false },
            atk: { base: 337, isPercent: false },
            def: { base: 784, isPercent: false },
            em: { base: 0, isPercent: false },
            er: { base: 100.0, isPercent: true },
            critRate: { base: 24.2, isPercent: true },
            critDmg: { base: 50.0, isPercent: true }, 
            healingBonus: { base: 0, isPercent: true},
            elementDamageBonus: { base: 0, isPercent: true},
        },
        talents: [
            { 
                type: "normal", 
                title: "Обычная атака: Клятва Сумеречного двора", 
                desc: "Выполняет до 5 быстрых ударов рапирой.",
                attributes: [
                    { name: "Урон 1-го удара", values: [56.1, 60.7, 65.3, 71.8, 76.4, 81.6, 88.8, 96.0, 103.1, 110.9] },
                    { name: "Урон 2-го удара", values: [53.2, 57.5, 61.9, 68.1, 72.4, 77.4, 84.2, 91.0, 97.8, 105.1] },
                    { name: "Урон 3-го удара", values: [35.4, 38.3, 41.2, 45.3, 48.2, 51.5, 56.1, 60.6, 65.1, 70.0] }
                ]
            },
            {
                type: "skill",
                title: "Элем. навык: Охота на тьму",
                desc: "Подготавливает пистолет и входит в состояние Ночного дозора.",
                attributes: [
                    { name: "Урон Неистовой охоты", values: [36.9, 39.9, 42.9, 47.2, 50.2, 53.6, 58.3, 63.1, 67.8, 72.9] },
                    { name: "Урон Пронзания ночи", values: [46.2, 49.9, 53.7, 59.1, 62.8, 67.1, 73.0, 79.0, 84.9, 91.2] },
                    { name: "Лечение (Долг жизни)", values: [105, 110, 115, 120, 125, 130, 135, 140, 145, 150] }
                ]
            },
            {
                type: "burst",
                title: "Взрыв стихий: Последние лучи света",
                desc: "Наносит Электро урон по площади 5 раз.",
                attributes: [
                    { name: "Урон навыка (x5)", values: [129.6, 139.3, 149.0, 162.0, 171.7, 181.4, 194.4, 207.4, 220.3, 233.3] },
                    { name: "КД", values: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15] },
                    { name: "Потребление энергии", values: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60] }
                ]
            },
            { 
                type: "passive", 
                title: "Пламя ночи", 
                desc: "Если HP > 100%, Крит. шанс увеличивается на 20%.",
                buff: { maxStacks: 1, bonusPerStack: { critRate: 20 } }
            },
            { type: "constellation", level: 1, title: "C1: Начиная новую главу", desc: "Увеличивает урон мушкетных атак в состоянии Ночного дозора." },
            { 
                type: "constellation", 
                level: 2, 
                title: "C2: Секреты под печатью", 
                desc: "Усиливает навык и дает 20% бонус Электро урона.",
                buff: { maxStacks: 1, bonusPerStack: { elementDamageBonus: 20 } }
            },
            { 
                type: "constellation", level: 3, title: "C3: Разрывающее мрак пламя", 
                desc: "Увеличивает уровень Элем. навыка на 3.",
                levelBoost: { type: 'skill', value: 3 } 
            },
            { type: "constellation", level: 4, title: "C4: Покаяние", desc: "Усиление ульты." },
            { 
                type: "constellation", level: 5, title: "C5: Несущий надежду клинок", 
                desc: "Увеличивает уровень Взрыва стихий на 3.",
                levelBoost: { type: 'burst', value: 3 }
            },
            { 
                type: "constellation", 
                level: 6, 
                title: "C6: Кровь, пролитая на балу", 
                desc: "Крит. шанс +10%, Крит. урон +70%.",
                buff: { maxStacks: 1, bonusPerStack: { critRate: 10, critDmg: 70 } }
            },
        ]
    },
    {
        id: "furina",
        name: "Фурина",
        level: 90,
        avatar: "imgs/furina.png",
        element: "hydro",
        weaponType: "sword",
        stats: {
            hp: { base: 15307, isPercent: false },
            atk: { base: 244, isPercent: false },
            def: { base: 696, isPercent: false },
            em: { base: 0, isPercent: false },
            er: { base: 100.0, isPercent: true },
            critRate: { base: 24.2, isPercent: true },
            critDmg: { base: 50.0, isPercent: true },
            healingBonus: { base: 0, isPercent: true},
            elementDamageBonus: { base: 0, isPercent: true},
        },
        talents: [
             { 
                type: "normal", title: "Обычная атака: Приглашение на соло", desc: "Обычные атаки: 4 удара.",
                attributes: [
                    { name: "Урон 1-го удара", values: [48.8, 52.8, 56.8, 62.5, 66.5, 71.0, 77.3, 83.5, 89.8, 96.6] },
                    { name: "Урон 2-го удара", values: [43.7, 47.3, 50.8, 55.9, 59.5, 63.6, 69.2, 74.8, 80.4, 86.5] }
                ]
            },
            {
                type: "skill", title: "Элем. навык: Салон одиноких сердец", desc: "Призывает участников салона.",
                attributes: [
                    { name: "Урон Кавалера Уше", values: [5.49, 5.9, 6.31, 6.86, 7.27, 7.68, 8.23, 8.78, 9.33, 9.88] },
                    { name: "Урон Мадам Крабалотты", values: [10.1, 10.9, 11.7, 12.7, 13.5, 14.3, 15.3, 16.3, 17.3, 18.3] },
                    { name: "Длительность", values: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30] }
                ]
            },
            {
                type: "burst", title: "Взрыв стихий: Да возрадуются люди", desc: "Наносит Гидро урон и создает состояние Веселья.",
                attributes: [
                    { name: "Урон активации (от HP)", values: [18.4, 19.8, 21.2, 23.0, 24.4, 25.8, 27.6, 29.4, 31.3, 33.1] },
                    { name: "Конвертация Фанфар", values: [0.18, 0.20, 0.21, 0.23, 0.24, 0.25, 0.27, 0.29, 0.31, 0.33] }
                ]
            },
            { type: "passive", title: "Бесконечный вальс", desc: "Если активный персонаж получает лечение..." },
            { 
                 type: "constellation", level: 1, title: "C1: Любовь - это не птица", 
                 desc: "Дает +15% бонуса лечения при активации (Пример для механики).",
                 buff: { maxStacks: 2, bonusPerStack: { healingBonus: 15 } }
            },
            { 
                 type: "constellation", level: 2, title: "C2: Женщина-перевертыш", 
                 desc: "Увеличивает HP Фурины.",
                 buff: { maxStacks: 1, bonusPerStack: { hp: 21429 } }
            },
            { 
                type: "constellation", level: 3, title: "C3: Секреты", 
                desc: "Уровень Взрыва стихий +3",
                levelBoost: { type: 'burst', value: 3 }
            },
            { type: "constellation", level: 4, title: "C4", desc: "Энергия." },
            { 
                type: "constellation", level: 5, title: "C5: Имя, которое я знаю", 
                desc: "Уровень Элем. навыка +3",
                levelBoost: { type: 'skill', value: 3 }
            },
            { type: "constellation", level: 6, title: "C6: Мой дар", desc: "Гидро инфузия." },
        ]
    },
    {
        id: "nefer",
        name: "Нефер",
        level: 90,
        avatar: "imgs/nefer.png",
        element: "dendro",
        weaponType: "catalyst", // Тип оружия - Катализатор
        stats: {
            hp: { base: 12704, isPercent: false },
            atk: { base: 344, isPercent: false },
            def: { base: 799, isPercent: false },
            em: { base: 100, isPercent: false },
            er: { base: 100.0, isPercent: true },
            critRate: { base: 5.0, isPercent: true },
            critDmg: { base: 88.4, isPercent: true },
            healingBonus: { base: 0, isPercent: true},
            elementDamageBonus: { base: 0, isPercent: true}, // Дендро урон будет в бонусах
        },
        talents: [
            { 
                type: "normal", title: "Обычная атака: Удар змеи", 
                desc: "До четырёх ударов со свирепостью и изяществом змеи, которые наносят Дендро урон.",
                attributes: [
                    { name: "Урон атаки 1", values: [38.1, 40.9, 43.8, 47.6, 50.4, 53.3, 57.1, 60.9, 64.7, 68.5, 72.3, 76.1, 80.9] },
                    { name: "Урон атаки 2", values: [37.6, 40.4, 43.2, 47.0, 49.8, 52.6, 56.3, 60.1, 63.9, 67.6, 71.4, 75.1, 79.8] },
                    { name: "Урон атаки 3", values: [25.2, 27.1, 29.0, 31.6, 33.4, 35.3, 37.9, 40.4, 42.9, 45.4, 48.0, 50.5, 53.6] },
                    { name: "Урон атаки 4", values: [61.0, 65.6, 70.1, 76.2, 80.8, 85.4, 91.5, 97.6, 103.7, 109.8, 115.9, 122.0, 129.6] },
                    { name: "Урон заряженной атаки", values: [130.9, 140.7, 150.5, 163.6, 173.4, 183.2, 196.3, 209.4, 222.5, 235.6, 248.7, 261.8, 278.1] },
                ]
            },
            {
                type: "skill", title: "Элем. навык: Око Осириса", 
                desc: "Призывает Око, наносящее урон по площади.",
                attributes: [
                    { name: "Урон навыка", values: [230.4, 247.7, 265.0, 288.0, 305.3, 322.6, 348.5, 374.4, 397.4, 420.5] },
                    { name: "КД", values: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10] }
                ]
            },
            {
                type: "burst", title: "Взрыв стихий: Суд Маат", 
                desc: "Создает поле Истины, периодически наносящее Дендро урон.",
                attributes: [
                    { name: "Периодический урон", values: [110.2, 118.5, 126.8, 137.8, 146.0, 154.3, 166.7, 179.1, 190.1, 201.1] },
                    { name: "Длительность", values: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12] },
                    { name: "Стоимость", values: [70, 70, 70, 70, 70, 70, 70, 70, 70, 70] }
                ]
            },
            { 
                type: "passive", title: "Древняя мудрость", 
                desc: "Использование навыка увеличивает Мастерство Стихий на 50 ед. Складывается до 4 раз.",
                buff: { maxStacks: 4, bonusPerStack: { em: 50 } }
            },
            { type: "constellation", level: 1, title: "C1: Песчаная буря", desc: "Увеличивает радиус Взрыва стихий." },
            { 
                type: "constellation", level: 2, title: "C2: Золотой скарабей", 
                desc: "Дает 20% бонус Дендро урона всем членам отряда.",
                buff: { maxStacks: 1, bonusPerStack: { elementDamageBonus: 20 } }
            },
            { 
                type: "constellation", level: 3, title: "C3: Свиток жизни", 
                desc: "Уровень Элем. навыка +3",
                levelBoost: { type: 'skill', value: 3 }
            },
            { type: "constellation", level: 4, title: "C4: Весы души", desc: "Восстанавливает энергию." },
            { 
                type: "constellation", level: 5, title: "C5: Врата Дуата", 
                desc: "Уровень Взрыва стихий +3",
                levelBoost: { type: 'burst', value: 3 }
            },
            { 
                type: "constellation", level: 6, title: "C6: Истинное имя", 
                desc: "Увеличивает Крит. урон Дендро атак на 60%.",
                buff: { maxStacks: 1, bonusPerStack: { critDmg: 60 } }
            },
        ]
    }
];

const weaponData = [
    {
        id: "absolution",
        name: "Отпущение грехов",
        type: "sword",
        img: "imgs/weapon_absolution.png",
        stats: {
            baseAtk: 674,
            subStat: { key: "critDmg", name: "Крит. урон", value: 44.1, isPercent: true }
        },
        buff: { 
            name: "Клятва поборника",
            desc: "Крит. урон +20%. При увеличении Долга жизни урон повышается.",
            maxStacks: 1, 
            bonusPerStack: { critDmg: 20, elementDamageBonus: 16 }
        }
    },
    {
        id: "splendor",
        name: "Блеск тихих вод",
        type: "sword",
        img: "imgs/weapon_splendor.png",
        stats: {
            baseAtk: 542,
            subStat: { key: "critDmg", name: "Крит. урон", value: 88.2, isPercent: true }
        },
        buff: {
            name: "Форма героя",
            desc: "Урон элем. навыка повышается. Макс 3 уровня.",
            maxStacks: 3, 
            bonusPerStack: { elementDamageBonus: 8 }
        }
    },
    {
        id: "iron_sting",
        name: "Стальное жало",
        type: "sword",
        img: "imgs/weapon_iron_sting.png",
        stats: {
            baseAtk: 510,
            subStat: { key: "em", name: "Мастерство стихий", value: 165, isPercent: false }
        },
        buff: {
            name: "Заряженное жало",
            desc: "Элементальный урон +6% на 6 сек. Складывается до 2 раз.",
            maxStacks: 2,
            bonusPerStack: { elementDamageBonus: 6 }
        }
    },
    {
        id: "casket_of_truths",
        name: "Шкатулка истин",
        type: "catalyst", // Тип соответствует Нефер
        img: "imgs/weapon_casket.png", // Вам нужно добавить картинку
        stats: {
            baseAtk: 608,
            subStat: { key: "critRate", name: "Шанс крит.", value: 33.1, isPercent: true }
        },
        buff: {
            name: "Эхо древних слов",
            desc: "При использовании навыка дает 12% бонус урона элемента за каждый уровень (макс 3).",
            maxStacks: 3,
            bonusPerStack: { elementDamageBonus: 12 }
        }
    }
];