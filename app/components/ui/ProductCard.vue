<!-- components/ui/ProductCard.vue -->
<script setup lang="ts">
import type { Product } from '~/types'
const { getImageUrl } = useImageUrl()


const props = defineProps<{
  product: Product
}>()

const cartStore = useCartStore()

// State
const isBuying = ref(false)
const isWishlisted = ref(false)

// Computed: Safely get the default variant
const defaultVariant = computed(() => {
  return props.product.default_variant || props.product.variants?.[0]
})

// Helper to get resolved image URL
const mainImage = computed(() => {
  const path = props.product.main_image
  return getImageUrl(path)
})

// Helper to get price
const displayPrice = computed(() => {
  if (!defaultVariant.value) return 'Unavailable'
  return `$${defaultVariant.value.price}`
})

// Buy Now: add default variant to cart then navigate to checkout
const handleBuyNow = async (e: Event) => {
  e.preventDefault()
  e.stopPropagation()

  if (!defaultVariant.value) return

  isBuying.value = true

  cartStore.addToCart(
      defaultVariant.value.id,
      1,
      {
        id: props.product.id,
        name: props.product.name,
        main_image: mainImage.value
      },
      {
        id: defaultVariant.value.id,
        price: defaultVariant.value.price,
        stock: defaultVariant.value.stock,
        is_default: defaultVariant.value.is_default,
        attribute_values: defaultVariant.value.attribute_values ?? []
      }
  )

  await navigateTo('/checkout')
  isBuying.value = false
}

// Toggle Wishlist
const toggleWishlist = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  isWishlisted.value = !isWishlisted.value
}
</script>

<template>
  <div class="group flex flex-col h-full">

    <!-- Product Image -->
    <NuxtLink :to="`/products/${product.id}`" class="block mb-5">
      <div class="relative w-full aspect-[4/5] overflow-hidden rounded-[2rem] bg-gray-100">
        <img
            :src="mainImage"
            :alt="product.name"
            class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <!-- Wishlist button overlaid on image -->
        <button
            @click="toggleWishlist"
            class="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition hover:bg-white"
        >
          <svg v-if="isWishlisted" class="h-5 w-5 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <svg v-else class="h-5 w-5 text-black" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
          </svg>
        </button>
      </div>
    </NuxtLink>

    <!-- Product Info -->
    <div class="flex flex-col flex-1">

      <!-- Name + Price -->
      <div class="flex items-start justify-between gap-3">
        <h3 class="text-[20px] font-semibold tracking-tight text-gray-900">
          {{ product.name }}
        </h3>
        <p class="shrink-0 text-[18px] font-semibold text-gray-900">
          {{ displayPrice }}
        </p>
      </div>

      <!-- Brand -->
      <p class="mt-1 text-sm text-gray-500">
        {{ product.brand?.name || 'Unknown Brand' }}
      </p>

      <!-- Buttons -->
      <div class="mt-6 flex items-center gap-3">

        <!-- View Details -->
        <UiButton
            variant="outlined"
            size="lg"
            :to="`/products/${product.id}`"
            class="flex-1"
        >
          View Details
        </UiButton>

        <!-- Buy Now -->
        <UiButton
            variant="primary"
            size="lg"
            :disabled="!defaultVariant || defaultVariant.stock === 0"
            :loading="isBuying"
            class="flex-1"
            @click="handleBuyNow"
        >
          <span v-if="defaultVariant?.stock === 0">Out of Stock</span>
          <span v-else>Buy Now</span>
        </UiButton>

      </div>
    </div>
  </div>
</template>