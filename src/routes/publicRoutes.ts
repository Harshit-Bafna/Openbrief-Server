import { Router } from 'express'
import applicationRouter from '../router/application'
import authRouter from '../router/auth'
import passwordRouter from '../router/password'

const router = Router()

router.use('/', applicationRouter)
router.use('/auth', authRouter)
router.use('/password', passwordRouter)

export default router
