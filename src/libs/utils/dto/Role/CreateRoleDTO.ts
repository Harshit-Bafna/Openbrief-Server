import { IsNotEmpty, IsString } from 'class-validator'
import { responseMessage } from '../../constants'

export class CreateRoleDTO {
    @IsString({ message: responseMessage.INVALID_TYPE('roleName', 'string') })
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('roleName') })
    roleName!: string
}
