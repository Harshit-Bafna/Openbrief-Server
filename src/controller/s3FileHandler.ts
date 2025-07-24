import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { ApiResponse } from '../libs/utils/types'
import { environment, responseMessage } from '../libs/utils/constants'
import { randomBytes } from 'crypto'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { S3 } from '../libs/service/AWS'
import { ApiError } from '../libs/utils/helper'

export const GenerateUploadURL = async (path = '/', ext = ''): Promise<ApiResponse> => {
    try {
        const rawBytes = randomBytes(16)
        const fileName = rawBytes.toString('hex')
        const key = `${path.replace(/\/+$/, '')}/${fileName}.${ext}`

        const command = new PutObjectCommand({
            Bucket: environment.BUCKET_NAME,
            Key: key
        })

        const url = await getSignedUrl(S3, command, {
            expiresIn: environment.SIGN_EXPIRY_TIME
        })

        return {
            success: true,
            statusCode: 200,
            message: responseMessage.UPLOAD_URL_GENERATED,
            data: {
                docs: { url, key }
            }
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

export const GetSignedFileURL = async (key: string): Promise<ApiResponse> => {
    try {
        const getObjectCommand = {
            Bucket: environment.BUCKET_NAME,
            Key: key
        }

        const command = new GetObjectCommand(getObjectCommand)
        const url = await getSignedUrl(S3, command, { expiresIn: environment.SIGN_EXPIRY_TIME })

        return {
            success: true,
            statusCode: 200,
            message: responseMessage.SIGNED_URL_FETCHED,
            data: {
                docs: url
            }
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

export const DeleteFilefromAWS = async (key: string): Promise<ApiResponse> => {
    const bucketName = environment.BUCKET_NAME
    try {
        const deleteParams = {
            Bucket: bucketName,
            Key: key
        }

        const deleteCommand = new DeleteObjectCommand(deleteParams)
        await S3.send(deleteCommand)

        return {
            success: true,
            statusCode: 200,
            message: responseMessage.FILE_DELETED,
            data: {
                docs: null
            }
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
