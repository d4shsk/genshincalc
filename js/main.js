// 1. ИМПОРТЫ ДАННЫХ
// Обратите внимание на пути: они должны соответствовать вашей структуре папок
import { characters } from './data/characters.js';
import { weapons } from './data/weapons.js';

// 2. ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
let charData = characters;
let weaponData = weapons;

let currentChar = null;
let currentWeapon = null;
let totalBaseStats = {};
let bonusStats = {};
let finalStats = {}; 

let activeBuffs = { weapon: 0 };
let modal, modalList, modalTitle;

// ==============================================
// ЛОГИКА ИНТЕРФЕЙСА (UI)
// ==============================================

function switchTab(tab) {
    document.querySelectorAll('.sidebar-icon').forEach(icon => icon.classList.remove('active'));
    document.getElementById(`tab-btn-${tab}`).classList.add('active');
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`tab-content-${tab}`).classList.add('active');
    const titles = { 'char': 'Персонаж', 'weapon': 'Оружие' };
    document.getElementById('right-panel-title').innerText = titles[tab];
}

function openModal(type) {
    modalList.innerHTML = '';
    modal.style.display = 'flex';
    if (type === 'char') {
        modalTitle.innerText = "Выберите персонажа";
        charData.forEach(char => { createModalItem(char, () => { renderCharacter(char.id); modal.style.display = 'none'; }); });
    } else if (type === 'weapon') {
        modalTitle.innerText = "Выберите оружие";
        if (!currentChar) { modalList.innerHTML = "<div style='padding:10px; color:#aaa'>Сначала выберите персонажа</div>"; return; }
        
        const filteredWeapons = weaponData.filter(w => w.type === currentChar.weaponType);
        
        if (filteredWeapons.length === 0) {
            modalList.innerHTML = "<div style='padding:10px; color:#aaa'>Нет подходящего оружия</div>";
        } else {
            filteredWeapons.forEach(wep => { createModalItem(wep, () => { renderWeapon(wep.id); modal.style.display = 'none'; }); });
        }
    }
}

function createModalItem(item, onClick) {
    const el = document.createElement('div');
    el.className = 'select-item';
    el.innerHTML = `<img src="${item.avatar || item.img}"><span style="font-weight:bold">${item.name}</span>`;
    el.onclick = onClick;
    modalList.appendChild(el);
}

// Функция сворачивания/разворачивания талантов
function toggleTalent(headerElement) {
    const card = headerElement.parentElement;
    card.classList.toggle('collapsed');
}

// ==============================================
// ЛОГИКА РЕНДЕРИНГА (RENDER)
// ==============================================

function renderCharacter(charId) {
    currentChar = charData.find(c => c.id === charId);
    if (!currentChar) return;
    
    // Сброс баффов талантов, сохраняем стаки оружия
    const oldWepStack = activeBuffs.weapon || 0;
    activeBuffs = { weapon: oldWepStack }; 
    
    const elementColor = getElementColor(currentChar.element);

    document.getElementById('char-name').innerText = currentChar.name;
    const av = document.getElementById('char-avatar-img');
    av.style.backgroundImage = `url('${currentChar.avatar}')`;
    av.style.borderColor = elementColor;

    // Сбрасываем слайдер созвездий
    const cSlider = document.getElementById('slider-constellation');
    if(cSlider) cSlider.value = 0;

    // Запускаем цепочку обновлений
    updateConstellations(0);

    // Проверка оружия на совместимость
    if (currentWeapon && currentWeapon.type !== currentChar.weaponType) {
        currentWeapon = null;
        const defaultWep = weaponData.find(w => w.type === currentChar.weaponType);
        if (defaultWep) renderWeapon(defaultWep.id);
        else updateTotalStats();
    } else {
         updateTotalStats();
    }
}

