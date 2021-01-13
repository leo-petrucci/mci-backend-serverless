import { objectType } from 'nexus'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.username()
    t.model.email()
    t.model.role()
    t.model.banned()
    t.model.photoUrl()
    t.model.Votes()
    t.model.Servers()
  },
})

export const Tag = objectType({
  name: 'Tag',
  definition(t) {
    t.model.id()
    t.model.tagName()
    t.model.Servers()
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
    t.model.id()
    t.model.versionName()
    t.model.Servers()
  },
})

export const Vote = objectType({
  name: 'Vote',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.author()
    t.model.server()
  },
})

export const VoteCast = objectType({
  name: 'VoteCast',
  definition(t) {
    t.field('outcome', { type: 'String' })
  },
})

export const ServerPayload = objectType({
  name: 'ServerPayload',
  definition(t) {
    t.field('id', { type: 'Int' })
    t.field('published', { type: 'Boolean' })
    t.field('createdAt', { type: 'String' })
    t.field('title', { type: 'String' })
    t.field('content', { type: 'String' })
    t.field('author', { type: 'Int' })
    t.field('tags', { type: 'Tag' })
    t.field('version', { type: 'Version' })
    t.field('slots', { type: 'Int' })
    t.field('cover', { type: 'String' })
  },
})

export const Server = objectType({
  name: 'Server',
  definition(t) {
    t.model.id()
    t.model.published()
    t.model.lastUpdated()
    t.model.createdAt()
    t.model.title()
    t.model.ip()
    t.model.content()
    t.model.author()
    t.model.tags()
    t.model.version()
    t.model.slots()
    t.model.cover()
    t.model.votes()
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
