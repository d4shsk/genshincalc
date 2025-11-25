export const clorinde = {
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
    }