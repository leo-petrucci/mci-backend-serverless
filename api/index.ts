import { ApolloServer } from 'apollo-server-micro'
import { schema } from './_lib/schema'
import { createContext } from './_lib/context'
import microCors from 'micro-cors'
import { IncomingMessage, ServerResponse } from 'http'

// export const ALLOWED_ORIGIN: string[] = process.env.ALLOWED_ORIGIN!.split(' ')
export const ALLOWED_ORIGIN: string[] = [
  'https://cs1v0.csb.app/',
  'https://78wd5.csb.app/',
]

// const cors = microCors({
//   allowCredentials: true,
//   origin: '*.csb.app',
// })

const server = new ApolloServer({
  schema,
  context: createContext,
  playground: true,
  introspection: true,
})

const handler = server.createHandler({
  path: '/api',
})

// This is important or cors will fail at preflight
export default (req: IncomingMessage, res: ServerResponse) => {
  const origin = req.headers.origin!
  if (ALLOWED_ORIGIN.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  return req.method === 'OPTIONS' ? res.end() : handler(req, res)
}
