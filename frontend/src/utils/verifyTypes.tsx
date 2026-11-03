import type { z } from "zod"
import type { CreateProduct } from "@/types/Product"
import type { CreateUser } from "@/types/User"

export const convertDataToExpectedUserTypes = (
  data: CreateUser,
): CreateUser => ({
  ...data,
  firstName: String(data.firstName),
  lastName: String(data.lastName),
  email: String(data.email),
  password: String(data.password),
})

interface ConvertProductData {
  data: CreateProduct
  file: File | null | undefined
  verifyImgUrl: (
    file: File | null | undefined,
    upload: (file: File) => Promise<string>,
  ) => Promise<string>
  upload: (file: File) => Promise<string>
}

export const convertDataToExpectedProductTypes = async ({
  data,
  file,
  verifyImgUrl,
  upload,
}: ConvertProductData): Promise<CreateProduct> => ({
  ...data,
  image: file ? await verifyImgUrl(file, upload) : data.image,
  description: String(data.description),
  categoryId: Number(data.categoryId),
  size: Number(data.size),
  price: Number(data.price),
})

export const validate = async <Schema extends z.ZodType>({
  item,
  schema,
}: {
  item: unknown
  schema: Schema
}): Promise<z.output<Schema>> => schema.parse(item)
