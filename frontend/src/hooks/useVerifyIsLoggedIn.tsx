import { useCallback } from "react"
import { LOGIN } from "@/constants/routes"
import { useUserContext } from "@/context/userContext"
import { useNavigate } from "react-router-dom"

export const useVerifyIsLoggedIn = () => {
  const { isLoading, isLoggedIn } = useUserContext()
  const navigate = useNavigate()

  const verifyIsLoggedIn = useCallback(() => {
    if (isLoading) {
      return
    } else {
      if (!isLoggedIn) {
        navigate(LOGIN)
      } else {
        return
      }
    }
  }, [isLoading, isLoggedIn, navigate])

  return { verifyIsLoggedIn }
}
