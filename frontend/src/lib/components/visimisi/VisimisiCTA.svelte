<script lang="ts">
    import { base } from '$app/paths';
    import Modal from '$lib/components/shared/Modal.svelte';
    
    let donationAmount = $state(50000);
    let volunteerData = $state({
        name: '',
        email: '',
        phone: ''
    });
    
    let showDonationModal = $state(false);
    let showVolunteerModal = $state(false);
    let isSubmitting = $state(false);
    
    // Modal states
    let showModal = $state(false);
    let modalType: 'success' | 'error' | 'warning' | 'info' | undefined = $state('success');
    let modalTitle = $state('');
    let modalMessage = $state('');
    
    const donationAmounts = [25000, 50000, 100000, 250000, 500000];
    
    async function handleDonation() {
        isSubmitting = true;
        try {
            // Simulasi API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Processing donation:', donationAmount);
            showDonationModal = false;
            donationAmount = 50000;
        } finally {
            isSubmitting = false;
        }
    }
    
    async function handleVolunteerSubmit() {
        isSubmitting = true;
        try {
            // Simulasi API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Volunteer data:', volunteerData);
            showVolunteerModal = false;
            volunteerData = { name: '', email: '', phone: '' };
            modalType = 'success';
            modalTitle = 'Pendaftaran Berhasil!';
            modalMessage = 'Pendaftaran relawan berhasil! Kami akan menghubungi Anda.';
            showModal = true;
        } finally {
            isSubmitting = false;
        }
    }
</script>

<section class="w-full py-20 bg-background-off dark:bg-background-dark flex justify-center">
    <div class="layout-container px-4 md:px-10 max-w-240 w-full">
        <div class="bg-white dark:bg-gray-800 rounded-[3rem] p-10 md:p-16 text-center shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden group animate-slide-up">
            <!-- Background decoration -->
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-orange-600/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
            <div class="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-orange-600/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
            
            <h2 class="relative z-10 text-3xl md:text-4xl font-black text-text-main dark:text-white mb-6">
                Jadilah Bagian dari Perubahan
            </h2>
            
            <p class="relative z-10 text-lg text-text-sub dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                Visi kami tidak bisa terwujud tanpa bantuan Anda. Mari bergandeng tangan untuk masa depan anak Indonesia yang lebih cerah.
            </p>
            
            <div class="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                    href="{base}/donasi"
                    class="flex min-w-45 h-14 items-center justify-center rounded-full bg-orange-400 hover:bg-orange-600 text-white text-lg font-bold shadow-lg shadow-orange-500/25 transition-all transform hover:scale-105 active:scale-95"
                >
                    Donasi Sekarang
                </a>
                
                <a 
                    href="{base}/relawan"
                    class="flex min-w-45 h-14 items-center justify-center rounded-full bg-white border-2 border-gray-900 text-gray-900 font-bold hover:border-orange-400 hover:text-orange-400 transition-colors"
                >
                    Daftar Relawan
                </a>
            </div>
        </div>
    </div>
</section>

<Modal 
  bind:show={showModal}
  type={modalType}
  title={modalTitle}
  message={modalMessage}
/>
