<script setup lang="ts">
import type { HomeProduct } from '~/types'

const props = defineProps<{
  product: HomeProduct
}>()

const config = useRuntimeConfig()

// Get full image URL
const imageUrl = computed(() => {
  if (!props.product.main_image) return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop'
  if (props.product.main_image.startsWith('http')) return props.product.main_image
  return `${config.public.storage}${props.product.main_image}`
})

// Format price
const formattedPrice = computed(() => {
  if (props.product.price === null || props.product.price === undefined) return '0'
  const numPrice = typeof props.product.price === 'string' ? parseFloat(props.product.price) : props.product.price
  return numPrice.toFixed(0)
})
</script>

<template>
  <NuxtLink
      :to="`/products/${product.id}`"
      class="group block hover:-translate-y-1 transition-transform duration-200"
  >
    <div class="bg-white rounded-2xl overflow-hidden aspect-square mb-3">
      <img
          :src="imageUrl"
          :alt="product.name"
          class="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500 ease-out"
      />
    </div>

    <div class="flex items-start justify-between gap-2 px-0.5">
      <div>
        <p
            class="text-[14px] font-semibold text-[#191c1d] tracking-[-0.01em] mb-0.5"
            style="font-family: 'Manrope', sans-serif;"
        >
          {{ product.name }}
        </p>
      </div>
      <p
          class="text-[14px] font-semibold text-[#191c1d] shrink-0"
          style="font-family: 'Manrope', sans-serif;"
      >
        ${{ formattedPrice }}
      </p>
    </div>
  </NuxtLink>
</template>