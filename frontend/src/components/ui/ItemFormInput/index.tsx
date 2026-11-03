import { useTranslation } from "@/hooks/useTranslation"
import { CommonButtons, CommonProperties } from "@/types/Locale"
import { ChangeEvent, FC } from "react"
import styles from "./itemFormInput.module.scss"

interface ItemFormInputProps {
  name: string
  updatedPropertyData: object
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  type: string
}

export const ItemFormInput: FC<ItemFormInputProps> = ({
  name,
  updatedPropertyData,
  onChange,
  type,
}) => {
  const { commonProperties } = useTranslation() as {
    commonButtons: CommonButtons
    commonProperties: CommonProperties
  }

  const value: unknown = Reflect.get(updatedPropertyData, name)

  return (
    <div className={styles.item}>
      <div className={styles.inputContainer}>
        <label htmlFor={name} className={styles.label}>
          {commonProperties[name]}
        </label>
        {type === "file" ? (
          <input
            name={name}
            className={styles.input}
            onChange={onChange}
            type={type}
          />
        ) : (
          <input
            name={name}
            className={styles.input}
            onChange={onChange}
            placeholder={commonProperties[name]}
            value={
              typeof value === "string" || typeof value === "number"
                ? value
                : ""
            }
            type={type}
          />
        )}
      </div>
    </div>
  )
}
