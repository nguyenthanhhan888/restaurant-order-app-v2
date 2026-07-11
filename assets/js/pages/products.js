import { getData, addItem, updateItem, deleteItem } from '../services/storage.js';
import { generateId } from '../utils/helpers.js';
import { showLoader, hideLoader } from '../services/loading.js';

const runPage = () => {
    // Main elements
    const supplierSelect = document.getElementById('supplier-select');
    const productManagementSection = document.getElementById('product-management-section');
    const addProductBtn = document.getElementById('add-product-btn');
    const productTableBody = document.getElementById('product-table-body');
    const searchInput = document.getElementById('search-input');
    const sortBtn = document.getElementById('sort-btn');

    let currentSort = 'asc'; // 'asc' or 'desc'

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

    const renderProducts = (supplierId, searchTerm = '') => {
        let { items, groups } = getData();
        let supplierItems = items.filter(item => item.supplier_id === supplierId);
        productTableBody.innerHTML = '';
        
        // 1. Sort data
        const groupMap = new Map(groups.map(g => [g.id, g.name]));
        supplierItems.sort((a, b) => {
            const groupNameA = groupMap.get(a.group_id) || 'zzzz'; // Ungrouped items last
            const groupNameB = groupMap.get(b.group_id) || 'zzzz';

            const groupCompare = groupNameA.localeCompare(groupNameB);
            if (groupCompare !== 0) {
                return groupCompare; // Sort by group name first
            }

            // If in the same group, sort by item name
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            return currentSort === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        });

        // 2. Filter data
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        if (lowerCaseSearchTerm) {
            supplierItems = supplierItems.filter(item => 
                item.name.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }
        
        if (supplierItems.length === 0) {
            productTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Không tìm thấy mặt hàng nào.</td></tr>';
            return;
        }

        supplierItems.forEach((item, index) => {
            const group = item.group_id ? groups.find(g => g.id === item.group_id) : null;
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

    const populateUnitSuggestions = () => {
        const { items } = getData();
        const unitDatalist = document.getElementById('unit-suggestions');
        // Use a Set to get unique unit values
        const uniqueUnits = [...new Set(items.map(item => item.unit))];
        
        unitDatalist.innerHTML = '';
        uniqueUnits.forEach(unit => {
            unitDatalist.innerHTML += `<option value="${unit}">`;
        });
    };

    const openModal = (title, item = null) => {
        const supplierId = supplierSelect.value;
        const { groups } = getData();
        const supplierGroups = groups.filter(g => g.supplier_id === supplierId);

        modalTitle.textContent = title;
        productForm.reset();
        nameError.style.display = 'none';
        productIdInput.value = item ? item.id : '';

        // Populate unit suggestions every time the modal is opened
        populateUnitSuggestions();

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
            productGroupSelect.value = item.group_id || '';
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

        if (!name || !unit) {
            nameError.textContent = 'Tên và Đơn vị không được để trống.';
            nameError.style.display = 'block';
            return;
        }
        
        const data = getData();
        const isDuplicate = data.items.some(i => i.supplier_id === supplierId && i.name.toLowerCase() === name.toLowerCase() && i.id !== id);
        if (isDuplicate) {
            nameError.textContent = 'Tên mặt hàng đã tồn tại cho nhà cung cấp này.';
            nameError.style.display = 'block';
            return;
        }
        
        showLoader('Đang lưu...');
        try {
            if (id) { // Edit
                await updateItem(id, { name, unit, group_id: groupId });
            } else { // Add
                const newItem = {
                    id: generateId('itm'),
                    name,
                    unit,
                    supplier_id: supplierId,
                    group_id: groupId,
                };
                await addItem(newItem);
            }
            renderProducts(supplierId);
            populateUnitSuggestions(); // Update suggestions after saving
            closeModal();
        } catch (error) {
            console.error("Failed to save item:", error);
            alert(`Lỗi: ${error.message}`);
        } finally {
            hideLoader();
        }
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
                showLoader('Đang xóa...');
                try {
                    await deleteItem(id);
                    renderProducts(supplierSelect.value);
                } catch (error) {
                    console.error("Failed to delete item:", error);
                    alert(`Lỗi: ${error.message}`);
                } finally {
                    hideLoader();
                }
            }
        }
    };

    // Event Listeners
    supplierSelect.addEventListener('change', () => {
        const supplierId = supplierSelect.value;
        if (supplierId) {
            productManagementSection.classList.remove('hidden');
            searchInput.value = ''; // Clear search on supplier change
            renderProducts(supplierId);
        } else {
            productManagementSection.classList.add('hidden');
        }
    });

    searchInput.addEventListener('input', (e) => {
        renderProducts(supplierSelect.value, e.target.value);
    });

    sortBtn.addEventListener('click', () => {
        currentSort = currentSort === 'asc' ? 'desc' : 'asc';
        sortBtn.textContent = currentSort === 'asc' ? 'Sắp xếp A-Z' : 'Sắp xếp Z-A';
        renderProducts(supplierSelect.value, searchInput.value);
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