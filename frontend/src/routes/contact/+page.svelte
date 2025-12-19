<script>
    import PageHero from '$lib/components/shared/PageHero.svelte';
    import ContactForm from '$lib/components/contact/ContactForm.svelte';
    import ContactInfo from '$lib/components/contact/ContactInfo.svelte';
    import ContactMap from '$lib/components/contact/ContactMap.svelte';
</script>

<svelte:head>
    <title>Kontak Kami - Sahabat Anak</title>
    <meta name="description" content="Hubungi Sahabat Anak untuk pertanyaan, kolaborasi, atau informasi lebih lanjut tentang program kami." />
</svelte:head>

<div class="min-h-screen flex flex-col">

    
    <PageHero 
        title="Hubungi Kami"
        description="Mari terhubung! Kami siap mendengar pertanyaan, saran, atau kolaborasi Anda untuk masa depan anak-anak Indonesia."
        backgroundImage="/src/lib/assets/HeroKontak.jpg"
        backgroundAlt="Children laughing and playing together outdoors" />
    
    <!-- Main Content -->
    <main class="layout-container flex flex-col items-center grow -mt-20 z-30 px-4 md:px-10 pb-20">
        <div class="w-full max-w-300 flex flex-col lg:flex-row gap-8">
            <!-- Left: Contact Form -->
            <ContactForm />
            
            <!-- Right: Info & Map -->
            <div class="w-full lg:w-100 flex flex-col gap-6">
                <ContactInfo />
                <ContactMap />
            </div>
        </div>
    </main>
</div>
