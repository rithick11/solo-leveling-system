// Home Dashboard System
document.addEventListener('DOMContentLoaded', function() {
    // Check if player is logged in
    if (!localStorage.getItem('playerName')) {
        window.location.href = 'index.html';
        return;
    }

    // Initialize player stats display
    updateStatsDisplay();

    // Set up service item click handlers
    setupServiceItems();

    // Initialize navigation
    setupNavigation();

    // Check for new system messages
    checkSystemMessages();

    // Set up stat hover effects
    setupStatHoverEffects();

    // Initialize daily reset check
    checkDailyReset();

    // Set up avatar click handler
    document.getElementById('avatarImage').addEventListener('click', showCharacterInfo);
});

function updateStatsDisplay() {
    // Update all displayed stats from localStorage
    document.getElementById('playerLevel').textContent = localStorage.getItem('playerLevel') || '1';
    document.getElementById('playerGold').textContent = localStorage.getItem('playerGold') || '0';
    document.getElementById('playerSTR').textContent = localStorage.getItem('playerSTR') || '10';
    document.getElementById('playerAGI').textContent = localStorage.getItem('playerAGI') || '10';
    document.getElementById('playerVIT').textContent = localStorage.getItem('playerVIT') || '10';
    document.getElementById('playerINT').textContent = localStorage.getItem('playerINT') || '10';
    document.getElementById('playerPER').textContent = localStorage.getItem('playerPER') || '10';
    document.getElementById('playerJob').textContent = localStorage.getItem('playerJob') || 'Shadow Monarch';
    document.getElementById('playerTitle').textContent = localStorage.getItem('playerTitle') || 'The One Who Overcame Adversity';
    document.getElementById('displayName').textContent = localStorage.getItem('playerName') || 'Hunter';

    // Update daily progress
    const dailyQuestsCompleted = parseInt(localStorage.getItem('dailyQuestsCompleted')) || 0;
    const progressPercentage = Math.min(100, (dailyQuestsCompleted / 1) * 100);
    document.getElementById('dailyProgress').style.width = `${progressPercentage}%`;
    document.getElementById('progressText').textContent = `${dailyQuestsCompleted}/3 Daily Quests Completed`;

    // Update avatar based on level
    
}



function setupServiceItems() {
    const serviceItems = document.querySelectorAll('.service-item');
    
    serviceItems.forEach(item => {
        // Add hover sound effect
        item.addEventListener('mouseenter', function() {
            const hoverSound = document.getElementById('hoverSound');
            if (hoverSound) hoverSound.play();
        });

        // Add click handler
        item.addEventListener('click', function() {
            const clickSound = document.getElementById('clickSound');
            if (clickSound) clickSound.play();
            
            const serviceName = this.textContent.trim();
            handleServiceClick(serviceName);
        });
    });
}

function handleServiceClick(serviceName) {
    switch(serviceName) {
        case 'SHADOW ARMY':
            showShadowArmyPreview();
            break;
        case 'DUNGEON MAP':
            showDungeonMap();
            break;
        case 'SKILL TREE':
            window.location.href = 'levels.html';
            break;
        case 'ACHIEVEMENTS':
            showAchievements();
            break;
        default:
            showComingSoonMessage(serviceName);
    }
}

function showShadowArmyPreview() {
    const shadowArmy = JSON.parse(localStorage.getItem('shadowArmy') || '[]');
    const message = document.createElement('div');
    message.className = 'system-notification shadow-army-notification';
    
    if (shadowArmy.length > 0) {
        const totalPower = calculateShadowArmyPower(shadowArmy);
        message.innerHTML = `
            <p>SHADOW ARMY</p>
            <p>Total Shadows: ${shadowArmy.length}</p>
            <p>Total Power: ${totalPower}</p>
            <img src="pictures/sung_jin_woo.jpg" alt="Shadow Army" class="empty-shadows">
        `;
    } else {
        message.innerHTML = `
            <p>SHADOW ARMY EMPTY</p>
            <p>Defeat enemies to add shadows to your army</p>
            
        `;
    }
    
    document.querySelector('.system-main').prepend(message);
    
    // Play shadow army sound
    const shadowSound = new Audio('sounds/shadow_army.mp3');
    shadowSound.play();
    
    setTimeout(() => {
        message.remove();
    }, 5000);
}

