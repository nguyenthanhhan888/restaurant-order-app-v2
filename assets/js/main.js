import { init as initStorage, getData } from './services/storage.js';
import { initLoader, showLoader, hideLoader } from './services/loading.js';

const loadSharedComponents = async () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');

    // --- Path Calculation ---
    const path = window.location.pathname;
    const isRoot = path.endsWith('/') || path.endsWith('/index.html');
    const componentBasePath = isRoot ? './pages' : '.';

    // Determine the root path for navigation links.
    // On GitHub Pages, the path is /repo-name/, so we need to prepend this.
    // On a custom domain or local server, the root is just "".
    const getRootNavPath = () => {
        const hostname = window.location.hostname;
        if (hostname.includes('github.io')) {
            // Pathname is /repo-name/ or /repo-name/pages/file.html
            // The first segment is the repo name.
            return `/${path.split('/')[1]}`;
        }
        return ''; // Root for local server or custom domain
    };
    const rootNavPath = getRootNavPath();

    try {
        const [headerRes, sidebarRes] = await Promise.all([
            fetch(`${componentBasePath}/shared-header.html`),
            fetch(`${componentBasePath}/shared-sidebar.html`)
        ]);

        if (!headerRes.ok || !sidebarRes.ok) {
            throw new Error('Could not load shared components');
        }

        let headerHTML = await headerRes.text();
        let sidebarHTML = await sidebarRes.text();

        // Replace placeholder with the correct root path
        headerHTML = headerHTML.replace(/{{ROOT}}/g, rootNavPath);
        sidebarHTML = sidebarHTML.replace(/{{ROOT}}/g, rootNavPath);

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