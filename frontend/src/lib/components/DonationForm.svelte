<script>
    import { totalAmount, adminFee } from '$lib/stores/donation';
    import { formatCurrency } from '$lib/utils/formatter';
    import AmountSelector from './AmountSelector.svelte';
    import PaymentMethods from './PaymentMethods.svelte';
    import DonorInfo from './DonorInfo.svelte';
    
    function handleSubmit() {
        // Handle donation submission
        console.log('Donation submitted!');
        alert('Terima kasih atas donasi Anda!');
    }
</script>

<section class="lg:w-7/12 xl:w-1/2 bg-white dark:bg-background-dark order-2 min-h-screen">
    <div class="p-6 lg:p-12 xl:p-16 max-w-2xl mx-auto">
        
        <AmountSelector />
        
        <PaymentMethods />
        
        <DonorInfo />
        
        <!-- Sticky Bottom Action -->
        <div class="sticky bottom-0 bg-white/95 dark:bg-background-dark/95 backdrop-blur pt-3 pb-6 border-t border-gray-100 dark:border-gray-800 -mx-6 px-6 lg:-mx-12 lg:px-12 xl:-mx-16 xl:px-16 mt-auto">
            <div class="flex flex-col sm:flex-row justify-between items-center mb-3 gap-2">
                <div class="flex flex-col text-center sm:text-left">
                    <span class="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Donasi</span>
                    <span class="text-xl sm:text-2xl font-black text-primary">{formatCurrency($totalAmount)}</span>
                </div>
                <div class="hidden sm:block text-right">
                    <span class="text-xs text-gray-400">Biaya Admin: {formatCurrency($adminFee)}</span>
                </div>
            </div>
            
            <button 
                on:click={handleSubmit}
                class="w-full group relative flex items-center justify-center gap-2 bg-orange-400 hover:bg-orange-600 text-white text-base font-bold py-3 rounded-xl shadow-lg shadow-orange-200 dark:shadow-none transition-all transform hover:-translate-y-1 active:scale-[0.99] overflow-hidden">
                <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span>Donasi Sekarang</span>
                <span class="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            
            <div class="flex items-center justify-center gap-3 mt-3 opacity-60">
                <div class="flex items-center gap-1 text-[9px] text-gray-500 uppercase tracking-widest font-semibold">
                    <span class="material-symbols-outlined text-xs">lock</span>
                    Secure SSL
                </div>
                <div class="w-px h-2.5 bg-gray-300"></div>
                <div class="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">
                    Auto Receipt
                </div>
            </div>
        </div>
    </div>
</section>
