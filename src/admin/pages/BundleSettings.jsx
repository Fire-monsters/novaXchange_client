/**
 * BundleSettings.jsx
 * ──────────────────────────────────────────────────────────────────
 * Route: /admin/settings
 *
 * Admin-editable config for BundleDealsPopup.jsx (src/components/ui/).
 * Prefills from whatever's currently saved (GET /settings/bundle-deals),
 * or from the shipped DEFAULT_BUNDLES if nothing's been saved yet, so
 * the first visit here always shows real, editable content rather than
 * a blank form. Saves via PUT /admin/settings/bundle-deals.
 * ──────────────────────────────────────────────────────────────────
 */
import React, { useState, useEffect } from 'react'
import {
  FiPlus, FiX, FiTrash2, FiAlertCircle, FiCheck,
} from 'react-icons/fi'
import { getBundleDeals } from '../../api/settings'
import { updateBundleDeals } from '../../api/catalog'
import { DEFAULT_BUNDLES } from '../../data/bundles'

const inputCls = 'w-full px-3 py-2.5 border-2 border-ink/20 rounded-lg text-sm bg-white ' +
                 'focus:outline-none focus:border-violet transition-colors'

const blankBundle = () => ({
  id: '',
  tag: '',
  headline: '',
  subline: '',
  emoji: '⚡',
  accent_color: '#6C2BD9',
  accent_text: '#FFE033',
  bg_color: '#EDE6FF',
  items: [{ name: '', detail: '' }],
  freebie: '',
  original_price_ugx: 0,
  bundle_price_ugx: 0,
  wa_message: '',
})

const ColorField = ({ label, value, onChange }) => (
  <div>
    <label className="block text-xs font-semibold text-ink-soft mb-1">{label}</label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-10 h-10 rounded-lg border-2 border-ink/20 cursor-pointer flex-shrink-0"
      />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`${inputCls} font-mono`}
      />
    </div>
  </div>
)

