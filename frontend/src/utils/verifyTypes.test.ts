import { z } from "zod"
import { product } from "@/__mocks__/product"
import { convertDataToExpectedProductTypes, validate } from "./verifyTypes"
import { filterProductsProps } from "./filterProductsProps"

test("invalid form data rejects instead of continuing with undefined", async () => {
  await expect(
    validate({ item: { name: 123 }, schema: z.object({ name: z.string() }) }),
  ).rejects.toThrow()
})

test("converting product data preserves an existing image when no file is selected", async () => {
  const upload = vi.fn()
  const converted = await convertDataToExpectedProductTypes({
    data: product,
    file: null,
    verifyImgUrl: vi.fn(),
    upload,
  })
  expect(converted.image).toBe(product.image)
  expect(upload).not.toHaveBeenCalled()
})

test("descending size sorting puts the largest product first", () => {
  const sort = filterProductsProps.find(
    (filter) => filter.targetProperty === "size" && !filter.isAsc,
  )
  expect(
    sort
      ?.action([
        { ...product, size: 5 },
        { ...product, id: 2, size: 20 },
      ])
      .map((item) => item.size),
  ).toEqual([20, 5])
})
