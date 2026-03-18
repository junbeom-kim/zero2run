import { createClient } from "@supabase/supabase-js";

export interface Member {
  id: string;
  name: string;
  created_at: string;
}

export interface Record {
  id: string;
  member_id: string;
  date: string;
  distance_km: number;
  memo: string;
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Members
export async function getMembers(): Promise<Member[]> {
  const { data, error } = await getSupabase()
    .from("members")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getMemberById(id: string): Promise<Member | null> {
  const { data, error } = await getSupabase()
    .from("members")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function addMember(name: string): Promise<Member> {
  const { data, error } = await getSupabase()
    .from("members")
    .insert({ name })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Records
export async function getRecords(
  memberId?: string,
  month?: string
): Promise<Record[]> {
  let query = getSupabase().from("records").select("*");

  if (memberId) {
    query = query.eq("member_id", memberId);
  }
  if (month) {
    // month format: "2026-03"
    const start = `${month}-01`;
    const endDate = new Date(
      parseInt(month.split("-")[0]),
      parseInt(month.split("-")[1]),
      0
    );
    const end = `${month}-${String(endDate.getDate()).padStart(2, "0")}`;
    query = query.gte("date", start).lte("date", end);
  }

  const { data, error } = await query.order("date", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addRecords(
  entries: {
    member_id: string;
    date: string;
    distance_km: number;
    memo: string;
  }[]
): Promise<Record[]> {
  const { data, error } = await getSupabase()
    .from("records")
    .insert(entries)
    .select();
  if (error) throw error;
  return data ?? [];
}

export async function deleteRecord(id: string): Promise<void> {
  const { error } = await getSupabase().from("records").delete().eq("id", id);
  if (error) throw error;
}

// Stats
export async function getMonthlyStats(targetMonth?: string) {
  const [records, members] = await Promise.all([
    getRecords(),
    getMembers(),
  ]);

  const monthlyTotals: { [month: string]: number } = {};
  const memberMonthly: {
    [memberId: string]: { [month: string]: number };
  } = {};

  for (const r of records) {
    const month = r.date.slice(0, 7);
    monthlyTotals[month] = (monthlyTotals[month] || 0) + r.distance_km;

    if (!memberMonthly[r.member_id]) memberMonthly[r.member_id] = {};
    memberMonthly[r.member_id][month] =
      (memberMonthly[r.member_id][month] || 0) + r.distance_km;
  }

  const now = new Date();
  const currentMonth = targetMonth || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const currentMonthRecords = records.filter((r) =>
    r.date.startsWith(currentMonth)
  );
  const totalDistance = currentMonthRecords.reduce(
    (sum, r) => sum + r.distance_km,
    0
  );
  const participatingMembers = new Set(
    currentMonthRecords.map((r) => r.member_id)
  );

  const [year, mon] = currentMonth.split("-").map(Number);
  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(year, mon - 1 - i, 1);
    months.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    );
  }

  const monthlyChart = months.map((m) => ({
    month: m,
    total: Math.round((monthlyTotals[m] || 0) * 10) / 10,
  }));

  const memberStats = members.map((m) => ({
    id: m.id,
    name: m.name,
    currentMonthKm:
      Math.round((memberMonthly[m.id]?.[currentMonth] || 0) * 10) / 10,
  }));
  memberStats.sort((a, b) => b.currentMonthKm - a.currentMonthKm);

  return {
    currentMonth,
    totalDistance: Math.round(totalDistance * 10) / 10,
    participatingCount: participatingMembers.size,
    avgDistance:
      participatingMembers.size > 0
        ? Math.round((totalDistance / participatingMembers.size) * 10) / 10
        : 0,
    monthlyChart,
    memberStats,
  };
}
