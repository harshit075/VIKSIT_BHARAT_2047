// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    renderTabs();
    renderQuiz();
    
    // Mobile Menu Toggle
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });
});

// Smooth Scroll
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    document.getElementById('mobile-menu').classList.add('hidden');
}

// --- TABS LOGIC ---
const tabData = [
    {
        title: "Cultural Diplomacy",
        icon: "globe",
        points: [
            "Global Wellness Week expansion for Yoga Day",
            "Digital Museums (AR/VR) for Hampi & Ajanta",
            "Ayurveda & Millets promotion globally",
            "50 new Indian Culture Centers"
        ]
    },
    {
        title: "Innovation & Tech",
        icon: "smartphone",
        points: [
            "Export UPI infrastructure to 50 nations",
            "Metaverse India: Virtual Tourism",
            "Ayurveda + Modern Science research",
            "ISRO & Chandrayaan Tech Diplomacy"
        ]
    },
    {
        title: "Youth Power",
        icon: "trending-up",
        points: [
            "10 Lakh Digital Soft Power Ambassadors",
            "Heritage Fellowships for Diaspora Youth",
            "AI translation of Sanskrit texts",
            "Soft Power Startup Fund"
        ]
    }
];

let activeTab = 0;

function renderTabs() {
    const nav = document.getElementById('tabs-nav');
    const content = document.getElementById('tab-content');
    
    // Render Buttons
    nav.innerHTML = tabData.map((tab, idx) => `
        <button onclick="switchTab(${idx})" 
            class="tab-btn w-full text-left p-4 rounded-xl transition-all duration-300 flex items-center gap-4 border-l-4 ${activeTab === idx ? 'tab-active' : 'bg-transparent border-transparent hover:bg-gray-50'}">
            <div class="icon-box w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${activeTab === idx ? '' : 'bg-gray-200 text-gray-600'}">
                <i data-lucide="${tab.icon}"></i>
            </div>
            <div>
                <h3 class="font-bold text-lg text-box transition-colors ${activeTab === idx ? '' : 'text-gray-600'}">
                    ${tab.title}
                </h3>
            </div>
        </button>
    `).join('');

    // Render Content
    const currentTab = tabData[activeTab];
    content.innerHTML = `
        <div class="mb-6 flex items-center gap-3 animate-fade-in-up">
            <span class="p-2 bg-orange-100 text-orange-600 rounded-lg"><i data-lucide="${currentTab.icon}" class="w-6 h-6"></i></span>
            <h3 class="text-2xl font-bold text-gray-900">${currentTab.title}</h3>
        </div>
        <div class="grid md:grid-cols-2 gap-4 animate-fade-in-up">
            ${currentTab.points.map(pt => `
                <div class="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div class="mt-1 min-w-[20px]">
                        <div class="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
                    </div>
                    <p class="text-gray-700 leading-relaxed text-sm">${pt}</p>
                </div>
            `).join('')}
        </div>
        ${activeTab === 1 ? `
            <div class="mt-8 p-4 bg-blue-900 text-white rounded-xl flex items-center justify-between shadow-lg animate-fade-in-up">
                <div>
                    <p class="font-bold">Did you know?</p>
                    <p class="text-sm text-blue-200">Chandrayaan-3 made India the first nation to land on the Lunar South Pole.</p>
                </div>
                <i data-lucide="rocket" class="text-orange-400 w-8 h-8 animate-pulse"></i>
            </div>
        ` : ''}
    `;
    
    lucide.createIcons(); // Re-initialize icons for new DOM elements
}

function switchTab(idx) {
    activeTab = idx;
    renderTabs();
}

// --- GAME LOGIC (CANVAS) ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const catcherSize = 60;
const itemSize = 30;

let gameState = {
    status: 'START', // START, PLAYING, GAME_OVER
    score: 0,
    playerX: 150,
    items: [],
    lastSpawn: 0,
    animationId: null
};

