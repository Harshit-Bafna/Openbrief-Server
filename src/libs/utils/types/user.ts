export interface UserAttributes {
    id: string
    name: string
    email: string
    password: string
    role: string
    isActive?: boolean
    isVerified: boolean
    lastLoginAt?: Date
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}
