<script setup lang="ts">
/**
 * @component UiInput
 * @description A text input component following the "Digital Gallery" design system.
 *
 * Features:
 * - "Soft Container" style with rounded-xl corners.
 * - "Ghost Border" (20% opacity) that intensifies on focus.
 * - Soft outer glow on focus for ambient depth.
 * - Support for Leading/Trailing icons via slots.
 *
 * @props {string} modelValue - The value binding (v-model).
 * @props {string} label - The label text (optional).
 * @props {string} placeholder - Placeholder text (50% opacity).
 * @props {string} type - Input type (text, email, password, etc).
 * @props {string} error - Error message string.
 * @props {boolean} disabled - Disables the input.
 *
 * @example
 * <UiInput v-model="email" label="Email Address" placeholder="hello@example.com" />
 * <UiInput v-model="search" placeholder="Search...">
 *   <template #leadingIcon><SearchIcon /></template>
 * </UiInput>
 */

interface Props {
  modelValue?: string | number
  label?: string
  placeholder?: string
  type?: string
  error?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: '',
})

const emit = defineEmits(['update:modelValue'])

// Handle v-model binding
const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// Computed classes based on state
const inputClasses = computed(() => [
  // Base Styles
  'w-full block rounded-xl px-4 py-3',
  'bg-white text-[#191c1d] placeholder:text-[#191c1d]/50',
  'font-medium text-sm tracking-tight', // Manrope style

  // Border Logic (Ghost Border Rule)
  'border border-[#191c1d]/20',
  'focus:border-black focus:ring-4 focus:ring-black/5', // Soft outer glow (ambient)
  'focus:outline-none',

  // State Modifiers
  {
    'border-red-500/50 focus:border-red-500 focus:ring-red-500/10': props.error,
    'bg-[#f3f4f5] cursor-not-allowed opacity-60': props.disabled,
    'pl-12': !!useSlots().leadingIcon, // Padding for left icon
    'pr-12': !!useSlots().trailingIcon, // Padding for right icon
  }
])
</script>

<template>
  <div class="w-full">

    <!-- Label Section -->
    <!-- Uses Inter style (technical, small) -->
    <label
        v-if="label"
        class="block mb-2 text-xs font-semibold text-[#191c1d]/70 uppercase tracking-wider"
    >
      {{ label }}
    </label>

    <!-- Input Wrapper (for icons) -->
    <div class="relative">

      <!-- Leading Icon Slot (Left) -->
      <div
          v-if="$slots.leadingIcon"
          class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#191c1d]/40"
      >
        <slot name="leadingIcon" />
      </div>

      <!-- Input Element -->
      <input
          v-model="value"
          :type="type"
          :placeholder="placeholder"
          :disabled="disabled"
          :class="inputClasses"
      />

      <!-- Trailing Icon Slot (Right) -->
      <div
          v-if="$slots.trailingIcon"
          class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-[#191c1d]/40"
      >
        <slot name="trailingIcon" />
      </div>

    </div>

    <!-- Error Message -->
    <p
        v-if="error"
        class="mt-2 text-xs text-red-600 font-medium"
    >
      {{ error }}
    </p>

  </div>
</template>