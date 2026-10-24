# Policy Authoring Rules

Follow these rules whenever you add a policy document to this project.

## File location and naming

Policies live in `server/data/policies/`. The filename is `<topic>.md` or `<topic>-<year>.md`, lowercase, with words separated by hyphens only. No spaces, underscores or capitals.

The filename without `.md` is the policy slug. Use the slug everywhere: in the `supersedes` field and in source ids such as `policy:refund-2026`.

## Required frontmatter

Every policy starts with a frontmatter block that has exactly three fields.

- `title`: the human name of the policy. Versions of one topic share the same title.
- `effective_date`: the first day the policy applies, formatted `YYYY-MM-DD`.
- `supersedes`: the slug of the file this one replaces, or an empty string if it replaces nothing.

```
---
title: Refund Policy
effective_date: 2026-01-01
supersedes: refund-2025
---
```

## Versioning rule

A new version is a new file. Never edit or delete the old file. The new file sets `supersedes` to the old slug.

The retriever returns the newest effective version first and flags the older one as superseded. An `effective_date` in the future means the policy is not yet active.

## Section rules

Each `##` section is one retrievable unit of 2 to 4 sentences. It must be self contained: the first sentence names the topic, so the section makes sense without its neighbors.

Use concrete numbers and units. State exactly which database field starts a clock. Never refer to "the section above" or "the section below". Do not use dashes as punctuation.

## Data glossary

Write policy rules only in terms of the fields below, so every rule can be checked against data.

| Policy term | Source |
| --- | --- |
| Delivery date | `shipments.delivered_at` (date part) |
| Days since delivery | current date minus `delivered_at` date, delivery day is day 0, `getOrder` returns it as `days_since_delivery` |
| Dispatch date | `shipments.shipped_at` |
| Item opened | `order_items.opened` |
| Item damaged or defective | `order_items.damaged` |
| Non returnable product | `products.is_returnable` equals false |
| Discount | `orders.discount_code`, `discount_percent`, `discount_amount` |
| Refundable amount | `orders.subtotal` minus `orders.discount_amount` |
| Shipping and tax | `orders.shipping_fee`, `orders.tax_amount` |
| Order lifecycle | `orders.status`: placed, paid, shipped, delivered, cancelled, returned |
| Shipment state | `shipments.status`: label_created, in_transit, delivered, exception |
| Item price and quantity | `order_items.unit_price`, `order_items.qty`, `order_items.line_total` |
| Order total | `orders.total`, compared with `payments.amount` |
| Tracking number | `shipments.tracking_number` |
| Payment method | `payments.method`: card, upi, paypal |
| Payment state | `payments.status`: pending, captured, refunded, partially_refunded |

## New policy checklist

1. Pick the slug and the `effective_date`.
2. Write the frontmatter.
3. Write the sections using only fields from the glossary.
4. If the policy replaces an older one, set `supersedes`.
5. Run `node scripts/validatePolicies.js`.
6. Add a scenario to `tests/scenarios.json` if the policy changes an outcome.
