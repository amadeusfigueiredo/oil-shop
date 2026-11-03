import axios, { AxiosResponse } from "axios"
import { describe, it, expect, vi } from "vitest"

import { createProduct } from "./createProduct"
import { PRODUCTS } from "@/constants/api"
import type { Product } from "@/types/Product"
import { product } from "@/__mocks__/product"
import { emptyAxiosResponse } from "@/__mocks__/api/emptyAxiosResponse"

vi.mock("axios")
const mockedPost = vi.mocked(axios.post)

describe("createProduct", () => {
  const baseUrl = import.meta.env.VITE_APP_API_URL

  it("resolves with data when status is 201", async () => {
    const payload = { product }
    const axiosResponse = {
      data: payload,
      status: 201,
      statusText: "Created",
      headers: {},
      config: {},
    } as unknown as AxiosResponse<{ product: Product }>

    mockedPost.mockResolvedValue(axiosResponse)

    const result = await createProduct(product)

    expect(mockedPost).toHaveBeenCalledWith(`${baseUrl}${PRODUCTS}`, product, {
      withCredentials: true,
    })
    expect(result).toBe(axiosResponse)
  })

  it("throws if status is not 201", async () => {
    const axiosResponse = emptyAxiosResponse as unknown as AxiosResponse<{
      product: Product
    }>

    mockedPost.mockResolvedValue(axiosResponse)

    await expect(createProduct(product)).rejects.toThrow(
      `createProduct: Unexpected status ${axiosResponse.status}`,
    )
  })

  it("re-throws network or other errors", async () => {
    const networkError = new Error("Network down")
    mockedPost.mockRejectedValue(networkError)

    await expect(createProduct(product)).rejects.toBe(networkError)
  })
})
