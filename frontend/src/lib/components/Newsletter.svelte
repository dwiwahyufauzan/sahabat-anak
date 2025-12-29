<script lang="ts">
  import { onMount } from 'svelte';
  import Modal from '$lib/components/shared/Modal.svelte';
  
  let email = '';
  let visible = false;
  
  // Modal states
  let showModal = false;
  let modalType: 'success' | 'error' | 'warning' | 'info' = 'success';
  let modalTitle = '';
  let modalMessage = '';
  
  function handleSubscribe() {
    if (email) {
      modalType = 'success';
      modalTitle = 'Berhasil Berlangganan!';
      modalMessage = `Terima kasih! Email ${email} telah terdaftar untuk newsletter kami.`;
      showModal = true;
      email = '';
    }
  }
  
  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          visible = true;
        }
      });
    }, { threshold: 0.2 });
    
    const section = document.querySelector('#newsletter-section');
    if (section) observer.observe(section);
    
    return () => observer.disconnect();
  });
</script>

<section id="newsletter-section" class="bg-[#111518] rounded-3xl p-8 md:p-16 text-center mb-12 relative overflow-hidden {visible ? 'animate-zoom-in' : 'opacity-0'}">
  <!-- Decorative circles -->
  <div class="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
  <div class="absolute bottom-0 right-0 w-40 h-40 bg-accent-orange/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

  <div class="relative z-10 max-w-2xl mx-auto">
    <div class="inline-block bg-white/10 backdrop-blur-sm rounded-full p-3 mb-6 {visible ? 'animate-bounce-slow' : ''}">
      <span class="material-symbols-outlined text-white text-[32px] block">mail</span>
    </div>

    <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Jangan Lewatkan Kabar Baik</h2>
    
    <p class="text-gray-400 mb-8 text-lg">
      Dapatkan cerita inspiratif dan info kegiatan terbaru langsung di inbox emailmu.
    </p>

    <form on:submit|preventDefault={handleSubscribe} class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input 
        bind:value={email}
        class="flex-1 rounded-xl border-none bg-white/10 text-white placeholder:text-gray-500 px-5 py-3 focus:ring-2 focus:ring-primary" 
        placeholder="Masukkan alamat email kamu" 
        type="email"
        required
      />
      <button 
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30"
      >
        Langganan
      </button>
    </form>
  </div>
</section>

<Modal 
  bind:show={showModal}
  type={modalType}
  title={modalTitle}
  message={modalMessage}
/>
