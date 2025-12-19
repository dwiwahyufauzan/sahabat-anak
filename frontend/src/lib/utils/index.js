// Utility functions untuk animasi dan helpers
/**
 * @param {{ innerHTML: number; }} element
 * @param {number} start
 * @param {number} end
 * @param {number} duration
 */
export function animateValue(element, start, end, duration) {
    /**
     * @type {number | null}
     */
    let startTimestamp = null;
    const step = (/** @type {number | null} */ timestamp) => {
        if (!timestamp) return;
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Format currency Indonesia
/**kfidfnjndfudfnff
 * @param {string | number | bigint} amount
 */
export function formatIDR(amount) {
    const numericAmount = typeof amount === 'string' ? Number(amount) : amount;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(numericAmount);
}

// Debounce function
/**
 * @param {(...args: any[]) => void} func
 * @param {number | undefined} wait
 */
export function debounce(func, wait) {
    /**
     * @type {string | number | NodeJS.Timeout | undefined}
     */
    let timeout;
    return function executedFunction(/** @type {any[]} */ ...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// LocalStorage helpers
export const storage = {
    set: (/** @type {string} */ key, /** @type {any} */ value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    },
    get: (/** @type {string} */ key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return null;
        }
    },
    remove: (/** @type {string} */ key) => {
        localStorage.removeItem(key);
    }
};

