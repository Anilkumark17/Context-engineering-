require('dotenv/config')
const fs = require('node:fs')
const path = require('node:path')
const { Pool, neonConfig } = require('@neondatabase/serverless')
neonConfig.webSocketConstructor = require('ws')

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Add it to server/.env and run again.')
  process.exit(1)
}

const DAY = 24 * 60 * 60 * 1000
const HOUR = 60 * 60 * 1000
const now = Date.now()
const daysAgo = (n) => new Date(now - n * DAY)
const money = (cents) => (cents / 100).toFixed(2)

const customers = [
  ['Priya Sharma', 'priya.sharma@example.com', 'Priya#2024', '+1-415-555-0134'],
  ['Marcus Johnson', 'marcus.johnson@example.com', 'Marcus$8821', '+1-312-555-0178'],
  ['Elena Rossi', 'elena.rossi@example.com', 'ElenaRossi!77', '+1-212-555-0192'],
  ['Daniel Kim', 'daniel.kim@example.com', 'Kim_Daniel_09', '+1-206-555-0147'],
  ['Aisha Khan', 'aisha.khan@example.com', 'Aisha.Khan.55', '+1-512-555-0163'],
  ['Tom Becker', 'tom.becker@example.com', 'BeckerTom#31', '+1-617-555-0120'],
]

const addresses = [
  ['Priya Sharma', '482 Valencia St', 'San Francisco', 'CA', '94103', 'US'],
  ['Marcus Johnson', '1200 N Dearborn St', 'Chicago', 'IL', '60610', 'US'],
  ['Elena Rossi', '77 Greene St', 'New York', 'NY', '10012', 'US'],
  ['Daniel Kim', '915 Pine St', 'Seattle', 'WA', '98101', 'US'],
  ['Aisha Khan', '2300 S Congress Ave', 'Austin', 'TX', '78704', 'US'],
  ['Tom Becker', '31 Beacon St', 'Boston', 'MA', '02108', 'US'],
]

// [sku, name, category, price, is_returnable]
const products = [
  ['AUD-001', 'Aurora Wireless Headphones', 'audio', 89.99],
  ['AUD-002', 'NoiseShield ANC Headphones', 'audio', 129.0],
  ['AUD-003', 'Pulse Wireless Earbuds', 'audio', 59.99],
  ['AUD-004', 'StudioMonitor Wired Headphones', 'audio', 79.0],
  ['AUD-005', 'Bassline Bluetooth Speaker', 'audio', 49.99],
  ['AUD-006', 'Echo Mini Speaker', 'audio', 29.99],
  ['AUD-007', 'Summit Soundbar', 'audio', 249.0],
  ['AUD-008', 'Clip Sport Earbuds', 'audio', 34.5],
  ['AUD-009', 'USB Podcast Microphone', 'audio', 99.0],
  ['AUD-010', 'Foam Ear Tips Set', 'audio', 8.99, false],
  ['KEY-001', 'Mechanical Keyboard TKL', 'keyboards', 149.0],
  ['KEY-002', 'Compact 60% Keyboard', 'keyboards', 99.0],
  ['KEY-003', 'Wireless Slim Keyboard', 'keyboards', 49.99],
  ['KEY-004', 'Ergonomic Split Keyboard', 'keyboards', 189.0],
  ['KEY-005', 'Numeric Keypad', 'keyboards', 19.99],
  ['KEY-006', 'Backlit Gaming Keyboard', 'keyboards', 69.0],
  ['KEY-007', 'PBT Keycap Set', 'keyboards', 24.99],
  ['KEY-008', 'Custom Engraved Keycap Set', 'keyboards', 34.99, false],
  ['MOU-001', 'Ergo Wireless Mouse', 'mice', 39.99],
  ['MOU-002', 'Precision Gaming Mouse', 'mice', 59.99],
  ['MOU-003', 'Vertical Ergonomic Mouse', 'mice', 44.0],
  ['MOU-004', 'Compact Travel Mouse', 'mice', 17.99],
  ['MOU-005', 'Trackball Mouse', 'mice', 64.0],
  ['MOU-006', 'Silent Click Mouse', 'mice', 24.99],
  ['MOU-007', 'XL Desk Mat', 'mice', 22.0],
  ['MOU-008', 'Mouse Bungee Cable Holder', 'mice', 9.99],
  ['CHG-001', 'GaN 100W Charger', 'chargers', 80.0],
  ['CHG-002', '65W USB-C Wall Charger', 'chargers', 39.0],
  ['CHG-003', '20W Fast Charger', 'chargers', 15.99],
  ['CHG-004', 'Wireless Charging Pad', 'chargers', 25.99],
  ['CHG-005', '3-in-1 Charging Stand', 'chargers', 54.0],
  ['CHG-006', 'Dual Port Car Charger', 'chargers', 14.5],
  ['CHG-007', '10000mAh Power Bank', 'chargers', 29.99],
  ['CHG-008', '20000mAh Power Bank', 'chargers', 49.0],
  ['CAB-001', 'USB-C to USB-C Cable 1m', 'cables', 9.99],
  ['CAB-002', 'USB-C to USB-C Cable 2m', 'cables', 12.99],
  ['CAB-003', 'Lightning Cable 1m', 'cables', 14.99],
  ['CAB-004', 'HDMI 2.1 Cable 2m', 'cables', 16.99],
  ['CAB-005', 'DisplayPort 1.4 Cable', 'cables', 18.99],
  ['CAB-006', 'Ethernet Cat6 Cable 5m', 'cables', 11.99],
  ['CAB-007', 'USB-A to Micro-USB Cable', 'cables', 6.99],
  ['CAB-008', 'Braided USB-C Cable 3m', 'cables', 15.49],
  ['CAB-009', '3.5mm Audio Cable', 'cables', 7.49],
  ['CAB-010', 'Cable Organizer Pack', 'cables', 5.99],
  ['BAG-001', 'Commuter Backpack', 'bags', 120.0],
  ['BAG-002', 'Laptop Sleeve 15in', 'bags', 29.99],
  ['BAG-003', 'Tech Organizer Pouch', 'bags', 19.99],
  ['BAG-004', 'Canvas Messenger Bag', 'bags', 79.0],
  ['BAG-005', 'Travel Duffel', 'bags', 94.0],
  ['BAG-006', 'Headphone Hard Case', 'bags', 21.99],
  ['ACC-001', 'Aluminum Laptop Stand', 'accessories', 45.0],
  ['ACC-002', 'Webcam Cover Pack', 'accessories', 5.49],
  ['ACC-003', 'Screen Cleaning Kit', 'accessories', 8.49],
  ['ACC-004', 'USB-C Hub 7-in-1', 'accessories', 59.0],
  ['ACC-005', 'Monitor Light Bar', 'accessories', 42.0],
  ['ACC-006', 'Adjustable Phone Stand', 'accessories', 12.99],
  ['ACC-007', 'Cable Clips Set', 'accessories', 6.49],
  ['ACC-008', 'Microfiber Cloth 3-Pack', 'accessories', 5.99],
  ['ACC-009', 'Webcam 1080p', 'accessories', 54.99],
  ['ACC-010', 'Laptop Cooling Pad', 'accessories', 35.0],
].map(([sku, name, category, price, returnable]) => ({
  sku,
  name,
  category,
  cents: Math.round(price * 100),
  returnable: returnable !== false,
}))

