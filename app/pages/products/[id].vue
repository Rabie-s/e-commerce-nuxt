<script setup lang="ts">
import type { Product, ProductVariant } from '~/types'

const route = useRoute()
const cartStore = useCartStore()

// State
const selectedVariant = ref<ProductVariant | null>(null)
const quantity = ref(1)
const addingToCart = ref(false)

// API Base URL
const API_BASE = 'http://e-commerce-laravel.test'

// Get full image URL
const getImageUrl = (path: string) => {
  if (path.startsWith('http')) return path
  return `${API_BASE}${path}`
}

// Transform product data to add full image URLs
const transformProduct = (data: Product): Product => {
  return {
    ...data,
    main_image: getImageUrl(data.main_image),
    images: data.images.map(img => ({
      ...img,
      path: getImageUrl(img.path)
    }))
  }
}

// Fetch product using useFetch with reactive key
const { data: apiData, pending: loading } = await useFetch(() => `${API_BASE}/api/v1/products/${route.params.id}`, {
  key: () => `product-${route.params.id}`
})

// Transform and compute product
const product = computed(() => {
  if (!apiData.value?.data) return null
  return transformProduct(apiData.value.data)
})

// Set default variant when product loads
watch(product, (newProduct) => {
  if (newProduct?.variants.length && !selectedVariant.value) {
    const defaultVariant = newProduct.variants.find(v => v.is_default) || newProduct.variants[0]
    selectedVariant.value = defaultVariant
  }
}, { immediate: true })

// Format price
const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(numPrice)
}

// Select variant
const selectVariant = (variant: ProductVariant) => {
  selectedVariant.value = variant
  quantity.value = 1
}

// Update quantity
const updateQuantity = (value: number) => {
  const max = selectedVariant.value?.stock || 99
  quantity.value = Math.max(1, Math.min(max, value))
}

// Add to cart
async function addToCart() {
  if (!selectedVariant.value || !product.value || selectedVariant.value.stock === 0) return

  addingToCart.value = true

  cartStore.addToCart(
    selectedVariant.value.id,
    quantity.value,
    {
      id: product.value.id,
      name: product.value.name,
      main_image: product.value.main_image
    },
    selectedVariant.value
  )

  await new Promise(resolve => setTimeout(resolve, 500))
  addingToCart.value = false
}

// Buy now
async function buyNow() {
  await addToCart()
  await navigateTo('/checkout')
}

