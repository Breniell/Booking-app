// server.js or db.js
const db = require('./models');

db.sequelize.sync({force: false})  //Set force to true to drop existing tables
  .then(() => {
    console.log('Database synced');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });
