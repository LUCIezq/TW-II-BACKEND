import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { ENV } from "../config/env";
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaMariaDb({
    host: ENV.DATABASE.HOST,
    user: ENV.DATABASE.USER,
    password: ENV.DATABASE.PASSWORD,
    database: ENV.DATABASE.NAME,
    connectionLimit: 5,
    // MySQL 8 usa caching_sha2_password por defecto: sin esto, el driver
    // se queda esperando la clave RSA del servidor hasta hacer timeout.
    allowPublicKeyRetrieval: true,
});

const prisma = new PrismaClient({ adapter });

export { prisma };