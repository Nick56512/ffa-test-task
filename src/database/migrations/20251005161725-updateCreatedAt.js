'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('requests', 'createdAt', Sequelize.DATE)
    queryInterface.addColumn('requests', 'updatedAt', Sequelize.DATE)
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('requests', 'createdAt')
    queryInterface.removeColumn('requests', 'updatedAt')
  }
};
