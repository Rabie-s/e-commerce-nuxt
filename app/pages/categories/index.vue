<script setup lang="ts">
interface Category {
  id: number
  name: string
  description: string | null
  main_image: string | null
}

// Fetch categories from API
const { data: categoriesData } = await useFetch<Category[]>('/categories/', {
  baseURL: useRuntimeConfig().public.apiBase,
  transform: (data: any) => data.data,
})

const categories = computed(() => categoriesData.value || [])

// Meta tags
useHead({
  title: 'Categories | Vela'
})
</script>

<template>
  <div class="min-h-screen bg-stone-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-stone-950">
          Categories
        </h1>
        <p class="mt-2 text-stone-500">
          Browse our collection of {{ categories.length }} categories
        </p>
      </div>

      <!-- Categories Grid -->
      <div v-if="categories.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="`/products?category=${category.id}`"
          class="group block"
        >
          <div class="bg-stone-100 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
            <!-- Category Image -->
            <div v-if="category.main_image" class="relative aspect-square bg-stone-50 overflow-hidden">
              <img
                :src="`http://e-commerce-laravel.test/${category.main_image}`"
                :alt="category.name"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div v-else class="relative aspect-square bg-stone-200 overflow-hidden flex items-center justify-center">
              <svg class="w-16 h-16 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>

            <!-- Category Info -->
            <div class="p-6">
              <h3 class="text-lg font-semibold text-stone-950 mb-2">
                {{ category.name }}
              </h3>
              <p v-if="category.description" class="text-sm text-stone-500 line-clamp-2">
                {{ category.description }}
              </p>
              <p v-else class="text-sm text-stone-400 italic">
                No description available
              </p>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- No Results -->
      <div v-else class="text-center py-20">
        <svg class="w-16 h-16 mx-auto text-stone-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
        <h3 class="text-xl font-semibold text-stone-950 mb-2">No categories found</h3>
        <p class="text-stone-500">Check back later for new categories</p>
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
