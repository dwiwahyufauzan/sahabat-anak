<script>
    import Header from '$lib/components/Header.svelte';
    import HeroSection from '$lib/components/HeroSection.svelte';
    import DonationForm from '$lib/components/DonationForm.svelte';
</script>

<svelte:head>
    <title>Sahabat Anak - Halaman Donasi</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
    
    <main class="flex flex-col lg:flex-row flex-1 max-w-360 mx-auto w-full">
        <HeroSection />
        <DonationForm />
    </main>
</div>
