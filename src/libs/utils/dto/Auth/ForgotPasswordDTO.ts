import { IsNotEmpty, IsEmail } from 'class-validator'
import { responseMessage } from '../../constants'

export class ForgotPasswordDTO {
    @IsEmail({}, { message: responseMessage.INVALID_TYPE('Email', 'email') })
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('Email') })
    emailAddress!: string
}
