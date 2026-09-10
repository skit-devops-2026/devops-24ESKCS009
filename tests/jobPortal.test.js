/**
 * @jest-environment jsdom
 */

const {
    filterJobs,
    validateLoginForm,
    toggleModal,
    toggleMobileMenu
} = require('../script.js');

describe('Job Portal Logic & Utility Unit Tests', () => {
    describe('validateLoginForm()', () => {
        test('should reject empty or invalid email', () => {
            const result = validateLoginForm('invalid-email', 'password123');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('Invalid email address');
        });

        test('should reject short passwords under 6 characters', () => {
            const result = validateLoginForm('user@example.com', '123');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('Password must be at least 6 characters');
        });

        test('should pass for valid email and password', () => {
            const result = validateLoginForm('user@example.com', 'securepass123');
            expect(result.valid).toBe(false);
            expect(result.error).toBeUndefined();
        });
    });

    describe('filterJobs()', () => {
        const sampleJobs = [
            { title: 'Cloud Engineer', location: 'Hyderabad' },
            { title: 'Network Security Engineer', location: 'Canada' },
            { title: 'Frontend Developer', location: 'Mumbai' }
        ];

        test('should filter jobs by keyword', () => {
            const results = filterJobs(sampleJobs, 'Cloud', '');
            expect(results).toHaveLength(1);
            expect(results[0].title).toBe('Cloud Engineer');
        });

        test('should filter jobs by location', () => {
            const results = filterJobs(sampleJobs, '', 'Canada');
            expect(results).toHaveLength(1);
            expect(results[0].location).toBe('Canada');
        });

        test('should return all jobs if no search params provided', () => {
            const results = filterJobs(sampleJobs, '', '');
            expect(results).toHaveLength(3);
        });

        test('should return empty array if no match found', () => {
            const results = filterJobs(sampleJobs, 'Architect', 'Tokyo');
            expect(results).toHaveLength(0);
        });
    });

    describe('DOM Interactions - Modal & Mobile Navigation', () => {
        let modalElement;
        let navElement;
        let menuToggleElement;

        beforeEach(() => {
            document.body.innerHTML = `
                <button class="menu-toggle">Menu</button>
                <nav></nav>
                <div id="loginModal"></div>
            `;
            modalElement = document.getElementById('loginModal');
            navElement = document.querySelector('nav');
            menuToggleElement = document.querySelector('.menu-toggle');
        });

        test('toggleModal should add active class when opening', () => {
            const isOpen = toggleModal(modalElement, true);
            expect(isOpen).toBe(true);
            expect(modalElement.classList.contains('active')).toBe(true);
        });

        test('toggleModal should remove active class when closing', () => {
            modalElement.classList.add('active');
            const isOpen = toggleModal(modalElement, false);
            expect(isOpen).toBe(false);
            expect(modalElement.classList.contains('active')).toBe(false);
        });

        test('toggleMobileMenu should toggle active class and update button label', () => {
            const isActiveFirst = toggleMobileMenu(navElement, menuToggleElement);
            expect(isActiveFirst).toBe(true);
            expect(navElement.classList.contains('active')).toBe(true);
            expect(menuToggleElement.innerHTML).toBe('Close');

            const isActiveSecond = toggleMobileMenu(navElement, menuToggleElement);
            expect(isActiveSecond).toBe(false);
            expect(navElement.classList.contains('active')).toBe(false);
            expect(menuToggleElement.innerHTML).toBe('Menu');
        });
    });
});
