export const getS3Url = async (s3Key: string): Promise<string> => {
  try {
    const encodedKey = encodeURIComponent(s3Key)
    const response = await fetch(`${import.meta.env.VITE_API_URL}/files/generate-url?s3Key=${encodedKey}`)

    if (!response.ok) {
      return ""
    }

    const data = await response.json()
    return data.url
  } catch (error: unknown) { // Added explicit type for error
    console.error("Error getting S3 URL:", error)
    return ""
  }
}