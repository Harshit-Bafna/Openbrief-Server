import { NextFunction, Router, Request, Response } from 'express'
import { DtoError, HttpError, HttpResponse, validateDTO } from '../libs/utils/helper'
import { authentication } from '../middleware'
import { ForgotPasswordDTO, UserChangePasswordDTO, UserResetPasswordDTO, UserVerifyOTPDTO } from '../libs/utils/dto'
import { ChangePassword, ForgotPassword, ResetPassword, verifyOTP } from '../controller/password'

const router = Router()

/*
 * @Route: /api/v1/password/change/:userId
 * @Method: POST
 * @Desc: Change user password
 * @Access: Protected
 * @Params: userId
 * @Body: { newPassword: string, oldPassword: string, confirmPassword: string
 */
router.post('/change/:userId', authentication, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId

        const input = { ...req.body, userId } as UserChangePasswordDTO
        const requestValidation = await validateDTO(UserChangePasswordDTO, input)
        if (!requestValidation.success) {
            return DtoError(next, req, requestValidation.status, requestValidation.errors)
        }

        const { success, statusCode, message, data, error } = await ChangePassword(input)
        if (!success) {
            return HttpError(next, error, req, statusCode)
        }

        return HttpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

/*
 * @Route: /api/v1/password/forgot
 * @Method: POST
 * @Desc: Request forgot password
 * @Access: Public
 * @Body: { emailAddress: string }
 */
router.post('/forgot', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = req.body as ForgotPasswordDTO
        const requestValidation = await validateDTO(ForgotPasswordDTO, input)
        if (!requestValidation.success) {
            return DtoError(next, req, requestValidation.status, requestValidation.errors)
        }

        const { success, statusCode, message, data, error } = await ForgotPassword(input)
        if (!success) {
            return HttpError(next, error, req, statusCode)
        }

        return HttpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

/*
 * @Route: /api/v1/password/reset
 * @Method: POST
 * @Desc: Reset user password
 * @Access: Public
 * @Body: { emailAddress: string, newPassword: string, confirmPassword: string }
 */
router.post('/reset', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = req.body as UserResetPasswordDTO
        const requestValidation = await validateDTO(UserResetPasswordDTO, input)
        if (!requestValidation.success) {
            return DtoError(next, req, requestValidation.status, requestValidation.errors)
        }

        const { success, statusCode, message, data, error } = await ResetPassword(input)
        if (!success) {
            return HttpError(next, error, req, statusCode)
        }

        return HttpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

/*
 * @Route: /api/v1/password/verify-otp
 * @Method: PATCH
 * @Desc: Verify OTP for password reset
 * @Access: Public
 * @Body: { email: string, otp: string }
 */
router.patch('/verify-otp', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = req.body as UserVerifyOTPDTO
        const requestValidation = await validateDTO(UserVerifyOTPDTO, input)
        if (!requestValidation.success) {
            return DtoError(next, req, requestValidation.status, requestValidation.errors)
        }

        const { success, statusCode, message, data, error } = await verifyOTP(input)
        if (!success) {
            return HttpError(next, error, req, statusCode)
        }

        return HttpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

export default router
