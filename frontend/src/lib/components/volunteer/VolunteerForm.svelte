<script>
  import { formData, formErrors, isSubmitting, resetForm } from '$lib/stores/volunteerForm';
  import { volunteerCategories } from '$lib/data/volunteer';

  /**
   * @param {string} email
   */
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  /**
   * @param {string} phone
   */
  function validatePhone(phone) {
    const re = /^(\+62|62|0)[0-9]{9,12}$/;
    return re.test(phone.replace(/\s/g, ''));
  }

  async function handleSubmit() {
    // Reset errors
    $formErrors = {
      name: '',
      email: '',
      phone: '',
      category: ''
    };

    let hasError = false;

    // Validation
    if (!$formData.name.trim()) {
      $formErrors.name = 'Nama lengkap harus diisi';
      hasError = true;
    }

    if (!$formData.email.trim()) {
      $formErrors.email = 'Email harus diisi';
      hasError = true;
    } else if (!validateEmail($formData.email)) {
      $formErrors.email = 'Format email tidak valid';
      hasError = true;
    }

    if (!$formData.phone.trim()) {
      $formErrors.phone = 'Nomor WhatsApp harus diisi';
      hasError = true;
    } else if (!validatePhone($formData.phone)) {
      $formErrors.phone = 'Format nomor tidak valid';
      hasError = true;
    }

    if (!$formData.category) {
      $formErrors.category = 'Pilih kategori relawan';
      hasError = true;
    }

    if (hasError) return;

    // Submit
    $isSubmitting = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Terima kasih ${$formData.name}! Pendaftaran Anda telah diterima. Kami akan menghubungi Anda melalui email di ${$formData.email}`);
      
      resetForm();
    } catch (error) {
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      $isSubmitting = false;
    }
  }
</script>

<section class="w-full max-w-360 px-4 md:px-10 py-16 md:py-24 relative" id="volunteer-form">
  <div class="flex flex-col items-center text-center mb-16 relative z-10">
    <span class="px-5 py-2 rounded-full bg-orange-100 text-orange-400 text-sm font-bold mb-4">Mari Bergabung</span>
    <h2 class="text-sky-900 text-3xl md:text-5xl font-black leading-tight mb-4">Formulir Pendaftaran</h2>
    <p class="text-text-muted text-base max-w-xl font-medium">Isi data diri Anda di bawah ini. Sederhana dan cepat.</p>
  </div>

  <div class="w-full max-w-3xl mx-auto bg-white border-2 border-sky-100 rounded-[3rem] p-8 md:p-14 shadow-2xl shadow-sky-100/50 relative">
    <div class="absolute -top-6 -right-6 w-20 h-20 bg-primary/20 rounded-full blur-xl -z-10"></div>
    <div class="absolute -bottom-6 -left-6 w-24 h-24 bg-secondary/20 rounded-full blur-xl -z-10"></div>

    <form on:submit|preventDefault={handleSubmit} class="grid grid-cols-1 gap-8">
      <!-- Name Field -->
      <div class="flex flex-col gap-2">
        <label class="text-sky-900 text-sm font-bold ml-4" for="name">Nama Lengkap</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-sky-400 group-focus-within:text-primary transition-colors">
            <span class="material-symbols-outlined text-[24px]">person</span>
          </div>
          <input 
            bind:value={$formData.name}
            class="w-full h-16 rounded-3xlky-50/50 border-2 border-sky-100 rounded-3xl text-sky-900 pl-14 pr-6 focus:ring-4 focus:ring-primary/20 focus:border-primary placeholder-sky-300 font-semibold transition-all" 
            id="name" 
            placeholder="Masukkan nama lengkap Anda" 
            type="text"
            class:border-red-500={$formErrors.name}
          />
        </div>
        {#if $formErrors.name}
          <span class="text-red-500 text-xs ml-4">{$formErrors.name}</span>
        {/if}
      </div>

      <!-- Email Field -->
      <div class="flex flex-col gap-2">
        <label class="text-sky-900 text-sm font-bold ml-4" for="email">Alamat Email</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-sky-400 group-focus-within:text-primary transition-colors">
            <span class="material-symbols-outlined text-[24px]">mail</span>
          </div>
          <input 
            bind:value={$formData.email}
            class="w-full h-16 rounded-3xl bg-sky-50/50 border-2 border-sky-100 text-sky-900 pl-14 pr-6 focus:ring-4 focus:ring-primary/20 focus:border-primary placeholder-sky-300 font-semibold transition-all" 
            id="email" 
            placeholder="nama@email.com" 
            type="email"
            class:border-red-500={$formErrors.email}
          />
        </div>
        {#if $formErrors.email}
          <span class="text-red-500 text-xs ml-4">{$formErrors.email}</span>
        {/if}
      </div>

      <!-- Phone Field -->
      <div class="flex flex-col gap-2">
        <label class="text-sky-900 text-sm font-bold ml-4" for="phone">Nomor WhatsApp</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-sky-400 group-focus-within:text-primary transition-colors">
            <span class="material-symbols-outlined text-[24px]">call</span>
          </div>
          <input 
            bind:value={$formData.phone}
            class="w-full h-16 rounded-3xl bg-sky-50/50 border-2 border-sky-100 text-sky-900 pl-14 pr-6 focus:ring-4 focus:ring-primary/20 focus:border-primary placeholder-sky-300 font-semibold transition-all" 
            id="phone" 
            placeholder="+62 812 3456 7890" 
            type="tel"
            class:border-red-500={$formErrors.phone}
          />
        </div>
        {#if $formErrors.phone}
          <span class="text-red-500 text-xs ml-4">{$formErrors.phone}</span>
        {/if}
      </div>

      <!-- Category Field -->
      <div class="flex flex-col gap-2">
        <label class="text-sky-900 text-sm font-bold ml-4" for="category">Kategori Relawan</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-sky-400 group-focus-within:text-primary transition-colors z-10">
            <span class="material-symbols-outlined text-[24px]">category</span>
          </div>
          <select 
            bind:value={$formData.category}
            class="w-full h-16 rounded-3xl bg-sky-50/50 border-2 border-sky-100 text-sky-900 pl-14 pr-12 focus:ring-4 focus:ring-primary/20 focus:border-primary hover:border-primary/50 font-semibold transition-all appearance-none cursor-pointer relative z-0"
            class:text-sky-400={!$formData.category}
            class:border-red-500={$formErrors.category}
            id="category"
          >
            {#each volunteerCategories as category}
              <option value={category.value} disabled={category.disabled} class="text-sky-900 font-semibold py-3">{category.label}</option>
            {/each}
          </select>
          <div class="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none text-sky-400 group-focus-within:text-primary transition-colors z-10">
            <span class="material-symbols-outlined group-focus-within:rotate-180 transition-transform duration-300">expand_more</span>
          </div>
        </div>
        {#if $formErrors.category}
          <span class="text-red-500 text-xs ml-4">{$formErrors.category}</span>
        {/if}
      </div>

      <!-- Submit Button -->
      <div class="pt-6">
        <button 
          type="submit"
          disabled={$isSubmitting}
          class="w-full h-16 bg-orange-400 hover:bg-orange-600 text-white text-xl font-black rounded-2xl transition-all shadow-[0_10px_25px_-5px_rgba(255,140,0,0.4)] hover:shadow-[0_20px_35px_-10px_rgba(255,140,0,0.6)] hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if $isSubmitting}
            <span class="material-symbols-outlined animate-spin">refresh</span>
            Mengirim...
          {:else}
            Gabung Sekarang
            <span class="material-symbols-outlined font-bold">arrow_forward</span>
          {/if}
        </button>
        
        <p class="text-center text-sky-400 text-xs mt-6 font-medium">
          <span class="material-symbols-outlined align-middle text-base mr-1">check_circle</span>
          Konfirmasi pendaftaran akan dikirimkan ke email Anda segera setelah submit.
        </p>
      </div>
    </form>
  </div>
</section>
