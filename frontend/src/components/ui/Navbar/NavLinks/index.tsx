import { LanguageSelector } from "@/components/ui/LanguageSelector"
import { LogoutButton } from "@/components/ui/LogoutButton"
import {
  CART,
  CURRENT_ADMIN,
  CURRENT_CUSTOMER,
  LOGIN,
} from "@/constants/routes"
import { STYLES } from "@/constants/styles"
import { useUserContext } from "@/context/userContext"
import { getIconByName } from "@/utils/getIconByName"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC } from "react"
import { Link } from "react-router-dom"
import styles from "./navLinks.module.scss"

export const NavLinks: FC = () => {
  const { isLoggedIn, user } = useUserContext()

  return (
    <section className={styles.container}>
      <ul className={styles.list} aria-label={"navigation items"}>
        <li className={styles.languageSelectorContainer}>
          <LanguageSelector />
        </li>
        {isLoggedIn ? (
          <li className={styles.logout}>
            <Link
              aria-label='My account'
              className={styles.link}
              to={
                (user && user.role?.name) === "admin"
                  ? CURRENT_ADMIN
                  : CURRENT_CUSTOMER
              }
            >
              <FontAwesomeIcon icon={getIconByName("faUser")} color='#fff' />
            </Link>
            <LogoutButton className={STYLES.BUTTONS.LOGOUT} />
          </li>
        ) : (
          <Link className={styles.link} to={LOGIN} aria-label='Sign in'>
            <FontAwesomeIcon icon={getIconByName("faUser")} color='#fff' />
          </Link>
        )}
        <li className={styles.cart}>
          <Link className={styles.link} to={CART} aria-label='Shopping cart'>
            <FontAwesomeIcon
              icon={getIconByName("faCartShopping")}
              color='#fff'
            />
          </Link>
        </li>
      </ul>
    </section>
  )
}
