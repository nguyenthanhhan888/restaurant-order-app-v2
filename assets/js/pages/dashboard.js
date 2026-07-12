import { getData } from '../services/storage.js';

const runPage = () => {
    const { orders, suppliers, items } = getData();

    // --- Get data for the current month ---
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const ordersThisMonth = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= firstDayOfMonth && orderDate <= lastDayOfMonth;
    });

    // --- 1. Render KPIs ---
    const renderKPIs = () => {
        const totalOrdersEl = document.getElementById('total-orders-kpi');
        const topSupplierEl = document.getElementById('top-supplier-kpi');

        // Total Orders
        totalOrdersEl.textContent = ordersThisMonth.length;

        // Top Supplier
        if (ordersThisMonth.length > 0) {
            const supplierCount = ordersThisMonth.reduce((acc, order) => {
                acc[order.supplier_id] = (acc[order.supplier_id] || 0) + 1;
                return acc;
            }, {});

            const topSupplierId = Object.keys(supplierCount).reduce((a, b) => supplierCount[a] > supplierCount[b] ? a : b);
            const topSupplier = suppliers.find(s => s.id === topSupplierId);
            topSupplierEl.textContent = topSupplier ? topSupplier.name : '--';
        }
    };

    // --- 2. Render Supplier Spending Chart & Total Spending KPI ---
    const renderSupplierSpendingChart = () => {
        const totalSpendingEl = document.getElementById('total-spending-kpi');
        const spendingBySupplier = {};
        let totalSpending = 0;

        ordersThisMonth.forEach(order => {
            const orderTotal = order.items.reduce((sum, item) => {
                // This is a simplified calculation. A real app would need price data.
                // For now, we'll just count items to show the concept.
                return sum + (item.quantity || 0); 
            }, 0);

            spendingBySupplier[order.supplier_id] = (spendingBySupplier[order.supplier_id] || 0) + orderTotal;
            totalSpending += orderTotal;
        });

        // Update total spending KPI (using item count as a proxy for spending)
        totalSpendingEl.textContent = totalSpending.toLocaleString('vi-VN');

        const supplierMap = new Map(suppliers.map(s => [s.id, s.name]));
        const chartLabels = Object.keys(spendingBySupplier).map(id => supplierMap.get(id) || 'Không rõ');
        const chartData = Object.values(spendingBySupplier);

        const ctx = document.getElementById('supplier-spending-chart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Số lượng mặt hàng đã đặt',
                    data: chartData,
                    backgroundColor: 'rgba(192, 57, 43, 0.7)',
                    borderColor: 'rgba(192, 57, 43, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    };

    // --- 3. Render Top Ordered Items ---
    const renderTopItems = () => {
        const topItemsListEl = document.getElementById('top-items-list');
        topItemsListEl.innerHTML = '';

        const allItemsThisMonth = ordersThisMonth.flatMap(order => order.items);
        if (allItemsThisMonth.length === 0) {
            topItemsListEl.innerHTML = '<li>Chưa có dữ liệu.</li>';
            return;
        }

        const itemCount = allItemsThisMonth.reduce((acc, item) => {
            acc[item.name] = (acc[item.name] || 0) + item.quantity;
            return acc;
        }, {});

        const sortedItems = Object.entries(itemCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);

        if (sortedItems.length === 0) {
            topItemsListEl.innerHTML = '<li>Chưa có dữ liệu.</li>';
        } else {
            sortedItems.forEach(([name, count]) => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${name}</span> <strong>${count.toLocaleString('vi-VN')}</strong>`;
                topItemsListEl.appendChild(li);
            });
        }
    };

    // --- 4. Render Recent Orders ---
    const renderRecentOrders = () => {
        const recentOrdersListEl = document.getElementById('recent-orders-list');
        recentOrdersListEl.innerHTML = '';
        const recentOrders = orders.slice(0, 5); // `orders` is already sorted by date

        if (recentOrders.length === 0) {
            recentOrdersListEl.innerHTML = '<li>Chưa có đơn hàng nào.</li>';
            return;
        }

        recentOrders.forEach(order => {
            const supplier = suppliers.find(s => s.id === order.supplier_id);
            const orderDate = new Date(order.created_at);
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${supplier ? supplier.name : 'Không rõ'}</span> 
                <small>${orderDate.toLocaleDateString('vi-VN')}</small>
            `;
            recentOrdersListEl.appendChild(li);
        });
    };

    // --- Initial Render ---
    renderKPIs();
    renderSupplierSpendingChart();
    renderTopItems();
    renderRecentOrders();
};

document.addEventListener('app-ready', runPage);