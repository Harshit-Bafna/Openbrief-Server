import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../../sequelize'
import { Role } from './roles'
import { UserAttributes } from '../../../../utils/types'

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'password' | 'isActive'>

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string
    public name!: string
    public email!: string
    public password!: string
    public role!: string
    public isActive!: boolean
    public isVerified!: boolean
    public lastLoginAt?: Date
    public roleDetails?: Role
    public createdAt!: Date
    public updatedAt!: Date
    public deletedAt?: Date
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Role,
                key: 'id'
            }
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        lastLoginAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        sequelize,
        tableName: 'Users',
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                unique: true,
                fields: ['email'],
                name: 'email_index_users'
            },
            {
                fields: ['name'],
                name: 'name_index_users'
            },
            {
                fields: ['deviceFingerPrint'],
                name: 'device_fingerprint_index_users'
            }
        ]
    }
)

User.belongsTo(Role, { foreignKey: 'role', as: 'roleDetails' })
Role.hasMany(User, { foreignKey: 'role', as: 'users' })

export { User }
