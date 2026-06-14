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
});

const prisma = new PrismaClient({ adapter });

export { prisma };