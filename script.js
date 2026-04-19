/* ════════════════════════════════════════
   TYPING EFFECT
════════════════════════════════════════ */
const words = [
    "Process Engineer",
    "Coating Specialist",
    "Failure Analyst",
    "Problem Solver"
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingEl = document.getElementById('typing');

function type() {
    const current = words[wordIndex];

    if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === current.length) {
        speed = 1800;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 400;
    }

    setTimeout(type, speed);
}

/* ════════════════════════════════════════
   SCROLL BEHAVIORS
════════════════════════════════════════ */
const sections     = document.querySelectorAll('section');
const navLinks     = document.querySelectorAll('.navbar a');
const progressBar  = document.getElementById('scrollProgress');
const scrollTopBtn = document.getElementById('scrollTop');
const menuToggle   = document.getElementById('menuToggle');
const navbar       = document.getElementById('navbar');

// FIX 3: passive:true tells the browser this handler never calls
// preventDefault(), allowing it to scroll on a separate thread
// without waiting for JS — eliminates the main source of scroll jank.
window.addEventListener('scroll', () => {
    const scrollY   = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (docHeight > 0) {
        progressBar.style.width = (scrollY / docHeight * 100) + '%';
    }

    let current = '';
    sections.forEach(s => {
        if (scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
    });
    navLinks.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });

    if (navbar.classList.contains('open')) {
        navbar.classList.remove('open');
    }

    scrollTopBtn.classList.toggle('show', scrollY > 400);
}, { passive: true }); // FIX 3

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

sections.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.08 });

sections.forEach(el => revealObserver.observe(el));

menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('open');
});

navbar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('open');
    });
});

/* ════════════════════════════════════════
   EXPERIENCE TAB TOGGLE
════════════════════════════════════════ */
document.querySelectorAll('.etb').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.etb').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tab = btn.dataset.tab;

        document.querySelectorAll('.timeline').forEach(t => {
            t.classList.remove('active');
            t.querySelectorAll('.tl-item').forEach(item => {
                item.style.animation = 'none';
                item.offsetHeight;
                item.style.animation = '';
            });
        });

        document.getElementById('tab-' + tab).classList.add('active');
    });
});

/* ════════════════════════════════════════
   PROJECTS TAB TOGGLE
════════════════════════════════════════ */
document.querySelectorAll('.ptb').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.ptb').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tab = btn.dataset.tab;

        document.querySelectorAll('.projects .card').forEach(card => {
            card.classList.remove('active');
        });

        const target = document.getElementById('card-' + tab);
        if (target) target.classList.add('active');
    });
});

/* ════════════════════════════════════════
   WORK MOMENTS SLIDER
════════════════════════════════════════ */
const track         = document.getElementById('wmTrack');
const prevBtn       = document.getElementById('wmPrev');
const nextBtn       = document.getElementById('wmNext');
const dotsContainer = document.getElementById('wmDots');

const wmCards       = document.querySelectorAll('.wm-card');
let wmIndex         = 0;

function getVisibleCards() {
    return window.innerWidth <= 768 ? 1 : 3;
}

let visibleCards = getVisibleCards();
let totalSlides  = Math.ceil(wmCards.length / visibleCards);

function buildDots() {
    dotsContainer.innerHTML = '';
    visibleCards = getVisibleCards();
    totalSlides  = Math.ceil(wmCards.length / visibleCards);

    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('wm-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            wmIndex = i;
            updateSlider();
        });
        dotsContainer.appendChild(dot);
    }
}

function updateSlider() {
    track.style.transform = `translateX(-${wmIndex * 100}%)`;
    document.querySelectorAll('.wm-dot').forEach((d, i) => {
        d.classList.toggle('active', i === wmIndex);
    });
}

nextBtn.addEventListener('click', () => {
    wmIndex = wmIndex < totalSlides - 1 ? wmIndex + 1 : 0;
    updateSlider();
});

prevBtn.addEventListener('click', () => {
    wmIndex = wmIndex > 0 ? wmIndex - 1 : totalSlides - 1;
    updateSlider();
});

window.addEventListener('resize', () => {
    wmIndex = 0;
    buildDots();
    updateSlider();
});

/* ════════════════════════════════════════
   BODY SCROLL LOCK
   FIX 2: Use position:fixed + top:-scrollY
   pattern instead of overflow:hidden alone.
   overflow:hidden doesn't prevent scrolling
   when page content has already scrolled —
   this approach physically removes the page
   from flow so it cannot scroll at all,
   then restores exact scroll position on unlock.
════════════════════════════════════════ */
let scrollLockCount = 0;
let savedScrollY = 0;

function lockBodyScroll() {
    if (scrollLockCount === 0) {
        savedScrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${savedScrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
    }
    scrollLockCount++;
}

function unlockBodyScroll() {
    scrollLockCount = Math.max(0, scrollLockCount - 1);
    if (scrollLockCount === 0) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        // Restore exact scroll position — instant so there's no visible jump
        window.scrollTo({ top: savedScrollY, behavior: 'instant' });
    }
}

