import { init as initStorage, getData } from './services/storage.js';
import { initLoader, showLoader, hideLoader } from './services/loading.js';

const loadSharedComponents = async () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');

    // Use absolute paths from the server root.
    // This works with local servers like VS Code's Live Server and GitHub Pages.
    const headerPath = '/pages/_header.html';
    const sidebarPath = '/pages/_sidebar.html';

    try {
        const [headerRes, sidebarRes] = await Promise.all([
            fetch(headerPath),
            fetch(sidebarPath)
        ]);

        if (!headerRes.ok || !sidebarRes.ok) {
            throw new Error('Could not load shared components');
        }

        const headerHTML = await headerRes.text();
        const sidebarHTML = await sidebarRes.text();

        if (headerPlaceholder) headerPlaceholder.innerHTML = headerHTML;
        if (sidebarPlaceholder) sidebarPlaceholder.innerHTML = sidebarHTML;

    } catch (error) {
        console.error("Error loading shared components:", error);
        // Fallback or error message can be shown here
    }
};

const initializeApp = async () => {
    // Load shared header and sidebar first
    await loadSharedComponents();

    // Create loader HTML and CSS
    initLoader();

    // Initialize storage to ensure data is ready
    // This now fetches data from the server, so we wait for it.
    showLoader('Đang tải dữ liệu...');
    try {
        await initStorage();
        console.log("Storage initialized.");
        // DEBUG: In dữ liệu ra để kiểm tra xem nó có được tìm nạp chính xác không.
        console.log("Data in cache:", getData());
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

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();

        // Special handling for index.html as the dashboard
        const isDashboardLink = linkPath === 'index.html';
        const isCurrentPageDashboard = currentPath === '' || currentPath === 'index.html';

        if (linkPath === currentPath || (isDashboardLink && isCurrentPageDashboard)) {
            link.classList.add('active');
        }
    });

    // Dispatch a custom event to let page-specific scripts know that data is ready.
    document.dispatchEvent(new CustomEvent('app-ready'));
    console.log("App initialized.");
};

document.addEventListener('DOMContentLoaded', initializeApp);