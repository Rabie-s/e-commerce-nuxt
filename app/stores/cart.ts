import { defineStore } from 'pinia'
import type { CartItem, CartState } from '~/types'

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: []
  }),

  getters: {
    // Get total number of items in cart
    itemCount: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },

    // Calculate subtotal
    subtotal: (state) => {
      return state.items.reduce((total, item) => {
        const price = parseFloat(item.variant.price)
        return total + (price * item.quantity)
      }, 0)
    },

    // Get cart items grouped by variant_id
    groupedItems: (state) => {
      const grouped = new Map<number, CartItem>()

      state.items.forEach(item => {
        const existing = grouped.get(item.variant_id)
        if (existing) {
          existing.quantity += item.quantity
        } else {
          grouped.set(item.variant_id, { ...item })
        }
      })

      return Array.from(grouped.values())
    }
  },

  actions: {
    // Initialize cart from localStorage
    initializeCart() {
      if (import.meta.client) {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
          try {
            this.items = JSON.parse(savedCart)
          } catch (e) {
            console.error('Failed to parse cart from localStorage:', e)
            this.items = []
          }
        }
      }
    },

    // Save cart to localStorage
    saveCart() {
      if (import.meta.client) {
        localStorage.setItem('cart', JSON.stringify(this.items))
      }
    },

    // Add item to cart with full product details
    addToCart(
      variantId: number,
      quantity: number,
      product: CartItem['product'],
      variant: CartItem['variant']
    ) {
      // Check if variant already exists in cart
      const existingIndex = this.items.findIndex(item => item.variant_id === variantId)

      if (existingIndex !== -1) {
        // Update quantity if exists
        this.items[existingIndex].quantity += quantity
      } else {
        // Add new item with full details
        this.items.push({
          variant_id: variantId,
          quantity,
          product,
          variant
        })
      }

      this.saveCart()
    },

    // Remove item from cart
    removeFromCart(variantId: number) {
      this.items = this.items.filter(item => item.variant_id !== variantId)
      this.saveCart()
    },

    // Update item quantity
    updateQuantity(variantId: number, quantity: number) {
      if (quantity <= 0) {
        this.removeFromCart(variantId)
        return
      }

      const item = this.items.find(item => item.variant_id === variantId)
      if (item) {
        item.quantity = quantity
        this.saveCart()
      }
    },

    // Clear entire cart
    clearCart() {
      this.items = []
      this.saveCart()
    },

    // Get quantity of specific variant
    getVariantQuantity(variantId: number): number {
      return this.items
        .filter(item => item.variant_id === variantId)
        .reduce((total, item) => total + item.quantity, 0)
    },

    // Check if variant is in cart
    isInCart(variantId: number): boolean {
      return this.items.some(item => item.variant_id === variantId)
    }
  }
})
