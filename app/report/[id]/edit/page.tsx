import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getReport } from '@/lib/storage'
import { formatWeekRange } from '@/lib/utils'
import { ReflectionEditor } from '@/components/ReflectionEditor'
import { PhotoGallery } from '@/components/PhotoGallery'

export const dynamic = 'force-dynamic'

export default async function EditReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const report = await getReport(id)
  if (!report) notFound()

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href={`/report/${id}`} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            ← 返回閱讀
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">{report.title}</h1>
          <p className="text-gray-500 mt-1">{formatWeekRange(report)}</p>
        </div>
        <span className="flex-shrink-0 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          編輯模式
        </span>
      </div>

      <section>
        <h2 className="text-xl font-bold text-gray-700 mb-4">📷 本週照片</h2>
        <PhotoGallery photos={report.photos} reportId={report.id} editable />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-700 mb-4">💬 每人心得</h2>
        <ReflectionEditor entries={report.entries} reportId={report.id} editable />
      </section>
    </div>
  )
}
