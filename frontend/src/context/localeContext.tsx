import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  use,
  useState,
} from "react"
import de from "../i18n/de.json"
import en from "../i18n/en.json"

export const languages = { en, de }

export type Language = keyof typeof languages

export interface LocaleContextTypes {
  languages: typeof languages
  setLanguage: Dispatch<SetStateAction<Language>>
  language: Language
  translate: (typeof languages)[Language]
}

export const LocaleContext = createContext<LocaleContextTypes | undefined>(
  undefined,
)

export const LocaleContextProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [language, setLanguage] = useState<Language>("en")

  return (
    <LocaleContext
      value={{
        languages,
        translate: languages[language],
        language,
        setLanguage,
      }}
    >
      {children}
    </LocaleContext>
  )
}

export const useLocaleContext = () => {
  const context = use(LocaleContext)
  if (context === undefined) {
    throw new Error(
      "useLocaleContext must be used within a LocaleContextProvider",
    )
  }
  return context
}
