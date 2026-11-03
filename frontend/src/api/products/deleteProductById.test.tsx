import axios, { AxiosResponse } from "axios"
import { describe, it, expect, vi } from "vitest"

import { deleteProductById } from "./deleteProductById"
import { PRODUCTS } from "@/constants/api"
import { product } from "@/__mocks__/product"
import { emptyAxiosResponse } from "@/__mocks__/api/emptyAxiosResponse"

vi.mock("axios")
const mockedDelete = vi.mocked(axios.delete)

describe("deleteProductById", () => {
  const baseUrl = import.meta.env.VITE_APP_API_URL

  it("resolves when status is 200", async () => {
    const axiosResponse = {
      data: undefined,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    } as unknown as AxiosResponse<void>

    mockedDelete.mockResolvedValue(axiosResponse)

    const result = await deleteProductById(product.id)

    expect(mockedDelete).toHaveBeenCalledWith(
      `${baseUrl}${PRODUCTS}/${product.id}`,
      { withCredentials: true },
    )
    expect(result).toBe(axiosResponse)
  })

  it("throws error if status is not 200", async () => {
    const axiosResponse = emptyAxiosResponse as unknown as AxiosResponse<void>
    mockedDelete.mockResolvedValue(axiosResponse)

    await expect(deleteProductById(product.id)).rejects.toThrow(
      `deleteProductById: Unexpected status ${axiosResponse.status}`,
    )
  })

  it("re-throws network or other errors", async () => {
    const networkError = new Error("Network error")
    mockedDelete.mockRejectedValue(networkError)

    await expect(deleteProductById(product.id)).rejects.toBe(networkError)
  })
})
