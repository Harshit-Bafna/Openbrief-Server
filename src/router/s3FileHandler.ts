import { Router, Request, Response, NextFunction } from 'express'
import { GenerateUploadURL, GetSignedFileURL, DeleteFilefromAWS } from '../controller/s3FileHandler'
import { HttpError, HttpResponse } from '../libs/utils/helper'

const router = Router()

/*
 * @Route: /api/v1/aws/S3/upload-url
 * @Method: GET
 * @Desc: Generate a signed URL to upload a file
 * @Access: Protected
 * @Query: path (optional), ext (optional)
 */
router.get('/upload-url', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { path = '/', ext = '' } = req.query as { path?: string; ext?: string }
        const { success, statusCode, message, data, error } = await GenerateUploadURL(path, ext)

        if (!success) return HttpError(next, error, req, statusCode)
        return HttpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

/*
 * @Route: /api/v1/aws/S3/signed-url
 * @Method: GET
 * @Desc: Get a signed URL to download/view a file
 * @Access: Protected
 * @Query: key (required)
 */
router.get('/signed-url', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { key } = req.query as { key: string }
        if (!key) return HttpError(next, new Error('Key is required'), req, 400)

        const { success, statusCode, message, data, error } = await GetSignedFileURL(key)
        if (!success) return HttpError(next, error, req, statusCode)
        return HttpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

/*
 * @Route: /api/v1/aws/S3/delete-file
 * @Method: DELETE
 * @Desc: Delete a file from AWS S3
 * @Access: Protected
 * @Body: key (required)
 */
router.delete('/delete-file', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { key } = req.body as { key: string }
        if (!key) return HttpError(next, new Error('Key is required'), req, 400)

        const { success, statusCode, message, data, error } = await DeleteFilefromAWS(key)
        if (!success) return HttpError(next, error, req, statusCode)
        return HttpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

export default router
