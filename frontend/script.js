// === HELPER FUNCTIONS FOR EXPORT & TESTING ===
function isValidJobTitle(title) {
    return typeof title === 'string' && title.trim().length > 0;
}

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

// === API BACKEND INTEGRATION ===
const API_BASE_URL = typeof window !== 'undefined' && window.location.origin.includes('localhost:5000') 
    ? 'http://localhost:5000/api'
    : '/api';

async function fetchJobsFromAPI(keyword = '', location = '', category = '') {
    try {
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (location) params.append('location', location);
        if (category) params.append('category', category);

        const response = await fetch(`${API_BASE_URL}/jobs?${params.toString()}`);
        if (!response.ok) throw new Error('API server response error');
        return await response.json();
    } catch (err) {
        console.warn('Backend API unavailable or offline, using fallback job list.', err.message);
        return null;
    }
}

async function loginUserAPI(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        return { ok: response.ok, data };
    } catch (err) {
        return { ok: false, data: { error: 'Network error connecting to backend API' } };
    }
}

// === BROWSER EVENT LISTENERS ===
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
        const loginBtn = document.getElementById('loginBtn');
        const modal = document.getElementById('loginModal');
        const closeModal = document.getElementById('closeModal');
        const loginForm = document.getElementById('loginForm');
        const loginFeedback = document.getElementById('loginFeedback');

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

        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('email')?.value || '';
                const password = document.getElementById('password')?.value || '';
                
                const validation = validateLoginForm(email, password);
                if (!validation.valid) {
                    if (loginFeedback) loginFeedback.innerText = validation.error;
                    return;
                }

                if (loginFeedback) loginFeedback.innerText = 'Authenticating...';
                const result = await loginUserAPI(email, password);
                if (result.ok) {
                    if (loginFeedback) {
                        loginFeedback.style.color = 'green';
                        loginFeedback.innerText = 'Login successful!';
                    }
                    if (result.data.token) {
                        localStorage.setItem('hirehub_token', result.data.token);
                    }
                    setTimeout(() => toggleModal(modal, false), 1000);
                } else {
                    if (loginFeedback) {
                        loginFeedback.style.color = 'red';
                        loginFeedback.innerText = result.data.error || 'Login failed.';
                    }
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
        isValidJobTitle,
        filterJobs,
        validateLoginForm,
        toggleModal,
        toggleMobileMenu,
        API_BASE_URL
    };
}
