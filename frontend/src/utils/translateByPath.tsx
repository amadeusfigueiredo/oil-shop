export const translateByPath = (translation: unknown, path: string): string => {
  let value: unknown = translation
  for (const key of path.split(".")) {
    if (
      typeof value !== "object" ||
      value === null ||
      !Object.hasOwn(value, key)
    )
      return path
    value = Reflect.get(value, key) as unknown
  }
  return typeof value === "string" ? value : path
}
