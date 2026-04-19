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
  attribute_values: AttributeValue[]  // removed main_image — image belongs to product only
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

// Home Product Types (simplified for homepage API response)
export interface HomeProduct {
  id: number
  name: string
  price: string | number | null
  main_image: string | null
}

export interface HomeCategory {
  id: number
  name: string
  main_image: string
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
    id: number
    price: string | number
    stock: number
    attribute_values: AttributeValue[]  // unified — uses shared AttributeValue type
    is_default?: boolean
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

// Order Tracking Types
export enum OrderStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

export enum PaymentStatus {
  Pending = 'pending',
  Collected = 'collected',
  Failed = 'failed',
  Refunded = 'refunded',
}

export interface OrderCustomer {
  first_name: string
  last_name: string
  phone_number: string
  city: string
  address: string
  nearby_landmark?: string
}

export interface OrderPayment {
  method: string
  method_color: string
  status: PaymentStatus | string
  status_color: string
  amount: number
}

export interface OrderItemDetail {
  id: number
  variant_id: number
  sku: string
  product_name: string
  quantity: number
  unit_price: number
  attributes?: Record<string, string>
  subtotal: number
}

export interface Order {
  tracking_number: string
  order_id: number
  status: OrderStatus | string
  status_color: string
  total_price: number
  customer: OrderCustomer
  items: OrderItemDetail[]
  payment: OrderPayment
  created_at: string
  updated_at: string
}

export interface OrderResponse {
  message: string
  data: Order
}