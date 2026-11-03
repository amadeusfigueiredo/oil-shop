import { STYLES } from "@/constants/styles"
import { User } from "@/types/User"
export const filterUsersProps = [
  {
    action: (list: User[]) =>
      list.sort((a, b) => a.firstName.localeCompare(b.firstName)),
    targetProperty: "firstName",
    className: STYLES.BUTTONS.FILTER_OPTION,
    isAsc: true,
  },
  {
    action: (list: User[]) =>
      list.sort((a, b) => b.firstName.localeCompare(a.firstName)),
    targetProperty: "firstName",
    className: STYLES.BUTTONS.FILTER_OPTION,
    isAsc: false,
  },
  {
    action: (list: User[]) =>
      list.sort((a, b) => a.lastName.localeCompare(b.lastName)),
    targetProperty: "lastName",
    className: STYLES.BUTTONS.FILTER_OPTION,
    isAsc: true,
  },
  {
    action: (list: User[]) =>
      list.sort((a, b) => b.lastName.localeCompare(a.lastName)),
    targetProperty: "lastName",
    className: STYLES.BUTTONS.FILTER_OPTION,
    isAsc: false,
  },
  {
    action: (list: User[]) =>
      list.sort((a, b) => a.email.localeCompare(b.email)),
    targetProperty: "email",
    className: STYLES.BUTTONS.FILTER_OPTION,
    isAsc: true,
  },

  {
    action: (list: User[]) =>
      list.sort((a, b) => b.email.localeCompare(a.email)),
    targetProperty: "email",
    className: STYLES.BUTTONS.FILTER_OPTION,
    isAsc: false,
  },
] as const
