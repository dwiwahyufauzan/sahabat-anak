<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/utils/adminApi';
  import Icon from '$lib/components/admin/Icons.svelte';
  import Modal from '$lib/components/admin/Modal.svelte';

  let team: any[] = [];
  let loading = true;
  let deleting: number | null = null;
  let showForm = false;
  let editingId: number | null = null;
  let activeTab = 'table';

  // Modal states
  let showModal = false;
  let modalType: 'success' | 'error' | 'confirm' = 'success';
  let modalTitle = '';
  let modalMessage = '';
  let deleteTarget: number | null = null;

  let formData: {
    name: string;
    role: string;
    bio: string;
    photo: string;
    teamType: 'leadership' | 'coordinators';
    order: number;
    isActive: number;
  } = {
    name: '',
    role: '',
    bio: '',
    photo: '',
    teamType: 'coordinators',
    order: 0,
    isActive: 1
  };

  onMount(async () => {
    await loadTeam();
  });

  let photoFile: File | null = null;
  let photoPreview: string | null = null;

  const loadTeam = async () => {
    loading = true;
    try {
      team = await adminApi.team.getAll();
    } catch (error) {
      console.error('Failed to load team:', error);
    } finally {
      loading = false;
    }
  };

  const handlePhotoChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      photoFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        photoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      // Upload photo first if there's a new photo
      if (photoFile) {
        const photoFormData = new FormData();
        photoFormData.append('image', photoFile);
        
        const photoResponse = await fetch('http://localhost:3000/api/admin/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
          },
          body: photoFormData
        });

        if (!photoResponse.ok) {
          const errorText = await photoResponse.text();
          console.error('Upload error:', errorText);
          throw new Error('Gagal upload foto');
        }

        const photoData = await photoResponse.json();
        formData.photo = photoData.filename;
      }

      if (editingId) {
        await adminApi.team.update(editingId, formData);
      } else {
        await adminApi.team.create(formData);
      }
      
      modalType = 'success';
      modalTitle = 'Berhasil!';
      modalMessage = 'Data tim berhasil disimpan!';
      showModal = true;
      resetForm();
      await loadTeam();
    } catch (error) {
      console.error('Error saving team:', error);
      modalType = 'error';
      modalTitle = 'Gagal!';
      modalMessage = 'Gagal menyimpan data tim: ' + (error instanceof Error ? error.message : 'Unknown error');
      showModal = true;
    }
  };

  const handleEdit = (member: any) => {
    editingId = member.id;
    formData = {
      name: member.name,
      role: member.role || '',
      bio: member.bio || '',
      photo: member.photo || '',
      teamType: member.teamType || 'coordinators',
      order: member.order || 0,
      isActive: member.isActive || 1
    };
    photoPreview = member.photo ? `http://localhost:3000/uploads/team/${member.photo}` : null;
    showForm = true;
  };

  const handleDelete = async (id: number) => {
    deleteTarget = id;
    modalType = 'confirm';
    modalTitle = 'Hapus Anggota Tim?';
    modalMessage = 'Apakah Anda yakin ingin menghapus anggota tim ini? Tindakan ini tidak dapat dibatalkan.';
    showModal = true;
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    deleting = deleteTarget;
    try {
      await adminApi.team.delete(deleteTarget);
      await loadTeam();
      modalType = 'success';
      modalTitle = 'Berhasil!';
      modalMessage = 'Anggota tim berhasil dihapus';
      showModal = true;
    } catch (error) {
      modalType = 'error';
      modalTitle = 'Gagal!';
      modalMessage = 'Gagal menghapus anggota tim';
      showModal = true;
    } finally {
      deleting = null;
      deleteTarget = null;
    }
  };

  const resetForm = () => {
    formData = {
      name: '',
      role: '',
      bio: '',
      photo: '',
      teamType: 'coordinators',
      order: 0,
      isActive: 1
    };
    photoFile = null;
    photoPreview = null;
    editingId = null;
    showForm = false;
  };

  const getStatusColor = (isActive: number) => {
    return isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200';
  };
</script>

