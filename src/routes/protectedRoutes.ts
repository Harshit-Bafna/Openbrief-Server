import { Router } from 'express'
import emailRouter from '../router/emailHandler'

const router = Router()

router.use('/email', emailRouter)

export default router
