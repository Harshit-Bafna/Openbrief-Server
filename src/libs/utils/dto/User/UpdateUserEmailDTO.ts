import { IsNotEmpty, IsEmail } from 'class-validator'
import { responseMessage } from '../../constants'

export class UpdateUserEmailDTO {
    @IsEmail({}, { message: responseMessage.INVALID_TYPE('email', 'email') })
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('email') })
    emailAddress!: string

    @IsEmail({}, { message: responseMessage.INVALID_TYPE('new email', 'email') })
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('new email') })
    newEmailAddress!: string
}
