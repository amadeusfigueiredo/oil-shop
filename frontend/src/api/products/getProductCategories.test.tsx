import axios, { AxiosResponse } from "axios"
import { describe, it, expect, vi } from "vitest"

import { getProductCategories } from "./getProductCategories"
import { PRODUCT_CATEGORIES } from "@/constants/api"
import type { Category } from "@/types/Product"
import { productCategories } from "@/__mocks__/productCategories"
import { emptyAxiosResponse } from "@/__mocks__/api/emptyAxiosResponse"

vi.mock("axios")
const mockedGet = vi.mocked(axios.get)

describe("getProductCategories", () => {
  const baseUrl = import.meta.env.VITE_APP_API_URL

  it("resolves with data when status is 200", async () => {
    const axiosResponse = {
      data: productCategories,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    } as unknown as AxiosResponse<Category[]>

    mockedGet.mockResolvedValue(axiosResponse)

    const result = await getProductCategories()

    expect(mockedGet).toHaveBeenCalledWith(`${baseUrl}${PRODUCT_CATEGORIES}`)
    expect(result).toBe(axiosResponse)
  })

  it("throws if status is not 200", async () => {
    const axiosResponse = emptyAxiosResponse as unknown as AxiosResponse<
      Category[]
    >

    mockedGet.mockResolvedValue(axiosResponse)

    await expect(getProductCategories()).rejects.toThrow(
      "getProductCategories: Unexpected status 404",
    )
  })

  it("re-throws network or other errors", async () => {
    const networkError = new Error("Network error")
    mockedGet.mockRejectedValue(networkError)

    await expect(getProductCategories()).rejects.toBe(networkError)
  })
})
