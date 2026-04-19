# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm install              # Install dependencies
npm run dev             # Start development server on http://localhost:3000
npm run build           # Build for production (outputs to .output/)
npm run preview         # Preview production build locally
npm run generate        # Generate static site
```

## Tech Stack

- **Nuxt 4.4.2** - Vue 3 full-stack framework with file-based routing
- **Vue 3.5.30** - Using Composition API with `<script setup lang="ts">`
- **TypeScript** - Full type safety throughout
- **Tailwind CSS v4.2.2** - Styling via Vite plugin (imported in `app/app.vue` with `@import "tailwindcss"`)
- **Pinia** - State management (`@pinia/nuxt`)
- **Swiper 12.1.3** - Touch slider/carousel for product galleries

## Project Structure

```
app/                          # Nuxt 4 source directory
├── app.vue                   # Root component with Tailwind import
├── components/
│   ├── layout/              # Layout components (Navbar, Footer)
│   └── ui/                  # Reusable UI components (Button, Input, ProductCard, etc.)
├── layouts/
│   └── default.vue          # Main layout wrapper
├── pages/                   # File-based routing
│   ├── index.vue           # Homepage
│   ├── products/           # Product listing and detail pages
│   ├── categories/         # Categories page
│   ├── brands/             # Brands page
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout form
│   └── orders/             # Order tracking
└── stores/
    └── cart.ts             # Cart state management with localStorage
types/
└── index.ts               # Centralized TypeScript type definitions
nuxt.config.ts             # Nuxt configuration
```

## API Integration

This is a **frontend-only** Nuxt application consuming an external Laravel backend API.

**API Configuration** (in `nuxt.config.ts`):
- Base URL: `http://e-commerce-laravel.test/api/v1`
- Storage URL: `http://e-commerce-laravel.test/`

**Common Endpoints:**
- `GET /products` - Product listing with filters (page, category_id, brand_id, price_range)
- `GET /products/{id}` - Single product details
- `GET /categories` - Categories listing
- `GET /brands` - Brands listing
- `POST /orders` - Create order (checkout)
- `GET /orders/{trackingNumber}` - Order tracking

**API Response Pattern:**
```typescript
// All responses are wrapped in a data property
{ data: T | T[], meta?: {...}, links?: {...} }

// Use useFetch with transform to unwrap:
const { data } = await useFetch(endpoint, {
  baseURL: config.public.apiBase,
  transform: (data) => data.data
})
```

**Image URL Resolution:**
```typescript
const getImageUrl = (path: string) => {
  if (!path) return placeholder
  if (path.startsWith('http')) return path
  return `${config.public.storage}${path}`
}
```

## State Management

**Pinia Store:** `app/stores/cart.ts`

**Initialization (required in `onMounted`):**
```typescript
const cartStore = useCartStore()
onMounted(() => cartStore.initializeCart())
```

**Key Methods:**
- `addToCart(variantId, quantity, product, variant)` - Add or update item
- `removeFromCart(variantId)` - Remove item
- `updateQuantity(variantId, quantity)` - Change quantity
- `clearCart()` - Empty cart
- `saveCart()` - Persist to localStorage (automatic)
- `isInCart(variantId)` - Check if variant exists
- `getVariantQuantity(variantId)` - Get quantity of specific variant

**Computed Properties:**
- `cartStore.itemCount` - Total quantity of all items
- `cartStore.subtotal` - Sum of (price × quantity)
- `cartStore.groupedItems` - Items grouped by variant_id

## Component Guidelines

**Naming Conventions:**
- Layout components: `PascalCase` in `components/layout/`
- UI components: `PascalCase` in `components/ui/`
- Use `<UiName>` prefix when referencing UI components (e.g., `<UiButton>`, `<UiInput>`)

**Component Patterns:**
- All components use `<script setup lang="ts">`
- Auto-imports enabled for composables (no explicit imports needed)
- Props are typed using interfaces from `~/types`
- Use computed properties for derived state
- Use `import.meta.client` for client-side only code

