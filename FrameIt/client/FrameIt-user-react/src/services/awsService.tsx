const API_URL_BASE = `${import.meta.env.VITE_API_URL}/files`;

export  const getImageUrl = async (s3Key: string): Promise<string> => {
    try {
      const encodedKey = encodeURIComponent(s3Key)
      
      const response = await fetch(`${API_URL_BASE}/generate-url?s3Key=${encodedKey}`)

      const url = `https://001687204140frameit.s3.us-east-1.amazonaws.com/${encodedKey}`

      if (!response.ok) {
        throw new Error("Failed to fetch presigned URL")
      }

      //const data = await response.json()
      return url
    }
     catch (error) {
      console.error("Error getting image URL:", error)
      return ""
    }
  };

