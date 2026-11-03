import { act, renderHook } from "@testing-library/react"
import { ReactNode } from "react"
import { product } from "@/__mocks__/product"
import { CartProvider, useCartContext } from "./cartContext"
import { NotificationContext } from "./notificationContext"
import { LOCAL_STORAGE_CART } from "@/constants/localStorage"

const wrapper = ({ children }: { children: ReactNode }) => (
  <NotificationContext
    value={{ setNotification: vi.fn(), onSetNotification: vi.fn() }}
  >
    <CartProvider>{children}</CartProvider>
  </NotificationContext>
)

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers()
})
afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

test("multiple additions in one render preserve every quantity", () => {
  const { result } = renderHook(useCartContext, { wrapper })
  act(() => {
    result.current.addProduct(product, 1)
    result.current.addProduct(product, 2)
  })
  expect(result.current.cart).toHaveLength(1)
  expect(result.current.cart[0]?.quantity).toBe(3)
})

test("batched quantity changes and removals both persist", () => {
  const other = { ...product, id: 2, name: "Other product" }
  const { result } = renderHook(useCartContext, { wrapper })
  act(() => result.current.addProduct(product, 1))
  act(() => result.current.addProduct(other, 1))
  act(() => {
    result.current.updateProductQuantity(product.name, 5)
    result.current.removeProduct(other.name)
  })
  expect(result.current.cart).toEqual([{ product, quantity: 5 }])
})

test.each(["null", "{}", '[{"quantity":1}]', "invalid json"])(
  "corrupt saved cart %s cannot crash the page",
  (value) => {
    localStorage.setItem(LOCAL_STORAGE_CART, value)
    const { result } = renderHook(useCartContext, { wrapper })
    expect(result.current.cart).toEqual([])
  },
)

test("invalid quantities cannot enter the cart", () => {
  const { result } = renderHook(useCartContext, { wrapper })
  act(() => {
    result.current.addProduct(product, Infinity)
    result.current.addProduct(product, 1.5)
  })
  expect(result.current.cart).toEqual([])
})

test("storage quota errors do not break shopping", () => {
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("Quota exceeded")
  })
  const { result } = renderHook(useCartContext, { wrapper })
  act(() => result.current.addProduct(product, 1))
  expect(result.current.cart).toEqual([{ product, quantity: 1 }])
})
