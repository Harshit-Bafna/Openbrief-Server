import { IsUUID, IsNotEmpty } from 'class-validator'
import { responseMessage } from '../../constants'

export class GetUserByIdDTO {
    @IsUUID('4', { message: responseMessage.INVALID_TYPE('userId', 'uuid4') })
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('userId') })
    userId!: string
}
