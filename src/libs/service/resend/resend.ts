import { Resend } from 'resend'
import { logger, mailLogger } from '../winston'
import { environment } from '../../utils/constants'

const resend = new Resend(environment.RESEND_API_KEY)

export const sendEmail = async (to: string[], subject: string, html: string) => {
    try {
        const from = `"${environment.SENDER_NAME}" <${environment.SENDER_EMAIL}>`

        const { data, error } = await resend.emails.send({
            from,
            to,
            subject,
            html
        })

        if (error) {
            throw error as Error
        }

        mailLogger.info('EMAIL_SENT', {
            meta: {
                to: to.join(', '),
                subject
            }
        })

        return data
    } catch (error) {
        logger.error('EMAIL_SERVICE', { meta: error })
        throw new Error(`Error sending email: ${String(error)}`)
    }
}
