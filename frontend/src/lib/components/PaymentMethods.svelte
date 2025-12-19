<script>
  import { selectedMethod } from '$lib/stores/donation';
  import QRCode from 'qrcode';

  const paymentMethods = [
    { id: 'gopay', name: 'GoPay', icon: 'account_balance_wallet', color: 'text-blue-600', accountName: 'Yayasan Sahabat Anak', accountNumber: '081234567890', description: 'Pembayaran melalui GoPay.' },
    { id: 'ovo', name: 'OVO', icon: 'account_balance_wallet', color: 'text-purple-600', accountName: 'Yayasan Sahabat Anak', accountNumber: '081234567891', description: 'Pembayaran melalui OVO.' },
    { id: 'dana', name: 'Dana', icon: 'account_balance_wallet', color: 'text-blue-400', accountName: 'Yayasan Sahabat Anak', accountNumber: '081234567892', description: 'Pembayaran melalui Dana.' },
    { id: 'bank', name: 'Transfer Bank', icon: 'account_balance', color: 'text-emerald-600', accountName: 'Yayasan Sahabat Anak', accountNumber: '1234567890', description: 'Transfer langsung ke rekening bank.' },
    { id: 'credit', name: 'Kartu Kredit', icon: 'credit_card', color: 'text-orange-600', accountName: 'Yayasan Sahabat Anak', accountNumber: '1122334455', description: 'Pembayaran menggunakan kartu kredit.' },
    { id: 'qris', name: 'QRIS', icon: 'qr_code_2', color: 'text-gray-600', accountName: 'Yayasan Sahabat Anak', accountNumber: '9876543210', description: 'Pembayaran menggunakan QRIS.' }
  ];

  let qrisCode = '';

  // Fungsi untuk menghasilkan QR Code
  $: if ($selectedMethod === 'qris') {
    const qrisData = 'https://example.com/qris-payment'; // Ganti dengan data QRIS sebenarnya
    QRCode.toDataURL(qrisData, { width: 200 }, (err, url) => {
      if (!err) {
        qrisCode = url;
      }
    });
  }
</script>

<div class="mb-10">
  <h3 class="text-xl font-bold mb-4 flex items-center gap-2 text-[#181411] dark:text-white">
    <span class="material-symbols-outlined text-primary">
      account_balance_wallet
    </span>
    Metode Pembayaran
  </h3>

  <!-- Daftar Metode Pembayaran -->
  <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
    {#each paymentMethods as method (method.id)}
      <label class="relative cursor-pointer">
        <input
          type="radio"
          name="payment"
          value={method.id}
          bind:group={$selectedMethod}
          class="sr-only"
          aria-label={method.name}
        />

        <div
          class="
            h-full p-4 rounded-xl border-2
            flex flex-col items-center justify-center gap-2 text-center
            transition-all
          "
          class:border-primary={$selectedMethod === method.id}
          class:bg-primary-light={$selectedMethod === method.id}
          class:border-gray-200={$selectedMethod !== method.id}
          class:bg-white={$selectedMethod !== method.id}
          class:hover:border-primary={$selectedMethod !== method.id}
          class:hover:shadow-md={$selectedMethod !== method.id}
        >
          <span class={`material-symbols-outlined text-3xl ${method.color}`}>
            {method.icon}
          </span>

          <span class="text-sm font-bold text-gray-800 dark:text-gray-200">
            {method.name}
          </span>

          {#if $selectedMethod === method.id}
            <div class="absolute top-2 right-2 text-primary">
              <span class="material-symbols-outlined text-lg">
                check_circle
              </span>
            </div>
          {/if}
        </div>
      </label>
    {/each}
  </div>

  <!-- Detail Metode Pembayaran -->
  {#if $selectedMethod}
    {#each paymentMethods as method (method.id)}
      {#if $selectedMethod === method.id}
        <div class="mt-6 p-6 rounded-xl bg-gray-400 shadow-lg">
          <h4 class="text-lg font-bold text-white flex items-center gap-4">
            <!-- Logo dengan latar belakang -->
            <div class="w-12 h-12 flex items-center justify-center rounded-full bg-white">
              <span class={`material-symbols-outlined text-3xl ${method.color}`}>
                {method.icon}
              </span>
            </div>
            Detail Pembayaran
          </h4>
          <div class="mt-4 space-y-4">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-white bg-primary/20 p-2 rounded-full">
                info
              </span>
              <p class="text-sm text-white">
                <strong>Keterangan:</strong> {method.description}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-white bg-primary/20 p-2 rounded-full">
                person
              </span>
              <p class="text-sm text-white">
                <strong>Nama Rekening:</strong> {method.accountName}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-white bg-primary/20 p-2 rounded-full">
                credit_card
              </span>
              <p class="text-sm text-white">
                <strong>Nomor Rekening:</strong> {method.accountNumber}
              </p>
            </div>

            <!-- Tampilkan QRIS jika metode pembayaran adalah QRIS -->
            {#if method.id === 'qris'}
              <div class="mt-4 text-center">
                <p class="text-sm text-white mb-2">
                  <strong>Scan QRIS:</strong>
                </p>
                {#if qrisCode}
                  <img src={qrisCode} alt="Kode QRIS" class="w-40 h-40 mx-auto rounded-lg shadow-md" />
                {:else}
                  <p class="text-sm text-gray-300">Memuat QRIS...</p>
                {/if}
              </div>
            {/if}
          </div>
        </div>
      {/if}
    {/each}
  {/if}
</div>