// Quests System
document.addEventListener('DOMContentLoaded', function() {
    // Check if player is logged in
    if (!localStorage.getItem('playerName')) {
        window.location.href = 'index.html';
    }
    
    // Load player stats
    document.getElementById('playerLevel').textContent = localStorage.getItem('playerLevel');
    document.getElementById('playerGold').textContent = localStorage.getItem('playerGold');
    
    const dailyQuestsCompleted = parseInt(localStorage.getItem('dailyQuestsCompleted')) || 0;
    
    // Mark completed quests
    const completedQuests = JSON.parse(localStorage.getItem('completedQuests') || '[]');
    if (completedQuests.includes(1)) {
        document.querySelector('.btn-quest').textContent = 'COMPLETED';
        document.querySelector('.btn-quest').disabled = true;
        
        // Update goal progress to completed
        document.querySelectorAll('.goal-progress').forEach(progress => {
            progress.textContent = progress.textContent.replace('0/', '');
        });
    }
    
    // Add hover effect to goal items
    document.querySelectorAll('.goal-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            const hoverSound = document.getElementById('hoverSound');
            if (hoverSound) hoverSound.play();
        });
    });
});

// Complete quest function
function completeQuest(questId) {
    if (localStorage.getItem('systemAccepted') !== 'true') {
        alert('You must accept the system first from the dashboard.');
        return;
    }
    
    const completedQuests = JSON.parse(localStorage.getItem('completedQuests') || '[]');
    
    // Check if quest already completed
    if (completedQuests.includes(questId)) {
        alert('This quest has already been completed today.');
        return;
    }
    
    // Play quest complete sound
    const questCompleteSound = document.getElementById('questCompleteSound');
    questCompleteSound.play();
    
    // Mark quest as completed
    completedQuests.push(questId);
    localStorage.setItem('completedQuests', JSON.stringify(completedQuests));
    
    // Update daily quests count
    const dailyQuestsCompleted = parseInt(localStorage.getItem('dailyQuestsCompleted')) || 0;
    const newCount = dailyQuestsCompleted + 1;
    localStorage.setItem('dailyQuestsCompleted', newCount.toString());
    
    // Update UI
    const questButton = document.querySelector('.btn-quest');
    questButton.textContent = 'COMPLETED';
    questButton.disabled = true;
    
    // Update goal progress to completed
    document.querySelectorAll('.goal-progress').forEach(progress => {
        progress.textContent = progress.textContent.replace('0/', '');
    });
    
    // Add gold reward
    addGold(50);
    
    // Increase stats
    const str = parseInt(localStorage.getItem('playerSTR'));
    const vit = parseInt(localStorage.getItem('playerVIT'));
    localStorage.setItem('playerSTR', (str + 5).toString());
    localStorage.setItem('playerVIT', (vit + 5).toString());
    
    // Add experience
    const currentExp = parseInt(localStorage.getItem('playerExp') || 0);
    const expNeeded = parseInt(localStorage.getItem('playerLevel')) * 100;
    const newExp = currentExp + 100;
    
    if (newExp >= expNeeded) {
        levelUp();
        localStorage.setItem('playerExp', '0');
    } else {
        localStorage.setItem('playerExp', newExp.toString());
    }
    
    // Show quest complete animation
    const questCompleteAnimation = document.createElement('div');
    questCompleteAnimation.className = 'quest-complete-animation';
    questCompleteAnimation.innerHTML = `
        <img src="pictures\tetg.jpg" alt="Quest Complete">
        <p>QUEST COMPLETE!</p>
    `;
    document.querySelector('.system-main').prepend(questCompleteAnimation);
    
    setTimeout(() => {
        questCompleteAnimation.remove();
    }, 3000);
    
    // Check for bonus
    if (newCount >= 3) {
        // Add bonus rewards
        addGold(100);
        
        // Show bonus message
        const bonusMessage = document.createElement('div');
        bonusMessage.className = 'system-notification bonus-message';
        bonusMessage.innerHTML = `
            <p>DAILY BONUS ACQUIRED!</p>
            <p>+100 Gold and +5 to all stats</p>
            <img src="images/bonus.gif" alt="Bonus" class="bonus-gif">
        `;
        document.querySelector('.system-main').prepend(bonusMessage);
        
        // Play bonus sound
        const bonusSound = new Audio('sounds/bonus.mp3');
        bonusSound.play();
        
        setTimeout(() => {
            bonusMessage.remove();
        }, 5000);
        
        // Increase all stats
        const str = parseInt(localStorage.getItem('playerSTR'));
        const agi = parseInt(localStorage.getItem('playerAGI'));
        const vit = parseInt(localStorage.getItem('playerVIT'));
        const int = parseInt(localStorage.getItem('playerINT'));
        const per = parseInt(localStorage.getItem('playerPER'));
        
        localStorage.setItem('playerSTR', (str + 5).toString());
        localStorage.setItem('playerAGI', (agi + 5).toString());
        localStorage.setItem('playerVIT', (vit + 5).toString());
        localStorage.setItem('playerINT', (int + 5).toString());
        localStorage.setItem('playerPER', (per + 5).toString());
    }
}