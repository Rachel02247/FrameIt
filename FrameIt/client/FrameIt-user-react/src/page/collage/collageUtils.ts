import { RefObject } from 'react';

export type CollageRatio = '1:1' | '3:4' | '16:9' | 'portrait' | 'landscape';
export type CollageTemplate = 'grid2x2' | 'grid3x3' | 'splitHorizontal' | 'splitVertical' | 'threeTopOne' | 'oneTopThree' | 'custom';

export interface CollageItem {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  scale?: number;
}

export interface CollageSettings {
  ratio: CollageRatio;
  template: CollageTemplate;
  backgroundColor: string;
  spacing: number;
}

export const getRatioSize = (ratio: CollageRatio, maxWidth: number, maxHeight: number): { width: number; height: number } => {
  let width, height;
  
  switch (ratio) {
    case '1:1':
      width = Math.min(maxWidth, maxHeight);
      height = width;
      break;
    case '3:4':
      if (maxWidth / maxHeight > 3/4) {
        height = maxHeight;
        width = height * (3/4);
      } else {
        width = maxWidth;
        height = width * (4/3);
      }
      break;
    case '16:9':
      if (maxWidth / maxHeight > 16/9) {
        height = maxHeight;
        width = height * (16/9);
      } else {
        width = maxWidth;
        height = width * (9/16);
      }
      break;
    case 'portrait':
      if (maxWidth / maxHeight > 2/3) {
        height = maxHeight;
        width = height * (2/3);
      } else {
        width = maxWidth;
        height = width * (3/2);
      }
      break;
    case 'landscape':
      if (maxWidth / maxHeight > 3/2) {
        height = maxHeight;
        width = height * (3/2);
      } else {
        width = maxWidth;
        height = width * (2/3);
      }
      break;
    default:
      width = maxWidth;
      height = maxHeight;
  }
  
  return { width, height };
};

