import { getSupabaseClient } from './client';
import { ChallengeProfile } from '../userProfile';

export async function syncProfileToSupabase(profile: ChallengeProfile, userId?: string) {
  const supabase = getSupabaseClient();
  const uid = userId || (await supabase.auth.getUser()).data.user?.id;
  if (!uid) return { success: false, reason: 'unauthenticated' };

  try {
    // 1. Update public.users
    await supabase.from('users').upsert({
      id: uid,
      name: profile.name,
      email: profile.email,
      identity_statement: profile.identity,
      selected_areas: profile.focusAreas,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    });

    // 2. Upsert active arc
    const startDate = profile.startDate || new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + profile.duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { data: arcData } = await supabase
      .from('arcs')
      .upsert({
        user_id: uid,
        name: `${profile.duration}-Day Winter Arc`,
        type: 'winter',
        start_date: startDate,
        end_date: endDate,
        duration: profile.duration,
        status: 'active',
        identity_statement: profile.identity,
        updated_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    const arcId = arcData?.id;

    // 3. Upsert habits if arcId exists
    if (arcId && profile.habits?.length) {
      const habitRows = profile.habits.map((h, idx) => ({
        user_id: uid,
        arc_id: arcId,
        name: h.title,
        area: h.category.toLowerCase(),
        type: 'binary',
        target_value: 1,
        target_unit: h.target,
        sort_order: idx,
        active: true,
      }));

      await supabase.from('habits').upsert(habitRows as any);
    }

    return { success: true };
  } catch (err) {
    console.error('[syncProfileToSupabase] Error:', err);
    return { success: false, error: err };
  }
}

export async function logHabitCompletion(habitId: string, completed: boolean, dateStr: string, userId?: string) {
  const supabase = getSupabaseClient();
  const uid = userId || (await supabase.auth.getUser()).data.user?.id;
  if (!uid) return;

  try {
    const { data: activeArc } = await supabase
      .from('arcs')
      .select('id')
      .eq('user_id', uid)
      .eq('status', 'active')
      .single();

    if (!activeArc) return;

    await supabase.from('habit_logs').upsert({
      user_id: uid,
      arc_id: activeArc.id,
      habit_id: habitId,
      date: dateStr,
      status: completed ? 'complete' : 'pending',
      value: completed ? 1 : 0,
      xp_earned: completed ? 30 : 0,
      completed_at: completed ? new Date().toISOString() : null,
    } as any);
  } catch (err) {
    console.warn('[logHabitCompletion] Sync warning:', err);
  }
}

export async function uploadProgressPhoto(file: File, dateStr: string, userId?: string) {
  const supabase = getSupabaseClient();
  const uid = userId || (await supabase.auth.getUser()).data.user?.id;
  if (!uid) throw new Error('User must be logged in to upload progress photos');

  const fileExt = file.name.split('.').pop() || 'jpg';
  const filePath = `${uid}/${dateStr}_${Date.now()}.${fileExt}`;

  // Upload to 'progress-photos' bucket
  const { error: uploadError } = await supabase.storage
    .from('progress-photos')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  // Insert metadata record in progress_photos table
  const { data: activeArc } = await supabase
    .from('arcs')
    .select('id')
    .eq('user_id', uid)
    .eq('status', 'active')
    .single();

  if (activeArc) {
    await supabase.from('progress_photos').insert({
      user_id: uid,
      arc_id: activeArc.id,
      date: dateStr,
      storage_path: filePath,
      visibility: 'private',
    });
  }

  return filePath;
}
