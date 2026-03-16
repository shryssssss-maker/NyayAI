from supabase import create_client, Client
from app.core.config import settings

# Respects RLS — use for user-context operations
supabase: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_ANON_KEY
)

# Bypasses RLS — use only for backend/agent operations
supabase_admin: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_ROLE_KEY
)
