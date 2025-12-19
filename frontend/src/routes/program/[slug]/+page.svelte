<script lang="ts">
  import { page } from '$app/stores';
  import { getProgramBySlug } from '$lib/data/programs';
  
  const slug = $page.params.slug || '';
  const program = getProgramBySlug(slug);
  
  const categoryColors = {
    blue: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50' },
    orange: { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-50' },
    green: { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-50' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-50' }
  };
  
  const getColorClasses = (color: string) => categoryColors[color as keyof typeof categoryColors] || categoryColors.blue;
</script>

{#if !program}
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">Program tidak ditemukan</h1>
      <a href="/" class="text-blue-600 hover:underline">Kembali ke beranda</a>
    </div>
  </div>
{:else}
  <div class="min-h-screen">
    <!-- Hero Section dengan floating SVG -->
    <div class="relative overflow-hidden bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 pb-20">
      <!-- Background floating circles -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 right-10 w-96 h-96 bg-linear-to-br from-blue-300/20 to-indigo-300/20 rounded-full blur-3xl"></div>
        <div class="absolute bottom-40 left-20 w-80 h-80 bg-linear-to-br from-purple-300/15 to-pink-300/15 rounded-full blur-3xl"></div>
        <div class="absolute top-1/3 right-1/3 w-72 h-72 bg-linear-to-br from-cyan-300/10 to-blue-300/10 rounded-full blur-3xl"></div>
      </div>
      
      <!-- Floating SVG Icons -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute top-32 left-10 opacity-20">
          <svg class="w-16 h-16 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l2.163 5.837L20 10l-5.837 2.163L12 18l-2.163-5.837L4 10l5.837-2.163L12 2z"/>
          </svg>
        </div>
        
        <div class="absolute top-20 right-20 opacity-25">
          <svg class="w-12 h-12 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        
        <div class="absolute bottom-40 right-32 opacity-15">
          <svg class="w-20 h-20 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
        </div>
        
        <div class="absolute top-1/2 left-32 opacity-20">
          <svg class="w-14 h-14 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        </div>
        
        <div class="absolute bottom-20 left-1/4 opacity-25">
          <svg class="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        
        <div class="absolute top-2/3 right-1/4 opacity-20">
          <svg class="w-12 h-12 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0l2.163 5.837L20 8l-5.837 2.163L12 16l-2.163-5.837L4 8l5.837-2.163L12 0z"/>
            <path d="M19 14l1.081 2.919L23 18l-2.919 1.081L19 22l-1.081-2.919L15 18l2.919-1.081L19 14z"/>
          </svg>
        </div>
      </div>
      
      <div class="container mx-auto px-4 pt-24 relative z-10">
        <div class="max-w-5xl mx-auto">
          <!-- Breadcrumb -->
          <div class="mb-6 flex items-center gap-2 text-sm text-slate-600">
            <a href="/" class="hover:text-blue-600 transition-colors">Beranda</a>
            <span>/</span>
            <a href="/program" class="hover:text-blue-600 transition-colors">Program</a>
            <span>/</span>
            <span class="font-semibold">{program.title}</span>
          </div>
          
          <!-- Category Badge -->
          <div class="mb-6">
            <span class={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm ${getColorClasses(program.categoryColor).light} ${getColorClasses(program.categoryColor).text}`}>
              <span class="material-icons text-lg">{program.icon}</span>
              {program.category.charAt(0).toUpperCase() + program.category.slice(1)}
            </span>
          </div>
          
          <!-- Title & Description -->
          <h1 class="text-4xl md:text-6xl font-black text-slate-900 mb-6 text-balance">{program.title}</h1>
          <p class="text-xl text-slate-700 mb-8 leading-relaxed text-pretty max-w-3xl">{program.fullDescription}</p>
          
          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 mb-12">
            <button class={`group px-8 py-4 rounded-2xl ${getColorClasses(program.categoryColor).bg} text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden`}>
              <span class="relative z-10 flex items-center gap-2">
                <span class="material-icons">volunteer_activism</span>
                Bergabung Sekarang
              </span>
            </button>
            <button class="px-8 py-4 rounded-2xl bg-white border-2 border-slate-300 text-slate-700 font-bold text-lg hover:border-slate-400 hover:bg-slate-50 transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2">
              <span class="material-icons">share</span>
              Bagikan Program
            </button>
          </div>
        </div>
      </div>
      
      <!-- Hero Image -->
      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-5xl mx-auto">
          <div class="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
            <img src={program.heroImage || "/placeholder.svg"} alt={program.alt} class="w-full h-100 md:h-125 object-cover" />
            <div class="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Impact Stats -->
    <div class="container mx-auto px-4 -mt-12 relative z-20 mb-20">
      <div class="max-w-5xl mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          {#each program.impact as stat}
            <div class="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div class="flex items-center gap-3 mb-2">
                <span class={`material-icons text-3xl ${getColorClasses(program.categoryColor).text}`}>{stat.icon}</span>
              </div>
              <div class="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
              <div class="text-sm text-slate-600 font-medium">{stat.label}</div>
            </div>
          {/each}
        </div>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="container mx-auto px-4 pb-20">
      <div class="max-w-5xl mx-auto">
        <div class="grid lg:grid-cols-3 gap-12">
          <!-- Left Column - Main Content -->
          <div class="lg:col-span-2 space-y-12">
            <!-- Objectives -->
            <section class="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-slate-100">
              <h2 class="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span class="material-icons text-4xl text-blue-600">flag</span>
                Tujuan Program
              </h2>
              <ul class="space-y-4">
                {#each program.objectives as objective}
                  <li class="flex items-start gap-3">
                    <span class={`material-icons text-2xl ${getColorClasses(program.categoryColor).text} mt-1 shrink-0`}>check_circle</span>
                    <span class="text-lg text-slate-700 leading-relaxed">{objective}</span>
                  </li>
                {/each}
              </ul>
            </section>
            
            <!-- Activities -->
            <section class="bg-linear-to-br from-slate-50 to-blue-50 rounded-3xl p-8 md:p-10 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
              <h2 class="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3 relative z-10">
                <span class="material-icons text-4xl text-purple-600">widgets</span>
                Kegiatan Utama
              </h2>
              <div class="grid md:grid-cols-2 gap-6 relative z-10">
                {#each program.activities as activity}
                  <div class="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-slate-100">
                    <div class={`w-14 h-14 rounded-xl ${getColorClasses(program.categoryColor).bg} flex items-center justify-center mb-4`}>
                      <span class="material-icons text-2xl text-white">{activity.icon}</span>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2">{activity.title}</h3>
                    <p class="text-slate-600 leading-relaxed">{activity.description}</p>
                  </div>
                {/each}
              </div>
            </section>
            
            <!-- Testimonials -->
            {#if program.testimonials && program.testimonials.length > 0}
              <section class="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-slate-100">
                <h2 class="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                  <span class="material-icons text-4xl text-orange-600">format_quote</span>
                  Testimoni
                </h2>
                <div class="space-y-6">
                  {#each program.testimonials as testimonial}
                    <div class="bg-linear-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300">
                      <div class="flex items-start gap-4 mb-4">
                        <img src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} class="w-16 h-16 rounded-full border-4 border-white shadow-lg" />
                        <div>
                          <h4 class="font-bold text-slate-900 text-lg">{testimonial.name}</h4>
                          <p class="text-sm text-slate-600">{testimonial.role}</p>
                        </div>
                      </div>
                      <p class="text-slate-700 leading-relaxed italic">"{testimonial.quote}"</p>
                    </div>
                  {/each}
                </div>
              </section>
            {/if}
          </div>
          
          <!-- Right Column - Sidebar -->
          <div class="space-y-6">
            <!-- Program Info Card -->
            <div class="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 sticky top-6">
              <h3 class="text-2xl font-black text-slate-900 mb-6">Info Program</h3>
              
              <div class="space-y-6">
                <!-- Target Audience -->
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <span class="material-icons text-blue-600">people</span>
                    <h4 class="font-bold text-slate-900">Target Peserta</h4>
                  </div>
                  <p class="text-slate-700 text-sm leading-relaxed">{program.targetAudience}</p>
                </div>
                
                <div class="border-t border-slate-200"></div>
                
                <!-- Schedule -->
                <div>
                  <div class="flex items-center gap-2 mb-3">
                    <span class="material-icons text-purple-600">event</span>
                    <h4 class="font-bold text-slate-900">Jadwal</h4>
                  </div>
                  <div class="space-y-2">
                    <div class="flex items-start gap-2">
                      <span class="material-icons text-sm text-slate-400 mt-0.5">schedule</span>
                      <p class="text-slate-700 text-sm">{program.schedule.frequency}</p>
                    </div>
                    <div class="flex items-start gap-2">
                      <span class="material-icons text-sm text-slate-400 mt-0.5">hourglass_empty</span>
                      <p class="text-slate-700 text-sm">{program.schedule.duration}</p>
                    </div>
                  </div>
                </div>
                
                <div class="border-t border-slate-200"></div>
                
                <!-- Locations -->
                <div>
                  <div class="flex items-center gap-2 mb-3">
                    <span class="material-icons text-green-600">location_on</span>
                    <h4 class="font-bold text-slate-900">Lokasi</h4>
                  </div>
                  <ul class="space-y-2">
                    {#each program.locations as location}
                      <li class="flex items-start gap-2">
                        <span class="material-icons text-sm text-slate-400 mt-0.5">place</span>
                        <span class="text-slate-700 text-sm">{location}</span>
                      </li>
                    {/each}
                  </ul>
                </div>
              </div>
              
              <button class={`w-full mt-8 px-6 py-4 rounded-2xl ${getColorClasses(program.categoryColor).bg} text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2`}>
                <span class="material-icons">contact_mail</span>
                Daftar Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Material Icons -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
