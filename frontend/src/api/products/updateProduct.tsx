import axios, { AxiosResponse } from "axios"
import { PRODUCTS } from "@/constants/api"
import type { EditProduct, Product } from "@/types/Product"

export async function updateProduct(
  productId: number,
  product: EditProduct,
): Promise<AxiosResponse<{ product: Product }>> {
  const url = `${import.meta.env.VITE_APP_API_URL}${PRODUCTS}/${productId}`
  try {
    const response = await axios.put<{ product: Product }>(url, product, {
      withCredentials: true,
    })
    if (response.status !== 200) {
      throw new Error(`updateProduct: Unexpected status ${response.status}`)
    }
    return response
  } catch (error) {
    console.error(`Error updating product ${productId}`, error)
    throw error
  }
}
