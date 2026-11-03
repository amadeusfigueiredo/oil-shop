import { z } from "zod"
import { LOCAL_STORAGE_CART } from "@/constants/localStorage"
import type { CartItem } from "@/types/Cart"

const text = z
  .string()
  .nullable()
  .transform((value) => value ?? "")
const cartSchema: z.ZodType<CartItem[]> = z.array(
  z.object({
    quantity: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
    product: z.object({
      id: z.number().int().positive(),
      name: z.string().min(1),
      price: z.coerce.number().nonnegative(),
      size: z.number().int().positive(),
      details: text,
      description: text,
      image: text,
      brand: text,
      categoryId: z.number().int().positive(),
      category: z.object({ name: z.string() }),
    }),
  }),
)

export const readCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CART)
    if (!raw) return []
    const result = cartSchema.safeParse(JSON.parse(raw))
    return result.success ? result.data : []
  } catch {
    return []
  }
}
