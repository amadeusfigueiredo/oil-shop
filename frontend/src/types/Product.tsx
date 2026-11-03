export interface Product {
  id: number
  name: string
  price: number
  size: number
  details: string
  description: string
  categoryId: number
  image: string
  brand: string
  category: { name: string }
}

export interface Category {
  id: number
  name: string
}

export interface CreateProduct {
  name: string
  categoryId: number
  description: string
  price: number
  details: string
  size: number
  image: string
  brand: string
}

export interface EditProduct {
  name: string
  description: string
  price: number
  details: string
  size: number
  image: string
  brand: string
}
