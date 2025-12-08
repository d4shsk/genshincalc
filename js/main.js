// 1. ИМПОРТЫ
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
// 1. UI И ИНИЦИАЛИЗАЦИЯ
// ==============================================

function init() {
    modal = document.getElementById('modalOverlay');
    modalList = document.getElementById('modalList');
    modalTitle = document.getElementById('modalTitle');
    modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

    renderCharacter(charData[0].id);
    const firstWep = weaponData.find(w => w.type === charData[0].weaponType);
    if(firstWep) renderWeapon(firstWep.id);
}

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
        if (filteredWeapons.length === 0) modalList.innerHTML = "<div style='padding:10px; color:#aaa'>Нет подходящего оружия</div>";
        filteredWeapons.forEach(wep => { createModalItem(wep, () => { renderWeapon(wep.id); modal.style.display = 'none'; }); });
    }
}

function createModalItem(item, onClick) {
    const el = document.createElement('div');
    el.className = 'select-item';
    el.innerHTML = `<img src="${item.avatar || item.img}"><span style="font-weight:bold">${item.name}</span>`;
    el.onclick = onClick;
    modalList.appendChild(el);
}

function toggleTalent(headerElement) {
    headerElement.parentElement.classList.toggle('collapsed');
}

// ==============================================
// 2. РЕНДЕР (Render)
// ==============================================

function renderCharacter(charId) {
    currentChar = charData.find(c => c.id === charId);
    if (!currentChar) return;
    
    const oldWepStack = activeBuffs.weapon || 0;
    activeBuffs = { weapon: oldWepStack }; 
    
    const elementColor = getElementColor(currentChar.element);

    document.getElementById('char-name').innerText = currentChar.name;
    const av = document.getElementById('char-avatar-img');
    av.style.backgroundImage = `url('${currentChar.avatar}')`;
    av.style.borderColor = elementColor;

    // Скрытие/Показ поля "Долг жизни"
    const bolRow = document.getElementById('row-bondOfLife');
    const bolInput = document.getElementById('input-bondOfLife');
    if (bolRow) {
        if (currentChar.id === 'clorinde') {
            bolRow.style.display = 'grid';
        } else {
            bolRow.style.display = 'none';
            if (bolInput) bolInput.value = ''; 
        }
    }

    const cSlider = document.getElementById('slider-constellation');
    if(cSlider) cSlider.value = 0;

    updateConstellations(0); // Запускает цепочку рендера талантов и статов

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
    
    if(buff && buff.maxStacks !== undefined) {
        // Если maxStacks задан (даже 0), рисуем статус
        if (buff.maxStacks > 0) {
            weaponBox.appendChild(renderBuffControl(buff.maxStacks, 'weapon', 'Эффект активен'));
        } else {
            weaponBox.innerHTML = '<span style="color:#dcbfa8; font-size:0.8rem">Эффект применяется автоматически</span>';
        }
    } else {
        weaponBox.innerHTML = '<span style="color:#777; font-size:0.8rem">Нет активного эффекта</span>';
    }

    updateTotalStats();
}

