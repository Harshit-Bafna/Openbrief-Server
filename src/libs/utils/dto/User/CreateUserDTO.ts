import { IsString, IsOptional, IsNotEmpty, IsEmail, IsBoolean, Matches } from 'class-validator'
import { passwordRegex, responseMessage } from '../../constants'

export class CreateUserDTO {
    @IsString({ message: responseMessage.INVALID_TYPE('name', 'string') })
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('name') })
    name!: string

    @IsEmail({}, { message: responseMessage.INVALID_TYPE('email', 'email') })
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('email') })
    email!: string

    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('password') })
    @IsString({ message: responseMessage.INVALID_TYPE('password', 'string') })
    @Matches(passwordRegex, {
        message:
            'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character ( !, @, #, $, _ )'
    })
    password!: string

    @IsOptional()
    @IsBoolean({ message: responseMessage.INVALID_TYPE('isActive', 'boolean') })
    isActive?: boolean
}
