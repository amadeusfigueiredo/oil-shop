import { uploadFile } from "@/api/aws/uploadFile"
import { ItemFormInput } from "@/components/ui/ItemFormInput"
import { DEFAULT_PRODUCT_IMAGE } from "@/constants/media"
import { STYLES } from "@/constants/styles"
import { useProductContext } from "@/context/useProductContext"
import { useTranslation } from "@/hooks/useTranslation"
import { EditProduct, Product } from "@/types/Product"
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { ActionButton } from "../ActionButton"
import styles from "./listProductForm.module.scss"

interface Props {
  item: Product
  setShowForm?: Dispatch<SetStateAction<boolean>>
}

function ProductForm({ item, setShowForm }: Props) {
  const { onUpdateProduct, onDeleteProduct } = useProductContext()
  const { components } = useTranslation()

  const initialData = useMemo<EditProduct>(
    () => ({
      name: item.name,
      description: item.description,
      size: item.size,
      price: item.price,
      details: item.details,
      image: item.image,
      brand: item.brand,
    }),
    [item],
  )

  const [updatedData, setUpdatedData] = useState<EditProduct>(initialData)

  const [file, setFile] = useState<File | null>(null)
  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  )
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const submit = useCallback(async () => {
    const dataToUpdate: EditProduct = {
      ...updatedData,
      size: Number(updatedData.size),
      price: Number(updatedData.price),
    }
    if (file) {
      const imageUrl = await uploadFile(file)
      if (imageUrl) dataToUpdate.image = imageUrl
    }

    await onUpdateProduct({
      id: item.id,
      initialData,
      updatedData: dataToUpdate,
      setUpdatedData,
    })
    setShowForm?.(false)
  }, [file, updatedData, initialData, item.id, onUpdateProduct, setShowForm])

  const onInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    if (name === "image" && files?.length) {
      setFile(files[0] ?? null)
    } else {
      setUpdatedData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }, [])

  return (
    <article className={styles.wrapper} aria-label='Edit Product'>
      <form className={styles.form}>
        {Object.keys(initialData).map((key) => (
          <ItemFormInput
            name={key}
            updatedPropertyData={updatedData}
            onChange={onInputChange}
            type={key === "image" ? "file" : "text"}
            key={key}
          />
        ))}
      </form>

      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <img
            className={styles.image}
            src={previewUrl || item.image || DEFAULT_PRODUCT_IMAGE}
            alt='Product Preview'
          />
        </div>

        <div className={styles.buttonsContainer}>
          <ActionButton
            action={submit}
            className={STYLES.BUTTONS.SAVE_ITEM}
            text={components.listUserForm.save}
          />
          <ActionButton
            action={(e) => onDeleteProduct(e, item.id)}
            className={STYLES.BUTTONS.DELETE_ITEM}
            text={components.listUserForm.delete}
          />
        </div>
      </div>
    </article>
  )
}

export function ListProductForm(props: Props) {
  return <ProductForm key={JSON.stringify(props.item)} {...props} />
}
