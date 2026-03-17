import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BadgeCheck, Mail, MapPin, Phone, SquarePen } from 'lucide-react'
import type { Database } from '@/types/supabase'
import { createServerSupabase } from '@/lib/supabase/server'

type LawyerProfile = Database['public']['Tables']['lawyer_profiles']['Row']
type LawyerOutcome = Database['public']['Enums']['case_outcome']

const SECTION_LABELS: Record<string, string> = {
	full_name: 'Full name',
	professional_title: 'Professional title',
	bio: 'About section',
	practice_state: 'Practice state',
	practice_district: 'Practice district',
	bar_council_id: 'Bar Council ID',
	enrollment_number: 'Enrollment number',
	state_bar_council: 'State Bar Council',
	phone: 'Phone number',
	email: 'Email address',
	specialisations: 'Specialisations',
	languages: 'Languages',
	fee_min: 'Minimum fee',
	fee_max: 'Maximum fee',
}

function formatText(value: string | null | undefined, fallback = 'Not provided') {
	if (!value || value.trim().length === 0) return fallback
	return value
}

function formatTitle(value: string | null | undefined) {
	if (!value || value.trim().length === 0) return 'Not specified'
	return value
		.replaceAll('_', ' ')
		.split(' ')
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ')
}

function formatCurrency(value: number | null | undefined) {
	if (value === null || value === undefined) return 'Not set'
	return new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: 'INR',
		maximumFractionDigits: 0,
	}).format(value)
}

function formatPercent(value: number | null | undefined) {
	if (value === null || value === undefined) return 'N/A'
	return `${Math.round(value)}%`
}

function formatRating(value: number | null | undefined) {
	if (value === null || value === undefined) return 'N/A'
	return value.toFixed(1)
}

function buildMissingFields(profile: LawyerProfile) {
	const checks: Array<[keyof typeof SECTION_LABELS, boolean]> = [
		['full_name', !!profile.full_name?.trim()],
		['professional_title', !!profile.professional_title?.trim()],
		['bio', !!profile.bio?.trim()],
		['practice_state', !!profile.practice_state?.trim()],
		['practice_district', !!profile.practice_district?.trim()],
		['bar_council_id', !!profile.bar_council_id?.trim()],
		['enrollment_number', !!profile.enrollment_number?.trim()],
		['state_bar_council', !!profile.state_bar_council?.trim()],
		['phone', !!profile.phone?.trim()],
		['email', !!profile.email?.trim()],
		['specialisations', (profile.specialisations?.length ?? 0) > 0],
		['languages', (profile.languages?.length ?? 0) > 0],
		['fee_min', profile.fee_min !== null],
		['fee_max', profile.fee_max !== null],
	]

	return checks.filter(([, ok]) => !ok).map(([key]) => SECTION_LABELS[key])
}

function getOutcomeWinRate(outcomes: Array<{ outcome: LawyerOutcome }> | null) {
	if (!outcomes || outcomes.length === 0) return null
	const favorable = outcomes.filter(
		(entry) => entry.outcome === 'won' || entry.outcome === 'settled'
	).length
	return (favorable / outcomes.length) * 100
}