<svelte:head>
  <title>Kelola Tim - Admin Panel</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
  <!-- Header -->
  <div class="flex justify-between items-center mb-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
        <Icon name="team" className="w-8 h-8 text-blue-500" />
        Kelola Tim
      </h1>
      <p class="text-gray-600">Kelola anggota tim organisasi Sahabat Anak</p>
    </div>
    <button
      on:click={() => showForm = !showForm}
      class="bg-linear-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
    >
      {#if showForm}
        <Icon name="close" className="w-5 h-5" />
        Tutup Form
      {:else}
        <Icon name="plus" className="w-5 h-5" />
        Tambah Anggota
      {/if}
    </button>
  </div>

  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Total Anggota</p>
          <p class="text-2xl font-bold text-gray-900">{team.length}</p>
        </div>
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon name="team" className="w-6 h-6 text-blue-500" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Aktif</p>
          <p class="text-2xl font-bold text-green-600">{team.filter(m => m.isActive === 1).length}</p>
        </div>
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <Icon name="check" className="w-6 h-6 text-green-500" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-4 border border-red-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Tidak Aktif</p>
          <p class="text-2xl font-bold text-red-600">{team.filter(m => m.isActive === 0).length}</p>
        </div>
        <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
          <Icon name="close" className="w-6 h-6 text-red-500" />
        </div>
      </div>
    </div>
  </div>

  <!-- Form -->
  {#if showForm}
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Icon name="edit" className="w-6 h-6 text-blue-500" />
        {editingId ? 'Edit Anggota Tim' : 'Tambah Anggota Tim Baru'}
      </h2>
      
      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <!-- Informasi Dasar -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Nama *</label>
            <input
              id="name"
              type="text"
              bind:value={formData.name}
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label for="role" class="block text-sm font-medium text-gray-700 mb-2">Peran/Role *</label>
            <input
              id="role"
              type="text"
              bind:value={formData.role}
              required
              placeholder="e.g., Developer, Manager"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <!-- Bio -->
        <div>
          <label for="bio" class="block text-sm font-medium text-gray-700 mb-2">Bio/Deskripsi</label>
          <textarea
            id="bio"
            bind:value={formData.bio}
            rows="3"
            placeholder="Deskripsi singkat tentang anggota tim..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <!-- Foto -->
        <div>
          <label for="photo" class="block text-sm font-medium text-gray-700 mb-2">Foto</label>
          {#if photoPreview}
            <div class="mb-3 relative inline-block">
              <img src={photoPreview} alt="Preview" class="w-32 h-32 object-cover rounded-lg border border-gray-300" />
              <button
                type="button"
                on:click={() => {
                  photoFile = null;
                  photoPreview = null;
                  formData.photo = '';
                }}
                class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-colors"
              >
                <Icon name="close" className="w-4 h-4" />
              </button>
            </div>
          {/if}
          <div class="flex items-center gap-3">
            <input
              id="photo"
              type="file"
              accept="image/*"
              on:change={handlePhotoChange}
              class="hidden"
            />
            <button
              type="button"
              on:click={() => document.getElementById('photo')?.click()}
              class="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Icon name="upload" className="w-4 h-4" />
              {photoPreview ? 'Ganti Foto' : 'Pilih Foto'}
            </button>
            {#if photoFile}
              <span class="text-sm text-gray-600">{photoFile.name}</span>
            {/if}
          </div>
          <p class="text-xs text-gray-500 mt-2">Format: JPG, PNG, WebP. Max 5MB</p>
        </div>

        <!-- Pengaturan -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="teamType" class="block text-sm font-medium text-gray-700 mb-2">Tipe Tim *</label>
            <select
              id="teamType"
              bind:value={formData.teamType}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="leadership">Leadership</option>
              <option value="coordinators">Coordinators</option>
            </select>
          </div>

          <div>
            <label for="order" class="block text-sm font-medium text-gray-700 mb-2">Urutan</label>
            <input
              id="order"
              type="number"
              bind:value={formData.order}
              min="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label for="isActive" class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              id="isActive"
              bind:value={formData.isActive}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={1}>Aktif</option>
              <option value={0}>Non-Aktif</option>
            </select>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            class="bg-linear-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
          >
            <Icon name="check" className="w-4 h-4" />
            {editingId ? 'Update' : 'Simpan'}
          </button>
          <button
            type="button"
            on:click={resetForm}
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <Icon name="close" className="w-4 h-4" />
            Batal
          </button>
        </div>
      </form>
    </div>
  {/if}

  <!-- List -->
  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else if team.length === 0}
    <div class="bg-white rounded-xl p-12 text-center border border-gray-200">
      <Icon name="team" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-600 text-lg">Belum ada anggota tim</p>
    </div>
  {:else}
    <!-- View Toggle Tabs -->
    <div class="flex gap-2 mb-6">
      <button
        on:click={() => activeTab = 'card'}
        class="px-4 py-2 rounded-lg font-medium transition-colors {activeTab === 'card' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
      >
        <Icon name="grid" className="w-4 h-4 inline mr-2" />
        Tampilan Kartu
      </button>
      <button
        on:click={() => activeTab = 'table'}
        class="px-4 py-2 rounded-lg font-medium transition-colors {activeTab === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
      >
        <Icon name="table" className="w-4 h-4 inline mr-2" />
        Tampilan Tabel
      </button>
    </div>

    {#if activeTab === 'card'}
      <!-- Card View -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each team as member}
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
            {#if member.photo}
              <div class="h-48 overflow-hidden bg-gray-100">
                <img 
                  src="http://localhost:3000/uploads/team/{member.photo}" 
                  alt={member.name}
                  class="w-full h-full object-cover"
                />
              </div>
            {/if}
            <div class="p-6">
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">{member.name}</h3>
                  <p class="text-blue-600 font-medium text-sm">{member.role}</p>
                </div>
                <span class={`text-xs px-2 py-1 rounded font-medium border ${getStatusColor(member.isActive)}`}>
                  {member.isActive ? 'Aktif' : 'Non-Aktif'}
                </span>
              </div>

              <span class="inline-block text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 mb-3">
                {member.teamType === 'leadership' ? 'Leadership' : 'Coordinators'}
              </span>

              {#if member.bio}
                <p class="text-sm text-gray-600 mb-4 line-clamp-3">{member.bio}</p>
              {/if}

              <div class="flex items-center justify-between mb-4 text-xs text-gray-500">
                <span class="flex items-center gap-1">
                  <Icon name="hash" className="w-3 h-3" />
                  Urutan: {member.order || 0}
                </span>
              </div>

              <div class="flex gap-2">
                <button
                  on:click={() => handleEdit(member)}
                  class="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <Icon name="edit" className="w-4 h-4" />
                  Edit
                </button>
                <button
                  on:click={() => handleDelete(member.id)}
                  disabled={deleting === member.id}
                  class="flex-1 bg-red-100 hover:bg-red-200 disabled:bg-gray-100 text-red-700 disabled:text-gray-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                >
                  {#if deleting === member.id}
                    <div class="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                  {:else}
                    <Icon name="trash" className="w-4 h-4" />
                  {/if}
                  {deleting === member.id ? 'Menghapus...' : 'Hapus'}
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <!-- Table View -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left font-semibold text-gray-700">Foto</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-700">Nama</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-700">Role</th>
              <th class="px-4 py-3 text-center font-semibold text-gray-700">Tipe</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-700">Bio</th>
              <th class="px-4 py-3 text-center font-semibold text-gray-700">Urutan</th>
              <th class="px-4 py-3 text-center font-semibold text-gray-700">Status</th>
              <th class="px-4 py-3 text-center font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {#each team as member}
              <tr class="border-b border-gray-200 hover:bg-gray-50">
                <td class="px-4 py-3">
                  {#if member.photo}
                    <img 
                      src="http://localhost:3000/uploads/team/{member.photo}" 
                      alt={member.name}
                      class="w-12 h-12 rounded-lg object-cover"
                    />
                  {:else}
                    <div class="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                      <Icon name="team" className="w-6 h-6 text-gray-400" />
                    </div>
                  {/if}
                </td>
                <td class="px-4 py-3">
                  <p class="font-medium text-gray-900">{member.name}</p>
                </td>
                <td class="px-4 py-3 text-gray-700">{member.role}</td>
                <td class="px-4 py-3 text-center">
                  <span class="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700">
                    {member.teamType === 'leadership' ? 'Leadership' : 'Coordinators'}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-600">
                  <p class="line-clamp-2 max-w-md">{member.bio || '-'}</p>
                </td>
                <td class="px-4 py-3 text-center text-gray-700">{member.order || 0}</td>
                <td class="px-4 py-3 text-center">
                  <span class={`text-xs px-2 py-1 rounded font-medium border ${getStatusColor(member.isActive)}`}>
                    {member.isActive ? 'Aktif' : 'Non-Aktif'}
                  </span>
                </td>
                <td class="px-4 py-3 text-center">
                  <div class="flex gap-2 justify-center">
                    <button
                      on:click={() => handleEdit(member)}
                      class="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-xs font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      on:click={() => handleDelete(member.id)}
                      disabled={deleting === member.id}
                      class="bg-red-100 hover:bg-red-200 disabled:bg-gray-100 text-red-700 disabled:text-gray-400 px-3 py-1 rounded text-xs font-medium transition-colors"
                    >
                      {deleting === member.id ? 'Menghapus...' : 'Hapus'}
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  {/if}
</div>

<Modal 
  bind:show={showModal}
  type={modalType}
  title={modalTitle}
  message={modalMessage}
  confirmText={modalType === 'confirm' ? 'Hapus' : 'OK'}
  onConfirm={modalType === 'confirm' ? confirmDelete : null}
/>
