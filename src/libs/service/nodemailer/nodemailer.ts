import nodemailer from 'nodemailer'
import { logger, mailLogger } from '../winston'
import { environment } from '../../utils/constants'
import { EmailAttachment } from '../../utils/enums'

const senderName: string = environment.SENDER_NAME
const senderHost: string = environment.SENDER_HOST
const senderPort: number = environment.SENDER_PORT
const isSenderSecure: boolean = environment.IS_SENDER_SECURE
const senderEmail: string = environment.SENDER_EMAIL
const senderEmailPassword: string = environment.SENDER_EMAIL_PASSWORD

const transporter = nodemailer.createTransport({
    host: senderHost,
    port: senderPort,
    secure: isSenderSecure,
    auth: {
        user: senderEmail,
        pass: senderEmailPassword
    }
})

export const sendEmail = async (to: string[], subject: string, html: string, attatchments: EmailAttachment[] = []) => {
    try {
        const info = await transporter.sendMail({
            from: `"${senderName}" <${senderEmail}>`,
            to: to,
            subject: subject,
            html: html,
            attachments: attatchments
        })

        mailLogger.info('EMAIL_SENT', {
            meta: {
                to: to.join(', '),
                subject: subject,
                attachments: attatchments.map((att) => att.filename).join(', ')
            }
        })
        return info
    } catch (error) {
        logger.error('EMAIL_SERVICE', {
            meta: error
        })
        throw new Error(`Error sending email: ${error as string}`)
    }
}
