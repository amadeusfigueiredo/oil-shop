import { USERS } from "@/constants/api"
import { CreateUser, User } from "@/types/User"
import axios from "axios"

export const createUser = async (user: CreateUser) => {
  try {
    const response = await axios.post<{ user: User; message: string }>(
      `${import.meta.env.VITE_APP_API_URL}${USERS}`,
      user,
    )
    if (
      (response && response.status === 201) ||
      (response && response.status === 422)
    ) {
      return response
    }
  } catch (error) {
    console.error("Error by creating user", error)
    throw error
  }
}
