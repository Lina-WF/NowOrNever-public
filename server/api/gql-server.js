import { ApolloServer } from '@apollo/server'

import { schema } from '../gql-logic/schema'
import { resolvers } from '../gql-logic/resolvers'

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
})

const serverStarted = server.start()

export default defineEventHandler(async (event) => {
  await serverStarted

  const body = await readBody(event)

  const response = await server.executeOperation(
    {
      query: body.query,
      variables: body.variables,
      operationName: body.operationName,
    },
    {
      contextValue: { event },
    },
  )

  return response.body.kind === 'single'
    ? response.body.singleResult
    : response.body
})
