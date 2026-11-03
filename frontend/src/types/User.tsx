import { Dispatch, FormEvent, SetStateAction, SyntheticEvent } from "react"

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  image: string
  roleId: number
  role?: { id?: number; name: string }
}

export interface CreateUser {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface EditUser {
  firstName: string
  lastName: string
  email: string
}

export interface EditShippingData {
  street: string
  number: string
  details: string
  postalCode: string
  city: string
  state: string
  country: string
}

export interface UserHeader {
  firstName: string | undefined
  lastName: string | undefined
  email: string | undefined
  image: string | undefined
}

export interface Role {
  id: number
  name: string
}

export interface ShippingData {
  id: number
  userId: number
  street: string
  number: string
  details: string
  postalCode: string
  city: string
  state: string
  country: string
}

export interface UserContextType {
  isLoggedIn: boolean
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>
  isLoading: boolean
  users: User[]
  user: User | null
  setUser: Dispatch<SetStateAction<User | null>>
  onUpdateUser: (data: {
    id: number
    initialData: EditUser
    updatedData: EditUser
    setUpdatedData: Dispatch<SetStateAction<EditUser>>
  }) => Promise<void>
  onDeleteUser: (e: SyntheticEvent, id: number) => Promise<void>
  onCreateCustomer: (
    e: FormEvent<HTMLFormElement>,
    data: CreateUser,
  ) => Promise<User | undefined>
  onCreateAdmin: (
    e: FormEvent<HTMLFormElement>,
    data: CreateUser,
  ) => Promise<User | undefined>
  onUpdateShippingData: (data: {
    id: number
    initialData: EditShippingData
    updatedData: EditShippingData
    setUpdatedData: Dispatch<SetStateAction<EditShippingData>>
  }) => Promise<void>
  shippingData: Partial<ShippingData>
}
