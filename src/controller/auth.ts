import dayjs from 'dayjs'
import { User, Role, sequelize, RefreshToken } from '../libs/service/postgreSQL'
import { environment, responseMessage } from '../libs/utils/constants'
import { UserLoginDTO } from '../libs/utils/dto'
import { ApiError, VerifyPassword, GenerateJwtToken, VerifyToken } from '../libs/utils/helper'
import { ApiResponse, IDecryptedJwt } from '../libs/utils/types'

export const UserLogin = async ({ email, password }: UserLoginDTO): Promise<ApiResponse> => {
    try {
        const result = await sequelize.transaction(async (transaction) => {
            const user = await User.findOne({
                where: {
                    email: email
                },
                include: [
                    {
                        model: Role,
                        as: 'roleDetails'
                    }
                ],
                transaction
            })
            if (!user) {
                throw new ApiError(responseMessage.NOT_FOUND('User'), 404)
            }
            if (!user.isActive) {
                throw new ApiError('User is not active', 404)
            }

            const isPasswordCorrect = await VerifyPassword(password, user.password)
            if (!isPasswordCorrect) {
                throw new ApiError(responseMessage.INVALID_CREDENTIALS('user'), 400)
            }

            const accessToken = GenerateJwtToken(
                {
                    userId: user.id,
                    name: user.name,
                    role: user.role
                },
                environment.ACCESS_TOKEN.SECRET as string,
                environment.ACCESS_TOKEN.EXPIRY
            )

            const refreshToken = GenerateJwtToken(
                {
                    userId: user.id
                },
                environment.REFRESH_TOKEN.SECRET as string,
                environment.REFRESH_TOKEN.EXPIRY
            )

            user.lastLoginAt = new Date()
            await user.save({ transaction })

            await RefreshToken.create(
                {
                    userId: user.id,
                    refreshToken: refreshToken,
                    expiresAt: dayjs().add(environment.REFRESH_TOKEN.EXPIRY, 'second').toDate()
                },
                { transaction }
            )

            return {
                success: true,
                statusCode: 200,
                message: responseMessage.LOGIN,
                data: {
                    docs: {
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            roleDetails: {
                                roleId: user.role,
                                role: user.roleDetails?.role
                            }
                        },
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    }
                }
            }
        })

        return result
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

export const LogoutUser = async (refreshToken: string | undefined): Promise<ApiResponse> => {
    try {
        if (refreshToken) {
            await RefreshToken.destroy({
                where: {
                    refreshToken: refreshToken
                }
            })
        }

        return {
            success: true,
            statusCode: 200,
            message: responseMessage.LOGOUT,
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

export const GenerateNewAccessToken = async (refreshToken: string | undefined): Promise<ApiResponse> => {
    try {
        if (!refreshToken) {
            return {
                success: false,
                statusCode: 401,
                message: responseMessage.NOT_FOUND('Refresh token')
            }
        }

        const validateRefreshToken = await RefreshToken.findOne({
            where: {
                refreshToken: refreshToken
            }
        })
        if (!validateRefreshToken || validateRefreshToken.expiresAt < new Date()) {
            return {
                success: false,
                statusCode: 401,
                message: responseMessage.INVALID_CREDENTIALS('Refresh token')
            }
        }

        const user = await User.findByPk(validateRefreshToken.userId, {
            include: [
                {
                    model: Role,
                    as: 'roleDetails'
                }
            ]
        })
        if (!user) {
            return {
                success: false,
                statusCode: 401,
                message: responseMessage.NOT_FOUND('User')
            }
        }

        const accessToken = GenerateJwtToken(
            {
                userId: user.id,
                name: user.name,
                role: user.role
            },
            environment.ACCESS_TOKEN.SECRET as string,
            environment.ACCESS_TOKEN.EXPIRY
        )

        return {
            success: true,
            statusCode: 200,
            message: responseMessage.SUCCESS('Access token generated successfully'),
            data: {
                docs: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        roleDetails: {
                            roleId: user.role,
                            role: user.roleDetails?.role
                        }
                    },
                    accessToken: accessToken
                }
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

export const SelfIdentification = async (accessToken: string): Promise<ApiResponse> => {
    try {
        const { userId } = VerifyToken(accessToken, environment.ACCESS_TOKEN.SECRET as string) as IDecryptedJwt
        const user = await User.findByPk(userId, {
            include: [
                {
                    model: Role,
                    as: 'roleDetails'
                }
            ]
        })
        if (!user) {
            return {
                success: false,
                statusCode: 401,
                message: responseMessage.NOT_FOUND('User')
            }
        }

        return {
            success: true,
            statusCode: 200,
            message: responseMessage.LOGOUT,
            data: {
                docs: {
                    user: {
                        name: user.name,
                        email: user.email,
                        roleDetails: {
                            roleId: user.role,
                            role: user.roleDetails?.role
                        }
                    }
                }
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
