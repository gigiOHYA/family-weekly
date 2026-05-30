@AGENTS.md

# 家庭週報 (Family Weekly)

家庭生活週報網站，每週記錄照片與每位成員的心得。

## 家庭成員

爸爸、媽媽、可栗、可桐、可橋

## 技術架構

- **框架**：Next.js 16（App Router，靜態匯出 `output: 'export'`）
- **資料庫**：Supabase（PostgreSQL）
- **照片儲存**：Supabase Storage（bucket 名稱：`photos`，公開）
- **部署**：GitHub Pages（`https://gigiohya.github.io/family-weekly`）
- **CI/CD**：GitHub Actions（push to main 自動部署）
- **樣式**：Tailwind CSS

## 重要設定

- `basePath: '/family-weekly'`（next.config.ts）
- 所有頁面為 client component（靜態匯出不支援 server-side）
- 環境變數：`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - 本機：`.env.local`
  - GitHub Actions：Repository Secrets

## Supabase 資料表結構

```sql
create table public.reports (
  id text primary key,
  year integer not null,
  week integer not null,
  title text not null,
  start_date text not null,
  end_date text not null,
  entries jsonb not null default '[]',  -- MemberEntry[]
  photos jsonb not null default '[]',   -- Photo[]
  created_at text not null
);
-- RLS: Public access policy 已啟用
```

## 專案結構

```
app/
  page.tsx          # 首頁：列出所有週報
  new/page.tsx      # 新增週報
  report/page.tsx   # 閱讀／編輯週報（?id=xxx&edit=true）
components/
  MemberAvatar.tsx  # 成員頭像、顏色設定
  PhotoGallery.tsx  # 照片牆（上傳、燈箱、刪除）
  ReflectionEditor.tsx  # 各成員心得編輯
lib/
  types.ts          # TypeScript 型別定義
  supabase.ts       # Supabase client
  storage.ts        # 所有資料存取（Supabase）
  utils.ts          # 週數計算、日期格式化
```

## 已完成功能

- [x] 首頁列出所有週報，含填寫進度條
- [x] 新增週報（自動帶入本週年份/週數）
- [x] 每位成員填寫週心得（即時儲存至 Supabase）
- [x] 上傳照片到 Supabase Storage
- [x] 照片燈箱檢視
- [x] 刪除週報
- [x] GitHub Actions 自動部署到 GitHub Pages

## 待辦 / 可擴充功能

- [ ] 成員心得完成通知
- [ ] 週報封面照片
- [ ] 週報列印／PDF 匯出
- [ ] 照片加說明文字（caption）
- [ ] 成員各自的密碼保護
- [ ] 搜尋週報內容

## 注意事項

- 路由用 query param（`/report?id=xxx`），不用動態路由（靜態匯出限制）
- 照片刪除需同步從 Supabase Storage 移除（`deletePhoto` in `lib/storage.ts`）
- `CLAUDE.md` 裡的 `@AGENTS.md` 是 Next.js 版本注意事項，請勿刪除
