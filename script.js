/* --- PORTFOLIO SCRIPT --- */
// Custom Cursor
const cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', (e) => {
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// Typing Animation
const textElement = document.getElementById('typing-text');
const texts = ['Software Engineering', 'Full Stack Development', 'Computer Science'];
let charIndex = 0;
let textIndex = 0;
let isDeleting = false;

function type() {
    if (!textElement) return;
    const currentText = texts[textIndex];
    if (isDeleting) {
        textElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        textElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        setTimeout(type, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(type, 500);
    } else {
        setTimeout(type, isDeleting ? 50 : 100);
    }
}
type();

// Scroll Spy & Reveal
function updateActiveNav() {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".floating-nav a");
    
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 150) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes(current)) {
            link.classList.add("active");
        }
    });
}

function reveal() {
    const reveals = document.querySelectorAll(".reveal-v2, .reveal");
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            el.classList.add("active");
        }
    });
    updateActiveNav();
}
window.addEventListener("scroll", reveal);
reveal();

// -- PROJECT OVERLAY SYSTEM --
const projectOverlay = document.getElementById('project-overlay');
const overlayContent = document.getElementById('overlay-main-content');

window.openProject = function(projectId) {
    projectOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    overlayContent.innerHTML = '';
    const template = document.getElementById(`template-${projectId}`);
    if (template) {
        overlayContent.innerHTML = template.innerHTML;
        setTimeout(() => {
            initProjectLogic(projectId);
            reveal();
        }, 100);
    }
};

window.closeProject = function() {
    projectOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
};

function initProjectLogic(projectId) {
    switch(projectId) {
        case 'location-finder': initLocationFinder(); break;
        case 'mini-chatbot': initMiniChatbot(); break;
        case 'rank-ignite-leaderboard': initLeaderboard(); break;
        case 'chess-game': initChessGame(); break;
        case 'qr-generator': initQRGenerator(); break;
        case 'calendar-generator': initCalendarGenerator(); break;
    }
}

// --- PROJECT SPECIFIC LOGIC ---
function initLocationFinder() {
    const pincodeInput = document.getElementById('pincode');
    if (!pincodeInput) return;
    pincodeInput.addEventListener('input', function() {
        const pincode = this.value;
        if (pincode.length === 6 && /^\d{6}$/.test(pincode)) {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${pincode},India&limit=1`)
                .then(r => r.json()).then(data => {
                    if (data.length > 0) {
                        const p = data[0];
                        const res = document.getElementById('results');
                        res.innerHTML = `<div id="address">${p.display_name}</div><div id="map"></div>`;
                        const map = L.map('map').setView([p.lat, p.lon], 13);
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
                        L.marker([p.lat, p.lon]).addTo(map);
                    }
                });
        }
    });
}

function initMiniChatbot() {
    const form = document.getElementById('chatForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('userInput');
        const msg = input.value;
        if (!msg) return;
        const container = document.getElementById('messagesContainer');
        container.innerHTML += `<div class="message user">${msg}</div>`;
        input.value = '';
        // Mock bot response
        setTimeout(() => {
            container.innerHTML += `<div class="message bot">This is a demo response from the Chatbot.</div>`;
            container.scrollTop = container.scrollHeight;
        }, 1000);
    });
}

function initLeaderboard() {
    const s = document.getElementById("searchInput");
    if (s) s.addEventListener("input", (e) => {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll(".leaderboard-row").forEach(r => {
            r.style.display = r.innerText.toLowerCase().includes(q) ? "" : "none";
        });
    });
}

function initQRGenerator() {
    const i = document.getElementById('qr-input');
    const c = document.getElementById('qrcode');
    if (i && c) {
        new QRCode(c, i.value);
        i.addEventListener('input', () => { c.innerHTML = ''; new QRCode(c, i.value); });
    }
}

function initCalendarGenerator() {
    const btn = document.getElementById('generate-calendar');
    if (btn) btn.addEventListener('click', () => {
        const out = document.getElementById('calendar-output');
        const year = document.getElementById('calendar-year').value;
        out.textContent = `Calendar Generated for the year ${year}. (Demo View)`;
    });
}

function initChessGame() {
    console.log("Chess Game Initialized");
}

window.downloadPortfolio = function() { window.print(); };


