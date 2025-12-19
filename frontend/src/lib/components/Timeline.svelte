<script>
    import { timelineData } from '$lib/data/roadmap';
    import TimelineItem from './TimelineItem.svelte';
</script>

<section class="px-4 sm:px-6 md:px-12 lg:px-20 py-4 sm:py-5 pb-12 sm:pb-16 md:pb-20 max-w-5xl mx-auto w-full">
    <div class="relative">
        <!-- Vertical Line -->
        <div class="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 sm:w-1 bg-linear-to-b from-orange-400 via-orange-400 to-orange-400 rounded-full md:-ml-0.5"></div>
        
        <div class="flex flex-col gap-8 sm:gap-10 md:gap-12">
            {#each timelineData as item (item.year)}
                <TimelineItem {item} />
            {/each}
        </div>
    </div>
</section>