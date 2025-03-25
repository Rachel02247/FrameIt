export type User = {
    id?: string | undefined,
    name: string,
    email: string,
    password: string,
    roleName: 'Viewer' | 'Editor' | 'Admin';
}

export type Folder = {
    id: string ,
    name: string,
    parentFolderId: string,
    ownerId: string,
    isDeleted: boolean;
    

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