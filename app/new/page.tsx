'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getWeekNumber } from '@/lib/utils'

export default function NewReportPage() {
  const router = useRouter()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [week, setWeek] = useState(getWeekNumber(now))
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    setLoading(true)
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year, week, title }),
    })
    const report = await res.json()
    router.push(`/report/${report.id}/edit`)
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-amber-100 p-8">
        <h1 className="text-2xl font-bold text-amber-800 mb-6">📖 新增家庭週報</h1>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">年份</label>
              <input
                type="number"
                value={year}
                onChange={e => setYear(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">週數</label>
              <input
                type="number"
                min={1}
                max={53}
                value={week}
                onChange={e => setWeek(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">週報標題（選填）</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={`${year} 年第 ${week} 週家庭週報`}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
          >
            {loading ? '建立中…' : '建立週報'}
          </button>
        </div>
      </div>
    </div>
  )
}
