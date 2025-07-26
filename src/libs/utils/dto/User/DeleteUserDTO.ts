import { IsUUID, IsNotEmpty, IsOptional } from 'class-validator'
import { responseMessage } from '../../constants'

export class DeleteUserDTO {
    @IsUUID('4', { message: responseMessage.INVALID_TYPE('userId', 'uuid4') })
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('userId') })
    userId!: string

    @IsOptional()
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('permanent') })
    permanent = false
}
