import { navigationMenuItems } from "@/constants/navigation"
import { useMenuContext } from "@/context/menuContext"
import { useLocation } from "react-router-dom"

export const useActivePageLink = () => {
  const { setActivePageLink } = useMenuContext()
  const { pathname } = useLocation()
  const path = pathname.slice(1)
  const activePageLink =
    path === ""
      ? "home"
      : navigationMenuItems.some((item) => item.label === path)
        ? path
        : ""
  return { activePageLink, setActivePageLink }
}
