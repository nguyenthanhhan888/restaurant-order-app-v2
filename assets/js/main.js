import { init as initStorage } from './services/storage.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize storage to ensure data is ready
    initStorage();

    // --- Navigation Logic ---
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    const toggleSidebar = () => {
        sidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('open');
    };

    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', toggleSidebar);
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }

    // --- Active Link Highlighter ---
    const currentPath = window.location.pathname.split('/').pop();
    const targetPath = currentPath === '' || currentPath === 'index.html' ? 'order.html' : currentPath;

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        // Highlight "Lịch Sử" for both summary and history views
        if (linkPath === targetPath || (targetPath === 'summary.html' && linkPath === 'summary.html')) {
            link.classList.add('active');
        }
    });

    console.log("App initialized.");
});