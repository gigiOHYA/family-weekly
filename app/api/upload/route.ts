import { NextResponse } from 'next/server'
import { getReport, saveReport } from '@/lib/storage'
import { generateId } from '@/lib/utils'
import { Member, Photo } from '@/lib/types'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const reportId = formData.get('reportId') as string
  const uploadedBy = formData.get('uploadedBy') as Member
  const caption = (formData.get('caption') as string) || ''

  if (!file || !reportId) {
    return NextResponse.json({ error: '缺少檔案或週報 ID' }, { status: 400 })
  }

  const report = await getReport(reportId)
  if (!report) return NextResponse.json({ error: '找不到週報' }, { status: 404 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const ext = path.extname(file.name) || '.jpg'
  const filename = `${generateId()}${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
  fs.writeFileSync(path.join(uploadDir, filename), buffer)

  const photo: Photo = {
    id: generateId(),
    url: `/uploads/${filename}`,
    caption,
    uploadedBy,
    uploadedAt: new Date().toISOString(),
  }

  report.photos = [...report.photos, photo]
  await saveReport(report)

  return NextResponse.json(photo, { status: 201 })
}

export async function DELETE(req: Request) {
  const { reportId, photoId } = await req.json()

  const report = await getReport(reportId)
  if (!report) return NextResponse.json({ error: '找不到週報' }, { status: 404 })

  const photo = report.photos.find(p => p.id === photoId)
  if (photo) {
    const filePath = path.join(process.cwd(), 'public', photo.url)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  }

  report.photos = report.photos.filter(p => p.id !== photoId)
  await saveReport(report)

  return NextResponse.json({ success: true })
}