function calculateShadowArmyPower(shadows) {
    return shadows.reduce((total, shadow) => total + shadow.power, 0);
}

function showDungeonMap() {
    const availableDungeons = getAvailableDungeons();
    const message = document.createElement('div');
    message.className = 'system-notification dungeon-map-notification';
    message.innerHTML = `
        <p>DUNGEON MAP</p>
        <p>Available Dungeons: ${availableDungeons.length}</p>
        <ul class="dungeon-list">
            ${availableDungeons.map(dungeon => `<li>${dungeon.name} (Lv. ${dungeon.minLevel}+)</li>`).join('')}
        </ul>
    `;
    
    document.querySelector('.system-main').prepend(message);
    
    // Play dungeon sound
    const dungeonSound = new Audio('sounds/dungeon_map.mp3');
    dungeonSound.play();
    
    setTimeout(() => {
        message.remove();
    }, 5000);
}

function getAvailableDungeons() {
    const playerLevel = parseInt(localStorage.getItem('playerLevel')) || 1;
    const dungeons = [
        { name: "Goblin Cave", minLevel: 1 },
        { name: "Wolf Forest", minLevel: 5 },
        { name: "Orc Fortress", minLevel: 10 },
        { name: "Demon Castle", minLevel: 20 },
        { name: "Dragon's Lair", minLevel: 30 }
    ];
    
    return dungeons.filter(dungeon => dungeon.minLevel <= playerLevel);
}

function showAchievements() {
    const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    const message = document.createElement('div');
    message.className = 'system-notification achievements-notification';
    
    if (achievements.length > 0) {
        message.innerHTML = `
            <p>ACHIEVEMENTS UNLOCKED</p>
            <div class="achievements-grid">
                ${achievements.map(ach => `
                    <div class="achievement-item">
                        <img src="images/achievements/${ach.icon}.png" alt="${ach.name}">
                        <p>${ach.name}</p>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        message.innerHTML = `
            <p>NO ACHIEVEMENTS YET</p>
            <p>Complete quests and reach milestones to unlock achievements</p>
        `;
    }
    
    document.querySelector('.system-main').prepend(message);
    
    // Play achievement sound
    const achievementSound = new Audio('sounds/achievement.mp3');
    achievementSound.play();
    
    setTimeout(() => {
        message.remove();
    }, 5000);
}

