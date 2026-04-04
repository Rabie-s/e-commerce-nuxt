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
  title: 'Products | MyStore'
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
          Products
        </h1>
        <p class="mt-2 text-gray-600">
          Browse our collection of {{ total }} products
        </p>
      </div>

      <!-- Filters Section -->
      <div class="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div class="relative">
              <input
                id="search"
                v-model="searchQuery"
                type="text"
                placeholder="Search products..."
                class="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- Category Filter -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="category"
              v-model="selectedCategory"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white"
            >
              <option :value="null">All Categories</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <!-- Brand Filter -->
          <div>
            <label for="brand" class="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <select
              id="brand"
              v-model="selectedBrand"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white"
            >
              <option :value="null">All Brands</option>
              <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                {{ brand.name }}
              </option>
            </select>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-end gap-2">
            <button
              @click="applyFilters"
              class="flex-1 px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Apply
            </button>
            <button
              @click="resetFilters"
              class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-if="paginatedProducts.length > 0">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <div v-if="lastPage > 1" class="flex justify-center items-center gap-2">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span class="text-gray-600">
            Page {{ currentPage }} of {{ lastPage }}
          </span>
          <button
            @click="currentPage = Math.min(lastPage, currentPage + 1)"
            :disabled="currentPage === lastPage"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      <!-- No Results -->
      <div v-else class="text-center py-20">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
        <p class="text-gray-600">Try adjusting your filters or search query</p>
        <button
          @click="resetFilters"
          class="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          Clear Filters
        </button>
      </div>
    </div>
  </div>
</template>
