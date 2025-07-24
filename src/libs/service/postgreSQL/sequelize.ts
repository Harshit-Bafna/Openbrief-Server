import { Sequelize } from 'sequelize'
import { environment } from '../../utils/constants'

export const sequelize = new Sequelize(environment.DB_NAME || '', environment.DB_USER || '', environment.DB_PASSWORD || '', {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: parseInt(environment.DB_PORT || '5432', 10),
    dialectOptions: environment.DB_SSL
        ? {
              ssl: {
                  require: environment.DB_SSL,
                  rejectUnauthorized: false
              }
          }
        : {},
    logging: false
})