const warehouseNotes = [
  'Picked from bin A12',
  'Packed in poly bag',
  'Scanned at pack station',
  'Batch QC passed',
  'Sealed retail box intact',
  'Slotted in carton 2 of 3',
  'Barcode verified',
  'Stock rotated FIFO',
]

const carriers = [
  ['UPS', '1Z999AA1'],
  ['FedEx', '7489'],
  ['USPS', '9400'],
]

const routes = [
  ['Reno, NV', 'Salt Lake City, UT', 'Denver, CO', 'Kansas City, MO', 'Indianapolis, IN'],
  ['Louisville, KY', 'Columbus, OH', 'Pittsburgh, PA', 'Newark, NJ', 'Hartford, CT'],
]

const transitScans = [
  'Picked up by carrier',
  'Departed origin facility',
  'Arrived at sorting facility',
  'Departed sorting facility',
  'In transit to next facility',
  'Arrived at hub',
  'Departed hub',
]

function buildEvents({ count, startTs, endTs, delivered, route, destination }) {
  const events = []
  for (let i = 0; i < count; i++) {
    const frac = count === 1 ? 0 : i / (count - 1)
    const ts = new Date(startTs + (endTs - startTs) * frac)
    let description
    let location = route[Math.min(route.length - 1, Math.floor(frac * route.length))]
    if (i === 0) {
      description = 'Shipping label created'
      location = 'Fulfillment Center, Reno, NV'
    } else if (delivered && i === count - 1) {
      description = 'Delivered'
      location = destination
    } else if (delivered && count >= 4 && i === count - 2) {
      description = 'Out for delivery'
      location = destination
    } else {
      description = transitScans[(i - 1) % transitScans.length]
    }
    events.push({ ts, location, description })
  }
  return events
}

const byIndex = (indexes) => indexes.map((i) => products[i])
const bySku = (skus) => skus.map((s) => products.find((p) => p.sku === s))
const cheapest50 = [...products].sort((a, b) => a.cents - b.cents).slice(0, 50)

