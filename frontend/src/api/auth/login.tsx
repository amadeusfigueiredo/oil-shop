import type { User } from "@/types/User"
import { LOGIN } from "@/constants/api"
import axios from "axios"

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post<{ user: User; message: string }>(
      `${import.meta.env.VITE_APP_API_URL}${LOGIN}`,
      { email, password },
      { withCredentials: true },
    )
    if (
      (response && response.status === 200) ||
      (response && response.status === 401) ||
      (response && response.status === 404)
    ) {
      return response
    }
  } catch (error) {
    console.error("Error by login user")
    throw error
  }
}
