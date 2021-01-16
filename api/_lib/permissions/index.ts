import { rule, shield, and, or, not } from 'graphql-shield'
import { createError, send } from 'micro'
import { getUserId } from '../utils'

const rules = {
  isAuthenticatedUser: rule()(async (parent, args, context) => {
    const userId = getUserId(context)
    const user = await context.prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    })
    if (user.banned) {
      context.res.status(401)
    }
    return Boolean(userId) && !user.banned
  }),
  isServerOwner: rule()(async (parent, { id }, context) => {
    // const userId = getUserId(context)
    // const author = await context.prisma.server
    //   .findUnique({
    //     where: {
    //       id: Number(id),
    //     },
    //   })
    //   .author()
    // if (userId !== author.id) {
    //   const user = await context.prisma.user.findUnique({
    //     where: {
    //       id: Number(userId),
    //     },
    //   })
    //   if (user.role === 'admin' || user.role === 'mod') {
    //   } else {
    //     context.res.statusCode = 500
    //     context.res.end()
    //     // context.res.setHeaders(401)
    //   }
    // }
    // context.res.statusCode = 500
    // context.res.end()
    return new Error('Custom error message from resolver.')
    // send(context.res, 500)
    // throw createError(500, 'Fuck')
    return false
  }),
  fromMod: rule()(async (parent, { id }, context) => {
    const userId = getUserId(context)
    const user = await context.prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    })
    return user.role === 'admin' || user.role === 'mod'
  }),
  fromAdmin: rule()(async (parent, { id }, context) => {
    const userId = getUserId(context)
    const user = await context.prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    })
    return user.role === 'admin'
  }),
  isMod: rule()(async (parent, { id }, context) => {
    const user = await context.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    })
    return user.role === 'admin' || user.role === 'mod'
  }),
  isAdmin: rule()(async (parent, { id }, context) => {
    const user = await context.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    })
    return user.role === 'admin'
  }),
}

// Being admin or mod takes precedence over being banned or not
export const permissions = shield({
  Query: {
    me: rules.isAuthenticatedUser,
    users: rules.fromMod,
  },
  Mutation: {
    // User Permissions
    updateRole: rules.fromAdmin,
    updateBan: and(rules.fromMod, not(rules.isMod), not(rules.isAdmin)),
    // Servers Permissions
    createServer: rules.isAuthenticatedUser,
    updateTitle: or(
      rules.fromMod,
      and(rules.isAuthenticatedUser, rules.isServerOwner),
    ),
    addTag: or(
      rules.fromMod,
      and(rules.isAuthenticatedUser, rules.isServerOwner),
    ),
    removeTag: or(
      rules.fromMod,
      and(rules.isAuthenticatedUser, rules.isServerOwner),
    ),
    updateCover: or(
      rules.fromMod,
      and(rules.isAuthenticatedUser, rules.isServerOwner),
    ),
    updateIp: or(
      rules.fromMod,
      and(rules.isAuthenticatedUser, rules.isServerOwner),
    ),
    updateRemoteInfo: or(
      rules.fromMod,
      and(rules.isAuthenticatedUser, rules.isServerOwner),
    ),
    deleteServer: or(
      rules.fromMod,
      and(rules.isAuthenticatedUser, rules.isServerOwner),
    ),
    vote: rules.isAuthenticatedUser,
    resetVotes: rules.fromAdmin,
  },
})
