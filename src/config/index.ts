export default () => {
  const redisPass = process.env.REDIS_PASS;
  const redis = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    db: process.env.REDIS_DB || 0,
    ...(redisPass ? { password: redisPass } : {}),
  };
  const env = {
    appPort: process.env.APP_PORT || 6000,
    jwt: {
      secret: process.env.APP_JWT_SECRET,
    },
    redis,
    cache: {
      ...redis,
      ttl: 60000, // 默认缓存1分钟
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
