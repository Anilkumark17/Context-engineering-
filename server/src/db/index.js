require('dotenv/config')
const { neon } = require('@neondatabase/serverless')
const { drizzle } = require('drizzle-orm/neon-http')
const schema = require('./schema')

const db = drizzle(neon(process.env.DATABASE_URL), { schema })

module.exports = { db, ...schema }
