<script lang="ts">
  export let value: string = '';
  export let placeholder: string = 'Tulis deskripsi di sini...';
  export let id: string = 'editor';
</script>

<textarea
  {id}
  bind:value
  {placeholder}
  rows="8"
  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-900"
></textarea>

<style>
  textarea::placeholder {
    color: #94a3b8;
  }
</style>
