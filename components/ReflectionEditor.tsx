'use client'

import { useState } from 'react'
import { MemberEntry } from '@/lib/types'
import { getReport, saveReport } from '@/lib/storage'
import { MemberAvatar, MEMBER_CONFIG } from './MemberAvatar'

interface Props {
  entries: MemberEntry[]
  reportId: string
  editable?: boolean
}

export function ReflectionEditor({ entries, reportId, editable }: Props) {
  const [localEntries, setLocalEntries] = useState(entries)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  async function handleSave(member: string, reflection: string) {
    setSaving(member)
    const report = await getReport(reportId)
    if (!report) return
    const updatedEntries = localEntries.map(e =>
      e.member === member ? { ...e, reflection, updatedAt: new Date().toISOString() } : e
    )
    await saveReport({ ...report, entries: updatedEntries })
    setLocalEntries(updatedEntries)
    setSaving(null)
    setSaved(member)
    setTimeout(() => setSaved(null), 2000)
  }

  return (
    <div className="space-y-6">
      {localEntries.map(entry => {
        const cfg = MEMBER_CONFIG[entry.member]
        return (
          <div key={entry.member} className={`rounded-2xl border-2 ${cfg.color} p-5`}>
            <div className="flex items-center gap-3 mb-3">
              <MemberAvatar member={entry.member} />
              <div>
                <h3 className="font-bold text-lg">{entry.member}</h3>
                <p className="text-xs opacity-60">的本週心得</p>
              </div>
            </div>
            {editable ? (
              <EntryEditField
                entry={entry}
                saving={saving === entry.member}
                saved={saved === entry.member}
                onSave={reflection => handleSave(entry.member, reflection)}
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {entry.reflection || <span className="text-gray-400 italic">尚未填寫心得…</span>}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

function EntryEditField({ entry, saving, saved, onSave }: {
  entry: MemberEntry; saving: boolean; saved: boolean; onSave: (t: string) => void
}) {
  const [text, setText] = useState(entry.reflection)
  const [dirty, setDirty] = useState(false)

  return (
    <div className="space-y-2">
      <textarea value={text} onChange={e => { setText(e.target.value); setDirty(true) }}
        placeholder="寫下這週的心得、感受或有趣的事…" rows={4}
        className="w-full rounded-xl border border-white/50 bg-white/70 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-white/80" />
      <div className="flex items-center justify-between">
        <span className="text-xs opacity-50">{text.length} 字</span>
        <button onClick={() => { onSave(text); setDirty(false) }} disabled={saving || !dirty}
          className="px-4 py-1.5 rounded-lg bg-white/70 hover:bg-white text-sm font-medium disabled:opacity-40 transition-colors">
          {saving ? '儲存中…' : saved ? '✓ 已儲存' : '儲存'}
        </button>
      </div>
    </div>
  )
}