function renderWeapon(weaponId) {
    currentWeapon = weaponData.find(w => w.id === weaponId);
    if (!currentWeapon) return;

    document.getElementById('weapon-name').innerText = currentWeapon.name;
    const av = document.getElementById('weapon-avatar-img');
    av.style.backgroundImage = `url('${currentWeapon.img}')`;
    av.style.borderColor = "#fff";

    document.getElementById('weapon-base-atk-val').innerText = currentWeapon.stats.baseAtk;
    const sub = currentWeapon.stats.subStat;
    document.getElementById('weapon-substat-label').innerText = sub.name;
    document.getElementById('weapon-substat-val').innerText = sub.value + (sub.isPercent ? '%' : '');
    
    const buff = currentWeapon.buff || {};
    document.getElementById('weapon-desc').innerHTML = `<strong style="color:#fff; display:block; margin-bottom:5px;">${buff.name || ''}</strong>${buff.desc || ''}`;

    const weaponBox = document.getElementById('weapon-passive-box');
    weaponBox.innerHTML = '';
    activeBuffs.weapon = 0; 
    
    if(buff && buff.maxStacks) {
        weaponBox.appendChild(renderBuffControl(buff.maxStacks, 'weapon', 'Эффект активен'));
    } else {
        weaponBox.innerHTML = '<span style="color:#777; font-size:0.8rem">Нет активного эффекта</span>';
    }

    updateTotalStats();
}

function renderTalents(char, color) {
    const container = document.getElementById('talents-container');
    container.innerHTML = '';
    
    const currentCElement = document.getElementById('slider-constellation');
    const currentC = currentCElement ? parseInt(currentCElement.value) : 0;

    char.talents.forEach((talent, idx) => {
        const isConstellation = talent.type === 'constellation';
        let contentHTML = '';
        
        // --- ЛОГИКА БАФФОВ (включая C2 Клоринды/Нефер) ---
        if (talent.buff) {
            let maxStacks = talent.buff.maxStacks;
            
            // Проверяем, меняют ли созвездия лимит стаков этой пассивки
            char.talents.forEach(c => {
                if (c.type === 'constellation' && c.level <= currentC && c.modifyTarget && c.modifyTarget.title === talent.title) {
                    if (c.modifyTarget.newMax) maxStacks = c.modifyTarget.newMax;
                }
            });

            const key = `talent-${idx}`;
            // Если стаков больше нового лимита (например при отключении С2) - сбрасываем
            if (activeBuffs[key] > maxStacks) {
                activeBuffs[key] = maxStacks;
            }

            contentHTML += renderBuffControl(maxStacks, key, 'Эффект активен').outerHTML;
        }

        // --- ТАБЛИЦА АТРИБУТОВ ---
        let attrHtml = '';
        const isActive = ['normal', 'skill', 'burst'].includes(talent.type);
        if (isActive && talent.attributes) {
            attrHtml += '<div class="talent-attrs-table">';
            talent.attributes.forEach((attr, attrIdx) => {
                attrHtml += `<div class="talent-attr-row">
                    <span class="talent-attr-name">${attr.name}</span>
                    <div class="talent-attr-val-group" id="val-${talent.type}-${attrIdx}"></div>
                </div>`;
            });
            attrHtml += '</div>';
        }

        // --- СБОРКА HTML (ИСПРАВЛЕННАЯ) ---
        const cardClass = isConstellation ? 'talent-constellation-card' : 'talent-card';
        
        let headerLeft = '';
        if (isConstellation) {
            headerLeft = `<div><span style="background:#333;padding:2px 6px;border-radius:4px;margin-right:8px;border:1px solid #555;font-size:0.8rem">C${talent.level}</span> ${talent.title}</div>`;
        } else {
            headerLeft = `<div style="color:${color}">${talent.title}</div>`;
        }

        const div = document.createElement('div');
        div.className = cardClass;
        
        if (isConstellation) {
            div.setAttribute('data-c-level', talent.level);
            div.style.display = 'none'; 
        }

        // ВАЖНО: Возвращаем структуру с talent-header (onclick) и talent-body (отступы)
        div.innerHTML = `
            <div class="talent-header" onclick="toggleTalent(this)">
                ${headerLeft}
                <i class="fa-solid fa-chevron-down talent-toggle-icon"></i>
            </div>
            <div class="talent-body">
                <p style="opacity:0.8; margin-bottom: 10px;">${talent.desc}</p>
                ${contentHTML}
                ${attrHtml}
            </div>
        `;
        container.appendChild(div);
    });

    // Инициализация слайдеров
    ['normal', 'skill', 'burst'].forEach(t => {
        const slider = document.getElementById(`slider-${t}`);
        if(slider && slider.value === "10" && activeBuffs.weapon === 0) {}
    });
    
    // Вызываем обновление видимости созвездий (но не их логику пересчета, чтобы избежать рекурсии, 
    // так как renderTalents уже вызывается из updateConstellations)
    if (currentCElement) {
        document.querySelectorAll('.talent-constellation-card').forEach(card => {
            const cLvl = parseInt(card.getAttribute('data-c-level'));
            card.style.display = (cLvl <= currentC) ? 'block' : 'none';
        });
    }
}

