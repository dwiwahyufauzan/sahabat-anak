<script>
  import VolunteerHero from '$lib/components/volunteer/VolunteerHero.svelte';
  import BenefitsSection from '$lib/components/volunteer/BenefitsSection.svelte';
  import VolunteerForm from '$lib/components/volunteer/VolunteerForm.svelte';
</script>

<svelte:head>
  <title>Halaman Jadi Relawan - Sahabat Anak</title>
  <meta name="description" content="Bergabunglah dengan ribuan relawan Sahabat Anak. Waktu dan kepedulian Anda dapat mengubah masa depan seorang anak." />
</svelte:head>

<div class="bg-background-light text-text-main overflow-x-hidden min-h-screen flex flex-col selection:bg-primary selection:text-white">

  <main class="grow flex flex-col items-center w-full">
    <VolunteerHero />
    <BenefitsSection />
    <VolunteerForm />
  </main>
</div>
