import { IsString, IsNotEmpty, IsEmail } from 'class-validator'
import { responseMessage } from '../../constants'

export class UserLoginDTO {
    @IsEmail({}, { message: responseMessage.INVALID_TYPE('Email', 'email') })
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('Email') })
    email!: string

    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('Password') })
    @IsString({ message: responseMessage.INVALID_TYPE('Password', 'string') })
    password!: string
}
