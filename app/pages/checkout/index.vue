<script setup lang="ts">
import type { CustomerInfo } from '~/types'

const cartStore = useCartStore()
const router = useRouter()

// State
const isSubmitting = ref(false)
const orderError = ref<string | null>(null)
const orderSuccess = ref(false)

// Form state
const formData = reactive<CustomerInfo>({
  first_name: '',
  last_name: '',
  phone_number: '',
  city: '',
  address: '',
  nearby_landmark: ''
})

// Form validation
const errors = ref<Record<string, string>>({})

// Computed
const cartItems = computed(() => cartStore.groupedItems)
const subtotal = computed(() => cartStore.subtotal)
const isEmpty = computed(() => cartItems.value.length === 0)

// API Base URL
const API_BASE = 'http://e-commerce-laravel.test'

// Format price
const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(numPrice)
}

// Validate form
const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {}

  if (!formData.first_name.trim()) {
    newErrors.first_name = 'First name is required'
  } else if (formData.first_name.length > 255) {
    newErrors.first_name = 'First name is too long'
  }

  if (!formData.last_name.trim()) {
    newErrors.last_name = 'Last name is required'
  } else if (formData.last_name.length > 255) {
    newErrors.last_name = 'Last name is too long'
  }

  if (!formData.phone_number.trim()) {
    newErrors.phone_number = 'Phone number is required'
  } else if (formData.phone_number.length > 20) {
    newErrors.phone_number = 'Phone number is too long'
  }

  if (!formData.city.trim()) {
    newErrors.city = 'City is required'
  } else if (formData.city.length > 255) {
    newErrors.city = 'City name is too long'
  }

  if (!formData.address.trim()) {
    newErrors.address = 'Address is required'
  } else if (formData.address.length > 500) {
    newErrors.address = 'Address is too long'
  }

  if (formData.nearby_landmark && formData.nearby_landmark.length > 255) {
    newErrors.nearby_landmark = 'Nearby landmark is too long'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

// Submit order
const submitOrder = async () => {
  if (!validateForm()) {
    return
  }

  if (isEmpty.value) {
    orderError.value = 'Your cart is empty'
    return
  }

  isSubmitting.value = true
  orderError.value = null

  try {
    // Prepare order data - ensure nearby_landmark is sent as empty string if not provided
    const orderData = {
      customer_info: {
        ...formData,
        nearby_landmark: formData.nearby_landmark || ''
      },
      items: cartItems.value.map(item => ({
        variant_id: item.variant_id,
        quantity: item.quantity
      }))
    }

    // Make API request
    const response = await fetch(`${API_BASE}/api/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(orderData)
    })

    if (!response.ok) {
      if (response.status === 422) {
        const errorData = await response.json()
        orderError.value = Object.values(errorData.errors || {}).join(', ')
      } else {
        orderError.value = 'Failed to place order. Please try again.'
      }
      return
    }

    const result = await response.json()

    // Clear cart after successful order
    cartStore.clearCart()
    orderSuccess.value = true

    // Redirect to order confirmation page
    setTimeout(() => {
      router.push(`/orders/${result.order_uuid}`)
    }, 1500)
  } catch (error) {
    console.error('Order submission error:', error)
    orderError.value = 'Network error. Please check your connection and try again.'
  } finally {
    isSubmitting.value = false
  }
}

// Get variant display name
const getVariantName = (item: any): string => {
  return item.variant.attribute_values.map((av: any) => av.value).join(' / ')
}

// Redirect if cart is empty
watch(isEmpty, (empty) => {
  if (empty && !orderSuccess.value) {
    router.push('/cart')
  }
}, { immediate: true })

// Initialize cart
onMounted(() => {
  if (import.meta.client) {
    cartStore.initializeCart()
  }
})

// Meta tags
useHead({
  title: 'Checkout | Vela'
})
</script>

<template>
  <div class="min-h-screen bg-stone-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-stone-950">Checkout</h1>
        <p class="mt-2 text-stone-500">
          Complete your order
        </p>
      </div>

      <!-- Success Message -->
      <div
        v-if="orderSuccess"
        class="mb-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center"
      >
        <svg class="w-16 h-16 mx-auto text-emerald-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h2 class="text-2xl font-bold text-emerald-900 mb-2">Order Placed Successfully!</h2>
        <p class="text-emerald-700">Redirecting to your order details...</p>
      </div>

      <!-- Error Message -->
      <div
        v-if="orderError"
        class="mb-8 bg-red-50 border border-red-200 rounded-2xl p-6"
        role="alert"
      >
        <div class="flex items-start gap-3">
          <svg class="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <h3 class="font-semibold text-red-900">Error</h3>
            <p class="text-red-700 mt-1">{{ orderError }}</p>
          </div>
        </div>
      </div>

      <div v-if="!orderSuccess" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Checkout Form -->
        <div class="lg:col-span-2">
          <div class="bg-stone-100 rounded-2xl shadow-sm p-6 lg:p-10">
            <h2 class="text-2xl font-bold text-stone-950 mb-6">Customer Information</h2>

            <form @submit.prevent="submitOrder" class="space-y-6">
              <!-- Name Row -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- First Name -->
                <div>
                  <label for="first_name" class="block text-sm font-medium text-stone-900 mb-1">
                    First Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="first_name"
                    v-model="formData.first_name"
                    type="text"
                    :class="[
                      'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-colors',
                      errors.first_name ? 'border-red-300 focus:ring-red-500' : 'border-stone-200'
                    ]"
                    placeholder="John"
                    required
                  />
                  <p v-if="errors.first_name" class="mt-1 text-sm text-red-600">{{ errors.first_name }}</p>
                </div>

                <!-- Last Name -->
                <div>
                  <label for="last_name" class="block text-sm font-medium text-stone-900 mb-1">
                    Last Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="last_name"
                    v-model="formData.last_name"
                    type="text"
                    :class="[
                      'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-colors',
                      errors.last_name ? 'border-red-300 focus:ring-red-500' : 'border-stone-200'
                    ]"
                    placeholder="Doe"
                    required
                  />
                  <p v-if="errors.last_name" class="mt-1 text-sm text-red-600">{{ errors.last_name }}</p>
                </div>
              </div>

              <!-- Phone Number -->
              <div>
                <label for="phone_number" class="block text-sm font-medium text-stone-900 mb-1">
                  Phone Number <span class="text-red-500">*</span>
                </label>
                <input
                  id="phone_number"
                  v-model="formData.phone_number"
                  type="tel"
                  :class="[
                    'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-colors',
                    errors.phone_number ? 'border-red-300 focus:ring-red-500' : 'border-stone-200'
                  ]"
                  placeholder="+1 (555) 123-4567"
                  required
                />
                <p v-if="errors.phone_number" class="mt-1 text-sm text-red-600">{{ errors.phone_number }}</p>
              </div>

              <!-- City -->
              <div>
                <label for="city" class="block text-sm font-medium text-stone-900 mb-1">
                  City <span class="text-red-500">*</span>
                </label>
                <input
                  id="city"
                  v-model="formData.city"
                  type="text"
                  :class="[
                    'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-colors',
                    errors.city ? 'border-red-300 focus:ring-red-500' : 'border-stone-200'
                  ]"
                  placeholder="New York"
                  required
                />
                <p v-if="errors.city" class="mt-1 text-sm text-red-600">{{ errors.city }}</p>
              </div>

              <!-- Address -->
              <div>
                <label for="address" class="block text-sm font-medium text-stone-900 mb-1">
                  Address <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  v-model="formData.address"
                  rows="3"
                  :class="[
                    'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-colors resize-none',
                    errors.address ? 'border-red-300 focus:ring-red-500' : 'border-stone-200'
                  ]"
                  placeholder="123 Main Street, Apt 4B"
                  required
                ></textarea>
                <p v-if="errors.address" class="mt-1 text-sm text-red-600">{{ errors.address }}</p>
              </div>

              <!-- Nearby Landmark (Optional) -->
              <div>
                <label for="nearby_landmark" class="block text-sm font-medium text-stone-900 mb-1">
                  Nearby Landmark <span class="text-stone-400">(Optional)</span>
                </label>
                <input
                  id="nearby_landmark"
                  v-model="formData.nearby_landmark"
                  type="text"
                  :class="[
                    'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-colors',
                    errors.nearby_landmark ? 'border-red-300 focus:ring-red-500' : 'border-stone-200'
                  ]"
                  placeholder="Near Central Park"
                />
                <p v-if="errors.nearby_landmark" class="mt-1 text-sm text-red-600">{{ errors.nearby_landmark }}</p>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="isSubmitting || isEmpty"
                class="w-full py-4 bg-stone-950 text-white rounded-xl hover:bg-stone-900 disabled:bg-stone-400 disabled:cursor-not-allowed font-semibold text-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 flex items-center justify-center gap-3"
              >
                <svg v-if="isSubmitting" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ isSubmitting ? 'Placing Order...' : `Place Order - ${formatPrice(subtotal)}` }}
              </button>
            </form>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-stone-100 rounded-2xl shadow-sm p-6 sticky top-24">
            <h2 class="text-xl font-bold text-stone-950 mb-6">Order Summary</h2>

            <!-- Cart Items -->
            <div class="space-y-4 mb-6">
              <div
                v-for="item in cartItems"
                :key="item.variant_id"
                class="flex gap-4 pb-4 border-b border-stone-200 last:border-0 last:pb-0"
              >
                <img
                  :src="item.variant.main_image || item.product.main_image || 'https://via.placeholder.com/80'"
                  :alt="item.product.name"
                  class="w-16 h-16 object-cover rounded-lg"
                  loading="lazy"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-stone-950 truncate">{{ item.product.name }}</p>
                  <p class="text-xs text-stone-500">{{ getVariantName(item) }}</p>
                  <p class="text-sm text-stone-500 mt-1">Qty: {{ item.quantity }}</p>
                </div>
                <p class="text-sm font-semibold text-stone-950">
                  {{ formatPrice(parseFloat(item.variant.price) * item.quantity) }}
                </p>
              </div>
            </div>

            <!-- Subtotal -->
            <div class="flex justify-between mb-4">
              <span class="text-stone-500">Subtotal</span>
              <span class="font-semibold text-stone-950">{{ formatPrice(subtotal) }}</span>
            </div>

            <!-- Shipping -->
            <div class="flex justify-between mb-4">
              <span class="text-stone-500">Shipping</span>
              <span class="font-semibold text-emerald-600">FREE</span>
            </div>

            <!-- Total -->
            <div class="border-t border-stone-200 pt-4 mb-6">
              <div class="flex justify-between">
                <span class="text-lg font-bold text-stone-950">Total</span>
                <span class="text-2xl font-bold text-stone-950">{{ formatPrice(subtotal) }}</span>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="bg-stone-200 rounded-lg p-4">
              <div class="flex items-center gap-3">
                <svg class="w-6 h-6 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <div>
                  <p class="text-sm font-semibold text-stone-950">Cash on Delivery</p>
                  <p class="text-xs text-stone-500">Pay when you receive your order</p>
                </div>
              </div>
            </div>

            <!-- Back to Cart -->
            <NuxtLink
              to="/cart"
              class="block text-center text-stone-500 hover:text-stone-950 mt-4 transition-colors"
            >
              ← Back to Cart
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
