<script>
    const contactItems = [
        {
            icon: 'mail',
            label: 'Email Kami',
            value: 'halo@sahabatanak.org',
            href: 'mailto:halo@sahabatanak.org',
            type: 'link'
        },
        {
            icon: 'call',
            label: 'Telepon',
            value: '+62 21 1234 5678',
            href: 'tel:+622112345678',
            type: 'link'
        },
        {
            icon: 'location_on',
            label: 'Alamat Kantor',
            value: 'Jalan Sahabat No. 10,\nSubang, Indonesia',
            type: 'text'
        }
    ];
    
    const socialMedia = [
        { name: 'IG', label: 'Instagram', href: '#', icon: 'photo_camera' },
        { name: 'FB', label: 'Facebook', href: '#', icon: 'thumb_up' },
        { name: 'TW', label: 'Twitter', href: '#', icon: 'chat' },
        { name: 'YT', label: 'YouTube', href: '#', icon: 'play_circle' }
    ];
</script>

<div class="bg-white dark:bg-[#2a221b] rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-8 flex flex-col gap-8 transition-colors duration-300">
    <div>
        <h3 class="text-[#181411] dark:text-white text-xl font-bold mb-6">Informasi Kontak</h3>
        <div class="flex flex-col gap-6">
            {#each contactItems as item}
                <div class="flex items-start gap-4">
                    <div class="size-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0 text-primary">
                        <span class="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <div>
                        <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                            {item.label}
                        </p>
                        {#if item.type === 'link'}
                            <a href={item.href} class="text-[#181411] dark:text-white font-bold hover:text-primary transition-colors">
                                {item.value}
                            </a>
                        {:else}
                            <p class="text-[#181411] dark:text-white font-medium leading-snug whitespace-pre-line">
                                {item.value}
                            </p>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </div>
    
    <!-- Social Media -->
    <div class="pt-6 border-t border-gray-100 dark:border-gray-800">
        <p class="text-sm font-bold text-[#181411] dark:text-white mb-4">Ikuti Keseruan Kami</p>
        <div class="flex gap-3">
            {#each socialMedia as social}
                <a 
                    href={social.href}
                    aria-label={social.label}
                    class="size-10 rounded-full bg-background-light dark:bg-[#3a2e25] flex items-center justify-center text-[#181411] dark:text-white hover:bg-primary hover:text-white transition-all duration-300">
                    <span class="material-symbols-outlined text-lg">{social.icon}</span>
                </a>
            {/each}
        </div>
    </div>
</div>
