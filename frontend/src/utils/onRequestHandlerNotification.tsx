import type { NotificationContextType } from "@/types/Notification"
import { SHORT_MESSAGE_TIMEOUT } from "@/constants/time"

export const onRequestHandlerNotification = (
  setNotification: NotificationContextType["setNotification"],
  message = "Request successful",
) => {
  if (setNotification) {
    setNotification(message)
    setTimeout(() => setNotification(null), SHORT_MESSAGE_TIMEOUT)
  }
}
