import { generateText, experimental_generateImage } from "ai";
import { openai } from "@ai-sdk/openai";

type ImageAnalysisResult = {
  objects: string[];
  colors: string[];
  scene: string;
  confidence: number;
};

type SearchResult = {
  imageUrl: string;
  relevanceScore: number;
};

export async function analyzeImage(imageUrl: string): Promise<ImageAnalysisResult | null> {
  try {
    const { text } = await generateText({
      model: openai.chat("gpt-4o"),
      prompt: `Analyze this image in detail: ${imageUrl}

      Identify:
      1. Main objects and people
      2. Dominant colors
      3. Scene type or setting
      4. Mood or atmosphere

      Format the response as JSON with these keys: 
      {
        "objects": ["object1", "object2", ...], 
        "colors": ["color1", "color2", ...], 
        "scene": "description", 
        "confidence": number between 0-100
      }`,
      system: "You are an expert image analyzer. Provide detailed, accurate analysis of images in JSON format only.",
    });

    try {
      return JSON.parse(text) as ImageAnalysisResult;
    } catch (e) {
      console.error("Failed to parse analysis result:", e);
      return {
        objects: ["Unknown"],
        colors: ["Unknown"],
        scene: "Could not determine",
        confidence: 0,
      };
    }
  } catch (error) {
    console.error("Error analyzing image:", error);
    return null;
  }
}

export async function transformImageToArt(imageUrl: string, style: string) {
  const styleDescriptions: Record<string, string> = {
    picasso: "in the style of Pablo Picasso, with cubist elements, geometric shapes, and bold lines",
    vangogh: "in the style of Vincent van Gogh, with swirling brushstrokes, vibrant colors, and expressive technique",
    watercolor: "as a delicate watercolor painting with soft edges, transparent washes, and gentle color blending",
    "pop-art": "as pop art in the style of Roy Lichtenstein or Andy Warhol, with bold colors, comic-like outlines, and dot patterns",
    realistic: "in a photorealistic style with fine details, accurate lighting, and true-to-life representation",
    anime: "in Japanese anime style with characteristic large eyes, simplified facial features, and stylized expressions",
  };

  const styleDescription =
    styleDescriptions[style as keyof typeof styleDescriptions] || styleDescriptions.picasso;

  try {
    const result = await experimental_generateImage({
      model: openai.image("dall-e-3"),
      prompt: `Transform this image ${styleDescription}. Maintain the main subject and composition of the original image: ${imageUrl}`,
    });

    const imageList = result.images as unknown as { url: string }[];

    return Array.isArray(imageList) && imageList[0]?.url ? imageList[0].url : null;
  } catch (error) {
    console.error("Error transforming image:", error);
    return null;
  }
}

export async function searchImagesByDescription(
  description: string,
  imageUrls: string[]
): Promise<SearchResult[]> {
  try {
    const { text } = await generateText({
      model: openai.chat("gpt-4o"),
      prompt: `I have a collection of images and want to find ones that match this description: "${description}". 
      For each image URL in this list, rate its relevance to the description on a scale of 0-100:
      ${imageUrls.join("\n")}

      Return only a JSON array of objects with imageUrl and relevanceScore keys.`,
      system: "You are an expert image search system. Help find the most relevant images based on text descriptions.",
    });

    try {
      const results = JSON.parse(text) as SearchResult[];
      return results.filter((item) => item.relevanceScore > 50);
    } catch (e) {
      console.error("Failed to parse search results:", e);
      return [];
    }
  } catch (error) {
    console.error("Error searching images:", error);
    return [];
  }
}
