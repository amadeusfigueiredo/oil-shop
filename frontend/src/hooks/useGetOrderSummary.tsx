import {
  initialOrderData,
  initialShippingData,
  initialUserData,
} from "@/constants/orderSummaryData"
import { useNotificationContext } from "@/context/notificationContext"
import { useUserContext } from "@/context/userContext"
import { CartItem, OrderData } from "@/types/Order"
import { useEffect, useState } from "react"
import { onGetOrderSummary } from "../utils/onGetOrderSummary"

export const useGetOrderSummary = () => {
  const { setNotification } = useNotificationContext()
  const [orderAndCartItems, setOrderAndCartItems] = useState<{
    orderItems: CartItem[]
  }>({ orderItems: [] })
  const [shippingData, setShippingData] = useState(initialShippingData)
  const [userData, setUserData] = useState(initialUserData)
  const [orderData, setOrderData] = useState<OrderData>(initialOrderData)
  const { isLoggedIn, user } = useUserContext()

  useEffect(() => {
    const getOrderSummary = async () => {
      if (isLoggedIn && user) {
        const currentUserId = user.id
        const userSummaryResponse = await onGetOrderSummary(
          currentUserId,
          setNotification,
        )
        if (userSummaryResponse) {
          setShippingData(userSummaryResponse.shippingData)
          setUserData(userSummaryResponse.userData)
          setOrderData(userSummaryResponse.orderData as OrderData)
          setOrderAndCartItems(userSummaryResponse.orderAndCartItems)
        }
      }
    }

    getOrderSummary()
  }, [isLoggedIn, user, setNotification])

  return { userData, shippingData, orderData, orderAndCartItems }
}
