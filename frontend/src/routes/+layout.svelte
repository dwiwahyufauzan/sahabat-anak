<script>
	import "./app.css";
  import { onMount } from 'svelte';
  import { navigating, page } from '$app/stores';
  import Header from '$lib/components/Navigation.svelte';
  import Footer from '$lib/components/Footer.svelte';
  
  let pageVisible = false;
  
  // Check if current page is admin
  $: isAdminPage = $page.url.pathname.startsWith('/admin');
  
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
  {#if !isAdminPage}
    <!-- Header -->
    <Header />
  {/if}

  <!-- Main content -->
  <main class="flex-1 {isAdminPage ? '' : 'bg-background-light'} {pageVisible ? 'animate-fade-in' : 'opacity-0'}">
    <slot />
  </main>

  {#if !isAdminPage}
    <!-- Footer -->
    <Footer />
  {/if}
</div>
