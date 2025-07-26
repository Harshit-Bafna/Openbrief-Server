import { IncludeOptions, WhereOptions } from 'sequelize'
import { User, Role, sequelize } from '../libs/service/postgreSQL'
import { environment, responseMessage } from '../libs/utils/constants'
import { ApiError, generateStrongPassword, GenerateOTP, EncryptPassword } from '../libs/utils/helper'
import { ApiResponse } from '../libs/utils/types'
import { sendEmailToSingleUser } from './emailHandler'
import { Op } from 'sequelize'
import {
    CreateAdminstrationDTO,
    CreateUserDTO,
    DeleteUserDTO,
    DeleteUserOfRoleDTO,
    GetAllUserDTO,
    GetUserByIdDTO,
    ToggleUserActivityDTO,
    TransferUserFromRoleDTO,
    UpdateUserEmailDTO
} from '../libs/utils/dto'
import { EUserRole } from '../libs/utils/enums'

export const RegisterUser = async ({ email, name, password, isActive }: CreateUserDTO): Promise<ApiResponse> => {
    try {
        const result = await sequelize.transaction(async (transaction) => {
            let user = await User.findOne({
                where: {
                    email: email
                },
                paranoid: false,
                transaction
            })

            const role = await Role.findOne({
                where: {
                    role: EUserRole.USER
                },
                transaction
            })
            if (!role) {
                throw new ApiError(responseMessage.NOT_FOUND('Role'), 404)
            }

            const otp = GenerateOTP(6)

            if (user) {
                if (user.deletedAt === null) {
                    throw new ApiError(responseMessage.ALREADY_EXISTS('User', 'email address'))
                }

                await user.restore({ transaction })
                user.name = name
                user.isActive = isActive ? isActive : true
                user.isVerified = false

                user.password = await EncryptPassword(password)
                user.role = role.id

                await user.save({ transaction })
            } else {
                user = await User.create(
                    {
                        name: name,
                        email: email,
                        role: role.id,
                        isActive: isActive ? isActive : true,
                        isVerified: false,
                        password: await EncryptPassword(password)
                    },
                    { transaction }
                )
            }

            const verificationLink = `${environment.CLIENT_URL}/auth/reset-password?otp=${otp}&email=${user.email}`
            const { success, message } = await sendEmailToSingleUser({
                subject: 'Welcome to OpenBrief',
                body: `WELCOME ${name} <br> <br> ${verificationLink} <br> <br> Your OTP is: ${otp}`,
                to: user.email
            })
            if (!success) {
                throw new ApiError(message, 500)
            }

            return {
                success: true,
                statusCode: 201,
                message: responseMessage.CREATE_SUCCESS('User'),
                data: {
                    docs: null
                }
            }
        })

        return result
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : responseMessage.SOMETHING_WENT_WRONG
        const statusCode = error instanceof ApiError ? error.status : 500
        return {
            success: false,
            statusCode: statusCode,
            message: errMessage,
            error: error as Error
        }
    }
}

export const RegisterAdminstration = async ({ email, name, isActive }: CreateAdminstrationDTO): Promise<ApiResponse> => {
    try {
        const result = await sequelize.transaction(async (transaction) => {
            let user = await User.findOne({
                where: {
                    email: email
                },
                paranoid: false,
                transaction
            })

            const role = await Role.findOne({
                where: {
                    role: EUserRole.ADMIN
                },
                transaction
            })
            if (!role) {
                throw new ApiError(responseMessage.NOT_FOUND('Role'), 404)
            }

            const otp = GenerateOTP(6)
            const password = generateStrongPassword()

            if (user) {
                if (user.deletedAt === null) {
                    throw new ApiError(responseMessage.ALREADY_EXISTS('User', 'email address'))
                }

                await user.restore({ transaction })
                user.name = name
                user.isActive = isActive ? isActive : true
                user.isVerified = false

                user.password = await EncryptPassword(password)
                user.role = role.id

                await user.save({ transaction })
            } else {
                user = await User.create(
                    {
                        name: name,
                        email: email,
                        role: role.id,
                        isActive: isActive ? isActive : true,
                        isVerified: false,
                        password: await EncryptPassword(password)
                    },
                    { transaction }
                )
            }

            const verificationLink = `${environment.CLIENT_URL}/auth/reset-password?otp=${otp}&email=${user.email}`
            const { success, message } = await sendEmailToSingleUser({
                subject: 'Welcome to OpenBrief',
                body: `WELCOME ${name} <br> <br> ${verificationLink} <br> <br> Your OTP is: ${otp} <br> <br> Your password is: ${password}`,
                to: user.email
            })
            if (!success) {
                throw new ApiError(message, 500)
            }

            return {
                success: true,
                statusCode: 201,
                message: responseMessage.CREATE_SUCCESS('User'),
                data: {
                    docs: null
                }
            }
        })

        return result
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : responseMessage.SOMETHING_WENT_WRONG
        const statusCode = error instanceof ApiError ? error.status : 500
        return {
            success: false,
            statusCode: statusCode,
            message: errMessage,
            error: error as Error
        }
    }
}

