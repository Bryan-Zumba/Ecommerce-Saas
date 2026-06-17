import { Prisma, PrismaClient } from "@prisma/client";

export type DBClient = PrismaClient | Prisma.TransactionClient;