import { ReactNode, MouseEvent, FC } from "react"
import { renderHook, act, waitFor } from "@testing-library/react"
import { describe, it, expect, beforeEach, vi } from "vitest"

import { ProductProvider } from "./ProductProvider"
import { useProductContext } from "./useProductContext"
import { NotificationProvider } from "@/context/notificationContext"

vi.mock("@/api/products/getProducts", () => ({ getProducts: vi.fn() }))
vi.mock("@/api/products/getProductCategories", () => ({
  getProductCategories: vi.fn(),
}))
vi.mock("@/api/products/deleteProductById", () => ({
  deleteProductById: vi.fn(),
}))

import { getProducts } from "@/api/products/getProducts"
import { getProductCategories } from "@/api/products/getProductCategories"
import * as deleteModule from "@/api/products/deleteProductById"
import { products } from "@/__mocks__/products"
import { productCategories } from "@/__mocks__/productCategories"
import { product } from "@/__mocks__/product"
import { AxiosResponse } from "axios"
import { Category, Product } from "@/types/Product"

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
  <NotificationProvider>
    <ProductProvider>{children}</ProductProvider>
  </NotificationProvider>
)

describe("ProductProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("fetches products & categories on mount", async () => {
    const mockedGetProducts = vi.mocked(getProducts)
    const mockedGetCategories = vi.mocked(getProductCategories)

    mockedGetProducts.mockResolvedValue({
      status: 200,
      data: products,
    } as AxiosResponse<Product[]>)

    mockedGetCategories.mockResolvedValue({
      status: 200,
      data: [productCategories[4]!],
    } as AxiosResponse<Category[]>)

    const { result } = renderHook(() => useProductContext(), {
      wrapper: Wrapper,
    })

    expect(result.current.products).toEqual([])
    expect(result.current.categories).toEqual([])

    await waitFor(() => {
      expect(mockedGetProducts).toHaveBeenCalledTimes(1)
      expect(mockedGetCategories).toHaveBeenCalledTimes(1)
      expect(result.current.products).toHaveLength(2)
      expect(result.current.categories).toHaveLength(1)
    })
  })

  it("removes a product when onDeleteProduct is called", async () => {
    vi.mocked(getProducts).mockResolvedValue({
      status: 200,
      data: [product],
    } as AxiosResponse<Product[]>)

    vi.mocked(getProductCategories).mockResolvedValue({
      status: 200,
      data: [],
    } as unknown as AxiosResponse<Category[]>)

    const deleteSpy = vi
      .spyOn(deleteModule, "deleteProductById")
      .mockResolvedValue({ status: 200 } as unknown as AxiosResponse<void>)

    const { result } = renderHook(() => useProductContext(), {
      wrapper: Wrapper,
    })

    await waitFor(() => expect(result.current.products).toHaveLength(1))

    await act(async () => {
      const fakeEvent = {
        preventDefault: vi.fn(),
      } as unknown as MouseEvent<HTMLButtonElement>
      await result.current.onDeleteProduct(fakeEvent, product.id)
    })

    expect(deleteSpy).toHaveBeenCalledWith(product.id)
    expect(result.current.products).toHaveLength(0)
  })
})
