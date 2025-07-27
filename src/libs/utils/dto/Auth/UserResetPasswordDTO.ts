import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator'
import { responseMessage, passwordRegex } from '../../constants'

export class UserResetPasswordDTO {
    @IsString({ message: responseMessage.INVALID_TYPE('New password', 'string') })
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('New password') })
    @Matches(passwordRegex, {
        message: responseMessage.INVALID_FIELD(
            'Password',
            'at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character (!, @, #, $, _ )'
        )
    })
    newPassword!: string

    @IsString({ message: responseMessage.INVALID_TYPE('Confirm password', 'string') })
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('Confirm password') })
    confirmPassword!: string

    @IsEmail({}, { message: responseMessage.INVALID_TYPE('Email', 'email') })
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('Email') })
    email!: string
}
