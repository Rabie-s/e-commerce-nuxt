  <!-- components/ui/ProductGallery.vue -->
  <script setup lang="ts">
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { Navigation, Pagination, A11y } from 'swiper/modules';

  // Import Swiper styles
  import 'swiper/css';
  import 'swiper/css/navigation';
  import 'swiper/css/pagination';

  // Define Props
  defineProps<{
    images: string[];
    alt?: string;
  }>();

  // Define Modules
  const modules = [Navigation, Pagination, A11y];
  </script>

  <template>
    <Swiper
        :modules="modules"
        :slides-per-view="1"
        :space-between="0"
        navigation
        :pagination="{ clickable: true }"
        class="w-full h-full"
    >
      <SwiperSlide
          v-for="(image, index) in images"
          :key="index"
          class="flex items-center justify-center"
      >
        <!-- Image takes full swiper container -->
        <img
            :src="image"
            :alt="`${alt} - ${index + 1}`"
            class="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
        >
      </SwiperSlide>
    </Swiper>
  </template>

  <style scoped>
  /*
    Swiper Navigation/Pagination Styling
    Since you use Tailwind v4, you can style the swiper elements globally or scoped here.
    These styles ensure the navigation arrows fit your dark/white aesthetic.
  */

  .swiper-button-next,
  .swiper-button-prev {
    color: #191c1d; /* text-gray-900 */
    background: rgba(255, 255, 255, 0.8);
    padding: 20px;
    border-radius: 9999px; /* rounded-full */
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    transition: background 0.2s;
  }

  .swiper-button-next:hover,
  .swiper-button-prev:hover {
    background: white;
  }

  .swiper-button-next::after,
  .swiper-button-prev::after {
    font-size: 14px;
    font-weight: 700;
  }

  .swiper-pagination-bullet {
    background: #191c1d;
    opacity: 0.3;
  }

  .swiper-pagination-bullet-active {
    opacity: 1;
    background: #191c1d;
  }
  </style>