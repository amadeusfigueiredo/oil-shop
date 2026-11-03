import axios, { AxiosResponse } from "axios"
import { describe, it, expect, vi } from "vitest"

import { getProductByName } from "./getProductByName"
import { PRODUCT_BY_NAME } from "@/constants/api"
import type { Product } from "@/types/Product"
import { product } from "@/__mocks__/product"

vi.mock("axios")
const mockedGet = vi.mocked(axios.get)

describe("getProductByName", () => {
  const baseUrl = import.meta.env.VITE_APP_API_URL

  it("resolves with data when status is 200", async () => {
    const name = product.name
    const axiosResponse = {
      data: product,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    } as unknown as AxiosResponse<Product>

    mockedGet.mockResolvedValue(axiosResponse)

    const result = await getProductByName(name)
    const encodedName = encodeURIComponent(name)

    expect(mockedGet).toHaveBeenCalledWith(
      `${baseUrl}${PRODUCT_BY_NAME}/${encodedName}`,
      { validateStatus: expect.any(Function) },
    )
    expect(result).toBe(axiosResponse)
  })

  it("resolves with undefined data when status is 404", async () => {
    const name = "nonexistent"
    const axiosResponse = {
      data: undefined,
      status: 404,
      statusText: "Not Found",
      headers: {},
      config: {},
    } as unknown as AxiosResponse<Product | undefined>

    mockedGet.mockResolvedValue(axiosResponse)

    const result = await getProductByName(name)

    expect(result).toBe(axiosResponse)
  })

  it("throws if status is not 200 or 404", async () => {
    const name = product.name
    const axiosResponse = {
      data: product,
      status: 500,
      statusText: "Error",
      headers: {},
      config: {},
    } as unknown as AxiosResponse<Product>

    mockedGet.mockResolvedValue(axiosResponse)

    await expect(getProductByName(name)).rejects.toThrow(
      `getProductByName: Unexpected status ${axiosResponse.status}`,
    )
  })

  it("throws network error", async () => {
    const networkError = new Error("Network error")
    mockedGet.mockRejectedValue(networkError)

    await expect(getProductByName(product.name)).rejects.toBe(networkError)
  })
})
