import { NextFunction, Request, Response } from 'express'
import { IAuthenticatedRequest, IDecryptedJwt } from '../libs/utils/types'
import { environment, responseMessage } from '../libs/utils/constants'
import { User } from '../libs/service/postgreSQL'
import { HttpError, VerifyToken } from '../libs/utils/helper'

export default async (request: Request, _: Response, next: NextFunction) => {
    try {
        const req = request as Request & IAuthenticatedRequest
        const { cookies } = req
        const { accessToken } = cookies as {
            accessToken: string | undefined
        }

        if (accessToken) {
            const { userId } = VerifyToken(accessToken, environment.ACCESS_TOKEN.SECRET as string) as IDecryptedJwt
            const user = await User.findByPk(userId)
            if (user) {
                req.authenticatedUser = user
            }
            return next()
        }

        return HttpError(next, new Error(responseMessage.UNAUTHORIZED), req, 401)
    } catch (error) {
        return HttpError(next, error as Error, request, 401)
    }
}
