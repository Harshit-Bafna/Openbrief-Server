import app from './app'
import { environment } from './libs/utils/constants'
import { MongoDBService } from './libs/service/mongoDB'
import { logger } from './libs/service/winston'
import { sequelize } from './libs/service/postgreSQL'

const server = app.listen(environment.PORT)

void (async () => {
    try {
        const mongoDbConnection = await MongoDBService.connect()
        logger.info(`MongoDB_CONNECTION`, {
            meta: {
                connectionName: mongoDbConnection.name
            }
        })

        await sequelize.authenticate()
        logger.info('POSTGRESQL_CONNECTED', {
            meta: {
                connectionName: environment.DB_NAME
            }
        })

        logger.info(`APPLICATION_STARTED`, {
            meta: {
                PORT: environment.PORT,
                SERVER_URL: environment.SERVER_URL
            }
        })
    } catch (error) {
        logger.error(`APPLICATION_ERROR`, { meta: error })
        server.close((err) => {
            if (err) {
                logger.error(`APPLICATION_ERROR`, { meta: err })
            }
            process.exit(1)
        })
    }
})()
