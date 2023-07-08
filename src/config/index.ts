export default () => {
  const env = {
    appPort: process.env.APP_PORT || 6000,
    jwt: {
      secret: process.env.APP_JWT_SECRET,
    },
    mysql: {
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DBNAME,
    },
  };
  return { env };
};
