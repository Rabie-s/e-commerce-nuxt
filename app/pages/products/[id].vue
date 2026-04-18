<script setup lang="ts">
import type { Product, ProductVariant } from '~/types'
import ProductGallery from '~/components/ui/ProductGallery.vue'
import UiButton from '~/components/ui/Button.vue'

const route = useRoute()
const config = useRuntimeConfig()
const cartStore = useCartStore()

// State
const selectedVariant = ref<ProductVariant | null>(null)
const quantity = ref(1)
const addingToCart = ref(false)

// 1. Fetch product data
const { data: apiData, pending: loading } = await useFetch(() => `products/${route.params.id}`, {
  baseURL: config.public.apiBase,
  key: `product-${route.params.id}`
})

// 2. Helper: Get full image URL
const getImageUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${config.public.storage}${path}`
}

// 3. Compute and Transform Product Data
const product = computed(() => {
  if (!apiData.value?.data) return null
  const data = apiData.value.data as Product

  return {
    ...data,
    main_image: getImageUrl(data.main_image),
    images: data.images.map(img => ({
      ...img,
      path: getImageUrl(img.path)
    }))
  }
})

// 4. Initialize Default Variant
watch(product, (newProduct) => {
  if (newProduct?.variants.length && !selectedVariant.value) {
    const defaultVariant = newProduct.variants.find(v => v.is_default) || newProduct.variants[0]
    selectedVariant.value = defaultVariant
  }
}, { immediate: true })

// 5. Helper: Format Price
const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(numPrice)
}

// 6. Helper: Format Variant Label (e.g., "Color: Black")
const getVariantLabel = (variant: ProductVariant) => {
  if (!variant.attribute_values?.length) return `Variant #${variant.id}`
  return variant.attribute_values
      .map(attr => `${attr.type.name}: ${attr.value}`)
      .join(' / ')
}

// 7. Actions
const selectVariant = (variant: ProductVariant) => {
  selectedVariant.value = variant
  quantity.value = 1
}

const updateQuantity = (value: number) => {
  const max = selectedVariant.value?.stock || 99
  quantity.value = Math.max(1, Math.min(max, value))
}

async function addToCart() {
  console.log(product)
  if (!selectedVariant.value || !product.value || selectedVariant.value.stock === 0) return

  addingToCart.value = true

  cartStore.addToCart(
      selectedVariant.value.id,
      quantity.value,
      {
        id: product.value.id,
        name: product.value.name,
        main_image: product.value.main_image   // already resolved via getImageUrl
      },
      {
        id: selectedVariant.value.id,
        price: selectedVariant.value.price,
        stock: selectedVariant.value.stock,
        is_default: selectedVariant.value.is_default,
        attribute_values: selectedVariant.value.attribute_values ?? []
      }
  )

  await new Promise(resolve => setTimeout(resolve, 500))
  addingToCart.value = false
}

async function buyNow() {
  await addToCart()
  await navigateTo('/checkout')
}

// Meta tags
useHead({
  title: () => product.value ? `${product.value.name} | Vela` : 'Product Details'
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-stone-950 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-stone-500 font-medium">Loading product...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="product" class="max-w-7xl mx-auto px-6 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

        <!-- Left: Image Gallery -->
        <div class="w-full aspect-square sticky top-28 flex items-center justify-center rounded-3xl bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
          <ProductGallery
              :images="product.images.map(img => img.path)"
              :alt="product.name"
          />
        </div>

        <!-- Right: Product Info -->
        <div class="flex flex-col py-4">
          <!-- Brand -->
          <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            {{ product.brand?.name }}
          </p>

          <!-- Title -->
          <h1 class="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            {{ product.name }}
          </h1>

          <!-- Price & Stock -->
          <div class="flex items-baseline gap-4 mb-8">
            <span class="text-3xl font-bold text-gray-900">
              {{ selectedVariant ? formatPrice(selectedVariant.price) : '---' }}
            </span>
            <span
                v-if="selectedVariant"
                class="text-sm font-medium px-3 py-1 rounded-full"
                :class="selectedVariant.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
            >
              {{ selectedVariant.stock > 0 ? `${selectedVariant.stock} In Stock` : 'Out of Stock' }}
            </span>
          </div>

          <!-- Variant Selection -->
          <div v-if="product.variants.length > 0" class="mb-8">
            <p class="text-sm font-semibold text-[#191c1d]/60 mb-3 uppercase tracking-wider">
              Select Variant:
            </p>

            <div class="flex flex-wrap gap-3">
              <button
                  v-for="variant in product.variants"
                  :key="variant.id"
                  @click="selectVariant(variant)"
                  :disabled="variant.stock === 0"
                  class="flex-1 min-w-[140px] px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 border"
                  :class="[
                  selectedVariant?.id === variant.id
                    ? 'bg-[#191c1d] text-white border-[#191c1d] shadow-lg'
                    : 'bg-white text-[#191c1d] border-[#e0e1e3] hover:bg-gray-50 hover:border-gray-300',
                  variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                ]"
              >
                {{ getVariantLabel(variant) }}
              </button>
            </div>
          </div>

          <!-- Quantity Selector -->
          <div class="mb-6">
            <p class="text-sm font-semibold text-[#191c1d]/60 mb-3 uppercase tracking-wider">
              Quantity
            </p>
            <div class="flex items-center gap-4">
              <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                    @click="updateQuantity(quantity - 1)"
                    :disabled="quantity <= 1"
                    class="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4"/>
                  </svg>
                </button>
                <input
                    :value="quantity"
                    @input="updateQuantity(parseInt(($event.target as HTMLInputElement).value) || 1)"
                    type="number"
                    min="1"
                    :max="selectedVariant?.stock || 99"
                    class="w-14 h-10 text-center border-0 text-gray-900 font-medium focus:ring-0 text-sm"
                />
                <button
                    @click="updateQuantity(quantity + 1)"
                    :disabled="!selectedVariant || quantity >= selectedVariant.stock"
                    class="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 mb-10">
            <UiButton
                size="lg"
                class="flex-1"
                :disabled="!selectedVariant || selectedVariant.stock === 0 || addingToCart"
                @click="addToCart"
            >
              <span class="flex items-center justify-center gap-2">
                <svg v-if="addingToCart" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ addingToCart ? 'Adding...' : 'Add to Cart' }}
              </span>
            </UiButton>

            <UiButton
                size="lg"
                variant="outlined"
                class="flex-1"
                :disabled="!selectedVariant || selectedVariant.stock === 0"
                @click="buyNow"
            >
              Buy Now
            </UiButton>
          </div>

          <!-- Description -->
          <div class="border-t border-gray-100 pt-6">
            <div class="prose prose-sm text-gray-600 leading-relaxed" v-html="product.description"></div>
          </div>

        </div>
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
</style>