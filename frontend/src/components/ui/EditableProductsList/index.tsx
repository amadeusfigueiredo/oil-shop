import { FC, ChangeEvent, useState, useMemo, useCallback } from "react"
import { useProductContext } from "@/context/useProductContext"
import { useTranslation } from "@/hooks/useTranslation"
import { Product } from "@/types/Product"
import { filterProductsProps } from "@/utils/filterProductsProps"
import { ListProductForm } from "../ListProductForm"
import styles from "./editableProductsList.module.scss"

export const EditableProductsList: FC = () => {
  const { products } = useProductContext()
  const { pages } = useTranslation()
  const text = pages.admin.usersManagement.editableItemsList

  const [filterIndex, setFilterIndex] = useState<number | "">("")

  const sortedProducts = useMemo<Product[]>(() => {
    if (filterIndex === "") return products

    const idx = Number(filterIndex)
    const action = filterProductsProps[idx]?.action
    return action ? action([...products]) : products
  }, [products, filterIndex])

  const handleFilterChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setFilterIndex(e.target.value === "" ? "" : Number(e.target.value))
    },
    [],
  )

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.filterColumn}>
          <label htmlFor='filterOptions' className={styles.label}>
            {text.sortBy}:
          </label>
          <select
            id='filterOptions'
            className={styles.select}
            value={filterIndex}
            onChange={handleFilterChange}
          >
            <option value='' disabled>
              {`${text.sortBy} …`}
            </option>
            {filterProductsProps.map((f, i) => (
              <option key={`${f.targetProperty}-${f.isAsc}`} value={i}>
                {text[f.targetProperty]}:{" "}
                {f.isAsc ? text.ascendent : text.descendent}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.listColumn}>
          <ul className={styles.list}>
            {sortedProducts.map((item) => (
              <li className={styles.item} key={item.id}>
                <ListProductForm item={item} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
