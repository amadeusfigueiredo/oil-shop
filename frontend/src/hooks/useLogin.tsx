import { login } from "@/api/auth/login"
import { CURRENT_ADMIN, CURRENT_CUSTOMER } from "@/constants/routes"
import { useNotificationContext } from "@/context/notificationContext"
import { useUserContext } from "@/context/userContext"
import { onRequestError } from "@/utils/onRequestError"
import { FormEvent } from "react"
import { useNavigate } from "react-router-dom"

export const useLogin = () => {
  const { setIsLoggedIn, setUser } = useUserContext()
  const { onSetNotification } = useNotificationContext()
  const navigate = useNavigate()
  const setLoggedUser = async (
    e: FormEvent<HTMLFormElement>,
    email: string,
    password: string,
  ) => {
    e.preventDefault()

    try {
      const loginResponse = await login(email, password)
      if (loginResponse && loginResponse.status === 200) {
        const user = loginResponse.data.user
        setUser(user)
        setIsLoggedIn(true)
        if (user.role?.name === "admin") {
          navigate(CURRENT_ADMIN)
        } else if (user.role?.name === "customer") {
          navigate(CURRENT_CUSTOMER)
        }
      }
      if (loginResponse && loginResponse.status === 401) {
        onSetNotification("Email or password invalid")
        return
      }
    } catch (error) {
      onRequestError(error, onSetNotification)
    }
  }

  return {
    setLoggedUser,
  }
}
