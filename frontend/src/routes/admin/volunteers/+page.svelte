<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/utils/adminApi';
  import Icon from '$lib/components/admin/Icons.svelte';

  let volunteers: any[] = [];
  let loading = true;
  let updatingId: number | null = null;
  let deletingId: number | null = null;
  let filterStatus: string = 'all';
  let searchQuery: string = '';

  // Modal states
  let showDeleteModal = false;
  let deleteTarget: { id: number; name: string } | null = null;
  let showSuccessModal = false;
  let successMessage = '';
  let showErrorModal = false;
  let errorMessage = '';
  let showAddModal = false;
  let showDetailModal = false;
  let detailVolunteer: any = null;
  
  // Form data for adding volunteer
  let newVolunteer = {
    name: '',
    email: '',
    phone: '',
    address: '',
    skills: '',
    motivation: '',
    availability: '',
    status: 'pending'
  };
  let formErrors: any = {};
  let isSubmitting = false;

  onMount(async () => {
    await loadVolunteers();
  });

  const loadVolunteers = async () => {
    loading = true;
    try {
      volunteers = await adminApi.volunteers.getAll();
    } catch (error) {
      console.error('Failed to load volunteers:', error);
    } finally {
      loading = false;
    }
  };

  const updateStatus = async (id: number, status: string) => {
    updatingId = id;
    try {
      await adminApi.volunteers.updateStatus(id, status);
      await loadVolunteers();
    } catch (error) {
      errorMessage = 'Gagal mengupdate status';
      showErrorModal = true;
    } finally {
      updatingId = null;
    }
  };

  const openDeleteModal = (id: number, name: string) => {
    deleteTarget = { id, name };
    showDeleteModal = true;
  };

  const closeDeleteModal = () => {
    showDeleteModal = false;
    deleteTarget = null;
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    deletingId = deleteTarget.id;
    showDeleteModal = false;

    try {
      await adminApi.volunteers.delete(deleteTarget.id);
      successMessage = `Relawan "${deleteTarget.name}" berhasil dihapus`;
      showSuccessModal = true;
      await loadVolunteers();
    } catch (error) {
      errorMessage = 'Gagal menghapus relawan';
      showErrorModal = true;
    } finally {
      deletingId = null;
      deleteTarget = null;
    }
  };

  const showDetail = (volunteer: any) => {
    detailVolunteer = volunteer;
    showDetailModal = true;
  };

  const closeDetailModal = () => {
    showDetailModal = false;
    detailVolunteer = null;
  };

  const openAddModal = () => {
    newVolunteer = {
      name: '',
      email: '',
      phone: '',
      address: '',
      skills: '',
      motivation: '',
      availability: '',
      status: 'pending'
    };
    formErrors = {};
    showAddModal = true;
  };

  const closeAddModal = () => {
    showAddModal = false;
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^(\+62|62|0)[0-9]{9,12}$/;
    return re.test(phone.replace(/\s/g, ''));
  };

  const handleAddVolunteer = async () => {
    // Reset errors
    formErrors = {};
    let hasError = false;

    // Validation
    if (!newVolunteer.name.trim()) {
      formErrors.name = 'Nama lengkap harus diisi';
      hasError = true;
    }

    if (!newVolunteer.email.trim()) {
      formErrors.email = 'Email harus diisi';
      hasError = true;
    } else if (!validateEmail(newVolunteer.email)) {
      formErrors.email = 'Format email tidak valid';
      hasError = true;
    }

    if (!newVolunteer.phone.trim()) {
      formErrors.phone = 'Nomor WhatsApp harus diisi';
      hasError = true;
    } else if (!validatePhone(newVolunteer.phone)) {
      formErrors.phone = 'Format nomor tidak valid';
      hasError = true;
    }

    if (hasError) return;

    isSubmitting = true;
    try {
      await adminApi.volunteers.create({
        name: newVolunteer.name,
        email: newVolunteer.email,
        phone: newVolunteer.phone,
        address: newVolunteer.address || '',
        skills: newVolunteer.skills || '',
        motivation: newVolunteer.motivation || '',
        availability: newVolunteer.availability || '',
        status: newVolunteer.status
      });
      
      successMessage = `Relawan "${newVolunteer.name}" berhasil ditambahkan`;
      showSuccessModal = true;
      showAddModal = false;
      await loadVolunteers();
    } catch (error) {
      errorMessage = 'Gagal menambahkan relawan';
      showErrorModal = true;
    } finally {
      isSubmitting = false;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  $: filteredVolunteers = volunteers.filter(v => {
    const matchesStatus = filterStatus === 'all' || v.status === filterStatus;
    const matchesSearch = !searchQuery || 
      v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  $: approvedCount = volunteers.filter(v => v.status === 'approved').length;
  $: pendingCount = volunteers.filter(v => v.status === 'pending').length;
  $: rejectedCount = volunteers.filter(v => v.status === 'rejected').length;
</script>

<svelte:head>
  <title>Kelola Relawan - Admin Panel</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
  <!-- Header -->
  <div class="mb-6 flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
        <Icon name="users" className="w-8 h-8 text-blue-500" />
        Kelola Relawan
      </h1>
      <p class="text-gray-600">Kelola pendaftaran dan persetujuan relawan</p>
    </div>
    <button
      on:click={openAddModal}
      class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
    >
      <Icon name="plus" className="w-5 h-5" />
      Tambah Relawan
    </button>
  </div>

  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <div class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Total Relawan</p>
          <p class="text-2xl font-bold text-gray-900">{volunteers.length}</p>
        </div>
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon name="users" className="w-6 h-6 text-blue-500" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Disetujui</p>
          <p class="text-2xl font-bold text-green-600">{approvedCount}</p>
        </div>
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <Icon name="check" className="w-6 h-6 text-green-500" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-4 border border-orange-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Pending</p>
          <p class="text-2xl font-bold text-orange-600">{pendingCount}</p>
        </div>
        <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <Icon name="clock" className="w-6 h-6 text-orange-500" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-4 border border-red-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Ditolak</p>
          <p class="text-2xl font-bold text-red-600">{rejectedCount}</p>
        </div>
        <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
          <Icon name="close" className="w-6 h-6 text-red-500" />
        </div>
      </div>
    </div>
  </div>

  <!-- Filters -->
  <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Search -->
      <div class="relative">
        <Icon name="search" className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari relawan..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- Status Filter -->
      <div class="flex gap-2">
        <button
          on:click={() => filterStatus = 'all'}
          class="px-4 py-2 rounded-lg font-medium transition-all {filterStatus === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
        >
          Semua
        </button>
        <button
          on:click={() => filterStatus = 'pending'}
          class="px-4 py-2 rounded-lg font-medium transition-all {filterStatus === 'pending' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
        >
          Pending
        </button>
        <button
          on:click={() => filterStatus = 'approved'}
          class="px-4 py-2 rounded-lg font-medium transition-all {filterStatus === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
        >
          Approved
        </button>
      </div>
    </div>
  </div>

  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else if filteredVolunteers.length === 0}
    <div class="bg-white rounded-xl p-12 text-center border border-gray-200">
      <Icon name="users" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-600 text-lg">
        {searchQuery || filterStatus !== 'all' ? 'Tidak ada relawan yang sesuai filter' : 'Belum ada pendaftaran relawan'}
      </p>
    </div>
  {:else}
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-linear-to-r from-blue-50 to-blue-100">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nama</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Kontak</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Keahlian</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tanggal</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each filteredVolunteers as volunteer}
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3">
                  <p class="font-semibold text-gray-800 text-sm">{volunteer.name}</p>
                </td>
                <td class="px-4 py-3">
                  <p class="text-xs text-gray-600">{volunteer.email}</p>
                  <p class="text-xs text-gray-600">{volunteer.phone}</p>
                </td>
                <td class="px-4 py-3 text-xs text-gray-600">
                  {volunteer.skills || '-'}
                </td>
                <td class="px-4 py-3 text-xs text-gray-600">
                  {formatDate(volunteer.createdAt)}
                </td>
                <td class="px-4 py-3">
                  <select
                    value={volunteer.status}
                    on:change={(e) => updateStatus(volunteer.id, e.currentTarget.value)}
                    disabled={updatingId === volunteer.id}
                    class="text-xs px-2 py-1 rounded-full border font-medium
                      {volunteer.status === 'approved' ? 'bg-green-100 text-green-700 border-green-300' : 
                       volunteer.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-300' :
                       'bg-yellow-100 text-yellow-700 border-yellow-300'}"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button
                      on:click={() => showDetail(volunteer)}
                      class="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <Icon name="eye" className="w-3 h-3" />
                      Detail
                    </button>
                    <button
                      on:click={() => openDeleteModal(volunteer.id, volunteer.name)}
                      disabled={deletingId === volunteer.id}
                      class="px-3 py-1 bg-red-100 hover:bg-red-200 disabled:bg-gray-100 text-red-700 disabled:text-gray-400 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      {#if deletingId === volunteer.id}
                        <div class="w-3 h-3 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                      {:else}
                        <Icon name="trash" className="w-3 h-3" />
                      {/if}
                      {deletingId === volunteer.id ? 'Menghapus...' : 'Hapus'}
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteModal}
  <div class="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4" on:click={closeDeleteModal} on:keydown={(e) => e.key === 'Escape' && closeDeleteModal()} role="button" tabindex="0">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all" on:click|stopPropagation on:keydown|stopPropagation role="dialog" tabindex="-1">
      <!-- Icon -->
      <div class="flex justify-center mb-4">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <Icon name="trash" className="w-8 h-8 text-red-600" />
        </div>
      </div>

      <!-- Title -->
      <h3 class="text-xl font-bold text-gray-900 text-center mb-2">
        Hapus Relawan?
      </h3>

      <!-- Message -->
      <p class="text-gray-600 text-center mb-6">
        Apakah Anda yakin ingin menghapus relawan <span class="font-semibold text-gray-900">"{deleteTarget?.name}"</span>? 
        <br />
        <span class="text-sm text-red-600 font-medium">Tindakan ini tidak dapat dibatalkan.</span>
      </p>

      <!-- Buttons -->
      <div class="flex gap-3">
        <button
          on:click={closeDeleteModal}
          class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
        >
          Batal
        </button>
        <button
          on:click={confirmDelete}
          class="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Icon name="trash" className="w-5 h-5" />
          Hapus
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Success Modal -->
{#if showSuccessModal}
  <div class="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4" on:click={() => showSuccessModal = false} on:keydown={(e) => e.key === 'Escape' && (showSuccessModal = false)} role="button" tabindex="0">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all" on:click|stopPropagation on:keydown|stopPropagation role="dialog" tabindex="-1">
      <!-- Icon -->
      <div class="flex justify-center mb-4">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Icon name="check" className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <!-- Title -->
      <h3 class="text-xl font-bold text-gray-900 text-center mb-2">
        Berhasil!
      </h3>

      <!-- Message -->
      <p class="text-gray-600 text-center mb-6">
        {successMessage}
      </p>

      <!-- Button -->
      <button
        on:click={() => showSuccessModal = false}
        class="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
      >
        OK
      </button>
    </div>
  </div>
{/if}

<!-- Error Modal -->
{#if showErrorModal}
  <div class="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4" on:click={() => showErrorModal = false} on:keydown={(e) => e.key === 'Escape' && (showErrorModal = false)} role="button" tabindex="0">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all" on:click|stopPropagation on:keydown|stopPropagation role="dialog" tabindex="-1">
      <!-- Icon -->
      <div class="flex justify-center mb-4">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <Icon name="close" className="w-8 h-8 text-red-600" />
        </div>
      </div>

      <!-- Title -->
      <h3 class="text-xl font-bold text-gray-900 text-center mb-2">
        Gagal!
      </h3>

      <!-- Message -->
      <p class="text-gray-600 text-center mb-6">
        {errorMessage}
      </p>

      <!-- Button -->
      <button
        on:click={() => showErrorModal = false}
        class="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
      >
        Tutup
      </button>
    </div>
  </div>
{/if}

<!-- Detail Volunteer Modal -->
{#if showDetailModal && detailVolunteer}
  <div class="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4" on:click={closeDetailModal} on:keydown={(e) => e.key === 'Escape' && closeDetailModal()} role="button" tabindex="0">
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" on:click|stopPropagation on:keydown|stopPropagation role="dialog" tabindex="-1">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6 pb-4 border-b">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Icon name="user" className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Detail Relawan</h3>
            <p class="text-sm text-gray-600">ID: #{detailVolunteer.id}</p>
          </div>
        </div>
        <button on:click={closeDetailModal} class="text-gray-400 hover:text-gray-600 transition-colors">
          <Icon name="close" className="w-6 h-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="space-y-4">
        <!-- Personal Info -->
        <div class="bg-gray-50 p-4 rounded-xl">
          <h4 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Icon name="user" className="w-5 h-5 text-blue-600" />
            Informasi Pribadi
          </h4>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Nama Lengkap:</span>
              <span class="text-sm font-medium text-gray-900">{detailVolunteer.name}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Email:</span>
              <span class="text-sm font-medium text-gray-900">{detailVolunteer.email}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Telepon:</span>
              <span class="text-sm font-medium text-gray-900">{detailVolunteer.phone}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Tanggal Daftar:</span>
              <span class="text-sm font-medium text-gray-900">{formatDate(detailVolunteer.createdAt)}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Status:</span>
              <span class="text-xs px-3 py-1 rounded-full border font-medium
                {detailVolunteer.status === 'approved' ? 'bg-green-100 text-green-700 border-green-300' : 
                 detailVolunteer.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-300' :
                 'bg-yellow-100 text-yellow-700 border-yellow-300'}">
                {detailVolunteer.status}
              </span>
            </div>
          </div>
        </div>

        <!-- Address -->
        {#if detailVolunteer.address}
          <div class="bg-purple-50 p-4 rounded-xl">
            <h4 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Icon name="map" className="w-5 h-5 text-purple-600" />
              Alamat
            </h4>
            <p class="text-sm text-gray-700">{detailVolunteer.address}</p>
          </div>
        {/if}

        <!-- Skills -->
        {#if detailVolunteer.skills}
          <div class="bg-blue-50 p-4 rounded-xl">
            <h4 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Icon name="star" className="w-5 h-5 text-blue-600" />
              Keahlian
            </h4>
            <p class="text-sm text-gray-700 whitespace-pre-line">{detailVolunteer.skills}</p>
          </div>
        {/if}

        <!-- Availability -->
        {#if detailVolunteer.availability}
          <div class="bg-green-50 p-4 rounded-xl">
            <h4 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Icon name="clock" className="w-5 h-5 text-green-600" />
              Ketersediaan
            </h4>
            <p class="text-sm text-gray-700 whitespace-pre-line">{detailVolunteer.availability}</p>
          </div>
        {/if}

        <!-- Motivation -->
        {#if detailVolunteer.motivation}
          <div class="bg-orange-50 p-4 rounded-xl">
            <h4 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Icon name="heart" className="w-5 h-5 text-orange-600" />
              Motivasi
            </h4>
            <p class="text-sm text-gray-700 italic whitespace-pre-line">"{detailVolunteer.motivation}"</p>
          </div>
        {/if}
      </div>

      <!-- Footer Actions -->
      <div class="flex gap-3 mt-6 pt-4 border-t">
        <button
          on:click={closeDetailModal}
          class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
        >
          Tutup
        </button>
        <button
          on:click={() => {
            updateStatus(detailVolunteer.id, detailVolunteer.status === 'approved' ? 'pending' : 'approved');
            closeDetailModal();
          }}
          class="flex-1 px-4 py-3 bg-linear-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Icon name="check" className="w-5 h-5" />
          {detailVolunteer.status === 'approved' ? 'Ubah ke Pending' : 'Setujui Relawan'}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Add Volunteer Modal -->
{#if showAddModal}
  <div class="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" role="dialog" tabindex="-1">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Icon name="user-plus" className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Tambah Relawan</h3>
            <p class="text-sm text-gray-600">Isi data relawan baru</p>
          </div>
        </div>
        <button on:click={closeAddModal} class="text-gray-400 hover:text-gray-600 transition-colors">
          <Icon name="close" className="w-6 h-6" />
        </button>
      </div>

      <!-- Form -->
      <form on:submit|preventDefault={handleAddVolunteer} class="space-y-4">
        <!-- Nama -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2" for="add-name">
            Nama Lengkap <span class="text-red-500">*</span>
          </label>
          <input
            id="add-name"
            type="text"
            bind:value={newVolunteer.name}
            placeholder="Masukkan nama lengkap"
            class="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            class:border-red-500={formErrors.name}
          />
          {#if formErrors.name}
            <p class="text-red-500 text-xs mt-1">{formErrors.name}</p>
          {/if}
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2" for="add-email">
            Email <span class="text-red-500">*</span>
          </label>
          <input
            id="add-email"
            type="email"
            bind:value={newVolunteer.email}
            placeholder="nama@email.com"
            class="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            class:border-red-500={formErrors.email}
          />
          {#if formErrors.email}
            <p class="text-red-500 text-xs mt-1">{formErrors.email}</p>
          {/if}
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2" for="add-phone">
            Nomor WhatsApp <span class="text-red-500">*</span>
          </label>
          <input
            id="add-phone"
            type="tel"
            bind:value={newVolunteer.phone}
            placeholder="+62 812 3456 7890"
            class="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            class:border-red-500={formErrors.phone}
          />
          {#if formErrors.phone}
            <p class="text-red-500 text-xs mt-1">{formErrors.phone}</p>
          {/if}
        </div>

        <!-- Skills -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2" for="add-skills">
            Keahlian / Skill
          </label>
          <textarea
            id="add-skills"
            bind:value={newVolunteer.skills}
            placeholder="Contoh: Mengajar, Desain Grafis, Fotografi, dll."
            rows="3"
            class="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
          ></textarea>
        </div>

        <!-- Address -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2" for="add-address">
            Alamat Lengkap
          </label>
          <textarea
            id="add-address"
            bind:value={newVolunteer.address}
            placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan, Kota"
            rows="3"
            class="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
          ></textarea>
        </div>

        <!-- Motivation -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2" for="add-motivation">
            Motivasi Bergabung
          </label>
          <textarea
            id="add-motivation"
            bind:value={newVolunteer.motivation}
            placeholder="Ceritakan alasan ingin menjadi relawan..."
            rows="4"
            class="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
          ></textarea>
        </div>

        <!-- Availability -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2" for="add-availability">
            Ketersediaan Waktu
          </label>
          <select
            id="add-availability"
            bind:value={newVolunteer.availability}
            class="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="">Pilih ketersediaan waktu</option>
            <option value="Weekdays (Senin-Jumat)">Weekdays (Senin-Jumat)</option>
            <option value="Weekends (Sabtu-Minggu)">Weekends (Sabtu-Minggu)</option>
            <option value="Fleksibel">Fleksibel</option>
            <option value="Hanya event tertentu">Hanya event tertentu</option>
          </select>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2" for="add-status">
            Status
          </label>
          <select
            id="add-status"
            bind:value={newVolunteer.status}
            class="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-4">
          <button
            type="button"
            on:click={closeAddModal}
            class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {#if isSubmitting}
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Menyimpan...
            {:else}
              <Icon name="check" className="w-5 h-5" />
              Simpan
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
