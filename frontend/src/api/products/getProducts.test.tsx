import axios, { AxiosResponse } from "axios"
import { describe, it, expect, vi } from "vitest"

import { getProducts } from "./getProducts"
import { PRODUCTS } from "@/constants/api"
import type { Product } from "@/types/Product"
import { products } from "@/__mocks__/products"
import { emptyAxiosResponse } from "@/__mocks__/api/emptyAxiosResponse"

vi.mock("axios")
const mockedGet = vi.mocked(axios.get)

describe("getProducts", () => {
  const baseUrl = import.meta.env.VITE_APP_API_URL

  it("resolves when status is 200", async () => {
    const axiosResponse = {
      data: products,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    } as unknown as AxiosResponse<Product[]>

    mockedGet.mockResolvedValue(axiosResponse)

    const result = await getProducts()

    expect(mockedGet).toHaveBeenCalledWith(`${baseUrl}${PRODUCTS}`)
    expect(result).toBe(axiosResponse)
  })

  it("throws error if status is not 200", async () => {
    const axiosResponse = emptyAxiosResponse as unknown as AxiosResponse<
      Product[]
    >
    mockedGet.mockResolvedValue(axiosResponse)

    await expect(getProducts()).rejects.toThrow(
      `Got status ${axiosResponse.status}`,
    )
  })

  it("throws network", async () => {
    const networkError = new Error("Network down")
    mockedGet.mockRejectedValue(networkError)

    await expect(getProducts()).rejects.toBe(networkError)
  })
})
