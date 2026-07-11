import { getData, saveData } from '../services/storage.js';
import { generateId } from '../utils/helpers.js';

const PENDING_ORDER_KEY = 'pendingOrder';

const runPage = () => {
    const supplierSelect = document.getElementById('supplier-select');
    const orderForm = document.getElementById('order-form');
    const orderItemsContainer = document.getElementById('order-items-container');
    const orderNotification = document.getElementById('order-notification');

    const populateSuppliers = () => {
        const { suppliers } = getData();
        supplierSelect.innerHTML = '<option value="">-- Chọn nhà cung cấp --</option>';
        suppliers.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier.id;
            option.textContent = supplier.name;
            supplierSelect.appendChild(option);
        });
    };

    const renderItems = (supplierId, pendingItems = []) => {
        const { items, groups } = getData();
        const supplierItems = items.filter(item => item.supplier_id === supplierId);
        const supplierGroups = groups.filter(group => group.supplier_id === supplierId);
        orderItemsContainer.innerHTML = '';
        orderNotification.classList.add('hidden');

        if (supplierItems.length === 0) {
            orderItemsContainer.innerHTML = '<p>Nhà cung cấp này chưa có mặt hàng nào.</p>';
            return;
        }

        if (supplierGroups.length > 0) {
            // Grouped view
            supplierGroups.forEach(group => {
                const groupItems = supplierItems.filter(item => item.group_id === group.id);
                const pendingGroupItems = pendingItems.filter(pi => groupItems.some(gi => gi.id === pi.itemId));
                if (groupItems.length > 0) {
                    orderItemsContainer.innerHTML += createGroupedHTML(group, groupItems, pendingGroupItems);
                }
            });
            const ungroupedItems = supplierItems.filter(item => !item.group_id);
            const pendingUngroupedItems = pendingItems.filter(pi => ungroupedItems.some(ui => ui.id === pi.itemId));
            if (ungroupedItems.length > 0) {
                orderItemsContainer.innerHTML += createGroupedHTML({ name: 'Chưa phân loại' }, ungroupedItems, pendingUngroupedItems);
            }
        } else {
            // Flat view
            const itemsHTML = supplierItems.map(item => {
                const pendingItem = pendingItems.find(pi => pi.itemId === item.id);
                return createItemHTML(item, pendingItem);
            }).join('');
            orderItemsContainer.innerHTML = `<div class="order-item-list">${itemsHTML}</div>`;
        }
    };

    const createGroupedHTML = (group, items, pendingItems) => {
        const itemsHTML = items.map(item => createItemHTML(item, pendingItems.find(pi => pi.itemId === item.id))).join('');
        return `
            <div class="order-group">
                <details open>
                    <summary>${group.name}</summary>
                    <div class="group-items">
                        ${itemsHTML}
                    </div>
                </details>
            </div>
        `;
    };

    const createItemHTML = (item, pendingItem = null) => {
        const isChecked = pendingItem ? 'checked' : '';
        const quantity = pendingItem ? pendingItem.quantity : '';
        return `
            <div class="order-item" data-item-id="${item.id}" data-name="${item.name}" data-unit="${item.unit}">
                <input type="checkbox" class="item-checkbox" ${isChecked}>
                <label>${item.name}</label>
            <input type="number" min="0" class="form-control quantity-input" value="${quantity}" placeholder="SL">
                <span>${item.unit}</span>
            </div>
        `;
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const supplierId = supplierSelect.value;
        if (!supplierId) return;

        const orderItems = [];
        const itemElements = orderItemsContainer.querySelectorAll('.order-item');

        itemElements.forEach(el => {
            const checkbox = el.querySelector('.item-checkbox');
            const quantityInput = el.querySelector('.quantity-input');
            const quantity = parseFloat(quantityInput.value);

            if (checkbox.checked && quantity > 0) {
                orderItems.push({
                    itemId: el.dataset.itemId,
                    quantity: quantity,
                    name: el.dataset.name,
                    unit: el.dataset.unit,
                });
            }
        });

        if (orderItems.length === 0) {
            alert('Vui lòng chọn ít nhất một sản phẩm và nhập số lượng.');
            return;
        }

        const pendingOrder = {
            id: generateId('ord'),
            supplier_id: supplierId,
            created_at: new Date().toISOString(),
            items: orderItems,
        };

        sessionStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(pendingOrder));
        window.location.href = './summary.html';
    };

    const restorePendingOrder = () => {
        const pendingOrderJSON = sessionStorage.getItem(PENDING_ORDER_KEY);
        if (!pendingOrderJSON) return;

        try {
            const pendingOrder = JSON.parse(pendingOrderJSON);
            supplierSelect.value = pendingOrder.supplier_id;
            orderForm.classList.remove('hidden');
            renderItems(pendingOrder.supplier_id, pendingOrder.items);
        } catch (e) {
            console.error("Could not restore pending order", e);
            sessionStorage.removeItem(PENDING_ORDER_KEY);
        }
    };

    // Event Listeners
    supplierSelect.addEventListener('change', () => {
        const supplierId = supplierSelect.value;
        if (supplierId) {
            orderForm.classList.remove('hidden');
            renderItems(supplierId);
        } else {
            orderForm.classList.add('hidden');
            orderItemsContainer.innerHTML = '';
        }
    });

    orderForm.addEventListener('submit', handleFormSubmit);

    // Initial Load
    populateSuppliers();
    restorePendingOrder();
};

document.addEventListener('app-ready', runPage);