// config/validateEnv.js
const requiredVars = [
    'DB_HOST',
    'DB_NAME',
    'DB_USERNAME',
    'DB_PASSWORD',
    'JWT_SECRET',
    'FLW_PUBLIC_KEY',
    'FLW_SECRET_KEY',
    'EMAIL_HOST',
    'EMAIL_PORT',
    'EMAIL_USER',
    'EMAIL_PASS',
    'BASE_URL'
    // Ajoutez d'autres variables obligatoires ici.
  ];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      console.error(`Erreur : La variable d’environnement ${varName} n’est pas définie.`);
      console.log('DB_HOST:', process.env.DB_HOST);  
      process.exit(1);
    }
  });
  