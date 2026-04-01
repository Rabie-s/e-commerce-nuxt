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

// Format price (memoized function)
const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(numPrice)
}

// Get variant display name
const getVariantName = (item: CartItem): string => {
  return item.variant.attribute_values.map(av => av.value).join(' / ')
}

// Get product image
const getProductImage = (item: CartItem): string => {
  return item.variant.main_image || item.product.main_image || 'https://via.placeholder.com/150'
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

// Meta tags
useHead({
  title: 'Shopping Cart | MyStore'
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <p class="mt-2 text-gray-600">
          {{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }} in your cart
        </p>
      </div>

      <!-- Empty Cart -->
      <div v-if="isEmpty" class="text-center py-20">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p class="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <NuxtLink
          to="/products"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          Continue Shopping
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        </NuxtLink>
      </div>

      <!-- Cart Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in cartItems"
            :key="item.variant_id"
            class="bg-white rounded-2xl shadow-sm p-6"
          >
            <div class="flex gap-6">
              <!-- Product Image -->
              <div class="flex-shrink-0">
                <NuxtLink :to="`/products/${item.product.id}`" class="block">
                  <img
                    :src="getProductImage(item)"
                    :alt="item.product.name"
                    class="w-32 h-32 object-cover rounded-lg"
                    loading="lazy"
                  />
                </NuxtLink>
              </div>

              <!-- Product Info -->
              <div class="flex-1">
                <div class="flex justify-between mb-2">
                  <div>
                    <NuxtLink
                      :to="`/products/${item.product.id}`"
                      class="text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      {{ item.product.name }}
                    </NuxtLink>
                    <p class="text-sm text-gray-500 mt-1">SKU: {{ item.variant.sku }}</p>
                    <p class="text-sm text-gray-500">{{ getVariantName(item) }}</p>
                  </div>
                  <p class="text-xl font-bold text-gray-900">
                    {{ formatPrice(item.variant.price) }}
                  </p>
                </div>

                <div class="flex items-center justify-between mt-4">
                  <!-- Quantity Selector -->
                  <div class="flex items-center border border-gray-300 rounded-lg">
                    <button
                      @click="handleUpdateQuantity(item.variant_id, item.quantity - 1)"
                      :disabled="item.quantity <= 1 || updatingQuantity === item.variant_id"
                      class="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      :aria-label="`Decrease quantity for ${item.product.name}`"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                      </svg>
                    </button>
                    <span class="w-12 text-center text-gray-900 font-medium">{{ item.quantity }}</span>
                    <button
                      @click="handleUpdateQuantity(item.variant_id, item.quantity + 1)"
                      :disabled="item.quantity >= item.variant.stock || updatingQuantity === item.variant_id"
                      class="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      :aria-label="`Increase quantity for ${item.product.name}`"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                    </button>
                  </div>

                  <!-- Remove Button -->
                  <button
                    @click="handleRemoveItem(item.variant_id)"
                    :disabled="removingItem === item.variant_id"
                    class="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1 disabled:opacity-50 transition-colors"
                  >
                    <svg v-if="removingItem === item.variant_id" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    Remove
                  </button>
                </div>

                <!-- Stock Warning -->
                <p v-if="item.quantity >= item.variant.stock" class="text-sm text-orange-600 mt-2" role="alert">
                  Maximum stock reached
                </p>
              </div>

              <!-- Item Subtotal -->
              <div class="flex-shrink-0 text-right">
                <p class="text-sm text-gray-500">Subtotal</p>
                <p class="text-lg font-bold text-gray-900">
                  {{ formatPrice(parseFloat(item.variant.price) * item.quantity) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Clear Cart Button -->
          <button
            @click="handleClearCart"
            class="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            Clear Cart
          </button>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <!-- Subtotal -->
            <div class="flex justify-between mb-4">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-semibold text-gray-900">{{ formatPrice(subtotal) }}</span>
            </div>

            <!-- Shipping -->
            <div class="flex justify-between mb-4">
              <span class="text-gray-600">Shipping</span>
              <span class="font-semibold text-green-600">FREE</span>
            </div>

            <!-- Total -->
            <div class="border-t border-gray-200 pt-4 mb-6">
              <div class="flex justify-between">
                <span class="text-lg font-bold text-gray-900">Total</span>
                <span class="text-2xl font-bold text-gray-900">{{ formatPrice(subtotal) }}</span>
              </div>
            </div>

            <!-- Checkout Button -->
            <button
              @click="proceedToCheckout"
              class="w-full py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold text-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Proceed to Checkout
            </button>

            <!-- Continue Shopping -->
            <NuxtLink
              to="/products"
              class="block text-center text-gray-600 hover:text-gray-900 mt-4 transition-colors"
            >
              Continue Shopping
            </NuxtLink>

            <!-- Trust Badges -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                  <svg class="w-8 h-8 mx-auto text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                  <p class="text-xs text-gray-500">Secure</p>
                </div>
                <div>
                  <svg class="w-8 h-8 mx-auto text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  <p class="text-xs text-gray-500">Safe</p>
                </div>
                <div>
                  <svg class="w-8 h-8 mx-auto text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                  </svg>
                  <p class="text-xs text-gray-500">Payment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