function renderBuffControl(maxStacks, stateKey, labelTitle) {
    const container = document.createElement('div');
    container.className = 'buff-control-box';
    const header = document.createElement('div');
    header.className = 'buff-header';

    if (maxStacks === 1) {
        header.innerHTML = `<span class="buff-title">${labelTitle}</span>`;
        const label = document.createElement('label');
        label.className = 'toggle-switch';
        label.innerHTML = `<input type="checkbox" onchange="updateBuffState('${stateKey}', this.checked ? 1 : 0)"><span class="slider-switch"></span>`;
        header.appendChild(label);
        container.appendChild(header);
    } else {
        header.innerHTML = `<span class="buff-title">Стаки эффекта</span><span style="font-size:0.8rem; color:#aaa" id="display-${stateKey}">0 / ${maxStacks}</span>`;
        container.appendChild(header);
        const range = document.createElement('div');
        range.className = 'level-control';
        range.style.marginBottom = '0';
        range.innerHTML = `<input type="range" class="custom-range" min="0" max="${maxStacks}" value="0" oninput="updateBuffState('${stateKey}', this.value)">`;
        container.appendChild(range);
    }
    return container;
}

// ==============================================
// ЛОГИКА РАСЧЕТОВ (CALCULATIONS)
// ==============================================

function updateBuffState(key, val) {
    activeBuffs[key] = parseInt(val);
    
    const display = document.getElementById(`display-${key}`);
    if (display) {
        let currentMax = 1;
        if (key === 'weapon' && currentWeapon && currentWeapon.buff) {
            currentMax = currentWeapon.buff.maxStacks;
        } else if (key.startsWith('talent-')) {
            const idx = parseInt(key.split('-')[1]);
            const talent = currentChar.talents[idx];
            currentMax = talent.buff.maxStacks;
            
            const currentC = parseInt(document.getElementById('slider-constellation').value);
            currentChar.talents.forEach(c => {
                if(c.type === 'constellation' && c.level <= currentC && c.modifyTarget && c.modifyTarget.title === talent.title) {
                    currentMax = c.modifyTarget.newMax;
                }
            });
        }
        display.innerText = `${activeBuffs[key]} / ${currentMax}`;
    }
    updateTotalStats();
}

function updateMaxTalentLevels() {
    if (!currentChar) return;
    const currentC = parseInt(document.getElementById('slider-constellation').value);
    const maxLevels = { normal: 10, skill: 10, burst: 10 };

    currentChar.talents.forEach(talent => {
        if (talent.type === 'constellation' && talent.level <= currentC && talent.levelBoost) {
            maxLevels[talent.levelBoost.type] += talent.levelBoost.value; 
        }
    });

    ['normal', 'skill', 'burst'].forEach(type => {
        const slider = document.getElementById(`slider-${type}`);
        if (slider) {
            const newMax = maxLevels[type];
            slider.max = newMax;
            if (parseInt(slider.value) > newMax) {
                slider.value = newMax; 
                updateTalentLevel(slider, `val-${type === 'normal' ? 'atk' : type}`, type);
            }
        }
    });
}

