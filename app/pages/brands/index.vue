<script setup lang="ts">
const { getImageUrl } = useImageUrl()

interface Brand {
  id: number
  name: string
  description: string | null
  main_image: string | null
  slug?: string
}

const config = useRuntimeConfig()

// Fetch brands from API
const { data: brandsData } = await useFetch<Brand[]>('/brands', {
  baseURL: config.public.apiBase,
  transform: (data: any) => data.data,
})

const brands = computed(() => brandsData.value || [])


useHead({
  title: 'Designers | Gallery Luxe'
})
</script>

<template>
  <div class="min-h-screen bg-[#f8f9fa]" style="font-family: 'Inter', sans-serif;">
    <div class="max-w-7xl mx-auto px-8 py-16">

      <!-- Page Header -->
      <div class="text-center mb-16">
        <p class="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#191c1d]/40 mb-4">
          Our Partners
        </p>
        <h1
            class="text-[40px] md:text-[48px] font-semibold tracking-[-0.025em] text-[#191c1d] mb-4"
            style="font-family: 'Manrope', sans-serif;"
        >
          The Designers.
        </h1>
        <p class="text-[14px] leading-[1.75] text-[#191c1d]/50 max-w-xl mx-auto">
          Explore the visionaries behind our collection. Master craftsmen and contemporary studios defining modern living.
        </p>
      </div>

      <!-- Brands Grid -->
      <div v-if="brands.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        <NuxtLink
            v-for="brand in brands"
            :key="brand.id"
            :to="`/products?brand=${brand.id}`"
            class="group block"
        >
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#191c1d]/5 transition-all duration-300 hover:shadow-xl hover:border-[#191c1d]/10 h-full flex flex-col">

            <!-- Brand Image -->
            <div class="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden">
              <img
                  :src="getImageUrl(brand.main_image)"
                  :alt="brand.name"
                  class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
              />
              <!-- Optional Overlay on Hover -->
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
            </div>

            <!-- Brand Info -->
            <div class="p-6 flex flex-col flex-1">
              <h3
                  class="text-lg font-semibold text-[#191c1d] mb-2 group-hover:underline decoration-1 underline-offset-4"
                  style="font-family: 'Manrope', sans-serif;"
              >
                {{ brand.name }}
              </h3>
              <p v-if="brand.description" class="text-sm text-[#191c1d]/50 line-clamp-3 flex-1">
                {{ brand.description }}
              </p>

              <!-- CTA Indicator -->
              <div class="mt-4 pt-4 border-t border-[#191c1d]/5 flex items-center justify-between">
                <span class="text-xs font-semibold text-[#191c1d]/70 group-hover:text-[#191c1d] transition-colors">
                  View Collection
                </span>
                <svg class="w-4 h-4 text-[#191c1d]/40 group-hover:text-[#191c1d] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- No Results -->
      <div v-else class="text-center py-24">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-[#f3f4f5] rounded-2xl mb-6">
          <svg class="w-7 h-7 text-[#191c1d]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-[#191c1d] mb-2" style="font-family: 'Manrope', sans-serif;">
          No designers found
        </h3>
        <p class="text-sm text-[#191c1d]/40 mb-6 max-w-sm mx-auto">
          We are currently updating our roster of designers. Please check back soon.
        </p>
        <UiButton to="/" variant="secondary">
          Return Home
        </UiButton>
      </div>

    </div>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>