const assets = {
    yoga: { color: '#F97316', icon: '🧘' },
    tech: { color: '#2563EB', icon: '🚀' },
    culture: { color: '#059669', icon: '📽️' },
    money: { color: '#EAB308', icon: '₹' },
    bad: { color: '#EF4444', icon: '❌' }
};

function spawnItem(width) {
    const types = ['yoga', 'tech', 'culture', 'money', 'bad'];
    const type = types[Math.floor(Math.random() * types.length)];
    const speed = type === 'bad' ? 3 + Math.random() * 2 : 2 + Math.random() * 1.5;
    return { x: Math.random() * (width - itemSize), y: -itemSize, type, speed };
}

function updateGame() {
    if (gameState.status !== 'PLAYING') return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Spawn Logic
    const now = Date.now();
    if (now - gameState.lastSpawn > 800) {
        gameState.items.push(spawnItem(width));
        gameState.lastSpawn = now;
    }

    // Update & Draw Items
    for (let i = gameState.items.length - 1; i >= 0; i--) {
        let item = gameState.items[i];
        item.y += item.speed;

        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(assets[item.type].icon, item.x + itemSize/2, item.y + itemSize/2 + 8);

        // Collision
        if (
            item.y + itemSize > height - 30 && // Approximate catcher height area
            item.y < height &&
            item.x + itemSize > gameState.playerX &&
            item.x < gameState.playerX + catcherSize
        ) {
            if (item.type === 'bad') {
                gameOver();
                return;
            } else {
                gameState.score += 10;
                document.getElementById('game-score').innerText = gameState.score;
                gameState.items.splice(i, 1);
            }
        } else if (item.y > height) {
            gameState.items.splice(i, 1);
        }
    }

    // Draw Player
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(gameState.playerX, height - 20, catcherSize, 20);
    ctx.fillStyle = '#F97316';
    ctx.fillRect(gameState.playerX, height - 20, catcherSize, 6);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(gameState.playerX, height - 14, catcherSize, 6);
    ctx.fillStyle = '#059669';
    ctx.fillRect(gameState.playerX, height - 8, catcherSize, 6);

    gameState.animationId = requestAnimationFrame(updateGame);
}

function startGame() {
    gameState.status = 'PLAYING';
    gameState.score = 0;
    gameState.items = [];
    gameState.lastSpawn = Date.now();
    document.getElementById('game-score').innerText = '0';
    document.getElementById('game-start-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    updateGame();
}

function gameOver() {
    gameState.status = 'GAME_OVER';
    cancelAnimationFrame(gameState.animationId);
    document.getElementById('final-score').innerText = gameState.score;
    document.getElementById('game-over-screen').classList.remove('hidden');
}

// Input Handling
function handleInput(clientX) {
    if (gameState.status !== 'PLAYING') return;
    const rect = canvas.getBoundingClientRect();
    // Calculate scale factor in case canvas is resized by CSS
    const scaleX = canvas.width / rect.width;
    
    const relativeX = (clientX - rect.left) * scaleX;
    gameState.playerX = Math.max(0, Math.min(canvas.width - catcherSize, relativeX - catcherSize/2));
}

canvas.addEventListener('mousemove', (e) => handleInput(e.clientX));
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent scrolling
    handleInput(e.touches[0].clientX);
}, { passive: false });


