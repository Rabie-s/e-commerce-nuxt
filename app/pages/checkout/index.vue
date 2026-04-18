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

  if (!formData.first_name.trim()) newErrors.first_name = 'First name is required'
  if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required'
  if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone number is required'
  if (!formData.city.trim()) newErrors.city = 'City is required'
  if (!formData.address.trim()) newErrors.address = 'Address is required'

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

// Submit order
const submitOrder = async () => {
  if (!validateForm()) return
  if (isEmpty.value) {
    orderError.value = 'Your cart is empty'
    return
  }

  isSubmitting.value = true
  orderError.value = null

  try {
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
    cartStore.clearCart()
    orderSuccess.value = true

    setTimeout(() => {
      router.push(`/orders/${result.order_uuid}`)
    }, 1500)
  } catch (error) {
    console.error('Order submission error:', error)
    orderError.value = 'Network error. Please check your connection.'
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

useHead({
  title: 'Checkout | Gallery'
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
          Checkout
        </h1>
        <p class="mt-2 text-sm text-[#191c1d]/50 tracking-tight">
          Complete your order
        </p>
      </div>

      <!-- Success Message -->
      <div
          v-if="orderSuccess"
          class="mb-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center"
      >
        <svg class="w-16 h-16 mx-auto text-emerald-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h2 class="text-xl font-semibold text-emerald-900 mb-2" style="font-family: 'Manrope', sans-serif;">Order Placed Successfully!</h2>
        <p class="text-emerald-700 text-sm">Redirecting to your order details...</p>
      </div>

      <!-- Error Message -->
      <div
          v-if="orderError"
          class="mb-8 bg-red-50 border border-red-200 rounded-2xl p-6"
          role="alert"
      >
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <h3 class="font-semibold text-red-900 text-sm">Error</h3>
            <p class="text-red-700 text-sm mt-1">{{ orderError }}</p>
          </div>
        </div>
      </div>

      <div v-if="!orderSuccess" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        <!-- Left Column: Forms -->
        <div class="lg:col-span-7 space-y-6">

          <!-- Delivery Details Card -->
          <div class="bg-white rounded-2xl p-6 border border-[#191c1d]/5">
            <h2 class="text-lg font-semibold text-[#191c1d] mb-6 tracking-tight" style="font-family: 'Manrope', sans-serif;">
              Delivery Details
            </h2>

            <form @submit.prevent="submitOrder" class="space-y-5">
              <!-- Name Row -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UiInput
                    v-model="formData.first_name"
                    label="First Name"
                    placeholder="John"
                    :error="errors.first_name"
                    required
                />
                <UiInput
                    v-model="formData.last_name"
                    label="Last Name"
                    placeholder="Doe"
                    :error="errors.last_name"
                    required
                />
              </div>

              <!-- Phone & City Row -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UiInput
                    v-model="formData.phone_number"
                    label="Phone Number"
                    placeholder="+1 (555) 123-4567"
                    :error="errors.phone_number"
                    required
                />
                <UiInput
                    v-model="formData.city"
                    label="City"
                    placeholder="New York"
                    :error="errors.city"
                    required
                />
              </div>

              <!-- Address -->
              <div>
                <!-- Using UiInput logic for textarea requires a small workaround or a separate component,
                     but for simplicity here we style a textarea to match UiInput visually if UiInput doesn't support textarea natively.
                     Assuming UiInput is text-only, we use a styled textarea. -->
                <label class="block mb-2 text-xs font-semibold text-[#191c1d]/70 uppercase tracking-wider">
                  Address <span class="text-red-500">*</span>
                </label>
                <textarea
                    v-model="formData.address"
                    rows="3"
                    :class="[
                    'w-full block rounded-xl px-4 py-3 resize-none',
                    'bg-white text-[#191c1d] placeholder:text-[#191c1d]/50 text-sm',
                    'border border-[#191c1d]/20 focus:border-black focus:ring-4 focus:ring-black/5 focus:outline-none transition-all',
                    errors.address ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : ''
                  ]"
                    placeholder="123 Main Street, Apt 4B"
                ></textarea>
                <p v-if="errors.address" class="mt-2 text-xs text-red-600 font-medium">{{ errors.address }}</p>
              </div>

              <!-- Note / Landmark -->
              <UiInput
                  v-model="formData.nearby_landmark"
                  label="Note / Remark (Optional)"
                  placeholder="Near Central Park"
                  :error="errors.nearby_landmark"
              />
            </form>
          </div>

          <!-- Payment Method Card -->
          <div class="bg-white rounded-2xl p-6 border border-[#191c1d]/5">
            <h2 class="text-lg font-semibold text-[#191c1d] mb-6 tracking-tight" style="font-family: 'Manrope', sans-serif;">
              Payment Method
            </h2>

            <!-- Selected Payment Option -->
            <div class="flex items-center gap-4 p-4 rounded-xl bg-[#f8f9fa] border border-[#191c1d]/10">
              <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[#191c1d]/5">
                <svg class="w-5 h-5 text-[#191c1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-[#191c1d]">Cash on Delivery</p>
                <p class="text-xs text-[#191c1d]/50">Pay when you receive your order</p>
              </div>
              <!-- Checkmark -->
              <div class="ml-auto w-5 h-5 rounded-full bg-black flex items-center justify-center">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Place Order Button (Mobile) -->
          <div class="lg:hidden">
            <UiButton
                size="lg"
                block
                @click="submitOrder"
                :disabled="isSubmitting || isEmpty"
            >
              <span v-if="isSubmitting" class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Placing Order...
              </span>
              <span v-else>Place Order - {{ formatPrice(subtotal) }}</span>
            </UiButton>
          </div>

        </div>

        <!-- Right Column: Order Summary -->
        <div class="lg:col-span-5">
          <div class="bg-white rounded-2xl p-6 border border-[#191c1d]/5 sticky top-8">

            <h2 class="text-lg font-semibold text-[#191c1d] mb-5 tracking-tight" style="font-family: 'Manrope', sans-serif;">
              Order Summary
            </h2>

            <!-- Cart Items -->
            <div class="space-y-4 mb-6">
              <div
                  v-for="item in cartItems"
                  :key="item.variant_id"
                  class="flex gap-4"
              >
                <img
                    :src="item.variant.main_image || item.product.main_image || 'https://via.placeholder.com/80'"
                    :alt="item.product.name"
                    class="w-20 h-20 object-cover rounded-xl bg-[#f3f4f5]"
                    loading="lazy"
                />
                <div class="flex-1 min-w-0 flex flex-col justify-center">
                  <p class="text-sm font-semibold text-[#191c1d] truncate" style="font-family: 'Manrope', sans-serif;">
                    {{ item.product.name }}
                  </p>
                  <p class="text-xs text-[#191c1d]/40 mt-0.5">{{ getVariantName(item) }}</p>
                  <p class="text-xs text-[#191c1d]/40 mt-0.5">Qty: {{ item.quantity }}</p>
                </div>
                <div class="flex items-center">
                  <p class="text-sm font-semibold text-[#191c1d]" style="font-family: 'Manrope', sans-serif;">
                    {{ formatPrice(parseFloat(item.variant.price) * item.quantity) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Calculations -->
            <div class="space-y-3 text-sm border-t border-[#191c1d]/5 pt-5">
              <div class="flex justify-between">
                <span class="text-[#191c1d]/50">Subtotal</span>
                <span class="font-semibold text-[#191c1d]">{{ formatPrice(subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[#191c1d]/50">Shipping</span>
                <span class="font-semibold text-emerald-600 text-xs uppercase tracking-wider">Free</span>
              </div>
            </div>

            <!-- Total -->
            <div class="flex justify-between mt-5 pt-5 border-t border-[#191c1d]/5">
              <span class="text-sm font-semibold text-[#191c1d]">Total</span>
              <span class="text-xl font-bold text-[#191c1d]" style="font-family: 'Manrope', sans-serif;">
                {{ formatPrice(subtotal) }}
              </span>
            </div>

            <!-- Place Order Button (Desktop) -->
            <div class="mt-6 hidden lg:block">
              <UiButton
                  size="lg"
                  block
                  @click="submitOrder"
                  :disabled="isSubmitting || isEmpty"
              >
                <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
                   <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Placing Order...
                </span>
                <span v-else>Place Order</span>
              </UiButton>
            </div>

            <!-- Secure Checkout Footer -->
            <div class="mt-6 pt-5 border-t border-[#191c1d]/5 flex items-center justify-center gap-2 text-[#191c1d]/40">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
              </svg>
              <span class="text-[11px] font-medium uppercase tracking-wider">Secure Checkout</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>