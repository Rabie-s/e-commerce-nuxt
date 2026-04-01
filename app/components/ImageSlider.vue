<script setup lang="ts">
import type { ProductImage } from '~/types'

interface Props {
  images: ProductImage[]
  productName: string
  mainImage?: string
}

const props = withDefaults(defineProps<Props>(), {
  mainImage: ''
})

const emit = defineEmits<{
  'change-index': [index: number]
}>()

// State
const currentImageIndex = ref(0)
const previousIndex = ref(0)

// Computed
const currentImage = computed(() => {
  if (!props.images.length) return props.mainImage
  return props.images[currentImageIndex.value]?.path || props.mainImage
})

const showNavigation = computed(() => props.images.length > 1)

// Watch for prop changes to reset index
watch(() => props.images, () => {
  currentImageIndex.value = 0
  previousIndex.value = 0
})

// Functions
function selectImage(index: number) {
  previousIndex.value = currentImageIndex.value
  currentImageIndex.value = index
  emit('change-index', index)
}

function previousImage() {
  previousIndex.value = currentImageIndex.value
  currentImageIndex.value = (currentImageIndex.value - 1 + props.images.length) % props.images.length
  emit('change-index', currentImageIndex.value)
}

function nextImage() {
  previousIndex.value = currentImageIndex.value
  currentImageIndex.value = (currentImageIndex.value + 1) % props.images.length
  emit('change-index', currentImageIndex.value)
}

// Determine transition direction
const transitionDirection = computed(() => {
  return currentImageIndex.value > previousIndex.value ? 'slide-left' : 'slide-right'
})
</script>

<template>
  <div class="space-y-4">
    <!-- Main Image Slider -->
    <div class="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
      <transition :name="transitionDirection" mode="out-in">
        <img
          :key="currentImageIndex"
          :src="currentImage"
          :alt="`${productName} - Image ${currentImageIndex + 1}`"
          class="w-full h-full object-cover"
        />
      </transition>

      <!-- Nav Arrows -->
      <template v-if="showNavigation">
        <button
          @click="previousImage"
          class="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/95 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all z-20"
          aria-label="Previous image"
        >
          <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <button
          @click="nextImage"
          class="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/95 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all z-20"
          aria-label="Next image"
        >
          <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </template>

      <!-- Image Counter -->
      <div v-if="showNavigation" class="absolute top-4 right-4 bg-black/60 backdrop-blur text-white px-3 py-1.5 rounded-full text-sm font-medium">
        {{ currentImageIndex + 1 }} / {{ images.length }}
      </div>

      <!-- Dots -->
      <div v-if="showNavigation" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        <button
          v-for="(_, index) in images"
          :key="index"
          @click="selectImage(index)"
          class="w-2.5 h-2.5 rounded-full transition-all hover:scale-125"
          :class="currentImageIndex === index ? 'bg-white w-7' : 'bg-white/60'"
          :aria-label="`Go to image ${index + 1}`"
        />
      </div>
    </div>

    <!-- Thumbnails -->
    <div v-if="showNavigation" class="grid grid-cols-5 gap-3">
      <button
        v-for="(image, index) in images"
        :key="image.id"
        @click="selectImage(index)"
        class="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all hover:border-gray-400 hover:scale-105"
        :class="currentImageIndex === index ? 'border-gray-900' : 'border-transparent'"
      >
        <img
          :src="image.path"
          :alt="`${productName} thumbnail ${index + 1}`"
          class="w-full h-full object-cover"
        />
        <div
          v-if="currentImageIndex === index"
          class="absolute inset-0 bg-black/10 flex items-center justify-center"
        >
          <svg class="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
