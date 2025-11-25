export const iron_sting = {
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
    }