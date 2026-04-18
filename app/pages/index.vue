<script setup lang="ts">
useHead({
  title: 'Gallery | Design for the everyday',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Inter:wght@400;500&display=swap',
    },
  ],
})

const brands = ['METRO', 'AXEL', 'VANTAGE', 'PRISM', 'NOVA']

const categories = [
  {
    id: 1,
    name: 'Electronics',
    subtitle: 'Next-generation technical gear.',
    image: 'https://images.unsplash.com/photo-1544244015-0df4592c0494?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Wearables',
    subtitle: 'Precision crafted accessories.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Home',
    subtitle: 'Refined living essentials.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'Accessories',
    subtitle: 'Details that define.',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
  },
]

const products = [
  {
    id: 1,
    name: 'Aura Sneakers',
    category: 'Footwear',
    price: '185',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Chronos Watch',
    category: 'Wearables',
    price: '420',
    image: 'https://images.unsplash.com/photo-1548169874-53e85f753f1e?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Sonic H1',
    category: 'Audio',
    price: '299',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'Pixel Pro X',
    category: 'Electronics',
    price: '899',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop',
  },
]
</script>

<template>
  <div class="bg-[#f8f9fa] min-h-screen" style="font-family: 'Inter', sans-serif;">



    <!-- ══════════════════════════════════════
         1. HERO — Split Layout
    ══════════════════════════════════════ -->
    <section class="bg-white overflow-hidden">
      <div class="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 min-h-[520px] items-stretch">

        <!-- Left: Content -->
        <div class="flex flex-col justify-center py-16 lg:py-20 lg:pr-16 order-2 lg:order-1">
          <p class="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#191c1d]/40 mb-5">
            Premium Collection
          </p>
          <h1
              class="text-[40px] lg:text-[54px] font-semibold leading-[1.08] tracking-[-0.025em] text-[#191c1d] mb-5"
              style="font-family: 'Manrope', sans-serif;"
          >
            Design for the<br>
            <span class="text-[#191c1d]/50">everyday.</span>
          </h1>
          <p class="text-[14px] leading-[1.75] text-[#191c1d]/50 mb-9 max-w-sm">
            Curated essentials that blend technical<br>
            precision with effortless minimalism.<br>
            Experience the art of living well.
          </p>
          <div class="flex flex-wrap gap-3">
            <UiButton>Shop Collection</UiButton>
            <UiButton variant="secondary">Learn More</UiButton>
          </div>
        </div>

        <!-- Right: Dark panel -->
        <div
            class="order-1 lg:order-2 h-72 lg:h-auto flex items-center justify-center overflow-hidden"
            style="background: linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 60%, #0f0f0f 100%);"
        >
          <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"
              alt="Premium Headphones"
              class="w-full h-full object-cover"
              style="mix-blend-mode: luminosity; filter: contrast(1.05);"
          />
        </div>

      </div>
    </section>


    <!-- ══════════════════════════════════════
         2. BRAND STRIP
    ══════════════════════════════════════ -->
    <section class="bg-[#f8f9fa] py-10 border-b border-[#191c1d]/[0.06]">
      <div class="max-w-7xl mx-auto px-8 text-center">
        <p class="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#191c1d]/35 mb-5">
          Featured by Industry Leaders
        </p>
        <div class="flex flex-wrap justify-center items-center gap-y-3 gap-x-14">
          <span
              v-for="brand in brands"
              :key="brand"
              class="text-[15px] font-bold tracking-[0.08em] text-[#191c1d]/25"
              style="font-family: 'Manrope', sans-serif;"
          >{{ brand }}</span>
        </div>
      </div>
    </section>


    <!-- ══════════════════════════════════════
         3. BROWSE CATEGORIES — Bento Grid
    ══════════════════════════════════════ -->
    <section class="max-w-7xl mx-auto px-8 py-20">

      <div class="mb-8">
        <h2
            class="text-[26px] font-semibold tracking-[-0.02em] text-[#191c1d] mb-1.5"
            style="font-family: 'Manrope', sans-serif;"
        >Browse Categories</h2>
        <p class="text-[13px] text-[#191c1d]/45">Selected pieces for your collection.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">

        <!-- Large card: Electronics -->
        <NuxtLink
            to="/products?category=1"
            class="group relative rounded-2xl overflow-hidden block bg-[#e8e9eb] min-h-[480px]"
        >
          <img
              :src="categories[0].image"
              :alt="categories[0].name"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <div class="absolute bottom-0 left-0 right-0 p-5">
            <span class="block text-[17px] font-semibold text-white tracking-[-0.01em] mb-1" style="font-family: 'Manrope', sans-serif;">
              {{ categories[0].name }}
            </span>
            <span class="block text-[11px] text-white/60">{{ categories[0].subtitle }}</span>
          </div>
        </NuxtLink>

        <!-- Right column: 3 cards -->
        <div class="grid grid-cols-2 gap-3">

          <!-- Wearables — spans 2 cols -->
          <NuxtLink
              to="/products?category=2"
              class="group relative rounded-2xl overflow-hidden col-span-2 block bg-[#e8e9eb]"
              style="aspect-ratio: 16/7;"
          >
            <img
                :src="categories[1].image"
                :alt="categories[1].name"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <div class="absolute bottom-0 left-0 right-0 p-5">
              <span class="block text-[16px] font-semibold text-white tracking-[-0.01em] mb-0.5" style="font-family: 'Manrope', sans-serif;">
                {{ categories[1].name }}
              </span>
              <span class="block text-[11px] text-white/60">{{ categories[1].subtitle }}</span>
            </div>
          </NuxtLink>

          <!-- Home & Accessories -->
          <NuxtLink
              v-for="cat in categories.slice(2, 4)"
              :key="cat.id"
              :to="`/products?category=${cat.id}`"
              class="group relative rounded-2xl overflow-hidden aspect-square block bg-[#e8e9eb]"
          >
            <img
                :src="cat.image"
                :alt="cat.name"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <span class="block text-[15px] font-semibold text-white tracking-[-0.01em] mb-0.5" style="font-family: 'Manrope', sans-serif;">
                {{ cat.name }}
              </span>
              <span class="block text-[10px] text-white/60">{{ cat.subtitle }}</span>
            </div>
          </NuxtLink>

        </div>
      </div>
    </section>


    <!-- ══════════════════════════════════════
         4. FEATURED PRODUCTS
    ══════════════════════════════════════ -->
    <section class="bg-[#f3f4f5] py-20">
      <div class="max-w-7xl mx-auto px-8">

        <div class="flex items-end justify-between mb-8">
          <div>
            <h2
                class="text-[26px] font-semibold tracking-[-0.02em] text-[#191c1d] mb-1.5"
                style="font-family: 'Manrope', sans-serif;"
            >Featured Products</h2>
            <p class="text-[13px] text-[#191c1d]/45">Selected masterpieces for your collection.</p>
          </div>
          <NuxtLink
              to="/products"
              class="text-[13px] font-semibold text-[#191c1d]/45 hover:text-[#191c1d] transition-colors whitespace-nowrap"
          >
            View all →
          </NuxtLink>
        </div>

        <!-- Updated to use UiFeaturedProductCard -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <UiFeaturedProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
          />
        </div>

      </div>
    </section>


    <!-- ══════════════════════════════════════
         5. INNER CIRCLE — Newsletter
    ══════════════════════════════════════ -->
    <div class="px-6 py-8">
      <section class="bg-[#191c1d] rounded-3xl py-20 px-8">
        <div class="max-w-md mx-auto text-center">
          <h2
              class="text-[30px] font-semibold tracking-[-0.02em] text-white mb-4"
              style="font-family: 'Manrope', sans-serif;"
          >Join the Inner Circle</h2>
          <p class="text-[14px] leading-[1.65] text-white/50 mb-9">
            Get early access to exclusive drops and curated design<br>
            stories from our studio.
          </p>

          <!-- Responsive Flex Container: Column on mobile, Row on sm+ -->
          <div class="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <input
                type="email"
                placeholder="Email address"
                class="flex-1 w-full bg-white/[0.08] border border-white/[0.14] rounded-full px-5 py-3.5 text-[13px] text-white placeholder:text-white/30 outline-none focus:bg-white/[0.12] focus:border-white/30 transition-all"
                style="font-family: 'Inter', sans-serif;"
            />
            <!-- Used UiButton with 'inverted' variant. Added specific padding to match design -->
            <UiButton
                variant="inverted"
                class="w-full sm:w-auto whitespace-nowrap !py-3.5 px-6"
            >
              Subscribe
            </UiButton>
          </div>
        </div>
      </section>
    </div>


  </div>
</template>