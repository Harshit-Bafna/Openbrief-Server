import { IsArray, ArrayNotEmpty, IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator'

class EmailGroupDTO {
    @IsArray({ message: 'To must be an array of emails' })
    @ArrayNotEmpty({ message: 'At least one recipient is required' })
    @IsEmail({}, { each: true, message: 'Each recipient email must be valid' })
    to!: string[]

    @IsNotEmpty({ message: 'Subject is required' })
    @IsString({ message: 'Subject must be a string' })
    subject!: string

    @IsNotEmpty({ message: 'Body is required' })
    @IsString({ message: 'Body must be a string' })
    body!: string
}

export class SendBulkGroupsEmailDTO {
    @IsArray({ message: 'Groups must be an array' })
    @ArrayNotEmpty({ message: 'Groups cannot be empty' })
    @ValidateNested({ each: true })
    groups!: EmailGroupDTO[]
}
