const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { eq } = require('drizzle-orm')
const { db, users } = require('../db')

const cookieOpts = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

const publicUser = ({ id, name, email }) => ({ id, name, email })

const sign = (res, user) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.cookie('token', token, cookieOpts)
}

const register = async (req, res) => {
  const { name, email, password } = req.body ?? {}
  if (!name || !email || !password || password.length < 6)
    return res.status(400).json({ message: 'Name, email and password (min 6 chars) required' })

  const [existing] = await db.select().from(users).where(eq(users.email, email.toLowerCase()))
  if (existing) return res.status(409).json({ message: 'Email already registered' })

  const passwordHash = await bcrypt.hash(password, 10)
  const [user] = await db
    .insert(users)
    .values({ name, email: email.toLowerCase(), passwordHash })
    .returning()
  sign(res, user)
  res.status(201).json({ user: publicUser(user) })
}

const login = async (req, res) => {
  const { email, password } = req.body ?? {}
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' })

  const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()))
  if (!user || !(await bcrypt.compare(password, user.passwordHash)))
    return res.status(401).json({ message: 'Invalid credentials' })

  sign(res, user)
  res.json({ user: publicUser(user) })
}

const logout = (req, res) => {
  res.clearCookie('token', { ...cookieOpts, maxAge: undefined })
  res.json({ message: 'Logged out' })
}

const me = async (req, res) => {
  const [user] = await db.select().from(users).where(eq(users.id, req.user.id))
  if (!user) return res.status(401).json({ message: 'User not found' })
  res.json({ user: publicUser(user) })
}

module.exports = { register, login, logout, me }
