import { CURRENT_ADMIN } from "@/constants/routes"
import { LONG_REDIRECT_TIMEOUT, SHORT_MESSAGE_TIMEOUT } from "@/constants/time"
import { useNotificationContext } from "@/context/notificationContext"
import { useUserContext } from "@/context/userContext"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const useRedirectAdminFromCheckout = () => {
  const { setNotification } = useNotificationContext()
  const { user, isLoggedIn } = useUserContext()

  const navigate = useNavigate()

  useEffect(() => {
    let redirectTimeoutId: ReturnType<typeof setTimeout> | undefined
    let notificationTimeoutId: ReturnType<typeof setTimeout> | undefined
    if (user?.role?.name === "admin") {
      setNotification(
        "As an Admin you can not visit this page, make an customer account for that",
      )
      notificationTimeoutId = setTimeout(
        () => setNotification(null),
        SHORT_MESSAGE_TIMEOUT,
      )
      redirectTimeoutId = setTimeout(
        () => navigate(CURRENT_ADMIN),
        LONG_REDIRECT_TIMEOUT,
      )
    }
    return () => {
      clearTimeout(redirectTimeoutId)
      clearTimeout(notificationTimeoutId)
    }
  }, [user, navigate, setNotification])

  return { setNotification, isLoggedIn, user }
}
