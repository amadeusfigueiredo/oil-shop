import { getAuthenticatedUserById } from "@/api/auth/getAuthenticatedUserById"
import { getDecodedAuthToken } from "@/api/auth/getDecodedAuthToken"
import { createAdmin } from "@/api/users/createAdmin"
import { createUser } from "@/api/users/createUser"
import { deleteUserById } from "@/api/users/deleteUserById"
import { getUserShippingData } from "@/api/users/getUserShippingData"
import { getUsers } from "@/api/users/getUsers"
import { updateShippingData } from "@/api/users/updateShippingData"
import { updateUser } from "@/api/users/updateUser"
import { CURRENT_ADMIN, SIGN_UP } from "@/constants/routes"
import { useNotificationContext } from "@/context/notificationContext"
import {
  CreateUser,
  EditShippingData,
  EditUser,
  ShippingData,
  User,
  UserContextType,
} from "@/types/User"
import { onRequestError } from "@/utils/onRequestError"
import { createUserSchema, updateUserSchema } from "@/utils/usersValidation"
import { convertDataToExpectedUserTypes, validate } from "@/utils/verifyTypes"
import {
  Dispatch,
  FormEvent,
  ReactNode,
  SetStateAction,
  SyntheticEvent,
  createContext,
  use,
  useEffect,
  useState,
} from "react"
import { useLocation } from "react-router-dom"

export const UserContext = createContext<UserContextType | null>(null)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [shippingData, setShippingData] = useState<Partial<ShippingData>>({})
  const { onSetNotification, setNotification } = useNotificationContext()
  const location = useLocation()
  const currentPath = location.pathname
  const isCreatedByAdmin = currentPath.includes(CURRENT_ADMIN)
  const isSignup = currentPath.includes(SIGN_UP)

  useEffect(() => {
    let active = true
    const verifyLogin = async () => {
      try {
        const authToken = await getDecodedAuthToken()
        const response =
          authToken?.status === 200
            ? await getAuthenticatedUserById(authToken.data.id)
            : undefined
        if (!active) return
        if (response?.status === 200) {
          setUser(response.data)
          setIsLoggedIn(true)
        } else {
          setUser(null)
          setIsLoggedIn(false)
        }
      } catch {
        if (active) {
          setUser(null)
          setIsLoggedIn(false)
        }
      } finally {
        if (active) setIsLoading(false)
      }
    }
    void verifyLogin()
    return () => {
      active = false
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (!isLoggedIn || user?.role?.name !== "admin") return
    let active = true
    void getUsers()
      .then((response) => {
        if (active && response?.status === 200) setUsers(response.data)
      })
      .catch((error: unknown) => {
        console.error(error)
      })
    return () => {
      active = false
    }
  }, [isLoggedIn, user?.role?.name])

  useEffect(() => {
    if (!user || isLoading) return
    let active = true
    void getUserShippingData(user.id)
      .then((response) => {
        if (active && response?.status === 200) setShippingData(response.data)
      })
      .catch((error: unknown) => {
        if (active)
          onRequestError(error, setNotification, "Error getting shipping data")
      })
    return () => {
      active = false
    }
  }, [user, isLoading, setNotification])

  const onDeleteUser = async (e: SyntheticEvent, id: number) => {
    e.preventDefault()
    try {
      const authToken = await getDecodedAuthToken()
      if (authToken && authToken.status === 200) {
        if (authToken && authToken.data.id === id) {
          const message = "You can not delete yourself"
          onSetNotification(message)
          return
        }
      }
      const response = await deleteUserById(id)
      if (response && response.status === 200) {
        setUsers(
          (prevState) =>
            prevState && prevState.filter((item) => item.id !== id),
        )
      }
    } catch (error) {
      onSetNotification("Error by deleting user")
      console.error("Error by deleting user:", error)
    }
  }

  const onCreateCustomer = async (
    e: FormEvent<HTMLFormElement>,
    data: CreateUser,
  ) => {
    e.preventDefault()

    try {
      const typedItem = convertDataToExpectedUserTypes(data)
      const validUser = await validate({
        item: typedItem,
        schema: createUserSchema,
      })
      const response = await createUser(validUser)
      if (response && response.status === 422) {
        const message =
          "This user is already existent. Please try with another email."
        setTimeout(() => onSetNotification(message), 4000)
      }
      if (response && response.status === 201) {
        const newUser = response.data.user
        setUsers((prevState) => prevState && [...prevState, newUser])
        return newUser
      }
    } catch (error) {
      onRequestError(error, onSetNotification)
    }
  }

  const onCreateAdmin = async (
    e: FormEvent<HTMLFormElement>,
    data: CreateUser,
  ) => {
    e.preventDefault()

    try {
      const typedItem = convertDataToExpectedUserTypes(data)
      const validUser = await validate({
        item: typedItem,
        schema: createUserSchema,
      })
      const response = await createAdmin(validUser)
      if (response && response.status === 422) {
        const message =
          "This user is already existent. Please try with another email."
        onSetNotification(message)
        return
      }
      if (response && response.status === 201) {
        const newUser = response.data.user
        setUsers((prevState) => prevState && [...prevState, newUser])
        if (isCreatedByAdmin) {
          onSetNotification("Admin created succesfully")
        }
        if (isSignup) {
          return newUser
        }
      }
    } catch (error) {
      console.error("Error by creating user:", error)
      onRequestError(error, onSetNotification)
    }
  }

  const validateUpdatedUser = (data: EditUser) => updateUserSchema.parse(data)

  const onUpdateUser = async ({
    id,
    initialData,
    updatedData,
    setUpdatedData,
  }: {
    id: number
    initialData: EditUser
    updatedData: EditUser
    setUpdatedData: Dispatch<SetStateAction<EditUser>>
  }) => {
    try {
      const validatedProperty = (await validateUpdatedUser(updatedData)) ?? {}
      const response = await updateUser(id, validatedProperty as User)
      if (response && response.status === 200) {
        const updatedUser = response.data.user
        setUsers((prevUsers) =>
          prevUsers?.map((user) =>
            user.id === updatedUser.id ? updatedUser : user,
          ),
        )
        setUser(updatedUser)
      }
    } catch (error) {
      console.error("Failed to update user:", error)
      setUpdatedData(initialData)

      onRequestError(error, onSetNotification)
    }
  }

  const onUpdateShippingData = async ({
    id,
    initialData,
    updatedData,
    setUpdatedData,
  }: {
    id: number
    initialData: EditShippingData
    updatedData: EditShippingData
    setUpdatedData: Dispatch<SetStateAction<EditShippingData>>
  }) => {
    try {
      const response = await updateShippingData(id, updatedData)

      if (response && response.status === 200) {
        const updatedShippingData = response.data
        setShippingData(updatedShippingData)
      }
    } catch (error) {
      console.error("Failed to update shipping data:", error)
      setUpdatedData(initialData)
      onRequestError(error, onSetNotification)
    }
  }

  return (
    <UserContext
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isLoading,
        users: users ?? [],
        user,
        setUser,
        onDeleteUser,
        onCreateCustomer,
        onUpdateUser,
        onCreateAdmin,
        onUpdateShippingData,
        shippingData,
      }}
    >
      {children}
    </UserContext>
  )
}

export const useUserContext = () => {
  const context = use(UserContext)
  if (!context) {
    throw new Error("useUserContext shoud be within a UserProvider")
  }
  return context
}
