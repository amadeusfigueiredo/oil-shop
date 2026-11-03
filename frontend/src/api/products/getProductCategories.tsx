import axios, { AxiosResponse } from "axios"
import { PRODUCT_CATEGORIES } from "@/constants/api"
import type { Category } from "@/types/Product"

export async function getProductCategories(): Promise<
  AxiosResponse<Category[]>
> {
  const url = `${import.meta.env.VITE_APP_API_URL}${PRODUCT_CATEGORIES}`
  try {
    const response = await axios.get<Category[]>(url)
    if (response.status !== 200) {
      throw new Error(
        `getProductCategories: Unexpected status ${response.status}`,
      )
    }
    return response
  } catch (err) {
    console.error("Error fetching categories", err)
    throw err
  }
}
