import 'dotenv/config'

export const AGENT_MODEL = 'llama-3.3-70b-versatile'
export const SUMMARY_MODEL = 'llama-3.1-8b-instant'
export const TOKEN_LIMIT = 4000
export const COMPRESS_AT = 0.7
export const KEEP_RAW_TURNS = 2
export const MAX_STEPS = 6
export const TOP_K_TOOLS = 4
export const TOP_K_CHUNKS = 2
export const GROQ_RETRY_MAX = 2
export const GROQ_RETRY_DELAY_MS = 1500
export const PORT = Number(process.env.PORT) || 5000
export const CLIENT_ORIGIN = 'http://localhost:5173'
export const GROQ_API_KEY = process.env.GROQ_API

if (!GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not set. Add it to server/.env')
}
