import { SIGN_UP_ADMIN } from "@/constants/routes"
import { useUserContext } from "@/context/userContext"
import { useLogin } from "@/hooks/useLogin"
import { CreateUser, User } from "@/types/User"
import { FormEvent } from "react"
import { useLocation } from "react-router-dom"

export const useRegisterUser = () => {
  const { onCreateCustomer, onCreateAdmin } = useUserContext()
  const { setLoggedUser } = useLogin()
  const location = useLocation()
  const currentPath = location.pathname
  const isAdmin = currentPath.includes(SIGN_UP_ADMIN)

  const registerUser = async (
    e: FormEvent<HTMLFormElement>,
    data: CreateUser,
  ): Promise<User> => {
    e.preventDefault()
    try {
      let newUser: User | undefined

      if (isAdmin) {
        newUser = await onCreateAdmin(e, data)
      } else {
        newUser = await onCreateCustomer(e, data)
      }

      if (!newUser) {
        throw new Error("User creation failed")
      }

      await setLoggedUser(e, data.email, data.password)
      return newUser
    } catch (error) {
      console.error("Error by registering user", error)
      throw error
    }
  }

  return {
    registerUser,
  }
}
