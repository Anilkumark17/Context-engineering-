---
title: Refund Policy
effective_date: 2026-01-01
supersedes: refund-2024
---

## Return window

Returns under the 2026 refund policy are accepted for 14 days after delivery. The 14 days are counted from the delivery date (shipments.delivered_at), and the delivery day itself is day 0, so an order is eligible when its days since delivery is 14 or fewer. A request made on day 15 or later is declined, except for damaged items.

## Restocking fee

A restocking fee of 10 percent of the refundable amount applies when any returned item has been opened (order_items.opened is true). Unopened items have no restocking fee. The fee is deducted from the refund.

## Refundable amount

The refundable amount is the item subtotal minus the discount amount, so a discount code reduces the refund proportionally. The original discount code is not reissued after a refund.

## Damaged or defective items

Items that are damaged or defective (order_items.damaged is true) are exempt from the restocking fee and from the 14 day return window. The customer must report the problem within 30 days of the delivery date (shipments.delivered_at) and include at least one photo. These items are refunded in full, including the original shipping fee.

## Shipping and tax

The original shipping fee is refunded only for damaged or defective items or when the store made an error. Tax is refunded proportionally to the refunded amount. For any other return the shipping fee is not refunded.

## Non returnable items

Non returnable products cannot be returned under the 2026 refund policy. A product is non returnable when it was marked that way at the time of purchase (products.is_returnable is false). The only exception is a product that is defective.

## Policy transition

The 2026 refund policy replaces the 2024 refund policy for every refund request made on or after 2026-01-01. The order date does not matter, so an order placed in 2025 is judged under the 2026 rules if the request is made in 2026.
