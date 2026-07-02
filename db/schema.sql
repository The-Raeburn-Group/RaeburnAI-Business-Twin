create table if not exists business_twins (
  id text primary key,
  name text not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_twins_updated_at_idx on business_twins (updated_at desc);

create table if not exists audit_events (
  id bigserial primary key,
  action text not null,
  subject_id text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_events_subject_id_idx on audit_events (subject_id);
create index if not exists audit_events_created_at_idx on audit_events (created_at desc);
