import { Member } from '@/lib/types'

const MEMBER_CONFIG: Record<Member, { emoji: string; color: string }> = {
  爸爸: { emoji: '👨', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  媽媽: { emoji: '👩', color: 'bg-pink-100 text-pink-800 border-pink-200' },
  可栗: { emoji: '🌰', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  可桐: { emoji: '🌿', color: 'bg-green-100 text-green-800 border-green-200' },
  可橋: { emoji: '🌸', color: 'bg-purple-100 text-purple-800 border-purple-200' },
}

export function MemberAvatar({ member, size = 'md' }: { member: Member; size?: 'sm' | 'md' | 'lg' }) {
  const cfg = MEMBER_CONFIG[member]
  const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-12 h-12 text-xl', lg: 'w-16 h-16 text-3xl' }

  return (
    <div
      className={`${sizes[size]} ${cfg.color} rounded-full border-2 flex items-center justify-center font-medium`}
      title={member}
    >
      {cfg.emoji}
    </div>
  )
}

export function MemberBadge({ member }: { member: Member }) {
  const cfg = MEMBER_CONFIG[member]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
      {cfg.emoji} {member}
    </span>
  )
}

export { MEMBER_CONFIG }
