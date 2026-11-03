import { use } from "react"
import { ProductContext } from "./ProductContext"

export function useProductContext() {
  return use(ProductContext)
}
