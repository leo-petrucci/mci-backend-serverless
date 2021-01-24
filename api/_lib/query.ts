import { empty, sql } from '@prisma/client'
import { intArg, nonNull, nullable, queryType, stringArg } from 'nexus'
import { getDates, getUserId } from './utils'

export const Query = queryType({
  definition(t) {
    t.field('status', {
      type: 'Status',
      resolve: async (parent, args, ctx): Promise<any> => {
        const test = ctx.prisma.user.findUnique({
          where: {
            id: 6667,
          },
        })
        return {
          online: true,
          db: process.env.DATABASE_URL,
          origin: process.env.ALLOWED_ORIGIN,
          userClientID: process.env.USER_CLIENT_ID,
          userClientSecret: process.env.USER_CLIENT_SECRET,
          redirectUri: process.env.REDIRECT_URI,
        }
      },
    })

    t.field('me', {
      type: 'User',
      resolve: (parent, args, ctx): Promise<any> => {
        const userId = getUserId(ctx)
        return ctx.prisma.user.findUnique({
          where: {
            id: Number(userId),
          },
        })
      },
    })

    t.list.field('users', {
      type: 'User',
      resolve: (parent, args, ctx): Promise<any> => {
        return ctx.prisma.user.findMany()
      },
    })

    t.list.field('allServers', {
      type: 'Server',
      resolve: (parent, args, ctx): Promise<any> => {
        return ctx.prisma.server.findMany()
      },
    })

    t.list.field('feed', {
      type: 'Server',
      args: {
        date: nonNull(stringArg({ default: new Date().toISOString() })),
        page: nonNull(intArg({ default: 0 })),
        search: nullable(stringArg()),
      },
      resolve: async (parent, { date, page, search }, ctx) => {
        const pageLimit = 10
        const [d, f] = getDates(date)

        let userId
        try {
          userId = getUserId(ctx, true)
        } catch (error) {}

        let servers
        try {
          servers = await ctx.prisma.$queryRaw`
                SELECT DISTINCT
                    s.id
                ,   s.title
                ,   s.content
                ,   s.ip
                ,   s."lastUpdated"
                ,   s.cover
                ,   s.slots
                ,   s."createdAt"
                ,   a."author"::jsonb
                ,   ver."version"::jsonb
                ,   COALESCE(v."VOTES", 0) AS "voteCount" 
                ,   ${
                  userId
                    ? sql`CASE WHEN uv."serverId" IS NULL THEN 1 ELSE 0 END AS "canVote"`
                    : sql`0 AS "canVote"`
                }
                ,   tag."tags"::jsonb
                FROM "Server" AS s
                    -- Get tags
                    INNER JOIN
                    (
                        SELECT
                            st."A"
                        ,   json_agg(
                                json_build_object(
                                    'id', 
                                    t.id, 
                                    'tagName', 
                                    t."tagName"
                                )
                            ) as "tags"
                        FROM
                            "_ServerToTag" AS st
                        INNER JOIN
                            "Tag" AS t
                        ON
                            t.id = st."B"
                        GROUP BY
                            st."A"
                    ) AS tag
                    ON
                        tag."A" = s.id
                    -- Build the version objects
                    INNER JOIN
                    (
                        SELECT
                            id
                        ,   json_build_object(
                                'id', v.id,
                                'versionName', v."versionName"
                            ) AS "version"
                        FROM
                            "Version" as v
                    ) AS ver
                    ON
                        ver.id = s."versionId"
                    -- Build the author objects
                    INNER JOIN
                    (
                        SELECT
                            id
                        ,   json_build_object(
                                'username', u.username,
                                'id', u.id,
                                'photoUrl', u."photoUrl"
                            ) AS "author"
                        FROM
                            "User" as u
                    ) AS a
                    ON
                        a.id = s."authorId"
                    -- Count all the votes
                    LEFT JOIN 
                    (
                        SELECT
                            "serverId"
                        ,   COUNT(DISTINCT v."authorId") AS "VOTES" 
                        FROM 
                            "Vote" as v 
                        WHERE 
                            v."createdAt" >= ${d} AND 
                            v."createdAt" < ${f} 
                        GROUP BY "serverId"
                    ) as v 
                    ON 
                        s.id = v."serverId"
                    ${
                      userId
                        ? sql`-- Get the current user's votes in this period
                        LEFT JOIN
                        (
                            SELECT DISTINCT
                                "serverId"
                            FROM
                                "Vote"
                            WHERE
                                "createdAt" >= ${d}
                            AND
                                "createdAt" <  ${f}
                            AND
                                "authorId" = ${userId}
                        ) AS uv
                        ON
                            v."serverId" = s.id`
                        : empty
                    }
                ${
                  search
                    ? sql`
                    WHERE lower(s.title) LIKE ${
                      '%' + search.toString().toLowerCase() + '%'
                    } OR lower(s.content) LIKE ${
                        '%' + search.toString().toLowerCase() + '%'
                      }`
                    : empty
                }
                ORDER BY
                    "voteCount" DESC, s."lastUpdated" DESC
                OFFSET ${
                  page > pageLimit ? pageLimit * 15 : page * 15
                } LIMIT 15;
            `
        } catch (err) {
          return new Error(err)
        }
        return servers
      },
    })

    t.list.field('feedByTag', {
      type: 'Server',
      args: {
        date: nonNull(stringArg({ default: new Date().toISOString() })),
        page: nonNull(intArg({ default: 0 })),
        tag: nonNull(stringArg()),
      },
      resolve: async (parent, { date, page, tag }, ctx) => {
        const pageLimit = 10
        const [d, f] = getDates(date)

        let userId
        try {
          userId = getUserId(ctx, true)
        } catch (error) {}

        let servers
        try {
          servers = await ctx.prisma.$queryRaw`
                SELECT DISTINCT
                    server.id
                ,   server.title
                ,   server.content
                ,   server.ip
                ,   server."lastUpdated"
                ,   server.cover
                ,   server.slots
                ,   server."createdAt"
                ,   a."author"::jsonb
                ,   ver."version"::jsonb
                ,   COALESCE(v."VOTES", 0) AS "voteCount" 
                ,   ${
                  userId
                    ? sql`CASE WHEN uv."serverId" IS NULL THEN 1 ELSE 0 END AS "canVote"`
                    : sql`0 AS "canVote"`
                }
                ,   tag."tags"::jsonb
                FROM "Tag" AS t
                    -- Create server object
                    INNER JOIN
                    (
                        SELECT DISTINCT
                            st."B"
                        ,   s.id
                        ,   s.title
                        ,   s.content
                        ,   s.ip
                        ,   s."lastUpdated"
                        ,   s.cover
                        ,   s.slots
                        ,   s."createdAt"
                        ,   s."versionId"
                        ,   s."authorId"
                        FROM
                            "_ServerToTag" AS st
                        INNER JOIN
                            "Server" AS s
                        ON
                            s.id = st."A"
                    ) AS server
                    ON
                        server."B" = t.id
                
                    -- Get tags
                    INNER JOIN
                    (
                        SELECT
                            st."A"
                        ,   json_agg(
                                json_build_object(
                                    'id', 
                                    t.id, 
                                    'tagName', 
                                    t."tagName"
                                )
                            ) as "tags"
                        FROM
                            "_ServerToTag" AS st
                        INNER JOIN
                            "Tag" AS t
                        ON
                            t.id = st."B"
                        GROUP BY
                            st."A"
                    ) AS tag
                    ON
                        tag."A" = server.id
                    -- Build the version objects
                    INNER JOIN
                    (
                        SELECT
                            id
                        ,   json_build_object(
                                'id', v.id,
                                'versionName', v."versionName"
                            ) AS "version"
                        FROM
                            "Version" as v
                    ) AS ver
                    ON
                        ver.id = server."versionId"
                    -- Build the author objects
                    INNER JOIN
                    (
                        SELECT
                            id
                        ,   json_build_object(
                                'username', u.username,
                                'id', u.id,
                                'photoUrl', u."photoUrl"
                            ) AS "author"
                        FROM
                            "User" as u
                    ) AS a
                    ON
                        a.id = server."authorId"
                    -- Count all the votes
                    LEFT JOIN 
                    (
                        SELECT
                            "serverId"
                        ,   COUNT(DISTINCT v."authorId") AS "VOTES" 
                        FROM 
                            "Vote" as v 
                        WHERE 
                            v."createdAt" >= ${d} AND 
                            v."createdAt" < ${f} 
                        GROUP BY "serverId"
                    ) as v 
                    ON 
                        server.id = v."serverId"
                    ${
                      userId
                        ? sql`-- Get the current user's votes in this period
                        LEFT JOIN
                        (
                            SELECT DISTINCT
                                "serverId"
                            FROM
                                "Vote"
                            WHERE
                                "createdAt" >= ${d}
                            AND
                                "createdAt" <  ${f}
                            AND
                                "authorId" = ${userId}
                        ) AS uv
                        ON
                            v."serverId" = server.id`
                        : empty
                    }
                WHERE
                    t."tagName" LIKE ${tag}
                ORDER BY
                    "voteCount" DESC, server."lastUpdated" DESC
                OFFSET ${
                  page > pageLimit ? pageLimit * 15 : page * 15
                } LIMIT 15;
            `
        } catch (err) {
          return new Error(err)
        }
        return servers
      },
    })

    t.field('server', {
      type: 'Server',
      args: {
        id: nullable(intArg()),
        date: nonNull(stringArg({ default: new Date().toISOString() })),
      },
      resolve: async (parent, { id, date }, ctx) => {
        const [d, f] = getDates(date)

        let userId
        try {
          userId = getUserId(ctx, true)
        } catch (error) {}

        let server
        try {
          server = await ctx.prisma.$queryRaw`
            SELECT 
                s.id
            ,   s.title
            ,   s.content
            ,   s.cover
            ,   s."lastUpdated"
            ,   s.ip
            ,   s.slots
            ,   s."createdAt"
            ,   a."author"::jsonb
            ,   ver."version"::jsonb
            ,   COALESCE(v."VOTES", 0) AS "voteCount"
            ,   ${
              userId
                ? sql`CASE WHEN uv."serverId" IS NULL THEN 1 ELSE 0 END AS "canVote"`
                : sql`0 AS "canVote"`
            } 
            ,   tag."tags"::jsonb
            FROM "Server" AS s
                -- Get tags
                INNER JOIN
                (
                    SELECT
                        st."A"
                    ,   COUNT(*) AS "TAGS"  
                    ,   json_agg(
                            json_build_object(
                                'id', 
                                t.id, 
                                'tagName', 
                                t."tagName"
                            )
                        ) as "tags"
                    FROM
                        "_ServerToTag" AS st
                    INNER JOIN
                        "Tag" AS t
                    ON
                        t.id = st."B"
                    GROUP BY
                        st."A"
                ) AS tag
                ON
                    tag."A" = s.id
                -- Build the version objects
                INNER JOIN
                (
                    SELECT
                        id
                    ,   json_build_object(
                            'id', v.id,
                            'versionName', v."versionName"
                        ) AS "version"
                    FROM
                        "Version" as v
                ) AS ver
                ON
                    ver.id = s."versionId"
                -- Build the author objects
                INNER JOIN
                (
                    SELECT
                        id
                    ,   json_build_object(
                            'username', u.username,
                            'id', u.id,
                            'photoUrl', u."photoUrl"
                        ) AS "author"
                    FROM
                        "User" as u
                ) AS a
                ON
                    a.id = s."authorId"
                -- Count up all the votes
                LEFT JOIN 
                (
                    SELECT 
                        "serverId"
                    ,   COUNT(*) AS "VOTES" 
                    FROM 
                        "Vote" as v 
                    WHERE 
                        v."createdAt" >= ${d} AND 
                        v."createdAt" < ${f} 
                    GROUP BY "serverId"
                ) as v 
                ON 
                    s.id = v."serverId"
                ${
                  userId
                    ? sql`
                -- Get the current user's votes in this period
                LEFT JOIN
                (
                    SELECT
                        "serverId"
                    FROM
                        "Vote"
                    WHERE
                        "createdAt" >= ${d}
                    AND
                        "createdAt" < ${f}
                    AND
                        "authorId" = ${userId}
                ) AS uv
                ON
                    v."serverId" = s.id`
                    : empty
                }
                WHERE 
                    s.id = ${id}
                LIMIT 1;
                `
        } catch (err) {
          return new Error(err)
        }
        return server[0]
      },
    })

    t.list.field('searchTags', {
      type: 'Tag',
      args: {
        searchString: nonNull(stringArg()),
      },
      resolve: async (parent, { searchString }, ctx) => {
        return await ctx.prisma.$queryRaw`
                SELECT 
                    t.id
                ,   t."tagName"
                ,   COALESCE(tag."TAGS", 0) AS popularity
                FROM 
                    "Tag" as t 
                INNER JOIN
                (
                    SELECT
                        st."B"
                    ,   COUNT(*) AS "TAGS"    
                    FROM
                        "_ServerToTag" AS st
                    INNER JOIN
                        "Server" AS s
                    ON
                        s.id = st."A"
                    GROUP BY
                        st."B"
                ) AS tag
                ON
                    tag."B" = t.id
                WHERE 
                    t."tagName" 
                LIKE 
                    ${'%' + searchString + '%'}
                ORDER BY
                    popularity DESC
                LIMIT 
                    10
                ;
            `
      },
    })
  },
})
