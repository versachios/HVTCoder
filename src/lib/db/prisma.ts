import { PrismaClient, Prisma } from "../../generated/prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection pool.
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

declare global {
  // Allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (typeof window === "undefined") {
  // We are in a server environment
  if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
  } else {
    // In development, use a global variable to prevent multiple instances
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
  }
} else {
  // In the browser, we should not be using the PrismaClient directly
  // This is just to satisfy the type checker; the actual API routes will use the server-side client
  prisma = new PrismaClient();
}

export { prisma };