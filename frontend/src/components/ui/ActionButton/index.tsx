import type { JSX } from "react"
import { FC, MouseEvent, ReactNode } from "react"
import styles from "./actionButton.module.scss"

interface ActionButtonProps {
  action: (e: MouseEvent<HTMLButtonElement>) => void
  text?: string | JSX.Element
  className?: string
  children?: ReactNode
}

export const ActionButton: FC<ActionButtonProps> = ({
  action,
  text,
  className,
  children,
}) => {
  return (
    <button
      style={{ userSelect: "none" }}
      className={className ? styles[className] : ""}
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        action(e)
      }}
    >
      {children} {text}
    </button>
  )
}
