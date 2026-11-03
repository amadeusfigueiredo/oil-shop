import { NotificationContextType } from "@/types/Notification"
import { isAxiosError } from "axios"
import { ZodError } from "zod"
import { getErrorMessage } from "./getErrorMessage"

interface ResponseData {
  message?: string
  errors?: { message: string }[]
}

export const onRequestError = (
  error: unknown,
  setNotification: NotificationContextType["onSetNotification"],
  message = "Error by handling request",
) => {
  const data = isAxiosError<ResponseData>(error)
    ? error.response?.data
    : undefined
  const errorMessage = data?.message
  const errorDetails =
    error instanceof ZodError
      ? error.issues[0]?.message
      : data?.errors?.[0]?.message

  if (setNotification) {
    if (errorDetails) {
      setNotification(`Error: ${errorDetails}`)
      return
    }
    if (errorMessage) {
      setNotification(`Error: ${errorMessage}`)
      return
    }
    setNotification(getErrorMessage(error, message))
  }
}
