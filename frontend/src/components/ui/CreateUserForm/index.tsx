import { FormInput } from "@/components/ui/FormInput"
import { SubmitButton } from "@/components/ui/SubmitButton"
import { STYLES } from "@/constants/styles"
import { useTranslation } from "@/hooks/useTranslation"
import { CreateUser, User } from "@/types/User"
import { listenInput } from "@/utils/listenInput"
import { FC, FormEvent, useState } from "react"
import styles from "./createUserForm.module.scss"

interface CreateUserFormProps {
  onCreate: (
    e: FormEvent<HTMLFormElement>,
    data: CreateUser,
  ) => Promise<User | undefined>
}

export const CreateUserForm: FC<CreateUserFormProps> = ({ onCreate }) => {
  const { components } = useTranslation()
  const [data, setData] = useState<CreateUser>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const createdUser = await onCreate(e, data)
    if (!createdUser) return
    setData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    })
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      {Object.keys(data).map((field) => (
        <FormInput
          key={field}
          name={field}
          onChangeListener={(e) => listenInput(e, data, setData)}
          placeholder={field}
          label={field}
          type={
            field === "password"
              ? "password"
              : field === "email"
                ? "email"
                : "text"
          }
          value={data[field as keyof CreateUser]?.toString() ?? ""}
        />
      ))}
      <SubmitButton
        text={components.createItem.submitButton}
        className={STYLES.BUTTONS.LOGIN}
      />
    </form>
  )
}
