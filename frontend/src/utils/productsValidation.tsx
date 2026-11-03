import { z } from "zod"

const createProductSchema = z.object({
  brand: z.string().min(1).max(100),
  name: z.string().refine((value) => value.length <= 30, {
    message: "Product name can't be longer than 30 characters.",
  }),
  price: z.number().refine((value) => value <= 100000, {
    message: "Product price can't be more than 100000.",
  }),
  image: z.string(),
  size: z
    .number()
    .int()
    .refine((value) => value <= 100000, {
      message: "Product size can't be more than 100000.",
    }),
  description: z.string().refine((value) => value.length <= 50, {
    message: "Product description can't be longer than 50 characters.",
  }),
  categoryId: z.number().int(),
  details: z.string().refine((value) => value.length <= 200, {
    message: "Product details can't be longer than 200 characters.",
  }),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
})

const updateProductSchema = z.object({
  name: z
    .string()
    .refine((value) => value.length <= 30, {
      message: "Product name can't be longer than 30 characters.",
    })
    .optional(),
  price: z
    .number()
    .refine((value) => value <= 100000, {
      message: "Product price can't be more than 100000.",
    })
    .optional(),
  image: z.string().optional(),
  size: z
    .number()
    .refine((value) => value <= 100000, {
      message: "Product size can't be more than 100000.",
    })
    .optional(),
  description: z
    .string()
    .refine((value) => value.length <= 50, {
      message: "Product description can't be longer than 50 characters.",
    })
    .optional(),
  categoryId: z.number().int().optional(),
  details: z
    .string()
    .refine((value) => value.length <= 200, {
      message: "Product details can't be longer than 200 characters.",
    })
    .optional(),
})

export { createProductSchema, updateProductSchema }
