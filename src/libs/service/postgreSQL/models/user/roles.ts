import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../../sequelize'

interface RoleAttributes {
    id: string
    role: string
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}

type RoleCreationAttributes = Optional<RoleAttributes, 'id' | 'createdAt' | 'updatedAt'>

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
    public id!: string
    public role!: string
    public createdAt!: Date
    public updatedAt!: Date
    public deletedAt?: Date
}

Role.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
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
        sequelize: sequelize,
        tableName: 'Roles',
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                unique: true,
                fields: ['role'],
                name: 'role_index_roles'
            }
        ]
    }
)

export { Role }