/* ════════════════════════════════════════
   PROJECT MODAL
════════════════════════════════════════ */
const modalOverlay       = document.getElementById('projectModal');
const modalBox           = modalOverlay.querySelector('.modal-box');
const modalClose         = document.getElementById('modalClose');
const modalImpactSection = document.getElementById('modalImpactSection');
const modalLinkSection   = document.getElementById('modalLinkSection');
const modalLinkBtn       = document.getElementById('modalLink');

function getActiveTab() {
    const apPageLab = document.getElementById('apPageLab');
    if (apPageLab && apPageLab.classList.contains('open')) {
        return 'lab';
    }
    const apPage = document.getElementById('apPage');
    if (apPage && apPage.classList.contains('open')) {
        return 'work';
    }
    const activeBtn = document.querySelector('.ptb.active');
    return activeBtn ? activeBtn.dataset.tab : 'work';
}

function openModal(card) {
    const title  = card.dataset.title  || '';
    const cat    = card.dataset.cat    || '';
    const desc   = card.dataset.desc   || '';
    const how    = card.dataset.how    || '';
    const impact = card.dataset.impact || '';
    const link   = card.dataset.link   || '';
    const tags   = (card.dataset.tags  || '').split(',').filter(Boolean);

    document.getElementById('modalTitle').textContent  = title;
    document.getElementById('modalCat').textContent    = cat;
    document.getElementById('modalDesc').textContent   = desc;
    document.getElementById('modalHow').textContent    = how;
    document.getElementById('modalImpact').textContent = impact;

    const tab = getActiveTab();

    if (tab === 'ongoing') {
        modalImpactSection.style.display = 'none';
        modalLinkSection.style.display   = 'block';
        modalLinkBtn.href = link || '#';
    } else {
        modalImpactSection.style.display = 'block';
        modalLinkSection.style.display   = 'none';
    }

    const tagsContainer = document.getElementById('modalTags');
    tagsContainer.innerHTML = '';
    tags.forEach(tag => {
        const span = document.createElement('span');
        span.textContent = tag.trim();
        tagsContainer.appendChild(span);
    });

    modalBox.classList.remove('lab-modal', 'ongoing-modal');
    if (tab === 'lab')     modalBox.classList.add('lab-modal');
    if (tab === 'ongoing') modalBox.classList.add('ongoing-modal');

    modalOverlay.classList.add('open');
    lockBodyScroll();
}

function closeModal() {
    modalOverlay.classList.remove('open');
    unlockBodyScroll();
}

document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('click', () => openModal(card));
});

modalClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

/* ════════════════════════════════════════
   ALL WORK PROJECTS PAGE
   FIX 1: apScrollTop button is now outside
   the ap-page div in HTML, so it is NOT
   affected by ap-page's stacking context.
════════════════════════════════════════ */
const apPage         = document.getElementById('apPage');
const btnViewAllWork = document.getElementById('btnViewAllWork');
const apBackTop      = document.getElementById('apBackTop');
const apBackBot      = document.getElementById('apBackBottom');
const apScrollTopBtn = document.getElementById('apScrollTop');

apPage.style.display = 'none';

function openApPage() {
    apPage.style.display = 'block';
    apPage.scrollTop = 0;
    // Show the scroll-to-top button for this page
    apScrollTopBtn.style.display = 'flex';
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            apPage.classList.add('open');
        });
    });
    lockBodyScroll();
}

function closeApPage() {
    apPage.classList.remove('open');
    apScrollTopBtn.style.display = 'none';
    apScrollTopBtn.classList.remove('show');
    unlockBodyScroll();

    setTimeout(() => {
        apPage.style.display = 'none';
    }, 400);

    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });

    document.querySelectorAll('.ptb').forEach(b => b.classList.remove('active'));
    const workBtn = document.querySelector('.ptb[data-tab="work"]');
    if (workBtn) workBtn.classList.add('active');

    document.querySelectorAll('.projects .card').forEach(card => card.classList.remove('active'));
    const workCard = document.getElementById('card-work');
    if (workCard) workCard.classList.add('active');
}

if (btnViewAllWork) {
    btnViewAllWork.addEventListener('click', (e) => {
        e.preventDefault();
        openApPage();
    });
}

if (apBackTop) apBackTop.addEventListener('click', closeApPage);
if (apBackBot) apBackBot.addEventListener('click', closeApPage);

