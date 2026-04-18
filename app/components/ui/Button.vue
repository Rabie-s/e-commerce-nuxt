<script setup lang="ts">
/**
 * @component UiButton
 * @description A reusable button component adhering to the "Digital Gallery" design system.
 *
 * @props {string} variant - 'primary' | 'secondary' | 'outlined' | 'inverted'.
 * @props {string} size - 'sm' | 'md' | 'lg'.
 * @props {boolean} block - If true, button takes full width (w-full).
 * @props {boolean} disabled - Disables the button.
 * @props {boolean} loading - Shows a loading spinner.
 * @props {string|object} to - If provided, renders as a NuxtLink.
 * @props {string} class - Pass additional Tailwind classes (e.g., 'w-1/2').
 *
 * @example
 * <UiButton block>Full Width Button</UiButton>
 * <UiButton class="w-1/2">Half Width</UiButton>
 */

interface Props {
  variant?: 'primary' | 'secondary' | 'outlined' | 'inverted'
  size?: 'sm' | 'md' | 'lg'
  block?: boolean // New prop for full width
  disabled?: boolean
  loading?: boolean
  to?: string | object
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  block: false,
  disabled: false,
  loading: false,
})

const componentTag = computed(() => {
  return props.to ? resolveComponent('NuxtLink') : 'button'
})

const baseClasses = [
  'inline-flex items-center justify-center gap-2',
  'font-medium tracking-tight text-center',
  'rounded-full',
  'transition-all duration-200 ease-out',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/10',
  'disabled:opacity-40 disabled:cursor-not-allowed',
  'active:scale-95',
]

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return [
        'bg-gradient-to-b from-[#000000] to-[#3b3b3b]',
        'text-white',
        'shadow-md hover:shadow-lg hover:from-[#1a1a1a]',
      ]
    case 'secondary':
      return [
        'bg-[#e0e1e3] text-[#191c1d]',
        'hover:bg-[#d1d2d4]',
      ]
    case 'inverted':
      return [
        'bg-white text-[#191c1d]',
        'hover:bg-gray-100',
      ]
    case 'outlined':
      return [
        'bg-transparent text-[#191c1d]',
        'border border-[#191c1d]/20',
        'hover:bg-[#191c1d]/5',
      ]
    default:
      return []
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'px-4 py-1.5 text-xs'
    case 'lg': return 'px-8 py-3.5 text-base'
    default:   return 'px-6 py-2.5 text-sm'
  }
})

// Logic for block (full width) display
// If block is true, add w-full. If false, default behavior (auto width).
const widthClasses = computed(() => {
  return props.block ? 'w-full' : ''
})

// Merge all classes.
// Note: We use useAttrs() logic implicitly for the 'class' prop in Vue 3,
// but explicit merging ensures order of operations.
// However, passing 'class' from parent usually appends to the root.
// To be safe and allow overrides, we accept the prop explicitly if needed,
// but standard Vue fallthrough attributes work best here.
const classes = computed(() => [
  ...baseClasses,
  ...variantClasses.value,
  sizeClasses.value,
  widthClasses.value,
])

</script>

<template>
  <component
      :is="componentTag"
      :to="to"
      :class="classes"
      :disabled="disabled || loading"
  >
    <svg
        v-if="loading"
        class="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>

    <slot />
  </component>
</template>