import { JwtPayload } from 'jsonwebtoken'
import { User } from '../../service/postgreSQL'

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

export interface RefreshTokenAttributes {
    id: string
    userId: string
    refreshToken: string
    expiresAt?: Date
    createdAt?: Date
}

export interface IAuthenticatedRequest extends Request {
    authenticatedUser: User
}

export interface IDecryptedJwt extends JwtPayload {
    userId: string
    role: string
    name: string
}

export interface PasswordResetAttributes {
    id: string
    userId: string
    otp: string
    isVerified: boolean
    isUsed: boolean
    expiresAt: Date
    createdAt?: Date
    deletedAt?: Date
}
