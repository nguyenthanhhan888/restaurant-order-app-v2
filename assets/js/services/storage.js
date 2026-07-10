import { CONFIG } from '../config.js';

const API_URL = 'https://script.google.com/macros/s/AKfycbztYCUGn5z8xGhgQeJudlGd3AzAwup86bwS7hDMdF0GP-JD4m3rDaoBvDXHMe4T/exec'; // <-- IMPORTANT: Paste your URL here

// A local cache to avoid fetching data from the server on every action.
let localDataCache = null;
const EMPTY_DATA = { suppliers: [], groups: [], items: [], orders: [] };

/**
 * Initializes the application by fetching all data from the Google Sheets backend.
 * This should be called once when the app starts.
 */
export const init = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        localDataCache = data;
        console.log("Data successfully fetched from Google Sheets.");
    } catch (error) {
        console.error("Could not initialize data from Google Sheets:", error);
        alert("Lỗi nghiêm trọng: Không thể tải dữ liệu từ máy chủ. Vui lòng kiểm tra lại URL API và kết nối mạng.");
        localDataCache = EMPTY_DATA; // Fallback to an empty structure
    }
};

/**
 * Gets the currently loaded application data from the local cache.
 * @returns {object} The application data.
 */
export const getData = () => {
    if (!localDataCache) {
        console.warn("Data is not yet initialized. Returning empty structure.");
        return EMPTY_DATA;
    }
    return localDataCache;
};

/**
 * Saves the entire data object to the Google Sheets backend.
 * @param {object} data The complete application data object to save.
 */
export const saveData = async (data) => {
    try {
        // We use 'no-cors' mode as a simple way to send data to Google Apps Script
        // from a different origin without complex CORS preflight handling.
        // The trade-off is that we cannot read the response to confirm success.
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors', 
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            redirect: 'follow'
        });
        
        // Since we can't confirm success from the server, we optimistically
        // update our local cache to reflect the changes immediately.
        localDataCache = data;
        console.log("Data sent to Google Sheets for saving.");

    } catch (error) {
        console.error("Error saving data to Google Sheets:", error);
        alert("Lỗi: Không thể lưu dữ liệu lên máy chủ. Thay đổi của bạn có thể bị mất khi tải lại trang.");
    }
};

console.log("storage.js loaded");