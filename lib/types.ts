export const MEMBERS = ['爸爸', '媽媽', '可栗', '可桐', '可橋'] as const
export type Member = (typeof MEMBERS)[number]

export interface Photo {
  id: string
  url: string
  caption: string
  uploadedBy: Member
  uploadedAt: string
}

export interface MemberEntry {
  member: Member
  reflection: string
  updatedAt: string
}

export interface WeeklyReport {
  id: string
  year: number
  week: number
  startDate: string
  endDate: string
  title: string
  entries: MemberEntry[]
  photos: Photo[]
  createdAt: string
}
