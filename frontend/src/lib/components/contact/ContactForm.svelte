<script>
    let formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
    };
    
    let isSubmitting = false;
    
    async function handleSubmit() {
        isSubmitting = true;
        
        // Simulasi pengiriman form
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log('Form submitted:', formData);
        alert('Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.');
        
        // Reset form
        formData = { name: '', email: '', subject: '', message: '' };
        isSubmitting = false;
    }
</script>

<div class="flex-1 bg-white dark:bg-[#2a221b] rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 md:p-10 transition-colors duration-300">
    <div class="mb-8">
        <span class="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-400 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
            Tulis Pesan
        </span>
        <h2 class="text-[#181411] dark:text-white text-3xl font-extrabold mb-2">Kirim Pesan</h2>
        <p class="text-gray-500 dark:text-gray-400">
            Silakan isi formulir di bawah ini, tim kami akan segera membalas pesan Anda.
        </p>
    </div>
    
    <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nama Lengkap -->
            <label class="flex flex-col gap-2">
                <span class="text-gray-900 font-bold text-sm ml-1">Nama Lengkap</span>
                <div class="relative group">
                    <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                        person
                    </span>
                    <input 
                        bind:value={formData.name}
                        class="w-full pl-12 pr-4 h-14 bg-gray-200 border-2 border-transparent focus:border-gray-200 rounded-xl text-base outline-none transition-all placeholder:text-gray-400 font-medium" 
                        placeholder="Nama Anda" 
                        type="text"
                        required />
                </div>
            </label>
            
            <!-- Email -->
            <label class="flex flex-col gap-2">
                <span class="text-[#181411] dark:text-gray-200 font-bold text-sm ml-1">Email</span>
                <div class="relative group">
                    <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                        mail
                    </span>
                    <input 
                        bind:value={formData.email}
                        class="w-full pl-12 pr-4 h-14 bg-gray-200 border-2 border-transparent focus:border-gray-200 rounded-xl text-base outline-none transition-all placeholder:text-gray-400 font-medium" 
                        placeholder="contoh@email.com" 
                        type="email"
                        required />
                </div>
            </label>
        </div>
        
        <!-- Subjek -->
        <label class="flex flex-col gap-2">
            <span class="text-[#181411] dark:text-gray-200 font-bold text-sm ml-1">Subjek</span>
            <div class="relative group">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    chat_bubble
                </span>
                <input 
                    bind:value={formData.subject}
                    class="w-full pl-12 pr-4 h-14 bg-gray-200 border-2 border-transparent focus:border-gray-200 rounded-xl text-base outline-none transition-all placeholder:text-gray-400 font-medium" 
                    placeholder="Tentang donasi, kerjasama, dll." 
                    type="text"
                    required />
            </div>
        </label>
        
        <!-- Pesan -->
        <label class="flex flex-col gap-2">
            <span class="text-[#181411] dark:text-gray-200 font-bold text-sm ml-1">Pesan</span>
            <div class="relative group">
                <span class="material-symbols-outlined absolute left-4 top-6 text-gray-400 group-focus-within:text-primary transition-colors">
                    edit
                </span>
                <textarea 
                    bind:value={formData.message}
                    class="w-full pl-12 pr-4 py-4 min-h-40 bg-gray-200 border-2 border-transparent focus:border-gray-200 rounded-xl text-base outline-none transition-all placeholder:text-gray-400 font-medium" 
                    placeholder="Tuliskan pesan Anda di sini..."
                    required></textarea>
            </div>
        </label>
        
        <!-- Submit Button -->
        <button 
            type="submit"
            disabled={isSubmitting}
            class="mt-2 flex items-center justify-center gap-2 h-14 w-full md:w-auto md:self-start md:px-10 bg-orange-400 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            <span>{isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}</span>
            {#if !isSubmitting}
                <span class="material-symbols-outlined text-[20px]">send</span>
            {/if}
        </button>
    </form>
</div>