export default function BundleSettings() {
  const [enabled, setEnabled]             = useState(true)
  const [countdownSecs, setCountdownSecs] = useState(5)
  const [bundles, setBundles]             = useState([])
  const [loading, setLoading]             = useState(true)
  const [saving, setSaving]               = useState(false)
  const [error, setError]                 = useState('')
  const [saved, setSaved]                 = useState(false)

  useEffect(() => {
    getBundleDeals()
      .then(data => {
        if (data.bundles && data.bundles.length > 0) {
          setEnabled(data.enabled)
          setCountdownSecs(data.countdown_secs)
          setBundles(data.bundles)
        } else {
          // Nothing saved yet — prefill from what the popup shows today.
          setEnabled(true)
          setCountdownSecs(5)
          setBundles(DEFAULT_BUNDLES)
        }
      })
      .catch(() => {
        setEnabled(true)
        setCountdownSecs(5)
        setBundles(DEFAULT_BUNDLES)
      })
      .finally(() => setLoading(false))
  }, [])

  const updateBundle = (i, field, value) => {
    setBundles(bs => bs.map((b, idx) => idx === i ? { ...b, [field]: value } : b))
  }

  const updateItem = (bi, ii, field, value) => {
    setBundles(bs => bs.map((b, idx) => {
      if (idx !== bi) return b
      const items = b.items.map((it, j) => j === ii ? { ...it, [field]: value } : it)
      return { ...b, items }
    }))
  }

  const addItem = (bi) => {
    setBundles(bs => bs.map((b, idx) =>
      idx === bi ? { ...b, items: [...b.items, { name: '', detail: '' }] } : b
    ))
  }

  const removeItem = (bi, ii) => {
    setBundles(bs => bs.map((b, idx) =>
      idx === bi ? { ...b, items: b.items.filter((_, j) => j !== ii) } : b
    ))
  }

  const addBundle = () => setBundles(bs => [...bs, blankBundle()])
  const removeBundle = (i) => setBundles(bs => bs.filter((_, idx) => idx !== i))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      await updateBundleDeals({
        enabled,
        countdown_secs: Number(countdownSecs) || 5,
        bundles,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-violet border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-bricolage font-black text-2xl text-ink">Bundle deals popup</h1>
          <p className="text-gray text-sm">Controls the splash shown once per visitor session on the homepage.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 bg-violet text-yellow text-sm font-bold
                     px-4 py-2.5 rounded-lg border-2 border-ink shadow-[2px_2px_0_#120D1E]
                     hover:shadow-[3px_3px_0_#120D1E] hover:-translate-x-px hover:-translate-y-px
                     transition-all disabled:opacity-50"
        >
          {saving ? 'Saving…' : <> <FiCheck size={15} /> Save changes </>}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-lg">
          <FiAlertCircle size={14} className="flex-shrink-0" /> {error}
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-2.5 rounded-lg">
          <FiCheck size={14} className="flex-shrink-0" /> Saved — live on the next popup view.
        </div>
      )}

      {/* Top-level toggle + timing */}
      <div className="bg-white rounded-xl border-2 border-ink p-5 shadow-[3px_3px_0_#120D1E] flex flex-wrap gap-6">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={e => setEnabled(e.target.checked)}
            className="w-4 h-4 accent-violet"
          />
          <span className="text-sm font-semibold text-ink">Popup enabled</span>
        </label>

        <div className="flex items-center gap-2.5">
          <label className="text-sm font-semibold text-ink-soft">Auto-dismiss after</label>
          <input
            type="number" min={2} max={60}
            value={countdownSecs}
            onChange={e => setCountdownSecs(e.target.value)}
            className={`${inputCls} w-20`}
          />
          <span className="text-sm text-gray">seconds</span>
        </div>
      </div>

      {/* Bundles */}
      <div className="space-y-4">
        {bundles.map((bundle, bi) => (
          <div key={bi} className="bg-white rounded-xl border-2 border-ink p-5 shadow-[3px_3px_0_#120D1E] space-y-4">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <h2 className="font-bricolage font-bold text-base text-ink">
                Bundle {bi + 1}{bundle.tag ? ` — ${bundle.tag}` : ''}
              </h2>
              <button
                type="button"
                onClick={() => removeBundle(bi)}
                className="flex items-center gap-1.5 text-xs text-red-500 hover:underline font-medium"
              >
                <FiTrash2 size={13} /> Remove bundle
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink-soft mb-1">
                  ID <span className="text-gray font-normal">(unique, no spaces)</span>
                </label>
                <input required value={bundle.id}
                  onChange={e => updateBundle(bi, 'id', e.target.value)}
                  className={`${inputCls} font-mono`} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-soft mb-1">Emoji</label>
                <input required value={bundle.emoji}
                  onChange={e => updateBundle(bi, 'emoji', e.target.value)}
                  className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-soft mb-1">Tag</label>
                <input required value={bundle.tag}
                  onChange={e => updateBundle(bi, 'tag', e.target.value)}
                  placeholder="e.g. Productivity Combo"
                  className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-soft mb-1">Headline</label>
                <input required value={bundle.headline}
                  onChange={e => updateBundle(bi, 'headline', e.target.value)}
                  className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-ink-soft mb-1">Subline</label>
                <input required value={bundle.subline}
                  onChange={e => updateBundle(bi, 'subline', e.target.value)}
                  className={inputCls} />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <ColorField label="Accent color" value={bundle.accent_color}
                onChange={v => updateBundle(bi, 'accent_color', v)} />
              <ColorField label="Accent text color" value={bundle.accent_text}
                onChange={v => updateBundle(bi, 'accent_text', v)} />
              <ColorField label="Background color" value={bundle.bg_color}
                onChange={v => updateBundle(bi, 'bg_color', v)} />
            </div>

            {/* Items */}
            <div>
              <label className="block text-xs font-semibold text-ink-soft mb-2">What's in the box</label>
              <div className="space-y-2">
                {bundle.items.map((item, ii) => (
                  <div key={ii} className="flex gap-2 items-center">
                    <input
                      required value={item.name}
                      onChange={e => updateItem(bi, ii, 'name', e.target.value)}
                      placeholder="e.g. Wireless Mouse"
                      className="flex-1 px-3 py-2 border border-ink/20 rounded-lg text-sm focus:outline-none focus:border-violet"
                    />
                    <input
                      required value={item.detail}
                      onChange={e => updateItem(bi, ii, 'detail', e.target.value)}
                      placeholder="e.g. Logitech M185"
                      className="flex-[2] px-3 py-2 border border-ink/20 rounded-lg text-sm focus:outline-none focus:border-violet"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(bi, ii)}
                      disabled={bundle.items.length === 1}
                      className="w-8 h-8 rounded-lg text-gray hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition flex-shrink-0 disabled:opacity-30"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addItem(bi)}
                className="flex items-center gap-1.5 text-sm text-violet font-medium hover:underline mt-2"
              >
                <FiPlus size={14} /> Add item
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-soft mb-1">Freebie</label>
              <input required value={bundle.freebie}
                onChange={e => updateBundle(bi, 'freebie', e.target.value)}
                placeholder="e.g. Desktop Mat (worth UGX 25,000)"
                className={inputCls} />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink-soft mb-1">Original price (UGX)</label>
                <input required type="number" min={0} value={bundle.original_price_ugx}
                  onChange={e => updateBundle(bi, 'original_price_ugx', Number(e.target.value))}
                  className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-soft mb-1">Bundle price (UGX)</label>
                <input required type="number" min={0} value={bundle.bundle_price_ugx}
                  onChange={e => updateBundle(bi, 'bundle_price_ugx', Number(e.target.value))}
                  className={inputCls} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-soft mb-1">WhatsApp message</label>
              <textarea required rows={2} value={bundle.wa_message}
                onChange={e => updateBundle(bi, 'wa_message', e.target.value)}
                className={`${inputCls} resize-y`} />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addBundle}
        className="flex items-center gap-1.5 text-sm text-violet font-medium hover:underline"
      >
        <FiPlus size={14} /> Add bundle
      </button>
    </form>
  )
}
