<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/utils/adminApi';
  import { goto } from '$app/navigation';
  import Icon from '$lib/components/admin/Icons.svelte';
  import Modal from '$lib/components/admin/Modal.svelte';
  import RichTextEditor from '$lib/components/admin/RichTextEditor.svelte';
  import { getImageUrl } from '$lib/utils/image';

  let events: any[] = [];
  let loading = true;
  let deleting: number | null = null;
  let showModal = false;
  let modalType: 'success' | 'error' | 'confirm' = 'success';
  let modalTitle = '';
  let modalMessage = '';
  let deleteTarget: number | null = null;

  // Detail modal state
  let showDetailModal = false;
  let detailEvent: any = null;

  // Edit state
  let editingId: number | null = null;
  let editForm: any = {};
  let imageFile: File | null = null;

  onMount(async () => {
    await loadEvents();
  });

  const loadEvents = async () => {
    loading = true;
    try {
      const response = await fetch('http://localhost:3000/api/admin/events', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (response.ok) {
        events = await response.json();
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      loading = false;
    }
  };

  const handleDelete = async (id: number) => {
    deleteTarget = id;
    modalType = 'confirm';
    modalTitle = 'Hapus Event?';
    modalMessage = 'Apakah Anda yakin ingin menghapus event ini? Tindakan ini tidak dapat dibatalkan.';
    showModal = true;
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    deleting = deleteTarget;
    try {
      const response = await fetch(`http://localhost:3000/api/admin/events/${deleteTarget}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        await loadEvents();
        modalType = 'success';
        modalTitle = 'Berhasil!';
        modalMessage = 'Event berhasil dihapus';
        showModal = true;
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      modalType = 'error';
      modalTitle = 'Gagal!';
      modalMessage = 'Gagal menghapus event';
      showModal = true;
    } finally {
      deleting = null;
      deleteTarget = null;
    }
  };

  const startEdit = (event: any) => {
    editingId = event.id;
    editForm = { ...event };
    imageFile = null;
  };

  const cancelEdit = () => {
    editingId = null;
    editForm = {};
    imageFile = null;
  };

  const handleImageChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      imageFile = target.files[0];
    }
  };

  const saveEdit = async () => {
    if (!editingId) return;

    try {
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(editForm).forEach(key => {
        if (editForm[key] !== null && editForm[key] !== undefined && key !== 'image') {
          formData.append(key, editForm[key]);
        }
      });

      // Append image if new file selected
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (editForm.image) {
        formData.append('imageUrl', editForm.image);
      }

      const response = await fetch(`http://localhost:3000/api/admin/events/${editingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });

      if (response.ok) {
        await loadEvents();
        cancelEdit();
        modalType = 'success';
        modalTitle = 'Berhasil!';
        modalMessage = 'Event berhasil diperbarui';
        showModal = true;
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      modalType = 'error';
      modalTitle = 'Gagal!';
      modalMessage = 'Gagal memperbarui event';
      showModal = true;
    }
  };

  const createEvent = async () => {
    try {
      // Validasi field required
      if (!editForm.name || !editForm.description || !editForm.venue || 
          !editForm.startDate || !editForm.endDate || 
          !editForm.startTime || !editForm.endTime) {
        modalType = 'error';
        modalTitle = 'Validasi Gagal!';
        modalMessage = 'Mohon lengkapi semua field yang wajib diisi (bertanda *)';
        showModal = true;
        return;
      }

      // Cek token
      const token = localStorage.getItem('adminToken');
      if (!token) {
        modalType = 'error';
        modalTitle = 'Tidak Terautentikasi!';
        modalMessage = 'Silakan login kembali';
        showModal = true;
        setTimeout(() => {
          goto('/admin/login');
        }, 2000);
        return;
      }

      const formData = new FormData();
      
      Object.keys(editForm).forEach(key => {
        if (editForm[key] !== null && editForm[key] !== undefined && key !== 'image') {
          formData.append(key, editForm[key]);
        }
      });

      if (imageFile) {
        formData.append('image', imageFile);
      }

      console.log('=== SENDING EVENT DATA ===');
      console.log('Form values:', editForm);
      console.log('FormData entries:', Object.fromEntries(formData));
      console.log('Token:', token.substring(0, 20) + '...');

      const response = await fetch('http://localhost:3000/api/admin/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Handle non-JSON response
      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
        console.log('JSON Response:', result);
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        
        // Check if it's an authentication error
        if (text.includes('Invalid token') || text.includes('Unauthorized') || response.status === 401) {
          modalType = 'error';
          modalTitle = 'Sesi Expired!';
          modalMessage = 'Silakan login kembali';
          showModal = true;
          setTimeout(() => {
            goto('/admin/login');
          }, 2000);
          return;
        }
        
        throw new Error(text || 'Server error');
      }

      if (response.ok && result) {
        await loadEvents();
        cancelEdit();
        modalType = 'success';
        modalTitle = 'Berhasil!';
        modalMessage = 'Event berhasil ditambahkan';
        showModal = true;
      } else {
        const errorMsg = result?.error || result?.message || 'Failed to create event';
        console.error('Server error:', errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('=== CREATE EVENT ERROR ===');
      console.error('Error details:', error);
      modalType = 'error';
      modalTitle = 'Gagal!';
      modalMessage = error instanceof Error ? error.message : 'Gagal menambahkan event';
      showModal = true;
    }
  };

  const startCreate = () => {
    editingId = -1; // Special value for create mode
    editForm = {
      name: '',
      description: '',
      venue: '',
      eventType: 'offline',
      objectives: '',
      targetAudience: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      status: 'upcoming'
    };
    imageFile = null;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // HH:MM
  };

  const showEventDetail = (event: any) => {
    detailEvent = event;
    showDetailModal = true;
  };

  $: upcomingCount = events.filter(e => e.status === 'upcoming').length;
  $: ongoingCount = events.filter(e => e.status === 'ongoing').length;
  $: completedCount = events.filter(e => e.status === 'completed').length;
</script>

<svelte:head>
  <title>Kelola Event - Admin Panel</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
  <!-- Header Section -->
  <div class="bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-blue-100">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <Icon name="calendar" className="w-6 h-6 text-white" />
          </div>
          Kelola Event
        </h1>
        <p class="text-slate-600 ml-15">Kelola kegiatan dan event organisasi</p>
      </div>
      <button
        on:click={startCreate}
        class="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
      >
        <Icon name="plus" className="w-5 h-5" />
        Tambah Event
      </button>
    </div>
  </div>

  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-slate-600 mb-1">Total Event</p>
          <p class="text-2xl font-bold text-slate-900">{events.length}</p>
        </div>
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon name="calendar" className="w-6 h-6 text-blue-500" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-4 border border-orange-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-slate-600 mb-1">Upcoming</p>
          <p class="text-2xl font-bold text-orange-600">{upcomingCount}</p>
        </div>
        <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <Icon name="clock" className="w-6 h-6 text-orange-500" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-slate-600 mb-1">Ongoing</p>
          <p class="text-2xl font-bold text-green-600">{ongoingCount}</p>
        </div>
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <Icon name="trending-up" className="w-6 h-6 text-green-500" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-slate-600 mb-1">Completed</p>
          <p class="text-2xl font-bold text-blue-600">{completedCount}</p>
        </div>
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon name="check" className="w-6 h-6 text-blue-500" />
        </div>
      </div>
    </div>
  </div>

  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else if editingId !== null}
    <!-- Edit/Create Form -->
    <div class="bg-white rounded-xl p-8 border border-slate-200 shadow-lg mb-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Icon name={editingId === -1 ? 'plus' : 'edit'} className="w-7 h-7 text-blue-500" />
          {editingId === -1 ? 'Tambah Event Baru' : 'Edit Event'}
        </h2>
        <button
          on:click={cancelEdit}
          class="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Icon name="x" className="w-6 h-6" />
        </button>
      </div>
      
      <div class="space-y-6">
        <!-- Nama Event -->
        <div>
          <label for="event-name" class="block text-sm font-semibold text-slate-700 mb-2">
            Nama Event <span class="text-red-500">*</span>
          </label>
          <input
            id="event-name"
            type="text"
            bind:value={editForm.name}
            class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            placeholder="Contoh: Workshop Pendidikan Anak"
            required
          />
        </div>

        <!-- Deskripsi dengan Rich Text Editor -->
        <div class="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div class="flex items-center gap-2 mb-3">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            <div class="text-sm font-bold text-slate-800">
              Deskripsi Event <span class="text-red-500">*</span>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-sm">
            <RichTextEditor 
              bind:value={editForm.description}
              placeholder="Tulis deskripsi lengkap event di sini. Gunakan toolbar untuk memformat teks, menambahkan heading, list, link, dan styling lainnya..."
            />
          </div>
        </div>

        <!-- Grid untuk 2 kolom -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Tempat -->
          <div>
            <label for="event-venue" class="block text-sm font-semibold text-slate-700 mb-2">
              Tempat / Lokasi <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <input
                id="event-venue"
                type="text"
                bind:value={editForm.venue}
                class="w-full px-4 py-3 pl-11 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: Gedung Serbaguna Jakarta"
                required
              />
            </div>
          </div>

          <!-- Tipe Event -->
          <div>
            <label for="event-type" class="block text-sm font-semibold text-slate-700 mb-2">
              Tipe Event <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                </svg>
              </div>
              <select
                id="event-type"
                bind:value={editForm.eventType}
                class="w-full px-4 py-3 pl-11 pr-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                required
              >
                <option value="offline">Offline (Tatap Muka)</option>
                <option value="online">Online (Virtual)</option>
              </select>
              <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Tujuan Event -->
        <div>
          <label for="event-objectives" class="block text-sm font-semibold text-slate-700 mb-2">
            Tujuan Event
          </label>
          <textarea
            id="event-objectives"
            bind:value={editForm.objectives}
            rows="3"
            class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Jelaskan tujuan dari penyelenggaraan event ini..."
          ></textarea>
        </div>

        <!-- Target Audiens -->
        <div>
          <label for="event-target-audience" class="block text-sm font-semibold text-slate-700 mb-2">
            Target Audiens
          </label>
          <input
            id="event-target-audience"
            type="text"
            bind:value={editForm.targetAudience}
            class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Contoh: Orang tua, Guru, Mahasiswa, Umum"
          />
        </div>

        <!-- Tanggal dan Waktu -->
        <div class="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-3">
            <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Icon name="calendar" className="w-4 h-4 text-white" />
            </div>
            Jadwal Event
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Tanggal Mulai -->
            <div>
              <label for="event-start-date" class="block text-sm font-semibold text-slate-700 mb-2 items-center gap-2">
                Tanggal Mulai <span class="text-red-500">*</span>
              </label>
              <input
                id="event-start-date"
                type="date"
                bind:value={editForm.startDate}
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                required
              />
            </div>

            <!-- Tanggal Berakhir -->
            <div>
              <label for="event-end-date" class="block text-sm font-semibold text-slate-700 mb-2 items-center gap-2">
                Tanggal Berakhir <span class="text-red-500">*</span>
              </label>
              <input
                id="event-end-date"
                type="date"
                bind:value={editForm.endDate}
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                required
              />
            </div>

            <!-- Jam Mulai -->
            <div>
              <label for="event-start-time" class="block text-sm font-semibold text-slate-700 mb-2 items-center gap-2">
                Jam Mulai <span class="text-red-500">*</span>
              </label>
              <input
                id="event-start-time"
                type="time"
                bind:value={editForm.startTime}
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                required
              />
            </div>

            <!-- Jam Berakhir -->
            <div>
              <label for="event-end-time" class="block text-sm font-semibold text-slate-700 mb-2 items-center gap-2">
                Jam Berakhir <span class="text-red-500">*</span>
              </label>
              <input
                id="event-end-time"
                type="time"
                bind:value={editForm.endTime}
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                required
              />
            </div>
          </div>
        </div>

        <!-- Status dan Foto -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Status -->
          <div>
            <label for="event-status" class="block text-sm font-semibold text-slate-700 mb-2">
              Status Event <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <select
                id="event-status"
                bind:value={editForm.status}
                class="w-full px-4 py-3 pl-11 pr-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                required
              >
                <option value="upcoming">Upcoming (Akan Datang)</option>
                <option value="ongoing">Ongoing (Berlangsung)</option>
                <option value="completed">Completed (Selesai)</option>
                <option value="cancelled">Cancelled (Dibatalkan)</option>
              </select>
              <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Foto Event -->
          <div>
            <label for="event-image" class="block text-sm font-semibold text-slate-700 mb-2">
              Foto Event
            </label>
            <input
              id="event-image"
              type="file"
              accept="image/*"
              on:change={handleImageChange}
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <!-- Preview Foto -->
        {#if editForm.image && !imageFile}
          <div class="mt-4">
            <p class="text-sm font-semibold text-slate-700 mb-2">Preview Foto Saat Ini:</p>
            <div class="relative inline-block">
              <img 
                src={getImageUrl(editForm.image)} 
                alt="Current" 
                class="w-64 h-40 object-cover rounded-xl border-2 border-slate-200 shadow-md" 
              />
            </div>
          </div>
        {/if}

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-6 border-t border-slate-200">
          <button
            on:click={editingId === -1 ? createEvent : saveEdit}
            class="flex-1 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Icon name={editingId === -1 ? 'plus' : 'save'} className="w-5 h-5" />
            {editingId === -1 ? 'Tambahkan Event' : 'Simpan Perubahan'}
          </button>
          <button
            on:click={cancelEdit}
            class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
          >
            <Icon name="x" className="w-5 h-5" />
            Batal
          </button>
        </div>
      </div>
    </div>
  {:else if events.length === 0}
    <div class="bg-white rounded-xl p-12 text-center border border-slate-200">
      <Icon name="calendar" className="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <p class="text-slate-600 text-lg mb-4">Belum ada event</p>
      <button
        on:click={startCreate}
        class="inline-flex items-center gap-2 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
      >
        <Icon name="plus" className="w-5 h-5" />
        Tambah Event Pertama
      </button>
    </div>
  {:else}
    <!-- Events Table -->
    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Nama Event</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Tanggal</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Tempat</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Tipe</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            {#each events as event (event.id)}
              <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4">
                  <p class="font-semibold text-slate-900 text-sm">{event.name}</p>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm text-slate-900">{formatDate(event.startDate)}</p>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm text-slate-900">{event.venue}</p>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border {event.eventType === 'online' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-green-100 text-green-700 border-green-200'}">
                    {event.eventType === 'online' ? 'Online' : 'Offline'}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                    {event.status === 'upcoming' ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}
                    {event.status === 'ongoing' ? 'bg-green-100 text-green-700 border-green-200' : ''}
                    {event.status === 'completed' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
                    {event.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' : ''}">
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-col gap-1">
                    <button
                      on:click={() => startEdit(event)}
                      class="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-1 text-xs"
                    >
                      <Icon name="edit" className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      on:click={() => showEventDetail(event)}
                      class="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-1 text-xs"
                    >
                      <Icon name="eye" className="w-3 h-3" />
                      Detail
                    </button>
                    <button
                      on:click={() => handleDelete(event.id)}
                      disabled={deleting === event.id}
                      class="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-1 text-xs"
                    >
                      {#if deleting === event.id}
                        <div class="w-3 h-3 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                      {:else}
                        <Icon name="trash" className="w-3 h-3" />
                      {/if}
                      {deleting === event.id ? 'Hapus...' : 'Hapus'}
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

<!-- Modal -->
<Modal
  bind:show={showModal}
  type={modalType}
  title={modalTitle}
  message={modalMessage}
  onConfirm={modalType === 'confirm' ? confirmDelete : undefined}
/>

<!-- Detail Modal -->
{#if showDetailModal && detailEvent}
  <div class="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all animate-scale-in">
      <!-- Header -->
      <div class="bg-linear-to-r from-blue-500 to-indigo-600 px-6 py-5 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Icon name="calendar" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-white">Detail Event</h3>
            <p class="text-blue-100 text-sm">{detailEvent.name}</p>
          </div>
        </div>
        <button
          on:click={() => showDetailModal = false}
          class="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
        >
          <Icon name="x" className="w-6 h-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
        <div class="space-y-4">
          <!-- Nama Event -->
          <div class="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                <Icon name="calendar" className="w-5 h-5 text-white" />
              </div>
              <div class="flex-1">
                <p class="text-xs font-semibold text-blue-600 uppercase mb-1">Nama Event</p>
                <p class="text-lg font-bold text-slate-900">{detailEvent.name}</p>
              </div>
            </div>
          </div>

          <!-- Grid Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Tanggal -->
            <div class="bg-white border border-slate-200 rounded-xl p-4">
              <div class="flex items-center gap-2 mb-2">
                <Icon name="calendar" className="w-4 h-4 text-orange-500" />
                <p class="text-xs font-semibold text-slate-600 uppercase">Tanggal</p>
              </div>
              <p class="text-sm font-medium text-slate-900">{formatDate(detailEvent.startDate)} - {formatDate(detailEvent.endDate)}</p>
            </div>

            <!-- Waktu -->
            <div class="bg-white border border-slate-200 rounded-xl p-4">
              <div class="flex items-center gap-2 mb-2">
                <Icon name="clock" className="w-4 h-4 text-blue-500" />
                <p class="text-xs font-semibold text-slate-600 uppercase">Waktu</p>
              </div>
              <p class="text-sm font-medium text-slate-900">{formatTime(detailEvent.startTime)} - {formatTime(detailEvent.endTime)} WIB</p>
            </div>

            <!-- Tempat -->
            <div class="bg-white border border-slate-200 rounded-xl p-4">
              <div class="flex items-center gap-2 mb-2">
                <Icon name="map-pin" className="w-4 h-4 text-red-500" />
                <p class="text-xs font-semibold text-slate-600 uppercase">Tempat</p>
              </div>
              <p class="text-sm font-medium text-slate-900">{detailEvent.venue}</p>
            </div>

            <!-- Tipe Event -->
            <div class="bg-white border border-slate-200 rounded-xl p-4">
              <div class="flex items-center gap-2 mb-2">
                <Icon name="globe" className="w-4 h-4 text-purple-500" />
                <p class="text-xs font-semibold text-slate-600 uppercase">Tipe Event</p>
              </div>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border {detailEvent.eventType === 'online' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-green-100 text-green-700 border-green-200'}">
                {detailEvent.eventType === 'online' ? 'Online' : 'Offline'}
              </span>
            </div>

            <!-- Status -->
            <div class="bg-white border border-slate-200 rounded-xl p-4">
              <div class="flex items-center gap-2 mb-2">
                <Icon name="trending-up" className="w-4 h-4 text-green-500" />
                <p class="text-xs font-semibold text-slate-600 uppercase">Status</p>
              </div>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
                {detailEvent.status === 'upcoming' ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}
                {detailEvent.status === 'ongoing' ? 'bg-green-100 text-green-700 border-green-200' : ''}
                {detailEvent.status === 'completed' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
                {detailEvent.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' : ''}">
                {detailEvent.status.charAt(0).toUpperCase() + detailEvent.status.slice(1)}
              </span>
            </div>

            <!-- Target Audiens -->
            {#if detailEvent.targetAudience}
              <div class="bg-white border border-slate-200 rounded-xl p-4">
                <div class="flex items-center gap-2 mb-2">
                  <Icon name="users" className="w-4 h-4 text-indigo-500" />
                  <p class="text-xs font-semibold text-slate-600 uppercase">Target Audiens</p>
                </div>
                <p class="text-sm font-medium text-slate-900">{detailEvent.targetAudience}</p>
              </div>
            {/if}
          </div>

          <!-- Deskripsi -->
          {#if detailEvent.description}
            <div class="bg-white border border-slate-200 rounded-xl p-4">
              <div class="flex items-center gap-2 mb-3">
                <Icon name="file-text" className="w-4 h-4 text-slate-500" />
                <p class="text-xs font-semibold text-slate-600 uppercase">Deskripsi</p>
              </div>
              <div class="prose prose-sm max-w-none text-slate-700">
                {@html detailEvent.description}
              </div>
            </div>
          {/if}

          <!-- Tujuan -->
          {#if detailEvent.objectives}
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div class="flex items-center gap-2 mb-3">
                <Icon name="target" className="w-4 h-4 text-amber-600" />
                <p class="text-xs font-semibold text-amber-700 uppercase">Tujuan Event</p>
              </div>
              <p class="text-sm text-slate-700 leading-relaxed">{detailEvent.objectives}</p>
            </div>
          {/if}

          <!-- Gambar Event -->
          {#if detailEvent.image}
            <div class="bg-white border border-slate-200 rounded-xl p-4">
              <div class="flex items-center gap-2 mb-3">
                <Icon name="image" className="w-4 h-4 text-slate-500" />
                <p class="text-xs font-semibold text-slate-600 uppercase">Foto Event</p>
              </div>
              <img 
                src={getImageUrl(detailEvent.image)} 
                alt={detailEvent.name}
                class="w-full h-64 object-cover rounded-lg border border-slate-200"
              />
            </div>
          {/if}
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
        <button
          on:click={() => showDetailModal = false}
          class="px-6 py-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-semibold transition-colors"
        >
          Tutup
        </button>
        <button
          on:click={() => {
            showDetailModal = false;
            startEdit(detailEvent);
          }}
          class="px-6 py-3 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Icon name="edit" className="w-4 h-4" />
          Edit Event
        </button>
      </div>
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
