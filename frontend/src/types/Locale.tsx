import { Language, languages } from "@/context/localeContext"
import { Dispatch, SetStateAction } from "react"

export interface Translation {
  components: Components
  pages: Pages
  commonButtons: CommonButtons
  commonProperties: CommonProperties
  language: Language
  setLanguage: Dispatch<SetStateAction<Language>>
  translate: (typeof languages)[Language]
}

export interface CommonButtons {
  [key: string]: string
}
export type Pages = (typeof languages)[Language]["pages"]
export type Components = (typeof languages)[Language]["components"]
export interface CommonProperties {
  [key: string]: string
}
