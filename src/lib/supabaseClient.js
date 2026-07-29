/**
 * src/lib/supabaseClient.js
 * ─────────────────────────────────────────────────────────────────────
 * Supabase is used only to broker the Google OAuth handshake — the
 * resulting session's access_token is verified server-side and bridged
 * into our own customer_jwt (see api/customerAuth.js#loginWithGoogleToken).
 * `supabase` is null when unconfigured so the app never crashes over an
 * optional feature — callers must check for null before using it.
 * ─────────────────────────────────────────────────────────────────────
 */
import { createClient } from '@supabase/supabase-js'

const url     = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = (url && anonKey) ? createClient(url, anonKey) : null