export default async function LawyerSelfProfilePage() {
	const supabase = await createServerSupabase()

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser()

	if (userError || !user) {
		redirect('/login')
	}

	const { data: roleData } = await supabase
		.from('user_roles')
		.select('role')
		.eq('id', user.id)
		.single()

	if (roleData?.role && roleData.role !== 'lawyer' && roleData.role !== 'admin') {
		redirect('/citizen/home')
	}

	const [{ data: profile, error: profileError }, { data: outcomes }, { data: reviews }] =
		await Promise.all([
			supabase.from('lawyer_profiles').select('*').eq('id', user.id).maybeSingle(),
			supabase.from('lawyer_case_history').select('outcome').eq('lawyer_id', user.id),
			supabase.from('lawyer_reviews').select('rating').eq('lawyer_id', user.id),
		])

	if (profileError) {
		return (
			<main className="min-h-screen bg-[#f5f0e8] text-[#443831] flex items-center justify-center px-6">
				<div className="w-full max-w-xl rounded-2xl border border-[#d9cfbf] bg-[#f9f4ec] p-8">
					<h1 className="text-2xl font-serif font-semibold tracking-wide">Profile unavailable</h1>
					<p className="mt-3 text-sm opacity-80">
						We could not load your profile at this moment. Please try again from your dashboard.
					</p>
					<Link
						href="/lawyerside/home"
						className="inline-flex mt-6 rounded-lg border border-[#997953] px-4 py-2 text-sm font-medium hover:bg-[#997953] hover:text-[#f5f0e8] transition-colors"
					>
						Return to home
					</Link>
				</div>
			</main>
		)
	}

	if (!profile) {
		return (
			<main className="min-h-screen bg-[#f5f0e8] text-[#443831] flex items-center justify-center px-6">
				<div className="w-full max-w-xl rounded-2xl border border-[#d9cfbf] bg-[#f9f4ec] p-8">
					<h1 className="text-2xl font-serif font-semibold tracking-wide">Profile setup pending</h1>
					<p className="mt-3 text-sm opacity-80">
						Your account exists, but your lawyer profile record is missing. Complete onboarding to
						continue.
					</p>
					<Link
						href="/login"
						className="inline-flex mt-6 rounded-lg border border-[#997953] px-4 py-2 text-sm font-medium hover:bg-[#997953] hover:text-[#f5f0e8] transition-colors"
					>
						Re-open onboarding
					</Link>
				</div>
			</main>
		)
	}

	const reviewAverage =
		reviews && reviews.length > 0
			? reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
			: null

	const derivedWinRate = getOutcomeWinRate(outcomes as Array<{ outcome: LawyerOutcome }> | null)
	const winRate = profile.win_rate ?? derivedWinRate
	const avgRating = profile.avg_rating ?? reviewAverage
	const totalCases = profile.total_cases ?? outcomes?.length ?? 0
	const missingFields = buildMissingFields(profile)
	const derivedCompleteness = Math.max(
		0,
		Math.min(100, Math.round(((14 - missingFields.length) / 14) * 100))
	)
	const completeness = profile.completeness_score ?? derivedCompleteness
	const shouldPromptCompletion = missingFields.length > 0
	const specialisations = (profile.specialisations ?? []).map((entry) => formatTitle(entry))

	return (
		<main className="min-h-screen bg-[#f5f0e8] text-[#443831]">
			<div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
				<section className="rounded-3xl border border-[#d9cfbf] bg-[#f8f3ea]">
					<div className="flex items-center justify-between px-6 py-5 border-b border-[#ddd2c2] md:px-8">
						<p className="text-sm tracking-[0.22em] uppercase text-[#7f654a]">Legal Rights Explorer</p>
						<Link
							href="/lawyerside/profile/edit"
							className="inline-flex items-center gap-2 rounded-xl border border-[#d8ccbc] px-4 py-2 text-xs tracking-[0.15em] uppercase text-[#7f654a] hover:bg-[#efe7da] transition-colors"
						>
							<SquarePen className="h-4 w-4" />
							Edit Profile
						</Link>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2">
						<div className="border-b border-r-0 border-[#ddd2c2] px-6 py-8 md:border-b-0 md:border-r md:px-8 md:py-10">
							<p className="text-xs uppercase tracking-[0.25em] text-[#8a7156]">
								{formatTitle(profile.professional_title)} • {formatText(profile.state_bar_council)}
							</p>
							<h1 className="mt-3 text-4xl leading-tight font-serif font-semibold text-[#201912] md:text-6xl">
								{formatText(profile.full_name, 'Lawyer Profile')}
							</h1>
							<p className="mt-5 max-w-xl text-lg leading-8 text-[#5f4f40]">
								{formatText(profile.bio, 'Add your professional summary to strengthen client trust.')}
							</p>
						</div>

						<div className="px-6 py-8 md:px-8 md:py-10">
							<div className="flex items-start gap-4">
								<div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#d5c9b9] bg-[#f2ebdf] text-xl font-serif uppercase text-[#7c6144]">
									{profile.full_name
										?.split(' ')
										.filter(Boolean)
										.slice(0, 2)
										.map((word) => word[0])
										.join('') || 'LP'}
								</div>

								<div className="flex-1 space-y-2 text-sm text-[#5b4b3d]">
									<div className="flex items-center gap-2">
										<span className="rounded-md border border-[#d3c7b7] bg-[#efe8dc] px-2 py-1 text-xs uppercase tracking-[0.11em]">
											{formatTitle(profile.verification_status)}
										</span>
										{profile.verification_status === 'verified' && (
											<span className="inline-flex items-center gap-1 text-[#8a6a43]">
												<BadgeCheck className="h-4 w-4" /> Verified
											</span>
										)}
									</div>
									<p className="flex items-center gap-2">
										<MapPin className="h-4 w-4" />
										{formatText(profile.practice_district)}, {formatText(profile.practice_state)}
									</p>
									<p className="flex items-center gap-2">
										<Mail className="h-4 w-4" /> {formatText(profile.email)}
									</p>
									<p className="flex items-center gap-2">
										<Phone className="h-4 w-4" /> {formatText(profile.phone)}
									</p>
								</div>
							</div>

							<div className="mt-8 grid grid-cols-2 gap-5 text-[#2a2119] md:grid-cols-4">
								<article className="border-t border-[#d7cbbb] pt-3">
									<p className="text-4xl font-serif">{formatPercent(winRate)}</p>
									<p className="text-xs uppercase tracking-[0.2em] text-[#7f654a]">Win rate</p>
								</article>
								<article className="border-t border-[#d7cbbb] pt-3">
									<p className="text-4xl font-serif">{totalCases}</p>
									<p className="text-xs uppercase tracking-[0.2em] text-[#7f654a]">Cases</p>
								</article>
								<article className="border-t border-[#d7cbbb] pt-3">
									<p className="text-4xl font-serif">{formatRating(avgRating)}</p>
									<p className="text-xs uppercase tracking-[0.2em] text-[#7f654a]">Rating</p>
								</article>
								<article className="border-t border-[#d7cbbb] pt-3">
									<p className="text-4xl font-serif">{profile.experience_years ?? 'N/A'}</p>
									<p className="text-xs uppercase tracking-[0.2em] text-[#7f654a]">Years</p>
								</article>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] border-t border-[#ddd2c2]">
						<div className="px-6 py-7 md:px-8 md:py-9 md:border-r md:border-[#ddd2c2]">
							<div>
								<h2 className="text-xs uppercase tracking-[0.22em] text-[#7d6248]">Specialisations</h2>
								<div className="mt-4 flex flex-wrap gap-2">
									{specialisations.length > 0 ? (
										specialisations.map((entry) => (
											<span
												key={entry}
												className="rounded-md border border-[#d4c8b8] bg-[#f1e9dd] px-3 py-1 text-sm text-[#6d583f]"
											>
												{entry}
											</span>
										))
									) : (
										<p className="text-sm text-[#7c6a58]">No specialisations added yet.</p>
									)}
								</div>
							</div>

							<div className="mt-10 border-t border-[#ddd2c2] pt-7">
								<h2 className="text-xs uppercase tracking-[0.22em] text-[#7d6248]">Credentials</h2>
								<dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-4 text-[#4e4033] md:grid-cols-2">
									<div>
										<dt className="text-sm text-[#7e6a57]">Bar Council ID</dt>
										<dd className="mt-1 text-lg">{formatText(profile.bar_council_id)}</dd>
									</div>
									<div>
										<dt className="text-sm text-[#7e6a57]">Enrollment</dt>
										<dd className="mt-1 text-lg">{formatText(profile.enrollment_number)}</dd>
									</div>
									<div>
										<dt className="text-sm text-[#7e6a57]">State Bar Council</dt>
										<dd className="mt-1 text-lg">{formatText(profile.state_bar_council)}</dd>
									</div>
									<div>
										<dt className="text-sm text-[#7e6a57]">Courts</dt>
										<dd className="mt-1 text-lg">
											{(profile.court_types?.length ?? 0) > 0
												? profile.court_types?.join(' · ')
												: 'Not provided'}
										</dd>
									</div>
									<div className="md:col-span-2">
										<dt className="text-sm text-[#7e6a57]">Languages</dt>
										<dd className="mt-1 text-lg">
											{(profile.languages?.length ?? 0) > 0
												? profile.languages?.join(' · ')
												: 'Not provided'}
										</dd>
									</div>
								</dl>
							</div>
						</div>

						<aside className="px-6 py-7 md:px-8 md:py-9 space-y-8 text-[#3f3226]">
							<section>
								<h3 className="text-xs uppercase tracking-[0.22em] text-[#7d6248]">Availability</h3>
								<div className="mt-4 space-y-3 text-sm">
									<p>Available for cases: {profile.is_available ? 'Yes' : 'No'}</p>
									<p>Profile active: {profile.is_active ? 'Yes' : 'No'}</p>
								</div>
							</section>

							<section className="border-t border-[#ddd2c2] pt-6">
								<h3 className="text-xs uppercase tracking-[0.22em] text-[#7d6248]">Consultation fee</h3>
								<p className="mt-3 text-4xl font-serif leading-tight text-[#2a2119]">
									{formatCurrency(profile.fee_min)}
									<br />
									{formatCurrency(profile.fee_max)}
								</p>
							</section>

							<section className="border-t border-[#ddd2c2] pt-6">
								<h3 className="text-xs uppercase tracking-[0.22em] text-[#7d6248]">Response time</h3>
								<p className="mt-3 text-4xl font-serif leading-tight text-[#2a2119]">
									{profile.response_time_hours ?? 'N/A'}
									<span className="ml-2 text-lg">hrs</span>
								</p>
							</section>

							<section className="border-t border-[#ddd2c2] pt-6">
								<h3 className="text-xs uppercase tracking-[0.22em] text-[#7d6248]">Profile completeness</h3>
								<p className="mt-3 text-4xl font-serif leading-tight text-[#2a2119]">{completeness}%</p>

								{shouldPromptCompletion ? (
									<div className="mt-4 rounded-xl border border-[#d8ccbc] bg-[#f2eadf] p-4 text-sm">
										<p className="font-medium text-[#594733]">Complete your profile to improve visibility.</p>
										<p className="mt-2 text-[#6d5a46]">
											Missing: {missingFields.slice(0, 3).join(', ')}
											{missingFields.length > 3 ? ` and ${missingFields.length - 3} more` : ''}.
										</p>
										<Link
											href="/lawyerside/profile/edit"
											className="inline-flex mt-3 rounded-lg border border-[#997953] px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-[#6f5438] hover:bg-[#997953] hover:text-[#f5f0e8] transition-colors"
										>
											Update profile details
										</Link>
									</div>
								) : (
									<p className="mt-2 text-sm text-[#6f5a46]">All core profile sections are complete.</p>
								)}
							</section>
						</aside>
					</div>
				</section>
			</div>
		</main>
	)
}