function showComingSoonMessage(serviceName) {
    const message = document.createElement('div');
    message.className = 'system-notification coming-soon-notification';
    message.innerHTML = `
        <p>${serviceName} SYSTEM</p>
        <p>This feature is coming in the next update!</p>
        <img src="images/system-update.gif" alt="Coming Soon">
    `;
    
    document.querySelector('.system-main').prepend(message);
    
    // Play notification sound
    const notificationSound = new Audio('sounds/notification.mp3');
    notificationSound.play();
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

function setupNavigation() {
    const navButtons = document.querySelectorAll('.btn-nav');
    
    navButtons.forEach(button => {
        // Add hover sound
        button.addEventListener('mouseenter', function() {
            const hoverSound = document.getElementById('hoverSound');
            if (hoverSound) hoverSound.play();
        });
        
        // Add click handler
        button.addEventListener('click', function() {
            const clickSound = document.getElementById('clickSound');
            if (clickSound) clickSound.play();
            
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
    });
}

function navigateToPage(page) {
    switch(page) {
        case 'dashboard':
            // Already on home page
            break;
        case 'quests':
            window.location.href = 'quests.html';
            break;
        case 'levels':
            window.location.href = 'levels.html';
            break;
        case 'inventory':
            window.location.href = 'inventory.html';
            break;
    }
}

function checkSystemMessages() {
    const lastLogin = localStorage.getItem('lastLogin');
    const currentTime = new Date().getTime();
    
    // Show welcome message if first login today
    if (!lastLogin || (currentTime - parseInt(lastLogin)) > 86400000) {
        showWelcomeMessage();
    }
    
    // Update last login time
    localStorage.setItem('lastLogin', currentTime.toString());
}

function showWelcomeMessage() {
    const playerName = localStorage.getItem('playerName') || 'Hunter';
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'system-notification welcome-message';
    welcomeMessage.innerHTML = `
        <p>WELCOME BACK, <span class="player-name">${playerName}</span></p>
        <p>Daily quests have been refreshed</p>
        
    `;
    
    document.querySelector('.system-main').prepend(welcomeMessage);
    
    // Play welcome sound
    const welcomeSound = new Audio('sounds/welcome.mp3');
    welcomeSound.play();
    
    setTimeout(() => {
        welcomeMessage.remove();
    }, 5000);
}

function setupStatHoverEffects() {
    const statItems = document.querySelectorAll('.stat-item span:nth-child(2)');
    
    statItems.forEach(stat => {
        stat.addEventListener('mouseenter', function() {
            this.classList.add('stat-hover');
            
            // Play stat hover sound
            const statSound = new Audio('sounds/stat_hover.mp3');
            statSound.volume = 0.5;
            statSound.play();
        });
        
        stat.addEventListener('mouseleave', function() {
            this.classList.remove('stat-hover');
        });
    });
}

function checkDailyReset() {
    const lastPlayedDate = localStorage.getItem('lastPlayedDate');
    const currentDate = new Date().toDateString();
    
    if (lastPlayedDate !== currentDate) {
        localStorage.setItem('lastPlayedDate', currentDate);
        localStorage.setItem('dailyQuestsCompleted', '0');
        localStorage.setItem('completedQuests', '[]');
        
        // Show reset message if not first login
        if (lastPlayedDate) {
            showDailyResetMessage();
        }
    }
}

function showDailyResetMessage() {
    const resetMessage = document.createElement('div');
    resetMessage.className = 'system-notification reset-message';
    resetMessage.innerHTML = `
        <p>DAILY SYSTEM RESET</p>
        <p>All daily quests have been refreshed</p>
        <img src="images/reset.gif" alt="Reset" class="reset-gif">
    `;
    
    document.querySelector('.system-main').prepend(resetMessage);
    
    // Play reset sound
    const resetSound = new Audio('sounds/daily_reset.mp3');
    resetSound.play();
    
    setTimeout(() => {
        resetMessage.remove();
    }, 5000);
}

function showCharacterInfo() {
    const playerName = localStorage.getItem('playerName') || 'Hunter';
    const playerLevel = localStorage.getItem('playerLevel') || '1';
    const playerJob = localStorage.getItem('playerJob') || 'Shadow Monarch';
    const playerTitle = localStorage.getItem('playerTitle') || 'The One Who Overcame Adversity';
    
    const message = document.createElement('div');
    message.className = 'system-notification character-info';
    message.innerHTML = `
        <h3>CHARACTER INFO</h3>
        <div class="character-details">
            <div class="character-text">
                <p><strong>Name:</strong> ${playerName}</p>
                <p><strong>Level:</strong> ${playerLevel}</p>
                <p><strong>Job:</strong> ${playerJob}</p>
                <p><strong>Title:</strong> ${playerTitle}</p>
            </div>
        
    `;
    
    document.querySelector('.system-main').prepend(message);
    
    setTimeout(() => {
        message.remove();
    }, 5000);
}

// Global function to update stats from other pages
window.updateStatsDisplay = updateStatsDisplay;
window.updateAvatarImage = updateAvatarImage;
