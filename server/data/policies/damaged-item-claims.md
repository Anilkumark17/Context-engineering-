---
title: Damaged Item Claims Policy
effective_date: 2026-01-01
supersedes:
---

## Reporting window

A damaged or defective item must be reported within 30 days of delivery, counted from the delivery date (shipments.delivered_at) with the delivery day as day 0. A report made on day 31 or later is declined under this policy. The 14 day return window does not apply to damaged items, and faults that appear after day 30 are handled under the warranty policy.

## Evidence required

A damage claim needs the order number and at least 1 photo of the damaged item. Up to 5 photos are accepted. A photo of the outer packaging is helpful but not required.

## Decision time

The store decides every damage claim within 2 business days of receiving the report. The customer is told the decision by email. An approved claim cannot be reversed after the refund or replacement has been issued.

## Customer options

For an approved claim the customer chooses between a replacement and a full refund. A full refund is the refundable amount (orders.subtotal minus orders.discount_amount), the original shipping fee and the proportional tax (orders.shipping_fee, orders.tax_amount). No restocking fee applies, even if the item was opened (order_items.opened).

## Return of the damaged item

The store sends a free return label for a damaged item and the customer ships it back within 7 days. The store may waive the return when the item price is 20.00 or less (order_items.unit_price), and the customer may then keep the item. A waived return does not change the refund or replacement the customer receives.

## Multiple damaged items

When an order has more than one damaged item, each item is assessed separately within the same 2 business day decision time. Only the approved items are refunded or replaced, and the payment is marked partially refunded when part of the order is refunded (payments.status). Items that are not damaged follow the standard return rules.
