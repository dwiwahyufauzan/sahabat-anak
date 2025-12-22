<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/utils/adminApi';

  let team: any[] = [];
  let loading = true;
  let deleting: number | null = null;
  let showForm = false;
  let editingId: number | null = null;

  let formData = {
    name: '',
    position: '',
    photo: '',
    bio: '',
    order: 0,
    status: 'active'
  };

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

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await adminApi.team.update(editingId, formData);
      } else {
        await adminApi.team.create(formData);
      }
      resetForm();
      await loadTeam();
    } catch (error) {
      alert('Gagal menyimpan data tim');
    }
  };

  const handleEdit = (member: any) => {
    editingId = member.id;
    formData = {
      name: member.name,
      position: member.position,
      photo: member.photo,
      bio: member.bio || '',
      order: member.order || 0,
      status: member.status
    };
    showForm = true;
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus anggota tim ini?')) return;

    deleting = id;
    try {
      await adminApi.team.delete(id);
      await loadTeam();
    } catch (error) {
      alert('Gagal menghapus anggota tim');
    } finally {
      deleting = null;
    }
  };

  const resetForm = () => {
    formData = {
      name: '',
      position: '',
      photo: '',
      bio: '',
      order: 0,
      status: 'active'
    };
    editingId = null;
    showForm = false;
  };
</script>

<svelte:head>
  <title>Kelola Tim - Admin Panel</title>
</svelte:head>

<div>
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold text-gray-800">Kelola Tim</h1>
    <button
      onclick={() => showForm = !showForm}
      class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
    >
      {showForm ? 'Tutup Form' : '+ Tambah Anggota Tim'}
    </button>
  </div>

  {#if showForm}
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4">
        {editingId ? 'Edit Anggota Tim' : 'Tambah Anggota Tim Baru'}
      </h2>
      
      <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Nama *
            </label>
            <input
              id="name"
              type="text"
              bind:value={formData.name}
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label for="position" class="block text-sm font-medium text-gray-700 mb-2">
              Posisi *
            </label>
            <input
              id="position"
              type="text"
              bind:value={formData.position}
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div>
          <label for="photo" class="block text-sm font-medium text-gray-700 mb-2">
            URL Foto *
          </label>
          <input
            id="photo"
            type="url"
            bind:value={formData.photo}
            required
            placeholder="https://example.com/photo.jpg"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          {#if formData.photo}
            <img src={formData.photo} alt="Preview" class="mt-2 w-32 h-32 object-cover rounded-lg" />
          {/if}
        </div>

        <div>
          <label for="bio" class="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            bind:value={formData.bio}
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="order" class="block text-sm font-medium text-gray-700 mb-2">
              Urutan
            </label>
            <input
              id="order"
              type="number"
              bind:value={formData.order}
              min="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              bind:value={formData.status}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div class="flex gap-4">
          <button
            type="submit"
            class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            {editingId ? 'Update' : 'Simpan'}
          </button>
          <button
            type="button"
            onclick={resetForm}
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  {/if}

  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  {:else if team.length === 0}
    <div class="bg-white rounded-lg shadow p-12 text-center">
      <p class="text-gray-500 mb-4">Belum ada anggota tim</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each team as member}
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <img src={member.photo} alt={member.name} class="w-full h-64 object-cover" />
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-800">{member.name}</h3>
            <p class="text-green-600 mb-2">{member.position}</p>
            {#if member.bio}
              <p class="text-sm text-gray-600 mb-4 line-clamp-3">{member.bio}</p>
            {/if}
            
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm text-gray-500">Urutan: {member.order || 0}</span>
              <span class="text-xs px-2 py-1 rounded-full
                {member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                {member.status}
              </span>
            </div>
            
            <div class="flex gap-2">
              <button
                onclick={() => handleEdit(member)}
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Edit
              </button>
              <button
                onclick={() => handleDelete(member.id)}
                disabled={deleting === member.id}
                class="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm"
              >
                {deleting === member.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
