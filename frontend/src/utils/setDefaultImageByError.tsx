import type { SyntheticEvent } from "react"

export const setDefaultImageByError = (
  event: SyntheticEvent<HTMLImageElement>,
  image: string,
) => {
  if (event.currentTarget.getAttribute("src") !== image)
    event.currentTarget.src = image
}
