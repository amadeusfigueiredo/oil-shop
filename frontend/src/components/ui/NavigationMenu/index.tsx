import { ActionButton } from "@/components/ui/ActionButton"
import { navigationMenuItems } from "@/constants/navigation"
import { LOGIN, SIGN_UP, SIGN_UP_ADMIN } from "@/constants/routes"
import { useMenuContext } from "@/context/menuContext"
import { useActivePageLink } from "@/hooks/useActivePageLink"
import { useTranslation } from "@/hooks/useTranslation"
import { translateByPath } from "@/utils/translateByPath"
import { MouseEvent } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import styles from "./navigationMenu.module.scss"

export const NavigationMenu = () => {
  const { activePageLink, setActivePageLink } = useActivePageLink()
  const { components } = useTranslation()
  const { setShowMobileMenu } = useMenuContext()
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname

  const onSelect = (
    e: MouseEvent<HTMLButtonElement>,
    item: { path: string; label: string },
  ) => {
    e.preventDefault()
    setActivePageLink(item.label)
    navigate(item.path)
    setShowMobileMenu(false)
  }

  const ROUTES_WITHOUT_MENU = [LOGIN, SIGN_UP, SIGN_UP_ADMIN]
  return (
    <>
      {!ROUTES_WITHOUT_MENU.includes(currentPath) && (
        <nav className={styles.navigationMenu} aria-label='navigation menu'>
          <ul className={styles.list}>
            {navigationMenuItems &&
              navigationMenuItems.map((item) => {
                return (
                  <li className={styles.listItem} key={item.path}>
                    <ActionButton
                      action={(e) =>
                        onSelect(e as MouseEvent<HTMLButtonElement>, item)
                      }
                      text={translateByPath(
                        components.navigationMenu,
                        item.label,
                      )}
                      className={
                        item.label === activePageLink
                          ? "navigationActive"
                          : "navigation"
                      }
                      aria-label='page navigation item'
                    />
                  </li>
                )
              })}
          </ul>
        </nav>
      )}
    </>
  )
}
