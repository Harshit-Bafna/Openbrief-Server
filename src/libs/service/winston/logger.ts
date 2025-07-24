import { createLogger } from 'winston'
import { consoleTransport, MongoDBTransport } from './transport'

export const logger = createLogger({
    defaultMeta: {
        meta: {}
    },
    transports: [...MongoDBTransport(), ...consoleTransport()]
})

export const mailLogger = createLogger({
    defaultMeta: {
        meta: {}
    },
    transports: [...MongoDBTransport('mail-logs')]
})
