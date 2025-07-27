import { NextFunction, Router, Request, Response } from 'express'
import { UserLoginDTO } from '../libs/utils/dto'
import { DtoError, GetDomain, getMainDomainAfterSubdomain, HttpError, HttpResponse, validateDTO } from '../libs/utils/helper'
import { GenerateNewAccessToken, LogoutUser, SelfIdentification, UserLogin } from '../controller/auth'
import { environment, responseMessage } from '../libs/utils/constants'
import { authentication } from '../middleware'

const router = Router()

/*
 * @Route: /api/v1/auth/login
 * @Method: POST
 * @Desc: Register user
 * @Access: Public
 * @Body: { email: string, password: string }
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = req.body as UserLoginDTO

        const requestValidation = await validateDTO(UserLoginDTO, input)
        if (!requestValidation.success) {
            return DtoError(next, req, requestValidation.status, requestValidation.errors)
        }

        const { success, statusCode, message, data, error } = await UserLogin(input)
        if (!success) {
            return HttpError(next, error, req, statusCode)
        }

        if (data) {
            const DOMAIN = GetDomain(environment.CLIENT_URL as string)

            const accessToken = (data.docs as { accessToken: string }).accessToken
            const refreshToken = (data.docs as { refreshToken: string }).refreshToken

            res.cookie('accessToken', accessToken, {
                path: '/',
                domain: environment.CLIENT_URL
                    ? environment.CLIENT_URL.startsWith('https')
                        ? `.${getMainDomainAfterSubdomain(environment.CLIENT_URL)}`
                        : undefined
                    : DOMAIN,
                sameSite: 'lax',
                maxAge: 1000 * environment.ACCESS_TOKEN.EXPIRY,
                httpOnly: true,
                secure: environment.CLIENT_URL ? environment.CLIENT_URL.startsWith('https') : false
            }).cookie('refreshToken', refreshToken, {
                path: '/',
                domain: environment.CLIENT_URL
                    ? environment.CLIENT_URL.startsWith('https')
                        ? `.${getMainDomainAfterSubdomain(environment.CLIENT_URL)}`
                        : undefined
                    : DOMAIN,
                sameSite: 'lax',
                maxAge: 1000 * environment.REFRESH_TOKEN.EXPIRY,
                httpOnly: true,
                secure: environment.CLIENT_URL ? environment.CLIENT_URL.startsWith('https') : false
            })
        }

        return HttpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

/*
 * @Route: /api/v1/auth/logout
 * @Method: POST
 * @Desc: Logout user
 * @Access: Public
 */
router.put('/logout', authentication, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { cookies } = req
        const { refreshToken } = cookies as { refreshToken: string | undefined }

        const { success, statusCode, message, data, error } = await LogoutUser(refreshToken)
        if (!success) {
            return HttpError(next, error, req, statusCode)
        }

        const DOMAIN = GetDomain(environment.CLIENT_URL as string)

        res.clearCookie('accessToken', {
            path: '/',
            domain: environment.CLIENT_URL
                ? environment.CLIENT_URL.startsWith('https')
                    ? `.${getMainDomainAfterSubdomain(environment.CLIENT_URL)}`
                    : undefined
                : DOMAIN,
            sameSite: 'lax',
            maxAge: 1000 * environment.ACCESS_TOKEN.EXPIRY,
            httpOnly: true,
            secure: environment.CLIENT_URL ? environment.CLIENT_URL.startsWith('https') : false
        })
        res.clearCookie('refreshToken', {
            path: '/',
            domain: environment.CLIENT_URL
                ? environment.CLIENT_URL.startsWith('https')
                    ? `.${getMainDomainAfterSubdomain(environment.CLIENT_URL)}`
                    : undefined
                : DOMAIN,
            sameSite: 'lax',
            maxAge: 1000 * environment.ACCESS_TOKEN.EXPIRY,
            httpOnly: true,
            secure: environment.CLIENT_URL ? environment.CLIENT_URL.startsWith('https') : false
        })

        return HttpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

/*
 * @Route: /api/v1/auth/refresh-token
 * @Method: get
 * @Desc: Generate new access token from refresh token
 * @Access: Public
 */
router.get('/refresh-token', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { cookies } = req
        const { refreshToken } = cookies as { refreshToken: string | undefined }

        const { success, statusCode, message, error, data } = await GenerateNewAccessToken(refreshToken)
        if (!success) {
            return HttpError(next, error, req, statusCode, message)
        }

        const DOMAIN = GetDomain(environment.CLIENT_URL as string)

        const accessToken = (data?.docs as { accessToken: string }).accessToken

        res.cookie('accessToken', accessToken, {
            path: '/',
            domain: environment.CLIENT_URL
                ? environment.CLIENT_URL.startsWith('https')
                    ? `.${getMainDomainAfterSubdomain(environment.CLIENT_URL)}`
                    : undefined
                : DOMAIN,
            sameSite: 'lax',
            maxAge: 1000 * environment.ACCESS_TOKEN.EXPIRY,
            httpOnly: true,
            secure: environment.CLIENT_URL ? environment.CLIENT_URL.startsWith('https') : false
        })

        return HttpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

/*
 * @Route: /api/v1/auth/self-identification
 * @Method: GET
 * @Desc: Get user identity
 * @Access: Protected
 */
router.get('/self-identification', authentication, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { cookies } = req
        const { accessToken } = cookies as { accessToken: string | undefined }
        if (!accessToken) {
            return HttpError(next, null, req, 400, responseMessage.UNAUTHORIZED)
        }

        const { success, statusCode, message, data, error } = await SelfIdentification(accessToken)
        if (!success) {
            return HttpError(next, error, req, statusCode, message)
        }
        return HttpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

export default router
