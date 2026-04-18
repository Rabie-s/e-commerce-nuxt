<script setup lang="ts">
import type { CartItem } from '~/types'

const cartStore = useCartStore()
const router = useRouter()

// Computed
const cartItems = computed(() => cartStore.groupedItems)
const subtotal = computed(() => cartStore.subtotal)
const itemCount = computed(() => cartStore.itemCount)
const isEmpty = computed(() => cartItems.value.length === 0)

// State
const updatingQuantity = ref<number | null>(null)
const removingItem = ref<number | null>(null)

// Format price
const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(numPrice)
}

// Get variant display name — guards against missing attribute_values
const getVariantName = (item: CartItem): string => {
  if (!item.variant.attribute_values?.length) return ''
  return item.variant.attribute_values.map(av => av.value).join(' / ')
}

// Get product image — image always lives on product, never on variant
const getProductImage = (item: CartItem): string => {
  return item.product.main_image || 'https://via.placeholder.com/150'
}

// Update quantity
const handleUpdateQuantity = (variantId: number, newQuantity: number) => {
  if (newQuantity < 1) return

  updatingQuantity.value = variantId
  cartStore.updateQuantity(variantId, newQuantity)
  updatingQuantity.value = null
}

// Remove item
const handleRemoveItem = (variantId: number) => {
  removingItem.value = variantId
  cartStore.removeFromCart(variantId)
  removingItem.value = null
}

// Clear cart
const handleClearCart = () => {
  if (confirm('Are you sure you want to clear your cart?')) {
    cartStore.clearCart()
  }
}

// Proceed to checkout
const proceedToCheckout = () => {
  router.push('/checkout')
}

// On mount
onMounted(() => {
  if (import.meta.client) {
    cartStore.initializeCart()
  }
})

useHead({
  title: 'Your Cart | Vela'
})
</script>