// customer is 1-based id, daysDelivered is days before now, shipGap/placeGap are day offsets
const orderDefs = [
  { num: '1001', customer: 1, status: 'delivered', delivered: 5, shipGap: 2, placeGap: 3, items: [[bySku(['AUD-001'])[0], 1]], events: 3, method: 'card' },
  { num: '1002', customer: 2, status: 'delivered', delivered: 20, shipGap: 3, placeGap: 2, items: [[bySku(['KEY-001'])[0], 1]], events: 4, method: 'paypal' },
  {
    num: '1003', customer: 3, status: 'delivered', delivered: 40, shipGap: 3, placeGap: 4,
    items: cheapest50.map((p, i) => [p, (i % 3) + 1]), notes: true, events: 40, method: 'card',
  },
  {
    num: '1004', customer: 1, status: 'delivered', delivered: 8, shipGap: 2, placeGap: 3,
    items: cheapest50.map((p, i) => [p, ((i * 2) % 3) + 1]), events: 40, method: 'upi',
  },
  { num: '1005', customer: 4, status: 'delivered', delivered: 3, shipGap: 2, placeGap: 2, items: [[bySku(['AUD-002'])[0], 1, { damaged: true }]], events: 4, method: 'card' },
  { num: '1006', customer: 5, status: 'shipped', transit: true, shippedAgo: 2, placeGap: 3, items: [[bySku(['MOU-001'])[0], 1]], events: 3, method: 'upi' },
  {
    num: '1007', customer: 6, status: 'delivered', delivered: 6, shipGap: 2, placeGap: 3,
    items: [[bySku(['BAG-001'])[0], 1, { opened: true }], [bySku(['CHG-001'])[0], 1]],
    code: 'SAVE15', pct: 15, events: 4, method: 'card',
  },
  {
    num: '1008', customer: 2, status: 'delivered', delivered: 12, shipGap: 3, placeGap: 2,
    items: [[bySku(['KEY-002'])[0], 1], [bySku(['MOU-002'])[0], 2]],
    code: 'WELCOME10', pct: 10, ship: 599, taxPct: 8, events: 5, method: 'paypal',
  },
  {
    num: '1009', customer: 5, status: 'paid', labelOnly: true, placedAgo: 1,
    items: [[bySku(['CHG-005'])[0], 1], [bySku(['CAB-002'])[0], 2], [bySku(['ACC-004'])[0], 1]],
    ship: 499, taxPct: 8, events: 1, method: 'card',
  },
  {
    num: '1010', customer: 6, status: 'cancelled', placedAgo: 9,
    items: [[bySku(['AUD-004'])[0], 1], [bySku(['ACC-001'])[0], 1], [bySku(['CAB-004'])[0], 2]],
    code: 'SAVE15', pct: 15, ship: 599, taxPct: 8, method: 'upi', refunded: true,
  },
]

