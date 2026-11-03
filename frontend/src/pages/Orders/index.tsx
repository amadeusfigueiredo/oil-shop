import { AccountSectionHeader } from "@/components/ui/AccountSectionHeader"
import { NoItemsCard } from "@/components/ui/NoItemsCard"
import { SHOP } from "@/constants/routes"
import { useUserContext } from "@/context/userContext"
import { useGetOrders } from "@/hooks/useGetOrders"
import { useTranslation } from "@/hooks/useTranslation"
import { useVerifyIsLoggedIn } from "@/hooks/useVerifyIsLoggedIn"
import { getIconByName } from "@/utils/getIconByName"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC, useEffect } from "react"
import { Order } from "./Order"
import styles from "./orders.module.scss"

export const Orders: FC = () => {
  const { orders } = useGetOrders()
  const { verifyIsLoggedIn } = useVerifyIsLoggedIn()
  const { isLoading } = useUserContext()
  const { components } = useTranslation()
  const text = components.accountSectionHeader.orders

  useEffect(() => {
    if (!isLoading) {
      verifyIsLoggedIn()
    }
  }, [isLoading, verifyIsLoggedIn])

  return (
    <main className={styles.wrapper} aria-label='Orders page'>
      <AccountSectionHeader title={text.title} subtitle={text.subtitle} />
      <section className={styles.ordersContainer}>
        {orders && orders.length > 0 ? (
          <ul className={styles.list}>
            {orders.map((item) => (
              <li className={styles.item} key={item.id}>
                <Order item={item} />
              </li>
            ))}
          </ul>
        ) : (
          <NoItemsCard
            icon={
              <FontAwesomeIcon icon={getIconByName("faCartPlus")} size='4x' />
            }
            title={components.noItemsCard.orders.title}
            subtitle={components.noItemsCard.orders.subtitle}
            link={components.noItemsCard.orders.link}
            route={SHOP}
          />
        )}
      </section>
    </main>
  )
}
