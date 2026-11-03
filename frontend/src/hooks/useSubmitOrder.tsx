import { getErrorMessage } from "@/utils/getErrorMessage"
import { LOCAL_STORAGE_CART } from "@/constants/localStorage"
import { ORDER_SUMMARY } from "@/constants/routes"
import { SHORT_MESSAGE_TIMEOUT } from "@/constants/time"
import { useUserContext } from "@/context/userContext"
import { useCart } from "@/hooks/useCart"
import { onSubmitRegisteredUserOrder } from "@/utils/onSubmitRegisteredUserOrder"
import { FormEvent } from "react"
import { useNavigate } from "react-router-dom"

type NotificationSetter = (message: string | null) => void

export const useSubmitOrder = () => {
  const { user } = useUserContext()
  const { cart, setCart } = useCart()
  const navigate = useNavigate()

  const submitOrder = async (
    e: FormEvent,
    paymentMethod: string,
    setNotification: NotificationSetter,
  ) => {
    e.preventDefault()

    if (!user) {
      setNotification("User not logged in")
      setTimeout(() => setNotification(null), SHORT_MESSAGE_TIMEOUT)
      return
    }

    try {
      const response = await onSubmitRegisteredUserOrder(
        user.id,
        paymentMethod,
        cart,
        setNotification,
      )
      if (response) {
        navigate(ORDER_SUMMARY)
        localStorage.removeItem(LOCAL_STORAGE_CART)
        setCart([])
      }
    } catch (error) {
      setNotification(getErrorMessage(error))
      setTimeout(() => setNotification(null), SHORT_MESSAGE_TIMEOUT)
    }
  }
  return { submitOrder }
}
