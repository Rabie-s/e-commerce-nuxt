<script setup lang="ts">
import type { Product } from '~/types'

// Props
const props = defineProps<{
  product: Product
}>()

// Get default variant (either default_variant property, or from variants array)
const defaultVariant = computed(() => {
  // First check if default_variant exists
  if (props.product.default_variant) {
    return props.product.default_variant
  }
  // Then check variants array
  if (props.product.variants && props.product.variants.length > 0) {
    return props.product.variants.find(v => v.is_default) || props.product.variants[0]
  }
  return null
})

// Format price
const formatPrice = (price: string | number): string => {
  if (!price) return '$0.00'
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(numPrice)
}
</script>

<template>
  <NuxtLink
    :to="`/products/${product.id}`"
    class="group block h-full"
  >
    <div class="bg-stone-100 rounded-2xl shadow-sm overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <!-- Product Image -->
      <div class="relative aspect-square bg-stone-50 overflow-hidden">
        <img
          :src="product.main_image.startsWith('http') ? product.main_image : `http://e-commerce-laravel.test/${product.main_image}`"
          :alt="product.name"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <!-- Product Info -->
      <div class="p-4">
        <!-- Brand -->
        <p class="text-xs text-stone-500 font-medium mb-1">
          {{ product.brand?.name || 'Unknown Brand' }}
        </p>

        <!-- Product Name -->
        <h3 class="text-base font-semibold text-stone-950 mb-2 line-clamp-2 min-h-[2.5rem]">
          {{ product.name }}
        </h3>

        <!-- Price -->
        <p class="text-xl font-bold text-stone-950 mb-3">
          {{ defaultVariant ? formatPrice(defaultVariant.price) : 'Price not available' }}
        </p>

        <!-- View Details Button -->
        <span
          class="w-full px-4 py-2 border border-stone-200 text-stone-900 rounded-lg hover:bg-stone-200 transition-colors font-medium text-sm flex items-center justify-center gap-2 group-hover:border-stone-900 group-hover:text-stone-950"
        >
          View Details
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
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
