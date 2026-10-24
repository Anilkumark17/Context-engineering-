const {
  pgTable, serial, bigserial, bigint, integer, text, numeric, boolean, timestamp, index, check,
} = require('drizzle-orm/pg-core')
const { sql } = require('drizzle-orm')

const ts = (name) => timestamp(name, { withTimezone: true })

const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  phone: text('phone'),
  createdAt: ts('created_at').notNull().defaultNow(),
})

const products = pgTable('products', {
  id: serial('id').primaryKey(),
  sku: text('sku').notNull().unique(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  isReturnable: boolean('is_returnable').notNull().default(true),
})

const orders = pgTable(
  'orders',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    orderNumber: text('order_number').notNull().unique(),
    customerId: integer('customer_id').notNull().references(() => customers.id),
    status: text('status').notNull(),
    subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
    discountCode: text('discount_code'),
    discountPercent: numeric('discount_percent', { precision: 5, scale: 2 }).notNull().default('0'),
    discountAmount: numeric('discount_amount', { precision: 10, scale: 2 }).notNull().default('0'),
    shippingFee: numeric('shipping_fee', { precision: 10, scale: 2 }).notNull().default('0'),
    taxAmount: numeric('tax_amount', { precision: 10, scale: 2 }).notNull().default('0'),
    total: numeric('total', { precision: 10, scale: 2 }).notNull(),
    currency: text('currency').notNull().default('USD'),
    placedAt: ts('placed_at').notNull(),
    shipName: text('ship_name'),
    shipLine1: text('ship_line1'),
    shipCity: text('ship_city'),
    shipState: text('ship_state'),
    shipPostal: text('ship_postal'),
    shipCountry: text('ship_country'),
  },
  (t) => [
    index('idx_orders_customer_id').on(t.customerId),
    check(
      'orders_status_check',
      sql`${t.status} IN ('placed','paid','shipped','delivered','cancelled','returned')`,
    ),
  ],
)

const orderItems = pgTable(
  'order_items',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    orderId: bigint('order_id', { mode: 'number' })
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    productId: integer('product_id').notNull().references(() => products.id),
    sku: text('sku').notNull(),
    name: text('name').notNull(),
    qty: integer('qty').notNull(),
    unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
    lineTotal: numeric('line_total', { precision: 10, scale: 2 }).notNull(),
    opened: boolean('opened').notNull().default(false),
    damaged: boolean('damaged').notNull().default(false),
    warehouseNote: text('warehouse_note'),
  },
  (t) => [index('idx_order_items_order_id').on(t.orderId)],
)

const payments = pgTable(
  'payments',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    orderId: bigint('order_id', { mode: 'number' })
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    method: text('method').notNull(),
    last4: text('last4'),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    status: text('status').notNull(),
    paidAt: ts('paid_at'),
  },
  (t) => [
    index('idx_payments_order_id').on(t.orderId),
    check('payments_method_check', sql`${t.method} IN ('card','upi','paypal')`),
    check(
      'payments_status_check',
      sql`${t.status} IN ('pending','captured','refunded','partially_refunded')`,
    ),
  ],
)

const shipments = pgTable(
  'shipments',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    orderId: bigint('order_id', { mode: 'number' })
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    carrier: text('carrier').notNull(),
    trackingNumber: text('tracking_number').notNull(),
    status: text('status').notNull(),
    shippedAt: ts('shipped_at'),
    deliveredAt: ts('delivered_at'),
  },
  (t) => [
    index('idx_shipments_order_id').on(t.orderId),
    check(
      'shipments_status_check',
      sql`${t.status} IN ('label_created','in_transit','delivered','exception')`,
    ),
  ],
)

const shipmentEvents = pgTable(
  'shipment_events',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    shipmentId: bigint('shipment_id', { mode: 'number' })
      .notNull()
      .references(() => shipments.id, { onDelete: 'cascade' }),
    ts: ts('ts').notNull(),
    location: text('location'),
    description: text('description').notNull(),
  },
  (t) => [index('idx_shipment_events_shipment_id').on(t.shipmentId)],
)

module.exports = {
  customers, products, orders, orderItems, payments, shipments, shipmentEvents,
}
