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
  let activeTab = 'card'; // 'card' atau 'table'

  // File upload states
  let photoFile: File | null = null;
  let photoPreview: string = '';
  let imageFile: File | null = null;
  let imagePreview: string = '';
  let uploading = false;

  // Modal state
  let showModal = false;
  let modalType: 'success' | 'error' | 'warning' | 'confirm' = 'success';
  let modalTitle = '';
  let modalMessage = '';
  let confirmFunction: (() => void) | null = null;

  let formData: {
    name: string;
    role: string;
    position: string;
    quote: string;
    image: string;
    photo: string;
    alt: string;
    emailContact: string;
    linkedin: string;
    verified: number;
    experience: string;
    expertise: string[];
    teamType: string;
    program: string;
    programShort: string;
    bio: string;
    order: number;
    isActive: number;
  } = {
    name: '',
    role: '',
    position: '',
    quote: '',
    image: '',
    photo: '',
    alt: '',
    emailContact: '',
    linkedin: '',
    verified: 0,
    experience: '',
    expertise: [],
    teamType: 'coordinator',
    program: '',
    programShort: '',
    bio: '',
    order: 0,
    isActive: 1
  };

  let expertiseInput = '';

  onMount(async () => {
    await loadTeam();
  });

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

  const handlePhotoChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
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

  const handleImageChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      imageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      uploading = true;

      // Upload photo if new file selected
      if (photoFile) {
        const photoFormData = new FormData();
        photoFormData.append('image', photoFile);
        photoFormData.append('folder', 'team');
        
        const response = await fetch('http://localhost:3000/upload/image', {
          method: 'POST',
          body: photoFormData
        });
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Gagal upload foto profil');
        }
        formData.photo = data.url;
      }

      // Upload image if new file selected
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);
        imageFormData.append('folder', 'team');
        
        const response = await fetch('http://localhost:3000/upload/image', {
          method: 'POST',
          body: imageFormData
        });
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Gagal upload gambar alternatif');
        }
        formData.image = data.url;
      }

      // Validate required fields
      if (!formData.name || !formData.role || !formData.photo) {
        throw new Error('Nama, role, dan foto profil wajib diisi');
      }

      if (editingId) {
        await adminApi.team.update(editingId, formData);
      } else {
        await adminApi.team.create(formData);
      }
      
      resetForm();
      await loadTeam();
      modalType = 'success';
      modalTitle = 'Berhasil!';
      modalMessage = 'Data berhasil disimpan!';
      showModal = true;
    } catch (error: any) {
      modalType = 'error';
      modalTitle = 'Gagal Menyimpan';
      modalMessage = error.message || 'Gagal menyimpan data tim';
      showModal = true;
    } finally {
      uploading = false;
    }
  };

  const handleEdit = (member: any) => {
    editingId = member.id;
    formData = {
      name: member.name,
      role: member.role || '',
      position: member.position || '',
      quote: member.quote || '',
      image: member.image || '',
      photo: member.photo || '',
      alt: member.alt || '',
      emailContact: member.emailContact || '',
      linkedin: member.linkedin || '',
      verified: member.verified || 0,
      experience: member.experience || '',
      expertise: Array.isArray(member.expertise) ? member.expertise : [],
      teamType: member.teamType || 'coordinator',
      program: member.program || '',
      programShort: member.programShort || '',
      bio: member.bio || '',
      order: member.order || 0,
      isActive: member.isActive || 1
    };
    photoPreview = member.photo || '';
    imagePreview = member.image || '';
    photoFile = null;
    imageFile = null;
    expertiseInput = '';
    showForm = true;
  };

  const handleDelete = async (id: number) => {
    modalType = 'confirm';
    modalTitle = 'Konfirmasi Hapus';
    modalMessage = 'Apakah Anda yakin ingin menghapus anggota tim ini?';
    confirmFunction = async () => {
      deleting = id;
      try {
        await adminApi.team.delete(id);
        await loadTeam();
        modalType = 'success';
        modalTitle = 'Berhasil!';
        modalMessage = 'Anggota tim berhasil dihapus';
        showModal = true;
      } catch (error) {
        modalType = 'error';
        modalTitle = 'Gagal Menghapus';
        modalMessage = 'Gagal menghapus anggota tim';
        showModal = true;
      } finally {
        deleting = null;
      }
    };
    showModal = true;
  };

  const addExpertise = () => {
    if (expertiseInput.trim()) {
      formData.expertise = [...formData.expertise, expertiseInput.trim()];
      expertiseInput = '';
    }
  };

  const removeExpertise = (index: number) => {
    formData.expertise = formData.expertise.filter((_, i) => i !== index);
  };

  const resetForm = () => {
    formData = {
      name: '',
      role: '',
      position: '',
      quote: '',
      image: '',
      photo: '',
      alt: '',
      emailContact: '',
      linkedin: '',
      verified: 0,
      experience: '',
      expertise: [],
      teamType: 'coordinator',
      program: '',
      programShort: '',
      bio: '',
      order: 0,
      isActive: 1
    };
    photoFile = null;
    imageFile = null;
    photoPreview = '';
    imagePreview = '';
    expertiseInput = '';
    editingId = null;
    showForm = false;
  };

  const getStatusColor = (isActive: number) => {
    return isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200';
  };

  const getTeamTypeColor = (teamType: string) => {
    return teamType === 'leadership' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-blue-100 text-blue-700 border-blue-200';
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
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

    <div class="bg-white rounded-xl p-4 border border-purple-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Leadership</p>
          <p class="text-2xl font-bold text-purple-600">{team.filter(m => m.teamType === 'leadership').length}</p>
        </div>
        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <Icon name="award" className="w-6 h-6 text-purple-500" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-4 border border-orange-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Terverifikasi</p>
          <p class="text-2xl font-bold text-orange-600">{team.filter(m => m.verified === 1).length}</p>
        </div>
        <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <Icon name="verified" className="w-6 h-6 text-orange-500" />
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
        <!-- Basic Info -->
        <div>
          <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Icon name="user" className="w-5 h-5" />
            Informasi Dasar
          </h3>
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

            <div>
              <label for="position" class="block text-sm font-medium text-gray-700 mb-2">Posisi/Jabatan</label>
              <input
                id="position"
                type="text"
                bind:value={formData.position}
                placeholder="e.g., Kepala Tim"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label for="teamType" class="block text-sm font-medium text-gray-700 mb-2">Tipe Tim</label>
              <select
                id="teamType"
                bind:value={formData.teamType}
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="coordinator">Coordinator</option>
                <option value="leadership">Leadership</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Photos & Images -->
        <div>
          <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Icon name="image" className="w-5 h-5" />
            Foto & Gambar
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Photo Upload -->
            <div>
              <label for="photo" class="block text-sm font-medium text-gray-700 mb-2">
                Foto Profil *
                <span class="text-xs text-gray-500">(JPEG, PNG, WebP - Max 5MB)</span>
              </label>
              <input
                id="photo"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                on:change={handlePhotoChange}
                required={!editingId && !formData.photo}
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {#if photoPreview}
                <div class="mt-2">
                  <img src={photoPreview} alt="Preview" class="w-32 h-32 object-cover rounded-lg border-2 border-gray-200" />
                </div>
              {/if}
            </div>

            <!-- Image Upload (Alternative) -->
            <div>
              <label for="image" class="block text-sm font-medium text-gray-700 mb-2">
                Gambar Alternatif
                <span class="text-xs text-gray-500">(Opsional)</span>
              </label>
              <input
                id="image"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                on:change={handleImageChange}
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {#if imagePreview}
                <div class="mt-2">
                  <img src={imagePreview} alt="Preview" class="w-32 h-32 object-cover rounded-lg border-2 border-gray-200" />
                </div>
              {/if}
            </div>

            <div>
              <label for="alt" class="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
              <input
                id="alt"
                type="text"
                bind:value={formData.alt}
                placeholder="Deskripsi gambar"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- Contact & Social -->
        <div>
          <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Icon name="mail" className="w-5 h-5" />
            Kontak & Media Sosial
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="emailContact" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                id="emailContact"
                type="email"
                bind:value={formData.emailContact}
                placeholder="nama@example.com"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label for="linkedin" class="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
              <input
                id="linkedin"
                type="url"
                bind:value={formData.linkedin}
                placeholder="https://linkedin.com/in/nama"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- Professional Info -->
        <div>
          <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Icon name="briefcase" className="w-5 h-5" />
            Informasi Profesional
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="experience" class="block text-sm font-medium text-gray-700 mb-2">Pengalaman</label>
              <input
                id="experience"
                type="text"
                bind:value={formData.experience}
                placeholder="e.g., 5 tahun di bidang IT"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label for="program" class="block text-sm font-medium text-gray-700 mb-2">Program</label>
              <input
                id="program"
                type="text"
                bind:value={formData.program}
                placeholder="e.g., Pendidikan"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label for="programShort" class="block text-sm font-medium text-gray-700 mb-2">Program (Singkat)</label>
              <input
                id="programShort"
                type="text"
                bind:value={formData.programShort}
                placeholder="e.g., EDU"
                maxlength="50"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <!-- Expertise -->
          <div class="mt-4">
            <label for="expertiseInput" class="block text-sm font-medium text-gray-700 mb-2">Keahlian/Expertise</label>
            <div class="flex gap-2 mb-2">
              <input
                id="expertiseInput"
                type="text"
                bind:value={expertiseInput}
                on:keypress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                placeholder="Tambah keahlian..."
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                on:click={addExpertise}
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Tambah
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              {#each formData.expertise as item, index}
                <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {item}
                  <button
                    type="button"
                    on:click={() => removeExpertise(index)}
                    class="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              {/each}
            </div>
          </div>
        </div>

        <!-- Bio & Quote -->
        <div>
          <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Icon name="message" className="w-5 h-5" />
            Deskripsi
          </h3>
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

          <div class="mt-4">
            <label for="quote" class="block text-sm font-medium text-gray-700 mb-2">Quote/Motto</label>
            <textarea
              id="quote"
              bind:value={formData.quote}
              rows="2"
              placeholder="Kata-kata motivasi atau motto..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
        </div>

        <!-- Display Settings -->
        <div>
          <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Icon name="settings" className="w-5 h-5" />
            Pengaturan Tampilan
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div>
              <label for="verified" class="block text-sm font-medium text-gray-700 mb-2">Terverifikasi</label>
              <select
                id="verified"
                bind:value={formData.verified}
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={0}>Tidak</option>
                <option value={1}>Ya</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={uploading}
            class="bg-linear-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
          >
            {#if uploading}
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Menyimpan...
            {:else}
              <Icon name="check" className="w-4 h-4" />
              {editingId ? 'Update' : 'Simpan'}
            {/if}
          </button>
          <button
            type="button"
            on:click={resetForm}
            disabled={uploading}
            class="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 disabled:text-gray-400 px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <Icon name="close" className="w-4 h-4" />
            Batal
          </button>
        </div>
      </form>
    </div>
  {/if}

  <!-- Rest of the code remains the same (List view with cards and table) -->
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
      <!-- Card View - (Keep existing card view code) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each team as member}
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
            <div class="relative">
              <img src={member.photo} alt={member.alt || member.name} class="w-full h-48 object-cover" />
              <div class="absolute top-2 right-2 flex gap-2">
                {#if member.verified}
                  <span class="bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                    <Icon name="verified" className="w-3 h-3" />
                    Terverifikasi
                  </span>
                {/if}
                <span class={`text-xs px-2 py-1 rounded font-medium border ${getTeamTypeColor(member.teamType)}`}>
                  {member.teamType === 'leadership' ? 'Leadership' : 'Coordinator'}
                </span>
              </div>
            </div>

            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-800">{member.name}</h3>
              <p class="text-blue-600 font-medium text-sm mb-1">{member.role}</p>
              {#if member.position}
                <p class="text-gray-600 text-sm mb-2">{member.position}</p>
              {/if}

              {#if member.quote}
                <p class="text-xs italic text-gray-600 mb-2 line-clamp-2">"{member.quote}"</p>
              {/if}

              {#if member.bio}
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">{member.bio}</p>
              {/if}

              {#if member.expertise && member.expertise.length > 0}
                <div class="mb-3">
                  <p class="text-xs font-medium text-gray-700 mb-1">Keahlian:</p>
                  <div class="flex flex-wrap gap-1">
                    {#each member.expertise.slice(0, 2) as skill}
                      <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{skill}</span>
                    {/each}
                    {#if member.expertise.length > 2}
                      <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">+{member.expertise.length - 2}</span>
                    {/if}
                  </div>
                </div>
              {/if}

              <div class="flex items-center justify-between mb-3 text-xs text-gray-500">
                <span class="flex items-center gap-1">
                  <Icon name="trending-up" className="w-3 h-3" />
                  Urutan: {member.order || 0}
                </span>
                <span class={`px-2 py-1 rounded font-medium border ${getStatusColor(member.isActive)}`}>
                  {member.isActive ? 'Aktif' : 'Non-Aktif'}
                </span>
              </div>

              {#if member.emailContact || member.linkedin}
                <div class="flex gap-2 mb-3 text-xs">
                  {#if member.emailContact}
                    <a href="mailto:{member.emailContact}" class="text-blue-500 hover:underline flex items-center gap-1">
                      <Icon name="mail" className="w-3 h-3" />
                    </a>
                  {/if}
                  {#if member.linkedin}
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline flex items-center gap-1">
                      <Icon name="link" className="w-3 h-3" />
                    </a>
                  {/if}
                </div>
              {/if}

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
                  {deleting === member.id ? 'Hapus...' : 'Hapus'}
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <!-- Table View - (Keep existing table view code) -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left font-semibold text-gray-700">Nama</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-700">Role</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-700">Posisi</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-700">Tipe Tim</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-700">Program</th>
              <th class="px-4 py-3 text-center font-semibold text-gray-700">Urutan</th>
              <th class="px-4 py-3 text-center font-semibold text-gray-700">Status</th>
              <th class="px-4 py-3 text-center font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {#each team as member}
              <tr class="border-b border-gray-200 hover:bg-gray-50">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <img src={member.photo} alt={member.name} class="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p class="font-medium text-gray-900">{member.name}</p>
                      {#if member.verified}
                        <span class="text-xs text-orange-600 flex items-center gap-1">
                          <Icon name="verified" className="w-3 h-3" />
                          Terverifikasi
                        </span>
                      {/if}
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-gray-700">{member.role}</td>
                <td class="px-4 py-3 text-gray-700">{member.position || '-'}</td>
                <td class="px-4 py-3">
                  <span class={`text-xs px-2 py-1 rounded font-medium border ${getTeamTypeColor(member.teamType)}`}>
                    {member.teamType === 'leadership' ? 'Leadership' : 'Coordinator'}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-700">{member.program || '-'}</td>
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
                      {deleting === member.id ? 'Hapus...' : 'Hapus'}
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
  onConfirm={confirmFunction}
  confirmText="OK"
  cancelText="Batal"
/>