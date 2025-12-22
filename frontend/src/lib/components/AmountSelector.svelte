<script>
  import { selectedAmount, customAmount } from '$lib/stores/donation';
  import { formatCurrency } from '$lib/utils/formatter';

  const presetAmounts = [
    { label: 'Paket Sekolah', amount: 50000 },
    { label: 'Paket Sehat', amount: 100000 },
    { label: 'Paket Gizi', amount: 250000 },
    { label: 'Sangat Membantu', amount: 500000 },
    { label: 'Orang Tua Asuh', amount: 1000000 }
  ];

  /**
   * @param {number} amount
   */
  function selectAmount(amount) {
    selectedAmount.set(amount);
    customAmount.set('');
  }

  /**
   * @param {Event & { currentTarget: EventTarget & HTMLInputElement }} e
   */
  function handleCustomInput(e) {
    const value = e.currentTarget.value;
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue) {
      customAmount.set(numericValue);
      selectedAmount.set(0); // Reset preset selection
    } else {
      customAmount.set('');
    }
  }

  /**
   * Format input value for display
   * @param {Event & { currentTarget: EventTarget & HTMLInputElement }} e
   */
  function handleCustomBlur(e) {
    const value = $customAmount;
    if (value && Number(value) > 0) {
      // Format the number
      customAmount.set(Number(value).toString());
    }
  }

  $: isCustomActive = $customAmount && Number($customAmount) > 0;
</script>

<div class="mb-10 animate-fade-in-up">
  <h3 class="text-xl font-bold mb-4 flex items-center gap-2 text-[#181411] dark:text-white">
    <span class="material-symbols-outlined text-primary">savings</span>
    Pilih Nominal Donasi
  </h3>

  <!-- Preset -->
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
    {#each presetAmounts as preset, i (preset.amount)}
      <button
        type="button"
        onclick={() => selectAmount(preset.amount)}
        class="
          group relative h-24 px-4 py-4 rounded-2xl border-2
          flex flex-col justify-between text-left font-bold
          transition-all
        "
        class:border-primary={$selectedAmount === preset.amount && !isCustomActive}
        class:bg-blue-600={$selectedAmount === preset.amount && !isCustomActive}
        class:text-white={$selectedAmount === preset.amount && !isCustomActive}
        class:border-gray-200={$selectedAmount !== preset.amount || isCustomActive}
        class:bg-white={$selectedAmount !== preset.amount || isCustomActive}
        class:text-gray-600={$selectedAmount !== preset.amount || isCustomActive}
        class:hover:border-gray-600={$selectedAmount !== preset.amount && !isCustomActive}
        class:hover:bg-gray-200={$selectedAmount !== preset.amount && !isCustomActive}
        class:sm:col-span-2={i === presetAmounts.length - 1}
      >
        <span class="text-xs font-normal opacity-70">
          {preset.label}
        </span>

        <span class="text-lg">
          {formatCurrency(preset.amount)}
        </span>

        {#if $selectedAmount === preset.amount && !isCustomActive}
          <span class="absolute top-2 right-2 text-white">
            <span class="material-symbols-outlined text-xl">
              check_circle
            </span>
          </span>
        {/if}
      </button>
    {/each}
  </div>

  <!-- Custom Amount -->
  <div class="relative group">
    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <span class="text-gray-500 font-bold text-lg">Rp</span>
    </div>

    <input
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      bind:value={$customAmount}
      oninput={handleCustomInput}
      onblur={handleCustomBlur}
      placeholder="Masukkan nominal lainnya..."
      class="
        w-full pl-12 pr-4 py-4 rounded-2xl
        border-2 border-gray-200 bg-white
        text-lg font-bold text-gray-800
        transition-all outline-none
        focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10
        placeholder:text-gray-400 placeholder:font-normal
        dark:bg-gray-800 dark:border-gray-700 dark:text-white
      "
      class:border-primary={isCustomActive}
      class:bg-gray-900={isCustomActive}
    />
    
    {#if isCustomActive}
      <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
        <span class="material-symbols-outlined text-primary text-xl">
          check_circle
        </span>
      </div>
    {/if}
  </div>
  
  {#if isCustomActive}
    <div class="mt-2 text-sm text-gray-600 dark:text-gray-400">
      Jumlah: <span class="font-bold text-primary">{formatCurrency(Number($customAmount))}</span>
    </div>
  {/if}
</div>