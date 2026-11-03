import { product } from "@/__mocks__/product"
import { ProductCard } from "@/components/products/ProductCard"
import { CartContext } from "@/context/cartContext"
import { LocaleContext } from "@/context/localeContext"
import de from "@/i18n/de.json"
import en from "@/i18n/en.json"
import { CartItem } from "@/types/Cart"
import { Product } from "@/types/Product"
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { FC, ReactNode, useState } from "react"
import { MemoryRouter } from "react-router-dom"
import { vi } from "vitest"

const languages = { en, de }
const LocaleContextWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<keyof typeof languages>("en")

  return (
    <LocaleContext
      value={{
        languages,
        translate: languages[language],
        language,
        setLanguage,
      }}
    >
      {children}
    </LocaleContext>
  )
}
const CartContextWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  return (
    <CartContext
      value={{
        cart,
        setCart,
        addProduct: (product: Product, quantity: number) => {
          const existingProduct = cart.find(
            (item: CartItem) => item.product.name === product.name,
          )
          if (quantity > 0) {
            if (existingProduct) {
              setCart(
                cart.map((item: CartItem) =>
                  item.product.name === product.name
                    ? { ...item, quantity: item.quantity + quantity }
                    : item,
                ),
              )
            } else {
              setCart([...cart, { product, quantity }])
            }
          }
        },

        updateProductQuantity: vi.fn(),
        removeProduct: vi.fn(),
        getAllProductsQuantity: cart.reduce(
          (total: number, item: CartItem) => total + item.quantity,
          0,
        ),
      }}
    >
      {children}
    </CartContext>
  )
}

describe("ProductCard", () => {
  function renderCard() {
    render(
      <MemoryRouter>
        <LocaleContextWrapper>
          <CartContextWrapper>
            <ProductCard product={product} />
          </CartContextWrapper>
        </LocaleContextWrapper>
      </MemoryRouter>,
    )
  }

  test("renders product name correctly", () => {
    renderCard()
    expect(screen.getByText(product.name)).toHaveTextContent(product.name)
  })

  test("renders product price correctly", () => {
    renderCard()
    expect(screen.getByText(`${product.price} €`)).toBeInTheDocument()
  })

  test("renders product size correctly", () => {
    renderCard()
    expect(screen.getByText(`${product.size} ml`)).toBeInTheDocument()
  })
})
