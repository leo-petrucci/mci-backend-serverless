require('dotenv').config()

if (process.env.DATABASE_URL === undefined) {
  throw new Error('No database connection string was found')
}
