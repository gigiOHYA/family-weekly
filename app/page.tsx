'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllReports } from '@/lib/storage'
import { formatWeekRange } from '@/lib/utils'
import { WeeklyReport, MEMBERS } from '@/lib/types'
import { MemberAvatar } from '@/components/MemberAvatar'

export default function Home() {
  const [reports, setReports] = useState<WeeklyReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timeout = setTimeout(() => setError('連線逾時，請確認 Supabase 設定是否正確'), 8000)
    getAllReports()
      .then(r => { setReports(r); setLoading(false) })
      .catch(e => setError(e.message ?? '無法連線至資料庫'))
      .finally(() => clearTimeout(timeout))
  }, [])

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-amber-800 mb-2">🏠 家庭週報</h1>
        <p className="text-gray-500">記錄每一週的美好家庭時光</p>
        <div className="flex justify-center gap-3 mt-4">
          {MEMBERS.map(m => <MemberAvatar key={m} member={m} />)}
        </div>
      </div>

      {error ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">⚠️</p>
          <p className="text-red-500 font-medium mb-2">無法載入資料</p>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">{error}</p>
          <p className="text-gray-400 text-xs mt-4">請確認：Supabase Secrets 已設定、reports 資料表已建立</p>
        </div>
      ) : loading ? (
        <div className="text-center py-16 text-gray-400">載入中…</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-6xl mb-4">📖</p>
          <p className="text-gray-500 mb-6">還沒有任何週報，開始記錄第一週吧！</p>
          <Link href="/new" className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-medium transition-colors">
            建立第一份週報
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map(report => {
            const filledCount = report.entries.filter(e => e.reflection.trim()).length
            const progress = Math.round((filledCount / MEMBERS.length) * 100)
            return (
              <Link
                key={report.id}
                href={`/report?id=${report.id}`}
                className="block bg-white rounded-2xl shadow-sm hover:shadow-md border border-amber-100 p-6 transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="font-bold text-lg text-gray-800">{report.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{formatWeekRange(report)}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">{filledCount}/{MEMBERS.length} 人填寫</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl">{report.photos.length > 0 ? '📷' : '📝'}</span>
                    {report.photos.length > 0 && <p className="text-xs text-gray-400 mt-1">{report.photos.length} 張照片</p>}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
