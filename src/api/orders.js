/**
 * src/api/orders.js
 * ─────────────────────────────────────────────────────────────────────
 * Guest/customer-facing order calls. createOrder works with or without
 * a customer token present — guest checkout is the default path and
 * must never be gated by login.
 * ─────────────────────────────────────────────────────────────────────
 */

import { customerHttp } from './httpClient'

const { request } = customerHttp

export const createOrder = (body) =>
  request('/orders', { method: 'POST', body: JSON.stringify(body) })

export const getOrder = (orderNumber, contact) =>
  request(`/orders/${encodeURIComponent(orderNumber)}?contact=${encodeURIComponent(contact)}`)

export const getMyOrders = () => request('/account/orders')
