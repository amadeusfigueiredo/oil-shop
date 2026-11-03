import { Product } from "@/types/Product"
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  use,
  useState,
} from "react"

interface MatchedItemsContextType {
  matchedProducts: Product[]
  setMatchedProducts: Dispatch<SetStateAction<Product[]>>
  showMatchedProductsList: boolean
  setShowMatchedProductsList: Dispatch<SetStateAction<boolean>>
  searchProductText: string
  setSearchProductText: Dispatch<SetStateAction<string>>
}

const MatchedItemsContext = createContext<MatchedItemsContextType | undefined>(
  undefined,
)

export const useMatchedItemsContext = () => {
  const context = use(MatchedItemsContext)
  if (!context) {
    throw new Error(
      "useMatchedItemsContext must be used within a MatchedItemsProvider",
    )
  }
  return context
}

export const MatchedItemsProvider = ({ children }: { children: ReactNode }) => {
  const [matchedProducts, setMatchedProducts] = useState<Product[]>([])
  const [showMatchedProductsList, setShowMatchedProductsList] =
    useState<boolean>(false)
  const [searchProductText, setSearchProductText] = useState<string>("")

  return (
    <MatchedItemsContext
      value={{
        matchedProducts,
        setMatchedProducts,
        showMatchedProductsList,
        setShowMatchedProductsList,
        searchProductText,
        setSearchProductText,
      }}
    >
      {children}
    </MatchedItemsContext>
  )
}
