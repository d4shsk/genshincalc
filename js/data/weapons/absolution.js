export const absolution = {
        id: "absolution",
        name: "Отпущение грехов",
        type: "sword",
        img: "imgs/weapon_absolution.png",
        stats: {
            baseAtk: 674,
            subStat: { key: "critDmg", name: "Крит. урон", value: 44.1, isPercent: true }
        },
        buff: { 
            name: "Пакт смерти",
            desc: "Крит. урон увеличивается на 20%. Когда Долг жизни возрастает, наносимый экипированным персонажем урон увеличивается на 16% на 6 сек. Этот эффект может складываться до 3 раз.",
            maxStacks: 3, // Теперь слайдер будет от 0 до 3
            
            // 1. Статичный бонус (Применяется всегда, когда оружие надето)
            bonusFlat: { critDmg: 20 },
            
            // 2. Стакаемый бонус (Умножается на значение слайдера)
            bonusPerStack: { elementDamageBonus: 16 }
        }
    }