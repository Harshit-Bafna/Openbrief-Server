import dotenvFlow from 'dotenv-flow'
dotenvFlow.config()

export default {
    // General
    ENV: process.env.ENV,
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    SERVER_URL: process.env.SERVER_URL,
    CLIENT_URL: process.env.CLIENT_URL,

    // MongoDB
    MONGODB_URL: process.env.MONGODB_URL,

    // Postgre SQL
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT || '5432',
    DB_SSL: process.env.DB_SSL === 'true',

    // Nodemailer
    SENDER_NAME: process.env.SENDER_NAME as string,
    SENDER_HOST: process.env.SENDER_HOST as string,
    SENDER_PORT: process.env.SENDER_PORT ? parseInt(process.env.SENDER_PORT) : 200,
    IS_SENDER_SECURE: process.env.IS_SENDER_SECURE === 'true' ? true : false,
    SENDER_EMAIL: process.env.SENDER_EMAIL as string,
    SENDER_EMAIL_PASSWORD: process.env.SENDER_EMAIL_PASSWORD as string
}