function updateTotalStats() {
    if (!currentChar) return;
    totalBaseStats = {};
    bonusStats = {}; 

    // 1. База персонажа
    for (const key in currentChar.stats) totalBaseStats[key] = currentChar.stats[key].base;

    // 2. Оружие
    if (currentWeapon) {
        totalBaseStats['atk'] += currentWeapon.stats.baseAtk;
        const sub = currentWeapon.stats.subStat;
        if(sub) addBonus(sub.key, sub.value);
        
        const wBuff = currentWeapon.buff;
        if (wBuff) {
            // А) Применяем статичный бонус (если есть), например 20% КУ у Отпущения
            if (wBuff.bonusFlat) {
                applyBuff(wBuff.bonusFlat, 1);
            }

            // Б) Применяем стакаемый бонус
            const wStacks = activeBuffs['weapon'] || 0;
            if (wStacks > 0 && wBuff.bonusPerStack) {
                applyBuff(wBuff.bonusPerStack, wStacks);
            }
        }
    }

    const currentC = parseInt(document.getElementById('slider-constellation').value);

    // 3. Таланты
    currentChar.talents.forEach((talent, idx) => {
        if (talent.buff) {
            if (talent.type === 'constellation' && talent.level > currentC) return; 
            
            // То же самое для талантов: поддержка bonusFlat и bonusPerStack
            
            // А) Статичный бонус таланта (если вдруг понадобится)
            if (talent.buff.bonusFlat) {
                applyBuff(talent.buff.bonusFlat, 1);
            }

            // Б) Стакаемый бонус
            const tStacks = activeBuffs[`talent-${idx}`] || 0;
            if (tStacks > 0 && talent.buff.bonusPerStack) {
                applyBuff(talent.buff.bonusPerStack, tStacks);
            }
        }
        
        // Логика C2 и прочих условий
        if (talent.type === 'constellation' && talent.level <= currentC && talent.bonusIfTargetStacks) {
            const targetRule = talent.bonusIfTargetStacks;
            const targetIdx = currentChar.talents.findIndex(t => t.title === targetRule.title);
            if (targetIdx !== -1) {
                const currentTargetStacks = activeBuffs[`talent-${targetIdx}`] || 0;
                if (currentTargetStacks >= targetRule.count) {
                    for (const sKey in targetRule.stats) addBonus(sKey, targetRule.stats[sKey]);
                }
            }
        }
    });

    // Рендер левой панели
    for (const key in totalBaseStats) {
        const el = document.getElementById(`base-${key}`);
        if (el) {
            el.innerText = formatStat(totalBaseStats[key], currentChar.stats[key].isPercent);
            if (key === 'atk' && currentWeapon) el.classList.add('boosted'); else el.classList.remove('boosted');
        }
    }
    recalc();
}

function addBonus(key, value) { bonusStats[key] = (bonusStats[key] || 0) + value; }
function applyBuff(bonusObj, stacks) { for (const key in bonusObj) addBonus(key, bonusObj[key] * stacks); }

