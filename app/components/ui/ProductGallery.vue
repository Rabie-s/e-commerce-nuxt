<script setup lang="ts">
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { Swiper as SwiperType } from 'swiper'
import {
  Navigation,
  Pagination,
  A11y,
  FreeMode,
  Thumbs
} from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/free-mode'
import 'swiper/css/thumbs'

defineProps<{
  images: string[]
  alt?: string
}>()

const modules = [Navigation, Pagination, A11y, FreeMode, Thumbs]

const thumbsSwiper = ref<SwiperType | null>(null)
const setThumbsSwiper = (swiper: SwiperType) => {
  thumbsSwiper.value = swiper
}
</script>

<template>
  <ClientOnly>
    <div class="gallery-root w-full h-full flex flex-col gap-4">

      <!-- Main Slider -->
      <div class="main-swiper-wrapper relative rounded-2xl overflow-hidden bg-stone-50">
        <Swiper
            :modules="modules"
            :slides-per-view="1"
            :space-between="0"
            navigation
            :pagination="{ clickable: true }"
            :thumbs="{ swiper: thumbsSwiper }"
            class="main-swiper"
        >
          <SwiperSlide
              v-for="(image, index) in images"
              :key="`main-${index}`"
              class="flex items-center justify-center"
          >
            <img
                :src="image"
                :alt="`${alt || 'Product image'} - ${index + 1}`"
                class="w-full h-[460px] object-contain transition-transform duration-700 ease-out hover:scale-[1.03]"
            />
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- Thumbnails -->
      <Swiper
          @swiper="setThumbsSwiper"
          :modules="modules"
          :space-between="10"
          :slides-per-view="4"
          :free-mode="true"
          :watch-slides-progress="true"
          class="thumbs-swiper w-full"
      >
        <SwiperSlide
            v-for="(image, index) in images"
            :key="`thumb-${index}`"
            class="cursor-pointer"
        >
          <div class="thumb-slide-inner rounded-xl overflow-hidden">
            <img
                :src="image"
                :alt="`${alt || 'Thumbnail'} - ${index + 1}`"
                class="w-full h-20 object-cover transition-all duration-300"
            />
          </div>
        </SwiperSlide>
      </Swiper>

    </div>
  </ClientOnly>
</template>

<style scoped>
/* ─── Main Swiper ─── */
.main-swiper {
  width: 100%;
}

/* ─── Nav Arrows ─── */
:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.10);
  color: #191c1d;
  transition: box-shadow 0.2s ease, transform 0.2s ease, background 0.2s ease;
  top: 50%;
  transform: translateY(-50%);
}

:deep(.swiper-button-prev) { left: 14px; }
:deep(.swiper-button-next) { right: 14px; }

:deep(.swiper-button-prev):hover,
:deep(.swiper-button-next):hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.16);
  background: #191c1d;
  color: white;
}

:deep(.swiper-button-prev::after),
:deep(.swiper-button-next::after) {
  font-size: 12px;
  font-weight: 800;
}

:deep(.swiper-button-disabled) {
  opacity: 0 !important;
  pointer-events: none;
}

/* ─── Pagination Dots ─── */
:deep(.swiper-pagination) {
  bottom: 14px;
}

:deep(.swiper-pagination-bullet) {
  width: 6px;
  height: 6px;
  background: #191c1d;
  opacity: 0.2;
  transition: opacity 0.2s, width 0.3s ease;
  border-radius: 9999px;
}

:deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  width: 20px;
  background: #191c1d;
}

/* ─── Thumbnails ─── */
.thumbs-swiper {
  width: 100%;
}

.thumb-slide-inner {
  border: 2px solid transparent;
  border-radius: 12px;
  transition: border-color 0.2s ease, opacity 0.2s ease;
  background: #f5f5f4; /* stone-100 */
}

:deep(.thumbs-swiper .swiper-slide) {
  opacity: 0.5;
  transition: opacity 0.25s ease;
}

:deep(.thumbs-swiper .swiper-slide-thumb-active) {
  opacity: 1;
}

:deep(.thumbs-swiper .swiper-slide-thumb-active) .thumb-slide-inner {
  border-color: #191c1d;
}

:deep(.thumbs-swiper .swiper-slide:not(.swiper-slide-thumb-active):hover) {
  opacity: 0.8;
}
</style>