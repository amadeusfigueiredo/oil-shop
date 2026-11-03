import type { User } from "@/types/User"
import { AUTHENTICATED_USER } from "@/constants/api"
import axios from "axios"

export const getAuthenticatedUserById = async (id: number) => {
  try {
    const response = await axios.get<User>(
      `${import.meta.env.VITE_APP_API_URL}${AUTHENTICATED_USER}/${id}`,
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
    console.error("Error by geting authenticated user", error)
    throw error
  }
}
