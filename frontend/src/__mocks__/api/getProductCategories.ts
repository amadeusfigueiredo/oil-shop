import { productCategories } from "../productCategories"

export const getProductCategories = vi.fn().mockResolvedValue({
  status: 200,
  data: productCategories,
})
