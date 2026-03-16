import { supabase } from '@/lib/supabase/client'

export async function createCase(citizenId: string, payload: {
  domain: string
  incident_description: string
  incident_date?: string
  incident_location?: string
  state?: string
  district?: string
  title?: string
}) {
  const { data, error } = await supabase
    .from('cases')
    .insert({
      citizen_id: citizenId,
      ...payload,
      status: 'draft'
    })
    .select()
    .single()
  return { data, error }
}

export async function getCitizenCases(citizenId: string) {
  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .eq('citizen_id', citizenId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export async function getCaseById(caseId: string) {
  const { data, error } = await supabase
    .from('cases')
    .select(`
      *,
      case_documents (*),
      case_pipeline (
        *,
        lawyer_profiles (
          id,
          full_name,
          profile_photo_url,
          avg_rating,
          experience_years,
          specialisations
        )
      )
    `)
    .eq('id', caseId)
    .single()
  return { data, error }
}

export async function updateCase(caseId: string, updates: {
  title?: string
  status?: string
  confirmed_facts?: object
  applicable_laws?: object
  evidence_inventory?: object
  recommended_strategy?: object
  case_brief?: object
  confidence_score?: number
  analysis_duration_ms?: number
  is_seeking_lawyer?: boolean
  budget_min?: number
  budget_max?: number
  preferred_state?: string
  preferred_district?: string
}) {
  const { data, error } = await supabase
    .from('cases')
    .update(updates)
    .eq('id', caseId)
    .select()
    .single()
  return { data, error }
}

export async function getOpenCasesForLawyers({
  domain,
  state,
  district,
  budget_min,
  limit = 20,
  offset = 0
}: {
  domain?: string
  state?: string
  district?: string
  budget_min?: number
  limit?: number
  offset?: number
}) {
  let query = supabase
    .from('cases')
    .select('*')
    .eq('is_seeking_lawyer', true)
    .eq('status', 'seeking_lawyer')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (domain) query = query.eq('domain', domain)
  if (state) query = query.eq('state', state)
  if (district) query = query.eq('district', district)
  if (budget_min !== undefined) query = query.gte('budget_max', budget_min)

  const { data, error } = await query
  return { data, error }
}

export async function deleteCase(caseId: string) {
  const { error } = await supabase
    .from('cases')
    .delete()
    .eq('id', caseId)
  return { error }
}
