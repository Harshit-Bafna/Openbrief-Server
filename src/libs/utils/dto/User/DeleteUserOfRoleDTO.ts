import { IsUUID, IsNotEmpty, IsOptional } from 'class-validator'
import { responseMessage } from '../../constants'

export class DeleteUserOfRoleDTO {
    @IsUUID('4', { message: responseMessage.INVALID_TYPE('roleId', 'uuid4') })
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('roleId') })
    roleId!: string

    @IsOptional()
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('permanent') })
    permanent = false
}
