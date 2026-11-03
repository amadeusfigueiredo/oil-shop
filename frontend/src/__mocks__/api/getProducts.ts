import { product } from "../product"

export const getProducts = vi.fn().mockResolvedValue({
  status: 200,
  data: [product],
})
