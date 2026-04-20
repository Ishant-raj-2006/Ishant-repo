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

// Scroll Reveal
function reveal() {
    const reveals = document.querySelectorAll(".reveal-v2, .reveal");
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            el.classList.add("active");
        }
    });
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
        case 'ccc-management': initCCCManagement(); break;
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

// --- CCC VIRTUAL CORE LOGIC ---
const cccFirebaseConfig = {
    apiKey: "AIzaSyCTkM0HrrIOb3D1IOp5nLOh7unRLwu1nxw",
    authDomain: "champaran-choching-center.firebaseapp.com",
    databaseURL: "https://champaran-choching-center-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "champaran-choching-center",
    storageBucket: "champaran-choching-center.firebasestorage.app",
    messagingSenderId: "473187056929",
    appId: "1:473187056929:web:c62bdc65d3038a93141260",
    measurementId: "G-SXM6HBBWEX"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const cccApp = initializeApp(cccFirebaseConfig);
const cccDb = getDatabase(cccApp);
let cccData = null;

function saveCCCToCloud() {
    return set(ref(cccDb, 'ccc_master_data'), cccData);
}

function initCCCManagement() {
    onValue(ref(cccDb, 'ccc_master_data'), (snapshot) => {
        cccData = snapshot.val();
        if (cccData && document.getElementById('ccc-v-view-dashboard').classList.contains('active')) {
            // If already on dashboard, refresh current tab
            const activeTab = document.querySelector('.ccc-v-tab-btn.active')?.dataset.tab;
            if (activeTab) switchCCCTab(activeTab);
        }
    });

    const loginForm = document.getElementById('ccc-v-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('ccc-v-email').value.trim().toLowerCase();
            const pass = document.getElementById('ccc-v-pass').value;
            const user = (cccData?.students || []).find(s => s.email.toLowerCase() === email && s.phone === pass);

            if (user) {
                renderCCCDashboard(user);
            } else {
                alert("Invalid Credentials! Try demo@student.com / 1234567890");
            }
        });
    }

    const adminLoginForm = document.getElementById('ccc-v-admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('ccc-v-admin-user').value;
            const pass = document.getElementById('ccc-v-admin-pass').value;
            if (user === "Ishant_raj_2006" && pass === "Hello123") {
                renderCCCAdmin();
            } else {
                alert("Unauthorized!");
            }
        });
    }
}

