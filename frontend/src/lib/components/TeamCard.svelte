<script>
  export let name;
  export let role;
  export let image;
</script>

<div class="flex flex-col items-center text-center">
  <div
    class="w-32 h-32 rounded-full mb-4 bg-cover bg-center border-2 border-primary"
    style="background-image: url('{image}')"
  ></div>
  <h3 class="text-white font-bold">{name}</h3>
  <p class="text-primary text-sm">{role}</p>
</div>
