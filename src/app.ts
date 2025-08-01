import 'reflect-metadata'
import express, { Application, NextFunction, Request, Response } from 'express'
import path from 'path'
import publicRoutes from './routes/publicRoutes'
import protectedRoutes from './routes/protectedRoutes'
import { HttpError } from './libs/utils/helper'
import { environment, responseMessage } from './libs/utils/constants'
import { authentication, GlobalErrorHandler } from './middleware'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

const app: Application = express()

// middlewares
app.use(helmet())
app.use(
    cors({
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
        origin: [environment.CLIENT_URL as string],
        credentials: true
    })
)
app.use(express.json())
app.use(express.static(path.join(__dirname, '../', 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// public routes
app.use('/api/v1', publicRoutes)

// protected routes
app.use(authentication)
app.use('/api/v1', protectedRoutes)

// 404 hander
app.use((req: Request, _: Response, next: NextFunction) => {
    try {
        throw new Error(responseMessage.NOT_FOUND('Route'))
    } catch (error) {
        HttpError(next, error as Error, req, 404)
    }
})

// Global Error Handler
app.use(GlobalErrorHandler)

export default app
