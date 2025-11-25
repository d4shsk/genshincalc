export const furina =  {
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
    }