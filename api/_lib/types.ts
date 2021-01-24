import { objectType } from 'nexus'

export const Status = objectType({
  name: 'Status',
  definition(t) {
    t.field('online', { type: 'Boolean' })
    t.field('db', { type: 'String' })
    t.field('origin', { type: 'String' })
    t.field('userClientID', { type: 'String' })
    t.field('userClientSecret', { type: 'String' })
    t.field('redirectUri', { type: 'String' })
  },
})
export const User = objectType({
  name: 'User',
  definition(t) {
    t.field('id', { type: 'Int' })
    t.field('username', { type: 'String' })
    t.field('email', { type: 'String' })
    t.field('role', { type: 'String' })
    t.field('banned', { type: 'Boolean' })
    t.field('photoUrl', { type: 'String' })
    t.field('Votes', { type: 'Vote' })
    t.field('Servers', { type: 'Server' })
  },
})

export const Tag = objectType({
  name: 'Tag',
  definition(t) {
    t.field('id', { type: 'Int' })
    t.field('tagName', { type: 'String' })
    t.field('Servers', { type: 'Server' })
    t.field('popularity', { type: 'Int' })
  },
})

export const UserPayload = objectType({
  name: 'UserPayload',
  definition(t) {
    t.field('user', { type: 'User' })
  },
})

export const Version = objectType({
  name: 'Version',
  definition(t) {
    t.field('id', { type: 'Int' })
    t.field('versionName', { type: 'String' })
    t.field('Servers', { type: 'Server' })
  },
})

export const Vote = objectType({
  name: 'Vote',
  definition(t) {
    t.field('id', { type: 'Int' })
    t.field('createdAt', { type: 'String' })
    t.field('author', { type: 'User' })
    t.field('server', { type: 'Server' })
  },
})

export const Outcome = objectType({
  name: 'Outcome',
  definition(t) {
    t.field('outcome', { type: 'String' })
  },
})

export const Server = objectType({
  name: 'Server',
  definition(t) {
    t.field('id', { type: 'Int' })
    t.field('published', { type: 'Boolean' })
    t.field('hasEditPrivileges', { type: 'Boolean' })
    t.field('createdAt', { type: 'String' })
    t.field('lastUpdated', { type: 'String' })
    t.field('title', { type: 'String' })
    t.field('ip', { type: 'String' })
    t.field('content', { type: 'String' })
    t.field('author', { type: 'User' })
    t.list.field('tags', { type: 'Tag' })
    t.field('version', { type: 'Version' })
    t.field('slots', { type: 'Int' })
    t.field('cover', { type: 'String' })
    t.field('votes', { type: 'Vote' })
    t.field('voteCount', { type: 'Int' })
    t.field('canVote', { type: 'Boolean' })
  },
})

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.field('user', { type: 'User' })
  },
})
