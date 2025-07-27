import { IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator'
import { passwordRegex } from '../../constants/regex'
import { responseMessage } from '../../constants'

export class UserChangePasswordDTO {
    @IsUUID('4', { message: responseMessage.INVALID_TYPE('User Id', 'UUID') })
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('User Id') })
    userId!: string

    @IsString({ message: responseMessage.INVALID_TYPE('Old Password', 'string') })
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('Old Password') })
    oldPassword!: string

    @IsString({ message: responseMessage.INVALID_TYPE('New Password', 'string') })
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('New Password') })
    @Matches(passwordRegex, {
        message:
            'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character ( !, @, #, $, _ )'
    })
    newPassword!: string

    @IsString({ message: responseMessage.INVALID_TYPE('Confirm Password', 'string') })
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('Confirm Password') })
    confirmPassword!: string
}
