import axios, { AxiosResponse } from "axios"
import { PRODUCTS } from "@/constants/api"

export async function deleteProductById(
  id: number,
): Promise<AxiosResponse<void>> {
  const url = `${import.meta.env.VITE_APP_API_URL}${PRODUCTS}/${id}`
  try {
    const response = await axios.delete<void>(url, {
      withCredentials: true,
    })
    if (response.status !== 200) {
      throw new Error(`deleteProductById: Unexpected status ${response.status}`)
    }
    return response
  } catch (err) {
    console.error(`Error deleting product ${id}`, err)
    throw err
  }
}
