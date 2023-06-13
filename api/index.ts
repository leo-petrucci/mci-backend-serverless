import { ApolloServer } from 'apollo-server-micro'
import { schema } from './_lib/schema'
import { createContext } from './_lib/context'
import { IncomingMessage, ServerResponse } from 'http'

export const ALLOWED_ORIGIN: string[] = process.env.ALLOWED_ORIGIN!.split(' ')

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
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  )
  const origin = req.headers.origin!
  console.log(origin)
  if (ALLOWED_ORIGIN.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  } else {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  return req.method === 'OPTIONS' ? res.end() : handler(req, res)
}
