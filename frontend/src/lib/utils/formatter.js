/**
 * @param {number | bigint} amount
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount).replace('IDR', 'Rp');
}

/**
 * @param {number | bigint} num
 */
export function formatNumber(num) {
    return new Intl.NumberFormat('id-ID').format(num);
}
