'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getReport, saveReport, deleteReport } from '@/lib/storage'
import { formatWeekRange } from '@/lib/utils'
import { WeeklyReport } from '@/lib/types'
import { ReflectionEditor } from '@/components/ReflectionEditor'
import { PhotoGallery } from '@/components/PhotoGallery'

function ReportContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id')
  const isEdit = searchParams.get('edit') === 'true'
  const [report, setReport] = useState<WeeklyReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { setLoading(false); return }
    getReport(id).then(r => { setReport(r); setLoading(false) })
  }, [id])

  async function handleDelete() {
    if (!report || !confirm('確定要刪除這份週報嗎？')) return
    await deleteReport(report.id)
    router.push('/')
  }

  if (loading) return <div className="text-center py-20 text-gray-400">載入中…</div>
  if (!report) return <div className="text-center py-20 text-gray-400">找不到週報</div>

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">← 返回列表</Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">{report.title}</h1>
          <p className="text-gray-500 mt-1">{formatWeekRange(report)}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {isEdit ? (
            <Link href={`/report?id=${report.id}`}
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors">
              完成編輯
            </Link>
          ) : (
            <>
              <Link href={`/report?id=${report.id}&edit=true`}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full text-sm font-medium transition-colors">
                ✏️ 編輯
              </Link>
              <button onClick={handleDelete}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-full text-sm font-medium transition-colors">
                刪除
              </button>
            </>
          )}
        </div>
      </div>

      <section>
        <h2 className="text-xl font-bold text-gray-700 mb-4">📷 本週照片</h2>
        <PhotoGallery
          photos={report.photos}
          reportId={report.id}
          editable={isEdit}
          onPhotosChange={photos => setReport(r => r ? { ...r, photos } : r)}
        />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-700 mb-4">💬 每人心得</h2>
        <ReflectionEditor
          entries={report.entries}
          reportId={report.id}
          editable={isEdit}
        />
      </section>
    </div>
  )
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">載入中…</div>}>
      <ReportContent />
    </Suspense>
  )
}
