export interface EmailAttachment {
    filename: string
    path?: string
    content?: Buffer | string
    contentType?: string
}
