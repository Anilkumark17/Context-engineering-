---
title: Return Process Policy
effective_date: 2026-01-01
supersedes:
---

## Starting a return

A return is started from the customer's order page or through support, and the request must quote the order number. The request must be made while days since delivery is 14 or fewer, counted from the delivery date (shipments.delivered_at). Damaged or defective items follow the damaged item claims policy instead.

## Orders that can be returned

A return can be started only for an order whose status is delivered (orders.status). An order that is still placed, paid or shipped cannot be returned until it is delivered. A cancelled order has nothing to return and is refunded under the shipping policy.

## Return shipping

After a return is approved, the customer receives a return label by email and must ship the item back within 7 days of approval. The customer pays the return shipping cost unless the item is damaged or defective or the store made an error. If the label expires, the customer can request a new one once.

## Packaging and completeness

Returned items must include all accessories, manuals and free gifts that came with them. Original packaging is requested but not required. An incomplete return is held for 3 business days while the customer is contacted, and it is refused if the missing parts are not sent in that time.

## Inspection

Every returned item is inspected within 2 business days of arriving at the fulfillment center. Inspection checks whether the item was opened (order_items.opened) and whether it is damaged (order_items.damaged). The result decides whether the 10 percent restocking fee applies.

## Refund after inspection

The refund is issued within 2 business days after the item passes inspection, and it goes to the original payment method (payments.method). The refund amount is the refundable amount (orders.subtotal minus orders.discount_amount) minus any restocking fee. The payment is then marked refunded, or partially refunded when only part of the order was returned (payments.status).

## Rejected returns

A return is rejected when days since delivery is 15 or more, when the product is non returnable (products.is_returnable is false), or when the item shows damage caused by the customer. The customer is told the reason within 2 business days of inspection. A rejected item is sent back to the customer at no charge.
