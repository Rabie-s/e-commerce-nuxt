<script setup lang="ts">
import type { Order } from '~/types'

interface Props {
  order: Order
}

const props = defineProps<Props>()

const orderSteps = [
  { key: 'pending', label: 'PENDING' },
  { key: 'confirmed', label: 'CONFIRMED' },
  { key: 'shipped', label: 'SHIPPED' },
  { key: 'delivered', label: 'DELIVERED' },
] as const

const currentStepIndex = computed(() => {
  const status = props.order.status.toLowerCase()
  const stepIndex = orderSteps.findIndex(step => step.key === status)
  return stepIndex
})

const getStepStatus = (index: number): 'completed' | 'current' | 'upcoming' => {
  const currentIndex = currentStepIndex.value
  if (index < currentIndex) return 'completed'
  if (index === currentIndex) return 'current'
  return 'upcoming'
}

const getStepClasses = (index: number) => {
  const status = getStepStatus(index)
  const baseClasses = 'relative flex items-center justify-center w-6 h-6 rounded-full border-2 z-10'

  if (status === 'completed') {
    return `${baseClasses} bg-orange-500 border-orange-500`
  } else if (status === 'current') {
    return `${baseClasses} bg-black border-black`
  } else {
    return `${baseClasses} bg-white border-gray-300`
  }
}

const getConnectorClasses = (index: number) => {
  const nextStepStatus = getStepStatus(index + 1)
  if (nextStepStatus === 'completed' || nextStepStatus === 'current') {
    return 'bg-orange-500'
  }
  return 'bg-gray-300'
}

const getLabelClasses = (index: number) => {
  const status = getStepStatus(index)
  if (status === 'completed') {
    return 'text-orange-600'
  } else if (status === 'current') {
    return 'text-black font-semibold'
  } else {
    return 'text-gray-400'
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Progress Steps -->
    <div class="relative">
      <!-- Connector Lines -->
      <div class="absolute top-3 left-0 right-0 flex items-center">
        <div
          v-for="(step, index) in orderSteps.slice(0, -1)"
          :key="`connector-${index}`"
          class="h-0.5 flex-1 transition-colors duration-300"
          :class="getConnectorClasses(index)"
        ></div>
      </div>

      <!-- Steps -->
      <div class="relative flex items-center justify-between">
        <div
          v-for="(step, index) in orderSteps"
          :key="step.key"
          class="flex flex-col items-center"
        >
          <!-- Step Circle -->
          <div :class="getStepClasses(index)">
            <!-- Completed: Checkmark -->
            <svg
              v-if="getStepStatus(index) === 'completed'"
              class="w-3.5 h-3.5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              stroke-width="3"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>

            <!-- Current: White Dot (or Arrow for last step) -->
            <template v-else-if="getStepStatus(index) === 'current'">
              <!-- Last step: Arrow/Check icon -->
              <svg
                v-if="index === orderSteps.length - 1"
                class="w-3.5 h-3.5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                stroke-width="3"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <!-- Other steps: White dot -->
              <div
                v-else
                class="w-2 h-2 rounded-full bg-white"
              ></div>
            </template>

            <!-- Upcoming: Empty -->
          </div>

          <!-- Step Label -->
          <p
            class="text-xs uppercase tracking-wide mt-2 transition-colors duration-300"
            :class="getLabelClasses(index)"
          >
            {{ step.label }}
          </p>
        </div>
      </div>
    </div>

    <!-- Customer & Delivery Info -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
      <!-- Customer Info -->
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm font-semibold text-black">
            {{ order.customer.first_name }} {{ order.customer.last_name }}
          </p>
          <p class="text-xs text-gray-600">{{ order.customer.phone_number }}</p>
        </div>
      </div>

      <!-- Delivery Address -->
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm text-black break-words">
            {{ order.customer.city }} - {{ order.customer.address }}
          </p>
          <p v-if="order.customer.nearby_landmark" class="text-xs text-gray-600">
            Landmark: {{ order.customer.nearby_landmark }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
