import { DEFAULT_USER_IMAGE } from "@/constants/media"
import { useUserContext } from "@/context/userContext"
import { useTranslation } from "@/hooks/useTranslation"
import { UserHeader as IUserHeader } from "@/types/User"
import { setDefaultImageByError } from "@/utils/setDefaultImageByError"
import styles from "./userHeader.module.scss"

export const UserHeader = () => {
  const { user, isLoading } = useUserContext()
  const { commonProperties } = useTranslation()

  const userData: IUserHeader | null = isLoading
    ? null
    : {
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        image: user?.image,
      }

  return (
    <header className={styles.wrapper} aria-label='User Description'>
      <section className={styles.container}>
        {userData ? (
          <div className={styles.content}>
            <div className={styles.imageContainer}>
              <img
                className={styles.image}
                src={userData.image || DEFAULT_USER_IMAGE}
                alt='user'
                onError={(e) => setDefaultImageByError(e, DEFAULT_USER_IMAGE)}
              />
            </div>
            <dl className={styles.fields}>
              <ul className={styles.list}>
                {userData &&
                  Object.keys(userData)
                    .filter((property) => property !== "image")
                    .map((property) => (
                      <li key={property} className={styles.item}>
                        <dt
                          className={styles.property}
                        >{`${commonProperties[property]}: `}</dt>
                        <dd className={styles.value}>
                          {userData[property as keyof IUserHeader]}
                        </dd>
                      </li>
                    ))}
              </ul>
            </dl>
          </div>
        ) : (
          `loading Data`
        )}
      </section>
    </header>
  )
}