function recalc() {
    if (!currentChar) return;
    finalStats = {};
    const allStats = ['hp', 'atk', 'def', 'em', 'er', 'critRate', 'critDmg', 'healingBonus', 'elementDamageBonus'];

    allStats.forEach(key => {
        const isPercent = currentChar.stats[key].isPercent;
        const base = totalBaseStats[key] || 0;
        const inputVal = parseFloat(document.getElementById(`input-${key}`).value) || 0;
        const bonus = bonusStats[key] || 0;
        const total = base + inputVal + bonus;
        
        finalStats[key] = total; 

        const totalEl = document.getElementById(`total-${key}`);
        totalEl.innerText = formatStat(total, isPercent);
        totalEl.style.color = bonus > 0 ? "#dcbfa8" : "#fff";
    });

    // Резисты (Срез из C4 + ручной ввод)
    const inputRes = parseFloat(document.getElementById('input-resShred').value) || 0;
    const bonusRes = bonusStats['resShred'] || 0; 
    const totalResShred = inputRes + bonusRes;
    document.getElementById('total-resShred').innerText = totalResShred + '%';
    document.getElementById('total-resShred').style.color = bonusRes > 0 ? "#dcbfa8" : "#fff";
    finalStats['resShred'] = totalResShred;

    // Пассивка "Дар лунного знамения" (База лунной бутонизации от МС)
    const lunarPassiveIdx = currentChar.talents.findIndex(t => t.title.includes("Дар лунного знамения"));
    let lunarBaseBonus = 0;
    if (lunarPassiveIdx !== -1) {
        // Эта пассивка всегда активна у Нефер (или при включении, если она опциональна)
        // Проверим activeBuffs на всякий случай, если она сделана переключаемой
        // Если она maxStacks: 1, то по дефолту 0. Можно сделать её включенной по умолчанию в init.
        // Для простоты: если она в списке талантов, считаем активной.
        const currentEM = finalStats['em'];
        lunarBaseBonus = currentEM * 0.0175;
        if (lunarBaseBonus > 14) lunarBaseBonus = 14;
    }
    finalStats['lunarBloomBaseBonus'] = lunarBaseBonus;

    // Бонус Лунной Бутонизации (Ручной + С6)
    const inputLunar = parseFloat(document.getElementById('input-lunarBonus').value) || 0;
    const constLunar = bonusStats['lunarBloomBonus'] || 0;
    const totalLunar = inputLunar + constLunar;
    document.getElementById('total-lunarBonus').innerText = totalLunar + '%';
    document.getElementById('total-lunarBonus').style.color = constLunar > 0 ? "#dcbfa8" : "#fff";
    finalStats['lunarBloomBonus'] = totalLunar;

    updateAllTalentValues();
}

function getElementColor(el) {
    if(el == "hydro") return "#84a5ff";
    if(el == "electro") return "#d1aef8";
    if(el == "dendro") return "#a5c83b";
    return "#fff";
}

function formatStat(val, isPercent) {
    if (isPercent) return val.toFixed(1) + '%';
    return Math.round(val).toLocaleString('ru-RU');
}

function updateTalentLevel(slider, outputId, type) {
    const level = parseInt(slider.value);
    document.getElementById(outputId).innerText = level;
    updateAllTalentValues();
}

