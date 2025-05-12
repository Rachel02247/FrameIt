export type User = {
  id?: string | undefined,
  Name: string,
  Email: string,
  Password: string,
  CreatedAt: string,
  UpdatedAt: string,
  RoleName: 'Viewer' | 'Editor' | 'Admin';
}

export type Folder = {
  id: string ,
  name: string,
  parentFolderId: string,
  ownerId: string,
  isDeleted: boolean;
  

}

export type Tag ={
  id: number,
  name: string,
  userId: number
}

export type MyFile = {
  file: File | null;
  id: string;
  fileName: string; 
  fileType: string; 
  size: number; 
  s3Key: string; 
  isDeleted: boolean, 
  folderId: string,
  ownerId: string
}

export interface FileItemProps {
  file: MyFile;
  onDelete: () => void;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
  showCheckbox?: boolean;
  onOpenPreview: (fileId: string) => void;
}

export interface CollageImage {
  id: string
  file: File
  url: string
  width: number
  height: number
  x: number
  y: number
  rotation: number
  flipped: boolean
  scale: number
}

export interface Template {
  id: string
  name: string
  layout: {
    x: number
    y: number
    width: number
    height: number
  }[]
  thumbnail: string
}

export interface AspectRatio {
  id: string
  name: string
  value: number
}

export interface AnalysisResult {
  objects: string[]
  colors: string[]
  scene: string
  confidence: number
}