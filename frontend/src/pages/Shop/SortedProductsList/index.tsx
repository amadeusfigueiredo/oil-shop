import { ProductCard } from "@/components/products/ProductCard"
import { useProductContext } from "@/context/useProductContext"
import { Product } from "@/types/Product"
import { FC } from "react"
import styles from "./sortedProductsList.module.scss"

export const SortedProductsList: FC = () => {
  const { products, sortCategory, categories } = useProductContext()
  const productsList =
    sortCategory &&
    categories.some((category) => category.name === sortCategory)
      ? products.filter((product) => product.category?.name === sortCategory)
      : products

  return (
    <ul className={styles.container} aria-label='products list'>
      {productsList &&
        productsList.map((product: Product) => (
          <li key={product.id} aria-label='products list item'>
            <ProductCard product={product} />
          </li>
        ))}
    </ul>
  )
}
