<script>
	import "./app.css";
  import { onMount } from 'svelte';
  import { navigating } from '$app/stores';
  import Header from '$lib/components/Navigation.svelte';
  import Footer from '$lib/components/Footer.svelte';
  
  let pageVisible = false;
  
  $: if ($navigating) {
    pageVisible = false;
  } else {
    setTimeout(() => {
      pageVisible = true;
    }, 50);
  }
  
  onMount(() => {
    pageVisible = true;
  });
</script>

<div class="flex flex-col min-h-screen">

  <!-- Header -->
  <Header />

  <!-- Main content -->
  <main class="flex-1 bg-background-light {pageVisible ? 'animate-fade-in' : 'opacity-0'}">
    <slot />
  </main>

  <!-- Footer -->
  <Footer />

</div>
