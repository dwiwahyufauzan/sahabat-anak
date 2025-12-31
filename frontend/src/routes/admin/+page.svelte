<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/utils/adminApi';
  import { fade, fly, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import Icon from '$lib/components/admin/Icons.svelte';

  // Data Statistik
  let stats = {
    totalDonations: 0,
    totalAmount: 0,
    totalVolunteers: 0,
    totalContacts: 0,
    totalPrograms: 0,
    totalNews: 0,
    totalEvents: 0,
    upcomingEvents: 0
  };

  let recentDonations: any[] = [];
  let recentVolunteers: any[] = [];
  let loading = true;
  let error = '';
  let chartCanvas: HTMLCanvasElement;
  let chartInstance: any = null;

  // Data grafik donasi tahunan
  let yearlyDonationData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
    amounts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    counts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  };

  onMount(async () => {
    await loadData();
  });

  const loadData = async () => {
    loading = true;
    error = '';
    try {
      const [donations, volunteers, programs, news, contacts, events] = await Promise.all([
        adminApi.donations.getAll(),
        adminApi.volunteers.getAll(),
        adminApi.programs.getAll(),
        adminApi.news.getAll(),
        adminApi.contacts.getAll(),
        fetch('http://localhost:3000/api/admin/events', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        }).then(res => res.json()).catch(() => [])
      ]);
      
      // Filter hanya donasi yang sudah dikonfirmasi (completed/verified)
      const confirmedDonations = donations.filter((d: any) => 
        d.paymentStatus === 'completed' || d.paymentStatus === 'verified'
      );
      
      // Filter hanya relawan yang sudah disetujui (approved)
      const approvedVolunteers = volunteers.filter((v: any) => 
        v.status === 'approved'
      );
      
      stats = {
        totalDonations: confirmedDonations.length,
        totalAmount: confirmedDonations.reduce((sum: number, d: any) => sum + (parseInt(d.amount) || 0), 0),
        totalVolunteers: approvedVolunteers.length,
        totalContacts: contacts.filter((c: any) => c.status === 'unread').length,
        totalPrograms: programs.length,
        totalNews: news.length,
        totalEvents: Array.isArray(events) ? events.length : 0,
        upcomingEvents: Array.isArray(events) ? events.filter((e: any) => e.status === 'upcoming').length : 0
      };
      recentDonations = donations.slice(0, 5);
      recentVolunteers = volunteers.slice(0, 5);
      
      // Process yearly donation data (hanya yang sudah dikonfirmasi)
      processYearlyDonationData(confirmedDonations);
      
      // Render chart after data is loaded
      setTimeout(() => renderChart(), 100);
    } catch (err) {
      console.error('Failed to load stats:', err);
      error = 'Gagal memuat data. Pastikan backend berjalan dan Anda sudah login.';
    } finally {
      loading = false;
    }
  };

  const processYearlyDonationData = (donations: any[]) => {
    const currentYear = new Date().getFullYear();
    const monthlyData = {
      amounts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      counts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };

    // Hanya proses donasi yang sudah dikonfirmasi (completed/verified)
    donations.forEach((donation: any) => {
      if (donation.createdAt && (donation.paymentStatus === 'completed' || donation.paymentStatus === 'verified')) {
        const date = new Date(donation.createdAt);
        if (date.getFullYear() === currentYear) {
          const month = date.getMonth(); // 0-11
          monthlyData.amounts[month] += parseInt(donation.amount) || 0;
          monthlyData.counts[month] += 1;
        }
      }
    });

    yearlyDonationData = {
      ...yearlyDonationData,
      amounts: monthlyData.amounts,
      counts: monthlyData.counts
    };
  };

  const renderChart = () => {
    if (!chartCanvas || typeof window === 'undefined' || !(window as any).Chart) return;

    // Destroy existing chart
    if (chartInstance) {
      chartInstance.destroy();
    }

    const ctx = chartCanvas.getContext('2d');
    if (!ctx) return;

    chartInstance = new (window as any).Chart(ctx, {
      type: 'bar',
      data: {
        labels: yearlyDonationData.labels,
        datasets: [
          {
            label: 'Jumlah Donasi (Rp)',
            data: yearlyDonationData.amounts,
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
            borderRadius: 8,
            yAxisID: 'y'
          },
          {
            label: 'Jumlah Transaksi',
            data: yearlyDonationData.counts,
            backgroundColor: 'rgba(249, 115, 22, 0.7)',
            borderColor: 'rgba(249, 115, 22, 1)',
            borderWidth: 2,
            borderRadius: 8,
            type: 'line',
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                size: 12,
                weight: 'bold'
              },
              padding: 15,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            callbacks: {
              label: function(context: any) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  if (context.datasetIndex === 0) {
                    label += formatCurrency(context.parsed.y);
                  } else {
                    label += context.parsed.y + ' transaksi';
                  }
                }
                return label;
              }
            }
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              callback: function(value: any) {
                return 'Rp ' + (value / 1000000).toFixed(1) + 'jt';
              },
              font: {
                size: 11
              }
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false
            },
            ticks: {
              font: {
                size: 11
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 11,
                weight: 'bold'
              }
            }
          }
        }
      }
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('id-ID', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
</script>

<svelte:head>
  <title>Dashboard - Admin Panel</title>
  <!-- Tambahkan CDN Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
  <!-- Hero Section -->
  <div class="relative overflow-hidden bg-linear-to-br from-blue-500 via-blue-600 to-blue-500 rounded-2xl shadow-xl mb-6">
    <div class="absolute inset-0 bg-black/10"></div>
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
    <div class="relative px-8 py-8 text-white">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="space-y-2">
          <h1 class="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <Icon name="dashboard" className="w-10 h-10" />
            {getTimeGreeting()}
          </h1>
          <p class="text-blue-100 text-base">Selamat bekerja di Panel Admin Sahabat Anak</p>
        </div>
        <div class="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-5 py-3 shadow-lg">
          <div class="text-blue-50 text-xs mb-1 flex items-center gap-2">
            <Icon name="clock" className="w-4 h-4" />
            Hari Ini
          </div>
          <div class="text-white font-semibold">{getCurrentDate()}</div>
        </div>
      </div>
    </div>
  </div>

  {#if error}
    <div class="bg-red-50 border-l-4 border-red-500 rounded-xl p-5 shadow-md mb-6" transition:fly={{ y: -20, duration: 400 }}>
      <div class="flex items-start gap-3">
        <div class="shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <Icon name="alert-circle" className="w-5 h-5 text-red-600" />
        </div>
        <div class="flex-1">
          <h3 class="text-red-900 font-bold mb-1">Terjadi Kesalahan</h3>
          <p class="text-red-700 text-sm">{error}</p>
          <button on:click={() => loadData()} class="mt-3 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2">
            <Icon name="check" className="w-4 h-4" />
            Muat Ulang Data
          </button>
        </div>
      </div>
    </div>
  {/if}

  {#if loading}
    <div class="flex flex-col justify-center items-center py-20">
      <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="mt-4 text-gray-600 font-semibold animate-pulse">Memuat dashboard...</p>
    </div>
  {:else}
    <!-- Statistik Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <!-- Total Donasi -->
      <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Donasi</p>
            <p class="text-2xl font-bold text-gray-900">{stats.totalDonations}</p>
            <p class="text-xs text-blue-600 font-medium mt-1">{formatCurrency(stats.totalAmount)}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon name="dollar" className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>

      <!-- Relawan -->
      <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Relawan</p>
            <p class="text-2xl font-bold text-gray-900">{stats.totalVolunteers}</p>
            <p class="text-xs text-blue-600 font-medium mt-1">Siap Membantu</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon name="users" className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>

      <!-- Pesan Baru -->
      <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 border border-orange-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Pesan Baru</p>
            <p class="text-2xl font-bold text-gray-900">{stats.totalContacts}</p>
            <p class="text-xs text-orange-600 font-medium mt-1">{stats.totalContacts > 0 ? 'Perlu Tindakan' : 'Semua Terbaca'}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <Icon name="mail" className="w-6 h-6 text-orange-500" />
          </div>
        </div>
      </div>

      <!-- Program -->
      <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Program</p>
            <p class="text-2xl font-bold text-gray-900">{stats.totalPrograms}</p>
            <p class="text-xs text-blue-600 font-medium mt-1">Sedang Berjalan</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon name="folder" className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>

      <!-- Event -->
      <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Event</p>
            <p class="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
            <p class="text-xs text-green-600 font-medium mt-1">{stats.upcomingEvents} Upcoming</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Icon name="calendar" className="w-6 h-6 text-green-500" />
          </div>
        </div>
      </div>

      <!-- Berita -->
      <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Berita</p>
            <p class="text-2xl font-bold text-gray-900">{stats.totalNews}</p>
            <p class="text-xs text-blue-600 font-medium mt-1">Konten Terkini</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon name="news" className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>
    </div>

    <!-- Grafik Donasi Tahunan -->
    <div class="mb-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="bg-linear-to-r from-blue-50 to-orange-100 px-5 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-linear-to-r from-orange-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Icon name="trending-up" className="w-5 h-5 text-white" />
              </div>
              <h2 class="text-lg font-bold text-gray-800">Grafik Donasi Tahunan {new Date().getFullYear()}</h2>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium border border-blue-200">
                Total: {formatCurrency(yearlyDonationData.amounts.reduce((a, b) => a + b, 0))}
              </span>
              <span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-medium border border-orange-200">
                {yearlyDonationData.counts.reduce((a, b) => a + b, 0)} Transaksi
              </span>
            </div>
          </div>
        </div>
        <div class="p-5">
          <div class="relative h-80">
            <canvas bind:this={chartCanvas}></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <!-- Donasi Terbaru -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="bg-linear-to-r from-blue-50 to-blue-100 px-5 py-4 border-b border-blue-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Icon name="dollar" className="w-5 h-5 text-white" />
              </div>
              <h2 class="text-lg font-bold text-gray-800">Donasi Terbaru</h2>
            </div>
            <a href="/admin/donations" class="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline flex items-center gap-1">
              Lihat Semua
              <Icon name="chevron-right" className="w-4 h-4" />
            </a>
          </div>
        </div>
        <div class="p-5">
          {#if recentDonations.length === 0}
            <div class="text-center py-12">
              <Icon name="dollar" className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p class="text-gray-500 font-medium">Belum ada donasi masuk</p>
            </div>
          {:else}
            <div class="space-y-2">
              {#each recentDonations as donation, i}
                <div class="flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-all duration-200" transition:fly={{ x: -10, duration: 300, delay: i * 50 }}>
                  <div class="flex items-center gap-3 flex-1 min-w-0">
                    <div class="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">{(donation.name || 'A')[0].toUpperCase()}</div>
                    <div class="flex-1 min-w-0">
                      <p class="font-semibold text-gray-800 truncate text-sm">{donation.name || 'Anonim'}</p>
                      <p class="text-xs text-blue-600 font-bold">{formatCurrency(parseInt(donation.amount))}</p>
                      {#if donation.createdAt}
                        <p class="text-xs text-gray-500">{formatDate(donation.createdAt)}</p>
                      {/if}
                    </div>
                  </div>
                  <div class="shrink-0 ml-3">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold {donation.status === 'verified' ? 'bg-green-100 text-green-700 border border-green-200' : donation.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}">
                      {donation.status === 'verified' ? 'Verified' : donation.status === 'pending' ? 'Pending' : donation.status}
                    </span>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <!-- Relawan Terbaru -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="bg-linear-to-r from-orange-50 to-orange-100 px-5 py-4 border-b border-orange-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Icon name="users" className="w-5 h-5 text-white" />
              </div>
              <h2 class="text-lg font-bold text-gray-800">Relawan Terbaru</h2>
            </div>
            <a href="/admin/volunteers" class="text-orange-600 hover:text-orange-700 font-medium text-sm hover:underline flex items-center gap-1">
              Lihat Semua
              <Icon name="chevron-right" className="w-4 h-4" />
            </a>
          </div>
        </div>
        <div class="p-5">
          {#if recentVolunteers.length === 0}
            <div class="text-center py-12">
              <Icon name="users" className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p class="text-gray-500 font-medium">Belum ada relawan terdaftar</p>
            </div>
          {:else}
            <div class="space-y-2">
              {#each recentVolunteers as volunteer, i}
                <div class="p-3 bg-gray-50 hover:bg-orange-50 rounded-lg border border-gray-200 hover:border-orange-200 transition-all duration-200" transition:fly={{ x: 10, duration: 300, delay: i * 50 }}>
                  <div class="flex items-start gap-3">
                    <div class="shrink-0 w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm">
                      {volunteer.name[0].toUpperCase()}
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between gap-3 mb-2">
                        <div class="flex-1 min-w-0">
                          <p class="font-bold text-gray-800 text-sm mb-0.5">{volunteer.name}</p>
                          <p class="text-xs text-gray-600 truncate">{volunteer.email}</p>
                        </div>
                        <span class="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold {volunteer.status === 'approved' ? 'bg-green-100 text-green-700 border border-green-200' : volunteer.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-red-100 text-red-700 border border-red-200'}">
                          {volunteer.status === 'approved' ? 'Disetujui' : volunteer.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                        </span>
                      </div>
                      <div class="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        {#if volunteer.phone}
                          <span class="flex items-center gap-1 shrink-0">
                            <Icon name="mail" className="w-3.5 h-3.5" />
                            <span class="truncate">{volunteer.phone}</span>
                          </span>
                        {/if}
                        {#if volunteer.createdAt}
                          <span class="flex items-center gap-1 shrink-0">
                            <Icon name="clock" className="w-3.5 h-3.5" />
                            <span class="whitespace-nowrap">{formatDate(volunteer.createdAt)}</span>
                          </span>
                        {/if}
                      </div>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>


<style>
  /* Tambahkan gaya kustom jika perlu */
</style>