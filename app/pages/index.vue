<script setup lang="ts">
import type { Product, Category, Brand } from '~/types'

// API Base URL
const API_BASE = 'http://e-commerce-laravel.test'

// State
const cartStore = useCartStore()

// Fetch featured products from API
const { data: productsData, pending: productsLoading } = await useFetch(`${API_BASE}/api/v1/products`)
const products = computed(() => productsData.value?.data || [])
const featuredProducts = computed(() => products.value.slice(0, 8))

// Fetch categories from API
const { data: categoriesData } = await useFetch(`${API_BASE}/api/v1/categories`)
const categories = computed(() => categoriesData.value?.data || [])

// Fetch brands from API
const { data: brandsData } = await useFetch(`${API_BASE}/api/v1/brands`)
const brands = computed(() => brandsData.value?.data || [])

// Initialize cart on mount
onMounted(() => {
  if (import.meta.client) {
    cartStore.initializeCart()
  }
})

// Meta tags
useHead({
  title: 'Home | Vela'
})
</script>

<template>
  <div class="min-h-screen bg-stone-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-stone-950 via-stone-900 to-stone-800 text-white py-20 lg:py-32">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full text-amber-600 text-sm font-medium mb-6">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 001-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"/>
            </svg>
            New Arrivals Available
          </div>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Discover Premium Products
          </h1>
          <p class="text-xl text-stone-300 mb-8">
            Shop the latest electronics, accessories, and more. Quality products at unbeatable prices.
          </p>
          <div class="flex flex-wrap gap-4">
            <NuxtLink
              to="/products"
              class="px-8 py-4 bg-white text-stone-950 rounded-xl hover:bg-stone-100 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-stone-950 inline-flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              Shop Now
            </NuxtLink>
            <NuxtLink
              to="/products"
              class="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-stone-950 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-stone-950"
            >
              Explore Collection
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="py-16 lg:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full text-amber-600 text-sm font-medium mb-4">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            Featured Products
          </div>
          <h2 class="text-3xl lg:text-4xl font-bold text-stone-950 mb-4">
            Trending Now
          </h2>
          <p class="text-lg text-stone-500 max-w-2xl mx-auto">
            Discover our handpicked selection of top products loved by our customers
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="productsLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          <div v-for="i in 8" :key="i" class="bg-stone-100 rounded-2xl h-96 animate-pulse"></div>
        </div>

        <!-- Products Grid -->
        <div v-else-if="featuredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 mb-12">
          <NuxtLink
            v-for="product in featuredProducts"
            :key="product.id"
            :to="`/products/${product.id}`"
            class="group"
          >
            <ProductCard :product="product" />
          </NuxtLink>
        </div>

        <div class="text-center mt-12">
          <NuxtLink
            to="/products"
            class="inline-flex items-center gap-2 px-8 py-4 bg-stone-950 text-white rounded-xl hover:bg-stone-900 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
          >
            View All Products
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-16 lg:py-24 bg-stone-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold text-stone-950 mb-4">
            Shop by Category
          </h2>
          <p class="text-lg text-stone-500 max-w-2xl mx-auto">
            Browse our wide range of categories to find exactly what you need
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink
            v-for="category in categories.slice(0, 4)"
            :key="category.id"
            :to="`/products?category=${category.id}`"
            class="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 aspect-[4/3]"
          >
            <img
              :src="`https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&h=300&fit=crop&sig=${category.id}`"
              :alt="category.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent flex items-end p-6">
              <h3 class="text-white text-xl font-bold">{{ category.name }}</h3>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Brands Section -->
    <section class="py-16 lg:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold text-stone-950 mb-4">
            Shop by Brand
          </h2>
          <p class="text-lg text-stone-500 max-w-2xl mx-auto">
            Explore products from your favorite brands
          </p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          <NuxtLink
            v-for="brand in brands.slice(0, 6)"
            :key="brand.id"
            :to="`/products?brand=${brand.id}`"
            class="group flex flex-col items-center justify-center p-6 bg-stone-100 rounded-xl hover:bg-stone-200 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
          >
            <div class="w-16 h-16 bg-stone-950 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <span class="text-white font-bold text-lg">{{ brand.name.charAt(0) }}</span>
            </div>
            <h3 class="text-stone-950 font-semibold text-center">{{ brand.name }}</h3>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 lg:py-24 bg-stone-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-stone-950 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-stone-950 mb-2">Free Shipping</h3>
            <p class="text-stone-500">On orders over $100</p>
          </div>

          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-stone-950 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-stone-950 mb-2">Secure Payment</h3>
            <p class="text-stone-500">100% secure transactions</p>
          </div>

          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-stone-950 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-stone-950 mb-2">Easy Returns</h3>
            <p class="text-stone-500">30-day return policy</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 lg:py-32">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full text-amber-600 text-sm font-medium mb-6">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          Join Thousands of Happy Customers
        </div>
        <h2 class="text-3xl lg:text-4xl font-bold text-stone-950 mb-4">
          Ready to Start Shopping?
        </h2>
        <p class="text-lg text-stone-500 mb-8 max-w-2xl mx-auto">
          Explore our collection and find exactly what you're looking for at the best prices.
        </p>
        <NuxtLink
          to="/products"
          class="inline-flex items-center gap-2 px-8 py-4 bg-stone-950 text-white rounded-xl hover:bg-stone-900 transition-colors font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
        >
          Browse All Products
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
