import 'dotenv/config';
import env from 'env-var';

export const ENV = {
    PORT: env.get('PORT').required().asPortNumber(),

    DATABASE: {
        URL: env.get('DATABASE_URL').required().asString(),
        HOST: env.get('MYSQL_HOST').required().asString(),
        PORT: env.get('MYSQL_PORT').required().asPortNumber(),
        USER: env.get('MYSQL_USER').required().asString(),
        PASSWORD: env.get('MYSQL_PASSWORD').required().asString(),
        NAME: env.get('MYSQL_DATABASE').required().asString(),
    },

    JWT: {
        SECRET: env.get('JWT_SECRET').required().asString(),
    },
};