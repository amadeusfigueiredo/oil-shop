import { Product } from "@/types/Product"

export const products: Product[] = [
  {
    id: 1,
    name: "Test Product one",
    image: "imageOne.jpg",
    size: 15,
    price: 15,
    description: "desc",
    categoryId: 5,
    category: { name: "massageOil" },
    details: "details",
    brand: "brands",
  },
  {
    id: 2,
    name: "Test Product two",
    image: "imageTwo.jpg",
    size: 25,
    price: 25,
    categoryId: 5,
    description: "description two",
    category: { name: "massageOil" },
    details: "details",
    brand: "brands",
  },
]
