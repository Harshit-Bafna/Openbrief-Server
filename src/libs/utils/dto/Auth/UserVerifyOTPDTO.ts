import { IsNotEmpty, IsString, Matches } from 'class-validator'
import { responseMessage, otpRegex } from '../../constants'

export class UserVerifyOTPDTO {
    @IsString({ message: responseMessage.INVALID_TYPE('OTP', 'string') })
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('OTP') })
    @Matches(otpRegex, { message: responseMessage.INVALID_FIELD('OTP', '6-digit number') })
    otp!: string

    @IsString({ message: responseMessage.INVALID_TYPE('Email', 'string') })
    @IsNotEmpty({ message: responseMessage.REQUIRED_FIELD('Email') })
    email!: string
}
