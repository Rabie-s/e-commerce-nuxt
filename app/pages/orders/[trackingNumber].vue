<script setup lang="ts">
import type { Order, OrderResponse, OrderStatus, PaymentStatus } from '~/types'

const route = useRoute()
const config = useRuntimeConfig()

const { trackingNumber } = route.params as { trackingNumber: string }

const { data: orderData, pending: loading, error: fetchError } = await useFetch<OrderResponse>(() => `orders/${trackingNumber}`, {
  baseURL: config.public.apiBase,
  key: `order-${trackingNumber}`,
})

const order = computed(() => orderData.value?.data ?? null)

const formatDate = (dateStr: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr))
}

const formatPrice = (price: string | number): string => {
  const num = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'JOD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

// Removed: Order status steps logic moved to OrderStatusTracker component

const getStatusBadgeClasses = () => {
  if (!order.value) return ''
  const color = order.value.status_color
  switch (color) {
    case 'success':
      return 'bg-green-100 text-green-700'
    case 'danger':
    case 'error':
      return 'bg-red-100 text-red-700'
    case 'warning':
      return 'bg-orange-100 text-orange-700'
    case 'info':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const getPaymentStatusClasses = () => {
  if (!order.value) return ''
  const color = order.value.payment?.status_color
  switch (color) {
    case 'success':
      return 'bg-green-100 text-green-700'
    case 'danger':
    case 'error':
      return 'bg-red-100 text-red-700'
    case 'warning':
      return 'bg-orange-100 text-orange-700'
    case 'info':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

useHead({
  title: () => order.value ? `Order Tracking - ${order.value.tracking_number}` : 'Tracking Order',
})
</script>

<template>
  <div class="min-h-screen bg-white" style="font-family: 'Inter', system-ui, sans-serif;">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-32">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <p class="text-gray-600 font-medium">Loading order details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="fetchError || !order" class="flex items-center justify-center py-32">
      <div class="text-center max-w-md">
        <div class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-black mb-3">Order Not Found</h2>
        <p class="text-gray-600 mb-8">
          We couldn't find an order with tracking number <span class="font-semibold">{{ trackingNumber }}</span>.
        </p>
        <NuxtLink
          to="/"
          class="inline-flex items-center justify-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Return Home
        </NuxtLink>
      </div>
    </div>

    <!-- Order Content -->
    <div v-else class="max-w-7xl mx-auto px-6 py-10">

      <!-- Order Identity Section -->
      <div class="mb-10">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Order Identity</p>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-4xl font-bold text-black tracking-tight mb-2">
              {{ order.tracking_number }}
            </h1>
            <p class="text-sm text-gray-600">
              Created at {{ formatDate(order.created_at) }} • <span class="font-medium text-black capitalize">{{ order.status }}</span>
            </p>
          </div>
          <div
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide"
            :class="getStatusBadgeClasses()"
          >
            <span class="w-2 h-2 rounded-full bg-current"></span>
            {{ order.status }}
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Left Column - Journey & Items -->
        <div class="lg:col-span-2 space-y-8">

          <!-- Journey Tracking Section -->
          <div class="bg-gray-50 rounded-2xl p-8">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">Journey Tracking</p>
            <UiOrderStatusTracker :order="order" />
          </div>

          <!-- Order Summary Section -->
          <div class="bg-gray-50 rounded-2xl p-8">
            <div class="flex items-center justify-between mb-6">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Order Summary</p>
              <p class="text-sm font-medium text-gray-600">{{ order.items.length }} Items</p>
            </div>

            <div class="space-y-4">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex items-start justify-between pb-4 border-b border-gray-200 last:border-0 last:pb-0"
              >
                <div class="flex-1">
                  <p class="text-sm font-semibold text-black mb-1">{{ item.product_name }}</p>
                  <div v-if="item.attributes" class="flex flex-wrap gap-2 mb-2">
                    <span
                      v-for="(value, key) in item.attributes"
                      :key="key"
                      class="inline-flex items-center px-2 py-0.5 rounded bg-white text-xs font-medium text-gray-600"
                    >
                      {{ key }}: {{ value }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500">SKU: {{ item.sku }} • Qty: {{ item.quantity }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-bold text-black">{{ formatPrice(item.unit_price) }}</p>
                  <p class="text-xs text-gray-500">{{ formatPrice(item.subtotal) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Payment & Details -->
        <div class="space-y-8">

          <!-- Payment Details -->
          <div class="bg-gray-50 rounded-2xl p-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/>
                </svg>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</p>
                <p class="text-sm font-medium text-black">{{ order.payment.method }}</p>
              </div>
            </div>

            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Status</span>
                <span
                  class="px-3 py-1 rounded-full text-xs font-semibold uppercase"
                  :class="getPaymentStatusClasses()"
                >
                  {{ order.payment.status }}
                </span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-semibold text-black">{{ formatPrice(order.total_price) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Shipping</span>
                <span class="font-semibold text-green-600">FREE</span>
              </div>
            </div>

            <div class="pt-4 border-t border-gray-200">
              <div class="flex justify-between items-baseline">
                <span class="text-sm font-semibold text-black">Total Amount</span>
                <span class="text-2xl font-bold text-black">{{ formatPrice(order.total_price) }}</span>
              </div>
            </div>
          </div>

          <!-- Destination Details (No Map) -->
          <div class="bg-gray-50 rounded-2xl p-8">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Destination</p>
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-black">{{ order.customer.city }}</p>
                  <p class="text-xs text-gray-600">{{ order.customer.address }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Assistance Section -->
          <div class="bg-black rounded-2xl p-8 text-center">
            <h3 class="text-lg font-semibold text-white mb-2">Need assistance?</h3>
            <p class="text-sm text-gray-400 mb-6 leading-relaxed">
              If you have any questions about your order, feel free to contact our customer support team.
            </p>
            <div class="space-y-3">
              <button class="w-full inline-flex items-center justify-center px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Contact Concierge
              </button>
              <button class="w-full inline-flex items-center justify-center px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors">
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

