<script lang="ts">
  export let show = false;
  export let type: 'success' | 'error' | 'warning' | 'info' = 'success';
  export let title = '';
  export let message = '';
  export let confirmText = 'OK';
  export let cancelText = 'Batal';
  export let onConfirm: (() => void) | null = null;
  export let onCancel: (() => void) | null = null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    show = false;
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    show = false;
  };

  const handleBackdropClick = () => {
    if (!onConfirm) {
      show = false;
    }
  };

  const handleKeydown = (e: { key: string; }) => {
    if (e.key === 'Escape') {
      if (!onConfirm) {
        show = false;
      } else if (onCancel) {
        handleCancel();
      }
    }
  };

  const icons = {
    success: `
      <svg class="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
    `,
    error: `
      <svg class="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    `,
    warning: `
      <svg class="w-16 h-16 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
    `,
    info: `
      <svg class="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    `
  };

  const bgColors = {
    success: 'bg-green-100',
    error: 'bg-red-100',
    warning: 'bg-orange-100',
    info: 'bg-blue-100'
  };

  const buttonColors = {
    success: 'bg-green-600 hover:bg-green-700',
    error: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-orange-600 hover:bg-orange-700',
    info: 'bg-blue-600 hover:bg-blue-700'
  };

  $: currentIcon = icons[type] || icons.success;
  $: currentBgColor = bgColors[type] || bgColors.success;
  $: currentButtonColor = buttonColors[type] || buttonColors.success;
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
  <div 
    class="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4 animate-fade-in"
    on:click={handleBackdropClick}
    on:keydown={(e) => e.key === 'Escape' && handleBackdropClick()}
    role="button"
    tabindex="0"
  >
    <div 
      class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all animate-scale-in"
      on:click|stopPropagation
      on:keydown|stopPropagation
      role="dialog"
      tabindex="-1"
    >
      <!-- Icon -->
      <div class="flex justify-center mb-4">
        <div class="w-20 h-20 {currentBgColor} rounded-full flex items-center justify-center">
          {@html currentIcon}
        </div>
      </div>

      <!-- Title -->
      <h3 class="text-2xl font-bold text-gray-900 text-center mb-2">
        {title}
      </h3>

      <!-- Message -->
      <p class="text-gray-600 text-center mb-6 whitespace-pre-line">
        {message}
      </p>

      <!-- Buttons -->
      {#if onConfirm}
        <div class="flex gap-3">
          <button
            on:click={handleCancel}
            class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
          >
            {cancelText}
          </button>
          <button
            on:click={handleConfirm}
            class="flex-1 px-4 py-3 {currentButtonColor} text-white rounded-xl font-semibold transition-colors"
          >
            {confirmText}
          </button>
        </div>
      {:else}
        <button
          on:click={() => show = false}
          class="w-full px-4 py-3 {currentButtonColor} text-white rounded-xl font-semibold transition-colors"
        >
          {confirmText}
        </button>
      {/if}
    </div>
  </div>
{/if}

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes scale-in {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  .animate-fade-in {
    animation: fade-in 0.2s ease-out;
  }

  .animate-scale-in {
    animation: scale-in 0.3s ease-out;
  }
</style>
