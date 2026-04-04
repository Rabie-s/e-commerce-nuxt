<script setup lang="ts">
interface Brand {
  id: number
  name: string
  description: string | null
  main_image: string | null
}

// Fetch brands from API
const { data: brandsData } = await useFetch<Brand[]>('/brands', {
  baseURL: useRuntimeConfig().public.apiBase,
  transform: (data: any) => data.data,
})

const brands = computed(() => brandsData.value || [])

// Meta tags
useHead({
  title: 'Brands | MyStore'
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
          Brands
        </h1>
        <p class="mt-2 text-gray-600">
          Browse our collection of {{ brands.length }} brands
        </p>
      </div>

      <!-- Brands Grid -->
      <div v-if="brands.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <NuxtLink
          v-for="brand in brands"
          :key="brand.id"
          :to="`/products?brand=${brand.id}`"
          class="group block"
        >
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
            <!-- Brand Image -->
            <div v-if="brand.main_image" class="relative aspect-square bg-gray-100 overflow-hidden">
              <img
                :src="`http://e-commerce-laravel.test/${brand.main_image}`"
                :alt="brand.name"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            <!-- Brand Info -->
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ brand.name }}
              </h3>
              <p v-if="brand.description" class="text-sm text-gray-600 line-clamp-2">
                {{ brand.description }}
              </p>
              <p v-else class="text-sm text-gray-400 italic">
                No description available
              </p>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- No Results -->
      <div v-else class="text-center py-20">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No brands found</h3>
        <p class="text-gray-600">Check back later for new brands</p>
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
