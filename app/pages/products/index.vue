<script setup lang="ts">
import type { Product, Category, Brand } from '~/types'

// State
const searchQuery = ref('')
const selectedCategory = ref<number | null>(null)
const selectedBrand = ref<number | null>(null)



// Mock data (should be replaced with API call)
const products = ref<Product[]>([

])

const { data } = await useFetch('/products/', {
  baseURL: useRuntimeConfig().public.apiBase,
})
products.value = data.value.data

// Fetch categories from API
const { data: categoriesData } = await useFetch('/categories/', {
  baseURL: useRuntimeConfig().public.apiBase,
})
const categories = computed(() => categoriesData.value?.data || [])

// Fetch brands from API
const { data: brandsData } = await useFetch('/brands', {
  baseURL: useRuntimeConfig().public.apiBase,
})
const brands = computed(() => brandsData.value?.data || [])

// Pagination
const currentPage = ref(1)
const itemsPerPage = 8

// Cart store
const cartStore = useCartStore()

// Initialize cart on mount
onMounted(() => {
  if (import.meta.client) {
    cartStore.initializeCart()
  }
})

// Filtered products (computed for reactivity)
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = !searchQuery.value || product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || product.category.id === selectedCategory.value
    const matchesBrand = !selectedBrand.value || product.brand.id === selectedBrand.value
    return matchesSearch && matchesCategory && matchesBrand
  })
})

// Total count
const total = computed(() => filteredProducts.value.length)

// Last page calculation
const lastPage = computed(() => Math.ceil(total.value / itemsPerPage))

// Paginated products
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

// Apply filters (resets to page 1)
function applyFilters() {
  currentPage.value = 1
  // Filters are reactive via computed
}

// Reset filters
function resetFilters() {
  searchQuery.value = ''
  selectedCategory.value = null
  selectedBrand.value = null
  currentPage.value = 1
}

// Watch for filter changes to reset pagination
watch([selectedCategory, selectedBrand, searchQuery], () => {
  currentPage.value = 1
})


// Meta tags
useHead({
  title: 'Products | Vela'
})
</script>

