import { ChangeEvent, Dispatch, SetStateAction } from "react"

export const listenInput = <T extends object>(
  e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  _updatedDataObj: T,
  setUpdatedDataObj: Dispatch<SetStateAction<T>>,
) => {
  const { name, value } = e.target
  setUpdatedDataObj((current) => ({ ...current, [name]: value }))
}
