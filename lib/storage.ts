import { supabase } from './supabase'
import { WeeklyReport } from './types'
import { generateId } from './utils'

function toRow(r: WeeklyReport) {
  return {
    id: r.id,
    year: r.year,
    week: r.week,
    title: r.title,
    start_date: r.startDate,
    end_date: r.endDate,
    entries: r.entries,
    photos: r.photos,
    created_at: r.createdAt,
  }
}

function fromRow(row: Record<string, unknown>): WeeklyReport {
  return {
    id: row.id as string,
    year: row.year as number,
    week: row.week as number,
    title: row.title as string,
    startDate: row.start_date as string,
    endDate: row.end_date as string,
    entries: row.entries as WeeklyReport['entries'],
    photos: row.photos as WeeklyReport['photos'],
    createdAt: row.created_at as string,
  }
}

export async function getAllReports(): Promise<WeeklyReport[]> {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('year', { ascending: false })
    .order('week', { ascending: false })
  if (error) throw error
  return (data ?? []).map(fromRow)
}

export async function getReport(id: string): Promise<WeeklyReport | null> {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return fromRow(data)
}

export async function saveReport(report: WeeklyReport): Promise<void> {
  const { error } = await supabase.from('reports').upsert(toRow(report))
  if (error) throw error
}

export async function deleteReport(id: string): Promise<void> {
  const { error } = await supabase.from('reports').delete().eq('id', id)
  if (error) throw error
}

export async function uploadPhoto(file: File, reportId: string): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${reportId}/${generateId()}.${ext}`
  const { error } = await supabase.storage.from('photos').upload(path, file)
  if (error) throw error
  const { data } = supabase.storage.from('photos').getPublicUrl(path)
  return data.publicUrl
}

export async function deletePhoto(url: string): Promise<void> {
  const match = url.match(/\/object\/public\/photos\/(.+)$/)
  if (match) await supabase.storage.from('photos').remove([match[1]])
}