<template>
  <div class="min-h-screen bg-stone-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Page Header -->
      <div class="mb-12 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full text-amber-600 text-sm font-medium mb-4">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 001-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"/>
          </svg>
          Shop Our Collection
        </div>
        <h1 class="text-5xl font-bold text-stone-950 mb-4">
          Discover Products
        </h1>
        <p class="text-lg text-stone-500 max-w-2xl mx-auto">
          Explore our curated collection of <span class="font-semibold text-stone-900">{{ total }}</span> premium products
        </p>
      </div>

      <!-- Filters Section -->
      <div class="bg-stone-100 rounded-3xl p-8 mb-10 border border-stone-200">
        <div class="flex items-center gap-2 mb-6">
          <svg class="w-5 h-5 text-stone-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
          </svg>
          <h2 class="text-lg font-semibold text-stone-900">Filter Products</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-5">
          <!-- Search -->
          <div class="md:col-span-1">
            <label for="search" class="block text-sm font-semibold text-stone-900 mb-2">Search</label>
            <div class="relative group">
              <input
                id="search"
                v-model="searchQuery"
                type="text"
                placeholder="Search products..."
                class="w-full px-4 py-3 pl-11 bg-white border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-all duration-200 group-hover:border-stone-300 outline-none"
              />
              <svg class="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-stone-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- Category Filter -->
          <div>
            <label for="category" class="block text-sm font-semibold text-stone-900 mb-2">Category</label>
            <div class="relative">
              <select
                id="category"
                v-model="selectedCategory"
                class="w-full px-4 py-3 bg-white border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-all duration-200 appearance-none cursor-pointer hover:border-stone-300 outline-none"
              >
                <option :value="null">All Categories</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
              <svg class="w-5 h-5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>

          <!-- Brand Filter -->
          <div>
            <label for="brand" class="block text-sm font-semibold text-stone-900 mb-2">Brand</label>
            <div class="relative">
              <select
                id="brand"
                v-model="selectedBrand"
                class="w-full px-4 py-3 bg-white border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-all duration-200 appearance-none cursor-pointer hover:border-stone-300 outline-none"
              >
                <option :value="null">All Brands</option>
                <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                  {{ brand.name }}
                </option>
              </select>
              <svg class="w-5 h-5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-end gap-3">
            <button
              @click="applyFilters"
              class="flex-1 px-6 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-700 transition-all duration-200 font-semibold transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Apply
            </button>
            <button
              @click="resetFilters"
              class="px-6 py-3 bg-white text-stone-900 rounded-xl hover:bg-stone-200 transition-all duration-200 font-semibold border-2 border-stone-200 hover:border-stone-300"
            >
              Reset
            </button>
          </div>
        </div>

        <!-- Active Filters Display -->
        <div v-if="selectedCategory || selectedBrand || searchQuery" class="mt-6 pt-6 border-t border-stone-200">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-sm font-medium text-stone-500">Active filters:</span>
            <span v-if="searchQuery" class="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full text-sm font-medium">
              Search: {{ searchQuery }}
              <button @click="searchQuery = ''" class="hover:text-amber-700">&times;</button>
            </span>
            <span v-if="selectedCategory" class="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full text-sm font-medium">
              {{ categories.find(c => c.id === selectedCategory)?.name }}
              <button @click="selectedCategory = null" class="hover:text-amber-700">&times;</button>
            </span>
            <span v-if="selectedBrand" class="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full text-sm font-medium">
              {{ brands.find(b => b.id === selectedBrand)?.name }}
              <button @click="selectedBrand = null" class="hover:text-amber-700">&times;</button>
            </span>
          </div>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-if="paginatedProducts.length > 0">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 mb-10">
          <NuxtLink
            v-for="product in paginatedProducts"
            :key="product.id"
            :to="`/products/${product.id}`"
            class="group"
          >
            <ProductCard :product="product" />
          </NuxtLink>
        </div>

        <!-- Pagination -->
        <div v-if="lastPage > 1" class="flex justify-center items-center gap-3">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-5 py-2.5 bg-white border-2 border-stone-200 rounded-xl hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 font-medium text-stone-900 hover:border-stone-300 shadow-sm disabled:hover:bg-white disabled:hover:border-stone-200 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Previous
          </button>

          <div class="flex items-center gap-2">
            <button
              v-for="page in Array.from({ length: lastPage }, (_, i) => i + 1)"
              :key="page"
              @click="currentPage = page"
              :class="[
                'w-10 h-10 rounded-xl font-semibold transition-all duration-200',
                currentPage === page
                  ? 'bg-stone-900 text-white shadow-lg'
                  : 'bg-white text-stone-900 hover:bg-stone-100 border-2 border-stone-200 hover:border-stone-300'
              ]"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="currentPage = Math.min(lastPage, currentPage + 1)"
            :disabled="currentPage === lastPage"
            class="px-5 py-2.5 bg-white border-2 border-stone-200 rounded-xl hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 font-medium text-stone-900 hover:border-stone-300 shadow-sm disabled:hover:bg-white disabled:hover:border-stone-200 flex items-center gap-2"
          >
            Next
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- No Results -->
      <div v-else class="text-center py-24">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-stone-100 rounded-3xl mb-6">
          <svg class="w-10 h-10 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-stone-950 mb-3">No products found</h3>
        <p class="text-stone-500 mb-6 max-w-md mx-auto">We couldn't find any products matching your criteria. Try adjusting your filters or search query.</p>
        <button
          @click="resetFilters"
          class="inline-flex items-center gap-2 px-8 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-700 transition-all duration-200 font-semibold transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Clear All Filters
        </button>
      </div>
    </div>
  </div>
</template>
