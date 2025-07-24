import { IsArray, ArrayNotEmpty, IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SendMultipleEmailDTO {
    @IsArray({ message: 'Recipient list must be an array' })
    @ArrayNotEmpty({ message: 'Recipient list cannot be empty' })
    @IsEmail({}, { each: true, message: 'Each recipient email must be valid' })
    to!: string[]

    @IsNotEmpty({ message: 'Subject is required' })
    @IsString({ message: 'Subject must be a string' })
    subject!: string

    @IsNotEmpty({ message: 'Body is required' })
    @IsString({ message: 'Body must be a string' })
    body!: string
}
