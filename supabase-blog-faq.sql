-- Run this in your Supabase SQL Editor
-- Adds: Blog Categories + Tags, and the full FAQ system (sections + items)

-- ── BLOG CATEGORIES ──────────────────────────────────────────────
create table if not exists blog_categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  created_at timestamp with time zone default now()
);

alter table blog_categories enable row level security;
create policy "Allow all blog_categories" on blog_categories for all using (true);

-- ── ARTICLES: add category + tags ────────────────────────────────
alter table articles add column if not exists category_id uuid references blog_categories(id) on delete set null;
alter table articles add column if not exists tags text[] default '{}';

create index if not exists idx_articles_category on articles(category_id);

-- ── FAQ SECTIONS ──────────────────────────────────────────────────
-- attach_type: 'page' | 'property' | 'article'
-- attach_ref:  page_key (home/blog/properties/promotions) OR property id OR article id
create table if not exists faq_sections (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  attach_type text not null default 'page',
  attach_ref text not null,
  position int default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table faq_sections enable row level security;
create policy "Allow all faq_sections" on faq_sections for all using (true);

create index if not exists idx_faq_sections_attach on faq_sections(attach_type, attach_ref);

-- ── FAQ ITEMS ─────────────────────────────────────────────────────
create table if not exists faq_items (
  id uuid default gen_random_uuid() primary key,
  section_id uuid references faq_sections(id) on delete cascade,
  question text not null,
  answer text not null,
  position int default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table faq_items enable row level security;
create policy "Allow all faq_items" on faq_items for all using (true);

create index if not exists idx_faq_items_section on faq_items(section_id);
