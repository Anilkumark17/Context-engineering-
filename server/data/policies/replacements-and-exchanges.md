---
title: Replacements and Exchanges Policy
effective_date: 2026-01-01
supersedes:
---

## Replacement eligibility

A replacement is offered only for items that are damaged, defective or sent by mistake. The problem must be reported within 30 days of delivery, counted from the delivery date (shipments.delivered_at). For any other reason the customer can return the item for a refund but cannot request a replacement.

## Replacement dispatch

An approved replacement is dispatched within 3 business days of approval, and the clock starts on the approval date. Replacement shipping is at no cost to the customer. The customer receives a new tracking number by email when the replacement ships (shipments.tracking_number).

## One replacement per item

Each item in an order can be replaced once (order_items.qty counts units, and each unit can be replaced once). If the replacement is also damaged or defective, the customer receives a full refund instead of a second replacement. The refund is issued to the original payment method (payments.method).

## Out of stock replacements

If the item is out of stock when the replacement is approved, the store refunds the customer in full instead. The refund is issued within 2 business days of approval. The customer is told by email that the item is out of stock.

## Exchanges for a different product

The store does not exchange an item for a different product. To get a different product, the customer returns the item under the refund policy and places a new order. The refund and the new order are processed independently.

## Discounts on replacements

A replacement is the same product at the same price, so no new charge applies. The original discount code (orders.discount_code) stays applied to the order and is not reissued. If the replacement is later refunded, the refund follows the discount rules of the payments policy.
