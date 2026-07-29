/**
 * src/components/seo/Seo.jsx
 * ─────────────────────────────────────────────────────────────────────
 * Route-level <head> tags via react-helmet-async, defaulting to the
 * same copy already in index.html so pages that don't override
 * anything (e.g. the homepage) render identically to today.
 *
 * Caveat worth knowing: this updates the real DOM <head> and is picked
 * up by Googlebot (which executes JS) for indexing/snippets, but NOT
 * by link-preview crawlers (WhatsApp, Facebook, Twitter/X) — those
 * fetch raw HTML only and never run JS, so a shared /accessories/:slug
 * link will only ever show index.html's static, generic tags in a
 * chat preview. Fixing that needs prerendering or a crawler-user-agent
 * middleware — out of scope here, just flagging it.
 * ─────────────────────────────────────────────────────────────────────
 */
import React from 'react'
import { Helmet } from 'react-helmet-async'

export const SITE_NAME = 'novaXchange'
export const SITE_URL = 'https://novaxchange.xyz'
const DEFAULT_TITLE = 'novaXchange — Trade In & Upgrade Your Laptop in Uganda'
const DEFAULT_DESCRIPTION =
  "Uganda's first tech platform. Trade in your old laptop, buy genuine accessories, and upgrade affordably. Campus delivery in Kampala."
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  jsonLd,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE
  const url = `${SITE_URL}${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  )
}
