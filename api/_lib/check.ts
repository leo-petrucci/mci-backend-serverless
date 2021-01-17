if (!process.env.DATABASE_URL) {
  throw new Error('No database connection string was found')
}
