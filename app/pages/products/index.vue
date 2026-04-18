<script setup lang="ts">
import type { Product, Category, Brand } from '~/types'

const config = useRuntimeConfig()

// --- State ---
const selectedCategory = ref<number | null>(null)
const selectedBrand = ref<number | null>(null)
const selectedPriceRange = ref<string | null>(null)
const currentPage = ref(1)

const priceRanges = [
  { label: 'All Prices', value: null },
  { label: 'Under $500', value: '0-500' },
  { label: '$500 - $1,000', value: '500-1000' },
  { label: '$1,000 - $2,000', value: '1000-2000' },
  { label: '$2,000 & Above', value: '2000+' },
]

// --- API Fetches ---
const { data: productsData } = await useFetch('products', {
  baseURL: config.public.apiBase,
  query: computed(() => ({
    page: currentPage.value,
    ...(selectedCategory.value && { category_id: selectedCategory.value }),
    ...(selectedBrand.value && { brand_id: selectedBrand.value }),
    ...(selectedPriceRange.value && { price_range: selectedPriceRange.value }),
  })),
})

const { data: brandsData } = await useFetch('brands', {
  baseURL: config.public.apiBase,
})

const { data: categoriesData } = await useFetch('categories', {
  baseURL: config.public.apiBase,
})

// --- Computed ---
const products  = computed<Product[]>(() => productsData.value?.data ?? [])
const categories = computed<Category[]>(() => categoriesData.value?.data ?? [])
const brands     = computed<Brand[]>(() => brandsData.value?.data ?? [])

// Your API wraps meta values in arrays, so we read index [0]
const lastPage = computed<number>(() => productsData.value?.meta?.last_page?.[0] ?? 1)

const isFilterActive = computed(() =>
    selectedCategory.value || selectedBrand.value || selectedPriceRange.value
)

// --- Actions ---
const clearFilters = () => {
  selectedCategory.value = null
  selectedBrand.value = null
  selectedPriceRange.value = null
}

// Reset to page 1 whenever a filter changes
watch([selectedCategory, selectedBrand, selectedPriceRange], () => {
  currentPage.value = 1
})

useHead({ title: 'Objects of Desire | Gallery' })
</script>

<template>
  <div class="min-h-screen bg-[#f8f9fa] flex flex-col" style="font-family: 'Inter', sans-serif;">
    <div class="flex-1 max-w-7xl mx-auto px-8 py-12 w-full">

      <!-- Page Header -->
      <div class="mb-12">
        <p class="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#191c1d]/40 mb-4">
          The Collection
        </p>
        <h1
            class="text-[40px] lg:text-[48px] font-semibold leading-[1.1] tracking-[-0.025em] text-[#191c1d] mb-3"
            style="font-family: 'Manrope', sans-serif;"
        >
          Objects of Desire.
        </h1>
        <p class="text-[14px] leading-[1.75] text-[#191c1d]/50 max-w-xl">
          Modern living essentials for the contemporary home.
        </p>
      </div>

      <!-- Filter Toolbar -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-[#191c1d]/10">

        <!-- Category Pills -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 -mb-2 sm:mb-0 w-full sm:w-auto">
          <UiButton
              @click="selectedCategory = null"
              :variant="selectedCategory === null ? 'primary' : 'outlined'"
              size="sm"
              class="whitespace-nowrap"
          >
            All Objects
          </UiButton>
          <UiButton
              v-for="category in categories"
              :key="category.id"
              @click="selectedCategory = category.id"
              :variant="selectedCategory === category.id ? 'primary' : 'outlined'"
              size="sm"
              class="whitespace-nowrap"
          >
            {{ category.name }}
          </UiButton>
        </div>

        <!-- Right Filters -->
        <div class="flex items-center gap-3 w-full sm:w-auto">

          <Transition name="fade">
            <button
                v-if="isFilterActive"
                @click="clearFilters"
                class="text-xs font-semibold text-red-500 hover:text-red-600 whitespace-nowrap transition-colors"
            >
              Clear All
            </button>
          </Transition>

          <!-- Price Filter -->
          <div class="relative w-full sm:w-40">
            <select
                v-model="selectedPriceRange"
                class="w-full pl-4 pr-8 py-2.5 bg-white border border-[#191c1d]/10 rounded-xl text-sm text-[#191c1d] appearance-none cursor-pointer focus:outline-none focus:border-[#191c1d]/30 transition-colors"
            >
              <option v-for="range in priceRanges" :key="String(range.value)" :value="range.value">
                {{ range.label }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-[#191c1d]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>

          <!-- Brand Filter -->
          <div class="relative w-full sm:w-48">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-[#191c1d]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <select
                v-model="selectedBrand"
                class="w-full pl-9 pr-8 py-2.5 bg-white border border-[#191c1d]/10 rounded-xl text-sm text-[#191c1d] appearance-none cursor-pointer focus:outline-none focus:border-[#191c1d]/30 transition-colors"
            >
              <option :value="null">All Designers</option>
              <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                {{ brand.name }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-[#191c1d]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>

        </div>
      </div>

      <!-- Products Grid -->
      <div v-if="products.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 mb-16">
          <UiProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
          />
        </div>

        <!-- Pagination -->
        <div v-if="lastPage > 1" class="flex justify-center items-center gap-8">
          <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="p-2 rounded-full hover:bg-[#f3f4f5] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-5 h-5 text-[#191c1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>

          <p class="text-xs font-semibold text-[#191c1d] tracking-widest uppercase">
            Page {{ currentPage }} of {{ lastPage }}
          </p>

          <button
              @click="currentPage = Math.min(lastPage, currentPage + 1)"
              :disabled="currentPage === lastPage"
              class="p-2 rounded-full hover:bg-[#f3f4f5] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-5 h-5 text-[#191c1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- No Results -->
      <div v-else class="text-center py-24">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-[#f3f4f5] rounded-2xl mb-6">
          <svg class="w-7 h-7 text-[#191c1d]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-[#191c1d] mb-2" style="font-family: 'Manrope', sans-serif;">
          No objects found
        </h3>
        <p class="text-sm text-[#191c1d]/40 mb-6 max-w-sm mx-auto">
          We couldn't find any products matching your current filters.
        </p>
        <UiButton variant="primary" @click="clearFilters">
          Clear Filters
        </UiButton>
      </div>

    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>