// --- QUIZ LOGIC ---
const quizData = [
    {
        question: "Which ancient philosophy forms the root of India's Soft Power?",
        options: ["Divide and Rule", "Vasudhaiva Kutumbakam", "Survival of the Fittest", "Isolationism"],
        answer: 1,
        explanation: "'Vasudhaiva Kutumbakam' means 'The World is One Family' and promotes co-existence."
    },
    {
        question: "In how many countries is Yoga practiced today?",
        options: ["50+", "100+", "180+", "25+"],
        answer: 2,
        explanation: "Yoga is practiced in over 180 countries, acting as a global bridge for wellness."
    },
    {
        question: "Which Indian digital innovation is considered a 'Policy Soft Power'?",
        options: ["5G Network", "UPI (Unified Payments Interface)", "Email", "Social Media"],
        answer: 1,
        explanation: "UPI has been adopted by France, Singapore, and UAE, showcasing India's tech solutions."
    },
    {
        question: "What is the size of the Indian Diaspora acting as 'Living Bridges'?",
        options: ["10 Million", "30 Million", "5 Million", "50 Million"],
        answer: 1,
        explanation: "Over 30 million Indians living abroad act as cultural ambassadors."
    }
];

let currentQ = 0;
let quizScore = 0;
let selectedOption = null;
let quizCompleted = false;

function renderQuiz() {
    const container = document.getElementById('quiz-container');
    const progress = document.getElementById('quiz-progress');

    if (quizCompleted) {
        progress.innerText = "Completed";
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-center animate-fade-in-up">
                <div class="text-6xl mb-4">🇮🇳</div>
                <h3 class="text-2xl font-bold text-gray-800 mb-2">Quiz Completed!</h3>
                <p class="text-lg mb-6">You scored <span class="font-bold text-emerald-600">${quizScore}/${quizData.length}</span></p>
                <button onclick="resetQuiz()" class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 w-full transition-colors shadow-lg">
                    Play Again
                </button>
            </div>
        `;
        return;
    }

    progress.innerText = `${currentQ + 1} / ${quizData.length}`;
    const q = quizData[currentQ];

    container.innerHTML = `
        <div class="flex-1 flex flex-col justify-between animate-fade-in-up">
            <div>
                <h4 class="text-xl font-semibold text-gray-800 mb-6">${q.question}</h4>
                <div class="space-y-3">
                    ${q.options.map((opt, idx) => `
                        <button onclick="handleOption(${idx})" 
                            ${selectedOption !== null ? 'disabled' : ''}
                            class="w-full text-left p-4 rounded-lg border-2 transition-all duration-200 font-medium text-sm md:text-base flex justify-between items-center
                            ${selectedOption === null 
                                ? 'border-gray-100 hover:border-blue-300 hover:bg-blue-50 text-gray-700' 
                                : selectedOption === idx 
                                    ? (idx === q.answer ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-red-500 bg-red-50 text-red-800')
                                    : (idx === q.answer ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-gray-100 text-gray-400')
                            }">
                            ${opt}
                            ${selectedOption !== null && idx === q.answer ? '<i data-lucide="check-circle" class="w-5 h-5 text-emerald-600"></i>' : ''}
                            ${selectedOption === idx && idx !== q.answer ? '<i data-lucide="x-circle" class="w-5 h-5 text-red-600"></i>' : ''}
                        </button>
                    `).join('')}
                </div>
            </div>

            ${selectedOption !== null ? `
                <div class="mt-6 animate-fade-in-up">
                    <p class="text-sm text-gray-600 italic mb-4 bg-gray-50 p-3 rounded-lg border-l-4 border-blue-400">
                        💡 ${q.explanation}
                    </p>
                    <button onclick="nextQuestion()" class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                        ${currentQ < quizData.length - 1 ? 'Next Question' : 'View Results'} <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </button>
                </div>
            ` : ''}
        </div>
    `;
    lucide.createIcons();
}

function handleOption(idx) {
    if (selectedOption !== null) return;
    selectedOption = idx;
    if (idx === quizData[currentQ].answer) quizScore++;
    renderQuiz();
}

function nextQuestion() {
    if (currentQ < quizData.length - 1) {
        currentQ++;
        selectedOption = null;
    } else {
        quizCompleted = true;
    }
    renderQuiz();
}

function resetQuiz() {
    currentQ = 0;
    quizScore = 0;
    selectedOption = null;
    quizCompleted = false;
    renderQuiz();
}