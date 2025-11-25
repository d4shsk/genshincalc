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
                    { name: "Урон 1-го удара", values: [56.1, 60.7, 65.3, 71.8, 76.4, 81.6, 88.8, 96.0, 103.1, 110.9], scaling: [{stat: 'atk', ratio: 1}] },
                    { name: "Урон 2-го удара", values: [53.2, 57.5, 61.9, 68.1, 72.4, 77.4, 84.2, 91.0, 97.8, 105.1], scaling: [{stat: 'atk', ratio: 1}] },
                    { name: "Урон 3-го удара", values: [35.4, 38.3, 41.2, 45.3, 48.2, 51.5, 56.1, 60.6, 65.1, 70.0], scaling: [{stat: 'atk', ratio: 1}] }
                ]
            },
            {
                type: "skill",
                title: "Элем. навык: Охота на тьму",
                desc: "Подготавливает пистолет и входит в состояние Ночного дозора.",
                attributes: [
                    { name: "Урон Неистовой охоты", values: [36.9, 39.9, 42.9, 47.2, 50.2, 53.6, 58.3, 63.1, 67.8, 72.9], scaling: [{stat: 'atk', ratio: 1}] },
                    { name: "Урон Пронзания ночи", values: [46.2, 49.9, 53.7, 59.1, 62.8, 67.1, 73.0, 79.0, 84.9, 91.2], scaling: [{stat: 'atk', ratio: 1}] },
                    { name: "Лечение (Долг жизни)", values: [105, 110, 115, 120, 125, 130, 135, 140, 145, 150], scaling: [{stat: 'atk', ratio: 1}] }
                ]
            },
            {
                type: "burst",
                title: "Взрыв стихий: Последние лучи света",
                desc: "Наносит Электро урон по площади 5 раз.",
                attributes: [
                    { name: "Урон навыка (x5)", values: [129.6, 139.3, 149.0, 162.0, 171.7, 181.4, 194.4, 207.4, 220.3, 233.3], scaling: [{stat: 'atk', ratio: 1}] },
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
            { type: "constellation", level: 1, title: "C1: Начиная новую главу", desc: "Увеличивает урон мушкетных атак." },
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
                    { name: "Урон 1-го удара", values: [48.8, 52.8, 56.8, 62.5, 66.5, 71.0, 77.3, 83.5, 89.8, 96.6], scaling: [{stat: 'atk', ratio: 1}] },
                    { name: "Урон 2-го удара", values: [43.7, 47.3, 50.8, 55.9, 59.5, 63.6, 69.2, 74.8, 80.4, 86.5], scaling: [{stat: 'atk', ratio: 1}] }
                ]
            },
            {
                type: "skill", title: "Элем. навык: Салон одиноких сердец", desc: "Призывает участников салона.",
                attributes: [
                    { name: "Урон Кавалера Уше", values: [5.49, 5.9, 6.31, 6.86, 7.27, 7.68, 8.23, 8.78, 9.33, 9.88], scaling: [{stat: 'hp', ratio: 1}] },
                    { name: "Урон Мадам Крабалотты", values: [10.1, 10.9, 11.7, 12.7, 13.5, 14.3, 15.3, 16.3, 17.3, 18.3], scaling: [{stat: 'hp', ratio: 1}] },
                    { name: "Длительность", values: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30] }
                ]
            },
            {
                type: "burst", title: "Взрыв стихий: Да возрадуются люди", desc: "Наносит Гидро урон и создает состояние Веселья.",
                attributes: [
                    { name: "Урон активации (от HP)", values: [18.4, 19.8, 21.2, 23.0, 24.4, 25.8, 27.6, 29.4, 31.3, 33.1], scaling: [{stat: 'hp', ratio: 1}] },
                    { name: "Конвертация Фанфар", values: [0.18, 0.20, 0.21, 0.23, 0.24, 0.25, 0.27, 0.29, 0.31, 0.33] }
                ]
            },
            { type: "passive", title: "Бесконечный вальс", desc: "Если активный персонаж получает лечение..." },
            { 
                 type: "constellation", level: 1, title: "C1: Любовь - это не птица", 
                 desc: "Дает +15% бонуса лечения.",
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
                    { name: "Урон атаки 1", values: [38.1, 40.9, 43.8, 47.6, 50.4, 53.3, 57.1, 60.9, 64.7, 68.5, 72.3, 76.1, 80.9], scaling: [{stat: 'atk', ratio: 1}]  },
                    { name: "Урон атаки 2", values: [37.6, 40.4, 43.2, 47.0, 49.8, 52.6, 56.3, 60.1, 63.9, 67.6, 71.4, 75.1, 79.8], scaling: [{stat: 'atk', ratio: 1}]  },
                    { name: "Урон атаки 3", values: [25.2, 27.1, 29.0, 31.6, 33.4, 35.3, 37.9, 40.4, 42.9, 45.4, 48.0, 50.5, 53.6], scaling: [{stat: 'atk', ratio: 1}]  },
                    { name: "Урон атаки 4", values: [61.0, 65.6, 70.1, 76.2, 80.8, 85.4, 91.5, 97.6, 103.7, 109.8, 115.9, 122.0, 129.6], scaling: [{stat: 'atk', ratio: 1}]  },
                    { name: "Урон заряженной атаки", values: [130.9, 140.7, 150.5, 163.6, 173.4, 183.2, 196.3, 209.4, 222.5, 235.6, 248.7, 261.8, 278.1], scaling: [{stat: 'atk', ratio: 1}]  },
                ]
            },
            {
                type: "skill", title: "Стратегия сенета: Танец тысячи ночей", 
                desc: "Элементальный навык.",
                attributes: [
                    { 
                        name: "Урон навыка",
                        values: [76.4, 82.1, 87.8, 95.5, 101.2, 106.9, 114.6, 122.2, 129.9, 137.5, 145.1, 152.8, 163.3],
                        scaling: [
                            { stat: 'atk', ratio: 1 },           // 100% от значения как АТК
                            { stat: 'em', ratio: 152.8 / 76.4 }   // ~2.004 раза от значения как МС
                        ]
                    },
                    // НОВЫЙ ТАЛАНТ: Урон Игры химер I (Двойной скейл)
                    // 24.6% АТК + 49.3% МС (на 1 уровне)
                    // ratio для МС вычисляем как 49.3 / 24.6
                    {
                        name: "Урон Игры химер I (Нефер)",
                        values: [24.6, 26.5, 28.3, 30.8, 32.6, 34.5, 37.0, 39.4, 41.9, 44.4, 46.8, 49.3, 52.4],
                        scaling: [
                            { stat: 'atk', ratio: 1 },           // 100% от значения как АТК
                            { stat: 'em', ratio: 49.3 / 24.6 }   // ~2.004 раза от значения как МС
                        ]
                    },
                    {
                        name: "Урон Игры химер II (Нефер)",
                        values: [32.0, 34.4, 36.8, 40.0, 42.4, 44.8, 48.0, 51.3, 54.5, 57.7, 60.9, 64.1, 68.1],
                        scaling: [
                            { stat: 'atk', ratio: 1 },           // 100% от значения как АТК
                            { stat: 'em', ratio: 64.1 / 32.0 }   // ~2.004 раза от значения как МС
                        ]
                    },
                    { 
                        name: "Урон Игры химер I (Тени)",
                        values: [96.0, 103.2, 110.4, 120.0, 127.2, 134.4, 144.0, 153.6, 163.2, 172.8, 182.4, 192.0, 204.0], 
                        scaling: [{stat: 'em', ratio: 1}]  
                    },
                    { 
                        name: "Урон Игры химер II (Тени)",
                        values: [96.0, 103.2, 110.4, 120.0, 127.2, 134.4, 144.0, 153.6, 163.2, 172.8, 182.4, 192.0, 204.0], 
                        scaling: [{stat: 'em', ratio: 1}]  
                    },
                    { 
                        name: "Урон Игры химер III (Тени)",
                        values: [128.0, 137.6, 147.2, 160.0, 169.6, 179.2, 192.0, 204.8, 217.6, 230.4, 243.2, 256.0, 272.0], 
                        scaling: [{stat: 'em', ratio: 1}]  
                    },
                    { name: "Длительность Танца тени", values: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10] }
                ]
            },
            {
                type: "burst", title: "Священная клятва: Химера истинного взора", 
                desc: "Взрыв стихий.",
                attributes: [
                    {
                        name: "Урон атаки 1",
                        values: [224.6, 241.5, 258.3, 280.8, 297.6, 314.5, 337.0, 359.4, 381.9, 404.4, 426.8, 449.3, 477.4],
                        scaling: [
                            { stat: 'atk', ratio: 1 },
                            { stat: 'em', ratio: 449.3 / 224.6 }
                        ]
                    },
                    {
                        name: "Урон атаки 2",
                        values: [337.0, 362.2, 387.5, 421.2, 446.5, 471.7, 505.4, 539.1, 572.8, 606.5, 640.2, 673.9, 716.0],
                        scaling: [
                            { stat: 'atk', ratio: 1 },
                            { stat: 'em', ratio: 673.9 / 337.0 }
                        ]
                    },
                    { name: "Стоимость", values: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60] }
                ]
            },
            { 
                type: "passive", title: "Пари лунного света", 
                desc: "Когда Нефер поглащает 3 семеня лжи заряженной атакой, она получает 100 ед. мастерства стихий.",
                buff: { maxStacks: 1, bonusPerStack: { em: 100 } }
            },
            { 
                type: "passive", title: "Завеса ложных тайн", 
                desc: "Каждый уровень Завесы ложных тайн повышает исходный урон Игры химер Нефер на 8%",
                buff: { 
                    maxStacks: 3, 
                    bonusPerStack: {}, // Очищаем статы, так как меняем механику
                    talentBuff: { // НОВОЕ СВОЙСТВО
                        keywords: ["Урон Игры химер"], // Ключевое слово для поиска в названии
                        add: 8 // Сколько процентов добавлять за стак
                    }
                }
            },
            { 
                type: "passive", title: "Дар лунного знамения: Коридор сумеречных теней", 
                desc: "Когда персонажи отряда активируют реакцию Бутонизация, она превращается в Лунную бутонизацию, а базовый урон реакции Лунная бутонизация увеличивается на 0,0175% за каждую единицу мастерства стихий Нефер. Но пока бонус всегда в максималке - 14 процентов",
                buff: { maxStacks: 1, bonusPerStack: { elementDamageBonus: 14 } }
            },
            // Внутри charData -> Nefer -> talents
            { 
                type: "constellation", 
                level: 1, 
                title: "Успех начинается с плана",
                desc: "Базовый урон Игры химер Нефер повышается на 60% от её мастерства стихий. Этот эффект получает аналогичный бонус от Завесы ложных тайн.",
                buff: { 
                    maxStacks: 1, 
                    // НОВАЯ СТРУКТУРА: Дополнительный скейл
                    extraScaling: {
                        keywords: ["Урон Игры химер"], // К каким навыкам применять
                        stat: 'em',                    // От какой характеристики (МС)
                        value: 60,                     // Процент (60%)
                        affectedByTalentBuff: true     // Флаг: применять ли бонусы пассивок к этому числу?
                    }
                }
            },
            // Внутри charData -> Nefer -> talents
            { 
                type: "constellation", 
                level: 2, 
                title: "Осведомлённость питает стратегию", 
                desc: "Лимит уровней Завесы ложных тайн повышается до 5. При достижении 5 уровней МС повышается на 200 ед.",
                // Логика изменения пассивки
                modifyTarget: { 
                    title: "Завеса ложных тайн", // Ищем пассивку с этим именем
                    newMax: 5 // Меняем ей макс. стаки на 5
                },
                // Логика бонуса МС
                bonusIfTargetStacks: {
                    title: "Завеса ложных тайн", // Смотрим на стаки этой пассивки
                    count: 5, // Если стаков >= 5
                    stats: { em: 200 } // Даем бонус
                }
            },
            { 
                type: "constellation", level: 3, title: "Обман скрывает истину", 
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
        type: "catalyst", 
        img: "imgs/realityoftruth.png", 
        stats: {
            baseAtk: 514,
            subStat: { key: "critDmg", name: "Крит. урон", value: 88.2, isPercent: true }
        },
        buff: {
            name: "Подлинный смысл лжи",
            desc: "Шанс крит. попадания повышается на 8%. При активации элементального навыка экипированный персонаж получает эффект Секрет лжи: мастерство стихий повышается на 80 ед. на 12 сек. Когда экипированный персонаж наносит врагу урон Лунной бутонизации, он получает эффект Луна истины: крит. урон повышается на 24% на 4 сек. Когда Секрет лжи и Луна истины действуют одновременно, результат обоих эффектов повышается на 50%.",
            maxStacks: 1,
            bonusPerStack: { critRate: 8, em:120, critDmg: 36}
        }
    }
];