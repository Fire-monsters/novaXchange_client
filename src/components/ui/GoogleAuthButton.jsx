import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import { supabase } from '../../lib/supabaseClient'

// Renders nothing if Supabase isn't configured (VITE_SUPABASE_URL/ANON_KEY
// blank) — Google sign-in is an optional add-on, not a hard requirement.
export default function GoogleAuthButton({ label = 'Continue with Google' }) {
  if (!supabase) return null

  const handleClick = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/account/google-callback` },
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-2 bg-white text-ink
                 font-semibold py-2.5 rounded-xl border-2 border-ink/20 text-sm
                 hover:border-ink transition-colors"
    >
      <FcGoogle size={18} /> {label}
    </button>
  )
}
