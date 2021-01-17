require('dotenv').config()

console.log(process.env.DATABASE_URL)
console.log(process.env.APP_SECRET)

if (process.env.DATABASE_URL === undefined) {
  throw new Error('No database connection string was found')
}
