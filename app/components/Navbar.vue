<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex-shrink-0">
          <h1 class="text-2xl font-bold">MyStore</h1>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink
            to="/"
            class="text-gray-700 font-medium hover:text-gray-900 transition-colors"
            active-class="text-gray-900 font-semibold"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/products"
            class="text-gray-700 font-medium hover:text-gray-900 transition-colors"
            active-class="text-gray-900 font-semibold"
          >
            Products
          </NuxtLink>
          <NuxtLink
            to="/categories"
            class="text-gray-700 font-medium hover:text-gray-900 transition-colors"
            active-class="text-gray-900 font-semibold"
          >
            Categories
          </NuxtLink>
          <NuxtLink
            to="/brands"
            class="text-gray-700 font-medium hover:text-gray-900 transition-colors"
            active-class="text-gray-900 font-semibold"
          >
            Brands
          </NuxtLink>
        </div>

        <!-- Cart Icon & Mobile Menu Button -->
        <div class="flex items-center space-x-4">
          <!-- Cart Icon -->
          <NuxtLink to="/cart" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors" aria-label="Shopping cart">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span
              v-if="cartItemCount > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
              role="status"
              :aria-label="`${cartItemCount} items in cart`"
            >
              {{ cartItemCount }}
            </span>
          </NuxtLink>

          <!-- Mobile Menu Button -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            :aria-expanded="isMobileMenuOpen"
            aria-label="Toggle menu"
            aria-controls="mobile-menu"
          >
            <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="isMobileMenuOpen" id="mobile-menu" class="md:hidden bg-white border-t border-gray-200">
        <div class="px-4 py-3 space-y-2">
          <NuxtLink
            to="/"
            class="block px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            active-class="bg-gray-100 text-gray-900"
            @click="closeMobileMenu"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/products"
            class="block px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            active-class="bg-gray-100 text-gray-900"
            @click="closeMobileMenu"
          >
            Products
          </NuxtLink>
          <NuxtLink
            to="/categories"
            class="block px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            active-class="bg-gray-100 text-gray-900"
            @click="closeMobileMenu"
          >
            Categories
          </NuxtLink>
          <NuxtLink
            to="/brands"
            class="block px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            active-class="bg-gray-100 text-gray-900"
            @click="closeMobileMenu"
          >
            Brands
          </NuxtLink>
          <NuxtLink
            to="/cart"
            class="block px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            active-class="bg-gray-100 text-gray-900"
            @click="closeMobileMenu"
          >
            Cart ({{ cartItemCount }})
          </NuxtLink>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
const cartStore = useCartStore()
const route = useRoute()
const isMobileMenuOpen = ref(false)

// Get cart item count from store
const cartItemCount = computed(() => cartStore.itemCount)

// Initialize cart on mount (client-side only)
onMounted(() => {
  if (import.meta.client) {
    cartStore.initializeCart()
  }
})

// Toggle mobile menu
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Close mobile menu
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Close mobile menu on route change
watch(() => route.path, () => {
  closeMobileMenu()
})
</script>
