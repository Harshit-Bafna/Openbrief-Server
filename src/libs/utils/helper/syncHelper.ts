import argon2 from 'argon2'
import { responseMessage } from '../constants'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { randomInt } from 'crypto'
import { v4 } from 'uuid'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { ApiError } from './ApiError'

dayjs.extend(utc)
dayjs.extend(timezone)

export const generateStrongPassword = (): string => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lower = 'abcdefghijklmnopqrstuvwxyz'
    const digits = '0123456789'
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    const all = upper + lower + digits + special

    const required = [
        upper[Math.floor(Math.random() * upper.length)],
        lower[Math.floor(Math.random() * lower.length)],
        digits[Math.floor(Math.random() * digits.length)],
        special[Math.floor(Math.random() * special.length)]
    ]

    for (let i = required.length; i < 10; i++) {
        required.push(all[Math.floor(Math.random() * all.length)])
    }

    for (let i = required.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[required[i], required[j]] = [required[j], required[i]]
    }

    return required.join('')
}

export const GenerateJwtToken = (payload: object, secret: string, expiry: number): string => {
    return jwt.sign(payload, secret, {
        expiresIn: expiry
    })
}

export const VerifyToken = (token: string, secret: string): string | JwtPayload => {
    return jwt.verify(token, secret)
}

export const GetDomain = (url: string) => {
    try {
        const parsedUrl = new URL(url)
        return parsedUrl.hostname
    } catch (error) {
        throw error
    }
}

export const getMainDomainAfterSubdomain = (url: string): string => {
    try {
        const parsedUrl = new URL(url)
        const hostnameParts = parsedUrl.hostname.split('.')
        if (hostnameParts.length < 2) {
            throw new Error('Invalid domain format')
        }
        return hostnameParts.slice(-2).join('.')
    } catch (error) {
        throw error
    }
}

export const GenerateRandomId = () => v4()

export const GenerateOTP = (length: number): string => {
    const min = Math.pow(10, length - 1)
    const max = Math.pow(10, length) - 1

    return randomInt(min, max).toString()
}

export const EncryptPassword = async (password: string): Promise<string> => {
    try {
        const hashedPassword = await argon2.hash(password)
        return hashedPassword
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : responseMessage.PASSWORD_ENCRYPTION_ERROR
        throw new ApiError(errorMessage, 500)
    }
}

export const VerifyPassword = async (password: string, encryptedPassword: string): Promise<boolean> => {
    try {
        const isPasswordCorrect = await argon2.verify(encryptedPassword, password)
        return isPasswordCorrect
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : responseMessage.PASSWORD_ENCRYPTION_ERROR
        throw new ApiError(errorMessage, 500)
    }
}

export const getFormattedISTDateTime = (): { date: string; time: string } => {
    const now = dayjs().tz('Asia/Kolkata')

    const date = now.format('MMMM D, YYYY')
    const time = now.format('hh:mm A').replace('AM', 'A.M.').replace('PM', 'P.M.') + ' IST'

    return { date, time }
}

export const getShiftedISTDate = (num: number, type: 'd' | 'm' | 'y'): Date => {
    const now = dayjs().tz('Asia/Kolkata')

    let shiftedDate: dayjs.Dayjs

    switch (type) {
        case 'd':
            shiftedDate = now.add(num, 'day')
            break
        case 'm':
            shiftedDate = now.add(num, 'month')
            break
        case 'y':
            shiftedDate = now.add(num, 'year')
            break
        default:
            throw new Error('Invalid type. Use "d" for days, "m" for months, or "y" for years.')
    }

    return shiftedDate.toDate()
}
