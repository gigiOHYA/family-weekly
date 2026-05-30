import { NextResponse } from 'next/server'
import { getReport, saveReport, deleteReport } from '@/lib/storage'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const report = await getReport(id)
  if (!report) return NextResponse.json({ error: '找不到週報' }, { status: 404 })
  return NextResponse.json(report)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const existing = await getReport(id)
  if (!existing) return NextResponse.json({ error: '找不到週報' }, { status: 404 })

  const updates = await req.json()
  const updated = { ...existing, ...updates }
  await saveReport(updated)
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await deleteReport(id)
  return NextResponse.json({ success: true })
}
