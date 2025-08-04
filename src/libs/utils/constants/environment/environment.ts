if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access
    require('dotenv-flow').config()
}

export default {
    // General
    ENV: process.env.ENV,
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 8000,
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
    DB_SSL: process.env.DB_SSL === 'true' ? true : false,

    // Resend
    RESEND_API_KEY: (process.env.RESEND_API_KEY as string) || '',

    // Nodemailer
    SENDER_NAME: process.env.SENDER_NAME as string,
    SENDER_HOST: process.env.SENDER_HOST as string,
    SENDER_PORT: process.env.SENDER_PORT ? parseInt(process.env.SENDER_PORT) : 200,
    IS_SENDER_SECURE: process.env.IS_SENDER_SECURE === 'true' ? true : false,
    SENDER_EMAIL: process.env.SENDER_EMAIL as string,
    SENDER_EMAIL_PASSWORD: process.env.SENDER_EMAIL_PASSWORD as string,

    // S3
    BUCKET_REGION: process.env.BUCKET_REGION as string,
    ACCESS_KEY: process.env.ACCESS_KEY as string,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY as string,
    BUCKET_NAME: process.env.BUCKET_NAME as string,
    SIGN_EXPIRY_TIME: process.env.SIGN_EXPIRY_TIME ? parseInt(process.env.SIGN_EXPIRY_TIME) : 3600,

    // JWT
    ACCESS_TOKEN: {
        SECRET: process.env.ACCESS_TOKEN_SECRET,
        EXPIRY: 60 * 60 // 1 hour,
    },
    REFRESH_TOKEN: {
        SECRET: process.env.REFRESH_TOKEN_SECRET,
        EXPIRY: 60 * 60 * 24 * 1, // 1 days
        RememberExpiry: 60 * 60 * 24 * 20 // 20 days
    }
}