function updateAllTalentValues() {
    if (!currentChar) return;

    ['normal', 'skill', 'burst'].forEach(type => {
        const slider = document.getElementById(`slider-${type}`);
        if (!slider) return;
        const level = parseInt(slider.value);
        
        const talent = currentChar.talents.find(t => t.type === type);
        if (!talent || !talent.attributes) return;

        talent.attributes.forEach((attr, idx) => {
            const container = document.getElementById(`val-${type}-${idx}`);
            if (!container) return;

            let valPercent = 0;
            if (level <= attr.values.length) {
                valPercent = attr.values[level - 1];
            } else {
                // Экстраполяция
                const last = attr.values[attr.values.length - 1];
                const prev = attr.values[attr.values.length - 2];
                const step = last - prev;
                valPercent = last + (step * (level - attr.values.length));
            }

            // --- СБОР БОНУСОВ ---
            let percentBonus = 0; // Доп % (Нефер)
            let flatBonus = 0;    // Доп Урон числом (Клоринда)
            let collectedExtraScalings = []; // Доп скейлы (Нефер С1/С6)

            const currentC = parseInt(document.getElementById('slider-constellation').value);

            // 1. Оружие
            if (currentWeapon && currentWeapon.buff && currentWeapon.buff.talentBuff) {
                const stacks = activeBuffs['weapon'] || 0;
                if (stacks > 0 && currentWeapon.buff.talentBuff.keywords.some(k => attr.name.includes(k))) {
                    percentBonus += currentWeapon.buff.talentBuff.add * stacks;
                }
            }

            // 2. Таланты и Созвездия
            currentChar.talents.forEach((t, tIdx) => {
                if (t.type === 'constellation' && t.level > currentC) return;

                if (t.buff) {
                    const stacks = activeBuffs[`talent-${tIdx}`] || 0;
                    const isActive = t.buff.maxStacks > 0 ? stacks > 0 : true;

                    // А) Процентный бонус (talentBuff)
                    if (isActive && t.buff.talentBuff) {
                        if (t.buff.talentBuff.keywords.some(k => attr.name.includes(k))) {
                            percentBonus += t.buff.talentBuff.add * stacks;
                        }
                    }

                    // Б) Добавочный Базовый Урон (additiveBaseDmg) - КЛОРИНДА
                    if (isActive && t.buff.additiveBaseDmg) {
                        // Проверяем модификации от C2 (перезапись параметров)
                        let rule = { ...t.buff.additiveBaseDmg }; // Копия
                        
                        // Ищем C2 (или другое созвездие), которое модифицирует эту пассивку
                        currentChar.talents.forEach(c => {
                            if (c.type === 'constellation' && c.level <= currentC && c.modifyTarget && c.modifyTarget.title === t.title && c.modifyTarget.newAdditive) {
                                // Применяем улучшения (например, 20% -> 30%, 1800 -> 2700)
                                rule.percent = c.modifyTarget.newAdditive.percent;
                                rule.max = c.modifyTarget.newAdditive.max;
                            }
                        });

                        if (rule.keywords.some(k => attr.name.includes(k))) {
                            const statVal = finalStats[rule.stat] || 0;
                            // Формула: (Stat * Percent% * Stacks)
                            let addedDmg = statVal * (rule.percent / 100) * stacks;
                            // Применяем кап (1800 или 2700)
                            if (addedDmg > rule.max) addedDmg = rule.max;
                            
                            flatBonus += addedDmg;
                        }
                    }

                    // В) Доп. скейлы (extraScalings) - НЕФЕР
                    if (isActive) {
                        if (t.buff.extraScaling && t.buff.extraScaling.keywords.some(k => attr.name.includes(k))) {
                            collectedExtraScalings.push(t.buff.extraScaling);
                        }
                        if (t.buff.extraScalings) {
                            t.buff.extraScalings.forEach(es => {
                                if (es.keywords.some(k => attr.name.includes(k))) collectedExtraScalings.push(es);
                            });
                        }
                    }
                }
            });

            // Добавляем percentBonus к базе
            valPercent += percentBonus;

            const isLunarBloom = attr.isLunarBloom || false;
            // Передаем flatBonus в функцию расчета
            const result = calculateTalentValue(valPercent, attr.scaling, attr.name, collectedExtraScalings, percentBonus, isLunarBloom, flatBonus);
            
            if (result.isDamage) {
                const format = (num) => Math.round(num).toLocaleString('ru-RU');
                container.innerHTML = `
                    <div class="dmg-grid">
                        <div class="dmg-cell">
                            <span class="dmg-label">Обычный</span>
                            <span class="dmg-val val-norm">${format(result.nonCrit)}</span>
                        </div>
                        <div class="dmg-cell">
                            <span class="dmg-label">Средний</span>
                            <span class="dmg-val val-avg">${format(result.avg)}</span>
                        </div>
                        <div class="dmg-cell">
                            <span class="dmg-label">Крит</span>
                            <span class="dmg-val val-crit">${format(result.crit)}</span>
                        </div>
                    </div>
                    <span class="talent-calc-formula">${result.formula}</span>
                `;
            } else {
                container.innerHTML = `<div class="non-damage-val">${parseFloat(valPercent.toFixed(1))}${result.suffix}</div>`;
            }
        });
    });
}

