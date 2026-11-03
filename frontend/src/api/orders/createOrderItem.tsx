import { ORDER_ITEMS } from "@/constants/api"
import { OrderItem } from "@/types/Order"
import axios from "axios"

export const createOrderItem = async (order: OrderItem) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}${ORDER_ITEMS}`,
      order,
      { withCredentials: true },
    )
    if (response && response.status === 201) {
      return response
    }
  } catch (error) {
    console.error("Error by creating order item", error)
    throw error
  }
}
