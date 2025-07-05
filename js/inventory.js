// Inventory System
document.addEventListener('DOMContentLoaded', function() {
    // Check if player is logged in
    if (!localStorage.getItem('playerName')) {
        window.location.href = 'index.html';
    }
    document.getElementById('playerGold').textContent = localStorage.getItem('playerGold') || '0';
    // Load inventory data
    const inventory = JSON.parse(localStorage.getItem('inventory')) || {
        weapons: ['dagger'],
        armor: ['leather'],
        consumables: { potion: 5, elixir: 3 },
        questItems: ['dungeon-key']
    };
    
    // Update inventory display
    updateInventoryDisplay(inventory);
    
    // Set up equip/use buttons
    const equipButtons = document.querySelectorAll('.btn-equip');
    const useButtons = document.querySelectorAll('.btn-use');
    
    equipButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemName = this.parentElement.querySelector('h4').textContent;
            equipItem(itemName);
        });
    });
    
    useButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemName = this.parentElement.querySelector('h4').textContent;
            useItem(itemName);
        });
    });
});

function updateInventoryDisplay(inventory) {
    // Update weapon unlocks
    inventory.weapons.forEach(weapon => {
        const itemElement = document.querySelector(`.inventory-item img[alt*="${weapon}"]`)?.parentElement;
        if (itemElement) {
            itemElement.classList.remove('locked');
            itemElement.querySelector('button').style.display = 'block';
        }
    });
    
    // Update armor unlocks
    inventory.armor.forEach(armor => {
        const itemElement = document.querySelector(`.inventory-item img[alt*="${armor}"]`)?.parentElement;
        if (itemElement) {
            itemElement.classList.remove('locked');
            itemElement.querySelector('button').style.display = 'block';
        }
    });
    inventory.questItems.forEach(questItem => {
        const itemElement = document.querySelector(`.inventory-item img[alt*="${questItem}"]`)?.parentElement;
        if (itemElement) {
            itemElement.classList.remove('locked');
            itemElement.querySelector('button').style.display = 'block';
        }});
    
    // Update consumable counts
    for (const [item, count] of Object.entries(inventory.consumables)) {
        const itemElement = document.querySelector(`.inventory-item img[alt*="${item}"]`)?.parentElement;
        if (itemElement) {
            itemElement.querySelector('p').textContent = `x${count}`;
        }
    }
}

function equipItem(itemName) {
    const equipSound = document.getElementById('equipSound');
    equipSound.play();
    
    // Show equip message
    const systemMessage = document.createElement('div');
    systemMessage.className = 'system-notification';
    systemMessage.textContent = `${itemName} equipped!`;
    document.querySelector('.system-main').prepend(systemMessage);
    
    setTimeout(() => {
        systemMessage.remove();
    }, 3000);
    
    // In a real game, you would update player stats here
}

function useItem(itemName) {
    const useSound = document.getElementById('useSound');
    useSound.play();
    
    // Show use message
    const systemMessage = document.createElement('div');
    systemMessage.className = 'system-notification';
    systemMessage.textContent = `Used ${itemName}!`;
    document.querySelector('.system-main').prepend(systemMessage);
    
    setTimeout(() => {
        systemMessage.remove();
    }, 3000);
    
    // Update inventory count
    const inventory = JSON.parse(localStorage.getItem('inventory'));
    if (inventory.consumables[itemName.toLowerCase()]) {
        inventory.consumables[itemName.toLowerCase()]--;
        if (inventory.consumables[itemName.toLowerCase()] <= 0) {
            delete inventory.consumables[itemName.toLowerCase()];
        }
        localStorage.setItem('inventory', JSON.stringify(inventory));
        updateInventoryDisplay(inventory);
    }
}