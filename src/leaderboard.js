import { supabase, getPlayerId, getSavedName } from "./supabase";

const PENDING_KEY = "dino_pendingScores";

function getPending() {
  try { return JSON.parse(localStorage.getItem(PENDING_KEY) || "[]"); } catch { return []; }
}
function setPending(list) {
  localStorage.setItem(PENDING_KEY, JSON.stringify(list));
}

// Returns true if the run was inserted (qualifies for top 50 globally)
async function tryInsertRun(player_id, playerName, dist, fossils, timestamp) {
  // Fetch current top 50
  const { data: top50 } = await supabase
    .from("leaderboard")
    .select("id, best_dist")
    .order("best_dist", { ascending: false })
    .limit(50);

  if (!top50) return false;

  const isFull = top50.length >= 50;
  const worst = isFull ? top50[top50.length - 1] : null;

  // If board is full and this run doesn't beat the worst, skip
  if (isFull && dist <= worst.best_dist) return false;

  // Insert the new run
  const { error } = await supabase.from("leaderboard").insert({
    player_id,
    name: playerName,
    best_dist: dist,
    best_fossils: fossils,
    updated_at: timestamp,
  });
  if (error) return false;

  // If board was full, delete the old worst entry
  if (isFull) {
    await supabase.from("leaderboard").delete().eq("id", worst.id);
  }

  return true;
}

// Submit a run — only stored if it qualifies for global top 50
export async function submitScore(name, dist, fossils) {
  const player_id  = getPlayerId();
  const playerName = name.toUpperCase().slice(0, 20);
  const timestamp  = new Date().toISOString();

  if (!navigator.onLine) {
    const pending = getPending();
    pending.push({ player_id, name: playerName, dist, fossils, timestamp });
    setPending(pending);
    return false;
  }

  const ok = await tryInsertRun(player_id, playerName, dist, fossils, timestamp);
  if (!ok) {
    const pending = getPending();
    pending.push({ player_id, name: playerName, dist, fossils, timestamp });
    setPending(pending);
    return false;
  }

  return true;
}

// Flush queued offline scores
export async function flushPendingScores() {
  if (!navigator.onLine) return;
  const pending = getPending();
  if (pending.length === 0) return;

  const failed = [];
  for (const run of pending) {
    const ok = await tryInsertRun(run.player_id, run.name, run.dist, run.fossils, run.timestamp);
    if (!ok) failed.push(run);
  }
  setPending(failed);
}

// Check if a name is already taken by another player
export async function isNameTaken(name) {
  const player_id = getPlayerId();
  const { data } = await supabase
    .from("leaderboard")
    .select("player_id")
    .ilike("name", name)
    .neq("player_id", player_id)
    .limit(1);
  return data && data.length > 0;
}

// Fetch top 50 runs globally by distance
export async function fetchLeaderboard() {
  const { data, error } = await supabase
    .from("leaderboard")
    .select("id, player_id, name, best_dist, best_fossils, updated_at")
    .order("best_dist", { ascending: false })
    .order("best_fossils", { ascending: false })
    .order("updated_at", { ascending: true })
    .limit(50);
  if (error) { console.error("Leaderboard fetch error:", error.message); return []; }
  return data || [];
}
