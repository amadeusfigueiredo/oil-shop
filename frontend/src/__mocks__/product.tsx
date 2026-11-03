import { Product } from "@/types/Product"

export const product: Product = {
  id: 1,
  name: "Test Product",
  price: 100,
  size: 1,
  details: "Test details",
  description: "Test description",
  categoryId: 1,
  image: "test-image.jpg",
  brand: "test brand",
  category: { name: "massage oil" },
}
