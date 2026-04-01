<script setup lang="ts">
import type { Product } from '~/types'

// Props
const props = defineProps<{
  product: Product
}>()

// Format price (memoized)
const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(numPrice)
}

// Get default variant (computed for performance)
const defaultVariant = computed(() => {
  return props.product.variants?.find(v => v.is_default) || props.product.variants?.[0]
})

// Get stock status (computed - not called multiple times in template)
const stockStatus = computed(() => {
  const stock = defaultVariant.value?.stock ?? 0
  if (stock > 10) return { text: 'In Stock', color: 'green' }
  if (stock > 0) return { text: `Low Stock (${stock})`, color: 'yellow' }
  return { text: 'Out of Stock', color: 'red' }
})

// Get variant price (computed)
const variantPrice = computed(() => {
  return defaultVariant.value?.price || '0'
})

// Check if product is in stock
const isInStock = computed(() => {
  return (defaultVariant.value?.stock ?? 0) > 0
})
</script>

<template>
  <NuxtLink
    :to="`/products/${product.id}`"
    class="group block h-full"
  >
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <!-- Product Image -->
      <div class="relative aspect-square bg-gray-100 overflow-hidden">
        <img
          :src="`http://e-commerce-laravel.test/`+product.main_image"
          :alt="product.name"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <!-- Stock Badge -->
        <span
          class="absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full"
          :class="{
            'bg-green-500 text-white': stockStatus.color === 'green',
            'bg-yellow-500 text-white': stockStatus.color === 'yellow',
            'bg-red-500 text-white': stockStatus.color === 'red'
          }"
        >
          {{ stockStatus.text }}
        </span>
      </div>

      <!-- Product Info -->
      <div class="p-4">
        <!-- Brand -->
        <p class="text-xs text-gray-500 font-medium mb-1">
          {{ product.brand?.name || 'Unknown Brand' }}
        </p>

        <!-- Product Name -->
        <h3 class="text-base font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
          {{ product.name }}
        </h3>

        <!-- Price -->
        <p class="text-xl font-bold text-gray-900 mb-3">
          {{product.default_variant.price}}$
        </p>

        <!-- View Details Button -->
        <span
          class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center justify-center gap-2 group-hover:border-gray-900 group-hover:text-gray-900"
        >
          View Details
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
