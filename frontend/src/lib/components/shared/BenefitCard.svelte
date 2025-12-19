<script>
  export let benefit;
</script>

<div class="group flex flex-col gap-5 rounded-4xl bg-white border border-sky-100 hover:border-primary p-8 shadow-card hover:shadow-playful transition-all duration-300 transform hover:-translate-y-2">
  <div class="size-16 rounded-2xl bg-sky-50 group-hover:bg-primary/20 flex items-center justify-center text-primary transition-colors">
    <span class="material-symbols-outlined text-[32px]">{benefit.icon}</span>
  </div>
  
  <div>
    <h3 class="text-sky-900 text-xl font-bold mb-2">{benefit.title}</h3>
    <p class="text-text-muted text-sm leading-relaxed">{benefit.description}</p>
  </div>
</div>
