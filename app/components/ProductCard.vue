<script setup lang="ts">
import type { Product } from '~/types'

// Props
const props = defineProps<{
  product: Product
}>()

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
