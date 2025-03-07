
'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Services', 'imageUrl', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '/assets/default-service.jpg'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Services', 'imageUrl');
  }
};
