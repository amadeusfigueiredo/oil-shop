import axios, { AxiosResponse } from "axios"
import { PRODUCTS } from "@/constants/api"
import type { Product } from "@/types/Product"

export async function getProductById(
  id: number,
): Promise<AxiosResponse<Product | undefined>> {
  const url = `${import.meta.env.VITE_APP_API_URL}${PRODUCTS}/${id}`

  try {
    const response = await axios.get<Product>(url, {
      validateStatus: () => true,
    })
    if (response.status === 200 || response.status === 404) {
      return response as AxiosResponse<Product | undefined>
    }
    throw new Error(`getProductById: Unexpected status ${response.status}`)
  } catch (error) {
    console.error(`Error fetching product ${id}`, error)
    throw error
  }
}
