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
            name: "Клятва поборника",
            desc: "Крит. урон +20%. При увеличении Долга жизни урон повышается.",
            maxStacks: 1, 
            bonusPerStack: { critDmg: 20, elementDamageBonus: 16 }
        }
    }