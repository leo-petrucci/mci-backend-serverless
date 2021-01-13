import { intArg, makeSchema, nonNull, objectType, stringArg } from 'nexus'
import { nexusPrisma } from 'nexus-plugin-prisma'
import path from 'path'
import { seedUsers } from './seed'
import { Server, VoteCast } from './types'

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.list.field('servers', {
      type: 'Server',
      resolve: (_, args, ctx) => {
        return ctx.prisma.server.findMany()
      },
    })
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('updateTitle', {
      type: 'Server',
      args: {
        id: nonNull(intArg()),
        title: nonNull(stringArg()),
      },
      resolve: async (_, { title, id }, ctx) => {
        return ctx.prisma.server.update({
          where: { id: id },
          data: {
            title,
          },
        })
      },
    })
  },
})

const generateArtifacts = Boolean(process.env.GENERATE_ARTIFACTS)

export const schema = makeSchema({
  types: [Server, VoteCast],
  plugins: [
    nexusPrisma({
      experimentalCRUD: true,
      shouldGenerateArtifacts: generateArtifacts,
      outputs: {
        typegen: path.join(__dirname, '/generated/prisma-nexus.ts'),
      },
    }),
  ],
  shouldGenerateArtifacts: generateArtifacts,
  outputs: {
    schema: path.join(__dirname, '/../../schema.graphql'),
    typegen: path.join(__dirname, '/generated/nexus.ts'),
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})
