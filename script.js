// --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ---
let currentChar = null;
let currentWeapon = null;
let totalBaseStats = {};
let bonusStats = {};
let finalStats = {}; 

let activeBuffs = { weapon: 0 };
let modal, modalList, modalTitle;

// --- ЛОГИКА ---
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

    const cSlider = document.getElementById('slider-constellation');
    if(cSlider) cSlider.value = 0;

    updateConstellations(0);

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
    if(buff && buff.maxStacks) weaponBox.appendChild(renderBuffControl(buff.maxStacks, 'weapon', 'Эффект активен'));
    else weaponBox.innerHTML = '<span style="color:#777; font-size:0.8rem">Нет активного эффекта</span>';

    updateTotalStats();
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

    for (const key in currentChar.stats) totalBaseStats[key] = currentChar.stats[key].base;

    if (currentWeapon) {
        totalBaseStats['atk'] += currentWeapon.stats.baseAtk;
        const sub = currentWeapon.stats.subStat;
        if(sub) addBonus(sub.key, sub.value);
        
        const wBuff = currentWeapon.buff;
        if (wBuff && activeBuffs['weapon'] > 0) applyBuff(wBuff.bonusPerStack, activeBuffs['weapon']);
    }

    const currentC = parseInt(document.getElementById('slider-constellation').value);

    currentChar.talents.forEach((talent, idx) => {
        if (talent.buff) {
            if (talent.type === 'constellation' && talent.level > currentC) return; 
            const tStacks = activeBuffs[`talent-${idx}`] || 0;
            if (tStacks > 0) applyBuff(talent.buff.bonusPerStack, tStacks);
        }
        
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

function addBonus(key, value) { bonusStats[key] = (bonusStats[key] || 0) + value; }
function applyBuff(bonusObj, stacks) { for (const key in bonusObj) addBonus(key, bonusObj[key] * stacks); }

function recalc() {
    if (!currentChar) return;
    finalStats = {};
    const allStats = ['hp', 'atk', 'def', 'em', 'er', 'critRate', 'critDmg', 'healingBonus', 'elementDamageBonus'];

    // 1. Пересчет основных статов
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

    // 2. Пересчет Среза Сопротивления (Res Shred)
    const inputRes = parseFloat(document.getElementById('input-resShred').value) || 0;
    // Считываем бонус среза, который мог прийти от C4 Нефер или других источников
    const bonusRes = bonusStats['resShred'] || 0; 
    const totalResShred = inputRes + bonusRes;
    
    document.getElementById('total-resShred').innerText = totalResShred + '%';
    document.getElementById('total-resShred').style.color = bonusRes > 0 ? "#dcbfa8" : "#fff";
    
    // Сохраняем итоговый срез для формулы урона
    finalStats['resShred'] = totalResShred;

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

function renderTalents(char, color) {
    const container = document.getElementById('talents-container');
    container.innerHTML = '';
    
    const currentCElement = document.getElementById('slider-constellation');
    const currentC = currentCElement ? parseInt(currentCElement.value) : 0;

    char.talents.forEach((talent, idx) => {
        const isConstellation = talent.type === 'constellation';
        let contentHTML = '';
        
        if (talent.buff) {
            let maxStacks = talent.buff.maxStacks;
            char.talents.forEach(c => {
                if (c.type === 'constellation' && c.level <= currentC && c.modifyTarget && c.modifyTarget.title === talent.title) {
                    maxStacks = c.modifyTarget.newMax;
                }
            });

            const key = `talent-${idx}`;
            if (activeBuffs[key] > maxStacks) {
                activeBuffs[key] = maxStacks;
            }

            contentHTML += renderBuffControl(maxStacks, key, 'Эффект активен').outerHTML;
        }

        if (isConstellation) {
            const div = document.createElement('div');
            div.className = 'talent-constellation-card';
            div.setAttribute('data-c-level', talent.level);
            div.style.display = 'none'; 
            div.innerHTML = `<div class="talent-header"><span style="background:#333;padding:2px 6px;border-radius:4px;margin-right:5px;border:1px solid #555;">C${talent.level}</span> ${talent.title}</div><p style="opacity:0.8">${talent.desc}</p>${contentHTML}`;
            container.appendChild(div);
        } else {
            const isActive = ['normal', 'skill', 'burst'].includes(talent.type);
            let attrHtml = '';
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
            const div = document.createElement('div');
            div.className = 'talent-card';
            div.innerHTML = `<div class="talent-header" style="color:${color}">${talent.title}</div><p style="opacity:0.8">${talent.desc}</p>${attrHtml}${contentHTML}`;
            container.appendChild(div);
        }
    });

    ['normal', 'skill', 'burst'].forEach(t => {
        const slider = document.getElementById(`slider-${t}`);
        if(slider && slider.value === "10" && activeBuffs.weapon === 0) {}
    });
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

            // 1. Базовый процент
            let valPercent = 0;
            if (level <= attr.values.length) {
                valPercent = attr.values[level - 1];
            } else {
                const last = attr.values[attr.values.length - 1];
                const prev = attr.values[attr.values.length - 2];
                const step = last - prev;
                valPercent = last + (step * (level - attr.values.length));
            }

            // 2. Бонус процентов от пассивок (Завеса ложных тайн)
            let percentBonus = 0;
            
            // От оружия
            if (currentWeapon && currentWeapon.buff && currentWeapon.buff.talentBuff) {
                const stacks = activeBuffs['weapon'] || 0;
                if (stacks > 0 && currentWeapon.buff.talentBuff.keywords.some(k => attr.name.includes(k))) {
                    percentBonus += currentWeapon.buff.talentBuff.add * stacks;
                }
            }
            
            // От талантов персонажа
            currentChar.talents.forEach((t, tIdx) => {
                if (t.buff && t.buff.talentBuff) {
                    const stacks = activeBuffs[`talent-${tIdx}`] || 0;
                    if (stacks > 0 && t.buff.talentBuff.keywords.some(k => attr.name.includes(k))) {
                        percentBonus += t.buff.talentBuff.add * stacks;
                    }
                }
            });
            valPercent += percentBonus;

            // 3. Сбор дополнительных скейлов (C1, C6 и т.д.)
            let collectedExtraScalings = [];
            const currentC = parseInt(document.getElementById('slider-constellation').value);

            currentChar.talents.forEach((t, tIdx) => {
                // Проверка уровня созвездия
                if (t.type === 'constellation' && t.level > currentC) return;

                if (t.buff) {
                    const stacks = activeBuffs[`talent-${tIdx}`] || 0;
                    const isActive = t.buff.maxStacks > 0 ? stacks > 0 : true;

                    if (isActive) {
                        // Поддержка одиночного extraScaling (как было в C1)
                        if (t.buff.extraScaling && t.buff.extraScaling.keywords.some(k => attr.name.includes(k))) {
                            collectedExtraScalings.push(t.buff.extraScaling);
                        }
                        // Поддержка МАССИВА extraScalings (НОВОЕ для C6)
                        if (t.buff.extraScalings) {
                            t.buff.extraScalings.forEach(es => {
                                if (es.keywords.some(k => attr.name.includes(k))) {
                                    collectedExtraScalings.push(es);
                                }
                            });
                        }
                    }
                }
            });
            
            // 4. Расчет
            const result = calculateTalentValue(valPercent, attr.scaling, attr.name, collectedExtraScalings, percentBonus);
            
            // 5. Рендер
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
function calculateTalentValue(totalBasePercent, scaling, name, extraScalings = [], percentBonus = 0) {
    const isNonDamage = name.includes('КД') || name.includes('Длительность') || name.includes('Стоимость') || name.includes('Энергия');
    if (isNonDamage) return { isDamage: false, suffix: name.includes('КД') || name.includes('Длительность') ? 'с' : '' };

    const rules = scaling || [{ stat: 'atk', ratio: 1 }];
    
    // 1. Расчет Базового Урона
    let baseDmg = 0;
    let formulaParts = [];

    rules.forEach(rule => {
        const statVal = finalStats[rule.stat] || 0; 
        const ratio = rule.ratio || 1;
        const partDmg = (totalBasePercent / 100) * ratio * statVal;
        baseDmg += partDmg;
        const displayedPercent = (totalBasePercent * ratio).toFixed(1);
        formulaParts.push(`${displayedPercent}% ${rule.stat.toUpperCase()}`);
    });

    // Доп. скейлы (C1 Нефер)
    const currentC = parseInt(document.getElementById('slider-constellation').value);
    currentChar.talents.forEach((t, tIdx) => {
        if (t.type === 'constellation' && t.level > currentC) return;

        if (t.buff && t.buff.extraScaling) {
            const es = t.buff.extraScaling;
            const tStacks = activeBuffs[`talent-${tIdx}`] || 0;
            const isActive = t.buff.maxStacks > 0 ? tStacks > 0 : true;

            if (isActive && es.keywords.some(k => name.includes(k))) {
                let extraPercent = es.value;
                if (es.affectedByTalentBuff) extraPercent += percentBonus;
                
                const extraDmgVal = (extraPercent / 100) * (finalStats[es.stat] || 0);
                baseDmg += extraDmgVal;
                formulaParts.push(`<span style="color:#ffce44">+${extraPercent.toFixed(1)}% ${es.stat.toUpperCase()}</span>`);
            }
        }
    });

    // 2. Бонус Урона
    const elemBonus = (finalStats['elementDamageBonus'] || 0) / 100;
    const bonusMult = 1 + elemBonus;

    // 3. Крит
    const cr = Math.min(Math.max(finalStats['critRate'] || 0, 0), 100) / 100;
    const cd = (finalStats['critDmg'] || 0) / 100;
    const critMult = 1 + cd;

    // 4. Защита Врага (90 vs 90 = 0.5)
    const defMult = 0.5;

    // 5. Сопротивление Врага (Res)
    // Формула: База(10%) - Срез. 
    const baseRes = 0.1; 
    const resShred = (finalStats['resShred'] || 0); 
    
    let finalRes = baseRes - (resShred / 100);
    let resMult = 0;

    // Стандартная формула Геншина для резистов
    if (finalRes < 0) {
        resMult = 1 - (finalRes / 2);
    } else if (finalRes >= 0 && finalRes < 0.75) {
        resMult = 1 - finalRes;
    } else {
        resMult = 1 / (4 * finalRes + 1);
    }

    // --- ИТОГ ---
    const nonCrit = baseDmg * bonusMult * defMult * resMult;
    const crit = nonCrit * critMult;
    const avg = baseDmg * bonusMult * (1 + (cr * cd)) * defMult * resMult;

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

document.addEventListener('DOMContentLoaded', () => {
    modal = document.getElementById('modalOverlay');
    modalList = document.getElementById('modalList');
    modalTitle = document.getElementById('modalTitle');
    modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

    renderCharacter(charData[0].id);
    const firstWep = weaponData.find(w => w.type === charData[0].weaponType);
    if(firstWep) renderWeapon(firstWep.id);
});