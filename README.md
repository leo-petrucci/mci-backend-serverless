# Important notes

## Set up Postgres

- `sudo -u postgres createuser <user>`
- `sudo -u postgres createdb <dbname>`
- First login into the CLI with `sudo -u postgres psql` then set password with `\password <user>`
- The connection string will look like `postgresql://<user>:<pass>@localhost:5432/<dbname>`

## Changing model

Changing model isn't enough to tell Prisma there's new data. The new tables have to either be added manually or by doing a migration. The process is:

- Add model to `schema.prisma`
- run `npx prisma migrate save --experimental`
- run `npx prisma migrate up --experimental`

## Viewing the data

You can easily access the data by running `npx prisma studio --experimental`

## Creating GraphQL types

Before any new `types` can be added to `/src/types/`, you should run `npm run generate`.

Make sure you import any new models in `/src/types/index.ts`.

Then run `npm run generate:nexus`

## Invision Oauth

Get an auth code from here:

`https://www.minecraftitalia.net/oauth/authorize/?client_id=92b7cfcd26fa40ec186e6a5a727208f7&redirect_uri=http://localhost:3000/redirect&response_type=code&scope=profile`

Then get a token by requesting:

```
  curl --location --request POST 'https://www.minecraftitalia.net/oauth/token/' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --header 'Cookie: ips4_IPSSessionFront=9sn7ua1s8q2u6raladr6qcocr0; ips4_guestTime=1600004402' \
  --data-urlencode 'client_id=92b7cfcd26fa40ec186e6a5a727208f7' \
  --data-urlencode 'grant_type=authorization_code' \
  --data-urlencode 'code=a8b8e39cd900634c9f0d6a1ef928dc66b9c53350394b4ebe752da8d5442b3f20' \
  --data-urlencode 'redirect_uri=http://localhost:3000/redirect' \
  --data-urlencode 'client_secret=e4832e0013ffa90ffd8fdabfb044f1d97f653a3314108452'
```

This will return a response like:

```
{
    "access_token": "92b7cfcd26fa40ec186e6a5a727208f7_372fd53445613e37a5d74f46f9a5d576d4bafc686008b7243d4a0e2e47323e8a",
    "token_type": "bearer",
    "expires_in": 604800,
    "refresh_token": "3837892c26d9195dc0daaa3d2aa75a94022fcacac169547d7d01902c316d6faa",
    "scope": "profile"
}
```

The access token is used to request information from the api, which we will just do once
