-- Run this in your Supabase SQL Editor

-- SEO Pages table
create table if not exists seo_pages (
  id uuid default gen_random_uuid() primary key,
  page_key text unique not null,
  page_label text,
  seo_title text,
  meta_description text,
  og_title text,
  og_description text,
  og_image text,
  canonical_url text,
  noindex boolean default false,
  schema_type text default 'RealEstateAgent',
  updated_at timestamp with time zone default now()
);

alter table seo_pages enable row level security;
create policy "Allow all seo_pages" on seo_pages for all using (true);

-- Articles table
create table if not exists articles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_image text,
  cover_alt text,
  seo_title text,
  meta_description text,
  og_image text,
  published boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table articles enable row level security;
create policy "Allow all articles" on articles for all using (true);

-- Redirects table
create table if not exists redirects (
  id uuid default gen_random_uuid() primary key,
  from_path text not null,
  to_path text not null,
  type text default '301',
  created_at timestamp with time zone default now()
);

alter table redirects enable row level security;
create policy "Allow all redirects" on redirects for all using (true);
