<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Initialize Cart Store
const cartStore = useCartStore()

// FIX: Initialize cart from localStorage when the navbar mounts
// This ensures the count is updated immediately on every page load/refresh
onMounted(() => {
  cartStore.initializeCart()
})

// State for mobile menu toggle
const isMobileMenuOpen = ref(false)

// Navigation links
const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/products' },
  { name: 'Categories', href: '/categories' },
  { name: 'Brand', href: '/brands' },
]

// Helper to toggle menu
const toggleMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-[#f8f9fa]/80 backdrop-blur-xl shadow-sm">

    <nav class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

      <!-- 1. Logo Section -->
      <div class="flex items-center">
        <NuxtLink to="/" class="text-2xl font-semibold text-[#191c1d] tracking-tight hover:opacity-70 transition-opacity duration-300">
          Minimal
        </NuxtLink>
      </div>

      <!-- 2. Center Navigation (Desktop) -->
      <div class="hidden md:flex items-center space-x-8">
        <NuxtLink
            v-for="link in navLinks"
            :key="link.name"
            :to="link.href"
            class="text-sm font-medium text-[#191c1d]/70 hover:text-[#191c1d] transition-colors duration-200"
            active-class="text-[#191c1d]"
        >
          {{ link.name }}
        </NuxtLink>
      </div>

      <!-- 3. Action Icons (Right Side) -->
      <div class="flex items-center space-x-5">

        <!-- Cart Icon with Dynamic Counter -->
        <NuxtLink
            to="/cart"
            class="relative p-2 rounded-full hover:bg-[#e0e1e3] transition-colors duration-200"
            aria-label="Shopping Cart"
        >
          <svg class="w-5 h-5 text-[#191c1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>

          <!-- Dynamic Item Counter Badge -->
          <span
              v-if="cartStore.itemCount > 0"
              class="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-black rounded-full px-1"
          >
            {{ cartStore.itemCount }}
          </span>
        </NuxtLink>

        <!-- Mobile Menu Toggle Button -->
        <button
            class="md:hidden p-2 rounded-full hover:bg-[#e0e1e3] transition-colors duration-200"
            @click="toggleMenu"
            aria-label="Toggle Menu"
        >
          <svg v-if="!isMobileMenuOpen" class="w-6 h-6 text-[#191c1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6 text-[#191c1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </nav>

    <!-- Mobile Menu Overlay -->
    <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="isMobileMenuOpen" class="md:hidden bg-white/95 backdrop-blur-2xl border-t border-[#e0e1e3]/20 shadow-lg">
        <div class="px-6 py-8 space-y-6">
          <NuxtLink
              v-for="link in navLinks"
              :key="link.name"
              :to="link.href"
              class="block text-lg font-medium text-[#191c1d] hover:text-[#191c1d]/60 transition-colors"
              @click="isMobileMenuOpen = false"
          >
            {{ link.name }}
          </NuxtLink>
        </div>
      </div>
    </Transition>

  </header>
</template>