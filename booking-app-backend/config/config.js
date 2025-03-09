require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DB_USERNAME, // Exemple: postgres
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,       // Exemple: booking_app_db
    "host": process.env.DB_HOST,           // Exemple: your-db-host.render.com
    "port": process.env.DB_PORT || 5432,
    "dialect": "postgres",                 // Passage à Postgres
    "logging": false
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT || 5432,
    "dialect": "postgres",
    "logging": false
  }
};