window.switchCCCView = function(view) {
    document.querySelectorAll('.ccc-v-view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(`ccc-v-view-${view}`);
    if (target) target.classList.add('active');
};

window.switchCCCTab = function(tab) {
    document.querySelectorAll('.ccc-v-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    const content = document.getElementById('ccc-v-admin-content');
    if (!content) return;

    if (tab === 'students') {
        content.innerHTML = `
            <div class="d-flex justify-content-between mb-3"><h4>Manage Students</h4> <button class="btn-cyan px-3" onclick="vAddStudent()">+ Add Student</button></div>
            <table class="ccc-v-table">
                <thead><tr><th>Name</th><th>Class</th><th>Fees</th><th>Action</th></tr></thead>
                <tbody>${(cccData.students || []).map(s => `<tr><td>${s.name}</td><td>${s.class}th</td><td>P:₹${s.fee.paid}</td><td><button onclick="vEditFee('${s.email}')" class="btn-cyan px-2" style="font-size:0.7rem">Fee</button></td></tr>`).join('')}</tbody>
            </table>
        `;
    } else if (tab === 'attendance') {
        content.innerHTML = `
            <h4>Mark Attendance</h4>
            <div class="form-row mb-3 mt-3">
                <select id="vAttClass" class="ccc-v-input" onchange="vLoadAttList()">
                    <option value="">Select Class</option>
                    <option value="8">8th</option><option value="9">9th</option><option value="10">10th</option><option value="11">11th</option><option value="12">12th</option>
                </select>
                <input type="text" id="vAttTopic" class="ccc-v-input" placeholder="Topic Name">
            </div>
            <div id="vAttList"></div>
            <button onclick="vSaveAttendance()" class="btn-cyan w-100 mt-3">Save Attendance</button>
        `;
    } else if (tab === 'timetable') {
        content.innerHTML = `
            <h4>Update Timetable</h4>
            ${[8,9,10,11,12].map(c => `<div class="mb-2"><label>Class ${c}th</label><input type="text" class="ccc-v-input v-tt-in" data-class="${c}" value="${cccData.timetable[c] || ''}"></div>`).join('')}
            <button onclick="vSaveTimetable()" class="btn-cyan w-100 mt-2">Update All</button>
        `;
    }
};

window.vAddStudent = () => {
    const n = prompt("Name:"), c = prompt("Class:"), e = prompt("Email:"), p = prompt("Phone:");
    if (n && c && e && p) {
        if (!cccData.students) cccData.students = [];
        cccData.students.push({ name: n, class: c, email: e.toLowerCase(), phone: p, fee: { paid: 0, due: 1500 } });
        saveCCCToCloud().then(() => alert("Student Added!"));
    }
};

window.vLoadAttList = () => {
    const cls = document.getElementById('vAttClass').value;
    const div = document.getElementById('vAttList');
    if (!cls) return div.innerHTML = "";
    const list = (cccData.students || []).filter(s => s.class === cls);
    div.innerHTML = `<table class="ccc-v-table"><thead><tr><th>Name</th><th>Status</th></tr></thead><tbody>${list.map(s => `<tr><td>${s.name}</td><td><select class="ccc-v-input v-att-s" data-email="${s.email}"><option value="P">Present</option><option value="A">Absent</option></select></td></tr>`).join('')}</tbody></table>`;
};

window.vSaveAttendance = () => {
    const cls = document.getElementById('vAttClass').value;
    const topic = document.getElementById('vAttTopic').value;
    if (!cls || !topic) return alert("Fill class and topic!");
    const statusData = {};
    document.querySelectorAll('.v-att-s').forEach(s => statusData[s.dataset.email] = s.value);
    if (!cccData.attendanceRecords) cccData.attendanceRecords = [];
    cccData.attendanceRecords.push({ date: new Date().toLocaleDateString(), class: cls, topic, data: statusData });
    saveCCCToCloud().then(() => alert("Attendance Saved!"));
};

window.vSaveTimetable = () => {
    document.querySelectorAll('.v-tt-in').forEach(i => cccData.timetable[i.dataset.class] = i.value);
    saveCCCToCloud().then(() => alert("Timetable Updated!"));
};

window.vEditFee = (email) => {
    const s = cccData.students.find(x => x.email === email);
    if (!s) return;
    const p = prompt("Enter Paid Amount:", s.fee.paid);
    if (p !== null) { s.fee.paid = p; saveCCCToCloud().then(() => alert("Fee Updated!")); }
};

function renderCCCDashboard(user) {
    window.switchCCCView('dashboard');
    const root = document.getElementById('ccc-v-view-dashboard');
    const uClass = user.class;
    const timetable = cccData.timetable || {};
    
    // Generate Attendance Rows
    let attRows = "";
    (cccData.attendanceRecords || []).forEach(record => {
        const status = record.data ? (record.data[user.email] || record.data[user.email.toLowerCase()]) : null;
        if (status) {
            attRows += `<tr><td>${record.date}</td><td><span class="ccc-v-badge ${status === 'P' ? 'present' : 'absent'}">${status}</span></td><td>${record.topic}</td></tr>`;
        }
    });

    root.innerHTML = `
        <div class="ccc-v-dashboard">
            <aside class="ccc-v-sidebar">
                <div class="text-center mb-4">
                    <img src="coaching_center_logo_1775973304457.png" style="width: 80px; border-radius: 50%; border: 3px solid var(--primary-cyan); padding: 3px;">
                    <h3 class="mt-3" style="font-size:1.1rem">${user.name}</h3>
                    <p class="text-dim">Class ${uClass}th</p>
                </div>
                <button class="btn-cyan w-100" onclick="switchCCCView('login')">Logout</button>
            </aside>
            <main class="ccc-v-main">
                <div class="ccc-v-card">
                    <h4><i class="fas fa-clock mr-2"></i> Today's Schedule</h4>
                    <p class="mt-2" style="font-size: 1.2rem; color: var(--primary-cyan);">${timetable[uClass] || "No classes scheduled"}</p>
                </div>
                <div class="ccc-v-card">
                    <h4><i class="fas fa-calendar-check mr-2"></i> Attendance Log</h4>
                    <table class="ccc-v-table">
                        <thead><tr><th>Date</th><th>Status</th><th>Topic</th></tr></thead>
                        <tbody>${attRows || '<tr><td colspan="3">No records found</td></tr>'}</tbody>
                    </table>
                </div>
            </main>
        </div>
    `;
}

function renderCCCAdmin() {
    window.switchCCCView('dashboard');
    const root = document.getElementById('ccc-v-view-dashboard');
    root.innerHTML = `
        <div class="ccc-v-dashboard">
            <aside class="ccc-v-sidebar">
                <h4 class="mb-4" style="color:var(--primary-cyan)">Teacher Admin</h4>
                <div class="d-flex flex-column gap-2">
                    <button class="ccc-v-tab-btn active" data-tab="students" onclick="switchCCCTab('students')">Students</button>
                    <button class="ccc-v-tab-btn" data-tab="attendance" onclick="switchCCCTab('attendance')">Attendance</button>
                    <button class="ccc-v-tab-btn" data-tab="timetable" onclick="switchCCCTab('timetable')">Timetable</button>
                    <hr style="border-color:var(--glass-border)">
                    <button class="btn-cyan w-100 mt-2" onclick="switchCCCView('login')">Logout</button>
                </div>
            </aside>
            <main class="ccc-v-main" id="ccc-v-admin-content">
                <!-- Content loaded via switchCCCTab -->
            </main>
        </div>
    `;
    switchCCCTab('students');
}
