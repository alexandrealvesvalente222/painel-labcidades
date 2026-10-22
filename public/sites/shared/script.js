// Menu mobile
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        nav.classList.toggle('nav-open');
        document.body.classList.toggle('menu-open', !isExpanded);
    });

    // Fechar menu ao clicar em link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.setAttribute('aria-expanded', 'false');
            nav.classList.remove('nav-open');
            document.body.classList.remove('menu-open');
        });
    });
}

// Smooth scroll para links âncora (com offset para o header fixo)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 90;
            const offset = 20;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - offset;
            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
            });
        }
    });
});

// Modal do membro da equipe
const teamMembers = document.querySelectorAll('.team-member');
const modal = document.getElementById('team-member-modal');
const modalPhoto = document.getElementById('modal-member-photo');
const modalName = document.getElementById('modal-member-name');
const modalRole = document.getElementById('modal-member-role');
const modalBio = document.getElementById('modal-member-bio');
const modalBackBtn = document.getElementById('modal-back-btn');

function openMemberModal(member) {
    const name = member.dataset.name;
    const role = member.dataset.role;
    const bio = member.dataset.bio;
    const photo = member.dataset.photo;

    modalPhoto.src = photo;
    modalPhoto.alt = name;
    modalName.textContent = name;
    modalRole.textContent = role;
    modalBio.textContent = bio;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    modal.scrollTop = 0;
    document.body.style.overflow = 'hidden';
}

function closeMemberModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

if (teamMembers.length && modal) {
    teamMembers.forEach(member => {
        const photoEl = member.querySelector('.team-member-photo');
        if (photoEl) {
            photoEl.addEventListener('click', () => openMemberModal(member));
            photoEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openMemberModal(member);
                }
            });
        }
    });
}

if (modalBackBtn) {
    modalBackBtn.addEventListener('click', closeMemberModal);
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeMemberModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeMemberModal();
        }
    });
}

// Scroll Reveal - animação ao entrar na viewport
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    const viewportHeight = window.innerHeight;
    const triggerPoint = viewportHeight * 0.85;

    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < triggerPoint) {
            el.classList.add('revealed');
        }
    });
};

revealOnScroll();
window.addEventListener('scroll', revealOnScroll);

// Efeito de scroll no header e barra de progresso
let lastScroll = 0;
const header = document.querySelector('.header');
const scrollProgress = document.getElementById('scroll-progress');

function updateScrollEffects() {
    const currentScroll = window.pageYOffset;
    
    // Header shadow
    if (header) {
        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 12px rgba(16, 0, 19, 0.1)';
        } else {
            header.style.boxShadow = '0 1px 3px rgba(16, 0, 19, 0.08)';
        }
    }
    
    // Barra de progresso do scroll
    if (scrollProgress) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (currentScroll / docHeight) * 100 : 0;
        scrollProgress.style.width = scrollPercent + '%';
    }
    
    lastScroll = currentScroll;
}

window.addEventListener('scroll', updateScrollEffects);
updateScrollEffects();
