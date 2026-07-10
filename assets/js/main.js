import { init as initStorage } from './services/storage.js';
import { initLoader, showLoader, hideLoader } from './services/loading.js';

const initializeApp = async () => {
    // Create loader HTML and CSS
    initLoader();

    // Initialize storage to ensure data is ready
    // This now fetches data from the server, so we wait for it.
    showLoader('Đang tải dữ liệu...');
    try {
        await initStorage();
        console.log("Storage initialized.");
    } finally {
        hideLoader();
    }
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

    // Dispatch a custom event to let page-specific scripts know that data is ready.
    document.dispatchEvent(new CustomEvent('app-ready'));
    console.log("App initialized.");
};

document.addEventListener('DOMContentLoaded', initializeApp);