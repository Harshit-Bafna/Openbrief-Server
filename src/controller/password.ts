import dayjs from 'dayjs'
import { PasswordReset, User } from '../libs/service/postgreSQL'
import { responseMessage } from '../libs/utils/constants'
import { ForgotPasswordDTO, UserChangePasswordDTO, UserResetPasswordDTO, UserVerifyOTPDTO } from '../libs/utils/dto'
import { ApiError, EncryptPassword, GenerateOTP, getFormattedISTDateTime, VerifyPassword } from '../libs/utils/helper'
import { ApiResponse } from '../libs/utils/types'
import { sendEmailToSingleUser } from './emailHandler'

export const ChangePassword = async ({ newPassword, oldPassword, confirmPassword, userId }: UserChangePasswordDTO): Promise<ApiResponse> => {
    try {
        if (newPassword !== confirmPassword) {
            throw new ApiError(responseMessage.CONFIRM_PASS_NEW_PASS_NOT_MATCH, 400)
        }

        if (oldPassword === newPassword) {
            throw new ApiError(responseMessage.OLD_PASS_NEW_PASS_MATCH, 400)
        }

        const user = await User.findByPk(userId)
        if (!user) {
            throw new ApiError(responseMessage.NOT_FOUND('User'), 404)
        }

        const isPasswordMatching = await VerifyPassword(oldPassword, user.password)
        if (!isPasswordMatching) {
            throw new ApiError(responseMessage.OLD_PASS_NOT_MATCH, 400)
        }

        const encryptedPassword = await EncryptPassword(newPassword)
        user.password = encryptedPassword
        await user.save()

        const { date, time } = getFormattedISTDateTime()

        const { success, message } = await sendEmailToSingleUser({
            subject: 'Password changed successfully',
            body: 'password changed successfully on ' + date + ' at ' + time,
            to: user.email
        })
        if (!success) {
            throw new ApiError(message, 500)
        }

        return {
            success: true,
            statusCode: 200,
            message: responseMessage.UPDATE_SUCCESS('Passsword')
        }
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : responseMessage.INTERNAL_SERVER_ERROR
        const statusCode = error instanceof ApiError ? error.status : 500
        return {
            success: false,
            statusCode: statusCode,
            message: errMessage,
            error: error as Error
        }
    }
}

export const ForgotPassword = async ({ emailAddress }: ForgotPasswordDTO): Promise<ApiResponse> => {
    try {
        const user = await User.findOne({
            where: {
                email: emailAddress
            }
        })
        if (!user) {
            throw new ApiError(responseMessage.NOT_FOUND('User'), 404)
        }

        const otp = GenerateOTP(6)
        const expiry = dayjs()
            .add(15 * 60, 'second')
            .toDate()

        const existingPasswordReset = await PasswordReset.findAll({
            where: {
                userId: user.id,
                isVerified: false
            },
            order: [['createdAt', 'DESC']]
        })
        if (existingPasswordReset) {
            for (const reset of existingPasswordReset) {
                reset.isVerified = true
                await reset.save()
            }
        }

        await PasswordReset.create({
            otp: otp,
            expiresAt: expiry,
            userId: user.id,
            isVerified: false,
            isUsed: false
        })

        const { success, message } = await sendEmailToSingleUser({
            subject: 'Password changed request',
            body: `Your OTP for password reset is ${otp}. It is valid for 15 minutes.`,
            to: user.email
        })
        if (!success) {
            throw new ApiError(message, 500)
        }

        return {
            success: true,
            statusCode: 200,
            message: responseMessage.OTP_SENT
        }
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : responseMessage.INTERNAL_SERVER_ERROR
        const statusCode = error instanceof ApiError ? error.status : 500
        return {
            success: false,
            statusCode: statusCode,
            message: errMessage,
            error: error as Error
        }
    }
}

export const verifyOTP = async ({ otp, email }: UserVerifyOTPDTO): Promise<ApiResponse> => {
    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        })
        if (!user) {
            throw new ApiError(responseMessage.NOT_FOUND('User'), 404)
        }

        const passwordReset = await PasswordReset.findOne({
            where: {
                userId: user.id,
                otp: otp
            },
            order: [['createdAt', 'DESC']]
        })
        if (!passwordReset) {
            throw new ApiError(responseMessage.INVALID_CREDENTIALS('OTP'), 400)
        }
        if (passwordReset.isVerified) {
            throw new ApiError(responseMessage.OTP_ALREADY_VERIFIED, 400)
        }

        if (dayjs().isAfter(dayjs(passwordReset.expiresAt))) {
            throw new ApiError(responseMessage.OTP_EXPIRED, 400)
        }

        return {
            success: true,
            statusCode: 200,
            message: responseMessage.OTP_VERIFIED
        }
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : responseMessage.INTERNAL_SERVER_ERROR
        const statusCode = error instanceof ApiError ? error.status : 500
        return {
            success: false,
            statusCode: statusCode,
            message: errMessage,
            error: error as Error
        }
    }
}

export const ResetPassword = async ({ newPassword, confirmPassword, email }: UserResetPasswordDTO): Promise<ApiResponse> => {
    try {
        if (newPassword !== confirmPassword) {
            throw new ApiError(responseMessage.CONFIRM_PASS_NEW_PASS_NOT_MATCH, 400)
        }

        const user = await User.findOne({
            where: {
                email: email
            }
        })
        if (!user) {
            throw new ApiError(responseMessage.NOT_FOUND('User'), 404)
        }

        const passwordReset = await PasswordReset.findOne({
            where: {
                userId: user.id,
                isVerified: true,
                isUsed: false
            }
        })
        if (!passwordReset) {
            throw new ApiError(responseMessage.INVALID_CREDENTIALS('User'), 400)
        }

        if (dayjs().isAfter(dayjs(passwordReset.expiresAt))) {
            throw new ApiError(responseMessage.SOMETHING_WENT_WRONG, 400)
        }

        const isPasswordMatching = await VerifyPassword(newPassword, user.password)
        if (isPasswordMatching) {
            throw new ApiError(responseMessage.OLD_PASS_NEW_PASS_MATCH, 400)
        }

        const encryptedPassword = await EncryptPassword(newPassword)
        user.password = encryptedPassword
        await user.save()

        const { date, time } = getFormattedISTDateTime()

        const { success, message } = await sendEmailToSingleUser({
            subject: 'Password changed successfully',
            body: `Your password has been changed successfully on ${date} at ${time}.`,
            to: user.email
        })
        if (!success) {
            throw new ApiError(message, 500)
        }

        return {
            success: true,
            statusCode: 200,
            message: responseMessage.UPDATE_SUCCESS('Passsword')
        }
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : responseMessage.INTERNAL_SERVER_ERROR
        const statusCode = error instanceof ApiError ? error.status : 500
        return {
            success: false,
            statusCode: statusCode,
            message: errMessage,
            error: error as Error
        }
    }
}
