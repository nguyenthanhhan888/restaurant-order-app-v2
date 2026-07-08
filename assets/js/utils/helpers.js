/**
 * Generates a unique ID with a given prefix.
 * e.g., generateId('sup') -> 'sup_a1b2c3d4'
 * @param {string} prefix 
 * @returns {string}
 */
export const generateId = (prefix = 'id') => {
    return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
};

console.log("helpers.js loaded");