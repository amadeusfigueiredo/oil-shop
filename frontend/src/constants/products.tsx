import { CreateProduct } from "@/types/Product"

export const editableProductProperties = [
  "name",
  "description",
  "price",
  "image",
  "size",
  "brand",
  "details",
]

export const defaultProductData: CreateProduct = {
  categoryId: 0,
  name: "",
  details: "",
  description: "",
  brand: "",
  price: 0,
  size: 0,
  image: "",
}
