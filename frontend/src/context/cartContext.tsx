import { LOCAL_STORAGE_CART } from "@/constants/localStorage"
import { CartContextType, CartItem } from "@/types/Cart"
import { Product } from "@/types/Product"
import { titleCase } from "@/utils/titleCase"
import { readCart } from "@/utils/cartStorage"
import { ReactNode, createContext, use, useEffect, useState } from "react"
import { useNotificationContext } from "./notificationContext"

export const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(readCart)
  const { setNotification } = useNotificationContext()

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CART, JSON.stringify(cart))
    } catch {
      // Shopping still works in memory when browser storage is unavailable.
    }
  }, [cart])

  const addProduct = (product: Product, quantity: number) => {
    if (Number.isSafeInteger(quantity) && quantity > 0) {
      setCart((currentCart) => {
        const existingProduct = currentCart.find(
          (item) => item.product.name === product.name,
        )
        if (existingProduct) {
          return currentCart.map((item: CartItem) =>
            item.product.name === product.name
              ? {
                  ...item,
                  quantity: Math.min(
                    Number.MAX_SAFE_INTEGER,
                    item.quantity + quantity,
                  ),
                }
              : item,
          )
        }
        return [...currentCart, { product, quantity }]
      })

      setNotification(
        `${quantity} ${titleCase(product.name, "_")} were added to your cart`,
      )
      setTimeout(() => setNotification(null), 1300)
    }
  }

  const updateProductQuantity = (productName: string, newQuantity: number) => {
    if (Number.isSafeInteger(newQuantity) && newQuantity > 0) {
      setCart((currentCart) =>
        currentCart.map((item: CartItem) =>
          item.product.name === productName
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      )
    }
  }

  const removeProduct = (productName: string) => {
    setCart((currentCart) =>
      currentCart.filter((item: CartItem) => item.product.name !== productName),
    )
  }

  const getAllProductsQuantity = cart.reduce(
    (total: number, item: CartItem) => total + item.quantity,
    0,
  )

  return (
    <CartContext
      value={{
        cart,
        addProduct,
        updateProductQuantity,
        removeProduct,
        getAllProductsQuantity,
        setCart,
      }}
    >
      {children}
    </CartContext>
  )
}

export const useCartContext = (): CartContextType => {
  const context = use(CartContext)
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider")
  }
  return context
}
