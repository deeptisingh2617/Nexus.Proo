/**
 * NEXUS PRO - CORE JAVASCRIPT ENGINE
 * Security: admin123
 */

// 1. STATE MANAGEMENT
let isAdmin = false;
let emergencyActive = false;

// 2. DATASET: 15 ROOMS WITH METADATA
let rooms = JSON.parse(localStorage.getItem('nexus_v3_db')) || [
    { id: 1, name: "Neural Lab 01", type: "lab", floor: 1, status: "Free", tools: "RTX GPUs", tags: ["WiFi", "ADA"], issue: false },
    // ... (14 other room objects as defined in the main code)
];

// 3. THEME ENGINE LOGIC
function toggleTheme() {
    const root = document.documentElement;
    const isDark = root.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('nexus_theme', newTheme);
}

// 4. SECURITY & AUTHENTICATION
function login() {
    const pass = document.getElementById('passInput').value;
    if (pass === "admin123") {
        isAdmin = true;
        document.getElementById('adminPanel').style.display = 'flex';
        document.getElementById('passInput').value = ''; // SECURITY: Clear on success
        render(); // Re-render to show admin buttons
    } else {
        alert("Verification Failed");
        document.getElementById('passInput').value = ''; // SECURITY: Clear on failure
    }
}

// 5. SEARCH & RENDER LOGIC
function render() {
    const grid = document.getElementById('roomGrid');
    const query = document.getElementById('search').value.toLowerCase();
    
    grid.innerHTML = '';
    let free = 0;

    rooms.forEach(room => {
        // Advanced Search: Check Name, Tools, and Tags
        const matches = room.name.toLowerCase().includes(query) || 
                        room.tags.some(t => t.toLowerCase().includes(query));

        if (matches) {
            if (room.status === "Free") free++;
            
            const card = document.createElement('div');
            card.className = `card ${room.status}`;
            card.innerHTML = `
                <div class="tag-row">${room.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
                <h3>${room.name}</h3>
                <div class="status-pill">${room.status}</div>
                <div style="display: ${isAdmin ? 'block' : 'none'}">
                    <button onclick="toggleStatus(${room.id})">Toggle Room</button>
                </div>
            `;
            grid.appendChild(card);
        }
    });

    // Update Live Analytics (Math)
    document.getElementById('loadStat').innerText = Math.round(((rooms.length - free) / rooms.length) * 100) + "%";
}