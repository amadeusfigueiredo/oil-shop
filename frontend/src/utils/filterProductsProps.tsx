import { STYLES } from "@/constants/styles"
import { Product } from "@/types/Product"
export const filterProductsProps = [
  {
    action: (list: Product[]) =>
      list.sort((a, b) => a.name.localeCompare(b.name)),
    targetProperty: "name",
    className: STYLES.BUTTONS.ACTION,
    isAsc: true,
  },
  {
    action: (list: Product[]) =>
      list.sort((a, b) => b.name.localeCompare(a.name)),
    targetProperty: "name",
    className: STYLES.BUTTONS.ACTION,
    isAsc: false,
  },
  {
    action: (list: Product[]) =>
      list.sort((a, b) => a.categoryId - b.categoryId),
    targetProperty: "category",
    className: STYLES.BUTTONS.ACTION,
    isAsc: true,
  },
  {
    action: (list: Product[]) =>
      list.sort((a, b) => b.categoryId - a.categoryId),
    targetProperty: "category",
    className: STYLES.BUTTONS.ACTION,
    isAsc: false,
  },
  {
    action: (list: Product[]) => list.sort((a, b) => a.price - b.price),
    targetProperty: "price",
    className: STYLES.BUTTONS.ACTION,
    isAsc: true,
  },
  {
    action: (list: Product[]) => list.sort((a, b) => b.price - a.price),

    targetProperty: "price",
    className: STYLES.BUTTONS.ACTION,
    isAsc: false,
  },
  {
    action: (list: Product[]) => list.sort((a, b) => a.size - b.size),
    targetProperty: "size",
    className: STYLES.BUTTONS.ACTION,
    isAsc: true,
  },
  {
    action: (list: Product[]) => list.sort((a, b) => b.size - a.size),
    targetProperty: "size",
    className: STYLES.BUTTONS.ACTION,
    isAsc: false,
  },
] as const
