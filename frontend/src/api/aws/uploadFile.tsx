import axios from "axios"

interface UploadUrlResponse {
  uploadURL: string
  fileName: string
}

export const uploadFile = async (
  file: File | null | undefined,
): Promise<string> => {
  if (!file) return ""
  const { data } = await axios.get<UploadUrlResponse>(
    `${import.meta.env.VITE_APP_API_URL}/aws/generate-upload-url?fileName=${encodeURIComponent(file.name)}`,
    { withCredentials: true },
  )
  await axios.put(data.uploadURL, file, {
    headers: { "Content-Type": file.type },
  })
  return `https://oylo-images.s3.us-east-2.amazonaws.com/${data.fileName}`
}
