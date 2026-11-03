import axios, { AxiosResponse } from "axios"
import { PRODUCT_BY_NAME } from "@/constants/api"
import type { Product } from "@/types/Product"

export async function getProductByName(
  name: string,
): Promise<AxiosResponse<Product | undefined>> {
  const url = `${import.meta.env.VITE_APP_API_URL}${PRODUCT_BY_NAME}/${encodeURIComponent(
    name,
  )}`

  try {
    const response = await axios.get<Product>(url, {
      validateStatus: () => true,
    })
    if (response.status === 200 || response.status === 404) {
      return response as AxiosResponse<Product | undefined>
    }
    throw new Error(`getProductByName: Unexpected status ${response.status}`)
  } catch (error) {
    console.error(`Error fetching product by name "${name}"`, error)
    throw error
  }
}
