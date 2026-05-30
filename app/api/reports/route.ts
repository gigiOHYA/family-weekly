import { NextResponse } from 'next/server'
import { getAllReports, saveReport } from '@/lib/storage'
import { getWeekDates, generateId } from '@/lib/utils'
import { MEMBERS, WeeklyReport } from '@/lib/types'

export async function GET() {
  const reports = await getAllReports()
  return NextResponse.json(reports)
}

export async function POST(req: Request) {
  const { year, week, title } = await req.json()

  if (!year || !week) {
    return NextResponse.json({ error: '缺少年份或週數' }, { status: 400 })
  }

  const { start, end } = getWeekDates(year, week)
  const report: WeeklyReport = {
    id: generateId(),
    year,
    week,
    title: title || `第 ${week} 週家庭週報`,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    entries: MEMBERS.map(member => ({
      member,
      reflection: '',
      updatedAt: new Date().toISOString(),
    })),
    photos: [],
    createdAt: new Date().toISOString(),
  }

  await saveReport(report)
  return NextResponse.json(report, { status: 201 })
}
