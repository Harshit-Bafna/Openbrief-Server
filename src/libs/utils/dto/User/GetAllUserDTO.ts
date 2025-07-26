import { IsInt, Min, IsOptional, IsIn, IsEnum, IsArray, IsString } from 'class-validator'
import { Type } from 'class-transformer'
import { responseMessage } from '../../constants'
import { EUserRole } from '../../enums'

export class GetAllUserDTO {
    @Type(() => Number)
    @IsInt({ message: responseMessage.INVALID_TYPE('page', 'number') })
    @Min(1, { message: responseMessage.MIN_VALUE('page', 1) })
    page!: number

    @Type(() => Number)
    @IsInt({ message: responseMessage.INVALID_TYPE('limit', 'number') })
    @Min(1, { message: responseMessage.MIN_VALUE('limit', 1) })
    limit!: number

    // Allow true | false | null. Using IsIn to accept null explicitly.
    @IsOptional()
    @IsIn([true, false, null], {
        message: responseMessage.INVALID_TYPE('isActive', 'boolean | null')
    })
    isActive: boolean | null = null

    @IsOptional()
    @IsArray({ message: responseMessage.INVALID_TYPE('roles', 'array') })
    @IsEnum(EUserRole, {
        each: true,
        message: responseMessage.INVALID_TYPE('roles', `enum: ${Object.values(EUserRole).join(', ')}`)
    })
    roles: EUserRole[] = []

    @IsString({ message: responseMessage.INVALID_TYPE('search', 'string') })
    search!: string
}
