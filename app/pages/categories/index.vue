<script setup lang="ts">
interface Category {
  id: number
  name: string
  description: string | null
  main_image: string | null
  slug?: string
}

const config = useRuntimeConfig()

// Fetch categories from API
const { data: categoriesData } = await useFetch<Category[]>('/categories/', {
  baseURL: config.public.apiBase,
  transform: (data: any) => data.data,
})

const categories = computed(() => categoriesData.value || [])

// Helper to handle Image URLs (Relative vs Absolute)
const getImageUrl = (path: string | null) => {
  if (!path) return 'https://via.placeholder.com/600x800?text=No+Image'
  if (path.startsWith('http')) return path
  // Construct URL using storage base or API base
  // Assuming your previous pattern: config.public.storage or apiBase
  return `${config.public.storage || config.public.apiBase.replace('/api/v1', '')}/${path}`
}


useHead({
  title: 'Collections | Gallery Luxe'
})
</script>

<template>
  <div class="min-h-screen bg-[#f8f9fa]" style="font-family: 'Inter', sans-serif;">

    <!-- Main Container -->
    <div class="max-w-7xl mx-auto px-8 py-16">

      <!-- Page Header -->
      <div class="text-center mb-16">
        <h1
            class="text-[40px] md:text-[48px] font-semibold tracking-[-0.025em] text-[#191c1d] mb-4"
            style="font-family: 'Manrope', sans-serif;"
        >
          Collections
        </h1>
        <p class="text-[15px] text-[#191c1d]/60 max-w-lg mx-auto leading-relaxed">
          Discover our curated selection of exceptional design pieces.
        </p>
      </div>

      <!-- Categories Grid (Masonry Layout) -->
      <!-- Using CSS columns for the masonry effect -->
      <div v-if="categories.length > 0" class="columns-1 md:columns-2 gap-6 space-y-6 mb-24">

        <NuxtLink
            v-for="(category, index) in categories"
            :key="category.id"
            :to="`/products?category=${category.id}`"
            class="group block relative break-inside-avoid overflow-hidden rounded-2xl shadow-sm transition-all duration-500 hover:shadow-xl"
        >
          <!-- Image Container -->
          <div
              class="relative w-full overflow-hidden bg-gray-100"
              :class="{
              'aspect-[4/3]': index === 0, /* First item landscape */
              'aspect-[4/5]': index !== 0  /* Others portrait */
            }"
          >
            <img
                :src="getImageUrl(category.main_image)"
                :alt="category.name"
                class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
            />

            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
          </div>

          <!-- Text Overlay (Bottom Left) -->
          <div class="absolute bottom-0 left-0 right-0 p-6 z-10">
            <h3
                class="text-xl font-semibold text-white mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                style="font-family: 'Manrope', sans-serif;"
            >
              {{ category.name }}
            </h3>
            <p v-if="category.description" class="text-sm text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-2">
              {{ category.description }}
            </p>
          </div>
        </NuxtLink>

      </div>

      <!-- No Results -->
      <div v-else class="text-center py-20">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-[#f3f4f5] rounded-2xl mb-6">
          <svg class="w-7 h-7 text-[#191c1d]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-[#191c1d] mb-2" style="font-family: 'Manrope', sans-serif;">
          No collections found
        </h3>
        <p class="text-sm text-[#191c1d]/40">
          Check back later for new categories
        </p>
      </div>

    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>