// Meta tags
useHead({
  title: () => product.value ? `${product.value.name} | MyStore` : 'Product Details'
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 font-medium">Loading product...</p>
      </div>
    </div>

    <!-- Product Content -->
    <div v-else-if="product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb -->
      <nav class="mb-8" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2 text-sm">
          <li>
            <NuxtLink to="/" class="text-gray-500 hover:text-gray-900">Home</NuxtLink>
          </li>
          <li class="text-gray-400" aria-hidden="true">/</li>
          <li>
            <NuxtLink to="/products" class="text-gray-500 hover:text-gray-900">Products</NuxtLink>
          </li>
          <li class="text-gray-400" aria-hidden="true">/</li>
          <li class="text-gray-900 font-medium truncate max-w-xs" aria-current="page">{{ product.name }}</li>
        </ol>
      </nav>

      <!-- Main Product Section -->
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 lg:p-10">
          <!-- Left: Image Gallery -->
          <ImageSlider
            :images="product.images"
            :product-name="product.name"
            :main-image="product.main_image"
          />

          <!-- Right: Product Details -->
          <div class="flex flex-col">
            <!-- Brand & Category -->
            <div class="flex items-center gap-3 mb-3">
              <span class="px-3 py-1 bg-gray-900 text-white text-sm font-medium rounded-full">
                {{ product.brand.name }}
              </span>
              <NuxtLink
                :to="`/products?category=${product.category.id}`"
                class="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                {{ product.category.name }}
              </NuxtLink>
            </div>

            <!-- Title -->
            <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {{ product.name }}
            </h1>

            <!-- Price -->
            <div class="mb-6">
              <span v-if="selectedVariant" class="text-4xl font-bold text-gray-900">
                {{ formatPrice(selectedVariant.price) }}
              </span>
              <p class="text-sm text-gray-500 mt-1">SKU: {{ selectedVariant?.sku }}</p>
            </div>

            <!-- Description -->
            <div class="mb-8">
              <div class="text-gray-600 leading-relaxed text-sm prose prose-sm max-w-none" v-html="product.description"></div>
            </div>

            <!-- Variant Selection -->
            <div v-if="product.variants.length > 1" class="mb-8">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">
                Select Variant:
              </h3>
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="variant in product.variants"
                  :key="variant.id"
                  @click="selectVariant(variant)"
                  :disabled="variant.stock === 0"
                  class="px-4 py-2.5 border-2 rounded-lg text-sm font-medium transition-all hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  :class="{
                    'border-gray-900 bg-gray-900 text-white': selectedVariant?.id === variant.id,
                    'border-gray-300 text-gray-700 hover:border-gray-400': selectedVariant?.id !== variant.id,
                    'opacity-50 cursor-not-allowed': variant.stock === 0
                  }"
                >
                  {{ variant.attribute_values.map(av => av.value).join(' / ') }}
                  <span v-if="variant.stock === 0" class="ml-1 text-xs">- Sold Out</span>
                </button>
              </div>
            </div>

            <!-- Quantity -->
            <div class="mb-6">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Quantity</h3>
              <div class="flex items-center gap-4">
                <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    @click="updateQuantity(quantity - 1)"
                    :disabled="quantity <= 1"
                    class="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-r"
                    aria-label="Decrease quantity"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                    </svg>
                  </button>
                  <input
                    :value="quantity"
                    @input="updateQuantity(parseInt(($event.target as HTMLInputElement).value) || 1)"
                    type="number"
                    min="1"
                    :max="selectedVariant?.stock || 99"
                    class="w-16 h-12 text-center border-0 text-gray-900 font-medium focus:ring-0"
                    aria-label="Quantity"
                  />
                  <button
                    @click="updateQuantity(quantity + 1)"
                    :disabled="!selectedVariant || quantity >= selectedVariant.stock"
                    class="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-l"
                    aria-label="Increase quantity"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                  </button>
                </div>
                <span class="text-sm text-gray-500">{{ selectedVariant?.stock || 0 }} available</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3 mb-8">
              <button
                @click="addToCart"
                :disabled="!selectedVariant || selectedVariant.stock === 0 || addingToCart"
                class="w-full py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold text-lg transition-all hover:shadow-xl flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <svg v-if="addingToCart" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                {{ addingToCart ? 'Adding...' : 'Add to Cart' }}
              </button>
              <button
                @click="buyNow"
                :disabled="!selectedVariant || selectedVariant.stock === 0"
                class="w-full py-4 bg-amber-500 text-white rounded-xl hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold text-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                Buy Now
              </button>
            </div>

            <!-- Trust Badges -->
            <div class="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div class="text-center">
                <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                  </svg>
                </div>
                <p class="text-xs font-medium text-gray-900">Free Shipping</p>
                <p class="text-xs text-gray-500">Orders over $100</p>
              </div>
              <div class="text-center">
                <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <p class="text-xs font-medium text-gray-900">2 Year Warranty</p>
                <p class="text-xs text-gray-500">Full coverage</p>
              </div>
              <div class="text-center">
                <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                </div>
                <p class="text-xs font-medium text-gray-900">30-Day Returns</p>
                <p class="text-xs text-gray-500">Hassle-free</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Back Button -->
      <div class="text-center">
        <NuxtLink to="/products" class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Continue Shopping
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.prose p {
  margin-bottom: 0.75em;
}
</style>
