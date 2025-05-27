export interface User {
    id: number;
    userName: string;
    email: string;
    roleName: string;
    createdAt?: Date;
    updatedAt?: Date;
    password?: string;
}
