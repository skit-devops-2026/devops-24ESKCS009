// script.js - Full Functionality

document.addEventListener('DOMContentLoaded', () => {
    // Login Modal
    const loginBtn = document.getElementById('loginBtn');
    const modal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');

    loginBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    const closeFn = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeModal?.addEventListener('click', closeFn);
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeFn();
    });

    // Mobile Menu
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');

    menuToggle?.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.innerHTML = nav.classList.contains('active') ? 'Close' : 'Menu';
    });

    // Filters Button (Mobile)
    const filtersBtn = document.getElementById('filtersBtn');
    const sidebar = document.getElementById('sidebar');

    filtersBtn?.addEventListener('click', () => {
        sidebar.style.display = sidebar.style.display === 'block' ? 'none' : 'block';
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav a, .nav button').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuToggle.innerHTML = 'Menu';
        });
    });
});