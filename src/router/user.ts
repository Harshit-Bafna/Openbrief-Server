import { Router, Request, Response, NextFunction } from 'express'
import { DtoError, HttpError, HttpResponse, validateDTO } from '../libs/utils/helper'
import {
    CreateUserDTO,
    GetAllUserDTO,
    GetUserByIdDTO,
    ToggleUserActivityDTO,
    UpdateUserEmailDTO,
    TransferUserFromRoleDTO,
    DeleteUserDTO,
    DeleteUserOfRoleDTO,
    CreateAdminstrationDTO
} from '../libs/utils/dto'
import {
    RegisterUser,
    GetAllUsers,
    GetUserById,
    ToggleUserActivity,
    UpdateUserEmail,
    TransferUserFromRole,
    DeleteUser,
    DeleteUserOfRole,
    RegisterAdminstration
} from '../controller/user'
import { EUserRole } from '../libs/utils/enums'

const router = Router()

/*
 * @Route: /api/v1/user/register/user
 * @Method: POST
 * @Description: Register a new user
 * @Access: Public (or Protected)
 * @Body: { email: string, name: string, password: string, isActive?: boolean }
 */
router.post('/register/user', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = req.body as CreateUserDTO
        const requestValidation = await validateDTO(CreateUserDTO, input)
        if (!requestValidation.success) {
            return DtoError(next, req, requestValidation.status, requestValidation.errors)
        }

        const { success, statusCode, error, message, data } = await RegisterUser(input)
        if (!success) return HttpError(next, error, req, statusCode)
        return HttpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

/*
 * @Route: /api/v1/user/register/admin
 * @Method: POST
 * @Description: Register a new administration user
 * @Access: Public (or Protected)
 * @Body: { email: string, name: string, isActive?: boolean }
 */
router.post('/register/user', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = req.body as CreateAdminstrationDTO
        const requestValidation = await validateDTO(CreateAdminstrationDTO, input)
        if (!requestValidation.success) {
            return DtoError(next, req, requestValidation.status, requestValidation.errors)
        }

        const { success, statusCode, error, message, data } = await RegisterAdminstration(input)
        if (!success) return HttpError(next, error, req, statusCode)
        return HttpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

/*
 * @Route: /api/v1/users
 * @Method: GET
 * @Description: Get all users with filters
 * @Access: Protected
 * @Query: page?: number, limit?: number, isActive?: boolean, roles?: string[], search?: string
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit, isActive, roles, search } = req.query

        let rolesArray: EUserRole[] = []
        if (roles) {
            rolesArray = (roles as string).split(',') as EUserRole[]
        }

        const input: GetAllUserDTO = {
            page: page ? parseInt(page as string, 10) : 1,
            limit: limit ? parseInt(limit as string, 10) : 10,
            isActive: isActive !== undefined ? isActive === 'true' : null,
            roles: rolesArray,
            search: search ? (search as string) : ''
        }

        const requestValidation = await validateDTO(GetAllUserDTO, input)
        if (!requestValidation.success) {
            return DtoError(next, req, requestValidation.status, requestValidation.errors)
        }

        const { success, statusCode, error, message, data } = await GetAllUsers(input)
        if (!success) return HttpError(next, error, req, statusCode)

        return HttpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

/*
 * @Route: /api/v1/user/:userId
 * @Method: GET
 * @Description: Get a user by id
 * @Access: Protected
 */
router.get('/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input: GetUserByIdDTO = { userId: req.params.userId }
        const requestValidation = await validateDTO(GetUserByIdDTO, input)
        if (!requestValidation.success) {
            return DtoError(next, req, requestValidation.status, requestValidation.errors)
        }

        const { success, statusCode, error, message, data } = await GetUserById(input)
        if (!success) return HttpError(next, error, req, statusCode)
        return HttpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

/*
 * @Route: /api/v1/user/:userId/toggle-activity
 * @Method: PATCH
 * @Description: Toggle a user's active status
 * @Access: Protected
 */
router.patch('/:userId/toggle-activity', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input: ToggleUserActivityDTO = { userId: req.params.userId }
        const requestValidation = await validateDTO(ToggleUserActivityDTO, input)
        if (!requestValidation.success) {
            return DtoError(next, req, requestValidation.status, requestValidation.errors)
        }

        const { success, statusCode, error, message, data } = await ToggleUserActivity(input)
        if (!success) return HttpError(next, error, req, statusCode)
        return HttpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

/*
 * @Route: /api/v1/user/email
 * @Method: PATCH
 * @Description: Update user email
 * @Access: Protected
 * @Body: { emailAddress: string, newEmailAddress: string }
 */
router.patch('/email', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = req.body as UpdateUserEmailDTO
        const requestValidation = await validateDTO(UpdateUserEmailDTO, input)
        if (!requestValidation.success) {
            return DtoError(next, req, requestValidation.status, requestValidation.errors)
        }

        const { success, statusCode, error, message, data } = await UpdateUserEmail(input)
        if (!success) return HttpError(next, error, req, statusCode)
        return HttpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

/*
 * @Route: /api/v1/user/role/transfer
 * @Method: PATCH
 * @Description: Transfer all users from one role to another
 * @Access: Protected
 * @Body: { fromRoleId: string, toRoleId: string }
 */
router.patch('/role/transfer', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = req.body as TransferUserFromRoleDTO
        const requestValidation = await validateDTO(TransferUserFromRoleDTO, input)
        if (!requestValidation.success) {
            return DtoError(next, req, requestValidation.status, requestValidation.errors)
        }

        const { success, statusCode, error, message, data } = await TransferUserFromRole(input)
        if (!success) return HttpError(next, error, req, statusCode)
        return HttpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

/*
 * @Route: /api/v1/user
 * @Method: DELETE
 * @Description: Delete a user
 * @Access: Protected
 * @Body: { userId: string, permanent: boolean }
 */
router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = req.body as DeleteUserDTO
        const requestValidation = await validateDTO(DeleteUserDTO, input)
        if (!requestValidation.success) {
            return DtoError(next, req, requestValidation.status, requestValidation.errors)
        }

        const { success, statusCode, error, message, data } = await DeleteUser(input)
        if (!success) return HttpError(next, error, req, statusCode)
        return HttpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

/*
 * @Route: /api/v1/user/role
 * @Method: DELETE
 * @Description: Delete all users of a role
 * @Access: Protected
 * @Body: { roleId: string, permanent: boolean }
 */
router.delete('/role', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = req.body as DeleteUserOfRoleDTO
        const requestValidation = await validateDTO(DeleteUserOfRoleDTO, input)
        if (!requestValidation.success) {
            return DtoError(next, req, requestValidation.status, requestValidation.errors)
        }

        const { success, statusCode, error, message, data } = await DeleteUserOfRole(input)
        if (!success) return HttpError(next, error, req, statusCode)
        return HttpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

export default router