export const GetAllUsers = async ({ page, limit, isActive, roles, search }: GetAllUserDTO): Promise<ApiResponse> => {
    type ResponseType = {
        id: string
        name: string
        email: string
        isActive: boolean
    }

    const offset: number = (page - 1) * limit
    const whereClause: WhereOptions = {}
    const collectedUsers: ResponseType[] = []
    const groupedUsers: Record<string, ResponseType[]> = {}
    let skipped = 0

    try {
        const roleRecords =
            roles.length > 0
                ? await Role.findAll({
                      where: { role: { [Op.in]: roles } }
                  })
                : await Role.findAll()

        if (roles.length > 0 && roleRecords.length !== roles.length) {
            throw new ApiError(responseMessage.NOT_FOUND(`One or more roles not found`))
        }

        if (search) {
            whereClause.name = { [Op.iLike]: `%${search}%` }
        }

        if (isActive !== null) {
            whereClause.isActive = isActive
        }

        const includeModels: IncludeOptions[] = []

        includeModels.push({
            model: Role,
            as: 'roleDetails',
            attributes: ['role', 'id']
        })

        for (const roleRecord of roleRecords) {
            const roleId = roleRecord.id
            const roleName = roleRecord.role

            const users = await User.findAll({
                where: {
                    ...whereClause,
                    role: roleId
                },
                include: includeModels,
                attributes: ['isActive', 'createdAt', 'name', 'email', 'id'],
                order: [['createdAt', 'DESC']]
            })

            for (const user of users) {
                if (skipped < offset) {
                    skipped++
                    continue
                }
                if (collectedUsers.length >= limit) break

                const formattedUser: ResponseType = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    isActive: user.isActive
                }

                if (!groupedUsers[roleName]) groupedUsers[roleName] = []
                groupedUsers[roleName].push(formattedUser)
                collectedUsers.push(formattedUser)
            }

            if (collectedUsers.length >= limit) break
        }

        const total = await User.count({
            where: {
                ...whereClause,
                [Op.or]: [{ name: { [Op.iLike]: `%${search}%` } }],
                ...(roles.length > 0 && {
                    role: {
                        [Op.in]: roleRecords.map((r) => r.id)
                    }
                })
            }
        })

        return {
            success: true,
            statusCode: 200,
            message: responseMessage.FETCH_SUCCESS_LIST('Users'),
            data: {
                docs: groupedUsers,
                total,
                page,
                limit
            }
        }
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : responseMessage.SOMETHING_WENT_WRONG
        const statusCode = error instanceof ApiError ? error.status : 500
        return {
            success: false,
            statusCode: statusCode,
            message: errMessage,
            error: error as Error
        }
    }
}

export const GetUserById = async ({ userId }: GetUserByIdDTO): Promise<ApiResponse> => {
    try {
        const includeModels: IncludeOptions[] = []
        includeModels.push({
            model: Role,
            as: 'roleDetails',
            attributes: ['id', 'role']
        })

        const user = await User.findByPk(userId, {
            attributes: ['id', 'name', 'email', 'isActive', 'lastLoginAt', 'createdAt'],
            include: includeModels
        })
        if (!user) {
            throw new ApiError(responseMessage.NOT_FOUND('User'))
        }

        const responseData = {
            id: user.id,
            name: user.name,
            role: user.roleDetails?.role,
            email: user.email,
            isActive: user.isActive
        }

        return {
            success: true,
            statusCode: 200,
            message: responseMessage.FETCH_SUCCESS(`User with id ${user.id}`),
            data: {
                docs: responseData
            }
        }
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : responseMessage.SOMETHING_WENT_WRONG
        const statusCode = error instanceof ApiError ? error.status : 500
        return {
            success: false,
            statusCode: statusCode,
            message: errMessage,
            error: error as Error
        }
    }
}

