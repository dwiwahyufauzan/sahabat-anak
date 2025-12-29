<script lang="ts">
  import Icon from './Icons.svelte';
  
  export let show = false;
  export let type: 'success' | 'error' | 'warning' | 'confirm' | 'info' = 'info';
  export let title = '';
  export let message = '';
  export let confirmText = 'OK';
  export let cancelText = 'Batal';
  export let onConfirm: (() => void) | null = null;
  export let onCancel: (() => void) | null = null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    show = false;
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    show = false;
  };

  const getIconConfig = () => {
    switch (type) {
      case 'success':
        return { name: 'check', bgColor: 'bg-green-100', iconColor: 'text-green-600', buttonColor: 'bg-green-600 hover:bg-green-700' };
      case 'error':
        return { name: 'close', bgColor: 'bg-red-100', iconColor: 'text-red-600', buttonColor: 'bg-red-600 hover:bg-red-700' };
      case 'warning':
        return { name: 'alert-triangle', bgColor: 'bg-orange-100', iconColor: 'text-orange-600', buttonColor: 'bg-orange-600 hover:bg-orange-700' };
      case 'confirm':
        return { name: 'help-circle', bgColor: 'bg-blue-100', iconColor: 'text-blue-600', buttonColor: 'bg-blue-600 hover:bg-blue-700' };
      default:
        return { name: 'info', bgColor: 'bg-blue-100', iconColor: 'text-blue-600', buttonColor: 'bg-blue-600 hover:bg-blue-700' };
    }
  };

  $: iconConfig = getIconConfig();
</script>

{#if show}
  <div class="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all animate-scale-in">
      <!-- Icon -->
      <div class="flex justify-center mb-4">
        <div class="w-16 h-16 {iconConfig.bgColor} rounded-full flex items-center justify-center">
          <Icon name={iconConfig.name} className="w-8 h-8 {iconConfig.iconColor}" />
        </div>
      </div>

      <!-- Title -->
      {#if title}
        <h3 class="text-xl font-bold text-gray-900 text-center mb-2">
          {title}
        </h3>
      {/if}

      <!-- Message -->
      <p class="text-gray-600 text-center mb-6 whitespace-pre-line">
        {message}
      </p>

      <!-- Buttons -->
      {#if type === 'confirm'}
        <div class="flex gap-3">
          <button
            on:click={handleCancel}
            class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
          >
            {cancelText}
          </button>
          <button
            on:click={handleConfirm}
            class="flex-1 px-4 py-3 {iconConfig.buttonColor} text-white rounded-xl font-semibold transition-colors"
          >
            {confirmText}
          </button>
        </div>
      {:else}
        <button
          on:click={handleConfirm}
          class="w-full px-4 py-3 {iconConfig.buttonColor} text-white rounded-xl font-semibold transition-colors"
        >
          {confirmText}
        </button>
      {/if}
    </div>
  </div>
{/if}

<style>
  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-scale-in {
    animation: scale-in 0.2s ease-out;
  }
</style>
