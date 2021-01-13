import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  // Uncomment for debugging purposes
  // log: ['query', 'info', 'warn'],
})

export interface Context {
  prisma: PrismaClient
  res: any
  req: any
}

// @ts-ignore
export function createContext({ request, response, ...rest }: Context) {
  return {
    req: request,
    res: response,
    prisma,
  }
}
