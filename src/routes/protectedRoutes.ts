import { Router } from 'express'
import emailRouter from '../router/emailHandler'
import s3FileHandlerRouter from '../router/s3FileHandler'

const router = Router()

router.use('/email', emailRouter)
router.use('/aws/S3', s3FileHandlerRouter)

export default router
