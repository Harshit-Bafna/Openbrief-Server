'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('PasswordReset', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            otp: {
                type: Sequelize.STRING,
                allowNull: false
            },
            isVerified: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            isUsed: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            expiresAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                allowNull: false
            },
            deletedAt: {
                type: Sequelize.DATE,
                allowNull: true
            }
        })
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('PasswordReset')
    }
}
