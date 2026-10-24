const { pool, getOrder } = require('./index')

let failed = 0
const check = (label, ok, detail) => {
  if (!ok) failed++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${ok ? '' : `  (got ${detail})`}`)
}

async function count(sql, params = []) {
  const { rows } = await pool.query(sql, params)
  return rows[0].n
}

async function main() {
  const orders = await count('SELECT COUNT(*)::int AS n FROM orders')
  check('orders count is 10', orders === 10, orders)

  const items = await count(
    "SELECT COUNT(*)::int AS n FROM order_items oi JOIN orders o ON o.id = oi.order_id WHERE o.order_number = '1003'",
  )
  check('1003 has 50 order_items', items === 50, items)

  const events = await count(
    `SELECT COUNT(*)::int AS n FROM shipment_events se
       JOIN shipments s ON s.id = se.shipment_id
       JOIN orders o ON o.id = s.order_id
      WHERE o.order_number = '1003'`,
  )
  check('1003 has 40 shipment_events', events === 40, events)

  const o1002 = await getOrder('1002')
  check('1002 days_since_delivery is 20', o1002?.days_since_delivery === 20, o1002?.days_since_delivery)

  const o1006 = await getOrder('1006')
  check('1006 days_since_delivery is null', o1006?.days_since_delivery === null, o1006?.days_since_delivery)

  const o1007 = await getOrder('1007')
  check('1007 total is 170', o1007?.total === 170, o1007?.total)

  const missing = await getOrder('9999')
  check('9999 is undefined', missing === undefined, missing)

  const o1005 = await getOrder('1005')
  check('1005 any_damaged is true', o1005?.any_damaged === true, o1005?.any_damaged)
}

main()
  .catch((err) => {
    failed++
    console.error('FAIL  unexpected error:', err.message)
  })
  .finally(async () => {
    await pool.end()
    process.exit(failed ? 1 : 0)
  })
