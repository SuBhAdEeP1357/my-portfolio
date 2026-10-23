create table public.contact_messages (
    id uuid primary key default gen_random_uuid(),
    name text not null check (char_length(btrim(name)) between 2 and 80 and name = btrim(name)),
    email text not null check (
        char_length(email) between 3 and 254
        and email = btrim(email)
        and email ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
    ),
    subject text not null check (char_length(btrim(subject)) between 2 and 150 and subject = btrim(subject)),
    message text not null check (char_length(btrim(message)) between 10 and 4000 and message = btrim(message)),
    status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
    created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- The Edge Function uses its server-side admin client. Browser roles get no access.
revoke all privileges on table public.contact_messages from public, anon, authenticated, service_role;
grant insert on table public.contact_messages to service_role;
