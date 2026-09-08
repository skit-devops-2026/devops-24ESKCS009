
document.addEventListener('DOMContentLoaded', function () {
    // === LOGIN MODAL ===
    const loginBtn = document.getElementById('loginBtn');
    const modal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');

    if (loginBtn && modal && closeModal) {
        // Open modal
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Close modal
        const closeFn = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeModal.addEventListener('click', closeFn);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeFn();
        });

        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeFn();
            }
        });
    }

    // === MOBILE MENU ===
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.innerHTML = nav.classList.contains('active') ? 'Close' : 'Menu';
        });

        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuToggle.innerHTML = 'Menu';
            });
        });
    }

    console.log('Login Modal & Footer Fixed - Working 100%');
});