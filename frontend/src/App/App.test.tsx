import axios, { type AxiosResponse } from "axios"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { products } from "@/__mocks__/products"
import { productCategories } from "@/__mocks__/productCategories"
import { LOCAL_STORAGE_CART } from "@/constants/localStorage"
import en from "@/i18n/en.json"
import { App } from "./App"

vi.mock("axios")

test("a guest can browse a lazy-loaded catalog and add a product to the cart", async () => {
  localStorage.clear()
  window.history.replaceState(null, "", "/shop")
  vi.mocked(axios.get).mockImplementation(async (url) => {
    if (url.endsWith("/products"))
      return { status: 200, data: products } as AxiosResponse
    if (url.endsWith("/product-categories"))
      return { status: 200, data: productCategories } as AxiosResponse
    if (url.endsWith("/auth/user-token"))
      return { status: 403, data: {} } as AxiosResponse
    throw new Error(`Unexpected API request: ${url}`)
  })
  const user = userEvent.setup()
  render(<App />)
  const card = await screen.findByRole(
    "article",
    { name: `product: ${products[0]!.name}` },
    { timeout: 5000 },
  )
  await user.click(
    within(card).getByRole("button", {
      name: en.components.productCard.addProductButton,
    }),
  )
  await user.click(screen.getAllByRole("link", { name: "Shopping cart" })[0]!)
  const items = await screen.findByRole("list", { name: "items list" })
  expect(within(items).getByText(/test product one/i)).toBeInTheDocument()
  expect(JSON.parse(localStorage.getItem(LOCAL_STORAGE_CART) ?? "[]")).toEqual([
    { product: products[0], quantity: 1 },
  ])
  expect(window.location.pathname).toBe("/cart")
})
