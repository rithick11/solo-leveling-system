// Main Game Logic
document.addEventListener('DOMContentLoaded', function() {
    // Check if player is logged in
    if (!localStorage.getItem('playerName')) {
        window.location.href = 'index.html';
    }
    
    // Play background music on game pages
    if (!window.location.pathname.includes('index.html')) {
        const bgMusic = new Audio('sounds/game_bg_music.mp3');
        bgMusic.loop = true;
        bgMusic.volume = 0.3;
        bgMusic.play();
    }
    
    // Daily reset check
    const lastPlayedDate = localStorage.getItem('lastPlayedDate');
    const currentDate = new Date().toDateString();
    
    if (lastPlayedDate !== currentDate) {
        localStorage.setItem('lastPlayedDate', currentDate);
        localStorage.setItem('dailyQuestsCompleted', '0');
        localStorage.setItem('completedQuests', '[]');
        
        // Show daily reset message
        if (lastPlayedDate) {
            const systemMessage = document.createElement('div');
            systemMessage.className = 'system-notification';
            systemMessage.textContent = 'DAILY QUESTS HAVE BEEN RESET. NEW CHALLENGES AWAIT.';
            document.querySelector('.system-main').prepend(systemMessage);
            
            // Play reset sound
            const resetSound = new Audio('sounds/daily_reset.mp3');
            resetSound.play();
            
            setTimeout(() => {
                systemMessage.remove();
            }, 5000);
        }
    }
    
    // Update stats display
    function updateStatsDisplay() {
        document.getElementById('playerLevel').textContent = localStorage.getItem('playerLevel');
        document.getElementById('playerGold').textContent = localStorage.getItem('playerGold');
        document.getElementById('playerSTR').textContent = localStorage.getItem('playerSTR');
        document.getElementById('playerAGI').textContent = localStorage.getItem('playerAGI');
        document.getElementById('playerVIT').textContent = localStorage.getItem('playerVIT');
        document.getElementById('playerINT').textContent = localStorage.getItem('playerINT');
        document.getElementById('playerPER').textContent = localStorage.getItem('playerPER');
        
        const dailyQuestsCompleted = parseInt(localStorage.getItem('dailyQuestsCompleted')) || 0;
        const progressPercentage = (dailyQuestsCompleted / 3) * 100;
        if (document.getElementById('dailyProgress')) {
            document.getElementById('dailyProgress').style.width = `${progressPercentage}%`;
            document.getElementById('progressText').textContent = `${dailyQuestsCompleted}/3 Daily Quests Completed`;
        }
    }
    
    // Level up function
    window.levelUp = function() {
        const currentLevel = parseInt(localStorage.getItem('playerLevel'));
        const newLevel = currentLevel + 1;
        
        // Update level
        localStorage.setItem('playerLevel', newLevel.toString());
        
        // Increase stats based on level
        const str = parseInt(localStorage.getItem('playerSTR'));
        const agi = parseInt(localStorage.getItem('playerAGI'));
        const vit = parseInt(localStorage.getItem('playerVIT'));
        const int = parseInt(localStorage.getItem('playerINT'));
        const per = parseInt(localStorage.getItem('playerPER'));
        
        localStorage.setItem('playerSTR', (str + Math.floor(newLevel * 1.5)).toString());
        localStorage.setItem('playerAGI', (agi + Math.floor(newLevel * 1.3)).toString());
        localStorage.setItem('playerVIT', (vit + Math.floor(newLevel * 1.7)).toString());
        localStorage.setItem('playerINT', (int + Math.floor(newLevel * 1.2)).toString());
        localStorage.setItem('playerPER', (per + Math.floor(newLevel * 1.1)).toString());
        
        // Update display
        updateStatsDisplay();
        
        // Show level up message
        const systemMessage = document.createElement('div');
        systemMessage.className = 'system-notification level-up';
        systemMessage.innerHTML = `
            <p>LEVEL UP! You are now Level ${newLevel}.</p>
            <p>Stats increased!</p>
            <div class="level-up-gif">
                <img src="images/level-up.gif" alt="Level Up">
            </div>
        `;
        document.querySelector('.system-main').prepend(systemMessage);
        
        // Play level up sound
        const levelUpSound = new Audio('sounds/level_up.mp3');
        levelUpSound.play();
        
        setTimeout(() => {
            systemMessage.remove();
        }, 5000);
    };
    
    // Add gold function
    window.addGold = function(amount) {
        const currentGold = parseInt(localStorage.getItem('playerGold'));
        const newGold = currentGold + amount;
        localStorage.setItem('playerGold', newGold.toString());
        
        updateStatsDisplay();
        
        // Show gold earned message
        const goldMessage = document.createElement('div');
        goldMessage.className = 'system-notification gold-message';
        goldMessage.innerHTML = `
            <p>+${amount} Gold Acquired!</p>
            <div class="gold-effect">
                <img src="images/gold-effect.gif" alt="Gold Effect">
            </div>
        `;
        document.querySelector('.system-main').prepend(goldMessage);
        
        // Play gold sound
        const goldSound = new Audio('sounds/gold.mp3');
        goldSound.play();
        
        setTimeout(() => {
            goldMessage.remove();
        }, 3000);
    };
    
    // Initialize timer for quest page
    if (window.location.pathname.includes('quests.html')) {
        initializeQuestTimer();
    }
    
    // Initialize inventory tabs
    if (window.location.pathname.includes('inventory.html')) {
        initializeInventoryTabs();
    }
});

