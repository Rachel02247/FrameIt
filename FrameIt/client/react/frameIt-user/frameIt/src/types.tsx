export type User = {
    id?: string | undefined,
    userName: string,
    email: string,
    password: string,
    roleName: 'Viewer' | 'Editor' | 'Admin';
}

export type Folder = {
    id: string ,
    name: string,

}

export type File = {
    id: string;
    name: string; // שם הקובץ כפי שמגיע מהשרת
    fileType: string; // סוג הקובץ
    size: number; // גודל הקובץ
    s3Key: string; // מפתח ה-S3
}