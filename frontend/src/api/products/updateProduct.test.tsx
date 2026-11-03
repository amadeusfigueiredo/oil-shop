import axios, { AxiosResponse } from "axios"
import { describe, it, expect, vi } from "vitest"

import { updateProduct } from "./updateProduct"
import { PRODUCTS } from "@/constants/api"
import type { Product } from "@/types/Product"
import { product } from "@/__mocks__/product"
import { emptyAxiosResponse } from "@/__mocks__/api/emptyAxiosResponse"

vi.mock("axios")
const mockedPut = vi.mocked(axios.put)

describe("updateProduct", () => {
  const baseUrl = import.meta.env.VITE_APP_API_URL

  it("resolves successfully", async () => {
    const payload = { product }
    const axiosResponse = {
      data: payload,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    } as unknown as AxiosResponse<{ product: Product }>

    mockedPut.mockResolvedValue(axiosResponse)

    const result = await updateProduct(product.id, product)

    expect(mockedPut).toHaveBeenCalledWith(
      `${baseUrl}${PRODUCTS}/${product.id}`,
      product,
      { withCredentials: true },
    )
    expect(result).toBe(axiosResponse)
  })

  it("throws error if status is not 200", async () => {
    const axiosResponse = emptyAxiosResponse as unknown as AxiosResponse<{
      product: Product
    }>
    mockedPut.mockResolvedValue(axiosResponse)

    await expect(updateProduct(product.id, product)).rejects.toThrow(
      `updateProduct: Unexpected status ${axiosResponse.status}`,
    )
  })

  it("throws network error", async () => {
    const networkError = new Error("Network error")
    mockedPut.mockRejectedValue(networkError)

    await expect(updateProduct(product.id, product)).rejects.toBe(networkError)
  })
})
