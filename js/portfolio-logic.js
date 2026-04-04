// Custom Cursor Logic
const cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
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
    const reveals = document.querySelectorAll(".reveal-v2");
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

// Nav Active State
window.addEventListener('scroll', () => {
    let current = "";
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.floating-nav a');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});
