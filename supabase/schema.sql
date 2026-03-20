-- Zero2Run 데이터베이스 스키마
-- Supabase SQL Editor에서 실행하세요

-- 회원 테이블
create table members (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamp with time zone default now()
);

-- 러닝 기록 테이블
create table records (
  id uuid default gen_random_uuid() primary key,
  member_id uuid not null references members(id) on delete cascade,
  date date not null,
  distance_km numeric(6, 2) not null check (distance_km > 0),
  memo text default ''
);

-- 인덱스
create index records_member_id_idx on records(member_id);
create index records_date_idx on records(date);
