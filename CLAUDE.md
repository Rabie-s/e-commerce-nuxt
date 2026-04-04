# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Nuxt 4 e-commerce frontend** application that integrates with a Laravel backend API. It uses Vue 3, Nuxt UI, Tailwind CSS v4, and Pinia for state management.

### Styling Approach
- Primary UI library: **Nuxt UI v4.6.1**
- Styling: **Tailwind CSS v4**
- Use **Nuxt UI components first**, then Tailwind when needed

### Tech Stack
- **Framework**: Nuxt 4.4.2
- **Vue Version**: Vue 3.5.30
- **UI Library**: Nuxt UI v4.6.1
- **Styling**: Tailwind CSS v4 (used cleanly)
- **TypeScript**: Enabled

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Generate static site
npm run generate
```

## Architecture

### Directory Structure

- **`app/`** - Nuxt app directory (Nuxt 4 structure)
  - **`components/`** - Vue components (ProductCard, Navbar, ImageSlider)
  - **`pages/`** - File-based routing (index, products/[id], cart, checkout, brands)
  - **`stores/`** - Pinia stores for state management
- **`types/`** - Shared TypeScript type definitions
- **`nuxt.config.ts`** - Nuxt configuration with API base URL

### Backend Integration

The application connects to a Laravel backend API:
- API base URL: `http://e-commerce-laravel.test/api/v1` (configured in `nuxt.config.ts`)
- Images are served from the Laravel backend
- Uses Laravel-style paginated responses

### State Management

The cart is managed through `app/stores/cart.ts` with:
- LocalStorage persistence (checked via `import.meta.client`)
- Items stored as `CartItem[]` with full product and variant details
- Key getters: `itemCount`, `subtotal`, `groupedItems`
- Key actions: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`
- Initialize with `initializeCart()` on app startup

### Type System

All shared types are defined in `types/index.ts`:
- `Product` - With variants, images, category, brand
- `ProductVariant` - SKU, price, stock, attribute_values
- `CartItem` - Cart items with product and variant details
- `PaginatedResponse<T>` - Laravel-style pagination wrapper
- `CreateOrderRequest` - Checkout/order creation payload

### Routing Patterns

- File-based routing in `app/pages/`
- Dynamic routes use `[id].vue` pattern (e.g., `products/[id].vue`)
- Nested folders for logical grouping (products, cart, checkout, brands)

### Component Patterns

- Uses Composition API with `<script setup>` syntax
- Nuxt UI components for UI elements
- Tailwind CSS v4 for styling
- Reusable components: ProductCard, ImageSlider, Navbar

## Key Patterns

1. **Client-side checks**: Use `import.meta.client` before accessing browser APIs (localStorage, window)
2. **Cart persistence**: Cart automatically saves to localStorage on every modification
3. **Variant-based products**: Products have multiple variants with different SKUs, prices, and attributes
4. **Image handling**: Products have multiple images with `is_main` and `sort_order` fields
5. **API calls**: Use `$fetch` (Nuxt's built-in composable) for API requests to the configured base URL
