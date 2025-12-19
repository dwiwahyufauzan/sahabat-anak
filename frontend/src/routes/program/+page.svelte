<script>
  import Filters from '$lib/components/Filters.svelte';
  import ProgramGrid from '$lib/components/ProgramGrid.svelte';
  import VolunteerCTA from '$lib/components/VolunteerCTA.svelte';
</script>

<svelte:head>
  <title>Halaman Program - Sahabat Anak</title>
  <meta name="description" content="Beragam inisiatif untuk memberikan perlindungan, pendidikan, dan hak-hak dasar bagi anak-anak marjinal Indonesia." />
</svelte:head>


<main class="flex flex-col w-full">
  <Filters />
  <ProgramGrid />
  <VolunteerCTA />
</main>

