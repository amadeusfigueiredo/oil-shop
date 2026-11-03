import { translateByPath } from "@/utils/translateByPath"
import { LOGO_IMAGE } from "@/constants/media"
import { SHOP } from "@/constants/routes"
import { useLocaleContext } from "@/context/localeContext"
import { useTranslation } from "@/hooks/useTranslation"
import { Category } from "@/types/Product"
import { camelCase } from "@/utils/camelCase"
import { getIconByName } from "@/utils/getIconByName"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Dispatch, FC, SetStateAction } from "react"
import { useNavigate } from "react-router-dom"
import { ActionButton } from "../ActionButton"
import styles from "./sidebar.module.scss"

interface SidebarProps {
  items: Category[]
  setShowSidebar: Dispatch<SetStateAction<boolean>>
  showSidebar: boolean
  setItems: Dispatch<SetStateAction<string | undefined>>
}

export const Sidebar: FC<SidebarProps> = ({
  items,
  setShowSidebar,
  setItems,
  showSidebar,
}) => {
  const { setLanguage, language } = useLocaleContext()
  const { components } = useTranslation()
  const navigate = useNavigate()
  const onSelect = (item: string) => {
    setItems(item)
    navigate(SHOP)
    setShowSidebar(false)
  }

  const onSetLanguage = (language: "en" | "de") => {
    setLanguage(language)
    setShowSidebar(false)
  }

  return (
    <nav
      className={`${styles.sidebar} ${
        showSidebar ? styles.visible : styles.hidden
      }`}
    >
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <img className={styles.logo} src={LOGO_IMAGE} />
        </div>
        <ActionButton
          action={() => setShowSidebar(false)}
          className='sidebarHeader'
        >
          <FontAwesomeIcon icon={getIconByName("faX")} size={"sm"} />
        </ActionButton>
      </div>
      <div className={styles.separator} role='separator'></div>
      <div className={styles.listContainer}>
        <ul className={styles.list} role='menu'>
          {language === "en" ? (
            <li
              className={`${styles.listItem} ${styles.onlyMobile}`}
              onClick={() => onSetLanguage("de")}
            >
              <div className={styles.listItemLink}>
                <span className={styles.listItemLinkContent}>DE</span>
              </div>
            </li>
          ) : (
            <li
              className={`${styles.listItem} ${styles.onlyMobile}`}
              onClick={() => onSetLanguage("en")}
            >
              <div className={styles.listItemLink}>
                <span className={styles.listItemLinkContent}>EN</span>
              </div>
            </li>
          )}
          <li className={styles.listItem} onClick={() => onSelect("all")}>
            <div className={styles.listItemLink}>
              <span className={styles.listItemLinkContent}>
                {components.sidebar.productCategories.all}
              </span>
            </div>
          </li>
          {items.map((item: Category) => (
            <li
              key={item.id}
              className={styles.listItem}
              onClick={() => onSelect(item.name)}
            >
              <div className={styles.listItemLink}>
                <span className={styles.listItemLinkContent}>
                  {translateByPath(
                    components.sidebar.productCategories,
                    camelCase(item.name, " "),
                  )}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
