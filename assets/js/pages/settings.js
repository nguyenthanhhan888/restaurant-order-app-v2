import { supabase } from '../services/supabaseClient.js';
import { showLoader, hideLoader } from '../services/loading.js';

const runPage = () => {
    const backupBtn = document.getElementById('backup-btn');

    const jsonToCsv = (json) => {
        if (!json || json.length === 0) {
            return '';
        }
        const headers = Object.keys(json[0]);
        const csvRows = [];
        csvRows.push(headers.join(','));

        for (const row of json) {
            const values = headers.map(header => {
                let value = row[header];
                if (value === null || value === undefined) {
                    value = '';
                } else {
                    const stringValue = String(value);
                    // Quote the value if it contains a comma, double quote, or newline
                    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                        value = `"${stringValue.replace(/"/g, '""')}"`;
                    }
                }
                return value;
            });
            csvRows.push(values.join(','));
        }
        return csvRows.join('\n');
    };

    const downloadCsv = (csvContent, filename) => {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleBackup = async () => {
        showLoader('Đang chuẩn bị dữ liệu...');
        try {
            const tables = ['suppliers', 'groups', 'items', 'orders', 'order_items'];
            const backupPromises = tables.map(table => supabase.from(table).select('*'));
            const results = await Promise.all(backupPromises);

            results.forEach((result, index) => {
                const tableName = tables[index];
                if (result.error) {
                    throw new Error(`Lỗi khi tải dữ liệu từ bảng ${tableName}: ${result.error.message}`);
                }
                if (result.data && result.data.length > 0) {
                    const csv = jsonToCsv(result.data);
                    downloadCsv(csv, `${tableName}.csv`);
                } else {
                    console.log(`Bảng ${tableName} trống, bỏ qua việc sao lưu.`);
                }
            });

            alert('Đã tải về các file sao lưu thành công (nếu có dữ liệu).');

        } catch (error) {
            console.error('Lỗi trong quá trình sao lưu:', error);
            alert(`Đã xảy ra lỗi: ${error.message}`);
        } finally {
            hideLoader();
        }
    };

    backupBtn.addEventListener('click', handleBackup);
};

document.addEventListener('app-ready', runPage);