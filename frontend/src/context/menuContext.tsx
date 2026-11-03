import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  use,
  useState,
} from "react"

interface MenuContextType {
  showMobileMenu: boolean
  setShowMobileMenu: Dispatch<SetStateAction<boolean>>
  activePageLink: string
  setActivePageLink: Dispatch<SetStateAction<string>>
  showSidebar: boolean
  setShowSidebar: Dispatch<SetStateAction<boolean>>
}

export const MenuContext = createContext<MenuContextType | null>(null)

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false)
  const [showSidebar, setShowSidebar] = useState<boolean>(false)
  const [activePageLink, setActivePageLink] = useState<string>("")
  return (
    <MenuContext
      value={{
        showMobileMenu,
        setShowMobileMenu,
        activePageLink,
        setActivePageLink,
        showSidebar,
        setShowSidebar,
      }}
    >
      {children}
    </MenuContext>
  )
}

export const useMenuContext = () => {
  const context = use(MenuContext)
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider")
  }
  return context
}
