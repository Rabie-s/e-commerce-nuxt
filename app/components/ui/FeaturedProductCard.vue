<script setup lang="ts">
export interface FeaturedProduct {
  id: number
  name: string
  category: string
  price: string | number
  image: string
}

defineProps<{
  product: FeaturedProduct
}>()
</script>

<template>
  <NuxtLink
      :to="`/product/${product.id}`"
      class="group block hover:-translate-y-1 transition-transform duration-200"
  >
    <div class="bg-white rounded-2xl overflow-hidden aspect-square mb-3">
      <img
          :src="product.image"
          :alt="product.name"
          class="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500 ease-out"
      />
    </div>

    <div class="flex items-start justify-between gap-2 px-0.5">
      <div>
        <p
            class="text-[14px] font-semibold text-[#191c1d] tracking-[-0.01em] mb-0.5"
            style="font-family: 'Manrope', sans-serif;"
        >
          {{ product.name }}
        </p>
        <p class="text-[11px] font-medium text-[#191c1d]/40">
          {{ product.category }}
        </p>
      </div>
      <p
          class="text-[14px] font-semibold text-[#191c1d] shrink-0"
          style="font-family: 'Manrope', sans-serif;"
      >
        ${{ product.price }}
      </p>
    </div>
  </NuxtLink>
</template>