<script setup lang="ts">
import type { Product } from '~/types'

// Featured products data
const featuredProducts = ref<Product[]>([
  {
    id: 1,
    name: 'Samsung Galaxy A54 5G',
    description: 'Experience the future with Samsung Galaxy A54 5G.',
    status: true,
    main_image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
    images: [],
    category: { id: 1, name: 'Phones & Tablets' },
    brand: { id: 1, name: 'Samsung' },
    variants: [
      { id: 1, sku: 'SAM-A54-128', price: '225.00', is_default: true, stock: 4, main_image: null, attribute_values: [] }
    ]
  },
  {
    id: 2,
    name: 'iPhone 14 Pro',
    description: 'The ultimate iPhone experience with A16 Bionic chip.',
    status: true,
    main_image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=400&fit=crop',
    images: [],
    category: { id: 1, name: 'Phones & Tablets' },
    brand: { id: 2, name: 'Apple' },
    variants: [
      { id: 2, sku: 'IP14P-128', price: '799.00', is_default: true, stock: 12, main_image: null, attribute_values: [] }
    ]
  },
  {
    id: 5,
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling headphones.',
    status: true,
    main_image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop',
    images: [],
    category: { id: 2, name: 'Audio' },
    brand: { id: 5, name: 'Sony' },
    variants: [
      { id: 5, sku: 'SONY-WH5', price: '348.00', is_default: true, stock: 15, main_image: null, attribute_values: [] }
    ]
  },
  {
    id: 6,
    name: 'AirPods Pro 2',
    description: 'Magical audio experience with active noise cancellation.',
    status: true,
    main_image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop',
    images: [],
    category: { id: 2, name: 'Audio' },
    brand: { id: 2, name: 'Apple' },
    variants: [
      { id: 6, sku: 'APP2', price: '249.00', is_default: true, stock: 20, main_image: null, attribute_values: [] }
    ]
  }
])

const cartStore = useCartStore()

// Initialize cart on mount
onMounted(() => {
  if (import.meta.client) {
    cartStore.initializeCart()
  }
})

// Meta tags
useHead({
  title: 'Home | MyStore'
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Welcome to Our Store
          </h1>
          <p class="text-xl text-gray-300 mb-8">
            Discover amazing products at unbeatable prices. Shop the latest electronics, accessories, and more.
          </p>
          <div class="flex gap-4">
            <NuxtLink
              to="/products"
              class="px-8 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Shop All Products
            </NuxtLink>
            <NuxtLink
              to="/products"
              class="px-8 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              View Featured
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p class="text-lg text-gray-600">
            Check out our handpicked selection of top products
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            class="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            View All Products
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p class="text-lg text-gray-600">
            Browse our wide range of categories
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink
            to="/products"
            class="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <img
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop"
              alt="Phones & Tablets"
              class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
              <h3 class="text-white text-xl font-bold">Phones & Tablets</h3>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/products"
            class="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <img
              src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=300&fit=crop"
              alt="Audio"
              class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
              <h3 class="text-white text-xl font-bold">Audio</h3>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/products"
            class="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <img
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop"
              alt="Laptops"
              class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
              <h3 class="text-white text-xl font-bold">Laptops</h3>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/products"
            class="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <img
              src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop"
              alt="Accessories"
              class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
              <h3 class="text-white text-xl font-bold">Accessories</h3>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          Ready to Start Shopping?
        </h2>
        <p class="text-lg text-gray-600 mb-8">
          Explore our collection and find exactly what you're looking for.
        </p>
        <NuxtLink
          to="/products"
          class="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Browse All Products
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
