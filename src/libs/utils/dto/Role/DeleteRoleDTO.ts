import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator'
import { responseMessage } from '../../constants'

export class DeleteRoleDTO {
    @IsUUID('4', { message: responseMessage.INVALID_TYPE('roleId', 'uuid4') })
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('roleId') })
    roleId!: string

    @IsOptional()
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('permanent') })
    permanent = false
}
