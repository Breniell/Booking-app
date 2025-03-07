'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Services', 'videoPlatform', {
      type: Sequelize.STRING,
      allowNull: true,  // Si vous voulez que ce champ soit optionnel
      after: 'price'    // Optionnel, pour placer la colonne après "price"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Services', 'videoPlatform');

  }
};

