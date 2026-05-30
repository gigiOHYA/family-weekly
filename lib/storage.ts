import { WeeklyReport } from './types'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'reports.json')

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]')
}

function readAll(): WeeklyReport[] {
  ensureDataDir()
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
}

function writeAll(reports: WeeklyReport[]) {
  ensureDataDir()
  fs.writeFileSync(DATA_FILE, JSON.stringify(reports, null, 2))
}

export async function getAllReports(): Promise<WeeklyReport[]> {
  const reports = readAll()
  return reports.sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year
    return b.week - a.week
  })
}

export async function getReport(id: string): Promise<WeeklyReport | null> {
  const reports = readAll()
  return reports.find(r => r.id === id) ?? null
}

export async function getReportByWeek(year: number, week: number): Promise<WeeklyReport | null> {
  const reports = readAll()
  return reports.find(r => r.year === year && r.week === week) ?? null
}

export async function saveReport(report: WeeklyReport): Promise<void> {
  const reports = readAll()
  const idx = reports.findIndex(r => r.id === report.id)
  if (idx >= 0) reports[idx] = report
  else reports.push(report)
  writeAll(reports)
}

export async function deleteReport(id: string): Promise<void> {
  const reports = readAll()
  writeAll(reports.filter(r => r.id !== id))
}
