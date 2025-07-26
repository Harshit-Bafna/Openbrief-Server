'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Roles', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true
            },
            role: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false
            },
            deletedAt: {
                type: Sequelize.DATE,
                allowNull: true
            }
        })

        await queryInterface.addIndex('Roles', ['role'], {
            name: 'role_index_roles',
            unique: true
        })
    },

    async down(queryInterface) {
        await queryInterface.removeIndex('Roles', 'role_index_roles')
        await queryInterface.dropTable('Roles')
    }
}