function renderTalents(char, color) {
    const container = document.getElementById('talents-container');
    container.innerHTML = '';
    const currentC = parseInt(document.getElementById('slider-constellation').value);

    char.talents.forEach((talent, idx) => {
        const isConstellation = talent.type === 'constellation';
        let contentHTML = '';
        
        if (talent.buff) {
            // Учитываем модификации (C2)
            let maxStacks = talent.buff.maxStacks;
            char.talents.forEach(c => {
                if (c.type === 'constellation' && c.level <= currentC && c.modifyTarget && c.modifyTarget.title === talent.title) {
                    if (c.modifyTarget.newMax) maxStacks = c.modifyTarget.newMax;
                }
            });

            const key = `talent-${idx}`;
            if (activeBuffs[key] > maxStacks) activeBuffs[key] = maxStacks;

            if (maxStacks > 0) {
                contentHTML += renderBuffControl(maxStacks, key, 'Эффект активен').outerHTML;
            }
        }

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

        const cardClass = isConstellation ? 'talent-constellation-card' : 'talent-card';
        let headerLeft = isConstellation 
            ? `<div><span style="background:#333;padding:2px 6px;border-radius:4px;margin-right:8px;border:1px solid #555;font-size:0.8rem">C${talent.level}</span> ${talent.title}</div>`
            : `<div style="color:${color}">${talent.title}</div>`;

        const div = document.createElement('div');
        div.className = cardClass;
        if (isConstellation) {
            div.setAttribute('data-c-level', talent.level);
            div.style.display = 'none'; 
        }

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

    ['normal', 'skill', 'burst'].forEach(t => {
        const slider = document.getElementById(`slider-${t}`);
        if(slider && slider.value === "10" && activeBuffs.weapon === 0) {}
    });

    if (currentC > 0) {
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
// 3. ОБРАБОТКА ИЗМЕНЕНИЙ (UPDATES)
// ==============================================

function updateBuffState(key, val) {
    activeBuffs[key] = parseInt(val);
    const display = document.getElementById(`display-${key}`);
    if (display) {
        let currentMax = 1;
        if (key === 'weapon') {
            currentMax = currentWeapon.buff.maxStacks;
        } else {
            const idx = parseInt(key.split('-')[1]);
            const talent = currentChar.talents[idx];
            currentMax = talent.buff.maxStacks;
            // Проверка модификаций C2
            const currentC = parseInt(document.getElementById('slider-constellation').value);
            currentChar.talents.forEach(c => {
                if(c.type === 'constellation' && c.level <= currentC && c.modifyTarget && c.modifyTarget.title === talent.title) {
                    if (c.modifyTarget.newMax) currentMax = c.modifyTarget.newMax;
                }
            });
        }
        display.innerText = `${activeBuffs[key]} / ${currentMax}`;
    }
    updateTotalStats();
}

function updateTalentLevel(slider, outputId, type) {
    document.getElementById(outputId).innerText = slider.value;
    updateAllTalentValues();
}

function updateConstellations(val) {
    const level = parseInt(val);
    document.getElementById('val-constellation').innerText = "C" + level;
    
    // Перерисовываем таланты (нужно для обновления слайдеров пассивок при C2)
    renderTalents(currentChar, getElementColor(currentChar.element));

    document.querySelectorAll('.talent-constellation-card').forEach(card => {
        const cLvl = parseInt(card.getAttribute('data-c-level'));
        card.style.display = (cLvl <= level) ? 'block' : 'none';
    });
    
    // Обновляем макс уровни скиллов (+3)
    updateMaxTalentLevels(); 
    // Пересчитываем статы
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

    for (const key in currentChar.stats) totalBaseStats[key] = currentChar.stats[key].base;

    // Бонусы оружия
    if (currentWeapon) {
        totalBaseStats['atk'] += currentWeapon.stats.baseAtk;
        const sub = currentWeapon.stats.subStat;
        if(sub) addBonus(sub.key, sub.value);
        
        const wBuff = currentWeapon.buff;
        if (wBuff) {
            if (wBuff.bonusFlat) applyBuff(wBuff.bonusFlat, 1);
            if (activeBuffs['weapon'] > 0 && wBuff.bonusPerStack) applyBuff(wBuff.bonusPerStack, activeBuffs['weapon']);
        }
    }

    const currentC = parseInt(document.getElementById('slider-constellation').value);

    // Бонусы талантов
    currentChar.talents.forEach((talent, idx) => {
        // Обычные баффы
        if (talent.buff) {
            if (talent.type === 'constellation' && talent.level > currentC) return; 
            
            const tStacks = activeBuffs[`talent-${idx}`] || 0;
            // Если maxStacks = 0, считаем всегда активным (1 стак), иначе берем из UI
            const multiplier = talent.buff.maxStacks > 0 ? tStacks : 1;
            
            if (multiplier > 0 && talent.buff.bonusPerStack) {
                applyBuff(talent.buff.bonusPerStack, multiplier);
            }
        }
        
        // Бонусы по условию (C2 Нефер: МС при 5 стаках)
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

    for (const key in totalBaseStats) {
        const el = document.getElementById(`base-${key}`);
        if (el) {
            el.innerText = formatStat(totalBaseStats[key], currentChar.stats[key].isPercent);
            if (key === 'atk' && currentWeapon) el.classList.add('boosted'); else el.classList.remove('boosted');
        }
    }
    recalc();
}

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
        if(totalEl) {
            totalEl.innerText = formatStat(total, isPercent);
            totalEl.style.color = bonus > 0 ? "#dcbfa8" : "#fff";
        }
    });

    // Расчет спец. параметров (Res Shred, Bond of Life, Lunar Bonus)
    calculateSpecialStats();

    updateAllTalentValues();
}

function calculateSpecialStats() {
    // 1. Res Shred (Срез резистов)
    const inputRes = parseFloat(document.getElementById('input-resShred').value) || 0;
    const bonusRes = bonusStats['resShred'] || 0; 
    const totalRes = inputRes + bonusRes;
    document.getElementById('total-resShred').innerText = totalRes + '%';
    document.getElementById('total-resShred').style.color = bonusRes > 0 ? "#dcbfa8" : "#fff";
    finalStats['resShred'] = totalRes;

    // 2. Bond of Life (Долг жизни - Клоринда)
    const bolInput = parseFloat(document.getElementById('input-bondOfLife').value) || 0;
    finalStats['bondOfLife'] = bolInput;
    document.getElementById('total-bondOfLife').innerText = bolInput + '%';

    // 3. Пассивка "Дар лунного знамения" (Нефер)
    // Ищем индекс таланта
    const lunarPassiveIdx = currentChar.talents.findIndex(t => t.title.includes("Дар лунного знамения"));
    let lunarBaseBonus = 0;

    if (lunarPassiveIdx !== -1) {
        // [ИСПРАВЛЕНО] Проверяем, включен ли переключатель в UI
        // activeBuffs['talent-X'] будет 1, если галочка стоит, и 0, если нет
        const isActive = activeBuffs[`talent-${lunarPassiveIdx}`] > 0;

        if (isActive) {
            const currentEM = finalStats['em'] || 0;
            lunarBaseBonus = currentEM * 0.0175; // 0.0175% за 1 МС
            
            // Кап 14%
            if (lunarBaseBonus > 14) lunarBaseBonus = 14;
        }
    }
    finalStats['lunarBloomBaseBonus'] = lunarBaseBonus;

    // 4. Бонус Лунной Бутонизации (Аффикс)
    const inputLunar = parseFloat(document.getElementById('input-lunarBonus').value) || 0;
    const constLunar = bonusStats['lunarBloomBonus'] || 0;
    const totalLunar = inputLunar + constLunar;
    document.getElementById('total-lunarBonus').innerText = totalLunar + '%';
    document.getElementById('total-lunarBonus').style.color = constLunar > 0 ? "#dcbfa8" : "#fff";
    finalStats['lunarBloomBonus'] = totalLunar;
}

// ==============================================
// 4. ГЛАВНАЯ ЛОГИКА РАСЧЕТА УРОНА (CORE)
// ==============================================

function updateAllTalentValues() {
    if (!currentChar) return;
    const currentC = parseInt(document.getElementById('slider-constellation').value);

    ['normal', 'skill', 'burst'].forEach(type => {
        const slider = document.getElementById(`slider-${type}`);
        if (!slider) return;
        const level = parseInt(slider.value);
        
        const talent = currentChar.talents.find(t => t.type === type);
        if (!talent || !talent.attributes) return;

        talent.attributes.forEach((attr, idx) => {
            const container = document.getElementById(`val-${type}-${idx}`);
            if (!container) return;

            // 1. Получаем базовый процент (с интерполяцией)
            let valPercent = getBasePercent(attr, level);

            // 2. Получаем бонус к процентам (Нефер)
            const percentBonus = getTalentPercentBonus(attr, activeBuffs, currentC);
            valPercent += percentBonus;

            // 3. Получаем добавочный урон (Flat DMG - Клоринда)
            const flatBonus = getFlatDamageBonus(attr, activeBuffs, currentC);

            // 4. Получаем динамический аффикс (Клоринда C4)
            /*currentChar.talents.forEach((t, tIdx) => {
                console.log(t.buff);
            });*/
            const dynamicDmg = getDynamicDamageBonus(attr);

            // 5. Собираем дополнительные скейлы (Нефер C1/C6)
            const extraScalings = getExtraScalings(attr, activeBuffs, currentC);

            // 6. Итоговый расчет
            const isLunarBloom = attr.isLunarBloom || false;
            
            const result = calculateDamage(
                valPercent, 
                attr.scaling, 
                attr.name, 
                extraScalings, 
                percentBonus, // Нужно для extraScaling affectedByTalentBuff
                isLunarBloom, 
                flatBonus, 
                dynamicDmg
            );
            
            // 7. Рендер HTML
            renderDamageResult(container, result, valPercent);
        });
    });
}

// --- ХЕЛПЕРЫ ДЛЯ СБОРА ДАННЫХ ---

function getBasePercent(attr, level) {
    if (level <= attr.values.length) return attr.values[level - 1];
    const last = attr.values[attr.values.length - 1];
    const prev = attr.values[attr.values.length - 2];
    const step = last - prev;
    return last + (step * (level - attr.values.length));
}

function getTalentPercentBonus(attr, buffs, currentC) {
    let bonus = 0;
    
    // Оружие
    if (currentWeapon && currentWeapon.buff && currentWeapon.buff.talentBuff) {
        const stacks = buffs['weapon'] || 0;
        if (stacks > 0 && currentWeapon.buff.talentBuff.keywords.some(k => attr.name.includes(k))) {
            bonus += currentWeapon.buff.talentBuff.add * stacks;
        }
    }
    
    // Таланты персонажа
    currentChar.talents.forEach((t, tIdx) => {
        if (t.type === 'constellation' && t.level > currentC) return;
        
        if (t.buff && t.buff.talentBuff) {
            const stacks = buffs[`talent-${tIdx}`] || 0;
            const multiplier = t.buff.maxStacks > 0 ? stacks : 1;
            
            if (multiplier > 0 && t.buff.talentBuff.keywords.some(k => attr.name.includes(k))) {
                bonus += t.buff.talentBuff.add * multiplier;
            }
        }
    });
    return bonus;
}

function getFlatDamageBonus(attr, buffs, currentC) {
    let bonus = 0;
    currentChar.talents.forEach((t, tIdx) => {
        if (t.type === 'constellation' && t.level > currentC) return;

        if (t.buff && t.buff.additiveBaseDmg) {
            const stacks = buffs[`talent-${tIdx}`] || 0;
            const multiplier = t.buff.maxStacks > 0 ? stacks : 1;

            if (multiplier > 0) {
                let rule = { ...t.buff.additiveBaseDmg }; 
                // C2 модификация
                currentChar.talents.forEach(c => {
                    if (c.type === 'constellation' && c.level <= currentC && c.modifyTarget && c.modifyTarget.title === t.title && c.modifyTarget.newAdditive) {
                        rule.percent = c.modifyTarget.newAdditive.percent;
                        rule.max = c.modifyTarget.newAdditive.max;
                    }
                });

                if (rule.keywords.some(k => attr.name.includes(k))) {
                    const statVal = finalStats[rule.stat] || 0;
                    let added = statVal * (rule.percent / 100) * multiplier;
                    if (added > rule.max) added = rule.max;
                    bonus += added;
                }
            }
        }
    });
    return bonus;
}

function getDynamicDamageBonus(attr) {
    let bonus = 0;
    
    // Получаем текущее созвездие
    const cSlider = document.getElementById('slider-constellation');
    const currentC = cSlider ? parseInt(cSlider.value) : 0;

    currentChar.talents.forEach((t) => {
        // Если это созвездие и его уровень выше текущего - пропускаем
        if (t.type === 'constellation' && t.level > currentC) return;

        if (t.buff && t.buff.dynamicDmgBonus) {
            const ddb = t.buff.dynamicDmgBonus;

            // Проверка: содержит ли имя атрибута одно из ключевых слов
            if (ddb.keywords.some(k => attr.name.includes(k))) {
                
                console.log(">>> СОВПАДЕНИЕ НАЙДЕНО! Применяем бонус.");

                // Получаем значение стата (например, Долг Жизни)
                const statVal = finalStats[ddb.stat] || 0;
                
                // Считаем бонус
                let val = statVal * ddb.ratio;
                
                // Проверяем лимит (макс 200%)
                if (val > ddb.max) val = ddb.max;
                
                bonus += val;
            }
        }
    });
    return bonus;
}

function getExtraScalings(attr, buffs, currentC, percentBonus) {
    let scalings = [];
    
    currentChar.talents.forEach((t, tIdx) => {
        if (t.type === 'constellation' && t.level > currentC) return;
        if (t.buff) {
            const stacks = buffs[`talent-${tIdx}`] || 0;
            const isActive = t.buff.maxStacks > 0 ? stacks > 0 : true;

            if (isActive) {
                // Одиночный
                if (t.buff.extraScaling && t.buff.extraScaling.keywords.some(k => attr.name.includes(k))) {
                    scalings.push(t.buff.extraScaling);
                }
                // Массив (С6 Нефер)
                if (t.buff.extraScalings) {
                    t.buff.extraScalings.forEach(es => {
                        if (es.keywords.some(k => attr.name.includes(k))) scalings.push(es);
                    });
                }
            }
        }
    });
    return scalings;
}

// --- ЯДРО РАСЧЕТА ---

function calculateDamage(totalBasePercent, scaling, name, extraScalings, percentBonus, isLunarBloom, flatBonus, dmgBonusAdd) {
    const isNonDamage = name.includes('КД') || name.includes('Длительность') || name.includes('Стоимость') || name.includes('Энергия');
    if (isNonDamage) return { isDamage: false, suffix: name.includes('КД') || name.includes('Длительность') ? 'с' : '' };

    const rules = scaling || [{ stat: 'atk', ratio: 1 }];
    let formulaParts = [];

    // 1. Base DMG (Standard)
    let baseDmg = 0;
    rules.forEach(rule => {
        const statVal = finalStats[rule.stat] || 0; 
        const ratio = rule.ratio || 1;
        const partDmg = (totalBasePercent / 100) * ratio * statVal;
        baseDmg += partDmg;
        const displayedPercent = (totalBasePercent * ratio).toFixed(1);
        formulaParts.push(`${displayedPercent}% ${rule.stat.toUpperCase()}`);
    });

    // 2. Base DMG (Extra Scaling)
    extraScalings.forEach(es => {
        let extraPercent = es.value;
        if (es.affectedByTalentBuff) extraPercent += percentBonus;
        const extraDmgVal = (extraPercent / 100) * (finalStats[es.stat] || 0);
        baseDmg += extraDmgVal;
        formulaParts.push(`<span style="color:#ffce44">+${extraPercent.toFixed(1)}% ${es.stat.toUpperCase()}</span>`);
    });

    // 3. Flat DMG Bonus (Additive)
    if (flatBonus > 0) {
        baseDmg += flatBonus;
        formulaParts.push(`<span style="color:#81c784">+${Math.round(flatBonus)} Flat</span>`);
    }

    // 4. Multipliers Phase
    let finalBase = baseDmg;
    let bonusMult = 1;

    if (isLunarBloom) {
        // --- FORMULA: LUNAR BLOOM ---
        const { multiplier, formulaNote } = applyLunarBloomLogic(baseDmg);
        finalBase = multiplier; // В этой функции мы уже умножили базу на множители
        bonusMult = 1; // Обычные аффиксы не работают
        formulaParts.push(formulaNote);
    } else {
        // --- FORMULA: STANDARD ---
        const elemBonus = (finalStats['elementDamageBonus'] || 0) / 100;
        const extraBonus = dmgBonusAdd / 100;
        bonusMult = 1 + elemBonus + extraBonus;
        
        if (dmgBonusAdd > 0) formulaParts.push(`<span style="color:#ffce44">C4: +${Math.round(dmgBonusAdd)}%</span>`);
    }

    // 5. Crit / Def / Res
    const crit = getCritMultiplier();
    const defMult = getDefMultiplier();
    const resMult = getResMultiplier();

    const nonCrit = finalBase * bonusMult * defMult * resMult;
    const critDmg = nonCrit * crit.critMult;
    const avgDmg = finalBase * bonusMult * crit.avgMult * defMult * resMult;

    return {
        isDamage: true,
        nonCrit: nonCrit,
        crit: critDmg,
        avg: avgDmg,
        formula: formulaParts.join(' + ')
    };
}

function applyLunarBloomLogic(baseDmg) {
    const baseBonus = (finalStats['lunarBloomBaseBonus'] || 0) / 100;
    const em = finalStats['em'] || 0;
    const emCurve = (6 * em) / (em + 2000); 
    const reactBonus = (finalStats['lunarBloomBonus'] || 0) / 100;
    
    const totalReactMult = 1 + emCurve + reactBonus;
    
    // Результат = Base * (1 + BaseBonus) * (1 + EM Curve + Reaction Bonus)
    const result = baseDmg * (1 + baseBonus) * totalReactMult;
    
    return {
        multiplier: result,
        formulaNote: `<span style="color:#a5c83b">(LUNAR)</span>`
    };
}

function getCritMultiplier() {
    const cr = Math.min(Math.max(finalStats['critRate'] || 0, 0), 100) / 100;
    const cd = (finalStats['critDmg'] || 0) / 100;
    return {
        critMult: 1 + cd,
        avgMult: 1 + (cr * cd)
    };
}

function getDefMultiplier() {
    return 0.5; // 90 vs 90
}

function getResMultiplier() {
    const baseRes = 0.1; 
    const resShred = (finalStats['resShred'] || 0); 
    let finalRes = baseRes - (resShred / 100);
    
    if (finalRes < 0) return 1 - (finalRes / 2);
    else if (finalRes >= 0 && finalRes < 0.75) return 1 - finalRes;
    else return 1 / (4 * finalRes + 1);
}

function renderDamageResult(container, result, valPercent) {
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
}

// ==============================================
// 4. ВСПОМОГАТЕЛЬНЫЕ
// ==============================================

function addBonus(key, value) { bonusStats[key] = (bonusStats[key] || 0) + value; }
function applyBuff(bonusObj, stacks) { 
    if(!bonusObj) return;
    for (const key in bonusObj) addBonus(key, bonusObj[key] * stacks); 
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

// Экспорт
window.switchTab = switchTab;
window.openModal = openModal;
window.updateTalentLevel = updateTalentLevel;
window.updateConstellations = updateConstellations;
window.toggleTalent = toggleTalent;
window.recalc = recalc;
window.updateBuffState = updateBuffState;

// Запуск
init();