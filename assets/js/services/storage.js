import { CONFIG } from '../config.js';

const getInitialData = () => ({
    suppliers: [
        { id: "sup_metro", name: "Metro" },
        { id: "sup_edeka", name: "EDEKA" },
        { id: "sup_asia", name: "Châu Á" },
        { id: "sup_japan", name: "Đồ Nhật" }
    ],
    groups: [
        { id: "grp_rau", name: "Hàng Rau", supplierId: "sup_metro" },
        { id: "grp_kho", name: "Hàng Khô", supplierId: "sup_metro" },
        { id: "grp_vs", name: "Vệ Sinh", supplierId: "sup_metro" },
        { id: "grp_thit", name: "Thịt", supplierId: "sup_metro" }
    ],
    items: [
        { id: "itm_salatdo", name: "Salat đỏ", unit: "kg", supplierId: "sup_metro", groupId: "grp_rau" },
        { id: "itm_mieng", name: "Miến", unit: "gói", supplierId: "sup_metro", groupId: "grp_kho" },
        { id: "itm_trung", name: "Trứng", unit: "vỉ", supplierId: "sup_edeka", groupId: null }
    ],
    orders: []
});

export const init = () => {
    const data = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (!data) {
        console.log("No data found in LocalStorage. Initializing with sample data.");
        saveData(getInitialData());
    } else {
        console.log("Data found in LocalStorage.");
    }
};

export const getData = () => {
    try {
        const data = localStorage.getItem(CONFIG.STORAGE_KEY);
        return data ? JSON.parse(data) : getInitialData();
    } catch (error) {
        console.error("Error parsing data from LocalStorage:", error);
        return getInitialData();
    }
};

export const saveData = (data) => {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
};

console.log("storage.js loaded");