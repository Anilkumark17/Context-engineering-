---
title: Shipping Policy
effective_date: 2025-06-01
supersedes:
---

## Delivery times

Standard delivery takes 2 to 5 business days from the dispatch date (shipments.shipped_at). Express delivery takes 1 to 2 business days from the same dispatch date.

## Shipment status meanings

Shipment statuses (shipments.status) have fixed meanings. Label created means the carrier has not yet received the parcel, and in transit means the parcel is moving. Delivered means the parcel reached the address, and exception means there is a delivery problem.

## Cancellation

An order can be cancelled only while its status is placed or paid (orders.status). Once a shipment has a dispatch date (shipments.shipped_at), cancellation is not possible and the customer should return the item after delivery. A cancelled order is refunded in full to the original payment method.

## Address changes

Address changes are allowed only before dispatch. Once the shipment has a dispatch date (shipments.shipped_at), the delivery address cannot be changed.

## Lost packages

A customer may file a lost package claim when a shipment is still in transit or in exception 10 days after its dispatch date (shipments.shipped_at). After the claim is approved, the store sends a replacement or a full refund including shipping within 3 business days.

## Order tracking

Every shipment has a tracking number (shipments.tracking_number) that is emailed to the customer on the dispatch date. Tracking events are shown newest first and usually update within 24 hours of a carrier scan. A shipment with status label created has no scans yet, so the customer should wait until it moves to in transit.

## Delivery exceptions

After a failed delivery attempt the carrier holds the parcel for 7 days before returning it to the store. A parcel that is returned to the store is refunded in full.
