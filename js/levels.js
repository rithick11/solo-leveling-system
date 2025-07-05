// Level Progression System
document.addEventListener('DOMContentLoaded', function() {
    // Check if player is logged in
    if (!localStorage.getItem('playerName')) {
        window.location.href = 'index.html';
    }
    
    // Load player stats
    const playerLevel = parseInt(localStorage.getItem('playerLevel')) || 1;
    const playerExp = parseInt(localStorage.getItem('playerExp')) || 0;
    document.getElementById('playerLevel').textContent = playerLevel;
    document.getElementById('playerGold').textContent = localStorage.getItem('playerGold') || '0';
    
    // Calculate experience needed for next level
    const expNeeded = calculateExpNeeded(playerLevel);
    const expPercentage = Math.min(100, (playerExp / expNeeded) * 100);
    
    // Update experience display
    document.getElementById('playerExp').textContent = `${playerExp}/${expNeeded}`;
    document.getElementById('expText').textContent = `${playerExp}/${expNeeded} EXP to Next Level`;
    document.getElementById('expFill').style.width = `${expPercentage}%`;
    
    // Next level reward
    const nextLevelReward = calculateLevelReward(playerLevel + 1);
    document.getElementById('nextLevelReward').textContent = nextLevelReward;
    
    // Generate level rewards grid
    const rewardsGrid = document.getElementById('rewardsGrid');
    rewardsGrid.innerHTML = '';
    
    // Create levels (showing current level ±5 levels)
    const startLevel = Math.max(1, playerLevel - 5);
    const endLevel = Math.min(100, playerLevel + 5);
    
    for (let level = startLevel; level <= endLevel; level++) {
        const levelItem = document.createElement('div');
        levelItem.className = 'level-item';
        
        if (level < playerLevel) {
            levelItem.classList.add('completed');
        } else if (level === playerLevel) {
            levelItem.classList.add('current');
        }
        
        const reward = calculateLevelReward(level);
        const isMilestone = level % 10 === 0;
        
        levelItem.innerHTML = `
            <h4>LEVEL ${level}</h4>
            <p>Reward: ${reward}</p>
            ${isMilestone ? `<p class="special-reward">MILESTONE: ${getMilestoneReward(level)}</p>` : ''}
        `;
        
        rewardsGrid.appendChild(levelItem);
    }
    
    // Add navigation for higher levels if needed
    if (endLevel < 100) {
        const moreLevels = document.createElement('div');
        moreLevels.className = 'level-item more-levels';
        moreLevels.textContent = '... Higher Levels Await ...';
        rewardsGrid.appendChild(moreLevels);
    }
    
    // Update special abilities display
    updateSpecialAbilities(playerLevel);
    
    // Check for newly unlocked abilities
    checkNewUnlocks(playerLevel);
});

function calculateExpNeeded(level) {
    // Exponential experience curve
    return Math.floor(100 * Math.pow(1.2, level - 1));
}

function calculateLevelReward(level) {
    // Calculate stat increases based on level
    const str = Math.floor(level * 1.5);
    const agi = Math.floor(level * 1.3);
    const vit = Math.floor(level * 1.7);
    const int = Math.floor(level * 1.2);
    const per = Math.floor(level * 1.1);
    
    return `+${str} STR, +${agi} AGI, +${vit} VIT, +${int} INT, +${per} PER`;
}

function getMilestoneReward(level) {
    // Special rewards for milestone levels
    switch(level) {
        case 10: return "Shadow Extraction";
        case 20: return "Dominator's Touch";
        case 30: return "Ruler's Authority";
        case 40: return "Shadow Exchange";
        case 50: return "Monarch's Domain";
        case 60: return "Absolute Being";
        case 70: return "Omniscient";
        case 80: return "Omnipotent";
        case 90: return "Transcendence";
        case 100: return "Absolute Monarch";
        default: return "New Skill Unlocked";
    }
}

function updateSpecialAbilities(currentLevel) {
    const abilities = document.querySelectorAll('.ability-item');
    
    abilities.forEach(ability => {
        const levelText = ability.querySelector('p').textContent;
        const requiredLevel = parseInt(levelText.match(/Level (\d+)/)[1]);
        
        if (currentLevel >= requiredLevel) {
            ability.classList.remove('locked');
            ability.classList.add('unlocked');
            ability.innerHTML = `
                <h4>${ability.querySelector('h4').textContent}</h4>
                <p>UNLOCKED</p>
                <div class="ability-description">${getAbilityDescription(ability.querySelector('h4').textContent)}</div>
            `;
        }
    });
}

