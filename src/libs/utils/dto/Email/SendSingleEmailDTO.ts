import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SendSingleEmailDTO {
    @IsEmail({}, { message: 'Recipient email must be a valid email address' })
    @IsNotEmpty({ message: 'Recipient email is required' })
    to!: string

    @IsNotEmpty({ message: 'Subject is required' })
    @IsString({ message: 'Subject must be a string' })
    subject!: string

    @IsNotEmpty({ message: 'Body is required' })
    @IsString({ message: 'Body must be a string' })
    body!: string
}