**UI Components:**
- `Button` - Variants: primary, secondary, outlined, inverted. Sizes: sm, md, lg. Supports `to` prop for links.
- `Input` - Form input with label, error state, and icon slots (leadingIcon, trailingIcon)
- `ProductCard` - Full product card with buy now, wishlist, view details
- `FeaturedProductCard` - Simplified card for homepage
- `ProductGallery` - Swiper-based carousel with navigation
- `OrderStatusTracker` - Order status stepper

## Styling Guidelines

**Design System - "Digital Gallery":**
- **Fonts:** Manrope (headlines), Inter (body text) - loaded in `app/pages/index.vue`
- **Primary Color:** `#191c1d` (near-black, 90% black)
- **Background:** `#f8f9fa` (off-white)
- **Radius:** `rounded-2xl` for cards, `rounded-full` for buttons
- **Borders:** Ghost borders with 20% opacity that intensify on focus

**Tailwind v4 Usage:**
- Imported via `@import "tailwindcss"` in `app/app.vue`
- No `@apply` directives - use utility classes directly in templates
- Custom colors and spacing can be added to Tailwind config if needed

## Type System

**Centralized Types:** All types defined in `types/index.ts`

**Key Types:**
- `Product`, `ProductVariant`, `ProductImage`, `AttributeValue`
- `Category`, `Brand`
- `CartItem`, `CartState`
- `ApiResponse<T>`, `PaginatedResponse<T>`
- `CustomerInfo`, `Order`, `CreateOrderRequest`
- `OrderStatus`, `PaymentStatus` (enums)

**Usage:**
```typescript
import type { Product, CartItem } from '~/types'

// For API responses
const { data }: { data: Ref<ApiResponse<Product>> } = await useFetch(...)
```

## Routing

**File-based Routing:** Pages in `app/pages/` automatically become routes

**Dynamic Routes:** Use `[param].vue` syntax
- Example: `app/pages/products/[id].vue` → `/products/123`

**Programmatic Navigation:**
```typescript
await navigateTo('/checkout')
await navigateTo({ path: '/products', query: { category: '5' } })
```

**Route Parameters:**
```typescript
const route = useRoute()
const id = route.params.id
```

## Common Patterns

**Data Fetching with Filters:**
```typescript
const { data, pending, error } = await useFetch(() => 'products', {
  baseURL: config.public.apiBase,
  query: computed(() => ({
    page: currentPage.value,
    category_id: selectedCategory.value?.id
  })),
  key: 'products-list'
})
```

**Currency Formatting:**
```typescript
const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(numPrice)
}
```

**Form Validation:**
- Use native HTML validation (required, min, max, type)
- Display errors via props (e.g., `<UiInput :error="errorMessage">`)
- Check stock availability before adding to cart

**Variant Label Display:**
```typescript
const getVariantLabel = (variant: ProductVariant) => {
  if (!variant.attribute_values?.length) return `Variant #${variant.id}`
  return variant.attribute_values
    .map(attr => `${attr.type.name}: ${attr.value}`)
    .join(' / ')
}
```

## Architecture Notes

- **No server routes** - This is a client-side only application
- **No middleware** - Authentication/authorization handled by backend
- **LocalStorage persistence** - Cart data stored locally (key: `'cart'`)
- **Image lazy loading** - Use `loading="lazy"` attribute
- **Responsive design** - Mobile-first approach with Tailwind breakpoints
- **Accessibility** - Semantic HTML, ARIA labels on icon buttons, focus states

## Adding Features

**New Page:** Create `.vue` file in `app/pages/`
**New Component:** Create in `app/components/ui/` or `app/components/layout/`
**New API Call:** Use `useFetch` with `baseURL: config.public.apiBase`
**New Types:** Add to `types/index.ts`
**New Store:** Create in `app/stores/` (Pinia)
