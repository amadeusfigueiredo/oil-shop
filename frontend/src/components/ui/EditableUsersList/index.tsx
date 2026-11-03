import { useUserContext } from "@/context/userContext"
import { useTranslation } from "@/hooks/useTranslation"
import { filterUsersProps } from "@/utils/filterUsersProps"
import { ChangeEvent, FC, useMemo, useState } from "react"
import { ListUserForm } from "../ListUserForm"
import styles from "./editableUsersList.module.scss"

export const EditableUsersList: FC = () => {
  const [filterIndex, setFilterIndex] = useState<number | null>(null)
  const { pages } = useTranslation()
  const { users } = useUserContext()
  const text = pages.admin.usersManagement.editableItemsList

  const filteredItemsList = useMemo(() => {
    const action =
      filterIndex === null ? undefined : filterUsersProps[filterIndex]?.action
    return action ? action([...users]) : users
  }, [users, filterIndex])

  const selectFilter = (e: ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value)
    if (index >= 0 && index < filterUsersProps.length) {
      setFilterIndex(index)
    }
  }

  return (
    <>
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.filterColumn}>
            <div className={styles.selector}>
              <label className={styles.label} htmlFor='filterOptions'></label>
              <select
                className={styles.select}
                name='filterOptions'
                id='filterOptions'
                onChange={selectFilter}
                defaultValue=''
              >
                <option value='' disabled>
                  {`${text.sortBy} ...`}
                </option>
                {filterUsersProps.map((filterButton, index) => (
                  <option
                    key={`${filterButton.targetProperty}-${filterButton.isAsc}`}
                    value={index}
                  >
                    {filterButton.isAsc
                      ? `${text[filterButton.targetProperty]}: ${
                          text.ascendent
                        }`
                      : `${text[filterButton.targetProperty]}: ${
                          text.descendent
                        }`}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.listColumn}>
            <ul className={styles.list}>
              {filteredItemsList.map((item) => (
                <li className={styles.item} key={item.id}>
                  <ListUserForm item={item} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
