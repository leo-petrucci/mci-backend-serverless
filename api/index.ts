import { ApolloServer } from 'apollo-server-micro'
import { schema } from './_lib/schema'
import { createContext } from './_lib/context'
import microCors from 'micro-cors'
const cors = microCors({
  allowCredentials: true,
  origin: 'http://localhost:3000',
})

const server = new ApolloServer({
  schema,
  context: createContext,
  playground: true,
  introspection: true,
})

const handler = server.createHandler({
  path: '/',
})

// @ts-ignore
export default cors((req, res) => {
  console.log(res.statusCode)
  return handler(req, res)
}) // highlight-line
