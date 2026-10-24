require('dotenv/config')
const { Pool, neonConfig } = require('@neondatabase/serverless')
neonConfig.webSocketConstructor = require('ws')

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Add it to server/.env')
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true },
})

async function readOnly(sql, params) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN READ ONLY')
    const { rows } = await client.query(sql, params)
    await client.query('COMMIT')
    return rows
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    throw err
  } finally {
    client.release()
  }
}

async function getOrder(orderNumber) {
  const rows = await readOnly(
    `SELECT o.order_number,
            o.status,
            c.name AS customer_name,
            c.email AS customer_email,
            o.subtotal::float8 AS subtotal,
            o.discount_code,
            o.discount_percent::float8 AS discount_percent,
            o.discount_amount::float8 AS discount_amount,
            o.total::float8 AS total,
            o.placed_at,
            s.delivered_at,
            (CURRENT_DATE - s.delivered_at::date) AS days_since_delivery,
            COALESCE(i.item_count, 0) AS item_count,
            COALESCE(i.any_opened, FALSE) AS any_opened,
            COALESCE(i.any_damaged, FALSE) AS any_damaged,
            p.status AS payment_status,
            s.status AS shipment_status
       FROM orders o
       JOIN customers c ON c.id = o.customer_id
       LEFT JOIN LATERAL (
         SELECT status, delivered_at FROM shipments
          WHERE order_id = o.id ORDER BY id DESC LIMIT 1
       ) s ON TRUE
       LEFT JOIN LATERAL (
         SELECT status FROM payments
          WHERE order_id = o.id ORDER BY id DESC LIMIT 1
       ) p ON TRUE
       LEFT JOIN LATERAL (
         SELECT COUNT(*)::int AS item_count,
                bool_or(opened) AS any_opened,
                bool_or(damaged) AS any_damaged
           FROM order_items WHERE order_id = o.id
       ) i ON TRUE
      WHERE o.order_number = $1`,
    [String(orderNumber)],
  )
  return rows[0]
}

async function getOrderItems(orderNumber, limit = 10) {
  return readOnly(
    `SELECT oi.*
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id
      WHERE o.order_number = $1
      ORDER BY oi.id
      LIMIT $2`,
    [String(orderNumber), limit],
  )
}

async function getShipmentEvents(orderNumber, limit = 10) {
  return readOnly(
    `SELECT se.*
       FROM shipment_events se
       JOIN shipments s ON s.id = se.shipment_id
       JOIN orders o ON o.id = s.order_id
      WHERE o.order_number = $1
      ORDER BY se.ts DESC, se.id DESC
      LIMIT $2`,
    [String(orderNumber), limit],
  )
}

module.exports = { pool, getOrder, getOrderItems, getShipmentEvents }
