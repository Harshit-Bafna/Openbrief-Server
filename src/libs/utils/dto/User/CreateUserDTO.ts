import { IsString, IsOptional, IsNotEmpty, IsEmail, IsBoolean } from 'class-validator'
import { responseMessage } from '../../constants'

export class CreateUserDTO {
    @IsString({ message: responseMessage.INVALID_TYPE('name', 'string') })
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('name') })
    name!: string

    @IsEmail({}, { message: responseMessage.INVALID_TYPE('email', 'email') })
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('email') })
    email!: string

    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('password') })
    @IsString({ message: responseMessage.INVALID_TYPE('password', 'string') })
    password!: string

    @IsOptional()
    @IsBoolean({ message: responseMessage.INVALID_TYPE('isActive', 'boolean') })
    isActive?: boolean
}
