<script lang="ts">
  export let title = "Coming Soon";
  export let message = "Fitur ini akan segera hadir!";
  export let showIcon = true;
</script>

<div class="flex flex-col items-center justify-center py-20 px-4 bg-linear-to-br from-blue-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border-2 border-dashed border-blue-200 dark:border-slate-700">
  {#if showIcon}
    <div class="relative mb-6">
      <div class="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
      <div class="relative w-24 h-24 bg-linear-to-br from-blue-400 to-orange-400 rounded-full flex items-center justify-center">
        <span class="material-symbols-outlined text-white text-5xl">schedule</span>
      </div>
    </div>
  {/if}
  
  <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-3 text-center">
    {title}
  </h3>
  
  <p class="text-slate-600 dark:text-slate-400 text-center max-w-md mb-6">
    {message}
  </p>
  
  <div class="flex gap-2">
    <div class="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0s;"></div>
    <div class="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
    <div class="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
  </div>
</div>

<style>
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  .animate-bounce {
    animation: bounce 1.5s ease-in-out infinite;
  }
</style>
