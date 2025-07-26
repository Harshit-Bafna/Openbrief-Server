import { Router, Request, Response, NextFunction } from 'express'
import { DtoError, HttpError, HttpResponse, validateDTO } from '../libs/utils/helper'
import { CreateRoleDTO, DeleteRoleDTO } from '../libs/utils/dto'
import { CreateUserRole, DeleteUserRole, GetAllUserRoles } from '../controller/role'

const router = Router()

/*
 * @Route: /api/v1/role
 * @Method: POST
 * @Desription: Create a new user role
 * @Access: Protected
 * @Body: { roleName: string }
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = req.body as CreateRoleDTO
        const requestValidation = await validateDTO(CreateRoleDTO, input)
        if (!requestValidation.success) {
            return DtoError(next, req, requestValidation.status, requestValidation.errors)
        }

        const { success, statusCode, error, message, data } = await CreateUserRole(input)
        if (!success) return HttpError(next, error, req, statusCode)
        return HttpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

/*
 * @Route: /api/v1/role
 * @Method: GET
 * @Desription: Get all user roles
 * @Access: Protected
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { success, statusCode, error, message, data } = await GetAllUserRoles()
        if (!success) return HttpError(next, error, req, statusCode)
        return HttpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

/*
 * @Route: /api/v1/role
 * @Method: DELETE
 * @Desription: Delete user role
 * @Access: Protected
 * @Body: { roleId: string }
 */
router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = req.body as DeleteRoleDTO
        const requestValidation = await validateDTO(DeleteRoleDTO, input)
        if (!requestValidation.success) {
            return DtoError(next, req, requestValidation.status, requestValidation.errors)
        }

        const { success, statusCode, error, message, data } = await DeleteUserRole(input)
        if (!success) return HttpError(next, error, req, statusCode)
        return HttpResponse(req, res, statusCode, message, data)
    } catch (err) {
        return HttpError(next, err as Error, req, 500)
    }
})

export default router