function getAbilityDescription(abilityName) {
    // Return descriptions for each ability
    const descriptions = {
        "Shadow Extraction": "Extract shadows of defeated enemies to fight for you. Power scales with your level.",
        "Dominator's Touch": "Instantly kill weaker enemies. Chance scales with level difference.",
        "Ruler's Authority": "Exert immense pressure on enemies, reducing their stats.",
        "Shadow Exchange": "Swap positions with one of your shadows instantly.",
        "Monarch's Domain": "Create a zone where your shadows are significantly empowered.",
        "Absolute Being": "Temporarily become invulnerable and deal massive damage.",
        "Omniscient": "Gain complete awareness of your surroundings.",
        "Omnipotent": "Temporarily gain god-like powers.",
        "Transcendence": "Break through normal limitations, massively boosting all stats.",
        "Absolute Monarch": "Become the true ruler of all shadows."
    };
    
    return descriptions[abilityName] || "Powerful ability unlocked at this milestone level.";
}

function checkNewUnlocks(currentLevel) {
    const lastViewedLevel = parseInt(localStorage.getItem('lastViewedLevel')) || 1;
    
    // Check if player leveled up since last view
    if (currentLevel > lastViewedLevel) {
        const milestoneLevels = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        const newMilestones = milestoneLevels.filter(lvl => lvl > lastViewedLevel && lvl <= currentLevel);
        
        if (newMilestones.length > 0) {
            // Show new abilities unlocked notification
            const unlockMessage = document.createElement('div');
            unlockMessage.className = 'system-notification ability-unlock';
            unlockMessage.innerHTML = `
                <p>NEW ABILITIES UNLOCKED!</p>
                ${newMilestones.map(lvl => `<p>Level ${lvl}: ${getMilestoneReward(lvl)}</p>`).join('')}
                <img src="images/ability-unlock.gif" alt="Ability Unlocked" class="ability-unlock-gif">
            `;
            document.querySelector('.system-main').prepend(unlockMessage);
            
            // Play ability unlock sound
            const abilityUnlockSound = document.getElementById('abilityUnlockSound');
            abilityUnlockSound.play();
            
            setTimeout(() => {
                unlockMessage.remove();
            }, 5000);
        }
    }
    
    // Update last viewed level
    localStorage.setItem('lastViewedLevel', currentLevel.toString());
}

window.previewLevelUp = function() {
    const currentLevel = parseInt(localStorage.getItem('playerLevel'));
    const currentExp = parseInt(localStorage.getItem('playerExp')) || 0;
    const expNeeded = calculateExpNeeded(currentLevel);
    
    // Check if player can level up
    if (currentExp < expNeeded) {
        alert(`You need ${expNeeded - currentExp} more EXP to level up!`);
        return;
    }
    
    // Play preview sound
    const levelPreviewSound = document.getElementById('levelPreviewSound');
    levelPreviewSound.play();
    
    // Calculate new stats
    const newLevel = currentLevel + 1;
    const str = parseInt(localStorage.getItem('playerSTR'));
    const agi = parseInt(localStorage.getItem('playerAGI'));
    const vit = parseInt(localStorage.getItem('playerVIT'));
    const int = parseInt(localStorage.getItem('playerINT'));
    const per = parseInt(localStorage.getItem('playerPER'));
    
    const newSTR = str + Math.floor(newLevel * 1.5);
    const newAGI = agi + Math.floor(newLevel * 1.3);
    const newVIT = vit + Math.floor(newLevel * 1.7);
    const newINT = int + Math.floor(newLevel * 1.2);
    const newPER = per + Math.floor(newLevel * 1.1);
    
    // Show preview
    const previewStats = document.getElementById('previewStats');
    previewStats.innerHTML = `
        <div class="preview-item">
            <span>Level:</span>
            <span class="current-value">${currentLevel}</span>
            <span class="arrow">→</span>
            <span class="new-value">${newLevel}</span>
        </div>
        <div class="preview-item">
            <span>STR:</span>
            <span class="current-value">${str}</span>
            <span class="arrow">→</span>
            <span class="new-value">${newSTR}</span>
        </div>
        <div class="preview-item">
            <span>AGI:</span>
            <span class="current-value">${agi}</span>
            <span class="arrow">→</span>
            <span class="new-value">${newAGI}</span>
        </div>
        <div class="preview-item">
            <span>VIT:</span>
            <span class="current-value">${vit}</span>
            <span class="arrow">→</span>
            <span class="new-value">${newVIT}</span>
        </div>
        <div class="preview-item">
            <span>INT:</span>
            <span class="current-value">${int}</span>
            <span class="arrow">→</span>
            <span class="new-value">${newINT}</span>
        </div>
        <div class="preview-item">
            <span>PER:</span>
            <span class="current-value">${per}</span>
            <span class="arrow">→</span>
            <span class="new-value">${newPER}</span>
        </div>
        ${newLevel % 10 === 0 ? `
        <div class="preview-milestone">
            <p>MILESTONE REACHED!</p>
            <p>New Ability: ${getMilestoneReward(newLevel)}</p>
        </div>
        ` : ''}
    `;
    
    // Add animation to preview
    previewStats.classList.add('preview-animation');
    setTimeout(() => {
        previewStats.classList.remove('preview-animation');
    }, 1000);
};