import { LocaleContext } from "@/context/localeContext"
import de from "@/i18n/de.json"
import en from "@/i18n/en.json"
import { act, renderHook } from "@testing-library/react"
import { FC, ReactNode, useState } from "react"
import { useTranslation } from "./useTranslation"

const languages = { en, de }

const ContextWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<keyof typeof languages>("en")

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

describe("useTranslation hook", () => {
  test("change from English to German", () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: ContextWrapper,
    })

    expect(result.current.translate).toEqual(languages.en)
    expect(result.current.language).toBe("en")

    act(() => {
      result.current.setLanguage("de")
    })

    expect(result.current.language).toBe("de")
    expect(result.current.translate).toEqual(languages.de)
  })

  test("translate common properties correctly", () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: ContextWrapper,
    })

    expect(result.current.commonProperties).toEqual(
      languages.en.commonProperties,
    )

    act(() => {
      result.current.setLanguage("de")
    })

    expect(result.current.commonProperties).toEqual(
      languages.de.commonProperties,
    )
  })
})
