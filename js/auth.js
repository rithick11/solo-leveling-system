// Authentication System
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginSound = document.getElementById('loginSound');
    
    // Play background music on login page
    if (window.location.pathname.includes('index.html')) {
        const bgMusic = new Audio('sounds\solo_leveling_op_part2.mp3');
        bgMusic.loop = true;
        bgMusic.volume = 0.5;
        bgMusic.play();
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const playerName = document.getElementById('playerName').value;
            
            // Play login sound
            loginSound.play();
            
            // Store player data in localStorage
            localStorage.setItem('playerName', playerName);
            
            // Initialize player stats if they don't exist
            if (!localStorage.getItem('playerLevel')) {
                localStorage.setItem('playerLevel', '1');
                localStorage.setItem('playerGold', '0');
                localStorage.setItem('playerSTR', '10');
                localStorage.setItem('playerAGI', '10');
                localStorage.setItem('playerVIT', '10');
                localStorage.setItem('playerINT', '10');
                localStorage.setItem('playerPER', '10');
                localStorage.setItem('playerJob', 'Shadow Monarch');
                localStorage.setItem('playerTitle', 'The One Who Overcame Adversity');
                localStorage.setItem('systemAccepted', 'false');
                localStorage.setItem('dailyQuestsCompleted', '0');
                localStorage.setItem('totalQuestsCompleted', '0');
                localStorage.setItem('playerExp', '0');
                localStorage.setItem('inventory', JSON.stringify({
                    weapons: ['dagger'],
                    armor: ['leather'],
                    consumables: { potion: 5, elixir: 3 },
                    questItems: ['dungeon-key']
                }));
            }
            
            // Show system message before redirect
            showSystemMessage(playerName);
        });
    }
    
    // Add hover sound to all buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            const hoverSound = document.getElementById('hoverSound');
            if (hoverSound) hoverSound.play();
        });
        
        button.addEventListener('click', () => {
            const clickSound = document.getElementById('clickSound');
            if (clickSound) clickSound.play();
        });
    });
    
    // System message display function
    function showSystemMessage(playerName) {
        // Create overlay for message
        const overlay = document.createElement('div');
        overlay.className = 'system-message-overlay';
        overlay.innerHTML = `
            <div class="system-message-container">
                <div class="system-message">
                    <h2>SYSTEM NOTIFICATION</h2>
                    <div class="message-content">
                        <p>Player <span class="player-name">${playerName}</span> detected.</p>
                        <p>Dual World Gate System activating...</p>
                        <p>You have been chosen by the System.</p>
                        <p>Do you accept this power?</p>
                    </div>
                    <div class="message-buttons">
                        <button id="acceptSystemNow" class="btn-system">ACCEPT</button>
                        <button id="rejectSystemNow" class="btn-system" disabled>REJECT</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Play system notification sound
        const notificationSound = new Audio('sounds/system_notification.mp3');
        notificationSound.play();
        
        // Handle system acceptance
        document.getElementById('acceptSystemNow').addEventListener('click', function() {
            const acceptSound = new Audio('sounds/system_accept.mp3');
            acceptSound.play();
            
            localStorage.setItem('systemAccepted', 'true');
            
            // Add acceptance animation
            overlay.querySelector('.system-message').classList.add('accepting');
            
            // Show final message before redirect
            setTimeout(() => {
                overlay.querySelector('.message-content').innerHTML = `
                    <p>SYSTEM ACTIVATED</p>
                    <p>Welcome, <span class="player-name">${playerName}</span></p>
                    <p>You may now progress through the levels</p>
                    <p class="system-loading">Redirecting to Dashboard...</p>
                `;
                overlay.querySelector('.message-buttons').style.display = 'none';
                
                // Play activation sound
                const activationSound = new Audio('sounds/system_activated.mp3');
                activationSound.play();
                
                // Redirect after delay
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 2000);
            }, 1000);
        });
    }

    // On home page, display player info
    if (document.getElementById('displayName')) {
        const playerName = localStorage.getItem('playerName') || 'Hunter';
        document.getElementById('displayName').textContent = playerName;
        
        // Load stats
        updateStatsDisplay();
        
        // Check if system is accepted (now should always be true)
        if (localStorage.getItem('systemAccepted') === 'true') {
            document.getElementById('acceptSystem').textContent = 'SYSTEM ACTIVE';
            document.getElementById('acceptSystem').disabled = true;
            
            // Show welcome message
            const welcomeMessage = document.createElement('div');
            welcomeMessage.className = 'system-notification';
            welcomeMessage.innerHTML = `
                <p>WELCOME TO THE SYSTEM, <span class="player-name">${playerName}</span></p>
                <p>Begin your journey to become the strongest hunter</p>
            `;
            document.querySelector('.system-main').prepend(welcomeMessage);
            
            // Play welcome sound
            const welcomeSound = new Audio('sounds/welcome.mp3');
            welcomeSound.play();
            
            setTimeout(() => {
                welcomeMessage.remove();
            }, 5000);
        }
    }
    
    // Navigation handling
    const navButtons = document.querySelectorAll('.btn-nav');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            if (page === 'dashboard') window.location.href = 'home.html';
            else if (page === 'quests') window.location.href = 'quests.html';
            else if (page === 'levels') window.location.href = 'levels.html';
            else if (page === 'inventory') window.location.href = 'inventory.html';
        });
    });
    
    // Set active nav button based on current page
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    navButtons.forEach(button => {
        if (button.getAttribute('data-page') === currentPage || 
            (currentPage === 'home' && button.getAttribute('data-page') === 'dashboard')) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
});

function updateStatsDisplay() {
    document.getElementById('playerLevel').textContent = localStorage.getItem('playerLevel');
    document.getElementById('playerGold').textContent = localStorage.getItem('playerGold');
    document.getElementById('playerSTR').textContent = localStorage.getItem('playerSTR');
    document.getElementById('playerAGI').textContent = localStorage.getItem('playerAGI');
    document.getElementById('playerVIT').textContent = localStorage.getItem('playerVIT');
    document.getElementById('playerINT').textContent = localStorage.getItem('playerINT');
    document.getElementById('playerPER').textContent = localStorage.getItem('playerPER');
    document.getElementById('playerJob').textContent = localStorage.getItem('playerJob');
    document.getElementById('playerTitle').textContent = localStorage.getItem('playerTitle');
    
    const dailyQuestsCompleted = parseInt(localStorage.getItem('dailyQuestsCompleted')) || 0;
    const progressPercentage = (dailyQuestsCompleted / 3) * 100;
    if (document.getElementById('dailyProgress')) {
        document.getElementById('dailyProgress').style.width = `${progressPercentage}%`;
        document.getElementById('progressText').textContent = `${dailyQuestsCompleted}/3 Daily Quests Completed`;
    }
    
    // Update gold display on all pages
    const goldDisplays = document.querySelectorAll('#playerGold, #inventoryGold');
    goldDisplays.forEach(display => {
        if (display) display.textContent = localStorage.getItem('playerGold') || '0';
    });
}