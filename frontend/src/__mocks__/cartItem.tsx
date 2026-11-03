import { Product } from "@/types/Product"

export const cartItem = {
  id: 1,
  product: {
    id: 1,
    name: "cart item product",
    image: "cart item image.jpg",
    description: "cart item description",
    size: 10,
    price: 10,
    details: "cart item details",
    categoryId: 1,
    brand: "cart item brand",
    category: { name: "cart item category" },
  },
  quantity: 1,
}

export const cartOilItem: Product = {
  id: 1,
  name: "cart oil item",
  image: "cart oil image.jpg",
  description: "cart item description",
  size: 10,
  price: 10,
  details: "cart oil details",
  categoryId: 2,
  brand: "cart oil brand",
  category: { name: "essential oil" },
}

export const cartDifuserItem: Product = {
  id: 2,
  name: "cart difuser item",
  image: "cart difuser image.jpg",
  description: "cart difuser description",
  size: 10,
  price: 10,
  details: "cart difuser details",
  categoryId: 4,
  brand: "cart difuser brand",
  category: { name: "difuser" },
}
