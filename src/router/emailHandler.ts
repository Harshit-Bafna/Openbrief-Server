import { Router, Request, Response, NextFunction } from 'express'
import { sendEmailToSingleUser, sendEmailToMultipleUsers, sendBulkEmailsToGroups } from '../controller/emailHandler'
import { SendSingleEmailDTO } from '../libs/utils/dto/Email/SendSingleEmailDTO'
import { validateDTO } from '../libs/utils/helper/validateDto'
import { SendMultipleEmailDTO } from '../libs/utils/dto/Email/SendMultipleEmailDTO'
import { SendBulkGroupsEmailDTO } from '../libs/utils/dto/Email/SendBulkGroupsEmailDTO'
import { DtoError, HttpError, HttpResponse } from '../libs/utils/helper'

const router = Router()

/*
 * @Route: /api/v1/email/send-single
 * @Method: POST
 * @Desription: Send email to a single user
 * @Access: Protected
 * @Body: { to: string, subject: string, body: string }
 */
router.post('/send-single', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = req.body as SendSingleEmailDTO
        const requestValidation = await validateDTO(SendSingleEmailDTO, input)
        if (!requestValidation.success) {
            return DtoError(next, req, requestValidation.status, requestValidation.errors)
        }

        const result = await sendEmailToSingleUser(input)
        if (!result.success) return HttpError(next, result.error, req, result.statusCode)
        return HttpResponse(req, res, result.statusCode, result.message, result.data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

/*
 * @Route: /api/v1/email/send-multiple
 * @Method: POST
 * @Desription: Send email to multiple users
 * @Access: Protected
 * @Body: { to: string[], subject: string, body: string }
 */
router.post('/send-multiple', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = req.body as SendMultipleEmailDTO
        const requestValidation = await validateDTO(SendMultipleEmailDTO, input)
        if (!requestValidation.success) {
            return DtoError(next, req, requestValidation.status, requestValidation.errors)
        }

        const result = await sendEmailToMultipleUsers(input)
        if (!result.success) return HttpError(next, result.error, req, result.statusCode)
        return HttpResponse(req, res, result.statusCode, result.message, result.data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

/*
 * @Route: /api/v1/email/send-bulk-groups
 * @Method: POST
 * @Desription: Send emails in bulk to email groups
 * @Access: Protected
 * @Body: { groups: { to: string[], subject: string, body: string }[] }
 */
router.post('/send-bulk-groups', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = req.body as SendBulkGroupsEmailDTO
        const requestValidation = await validateDTO(SendBulkGroupsEmailDTO, input)
        if (!requestValidation.success) {
            return DtoError(next, req, requestValidation.status, requestValidation.errors)
        }

        const result = await sendBulkEmailsToGroups(input)
        if (!result.success) return HttpError(next, result.error, req, result.statusCode)
        return HttpResponse(req, res, result.statusCode, result.message, result.data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

export default router
