/* ── Main Carousel ── */
const track         = document.getElementById('carouselTrack');
const imgs          = Array.from(track.querySelectorAll('img'));
const n             = imgs.length;
let   currentIndex  = 0;
let   autoTimer;

const ALL_STATES = ['is-active','is-prev','is-next','is-far-prev','is-far-next','is-hidden'];

function applyStates() {
    imgs.forEach((img, i) => {
        img.classList.remove(...ALL_STATES);
        const diff = ((i - currentIndex) % n + n) % n;
        if      (diff === 0)     img.classList.add('is-active');
        else if (diff === 1)     img.classList.add('is-next');
        else if (diff === 2)     img.classList.add('is-far-next');
        else if (diff === n - 1) img.classList.add('is-prev');
        else if (diff === n - 2) img.classList.add('is-far-prev');
        else                     img.classList.add('is-hidden');
    });
}

function goTo(index) {
    currentIndex = ((index % n) + n) % n;
    applyStates();
    resetAuto();
}

function moveSlide(dir) { goTo(currentIndex + dir); }

function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => moveSlide(1), 4000);
}

let touchStartX = null;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? moveSlide(1) : moveSlide(-1);
    touchStartX = null;
}, { passive: true });

applyStates();
resetAuto();

/* ── Testimonials ── */
const testiSlider = document.getElementById('testiSlider');
const testiCards = document.querySelectorAll('.testi-card');
let currentTesti = 0;
let testiTimer;

function showTestimonial(index, isPrev = false) {
    if (testiCards.length === 0) return;

    if (isPrev) {
        testiSlider.classList.add('reverse');
    } else {
        testiSlider.classList.remove('reverse');
    }

    testiCards.forEach(card => card.classList.remove('exiting', 'active'));
    testiCards[currentTesti].classList.add('exiting');

    if (index < 0) {
        currentTesti = testiCards.length - 1;
    } else if (index >= testiCards.length) {
        currentTesti = 0;
    } else {
        currentTesti = index;
    }

    void testiSlider.offsetWidth;
    testiCards[currentTesti].classList.add('active');
    
    resetTestiTimer();
}

function nextTesti() { showTestimonial(currentTesti + 1, false); }
function prevTesti() { showTestimonial(currentTesti - 1, true); }

function resetTestiTimer() {
    clearInterval(testiTimer);
    testiTimer = setInterval(nextTesti, 3000);
}

document.getElementById('testiNext')?.addEventListener('click', nextTesti);
document.getElementById('testiPrev')?.addEventListener('click', prevTesti);

let testiStartX = null;
testiSlider?.addEventListener('touchstart', e => { 
    testiStartX = e.touches[0].clientX; 
}, { passive: true });

testiSlider?.addEventListener('touchend', e => {
    if (testiStartX === null) return;
    const dx = e.changedTouches[0].clientX - testiStartX;
    if (Math.abs(dx) > 40) {
        dx < 0 ? nextTesti() : prevTesti();
    }
    testiStartX = null;
}, { passive: true });

if (testiCards.length > 0) {
    testiCards[0].classList.add('active'); 
    if (testiCards.length > 1) resetTestiTimer(); 
}
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── Mobile Menu ── */
const menuBtn = document.getElementById('menuBtn');
const navList = document.querySelector('nav ul');

menuBtn?.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    navList.classList.toggle('open');
});

navList?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        menuBtn.classList.remove('open');
        navList.classList.remove('open');
    });
});

/* ── Discord Modal ── */
const discordBtn      = document.getElementById('discordBtn');
const discordModal    = document.getElementById('discordModal');
const discordClose    = document.getElementById('discordModalClose');

function openDiscordModal() {
    discordModal?.classList.add('open');
    discordModal?.setAttribute('aria-hidden', 'false');
}
function closeDiscordModal() {
    discordModal?.classList.remove('open');
    discordModal?.setAttribute('aria-hidden', 'true');
}

discordBtn?.addEventListener('click', openDiscordModal);
discordClose?.addEventListener('click', closeDiscordModal);
discordModal?.addEventListener('click', e => {
    if (e.target === discordModal) closeDiscordModal();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDiscordModal();
});
