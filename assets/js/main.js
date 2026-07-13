import { init as initStorage, getData } from './services/storage.js';
import { initLoader, showLoader, hideLoader } from './services/loading.js';

const getBasePath = () => {
    const path = window.location.pathname;
    // For GitHub Pages, path is /<repo-name>/...
    if (window.location.hostname.includes('github.io')) {
        const segments = path.split('/');
        // Ensure there's a repo name and it's not an empty string
        if (segments.length > 1 && segments[1] !== "") {
            return `/${segments[1]}`;
        }
    }
    // For local dev (like Live Server), base path is empty
    return '';
};

const loadSharedComponents = async () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');

    const basePath = getBasePath();
    const headerPath = `${basePath}/pages/shared_header.html`;
    const sidebarPath = `${basePath}/pages/shared_sidebar.html`;

    try {
        const [headerRes, sidebarRes] = await Promise.all([
            fetch(headerPath),
            fetch(sidebarPath)
        ]);

        if (!headerRes.ok || !sidebarRes.ok) {
            throw new Error(`Could not load shared components. Statuses: Header(${headerRes.status}), Sidebar(${sidebarRes.status})`);
        }

        const headerHTML = await headerRes.text();
        const sidebarHTML = await sidebarRes.text();

        if (headerPlaceholder) headerPlaceholder.innerHTML = headerHTML;
        if (sidebarPlaceholder) sidebarPlaceholder.innerHTML = sidebarHTML;

        // After inserting HTML, fix the href attributes for GitHub Pages compatibility
        if (basePath) {
            const links = document.querySelectorAll('a[href^="/"]');
            links.forEach(link => {
                const originalHref = link.getAttribute('href');
                // Prevent double-prepending if logic runs multiple times
                if (!originalHref.startsWith(basePath)) {
                    link.setAttribute('href', basePath + originalHref);
                }
            });
        }

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
        // Use getAttribute to get the raw href, which might now include the base path
        const linkHref = link.getAttribute('href');
        const linkPath = linkHref.split('/').pop();

        // Special handling for index.html as the dashboard
        const isDashboardLink = linkPath === 'index.html';
        const isCurrentPageDashboard = currentPath === '' || currentPath === 'index.html';

        // Compare the end of the href with the current page's file name
        if (linkHref.endsWith(currentPath) || (isDashboardLink && isCurrentPageDashboard)) {
            link.classList.add('active');
        }
    });

    // Dispatch a custom event to let page-specific scripts know that data is ready.
    document.dispatchEvent(new CustomEvent('app-ready'));
    console.log("App initialized.");
};

const handleAccessControl = () => {
    // Bạn có thể thay đổi mật khẩu ở đây
    const CORRECT_PASSWORD = 'lequangdai888@'; 
    const enteredPassword = prompt('Vui lòng nhập mật khẩu để truy cập:');

    if (enteredPassword === CORRECT_PASSWORD) {
        // Mật khẩu đúng, tiến hành khởi tạo ứng dụng
        initializeApp();
    } else if (enteredPassword !== null) { // Người dùng đã nhập sai, không phải bấm "Cancel"
        alert('Mật khẩu không đúng!');
        document.body.innerHTML = `<h1 style="text-align: center; margin-top: 50px; color: #c0392b;">Truy cập bị từ chối</h1>`;
    } else {
        // Người dùng đã bấm "Cancel" hoặc đóng hộp thoại
        document.body.innerHTML = `<h1 style="text-align: center; margin-top: 50px;">Đã hủy truy cập</h1>`;
    }
};

// Bắt đầu bằng việc kiểm tra mật khẩu thay vì khởi tạo trực tiếp
document.addEventListener('DOMContentLoaded', handleAccessControl);