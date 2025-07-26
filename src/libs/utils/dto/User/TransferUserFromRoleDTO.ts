import { IsUUID, IsNotEmpty } from 'class-validator'
import { responseMessage } from '../../constants'

export class TransferUserFromRoleDTO {
    @IsUUID('4', { message: responseMessage.INVALID_TYPE('fromRoleId', 'uuid4') })
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('fromRoleId') })
    fromRoleId!: string

    @IsUUID('4', { message: responseMessage.INVALID_TYPE('toRoleId', 'uuid4') })
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('toRoleId') })
    toRoleId!: string
}
