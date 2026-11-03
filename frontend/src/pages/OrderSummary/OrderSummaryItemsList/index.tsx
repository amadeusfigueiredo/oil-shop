import { CartItem } from "@/types/Order"
import { FC } from "react"
import { OrderSummaryItem } from "./OrderSummaryItem"
import styles from "./orderSummaryItemsList.module.scss"

interface OrderSummaryItemsListProps {
  orderAndCartItems: { orderItems: CartItem[] }
}

export const OrderSummaryItemsList: FC<OrderSummaryItemsListProps> = ({
  orderAndCartItems,
}) => {
  return (
    <section className={styles.container} aria-label='Ordered items'>
      <ul className={styles.list}>
        {orderAndCartItems.orderItems &&
          orderAndCartItems.orderItems.map((item) => (
            <li key={item.product.id} className={styles.item}>
              <OrderSummaryItem
                image={item.product.image}
                name={item.product.name}
                size={Number(item.product.size)}
                quantity={item.quantity}
              />
            </li>
          ))}
      </ul>
    </section>
  )
}