function initializeQuestTimer() {
    let seconds = 0;
    let minutes = 7;
    let hours = 0;
    
    function updateTimer() {
        seconds--;
        if (seconds < 0) {
            seconds = 59;
            minutes--;
            if (minutes < 0) {
                minutes = 59;
                hours--;
                if (hours < 0) {
                    // Timer expired
                    clearInterval(timerInterval);
                    document.querySelector('.quest-warning').innerHTML = `
                        <p>WARNING: DAILY QUEST FAILED!</p>
                        <p>STATS PENALTY APPLIED!</p>
                    `;
                    
                    // Apply penalty
                    const str = parseInt(localStorage.getItem('playerSTR'));
                    const agi = parseInt(localStorage.getItem('playerAGI'));
                    const vit = parseInt(localStorage.getItem('playerVIT'));
                    const int = parseInt(localStorage.getItem('playerINT'));
                    const per = parseInt(localStorage.getItem('playerPER'));
                    
                    localStorage.setItem('playerSTR', (str - 5).toString());
                    localStorage.setItem('playerAGI', (agi - 5).toString());
                    localStorage.setItem('playerVIT', (vit - 5).toString());
                    localStorage.setItem('playerINT', (int - 5).toString());
                    localStorage.setItem('playerPER', (per - 5).toString());
                    
                    // Play penalty sound
                    const penaltySound = new Audio('sounds/penalty.mp3');
                    penaltySound.play();
                    
                    return;
                }
            }
        }
        
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.querySelector('.system-timer').textContent = formattedTime;
    }
    
    // Start timer
    const timerInterval = setInterval(updateTimer, 1000);
}

function initializeInventoryTabs() {
    const tabs = document.querySelectorAll('.inventory-tab');
    const tabContents = document.querySelectorAll('.inventory-grid');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.add('hidden'));
            // Show selected tab content
            const tabName = this.getAttribute('data-tab');
            document.getElementById(`${tabName}Tab`).classList.remove('hidden');
            
            // Play tab switch sound
            const tabSound = new Audio('sounds/tab_switch.mp3');
            tabSound.play();
        });
    });
}

window.openShop = function() {
    const shopSound = new Audio('sounds/shop_open.mp3');
    shopSound.play();
    
    alert('Shop system will be implemented in the next update!');
};