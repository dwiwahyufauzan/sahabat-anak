<script>
    import { get } from 'svelte/store';
    import { api } from '$lib/api/client';
    import { totalAmount, adminFee, donorInfo, selectedMethod } from '$lib/stores/donation';
    import { formatCurrency } from '$lib/utils/formatter';
    import AmountSelector from './AmountSelector.svelte';
    import PaymentMethods from './PaymentMethods.svelte';
    import DonorInfo from './DonorInfo.svelte';
    
    let isSubmitting = $state(false);
    let error = $state('');
    /**
   * @type {File | null}
   */
    let paymentProofFile = $state(null);
    
    /**
   * @param {Event} event
   */
    function handleFileChange(event) {
        const target = /** @type {HTMLInputElement} */ (event.target);
        const file = target.files?.[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Ukuran file maksimal 5MB');
                target.value = '';
                return;
            }
            // Validate file type
            if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
                alert('Format file harus JPG, PNG, atau WebP');
                target.value = '';
                return;
            }
            paymentProofFile = file;
        }
    }
    
    async function handleSubmit() {
        isSubmitting = true;
        error = '';
        
        try {
            const donor = get(donorInfo);
            const amount = get(totalAmount);
            const method = get(selectedMethod);
            
            // Validation
            if (!amount || amount <= 0) {
                throw new Error('Silakan pilih nominal donasi');
            }
            
            if (!method) {
                throw new Error('Silakan pilih metode pembayaran');
            }
            
            if (!donor.email) {
                throw new Error('Email wajib diisi untuk bukti donasi');
            }
            
            if (!paymentProofFile) {
                throw new Error('Silakan upload bukti transfer');
            }
            
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('amount', amount.toString());
            formData.append('paymentMethod', method);
            formData.append('donorName', donor.isAnonymous ? 'Hamba Allah' : (donor.name || 'Anonim'));
            formData.append('donorEmail', donor.email);
            if (donor.phone) formData.append('donorPhone', donor.phone);
            formData.append('paymentProof', paymentProofFile);
            
            // Submit to backend with FormData
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL || 'http://localhost:3000'}/api/donations`, {
                method: 'POST',
                body: formData,
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit donation');
            }
            
            alert('Terima kasih atas donasi Anda! Bukti transfer telah diterima.');
            
            // Reset form
            window.location.reload();
        } catch (err) {
            console.error('Error submitting donation:', err);
            error = err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses donasi. Silakan coba lagi.';
            alert(error);
        } finally {
            isSubmitting = false;
        }
    }
</script>

<section class="lg:w-7/12 xl:w-1/2 bg-white dark:bg-background-dark order-2 min-h-screen">
    <div class="p-6 lg:p-12 xl:p-16 max-w-2xl mx-auto">
        
        <AmountSelector />
        
        <PaymentMethods />
        
        <DonorInfo />
        
        <!-- Payment Proof Upload -->
        <div class="mb-10">
            <h3 class="text-xl font-bold mb-4 flex items-center gap-2 text-[#181411] dark:text-white">
                <span class="material-symbols-outlined text-primary fill-1">upload_file</span>
                Bukti Transfer
            </h3>
            
            <div class="space-y-3">
                <label class="block">
                    <div class="relative">
                        <input 
                            type="file" 
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onchange={handleFileChange}
                            class="hidden" 
                            id="payment-proof" />
                        <label 
                            for="payment-proof"
                            class="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-primary cursor-pointer transition-all dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                            <span class="material-symbols-outlined text-primary">cloud_upload</span>
                            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {paymentProofFile ? paymentProofFile.name : 'Pilih file bukti transfer'}
                            </span>
                        </label>
                    </div>
                    <p class="text-xs text-gray-500 mt-2 ml-1">
                        Format: JPG, PNG, WebP • Maksimal 5MB
                    </p>
                </label>
                
                {#if paymentProofFile}
                    <div class="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
                        <span class="material-symbols-outlined text-green-600 text-sm">check_circle</span>
                        <span class="text-sm text-green-700 dark:text-green-400 font-medium">File siap diupload</span>
                    </div>
                {/if}
            </div>
        </div>
        
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
                onclick={handleSubmit}
                disabled={isSubmitting}
                class="w-full group relative flex items-center justify-center gap-2 bg-orange-400 hover:bg-orange-600 text-white text-base font-bold py-3 rounded-xl shadow-lg shadow-orange-200 dark:shadow-none transition-all transform hover:-translate-y-1 active:scale-[0.99] overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed">
                <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span>{isSubmitting ? 'Memproses...' : 'Donasi Sekarang'}</span>
                {#if !isSubmitting}
                    <span class="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                {/if}
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