export const ToggleUserActivity = async ({ userId }: ToggleUserActivityDTO): Promise<ApiResponse> => {
    try {
        const user = await User.findByPk(userId)
        if (!user) {
            throw new ApiError(responseMessage.NOT_FOUND('User'))
        }

        user.isActive = !user.isActive
        await user.save()

        return {
            success: true,
            statusCode: 200,
            message: responseMessage.UPDATE_SUCCESS(`User activity`),
            data: {
                docs: null
            }
        }
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : responseMessage.SOMETHING_WENT_WRONG
        const statusCode = error instanceof ApiError ? error.status : 500
        return {
            success: false,
            statusCode: statusCode,
            message: errMessage,
            error: error as Error
        }
    }
}

export const UpdateUserEmail = async ({ emailAddress, newEmailAddress }: UpdateUserEmailDTO): Promise<ApiResponse> => {
    try {
        const user = await User.findOne({
            where: {
                email: emailAddress
            }
        })
        if (!user) {
            throw new ApiError(responseMessage.NOT_FOUND('User'), 400)
        }

        user.email = newEmailAddress
        user.isVerified = false
        await user.save()

        return {
            success: true,
            statusCode: 200,
            message: responseMessage.UPDATE_SUCCESS(`User details`),
            data: {
                docs: null
            }
        }
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : responseMessage.SOMETHING_WENT_WRONG
        const statusCode = error instanceof ApiError ? error.status : 500
        return {
            success: false,
            statusCode: statusCode,
            message: errMessage,
            error: error as Error
        }
    }
}

export const TransferUserFromRole = async ({ fromRoleId, toRoleId }: TransferUserFromRoleDTO): Promise<ApiResponse> => {
    try {
        const fromRole = await Role.findByPk(fromRoleId)
        if (!fromRole) {
            throw new ApiError(responseMessage.NOT_FOUND(`Role (${fromRole})`), 404)
        }

        const toRole = await Role.findByPk(toRoleId)
        if (!toRole) {
            throw new ApiError(responseMessage.NOT_FOUND(`Role (${toRole})`), 404)
        }

        const users = await User.findAll({
            where: {
                role: fromRole.id
            }
        })

        for (const user of users) {
            user.role = toRole.id
            await user.save()
        }

        return {
            success: true,
            statusCode: 200,
            message: responseMessage.UPDATE_SUCCESS(`Users transferred from ${fromRole.role} to ${toRole.role}`),
            data: {
                docs: null
            }
        }
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : responseMessage.SOMETHING_WENT_WRONG
        const statusCode = error instanceof ApiError ? error.status : 500
        return {
            success: false,
            statusCode: statusCode,
            message: errMessage,
            error: error as Error
        }
    }
}

export const DeleteUser = async ({ userId, permanent }: DeleteUserDTO): Promise<ApiResponse> => {
    try {
        const user = await User.findByPk(userId)
        if (!user) {
            throw new ApiError(responseMessage.NOT_FOUND('User'), 404)
        }

        await user.destroy({ force: permanent })

        return {
            success: true,
            statusCode: 200,
            message: responseMessage.DELETE_SUCCESS('User')
        }
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : responseMessage.SOMETHING_WENT_WRONG
        const statusCode = error instanceof ApiError ? error.status : 500
        return {
            success: false,
            statusCode: statusCode,
            message: errMessage,
            error: error as Error
        }
    }
}

export const DeleteUserOfRole = async ({ roleId, permanent }: DeleteUserOfRoleDTO): Promise<ApiResponse> => {
    try {
        const role = await Role.findByPk(roleId)
        if (!role) {
            throw new ApiError(responseMessage.NOT_FOUND('Role'), 404)
        }

        const users = await User.findAll({
            where: {
                role: role.id
            }
        })

        for (const user of users) {
            await user.destroy({ force: permanent })
        }

        return {
            success: true,
            statusCode: 200,
            message: responseMessage.DELETE_SUCCESS(`Users of role ${role.role}`)
        }
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : responseMessage.SOMETHING_WENT_WRONG
        const statusCode = error instanceof ApiError ? error.status : 500
        return {
            success: false,
            statusCode: statusCode,
            message: errMessage,
            error: error as Error
        }
    }
}
