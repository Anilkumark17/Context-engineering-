---
title: Order Issues Policy
effective_date: 2025-06-01
supersedes:
---

## Wrong item delivered

A wrong item delivered must be reported within 7 days of the delivery date (shipments.delivered_at). The store then ships the correct item or refunds the order line in full, as the customer chooses. The store pays for return shipping and refunds the original shipping fee because a wrong item is a seller error.

## Missing items

An order with a missing item must be reported within 7 days of the delivery date (shipments.delivered_at). The store compares the parcel with the order lines (order_items.qty) and either sends the missing quantity or refunds it. A refund for a missing item covers the item price only and does not include the shipping fee unless every item is missing.

## Tampered or empty packages

A package that arrives opened, tampered with or empty must be reported within 2 days of the delivery date (shipments.delivered_at) with at least 1 photo of the package. The store investigates with the carrier for up to 5 business days. The customer then receives a full refund including shipping or a replacement.

## Delivered but not received

When a shipment is marked delivered (shipments.status) but the customer did not receive it, the customer must report it within 3 days of the delivery date. The store investigates with the carrier for up to 5 business days. If the parcel is not found, the customer receives a replacement or a full refund including shipping.

## Billing errors

A billing error exists when the amount charged (payments.amount) differs from the order total (orders.total). The customer should report the difference within 30 days of the order being placed. After verification, the store refunds the difference to the original payment method within 3 business days.

## Seller errors

A seller error is a wrong item, a missing item, an extra charge or a damaged item that was packed in a damaged state by the warehouse. For a seller error the store refunds the original shipping fee (orders.shipping_fee) and pays return shipping. Seller errors are never subject to the restocking fee.
