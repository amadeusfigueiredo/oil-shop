export interface Order {
  id: number
  userId: number
  totalAmount: number
  paymentMethod: string
  createdAt: string
  cartItems: OrderItem[]
}

export interface OrderSummary {
  shippingData: OrderShippingData
  userData: OrderUser
  orderData: OrderData
  orderAndCartItems: { orderItems: CartItem[] }
}

export interface OrderUser {
  firstName: string
  lastName: string
  email: string
}

export interface OrderShippingData {
  street: string
  number: string
  postalCode: string
  city: string
  state: string
  country: string
}

export interface OrderData {
  paymentMethod: string
  totalAmount: string | number
}

export interface CartItem {
  product: {
    id: number
    image: string
    name: string
    size: string
  }
  quantity: number
}

export interface OrderItem {
  id?: number
  productId: number
  quantity: number
  orderId: number
  product?: {
    name: string
    image: string
    size: string
  }
}

export interface NewOrder {
  userId: number
  totalAmount: number
  paymentMethod: string
}

export interface NewOrderItem {
  orderId: number
  productId: number
  quantity: number
}
