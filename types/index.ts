// Shared Types for the Application

export interface Product {
  id: number
  name: string
  description: string
  status: boolean
  main_image: string
  images: ProductImage[]
  category: { id: number; name: string }
  brand: { id: number; name: string }
  default_variant?: ProductVariant
  variants: ProductVariant[]
}

export interface ProductImage {
  id: number
  path: string
  is_main: boolean
  sort_order: number
}

export interface ProductVariant {
  id: number
  sku: string
  price: string
  is_default: boolean
  stock: number
  main_image: string | null
  attribute_values: AttributeValue[]
}

export interface AttributeValue {
  id: number
  value: string
  type: { id: number; name: string }
}

export interface Category {
  id: number
  name: string
  main_image?: string
  children?: Category[]
}

export interface Brand {
  id: number
  name: string
}

export interface CartItem {
  variant_id: number
  quantity: number
  product: {
    id: number
    name: string
    main_image: string
  }
  variant: {
    sku: string
    price: string
    stock: number
    main_image: string | null
    attribute_values: AttributeValue[]
  }
}

// Cart Store Types
export interface CartState {
  items: CartItem[]
}

// API Response Types
export interface ApiResponse<T> {
  data: T
}

export interface PaginatedResponse<T> {
  data: T[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    per_page: number
    to: number
    total: number
  }
}

// Order Types
export interface CustomerInfo {
  first_name: string
  last_name: string
  city: string
  address: string
  nearby_landmark?: string
  phone_number: string
}

export interface OrderItem {
  variant_id: number
  quantity: number
}

export interface CreateOrderRequest {
  customer_info: CustomerInfo
  items: OrderItem[]
}
