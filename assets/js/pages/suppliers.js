import { getData, addSupplier, updateSupplier, deleteSupplier } from '../services/storage.js';
import { generateId } from '../utils/helpers.js';
import { showLoader, hideLoader } from '../services/loading.js';

const runPage = () => {
    const supplierModal = document.getElementById('supplier-modal');
    const addSupplierBtn = document.getElementById('add-supplier-btn');
    const closeModalBtn = document.querySelector('.close-button');
    const supplierForm = document.getElementById('supplier-form');
    const modalTitle = document.getElementById('modal-title');
    const supplierNameInput = document.getElementById('supplier-name');
    const supplierIdInput = document.getElementById('supplier-id');
    const nameError = document.getElementById('name-error');
    const supplierTableBody = document.getElementById('supplier-table-body');

    const openModal = (title, supplier = null) => {
        modalTitle.textContent = title;
        supplierForm.reset();
        nameError.style.display = 'none';
        if (supplier) {
            supplierNameInput.value = supplier.name;
            supplierIdInput.value = supplier.id;
        } else {
            supplierIdInput.value = '';
        }
        supplierModal.style.display = 'block';
    };

    const closeModal = () => {
        supplierModal.style.display = 'none';
    };

    const renderSuppliers = () => {
        const { suppliers } = getData();
        supplierTableBody.innerHTML = '';
        if (suppliers.length === 0) {
            supplierTableBody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Chưa có nhà cung cấp nào.</td></tr>';
            return;
        }
        suppliers.forEach((supplier, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${supplier.name}</td>
                <td class="action-buttons">
                    <button class="btn btn-secondary btn-sm edit-btn" data-id="${supplier.id}">Sửa</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${supplier.id}" data-name="${supplier.name}">Xóa</button>
                </td>
            `;
            supplierTableBody.appendChild(row);
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const name = supplierNameInput.value.trim();
        const id = supplierIdInput.value;

        // Validate name
        if (!name) {
            nameError.textContent = 'Tên nhà cung cấp không được để trống.';
            nameError.style.display = 'block';
            return;
        }

        // Check for duplicate name
        const data = getData();
        const isDuplicate = data.suppliers.some(s => s.name.toLowerCase() === name.toLowerCase() && s.id !== id);
        if (isDuplicate) {
            nameError.textContent = 'Tên nhà cung cấp đã tồn tại.';
            nameError.style.display = 'block';
            return;
        }

        showLoader('Đang lưu...');
        try {
            if (id) { // Edit mode
                await updateSupplier(id, { name });
            } else { // Add mode
                const newSupplier = {
                    id: generateId('sup'),
                    name: name,
                };
                await addSupplier(newSupplier);
            }
            renderSuppliers();
            closeModal();
        } catch (error) {
            console.error("Failed to save supplier:", error);
            alert(`Lỗi: ${error.message}`);
        } finally {
            hideLoader();
        }
    };

    const handleTableClick = async (event) => {
        const target = event.target;
        const id = target.dataset.id;

        if (target.classList.contains('edit-btn')) {
            const { suppliers } = getData();
            const supplier = suppliers.find(s => s.id === id);
            if (supplier) {
                openModal('Sửa Nhà Cung Cấp', supplier);
            }
        }

        if (target.classList.contains('delete-btn')) {
            const name = target.dataset.name;
            if (confirm(`Bạn có chắc chắn muốn xóa nhà cung cấp "${name}"?\n\nHành động này sẽ xóa tất cả các nhóm và mặt hàng liên quan.`)) {
                showLoader('Đang xóa...');
                try {
                    await deleteSupplier(id);
                    renderSuppliers();
                } catch (error) {
                    console.error("Failed to delete supplier:", error);
                    alert(`Lỗi: ${error.message}`);
                } finally {
                    hideLoader();
                }
            }
        }
    };

    // Event Listeners
    addSupplierBtn.addEventListener('click', () => openModal('Thêm Nhà Cung Cấp'));
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === supplierModal) {
            closeModal();
        }
    });
    supplierForm.addEventListener('submit', handleFormSubmit);
    supplierTableBody.addEventListener('click', handleTableClick);

    // Initial render
    renderSuppliers();
};

document.addEventListener('app-ready', runPage);