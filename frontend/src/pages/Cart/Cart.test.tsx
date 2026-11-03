import { cartDifuserItem, cartItem } from "@/__mocks__/cartItem"
import { user } from "@/__mocks__/user"
import { CartContext } from "@/context/cartContext"
import { LocaleContext } from "@/context/localeContext"
import { UserContext } from "@/context/userContext"
import { useCart } from "@/hooks/useCart"
import de from "@/i18n/de.json"
import en from "@/i18n/en.json"
import { CartItem } from "@/types/Cart"
import { Product } from "@/types/Product"
import { titleCase } from "@/utils/titleCase"
import "@testing-library/jest-dom"
import { act, render, renderHook, screen } from "@testing-library/react"
import { FC, ReactNode, useState } from "react"
import { MemoryRouter } from "react-router-dom"
import { vi } from "vitest"
import { Cart } from "."

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

const UserContextWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const userContextValue = {
    isLoggedIn: true,
    setIsLoggedIn: vi.fn(),
    isLoading: false,
    users: [],
    user: user,
    setUser: vi.fn(),
    onDeleteUser: vi.fn(),
    onCreateCustomer: vi.fn(),
    onUpdateUser: vi.fn(),
    onCreateAdmin: vi.fn(),
    onUpdateShippingData: vi.fn(),
    shippingData: {},
  }

  return <UserContext value={userContextValue}>{children}</UserContext>
}

const setNotification = vi.fn()
const CartContextWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([cartItem])

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

            setNotification(
              `${quantity} ${titleCase(product.name, "_")} were added to your cart`,
            )
            setTimeout(() => setNotification(null), 1300)
          }
        },
        updateProductQuantity: (productName: string, newQuantity: number) => {
          if (newQuantity > 0) {
            setCart(
              cart.map((item: CartItem) =>
                item.product.name === productName
                  ? { ...item, quantity: newQuantity }
                  : item,
              ),
            )
          }
        },
        removeProduct: (productName: string) => {
          setCart(
            cart.filter((item: CartItem) => item.product.name !== productName),
          )
        },
        getAllProductsQuantity: cart.reduce(
          (total, item) => total + item.quantity,
          0,
        ),
      }}
    >
      {children}
    </CartContext>
  )
}

function renderCart() {
  render(
    <MemoryRouter>
      <LocaleContextWrapper>
        <UserContextWrapper>
          <CartContextWrapper>
            <Cart />
          </CartContextWrapper>
        </UserContextWrapper>
      </LocaleContextWrapper>
    </MemoryRouter>,
  )
}

describe("Cart does", () => {
  it("remove product", async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartContextWrapper,
    })

    expect(result.current.cart).toEqual([cartItem])

    act(() => {
      result.current.removeProduct("cart item product")
    })

    expect(result.current.cart).toEqual([])
  })

  it("renders products correctly", () => {
    renderCart()
    expect(screen.getByText("Cart item product")).toBeInTheDocument()
  })

  it("adds product successfully", async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartContextWrapper,
    })

    expect(result.current.cart).toEqual([cartItem])

    act(() => {
      result.current.addProduct(cartDifuserItem, 1)
    })

    expect(result.current.cart).toEqual([
      { ...cartItem, quantity: 1 },
      { product: cartDifuserItem, quantity: 1 },
    ])
  })

  it("updates product quantity successfully", async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartContextWrapper,
    })

    expect(result.current.cart).toEqual([cartItem])

    act(() => {
      result.current.updateProductQuantity(cartItem.product.name, 3)
    })

    expect(result.current.cart).toEqual([{ ...cartItem, quantity: 3 }])
  })
})
