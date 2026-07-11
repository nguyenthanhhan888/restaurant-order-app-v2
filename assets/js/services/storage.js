import { supabase } from './supabaseClient.js';

// A local cache to avoid fetching data from the server on every action.
let localDataCache = null;
const EMPTY_DATA = { suppliers: [], groups: [], items: [], orders: [] };

/**
 * Initializes the application by fetching all data from the Supabase backend.
 * This should be called once when the app starts.
 */
export const init = async () => {
    try {
        // Fetch all data in parallel for speed
        const [
            { data: suppliers, error: supError },
            { data: groups, error: grpError },
            { data: items, error: itmError },
            { data: orders, error: ordError },
            { data: orderItems, error: ordItmError }
        ] = await Promise.all([
            supabase.from('suppliers').select('*').order('name'),
            supabase.from('groups').select('*'),
            supabase.from('items').select('*'),
            supabase.from('orders').select('*').order('created_at', { ascending: false }),
            supabase.from('order_items').select('*')
        ]);

        // Check for errors
        if (supError) throw supError;
        if (grpError) throw grpError;
        if (itmError) throw itmError;
        if (ordError) throw ordError;
        if (ordItmError) throw ordItmError;

        // Reconstruct the orders object to match the frontend structure
        const reconstructedOrders = orders.map(order => ({
            ...order,
            items: orderItems.filter(oi => oi.order_id === order.id)
        }));

        localDataCache = {
            suppliers: suppliers || [],
            groups: groups || [],
            items: items || [],
            orders: reconstructedOrders || []
        };
        console.log("Data successfully fetched from Supabase.");

    } catch (error) {
        console.error("Could not initialize data from Supabase:", error);
        alert("Lỗi nghiêm trọng: Không thể tải dữ liệu từ máy chủ. Vui lòng kiểm tra lại URL API và kết nối mạng.");
        localDataCache = EMPTY_DATA; // Fallback to an empty structure
    }
};

/**
 * Gets the currently loaded application data from the local cache. Does not fetch.
 */
export const getData = () => {
    return localDataCache || EMPTY_DATA;
};

/**
 * A generic save function is no longer used.
 * We now use specific functions for each action.
 */
export const saveData = () => {
    console.error("saveData(data) is deprecated. Use specific functions like addSupplier, updateItem, etc.");
    return Promise.resolve();
};

// --- SUPPLIERS ---
export const addSupplier = async (supplierData) => {
    const { data, error } = await supabase.from('suppliers').insert(supplierData).select().single();
    if (error) throw error;
    localDataCache.suppliers.push(data);
    localDataCache.suppliers.sort((a, b) => a.name.localeCompare(b.name));
};

export const updateSupplier = async (id, supplierData) => {
    const { data, error } = await supabase.from('suppliers').update(supplierData).eq('id', id).select().single();
    if (error) throw error;
    const index = localDataCache.suppliers.findIndex(s => s.id === id);
    if (index > -1) localDataCache.suppliers[index] = data;
};

export const deleteSupplier = async (id) => {
    const { error } = await supabase.from('suppliers').delete().eq('id', id);
    if (error) throw error;
    // Data is deleted via CASCADE in DB, now update cache
    localDataCache.suppliers = localDataCache.suppliers.filter(s => s.id !== id);
    localDataCache.groups = localDataCache.groups.filter(g => g.supplier_id !== id);
    localDataCache.items = localDataCache.items.filter(i => i.supplier_id !== id);
};

// --- ITEMS ---
export const addItem = async (itemData) => {
    const { data, error } = await supabase.from('items').insert(itemData).select().single();
    if (error) throw error;
    localDataCache.items.push(data);
};

export const updateItem = async (id, itemData) => {
    const { data, error } = await supabase.from('items').update(itemData).eq('id', id).select().single();
    if (error) throw error;
    const index = localDataCache.items.findIndex(i => i.id === id);
    if (index > -1) localDataCache.items[index] = data;
};

export const deleteItem = async (id) => {
    const { error } = await supabase.from('items').delete().eq('id', id);
    if (error) throw error;
    localDataCache.items = localDataCache.items.filter(i => i.id !== id);
};

// --- ORDERS ---
export const createOrder = async (orderData) => {
    const { items, ...order } = orderData;
    const { data: newOrder, error: orderError } = await supabase.from('orders').insert(order).select().single();
    if (orderError) throw orderError;

    const orderItemsToInsert = items.map(item => ({
        order_id: newOrder.id,
        item_id: item.itemId,
        quantity: item.quantity,
        name: item.name,
        unit: item.unit
    }));
    const { data: newOrderItems, error: itemsError } = await supabase.from('order_items').insert(orderItemsToInsert).select();
    if (itemsError) throw itemsError;

    const finalOrder = { ...newOrder, items: newOrderItems };
    localDataCache.orders.unshift(finalOrder);
};

export const deleteOrder = async (id) => {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw error;
    localDataCache.orders = localDataCache.orders.filter(o => o.id !== id);
};

console.log("storage.js loaded");