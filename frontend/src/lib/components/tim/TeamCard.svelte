<script>
    let { member, index, type = 'leadership' } = $props();
    
    let isHovered = $state(false);
    let isVisible = $state(false);
    
    $effect(() => {
        setTimeout(() => {
            isVisible = true;
        }, index * 150);
    });
</script>

<div 
    class="group bg-card-light dark:bg-card-dark rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-gray-400/10 transition-all duration-500 flex flex-col items-center text-center cursor-pointer {isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}"
    style="transition-delay: {index * 0.1}s;"
    onmouseenter={() => isHovered = true}
    onmouseleave={() => isHovered = false}
    onclick={() => console.log('View full profile:', member.name)}
    onkeydown={(e) => e.key === 'Enter' && console.log('View full profile:', member.name)}
    tabindex="0"
    role="button"
>
    <!-- Avatar -->
    <div class="relative mb-6">
        <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-background-light dark:border-slate-700 shadow-md group-hover:border-blue-400 transition-colors duration-300">
            <img 
                alt={member.alt}
                class="w-full h-full object-cover transition-transform duration-500 {isHovered ? 'scale-110' : 'scale-100'}"
                src={member.photo}
            />
        </div>
        
        <!-- Verified badge for leadership -->
        {#if type === 'leadership' && member.verified}
            <div class="absolute bottom-0 right-0 bg-blue-400 text-white p-1.5 rounded-full shadow-lg">
                <span class="material-symbols-outlined text-[18px] block">verified</span>
            </div>
        {/if}
        
        <!-- Hover overlay -->
        <div class="absolute inset-0 rounded-full bg-blue-400/0 group-hover:bg-blue-400/10 transition-colors duration-300"></div>
    </div>
    
    <!-- Name & Position -->
    <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-400 transition-colors">
        {member.name}
    </h3>
    
    <p class="text-blue-400 font-semibold text-sm mb-4">
        {member.position}
    </p>
    
    <!-- Quote -->
    <p class="text-slate-500 dark:text-slate-400 text-sm italic leading-relaxed mb-6">
        "{member.quote}"
    </p>
</div>


