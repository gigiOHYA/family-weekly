import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: '家庭週報',
  description: '記錄每週家庭生活的點滴',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-amber-100 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-amber-800">
              🏠 家庭週報
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/" className="text-gray-600 hover:text-amber-700 transition-colors">所有週報</Link>
              <Link
                href="/new"
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-medium transition-colors"
              >
                + 新增週報
              </Link>
            </nav>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
        <footer className="text-center text-xs text-gray-400 py-6">
          用愛記錄每一個家庭時刻 ❤️
        </footer>
      </body>
    </html>
  )
}
