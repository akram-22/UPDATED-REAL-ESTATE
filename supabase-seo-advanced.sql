-- Run this in your Supabase SQL Editor (after supabase-blog-faq.sql)
-- Adds: Neighborhood pages, Site Settings (GBP + Analytics/Search Console),
-- and per-entity SEO/Open-Graph fields on properties & promotions.

-- ── NEIGHBORHOODS ─────────────────────────────────────────────────
create table if not exists neighborhoods (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  intro text,
  amenities text[] default '{}',
  cover_image text,
  cover_alt text,
  seo_title text,
  meta_description text,
  og_title text,
  og_description text,
  og_image text,
  position int default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table neighborhoods enable row level security;
create policy "Allow all neighborhoods" on neighborhoods for all using (true);

-- ── PROPERTIES & PROMOTIONS: per-page SEO / Open Graph overrides ──
alter table properties add column if not exists seo_title text default '';
alter table properties add column if not exists meta_description text default '';
alter table properties add column if not exists og_title text default '';
alter table properties add column if not exists og_description text default '';
alter table properties add column if not exists og_image text default '';
alter table properties add column if not exists canonical_url text default '';

alter table promotions add column if not exists seo_title text default '';
alter table promotions add column if not exists meta_description text default '';
alter table promotions add column if not exists og_title text default '';
alter table promotions add column if not exists og_description text default '';
alter table promotions add column if not exists og_image text default '';
alter table promotions add column if not exists canonical_url text default '';

-- ── SITE SETTINGS (singleton row: Google Business Profile + Analytics) ──
create table if not exists site_settings (
  id int primary key default 1,
  gbp_business_name text default '',
  gbp_phone text default '',
  gbp_service_area text default '',
  gbp_profile_url text default '',
  gbp_review_link text default '',
  gbp_post_ideas text[] default '{}',
  ga4_measurement_id text default '',
  gsc_verification_code text default '',
  seo_notes text default '',
  updated_at timestamp with time zone default now(),
  constraint single_row check (id = 1)
);

alter table site_settings enable row level security;
create policy "Allow all site_settings" on site_settings for all using (true);

insert into site_settings (id) values (1) on conflict (id) do nothing;
