import { getData, saveData } from '../services/storage.js';

const PENDING_ORDER_KEY = 'pendingOrder';
const COMPLETED_ORDER_ID_KEY = 'completedOrderId';

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const previewContainer = document.getElementById('order-preview-container');
    const historyContainer = document.getElementById('order-history-container');
    const historyTableBody = document.getElementById('history-table-body');
    const detailModal = document.getElementById('order-detail-modal');
    const finalOrderSlipContainer = document.getElementById('final-order-slip-container');
    const closeDetailModalBtn = detailModal.querySelector('.close-button');

    // --- Routing ---
    const pendingOrderJSON = sessionStorage.getItem(PENDING_ORDER_KEY);
    const completedOrderId = sessionStorage.getItem(COMPLETED_ORDER_ID_KEY);

    if (pendingOrderJSON) {
        // Preview Mode
        showPreviewView();
        renderPreview(JSON.parse(pendingOrderJSON));
    } else if (completedOrderId) {
        // Final Order Slip Mode
        showFinalSlipView();
        renderFinalOrderSlip(completedOrderId);
    } else {
        // History Mode
        showHistoryView();
        renderHistory();
    }

    // --- Event Listeners ---
    closeDetailModalBtn.addEventListener('click', () => detailModal.style.display = 'none');
    window.addEventListener('click', (event) => {
        if (event.target === detailModal) {
            detailModal.style.display = 'none';
        }
    });
    historyTableBody.addEventListener('click', handleHistoryTableClick);

    // --- Assign button events ONCE ---
    // Preview Actions
    document.getElementById('back-to-edit-btn').addEventListener('click', () => {
        window.location.href = './order.html';
    });

    document.getElementById('complete-order-btn').addEventListener('click', function() {
        this.disabled = true; // Prevent double-click
        const pendingOrder = JSON.parse(sessionStorage.getItem(PENDING_ORDER_KEY));
        if (!pendingOrder) return;

        const data = getData();
        data.orders.push(pendingOrder);
        data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        saveData(data);

        sessionStorage.removeItem(PENDING_ORDER_KEY);
        sessionStorage.setItem(COMPLETED_ORDER_ID_KEY, pendingOrder.id);
        window.location.reload();
    });

    // Final Slip Actions
    document.getElementById('final-done-btn').addEventListener('click', () => {
        sessionStorage.removeItem(COMPLETED_ORDER_ID_KEY);
        sessionStorage.removeItem(PENDING_ORDER_KEY); // Ensure pending order is also cleared
        window.location.href = './order.html';
    });
});

function showHistoryView() {
    document.getElementById('order-preview-container').classList.add('hidden');
    document.getElementById('final-order-slip-container').classList.add('hidden');
    document.getElementById('order-history-container').classList.remove('hidden');
}

function showPreviewView() {
    document.getElementById('order-history-container').classList.add('hidden');
    document.getElementById('final-order-slip-container').classList.add('hidden');
    document.getElementById('order-preview-container').classList.remove('hidden');
}

function showFinalSlipView() {
    document.getElementById('order-history-container').classList.add('hidden');
    document.getElementById('order-preview-container').classList.add('hidden');
    document.getElementById('final-order-slip-container').classList.remove('hidden');
}

function renderPreview(pendingOrder) {
    const { suppliers, groups } = getData();
    const supplier = suppliers.find(s => s.id === pendingOrder.supplierId);
    if (!supplier) {
        console.error("Supplier not found for pending order");
        return;
    }

    // Header
    document.getElementById('preview-supplier-name').textContent = supplier.name;
    const orderDate = new Date(pendingOrder.createdAt);
    document.getElementById('preview-date').textContent = `Ngày: ${orderDate.toLocaleDateString('vi-VN')}`;
    document.getElementById('preview-time').textContent = `Giờ: ${orderDate.toLocaleTimeString('vi-VN')}`;

    // Items
    const itemsContainer = document.getElementById('preview-items-list');
    renderItemsList(itemsContainer, pendingOrder, supplier, groups);
}