export const generateTemplateLayout = (template: CollageTemplate, canvasWidth: number, canvasHeight: number, spacing: number): Array<Omit<CollageItem, 'id' | 'src'>> => {
  const layouts: Record<CollageTemplate, Array<Omit<CollageItem, 'id' | 'src'>>> = {
    grid2x2: [
      { x: 0, y: 0, width: canvasWidth / 2 - spacing / 2, height: canvasHeight / 2 - spacing / 2, rotation: 0, scaleX: 1, scaleY: 1 },
      { x: canvasWidth / 2 + spacing / 2, y: 0, width: canvasWidth / 2 - spacing / 2, height: canvasHeight / 2 - spacing / 2, rotation: 0, scaleX: 1, scaleY: 1 },
      { x: 0, y: canvasHeight / 2 + spacing / 2, width: canvasWidth / 2 - spacing / 2, height: canvasHeight / 2 - spacing / 2, rotation: 0, scaleX: 1, scaleY: 1 },
      { x: canvasWidth / 2 + spacing / 2, y: canvasHeight / 2 + spacing / 2, width: canvasWidth / 2 - spacing / 2, height: canvasHeight / 2 - spacing / 2, rotation: 0, scaleX: 1, scaleY: 1 }
    ],
    grid3x3: [
      { x: 0, y: 0, width: canvasWidth / 3 - spacing * 2/3, height: canvasHeight / 3 - spacing * 2/3, rotation: 0, scaleX: 1, scaleY: 1 },
      { x: canvasWidth / 3 + spacing / 3, y: 0, width: canvasWidth / 3 - spacing * 2/3, height: canvasHeight / 3 - spacing * 2/3, rotation: 0, scaleX: 1, scaleY: 1 },
      { x: 2 * canvasWidth / 3 + spacing * 2/3, y: 0, width: canvasWidth / 3 - spacing * 2/3, height: canvasHeight / 3 - spacing * 2/3, rotation: 0, scaleX: 1, scaleY: 1 },
      { x: 0, y: canvasHeight / 3 + spacing / 3, width: canvasWidth / 3 - spacing * 2/3, height: canvasHeight / 3 - spacing * 2/3, rotation: 0, scaleX: 1, scaleY: 1 },
      { x: canvasWidth / 3 + spacing / 3, y: canvasHeight / 3 + spacing / 3, width: canvasWidth / 3 - spacing * 2/3, height: canvasHeight / 3 - spacing * 2/3, rotation: 0, scaleX: 1, scaleY: 1 },
      { x: 2 * canvasWidth / 3 + spacing * 2/3, y: canvasHeight / 3 + spacing / 3, width: canvasWidth / 3 - spacing * 2/3, height: canvasHeight / 3 - spacing * 2/3, rotation: 0, scaleX: 1, scaleY: 1 },
      { x: 0, y: 2 * canvasHeight / 3 + spacing * 2/3, width: canvasWidth / 3 - spacing * 2/3, height: canvasHeight / 3 - spacing * 2/3, rotation: 0, scaleX: 1, scaleY: 1 },
      { x: canvasWidth / 3 + spacing / 3, y: 2 * canvasHeight / 3 + spacing * 2/3, width: canvasWidth / 3 - spacing * 2/3, height: canvasHeight / 3 - spacing * 2/3, rotation: 0, scaleX: 1, scaleY: 1 },
      { x: 2 * canvasWidth / 3 + spacing * 2/3, y: 2 * canvasHeight / 3 + spacing * 2/3, width: canvasWidth / 3 - spacing * 2/3, height: canvasHeight / 3 - spacing * 2/3, rotation: 0, scaleX: 1, scaleY: 1 }
    ],
    splitHorizontal: [
      { x: 0, y: 0, width: canvasWidth, height: canvasHeight / 2 - spacing / 2, rotation: 0, scaleX: 1, scaleY: 1 },
      { x: 0, y: canvasHeight / 2 + spacing / 2, width: canvasWidth, height: canvasHeight / 2 - spacing / 2, rotation: 0, scaleX: 1, scaleY: 1 }
    ],
    splitVertical: [
      { x: 0, y: 0, width: canvasWidth / 2 - spacing / 2, height: canvasHeight, rotation: 0, scaleX: 1, scaleY: 1 },
      { x: canvasWidth / 2 + spacing / 2, y: 0, width: canvasWidth / 2 - spacing / 2, height: canvasHeight, rotation: 0, scaleX: 1, scaleY: 1 }
    ],
    threeTopOne: [
      { x: 0, y: 0, width: canvasWidth / 3 - spacing * 2/3, height: canvasHeight * 2/3 - spacing / 2, rotation: 0, scaleX: 1, scaleY: 1 },
      { x: canvasWidth / 3 + spacing / 3, y: 0, width: canvasWidth / 3 - spacing * 2/3, height: canvasHeight * 2/3 - spacing / 2, rotation: 0, scaleX: 1, scaleY: 1 },
      { x: 2 * canvasWidth / 3 + spacing * 2/3, y: 0, width: canvasWidth / 3 - spacing * 2/3, height: canvasHeight * 2/3 - spacing / 2, rotation: 0, scaleX: 1, scaleY: 1 },
      { x: 0, y: canvasHeight * 2/3 + spacing / 2, width: canvasWidth, height: canvasHeight / 3 - spacing / 2, rotation: 0, scaleX: 1, scaleY: 1 }
    ],
    oneTopThree: [
      { x: 0, y: 0, width: canvasWidth, height: canvasHeight / 3 - spacing / 2, rotation: 0, scaleX: 1, scaleY: 1 },
      { x: 0, y: canvasHeight / 3 + spacing / 2, width: canvasWidth / 3 - spacing * 2/3, height: canvasHeight * 2/3 - spacing / 2, rotation: 0, scaleX: 1, scaleY: 1 },
      { x: canvasWidth / 3 + spacing / 3, y: canvasHeight / 3 + spacing / 2, width: canvasWidth / 3 - spacing * 2/3, height: canvasHeight * 2/3 - spacing / 2, rotation: 0, scaleX: 1, scaleY: 1 },
      { x: 2 * canvasWidth / 3 + spacing * 2/3, y: canvasHeight / 3 + spacing / 2, width: canvasWidth / 3 - spacing * 2/3, height: canvasHeight * 2/3 - spacing / 2, rotation: 0, scaleX: 1, scaleY: 1 }
    ],
    custom: [] // For custom layouts, we'll handle this differently
  };
  
  return layouts[template] || [];
};

export const downloadCollage = (canvasRef: RefObject<HTMLDivElement>, filename: string = 'collage.png') => {
  if (!canvasRef.current) return;
  
  import('html-to-image').then(({ toPng }) => {
    toPng(canvasRef.current!, { quality: 0.95 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error('Error generating image:', error);
      });
  });
};

export const calculateImageFit = (
  imageWidth: number, 
  imageHeight: number, 
  containerWidth: number, 
  containerHeight: number
): { width: number; height: number } => {
  const imageRatio = imageWidth / imageHeight;
  const containerRatio = containerWidth / containerHeight;
  
  if (imageRatio > containerRatio) {
    // Image is wider than container (relative to height)
    return {
      width: containerWidth,
      height: containerWidth / imageRatio
    };
  } else {
    // Image is taller than container (relative to width)
    return {
      width: containerHeight * imageRatio,
      height: containerHeight
    };
  }
};

export const getUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};