do $$
declare
    row_security_enabled boolean;
begin
    select relrowsecurity
    into row_security_enabled
    from pg_class
    where oid = 'public.contact_messages'::regclass;

    if row_security_enabled is distinct from true then
        raise exception 'RLS must be enabled on public.contact_messages';
    end if;

    if has_table_privilege('anon', 'public.contact_messages', 'SELECT')
        or has_table_privilege('anon', 'public.contact_messages', 'UPDATE')
        or has_table_privilege('anon', 'public.contact_messages', 'DELETE') then
        raise exception 'anon must not read, update, or delete contact messages';
    end if;

    if has_table_privilege('authenticated', 'public.contact_messages', 'SELECT')
        or has_table_privilege('authenticated', 'public.contact_messages', 'UPDATE')
        or has_table_privilege('authenticated', 'public.contact_messages', 'DELETE') then
        raise exception 'authenticated must not read, update, or delete contact messages';
    end if;

    if not has_table_privilege('service_role', 'public.contact_messages', 'INSERT') then
        raise exception 'service_role needs INSERT for the Edge Function';
    end if;

    if has_table_privilege('service_role', 'public.contact_messages', 'SELECT')
        or has_table_privilege('service_role', 'public.contact_messages', 'UPDATE')
        or has_table_privilege('service_role', 'public.contact_messages', 'DELETE') then
        raise exception 'service_role should retain only the INSERT privilege it needs';
    end if;
end;
$$;
