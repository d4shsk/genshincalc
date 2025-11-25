export const splendor =  {
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
    }