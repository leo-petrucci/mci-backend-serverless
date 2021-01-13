import { intArg, makeSchema, nonNull, objectType, stringArg } from 'nexus'

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
    t.model.slots()
    t.model.cover()
  },
})
