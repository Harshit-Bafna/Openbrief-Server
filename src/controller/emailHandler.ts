import { sendEmail } from '../libs/service/resend'
import { responseMessage } from '../libs/utils/constants'
import { SendBulkGroupsEmailDTO, SendMultipleEmailDTO, SendSingleEmailDTO } from '../libs/utils/dto'
import { ApiError } from '../libs/utils/helper'
import { ApiResponse } from '../libs/utils/types'

export const sendEmailToSingleUser = async (input: SendSingleEmailDTO): Promise<ApiResponse> => {
    const { subject, body, to } = input
    try {
        await sendEmail([to], subject, body)

        return {
            success: true,
            statusCode: 200,
            message: responseMessage.EMAIL_SENT
        }
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : responseMessage.INTERNAL_SERVER_ERROR
        const statusCode = error instanceof ApiError ? error.status : 500
        return {
            success: false,
            statusCode,
            message: errMessage,
            error: error as Error
        }
    }
}

export const sendEmailToMultipleUsers = async (input: SendMultipleEmailDTO): Promise<ApiResponse> => {
    const { to, subject, body } = input
    try {
        await sendEmail(to, subject, body)

        return {
            success: true,
            statusCode: 200,
            message: responseMessage.EMAIL_SENT_TO_MULTIPLE_USERS
        }
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : responseMessage.INTERNAL_SERVER_ERROR
        const statusCode = error instanceof ApiError ? error.status : 500
        return {
            success: false,
            statusCode,
            message: errMessage,
            error: error as Error
        }
    }
}

export const sendBulkEmailsToGroups = async (input: SendBulkGroupsEmailDTO): Promise<ApiResponse> => {
    const { groups } = input
    const results: ApiResponse[] = []

    for (const group of groups) {
        try {
            await sendEmail(group.to, group.subject, group.body)

            results.push({
                success: true,
                statusCode: 200,
                message: responseMessage.EMAIL_SENT_TO_GROUPS
            })
        } catch (error) {
            const errMessage = error instanceof Error ? error.message : responseMessage.INTERNAL_SERVER_ERROR
            const statusCode = error instanceof ApiError ? error.status : 500
            results.push({
                success: false,
                statusCode,
                message: errMessage,
                error: error as Error
            })
        }
    }

    return {
        success: results.every((res) => res.success),
        statusCode: 200,
        message: 'Bulk group email processing completed',
        data: { docs: results }
    }
}