function renderHistory() {
    const { orders, suppliers } = getData();
    const historyTableBody = document.getElementById('history-table-body');
    historyTableBody.innerHTML = '';

    if (orders.length === 0) {
        historyTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Chưa có lịch sử đơn hàng.</td></tr>';
        return;
    }

    orders.forEach((order, index) => {
        const supplier = suppliers.find(s => s.id === order.supplierId);
        const orderDate = new Date(order.createdAt);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${orderDate.toLocaleDateString('vi-VN')}</td>
            <td>${orderDate.toLocaleTimeString('vi-VN')}</td>
            <td>${supplier ? supplier.name : 'Không rõ'}</td>
            <td>${order.items.length}</td>
            <td class="action-buttons">
                <button class="btn btn-secondary btn-sm reorder-btn" data-id="${order.id}">Đặt lại</button>
                <button class="btn btn-secondary btn-sm view-btn" data-id="${order.id}">Xem</button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${order.id}">Xóa</button>
            </td>
        `;
        historyTableBody.appendChild(row);
    });
}

function handleHistoryTableClick(event) {
    const target = event.target;
    const orderId = target.dataset.id;

    if (target.classList.contains('reorder-btn')) {
        const { orders } = getData();
        const orderToReorder = orders.find(o => o.id === orderId);
        if (orderToReorder) {
            sessionStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(orderToReorder));
            window.location.href = './order.html';
        }
        return;
    }

    if (target.classList.contains('view-btn')) {
        const { orders } = getData();
        const order = orders.find(o => o.id === orderId);
        if (order) {
            renderOrderDetailModal(order);
        }
        return;
    }

    if (target.classList.contains('delete-btn')) {
        if (confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
            let data = getData();
            data.orders = data.orders.filter(o => o.id !== orderId);
            saveData(data);
            renderHistory();
        }
        return;
    }
}

function renderOrderDetailModal(order) {
    const { suppliers, groups } = getData();
    const supplier = suppliers.find(s => s.id === order.supplierId);

    const detailModal = document.getElementById('order-detail-modal');
    document.getElementById('detail-supplier-name').textContent = supplier ? supplier.name : 'Không rõ';
    const orderDate = new Date(order.createdAt);
    document.getElementById('detail-date').textContent = `Ngày: ${orderDate.toLocaleDateString('vi-VN')}`;
    document.getElementById('detail-time').textContent = `Giờ: ${orderDate.toLocaleTimeString('vi-VN')}`;

    const itemsContainer = document.getElementById('detail-items-list');
    renderItemsList(itemsContainer, order, supplier, groups);

    detailModal.style.display = 'block';
}

function renderFinalOrderSlip(orderId) {
    const { orders, suppliers, groups } = getData();
    const order = orders.find(o => o.id === orderId);

    if (!order) {
        // If order not found (e.g., page reloaded after a while), just show history
        sessionStorage.removeItem(COMPLETED_ORDER_ID_KEY);
        showHistoryView();
        renderHistory();
        return;
    }

    const supplier = suppliers.find(s => s.id === order.supplierId);
    const slipContainer = document.getElementById('final-order-slip-content');
    const orderDate = new Date(order.createdAt);

    slipContainer.querySelector('h2').textContent = supplier ? supplier.name : 'Không rõ';
    slipContainer.querySelector('.slip-date').textContent = `Ngày: ${orderDate.toLocaleDateString('vi-VN')}`;
    
    const itemsListEl = slipContainer.querySelector('.slip-items-list');
    renderItemsList(itemsListEl, order, supplier, groups);
}

function renderItemsList(containerEl, order, supplier, allGroups) {
    containerEl.innerHTML = '';
    const supplierGroups = supplier ? allGroups.filter(g => g.supplierId === supplier.id) : [];
    const hasGroups = supplierGroups.length > 0;

    if (hasGroups) {
        const itemMap = new Map();
        const allItems = getData().items;
        order.items.forEach(item => {
            const fullItem = allItems.find(i => i.id === item.itemId);
            const groupId = fullItem ? fullItem.groupId : null;
            if (!itemMap.has(groupId)) {
                itemMap.set(groupId, []);
            }
            itemMap.get(groupId).push(item);
        });

        itemMap.forEach((items, groupId) => {
            const group = allGroups.find(g => g.id === groupId);
            const groupName = group ? group.name : 'Chưa phân loại';
            const groupEl = document.createElement('div');
            groupEl.className = 'detail-group';
            groupEl.innerHTML = `<strong>${groupName}</strong>`;
            items.forEach(item => {
                groupEl.innerHTML += createItemHTML(item);
            });
            containerEl.appendChild(groupEl);
        });
    } else {
        order.items.forEach(item => {
            containerEl.innerHTML += createItemHTML(item);
        });
    }
}

function createItemHTML(item) {
    return `
        <div class="preview-item">
            <span class="item-name">${item.name}</span>
            <span><strong>${item.quantity}</strong> ${item.unit}</span>
        </div>
    `;
}
