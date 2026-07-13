import { init as initStorage, getData } from './services/storage.js';
import { initLoader, showLoader, hideLoader } from './services/loading.js';

const loadSharedComponents = async () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');

    // Dynamically determine the base path for shared components.
    // This makes it work whether the page is at the root or in a subdirectory.
    const path = window.location.pathname;
    const isRoot = path.endsWith('/') || path.endsWith('/index.html');
    const basePath = isRoot ? './pages' : '.';

    try {
        const [headerRes, sidebarRes] = await Promise.all([
            fetch(`${basePath}/shared-header.html`),
            fetch(`${basePath}/shared-sidebar.html`)
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

    // --- Path Correction for Navigation ---
    const isRootPage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/index.html');
    if (isRootPage) {
        // If on the root page, adjust the relative paths from the loaded sidebar
        document.querySelectorAll('.app-nav a, .header-title').forEach(link => {
            const originalHref = link.getAttribute('href');
            if (originalHref.startsWith('../')) {
                // Change '../index.html' to './index.html'
                link.setAttribute('href', originalHref.substring(3)); 
            } else {
                // Change 'order.html' to './pages/order.html'
                link.setAttribute('href', `./pages/${originalHref}`);
            }
        });
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