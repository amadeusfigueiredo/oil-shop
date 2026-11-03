import { z } from 'zod';

const CreateProductSchema = z.object({
  brand: z.string().min(1).max(100),
  name: z.string().refine((value) => value.length <= 30, {
    message: "Product name can't be longer than 30 characters.",
  }),
  image: z.string(),
  description: z.string().refine((value) => value.length <= 50, {
    message: "Product description can't be longer than 50 characters.",
  }),
  size: z
    .number()
    .int()
    .refine((value) => value <= 100000, {
      message: "Product size can't be more than 100000.",
    }),
  categoryId: z.number().int(),
  price: z.number().refine((value) => value <= 100000, {
    message: "Product price can't be more than 100000.",
  }),
  details: z.string().refine((value) => value.length <= 200, {
    message: "Product details can't be longer than 200 characters.",
  }),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
});

const UpdateProductSchema = z.object({
  brand: z.string().min(1).max(100).optional(),
  categoryId: z.number().int().positive().optional(),
  name: z
    .string()
    .refine((value) => value.length <= 30, {
      message: "Product name can't be longer than 30 characters.",
    })
    .optional(),
  image: z.string().optional(),
  description: z
    .string()
    .refine((value) => value.length <= 200, {
      message: "Product description can't be longer than 200 characters.",
    })
    .optional(),
  size: z
    .number()
    .refine((value) => value <= 100000, {
      message: "Product size can't be more than 100000.",
    })
    .optional(),
  category: z.string().optional(),
  details: z
    .string()
    .refine((value) => value.length <= 200, {
      message: "Product details can't be longer than 200 characters.",
    })
    .optional(),
  price: z
    .number()
    .refine((value) => value <= 100000, {
      message: "Product price can't be more than 100000.",
    })
    .optional(),
});

const ProductCategorySchema = z.object({
  name: z.string().refine((value) => value.length <= 30, {
    message: "Product category can't be longer than 30 characters.",
  }),
});

export { CreateProductSchema, ProductCategorySchema, UpdateProductSchema };
