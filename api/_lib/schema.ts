import { intArg, makeSchema, nonNull, objectType, stringArg } from 'nexus'
import { nexusPrisma } from 'nexus-plugin-prisma'
import path from 'path'
import { seedUsers } from './seed'

const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.email()
    t.model.posts({
      pagination: false,
    })
  },
})

const Post = objectType({
  name: 'Post',
  definition(t) {
    t.model.id()
    t.model.title()
    t.model.content()
    t.model.published()
    t.model.author()
    t.model.authorId()
  },
})

const Profile = objectType({
  name: 'Profile',
  definition(t) {
    t.model.id()
    t.model.bio()
    t.model.user()
    t.model.userId()
  },
})

const Server = objectType({
  name: 'Server',
  definition(t) {
    t.model.id()
    t.model.published()
    t.model.lastUpdated()
    t.model.createdAt()
    t.model.title()
    t.model.ip()
    t.model.content()
    t.model.slots()
    t.model.cover()
  },
})

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
  definition(t) {},
})

const generateArtifacts = Boolean(process.env.GENERATE_ARTIFACTS)

export const schema = makeSchema({
  types: [Query, Mutation, Server, Post, User, Profile],
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
