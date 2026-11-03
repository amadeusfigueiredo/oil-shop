import axios from "axios"
import { uploadFile } from "./uploadFile"

vi.mock("axios")

test("upload filenames are encoded and the signed URL is used", async () => {
  const file = new File(["image"], "oil & care.png", { type: "image/png" })
  vi.mocked(axios.get).mockResolvedValue({
    data: {
      uploadURL: "https://signed.example.test/upload",
      fileName: "stored.png",
    },
  })
  vi.mocked(axios.put).mockResolvedValue({ status: 200 })
  await expect(uploadFile(file)).resolves.toBe(
    "https://oylo-images.s3.us-east-2.amazonaws.com/stored.png",
  )
  expect(axios.get).toHaveBeenCalledWith(
    expect.stringContaining("oil%20%26%20care.png"),
    { withCredentials: true },
  )
  expect(axios.put).toHaveBeenCalledWith(
    "https://signed.example.test/upload",
    file,
    { headers: { "Content-Type": "image/png" } },
  )
})

test("failed uploads reject so the form cannot silently submit a missing image", async () => {
  vi.mocked(axios.get).mockRejectedValue(new Error("Upload unavailable"))
  await expect(uploadFile(new File(["image"], "oil.png"))).rejects.toThrow(
    "Upload unavailable",
  )
})