function calculateTalentValue(totalBasePercent, scaling, name, extraScalings = [], percentBonus = 0, isLunarBloom = false, flatBonus = 0) {
    const isNonDamage = name.includes('КД') || name.includes('Длительность') || name.includes('Стоимость') || name.includes('Энергия');
    if (isNonDamage) return { isDamage: false, suffix: name.includes('КД') || name.includes('Длительность') ? 'с' : '' };

    const rules = scaling || [{ stat: 'atk', ratio: 1 }];
    
    let baseDmg = 0;
    let formulaParts = [];

    // 1. Стандартные скейлы
    rules.forEach(rule => {
        const statVal = finalStats[rule.stat] || 0; 
        const ratio = rule.ratio || 1;
        const partDmg = (totalBasePercent / 100) * ratio * statVal;
        baseDmg += partDmg;
        const displayedPercent = (totalBasePercent * ratio).toFixed(1);
        formulaParts.push(`${displayedPercent}% ${rule.stat.toUpperCase()}`);
    });

    // 2. Доп. скейлы (Нефер)
    extraScalings.forEach(es => {
        let extraPercent = es.value;
        if (es.affectedByTalentBuff) extraPercent += percentBonus;
        const extraDmgVal = (extraPercent / 100) * (finalStats[es.stat] || 0);
        baseDmg += extraDmgVal;
        formulaParts.push(`<span style="color:#ffce44">+${extraPercent.toFixed(1)}% ${es.stat.toUpperCase()}</span>`);
    });

    // 3. Добавочный урон (Клоринда, Юнь Цзинь, Шэнь Хэ)
    // Прибавляется к Base Damage ДО умножения на бонусы/криты
    if (flatBonus > 0) {
        baseDmg += flatBonus;
        formulaParts.push(`<span style="color:#81c784">${Math.round(flatBonus)} Flat</span>`);
    }

    // 4. Множители
    let finalBase = baseDmg;
    let bonusMult = 1;

    if (isLunarBloom) {
        const baseBonus = (finalStats['lunarBloomBaseBonus'] || 0) / 100;
        const em = finalStats['em'] || 0;
        const emCurve = (6 * em) / (em + 2000); 
        const reactBonus = (finalStats['lunarBloomBonus'] || 0) / 100;
        const totalReactMult = 1 + emCurve + reactBonus;
        
        finalBase = baseDmg * (1 + baseBonus) * totalReactMult;
        bonusMult = 1; 
        formulaParts.push(`<span style="color:#a5c83b">(LUNAR)</span>`);
    } else {
        const elemBonus = (finalStats['elementDamageBonus'] || 0) / 100;
        bonusMult = 1 + elemBonus;
    }

    const cr = Math.min(Math.max(finalStats['critRate'] || 0, 0), 100) / 100;
    const cd = (finalStats['critDmg'] || 0) / 100;
    const critMult = 1 + cd;

    const defMult = 0.5; 

    const baseRes = 0.1; 
    const resShred = (finalStats['resShred'] || 0); 
    let finalRes = baseRes - (resShred / 100);
    let resMult = 0;
    if (finalRes < 0) resMult = 1 - (finalRes / 2);
    else if (finalRes >= 0 && finalRes < 0.75) resMult = 1 - finalRes;
    else resMult = 1 / (4 * finalRes + 1);

    const nonCrit = finalBase * bonusMult * defMult * resMult;
    const crit = nonCrit * critMult;
    const avg = finalBase * bonusMult * (1 + (cr * cd)) * defMult * resMult;

    return {
        isDamage: true,
        nonCrit: nonCrit,
        crit: crit,
        avg: avg,
        formula: formulaParts.join(' + ')
    };
}

function updateConstellations(val) {
    const level = parseInt(val);
    document.getElementById('val-constellation').innerText = "C" + level;
    
    const elementColor = getElementColor(currentChar.element);

    renderTalents(currentChar, elementColor);

    document.querySelectorAll('.talent-constellation-card').forEach(card => {
        const cLvl = parseInt(card.getAttribute('data-c-level'));
        card.style.display = (cLvl <= level) ? 'block' : 'none';
    });
    
    updateMaxTalentLevels(); 
    updateTotalStats();
}

// ==============================================
// ИНИЦИАЛИЗАЦИЯ
// ==============================================

function init() {
    modal = document.getElementById('modalOverlay');
    modalList = document.getElementById('modalList');
    modalTitle = document.getElementById('modalTitle');
    modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

    renderCharacter(charData[0].id);
    // Попытка найти подходящее оружие, иначе первое
    const firstWep = weaponData.find(w => w.type === charData[0].weaponType);
    if(firstWep) renderWeapon(firstWep.id);
}

// Экспорт функций в глобальную область видимости для HTML-обработчиков
window.switchTab = switchTab;
window.openModal = openModal;
window.updateTalentLevel = updateTalentLevel;
window.updateConstellations = updateConstellations;
window.toggleTalent = toggleTalent;
window.recalc = recalc;
window.updateBuffState = updateBuffState; // Не забудьте добавить это!

// Запуск
init();