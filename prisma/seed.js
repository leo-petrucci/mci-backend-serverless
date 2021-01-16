const { PrismaClient } = require('@prisma/client')
const { versionData } = require('./seedData')
const { tagData } = require('./seedData')
const { voteData } = require('./seedData')
const { userData, serverData } = require('./seedData')

const prisma = new PrismaClient()

const tableNames = ['User', 'Server', 'Vote', 'Tag', 'Version']

const main = async () => {
  for (const tableName of tableNames) {
    await prisma.$queryRaw(`DELETE FROM "${tableName}";`)

    try {
      if (!['Store'].includes(tableName)) {
        await prisma.$queryRaw(
          `ALTER SEQUENCE "${tableName}_id_seq" RESTART WITH 1;`,
        )
      }
    } catch {
      console.log('not needed')
    }
  }

  for (const user of userData) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        photoUrl: user.photoUrl,
        posts: user.posts,
        banned: user.banned,
      },
    })
  }

  for (const tag of tagData) {
    await prisma.tag.create({
      data: {
        tagName: tag.tagName,
      },
    })
  }

  for (const version of versionData) {
    await prisma.version.create({
      data: {
        versionName: version.versionName,
      },
    })
  }

  for (const server of serverData) {
    await prisma.server.create({
      data: {
        title: server.title,
        content: server.content,
        published: server.published,
        createdAt: server.createdAt,
        cover: server.cover,
        slots: server.slots,
        ip: server.ip,
        author: { connect: { id: Number(server.authorId) } },
        tags: {
          connect: { tagName: server.tags.tagName },
        },
        version: {
          connect: { versionName: server.version.versionName },
        },
      },
    })
  }

  for (const vote of voteData) {
    await prisma.vote.create({
      data: {
        createdAt: vote.createdAt,
        author: { connect: { id: Number(vote.authorId) } },
        server: { connect: { id: Number(vote.serverId) } },
      },
    })
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
