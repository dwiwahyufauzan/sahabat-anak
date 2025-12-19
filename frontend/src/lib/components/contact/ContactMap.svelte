<script lang="ts">
    export let embedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d495.4440054808443!2d107.78401797596274!3d-6.578075784468387!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e693b4130dcd33f%3A0xb8f2d91a2faaa0fe!2sUniversitas%20Subang!5e0!3m2!1sid!2sid!4v1766034660648!5m2!1sid!2sid';
    export let mapAlt = 'Map showing location of Sahabat Anak';
    export let mapLink = 'https://maps.google.com/?q=Universitas+Subang';
</script>

<div class="h-112.5 w-full rounded-3xl overflow-hidden shadow-lg relative group">
    <iframe 
        src={embedUrl}
        title={mapAlt}
        class="w-full h-full border-0"
        allowfullscreen
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
    </iframe>
    <a 
        href={mapLink}
        target="_blank"
        rel="noopener noreferrer"
        class="absolute bottom-4 right-4 bg-white dark:bg-[#2a221b] text-[#181411] dark:text-white text-xs font-bold py-2 px-4 rounded-lg shadow-md hover:bg-primary hover:text-white transition-colors flex items-center gap-2 z-10">
        <span>Buka di Peta</span>
        <span class="material-symbols-outlined text-[16px]">open_in_new</span>
    </a>
</div>