export type User = {
    id?: string | undefined,
    name: string ,
    email: string ,
    password: string,
    role: 'Viewer' | 'Editor' | 'Admin';
    }