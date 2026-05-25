-- Run this in your Supabase SQL editor
create table if not exists promotions (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  developer text,
  location text not null,
  description text,
  price_from text,
  price_to text,
  surface_from text,
  surface_to text,
  delivery_date text,
  types_available text[],
  features text[],
  images text[],
  video_url text,
  status text default 'upcoming',
  badge text default 'NOUVEAU',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table promotions enable row level security;
create policy "Allow all promotions" on promotions for all using (true);