function insertMany(client, table, columns, rows, returning) {
  const params = []
  const tuples = rows.map((row) => {
    const marks = row.map((v) => {
      params.push(v)
      return `$${params.length}`
    })
    return `(${marks.join(', ')})`
  })
  const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES ${tuples.join(', ')}${returning ? ` RETURNING ${returning}` : ''}`
  return client.query(sql, params)
}

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true },
  })
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'))

    const custRes = await insertMany(
      client,
      'customers',
      ['name', 'email', 'password', 'phone', 'created_at'],
      customers.map((c, i) => [...c, daysAgo(120 + i * 15)]),
      'id',
    )
    const customerIds = custRes.rows.map((r) => r.id)

    const prodRes = await insertMany(
      client,
      'products',
      ['sku', 'name', 'category', 'price', 'is_returnable'],
      products.map((p) => [p.sku, p.name, p.category, money(p.cents), p.returnable]),
      'id, sku',
    )
    const productIds = Object.fromEntries(prodRes.rows.map((r) => [r.sku, r.id]))

    const computed = orderDefs.map((d) => {
      const lines = d.items.map(([product, qty, flags = {}]) => ({
        product,
        qty,
        lineCents: product.cents * qty,
        opened: !!flags.opened,
        damaged: !!flags.damaged,
      }))
      const subtotal = lines.reduce((s, l) => s + l.lineCents, 0)
      const discount = Math.round((subtotal * (d.pct ?? 0)) / 100)
      const shipping = d.ship ?? 0
      const tax = d.taxPct ? Math.round(((subtotal - discount) * d.taxPct) / 100) : 0
      const total = subtotal - discount + shipping + tax

      let deliveredAt = null
      let shippedAt = null
      let placedAt
      if (d.transit) {
        shippedAt = daysAgo(d.shippedAgo)
        placedAt = daysAgo(d.shippedAgo + d.placeGap)
      } else if (d.delivered !== undefined) {
        deliveredAt = daysAgo(d.delivered)
        shippedAt = daysAgo(d.delivered + d.shipGap)
        placedAt = daysAgo(d.delivered + d.shipGap + d.placeGap)
      } else {
        placedAt = daysAgo(d.placedAgo)
      }
      return { d, lines, subtotal, discount, shipping, tax, total, deliveredAt, shippedAt, placedAt }
    })

    const orderRes = await insertMany(
      client,
      'orders',
      [
        'order_number', 'customer_id', 'status', 'subtotal', 'discount_code', 'discount_percent',
        'discount_amount', 'shipping_fee', 'tax_amount', 'total', 'currency', 'placed_at',
        'ship_name', 'ship_line1', 'ship_city', 'ship_state', 'ship_postal', 'ship_country',
      ],
      computed.map((o) => {
        const addr = addresses[o.d.customer - 1]
        return [
          o.d.num, customerIds[o.d.customer - 1], o.d.status, money(o.subtotal), o.d.code ?? null,
          (o.d.pct ?? 0).toFixed(2), money(o.discount), money(o.shipping), money(o.tax), money(o.total),
          'USD', o.placedAt, ...addr,
        ]
      }),
      'id, order_number',
    )
    const orderIds = Object.fromEntries(orderRes.rows.map((r) => [r.order_number, r.id]))

    const itemRows = []
    for (const o of computed) {
      o.lines.forEach((l, i) => {
        itemRows.push([
          orderIds[o.d.num], productIds[l.product.sku], l.product.sku, l.product.name, l.qty,
          money(l.product.cents), money(l.lineCents), l.opened, l.damaged,
          o.d.notes ? warehouseNotes[i % warehouseNotes.length] : null,
        ])
      })
    }
    await insertMany(
      client,
      'order_items',
      ['order_id', 'product_id', 'sku', 'name', 'qty', 'unit_price', 'line_total', 'opened', 'damaged', 'warehouse_note'],
      itemRows,
    )

    const methodLast4 = ['4242', '1881', '0005', '3782', '9010', '6611']
    await insertMany(
      client,
      'payments',
      ['order_id', 'method', 'last4', 'amount', 'status', 'paid_at'],
      computed.map((o, i) => [
        orderIds[o.d.num],
        o.d.method,
        o.d.method === 'card' ? methodLast4[i % methodLast4.length] : null,
        money(o.total),
        o.d.refunded ? 'refunded' : 'captured',
        new Date(o.placedAt.getTime() + 15 * 60 * 1000),
      ]),
    )

    const shipped = computed.filter((o) => o.d.status !== 'cancelled')
    const shipRes = await insertMany(
      client,
      'shipments',
      ['order_id', 'carrier', 'tracking_number', 'status', 'shipped_at', 'delivered_at'],
      shipped.map((o, i) => {
        const [carrier, prefix] = carriers[i % carriers.length]
        const status = o.deliveredAt ? 'delivered' : o.d.labelOnly ? 'label_created' : 'in_transit'
        return [
          orderIds[o.d.num], carrier, `${prefix}${String(100000000 + i * 7919).slice(0, 9)}`,
          status, o.shippedAt, o.deliveredAt,
        ]
      }),
      'id, order_id',
    )
    const shipmentIds = Object.fromEntries(shipRes.rows.map((r) => [String(r.order_id), r.id]))

    const eventRows = []
    shipped.forEach((o, i) => {
      const addr = addresses[o.d.customer - 1]
      const destination = `${addr[2]}, ${addr[3]}`
      let startTs
      let endTs
      if (o.deliveredAt) {
        startTs = o.shippedAt.getTime() - 4 * HOUR
        endTs = o.deliveredAt.getTime()
      } else if (o.d.labelOnly) {
        startTs = endTs = now - 12 * HOUR
      } else {
        startTs = o.shippedAt.getTime() - 4 * HOUR
        endTs = now - 6 * HOUR
      }
      buildEvents({
        count: o.d.events,
        startTs,
        endTs,
        delivered: !!o.deliveredAt,
        route: routes[i % routes.length],
        destination,
      }).forEach((e) => eventRows.push([shipmentIds[String(orderIds[o.d.num])], e.ts, e.location, e.description]))
    })
    await insertMany(client, 'shipment_events', ['shipment_id', 'ts', 'location', 'description'], eventRows)

    await client.query('COMMIT')

    for (const t of ['customers', 'products', 'orders', 'order_items', 'payments', 'shipments', 'shipment_events']) {
      const { rows } = await client.query(`SELECT COUNT(*)::int AS n FROM ${t}`)
      console.log(`${t.padEnd(16)} ${rows[0].n}`)
    }
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    throw err
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
