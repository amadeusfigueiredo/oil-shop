import { Category, CreateProduct, EditProduct, Product } from "@/types/Product"
import {
  createContext,
  Dispatch,
  FormEvent,
  MouseEvent,
  SetStateAction,
} from "react"

type Value = {
  products: Product[]
  setProducts: Dispatch<SetStateAction<Product[]>>
  onCreateProduct: (data: {
    e: FormEvent<HTMLFormElement>
    data: CreateProduct
    file?: File | null | undefined
  }) => Promise<void>
  onUpdateProduct: (data: {
    id: number
    initialData: EditProduct
    updatedData: EditProduct
    setUpdatedData: Dispatch<SetStateAction<EditProduct>>
  }) => Promise<void>
  onDeleteProduct: (e: MouseEvent, id: number) => Promise<void>
  sortCategory: string | undefined
  setSortCategory: Dispatch<SetStateAction<string | undefined>>
  categories: Category[]
}

export const ProductContext = createContext<Value>(undefined!)
