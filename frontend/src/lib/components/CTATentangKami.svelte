<script lang="ts">
    import Modal from '$lib/components/shared/Modal.svelte';
    
    // Form state dengan Svelte 5 runes
    let donationAmount = $state(50000);
    let volunteerForm = $state({
        name: '',
        email: '',
        phone: '',
        city: '',
        skills: []
    });
    
    let showDonationForm = $state(false);
    let showVolunteerForm = $state(false);
    
    // Modal states
    let showModal = $state(false);
    let modalType: 'success' | 'error' | 'warning' | 'info' = $state('success');
    let modalTitle = $state('');
    let modalMessage = $state('');
    
    // Preset donation amounts
    const donationAmounts = [25000, 50000, 100000, 250000, 500000];
    
    // Handle donation submission
    async function handleDonation() {
        // Implementasi payment gateway
        console.log('Donating:', donationAmount);
        // Reset form setelah submit
        donationAmount = 50000;
        showDonationForm = false;
    }
    
    // Handle volunteer registration
    async function handleVolunteerSubmit() {
        // Kirim data ke backend
        const response = await fetch('/api/volunteers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(volunteerForm)
        });
        
        if (response.ok) {
            modalType = 'success';
            modalTitle = 'Pendaftaran Berhasil!';
            modalMessage = 'Pendaftaran relawan berhasil! Kami akan segera menghubungi Anda.';
            showModal = true;
            // Reset form
            volunteerForm = { name: '', email: '', phone: '', city: '', skills: [] };
            showVolunteerForm = false;
        }
    }
</script>

<section class="py-24 bg-primary relative overflow-hidden">
    <div class="absolute inset-0 opacity-10" 
         style="background-image: radial-gradient(circle at 20% 50%, white 0%, transparent 20%), radial-gradient(circle at 80% 80%, white 0%, transparent 20%);">
    </div>
    
    <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 class="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Siap Menjadi Sahabat Mereka?
        </h2>
        
        <p class="text-white/90 text-lg md:text-xl mb-10 font-medium max-w-2xl mx-auto">
            Satu langkah kecil dari Anda bisa berarti masa depan yang cerah bagi mereka. Mari bergandengan tangan untuk anak Indonesia.
        </p>
        
        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button 
                class="w-full sm:w-auto bg-accent hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-orange-600/20 transition-all hover:scale-105 active:scale-95"
                onclick={() => showDonationForm = true}
            >
                Donasi Sekarang
            </button>
            
            <button 
                class="w-full sm:w-auto bg-white text-primary hover:bg-slate-50 px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-all hover:scale-105 active:scale-95"
                onclick={() => showVolunteerForm = true}
            >
                Daftar Relawan
            </button>
        </div>
        
        <!-- Donation Modal -->
        {#if showDonationForm}
            <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" 
                 role="button"
                 tabindex="0"
                 onclick={() => showDonationForm = false}
                 onkeydown={(e) => e.key === 'Escape' && (showDonationForm = false)}>
                <div class="bg-white rounded-2xl p-8 max-w-md w-full" 
                     role="dialog"
                     aria-modal="true"
                     tabindex="-1"
                     onclick={(e) => e.stopPropagation()}
                     onkeydown={(e) => e.stopPropagation()}>
                    <h3 class="text-2xl font-bold mb-6">Pilih Nominal Donasi</h3>
                    
                    <div class="grid grid-cols-3 gap-3 mb-6">
                        {#each donationAmounts as amount}
                            <button 
                                class="py-3 rounded-xl border {donationAmount === amount ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 hover:border-primary'}"
                                onclick={() => donationAmount = amount}
                            >
                                Rp {amount.toLocaleString('id-ID')}
                            </button>
                        {/each}
                    </div>
                    
                    <div class="mb-6">
                        <label for="custom-donation-amount" class="block text-sm font-medium mb-2">Atau masukkan nominal lain:</label>
                        <input 
                            id="custom-donation-amount"
                            type="number" 
                            bind:value={donationAmount}
                            class="w-full p-3 border border-slate-300 rounded-xl"
                            min="10000"
                        />
                    </div>
                    
                    <button 
                        class="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-sky-600"
                        onclick={handleDonation}
                    >
                        Donasi Rp {donationAmount.toLocaleString('id-ID')}
                    </button>
                </div>
            </div>
        {/if}
        
        <!-- Volunteer Modal -->
        {#if showVolunteerForm}
            <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" 
                 role="button"
                 tabindex="0"
                 onclick={() => showVolunteerForm = false}
                 onkeydown={(e) => e.key === 'Escape' && (showVolunteerForm = false)}>
                <div class="bg-white rounded-2xl p-8 max-w-md w-full" 
                     role="dialog"
                     aria-modal="true"
                     tabindex="-1"
                     onclick={(e) => e.stopPropagation()}
                     onkeydown={(e) => e.stopPropagation()}>
                    <h3 class="text-2xl font-bold mb-6">Formulir Relawan</h3>
                    
                    <form onsubmit={(e) => { e.preventDefault(); handleVolunteerSubmit(); }} class="space-y-4">
                        <input 
                            type="text" 
                            bind:value={volunteerForm.name}
                            placeholder="Nama Lengkap"
                            class="w-full p-3 border border-slate-300 rounded-xl"
                            required
                        />
                        
                        <input 
                            type="email" 
                            bind:value={volunteerForm.email}
                            placeholder="Email"
                            class="w-full p-3 border border-slate-300 rounded-xl"
                            required
                        />
                        
                        <input 
                            type="tel" 
                            bind:value={volunteerForm.phone}
                            placeholder="Nomor WhatsApp"
                            class="w-full p-3 border border-slate-300 rounded-xl"
                            required
                        />
                        
                        <button 
                            type="submit"
                            class="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-sky-600"
                        >
                            Daftar sebagai Relawan
                        </button>
                    </form>
                </div>
            </div>
        {/if}
    </div>
</section>

<Modal 
  bind:show={showModal}
  type={modalType}
  title={modalTitle}
  message={modalMessage}
/>
