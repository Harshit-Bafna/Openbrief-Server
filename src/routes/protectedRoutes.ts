import { Router } from 'express'
import emailRouter from '../router/emailHandler'
import s3FileHandlerRouter from '../router/s3FileHandler'
import roleRouter from '../router/role'
import userRouter from '../router/user'

const router = Router()

router.use('/email', emailRouter)
router.use('/aws/S3', s3FileHandlerRouter)
router.use('/role', roleRouter)
router.use('/user', userRouter)

export default router
