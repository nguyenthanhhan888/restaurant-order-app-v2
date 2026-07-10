import { getData, saveData } from '../services/storage.js';
import { generateId } from '../utils/helpers.js';
import { showLoader, hideLoader } from '../services/loading.js';

const runPage = () => {
    // Main elements
    const supplierSelect = document.getElementById('supplier-select');
    const productManagementSection = document.getElementById('product-management-section');
    const addProductBtn = document.getElementById('add-product-btn');
    const productTableBody = document.getElementById('product-table-body');

    // Modal elements
    const productModal = document.getElementById('product-modal');
    const closeModalBtn = productModal.querySelector('.close-button');
    const productForm = document.getElementById('product-form');
    const modalTitle = document.getElementById('modal-title');
    const productIdInput = document.getElementById('product-id');
    const productNameInput = document.getElementById('product-name');
    const productUnitInput = document.getElementById('product-unit');
    const productGroupSelect = document.getElementById('product-group');
    const groupFormGroup = document.getElementById('group-form-group');
    const nameError = document.getElementById('product-name-error');

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

    const renderProducts = (supplierId) => {
        const { items, groups } = getData();
        const supplierItems = items.filter(item => item.supplierId === supplierId);
        productTableBody.innerHTML = '';

        if (supplierItems.length === 0) {
            productTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Chưa có mặt hàng nào.</td></tr>';
            return;
        }

        supplierItems.forEach((item, index) => {
            const group = item.groupId ? groups.find(g => g.id === item.groupId) : null;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.unit}</td>
                <td>${group ? group.name : 'Không có'}</td>
                <td class="action-buttons">
                    <button class="btn btn-secondary btn-sm edit-btn" data-id="${item.id}">Sửa</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${item.id}" data-name="${item.name}">Xóa</button>
                </td>
            `;
            productTableBody.appendChild(row);
        });
    };

    const openModal = (title, item = null) => {
        const supplierId = supplierSelect.value;
        const { groups } = getData();
        const supplierGroups = groups.filter(g => g.supplierId === supplierId);

        modalTitle.textContent = title;
        productForm.reset();
        nameError.style.display = 'none';
        productIdInput.value = item ? item.id : '';

        // Populate and manage group dropdown
        if (supplierGroups.length > 0) {
            groupFormGroup.classList.remove('hidden');
            productGroupSelect.innerHTML = '<option value="">Không có nhóm</option>';
            supplierGroups.forEach(group => {
                const option = document.createElement('option');
                option.value = group.id;
                option.textContent = group.name;
                productGroupSelect.appendChild(option);
            });
        } else {
            groupFormGroup.classList.add('hidden');
        }

        if (item) {
            productNameInput.value = item.name;
            productUnitInput.value = item.unit;
            productGroupSelect.value = item.groupId || '';
        }

        productModal.style.display = 'block';
    };

    const closeModal = () => {
        productModal.style.display = 'none';
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const supplierId = supplierSelect.value;
        const id = productIdInput.value;
        const name = productNameInput.value.trim();
        const unit = productUnitInput.value.trim();
        const groupId = productGroupSelect.value || null;
        const data = getData();

        if (!name || !unit) {
            nameError.textContent = 'Tên và Đơn vị không được để trống.';
            nameError.style.display = 'block';
            return;
        }

        const isDuplicate = data.items.some(i => i.supplierId === supplierId && i.name.toLowerCase() === name.toLowerCase() && i.id !== id);
        if (isDuplicate) {
            nameError.textContent = 'Tên mặt hàng đã tồn tại cho nhà cung cấp này.';
            nameError.style.display = 'block';
            return;
        }

        if (id) { // Edit
            const item = data.items.find(i => i.id === id);
            if (item) {
                item.name = name;
                item.unit = unit;
                item.groupId = groupId;
            }
        } else { // Add
            const newItem = {
                id: generateId('itm'),
                name,
                unit,
                supplierId,
                groupId,
            };
            data.items.push(newItem);
        }

        showLoader('Đang lưu...');
        await saveData(data);

        // Use a small timeout to make the loader feel more substantial
        setTimeout(() => {
            hideLoader();
            renderProducts(supplierId);
            closeModal();
        }, 300);
    };

    const handleTableClick = async (event) => {
        const target = event.target;
        const id = target.dataset.id;

        if (target.classList.contains('edit-btn')) {
            const { items } = getData();
            const item = items.find(i => i.id === id);
            if (item) {
                openModal('Sửa Mặt Hàng', item);
            }
        }

        if (target.classList.contains('delete-btn')) {
            const name = target.dataset.name;
            if (confirm(`Bạn có chắc chắn muốn xóa mặt hàng "${name}"?`)) {
                let data = getData();
                data.items = data.items.filter(i => i.id !== id);
                
                showLoader('Đang xóa...');
                await saveData(data);

                setTimeout(() => {
                    hideLoader();
                    renderProducts(supplierSelect.value);
                }, 300);
            }
        }
    };

    // Event Listeners
    supplierSelect.addEventListener('change', () => {
        const supplierId = supplierSelect.value;
        if (supplierId) {
            productManagementSection.classList.remove('hidden');
            renderProducts(supplierId);
        } else {
            productManagementSection.classList.add('hidden');
        }
    });

    addProductBtn.addEventListener('click', () => openModal('Thêm Mặt Hàng'));
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === productModal) closeModal();
    });
    productForm.addEventListener('submit', handleFormSubmit);
    productTableBody.addEventListener('click', handleTableClick);

    // Initial Load
    populateSuppliers();
};

document.addEventListener('app-ready', runPage);