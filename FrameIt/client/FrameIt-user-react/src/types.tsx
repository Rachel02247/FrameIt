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
    id: string;
    fileName: string; // שם הקובץ כפי שמגיע מהשרת
    fileType: string; // סוג הקובץ
    size: number; // גודל הקובץ
    s3Key: string; // מפתח ה-S3
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