import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../data/policies')
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort()
const slugs = new Set(files.map((f) => f.slice(0, -3)))

let failed = 0
const report = (file, check, ok, detail = '') => {
  if (!ok) failed++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${file}  ${check}${ok || !detail ? '' : `  (${detail})`}`)
}

function parse(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!m) return null
  const meta = {}
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':')
    if (i === -1) continue
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '')
  }
  return { meta, body: m[2] }
}

const supersedesByFile = {}

for (const file of files) {
  const slug = file.slice(0, -3)
  const text = fs.readFileSync(path.join(dir, file), 'utf8')

  report(file, 'filename is lowercase with hyphens', /^[a-z0-9]+(-[a-z0-9]+)*\.md$/.test(file))
  report(file, 'no em dash or en dash', !/[—–]/.test(text))

  const parsed = parse(text)
  report(file, 'frontmatter present', !!parsed)
  if (!parsed) continue
  const { meta, body } = parsed
  supersedesByFile[file] = meta.supersedes ?? ''

  report(file, 'title exists', !!meta.title)
  report(file, 'effective_date exists', !!meta.effective_date)
  const dateOk =
    /^\d{4}-\d{2}-\d{2}$/.test(meta.effective_date ?? '') &&
    !Number.isNaN(Date.parse(meta.effective_date))
  report(file, 'effective_date is YYYY-MM-DD', dateOk, meta.effective_date)

  const sup = meta.supersedes ?? ''
  report(file, 'supersedes is empty or an existing slug', sup === '' || (slugs.has(sup) && sup !== slug), sup)

  const sections = body.split(/^## /m).slice(1)
  report(file, '5 to 7 sections', sections.length >= 5 && sections.length <= 7, `${sections.length} sections`)

  const long = sections
    .map((s) => ({ name: s.split('\n')[0].trim(), len: s.split('\n').slice(1).join('\n').trim().length }))
    .filter((s) => s.len >= 700)
  report(file, 'each section body under 700 chars', long.length === 0, long.map((s) => `${s.name}: ${s.len}`).join(', '))
}

const withSupersedes = Object.entries(supersedesByFile).filter(([, v]) => v !== '').map(([f]) => f)
report(
  'all files',
  'refund-2026.md is the only file with a non empty supersedes',
  withSupersedes.length === 1 && withSupersedes[0] === 'refund-2026.md',
  withSupersedes.join(', ') || 'none',
)

process.exit(failed ? 1 : 0)