// FIX 1 + FIX 3: scroll listener on ap-page itself, passive for performance
if (apScrollTopBtn) {
    apPage.addEventListener('scroll', () => {
        apScrollTopBtn.classList.toggle('show', apPage.scrollTop > 300);
    }, { passive: true }); // FIX 3

    apScrollTopBtn.addEventListener('click', () => {
        apPage.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

document.querySelectorAll('.ap-card:not(.ap-card-lab)').forEach(card => {
    card.addEventListener('click', () => openModal(card));
});

/* ════════════════════════════════════════
   ALL LAB PROJECTS PAGE
   FIX 1: apLabScrollTop button is now outside
   the ap-page div in HTML, so it is NOT
   affected by ap-page's stacking context.
════════════════════════════════════════ */
const apPageLab         = document.getElementById('apPageLab');
const btnViewAllLab     = document.getElementById('btnViewAllLab');
const apBackLabTop      = document.getElementById('apBackLabTop');
const apBackLabBot      = document.getElementById('apBackLabBottom');
const apLabScrollTopBtn = document.getElementById('apLabScrollTop');

apPageLab.style.display = 'none';

function openApPageLab() {
    apPageLab.style.display = 'block';
    apPageLab.scrollTop = 0;
    // Show the scroll-to-top button for this page
    apLabScrollTopBtn.style.display = 'flex';
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            apPageLab.classList.add('open');
        });
    });
    lockBodyScroll();
}

function closeApPageLab() {
    apPageLab.classList.remove('open');
    apLabScrollTopBtn.style.display = 'none';
    apLabScrollTopBtn.classList.remove('show');
    unlockBodyScroll();

    setTimeout(() => {
        apPageLab.style.display = 'none';
    }, 400);

    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });

    document.querySelectorAll('.ptb').forEach(b => b.classList.remove('active'));
    const labBtn = document.querySelector('.ptb[data-tab="lab"]');
    if (labBtn) labBtn.classList.add('active');

    document.querySelectorAll('.projects .card').forEach(card => card.classList.remove('active'));
    const labCard = document.getElementById('card-lab');
    if (labCard) labCard.classList.add('active');
}

if (btnViewAllLab) {
    btnViewAllLab.addEventListener('click', (e) => {
        e.preventDefault();
        openApPageLab();
    });
}

if (apBackLabTop) apBackLabTop.addEventListener('click', closeApPageLab);
if (apBackLabBot) apBackLabBot.addEventListener('click', closeApPageLab);

// FIX 1 + FIX 3: scroll listener on ap-page-lab itself, passive for performance
if (apLabScrollTopBtn) {
    apPageLab.addEventListener('scroll', () => {
        apLabScrollTopBtn.classList.toggle('show', apPageLab.scrollTop > 300);
    }, { passive: true }); // FIX 3

    apLabScrollTopBtn.addEventListener('click', () => {
        apPageLab.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

document.querySelectorAll('.ap-card-lab').forEach(card => {
    card.addEventListener('click', () => openModal(card));
});

/* ════════════════════════════════════════
   ESCAPE KEY — tutup semua overlay
════════════════════════════════════════ */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (certPopupOverlay.classList.contains('open')) {
            closeCertPopup();
        } else if (modalOverlay.classList.contains('open')) {
            closeModal();
        } else if (apPageLab.classList.contains('open')) {
            closeApPageLab();
        } else if (apPage.classList.contains('open')) {
            closeApPage();
        }
    }
});

/* ════════════════════════════════════════
   CERTIFICATE POPUP
════════════════════════════════════════ */
const certPopupOverlay   = document.getElementById('certPopup');
const certPopupClose     = document.getElementById('certPopupClose');
const certPopupImg       = document.getElementById('certPopupImg');
const certPopupName      = document.getElementById('certPopupName');
const certImgPlaceholder = document.getElementById('certImgPlaceholder');
const certImgPath        = document.getElementById('certImgPath');

function openCertPopup(name, imgSrc) {
    certPopupName.textContent = name;

    certPopupImg.onload = () => {
        certPopupImg.classList.remove('hidden');
        certImgPlaceholder.classList.add('hidden');
    };

    certPopupImg.onerror = () => {
        certPopupImg.classList.add('hidden');
        certImgPlaceholder.classList.remove('hidden');
        certImgPath.textContent = imgSrc;
    };

    certPopupImg.classList.add('hidden');
    certImgPlaceholder.classList.remove('hidden');
    certImgPath.textContent = imgSrc;

    certPopupImg.src = imgSrc;

    certPopupOverlay.classList.add('open');
    lockBodyScroll();
}

function closeCertPopup() {
    certPopupOverlay.classList.remove('open');
    unlockBodyScroll();
}

document.querySelectorAll('.cert-clickable').forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.dataset.certImg || '';
        const name   = item.dataset.certName || 'Certificate';
        openCertPopup(name, imgSrc);
    });
});

certPopupClose.addEventListener('click', closeCertPopup);

certPopupOverlay.addEventListener('click', (e) => {
    if (e.target === certPopupOverlay) closeCertPopup();
});

/* ════════════════════════════════════════
   CONTACT FORM
════════════════════════════════════════ */
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('.btn-send');
    btn.textContent = '✓ Sent!';
    btn.style.background = '#22c55e';
    setTimeout(() => {
        btn.innerHTML = "<i class='bx bx-send'></i> Send Message";
        btn.style.background = '';
        this.reset();
    }, 2500);
});

/* ════════════════════════════════════════
   INIT
════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    type();
    buildDots();
});
