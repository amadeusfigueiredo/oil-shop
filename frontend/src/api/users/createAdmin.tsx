import { CREATE_ADMIN } from "@/constants/api"
import { CreateUser, User } from "@/types/User"
import axios from "axios"

export const createAdmin = async (item: CreateUser) => {
  try {
    const response = await axios.post<{ user: User; message: string }>(
      `${import.meta.env.VITE_APP_API_URL}${CREATE_ADMIN}`,
      item,
      { withCredentials: true },
    )
    if (
      (response && response.status === 201) ||
      (response && response.status === 422)
    ) {
      return response
    }
  } catch (error) {
    console.error("Error by creating admin", error)
    throw error
  }
}