<template>
  <div class="min-h-screen bg-[#f8f9fa]" style="font-family: 'Inter', sans-serif;">
    <div class="max-w-7xl mx-auto px-8 py-12">

      <!-- Page Header -->
      <div class="mb-10">
        <h1
            class="text-[32px] font-semibold tracking-[-0.02em] text-[#191c1d]"
            style="font-family: 'Manrope', sans-serif;"
        >
          Your Cart
        </h1>
        <p class="mt-2 text-sm text-[#191c1d]/50 tracking-tight">
          {{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }}
        </p>
      </div>

      <!-- Empty Cart -->
      <div v-if="isEmpty" class="text-center py-24 bg-white rounded-2xl border border-[#191c1d]/5">
        <svg class="w-20 h-20 mx-auto text-[#191c1d]/10 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
        <h2 class="text-xl font-semibold text-[#191c1d] mb-2" style="font-family: 'Manrope', sans-serif;">
          Your cart is empty
        </h2>
        <p class="text-[#191c1d]/50 mb-8 text-sm">Looks like you haven't added anything to your cart yet.</p>
        <UiButton to="/products">
          Continue Shopping
        </UiButton>
      </div>

      <!-- Cart Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        <!-- Left Column: Cart Items -->
        <div class="lg:col-span-8 space-y-4">

          <!-- Item Card -->
          <div
              v-for="item in cartItems"
              :key="item.variant_id"
              class="bg-white rounded-2xl p-5 flex gap-5 border border-[#191c1d]/5 hover:border-[#191c1d]/10 transition-colors"
          >
            <!-- Product Image -->
            <NuxtLink :to="`/products/${item.product.id}`" class="block w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-[#f3f4f5]">
              <img
                  :src="getProductImage(item)"
                  :alt="item.product.name"
                  class="w-full h-full object-cover"
                  loading="lazy"
              />
            </NuxtLink>

            <!-- Product Details -->
            <div class="flex-1 flex flex-col min-w-0">

              <!-- Top Row: Info -->
              <div class="flex justify-between items-start mb-3">
                <div>
                  <NuxtLink
                      :to="`/products/${item.product.id}`"
                      class="text-[15px] font-semibold text-[#191c1d] tracking-[-0.01em] block hover:text-[#191c1d]/70 transition-colors"
                      style="font-family: 'Manrope', sans-serif;"
                  >
                    {{ item.product.name }}
                  </NuxtLink>
                  <p class="text-[11px] text-[#191c1d]/40 mt-1 uppercase tracking-wider">
                    {{ getVariantName(item) }}
                  </p>
                </div>
                <!-- Item Price (Unit Price) -->
                <p class="text-[15px] font-semibold text-[#191c1d] shrink-0 ml-4" style="font-family: 'Manrope', sans-serif;">
                  {{ formatPrice(item.variant.price) }}
                </p>
              </div>

              <!-- Bottom Row: Controls -->
              <div class="mt-auto flex items-center justify-between">

                <!-- Quantity Selector -->
                <div class="flex items-center border border-[#191c1d]/10 rounded-lg">
                  <button
                      @click="handleUpdateQuantity(item.variant_id, item.quantity - 1)"
                      :disabled="item.quantity <= 1 || updatingQuantity === item.variant_id"
                      class="w-9 h-9 flex items-center justify-center text-[#191c1d]/40 hover:text-[#191c1d] hover:bg-[#f3f4f5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-l-lg"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4"/>
                    </svg>
                  </button>
                  <span class="w-10 text-center text-sm font-semibold text-[#191c1d]">
                    {{ item.quantity }}
                  </span>
                  <button
                      @click="handleUpdateQuantity(item.variant_id, item.quantity + 1)"
                      :disabled="item.quantity >= item.variant.stock || updatingQuantity === item.variant_id"
                      class="w-9 h-9 flex items-center justify-center text-[#191c1d]/40 hover:text-[#191c1d] hover:bg-[#f3f4f5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-r-lg"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                    </svg>
                  </button>
                </div>

                <!-- Remove Link -->
                <button
                    @click="handleRemoveItem(item.variant_id)"
                    :disabled="removingItem === item.variant_id"
                    class="text-[11px] font-semibold uppercase tracking-wider text-[#191c1d]/30 hover:text-red-500 transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  <span v-if="removingItem === item.variant_id">Removing...</span>
                  <span v-else>Remove</span>
                </button>
              </div>

              <!-- Stock Warning -->
              <p v-if="item.quantity >= item.variant.stock" class="text-[11px] text-amber-600 mt-3" role="alert">
                Maximum stock reached
              </p>
            </div>
          </div>

          <!-- Clear Cart -->
          <div class="pt-4 flex justify-end">
            <button
                @click="handleClearCart"
                class="text-[11px] font-semibold uppercase tracking-wider text-[#191c1d]/30 hover:text-red-500 transition-colors"
            >
              Clear Entire Cart
            </button>
          </div>

        </div>

        <!-- Right Column: Order Summary -->
        <div class="lg:col-span-4">
          <div class="bg-white rounded-2xl p-6 border border-[#191c1d]/5 sticky top-8">

            <h2 class="text-lg font-semibold text-[#191c1d] mb-5 tracking-tight" style="font-family: 'Manrope', sans-serif;">
              Order Summary
            </h2>

            <!-- Summary Rows -->
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-[#191c1d]/50">Subtotal</span>
                <span class="font-semibold text-[#191c1d]">{{ formatPrice(subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[#191c1d]/50">Shipping</span>
                <span class="font-semibold text-emerald-600 text-xs uppercase tracking-wider">Free</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[#191c1d]/50">Estimated Tax</span>
                <span class="font-semibold text-[#191c1d]">$0.00</span>
              </div>
            </div>

            <!-- Divider -->
            <div class="my-5 border-t border-[#191c1d]/5"></div>

            <!-- Total -->
            <div class="flex justify-between mb-6">
              <span class="text-sm font-semibold text-[#191c1d]">Total</span>
              <span class="text-xl font-bold text-[#191c1d]" style="font-family: 'Manrope', sans-serif;">
                {{ formatPrice(subtotal) }}
              </span>
            </div>

            <!-- Checkout Button -->
            <UiButton
                size="lg"
                block
                @click="proceedToCheckout"
            >
              Proceed to Checkout
            </UiButton>

            <!-- Footer Text -->
            <p class="mt-4 text-[10px] text-[#191c1d]/30 text-center leading-relaxed">
              By placing your order, you agree to our company<br>
              <a href="#" class="underline hover:text-[#191c1d]/50">Terms of Service</a> and <a href="#" class="underline hover:text-[#191c1d]/50">Privacy Policy</a>.
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>