'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Photo, Member, MEMBERS } from '@/lib/types'
import { MemberBadge } from './MemberAvatar'

interface Props {
  photos: Photo[]
  reportId: string
  editable?: boolean
  onPhotosChange?: (photos: Photo[]) => void
}

export function PhotoGallery({ photos, reportId, editable, onPhotosChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member>('爸爸')
  const [lightbox, setLightbox] = useState<Photo | null>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    try {
      const newPhotos: Photo[] = []
      for (const file of files) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('reportId', reportId)
        fd.append('uploadedBy', selectedMember)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const photo = await res.json()
        newPhotos.push(photo)
      }
      onPhotosChange?.([...photos, ...newPhotos])
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function handleDelete(photoId: string) {
    await fetch('/api/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId, photoId }),
    })
    onPhotosChange?.(photos.filter(p => p.id !== photoId))
  }

  return (
    <div className="space-y-4">
      {editable && (
        <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <select
            value={selectedMember}
            onChange={e => setSelectedMember(e.target.value as Member)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
          >
            {MEMBERS.map(m => <option key={m}>{m}</option>)}
          </select>
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors">
            {uploading ? '上傳中...' : '📷 上傳照片'}
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
          <span className="text-xs text-gray-500">可同時選取多張照片</span>
        </div>
      )}

      {photos.length === 0 ? (
        <p className="text-center text-gray-400 py-8">還沒有照片，快來上傳吧！</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map(photo => (
            <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm">
              <Image
                src={photo.url}
                alt={photo.caption || '家庭照片'}
                fill
                className="object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => setLightbox(photo)}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <MemberBadge member={photo.uploadedBy} />
                {photo.caption && <p className="text-white text-xs mt-1 truncate">{photo.caption}</p>}
              </div>
              {editable && (
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-3xl max-h-full" onClick={e => e.stopPropagation()}>
            <img src={lightbox.url} alt={lightbox.caption} className="max-h-[80vh] max-w-full rounded-xl object-contain" />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3 rounded-b-xl">
              <MemberBadge member={lightbox.uploadedBy} />
              {lightbox.caption && <p className="text-sm mt-1">{lightbox.caption}</p>}
            </div>
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
