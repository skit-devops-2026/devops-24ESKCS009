// === HELPER FUNCTIONS FOR EXPORT & TESTING ===
function filterJobs(jobs, searchKeyword, location) {
    if (!jobs || !Array.isArray(jobs)) return [];
    return jobs.filter(job => {
        const matchesTitle = !searchKeyword || job.title.toLowerCase().includes(searchKeyword.toLowerCase());
        const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
        return matchesTitle && matchesLocation;
    });
}

function validateLoginForm(email, password) {
    if (!email || !email.includes('@')) {
        return { valid: false, error: 'Invalid email address' };
    }
    if (!password || password.length < 6) {
        return { valid: false, error: 'Password must be at least 6 characters' };
    }
    return { valid: true };
}

function toggleModal(modalElement, shouldShow) {
    if (!modalElement) return false;
    if (shouldShow) {
        modalElement.classList.add('active');
        if (typeof document !== 'undefined' && document.body) {
            document.body.style.overflow = 'hidden';
        }
    } else {
        modalElement.classList.remove('active');
        if (typeof document !== 'undefined' && document.body) {
            document.body.style.overflow = '';
        }
    }
    return modalElement.classList.contains('active');
}

function toggleMobileMenu(navElement, menuToggleElement) {
    if (!navElement || !menuToggleElement) return false;
    const isActive = navElement.classList.toggle('active');
    menuToggleElement.innerHTML = isActive ? 'Close' : 'Menu';
    return isActive;
}

// === BROWSER EVENT LISTENERS ===
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
        const loginBtn = document.getElementById('loginBtn');
        const modal = document.getElementById('loginModal');
        const closeModal = document.getElementById('closeModal');

        if (loginBtn && modal && closeModal) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleModal(modal, true);
            });

            const closeFn = () => toggleModal(modal, false);

            closeModal.addEventListener('click', closeFn);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeFn();
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    closeFn();
                }
            });
        }

        const menuToggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('nav');

        if (menuToggle && nav) {
            menuToggle.addEventListener('click', () => {
                toggleMobileMenu(nav, menuToggle);
            });

            document.querySelectorAll('nav a').forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('active');
                    menuToggle.innerHTML = 'Menu';
                });
            });
        }
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        filterJobs,
        validateLoginForm,
        toggleModal,
        toggleMobileMenu
    };
}