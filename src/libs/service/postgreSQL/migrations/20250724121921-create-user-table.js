'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: true
            },
            role: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Roles',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            lastLoginAt: {
                type: Sequelize.DATE,
                allowNull: true
            },
            isVerified: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            deletedAt: {
                type: Sequelize.DATE,
                allowNull: true
            }
        })

        await queryInterface.addIndex('Users', ['email'], {
            name: 'email_index_users',
            unique: true
        })

        await queryInterface.addIndex('Users', ['name'], {
            name: 'name_index_users'
        })
    },

    async down(queryInterface) {
        await queryInterface.removeIndex('Users', 'unique_email_users')
        await queryInterface.removeIndex('Users', 'index_name_users')
        await queryInterface.dropTable('Users')
    }
}
