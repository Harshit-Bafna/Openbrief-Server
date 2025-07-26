import { Role } from '../libs/service/postgreSQL'
import { responseMessage } from '../libs/utils/constants'
import { CreateRoleDTO, DeleteRoleDTO } from '../libs/utils/dto'
import { ApiError } from '../libs/utils/helper'
import { ApiResponse } from '../libs/utils/types'

export const CreateUserRole = async ({ roleName }: CreateRoleDTO): Promise<ApiResponse> => {
    try {
        const existingRole = await Role.findOne({ where: { role: roleName } })
        if (existingRole) {
            throw new ApiError(responseMessage.ALREADY_EXISTS('Role'), 400)
        }

        await Role.create({ role: roleName })

        return {
            success: true,
            statusCode: 201,
            message: responseMessage.CREATE_SUCCESS('User role')
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

export const GetAllUserRoles = async (): Promise<ApiResponse> => {
    try {
        const role = await Role.findAll({
            attributes: ['id', 'role'],
            order: [['role', 'ASC']]
        })
        if (!role) {
            throw new ApiError(responseMessage.FETCH_ERROR_LIST('Role'), 400)
        }

        return {
            success: true,
            statusCode: 200,
            message: responseMessage.FETCH_SUCCESS_LIST('User role'),
            data: {
                docs: role
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

export const DeleteUserRole = async ({ roleId, permanent }: DeleteRoleDTO): Promise<ApiResponse> => {
    try {
        const role = await Role.findByPk(roleId)
        if (!role) {
            throw new ApiError(responseMessage.NOT_FOUND('Role'), 404)
        }

        await role.destroy({ force: permanent })

        return {
            success: true,
            statusCode: 200,
            message: responseMessage.DELETE_SUCCESS('User role')
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
