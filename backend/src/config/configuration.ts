export default () => ({
  app: {
    port: +process.env.APP_PORT!,
  },
  security: {
    jwt: {
      access: {
        secret: process.env.SECURITY_JWT_ACCESS_SECRET,
        expiration: process.env.SECURITY_JWT_ACCESS_EXPIRATION,
      },
      refresh: {
        secret: process.env.SECURITY_JWT_REFRESH_SECRET,
        expiration: process.env.SECURITY_JWT_REFRESH_EXPIRATION,
      },
    },
  },
});
