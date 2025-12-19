<script>
    import { donorInfo } from '$lib/stores/donation';
</script>

<div class="mb-10">
    <h3 class="text-xl font-bold mb-4 flex items-center gap-2 text-[#181411] dark:text-white">
        <span class="material-symbols-outlined text-primary fill-1">person</span>
        Data Donatur
    </h3>
    
    <div class="space-y-4">
        <div class="relative">
            <span class="absolute left-4 top-3.5 text-gray-400 material-symbols-outlined">face</span>
            <input 
                type="text" 
                bind:value={$donorInfo.name}
                disabled={$donorInfo.isAnonymous}
                class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white disabled:opacity-50" 
                placeholder="Nama Lengkap (Opsional)" />
        </div>
        
        <div class="relative">
            <span class="absolute left-4 top-3.5 text-gray-400 material-symbols-outlined">mail</span>
            <input 
                type="email" 
                bind:value={$donorInfo.email}
                class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
                placeholder="Email (Untuk bukti donasi)" />
        </div>
        
        <div class="flex items-start gap-3 mt-2 pl-1">
            <div class="flex items-center h-5">
                <input 
                    type="checkbox" 
                    id="anon"
                    bind:checked={$donorInfo.isAnonymous}
                    class="w-5 h-5 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary/30 text-primary transition-all cursor-pointer" />
            </div>
            <label for="anon" class="text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                Sembunyikan nama saya (Hamba Allah)
            </label>
        </div>
    </div>
</div>
