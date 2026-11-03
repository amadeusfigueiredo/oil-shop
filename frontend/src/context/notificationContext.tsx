import { NotificationCard } from "@/components/ui/NotificationCard"
import { MESSAGE_TIMEOUT } from "@/constants/time"
import { NotificationContextType } from "@/types/Notification"
import {
  ReactNode,
  createContext,
  useCallback,
  use,
  useEffect,
  useRef,
  useState,
} from "react"

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined)

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<string | null>(null)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onSetNotification = useCallback((message: string) => {
    if (timeout.current !== null) clearTimeout(timeout.current)
    setNotification(message)
    timeout.current = setTimeout(() => setNotification(null), MESSAGE_TIMEOUT)
  }, [])

  useEffect(
    () => () => {
      if (timeout.current !== null) clearTimeout(timeout.current)
    },
    [],
  )

  return (
    <NotificationContext
      value={{
        setNotification,
        onSetNotification,
      }}
    >
      {children}
      {notification && <NotificationCard message={notification} />}
    </NotificationContext>
  )
}

export const useNotificationContext = (): NotificationContextType => {
  const context = use(NotificationContext)
  if (!context) {
    console.error("can not access useNotificationContext")
    throw new Error(
      "useNotificationContext should be accessible through a NotificationProvider",
    )
  }
  return context
}
