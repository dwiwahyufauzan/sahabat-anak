import { derived, writable } from 'svelte/store';

export const currentStep = writable(1);
export const selectedAmount = writable(0);  // Changed from null to 0
export const customAmount = writable('');
export const selectedMethod = writable(null);
export const donorInfo = writable({
    name: '',
    email: '',
    phone: '',
    isAnonymous: false
});

// Derived store for total amount (selected or custom)
export const totalAmount = derived(
    [selectedAmount, customAmount],
    ([$selectedAmount, $customAmount]) => {
        if ($customAmount && $customAmount.trim() !== '') {
            const parsed = parseFloat($customAmount.replace(/[^\d]/g, ''));
            return isNaN(parsed) ? 0 : parsed;
        }
        return $selectedAmount || 0;
    }
);

// Admin fee calculation (e.g., 2.5% of donation)
export const adminFee = derived(
    totalAmount,
    ($totalAmount) => Math.round($totalAmount * 0.025)
);

// Final total including admin fee
export const finalTotal = derived(
    [totalAmount, adminFee],
    ([$totalAmount, $adminFee]) => $totalAmount + $adminFee
);