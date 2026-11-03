import type { JSX } from "react"
import { FC } from "react"
import styles from "./submitButton.module.scss"

interface SubmitButtonProps {
  text?: string | JSX.Element
  className?: string
}

export const SubmitButton: FC<SubmitButtonProps> = ({ text, className }) => {
  return (
    <button
      type='submit'
      style={{ userSelect: "none" }}
      className={className ? styles[className] : ""}
    >
      {text}
    </button>
  )
}
