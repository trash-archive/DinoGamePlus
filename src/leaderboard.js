import { supabase, getPlayerId, getSavedName } from "./supabase";

const PENDING_KEY = "dino_pendingScores";

function getPending() {
  try { return JSON.parse(localStorage.getItem(PENDING_KEY) || "[]"); } catch { return []; }
}
function setPending(list) {
  localStorage.setItem(PENDING_KEY, JSON.stringify(list));
}

// Try to insert a single run into Supabase, returns true on success
async function insertRun(player_id, playerName, dist, fossils, timestamp) {
  const { error } = await supabase.from("leaderboard").insert({
    player_id,
    name: playerName,
    best_dist: dist,
    best_fossils: fossils,
    updated_at: timestamp,
  });
  return !error;
}

// Prune player's runs in Supabase to keep only top 50
async function pruneRuns(player_id) {
  const { data: playerRuns } = await supabase
    .from("leaderboard")
    .select("id, best_dist")
    .eq("player_id", player_id)
    .order("best_dist", { ascending: false });
  if (playerRuns && playerRuns.length > 50) {
    const toDelete = playerRuns.slice(50).map(r => r.id);
    await supabase.from("leaderboard").delete().in("id", toDelete);
  }
}

// Insert a new run row, then prune player's runs to keep only top 50.
// If offline, queues the run in localStorage to submit later.
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

  const ok = await insertRun(player_id, playerName, dist, fossils, timestamp);
  if (!ok) {
    // Network present but request failed — queue it anyway
    const pending = getPending();
    pending.push({ player_id, name: playerName, dist, fossils, timestamp });
    setPending(pending);
    return false;
  }

  await pruneRuns(player_id);
  return true;
}

// Flush any queued offline scores — call this on app start when online
export async function flushPendingScores() {
  if (!navigator.onLine) return;
  const pending = getPending();
  if (pending.length === 0) return;

  const failed = [];
  const playerIds = new Set();
  for (const run of pending) {
    const ok = await insertRun(run.player_id, run.name, run.dist, run.fossils, run.timestamp);
    if (ok) playerIds.add(run.player_id);
    else failed.push(run);
  }
  setPending(failed);
  for (const pid of playerIds) await pruneRuns(pid);
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

// Fetch top 50 runs globally by distance (multiple runs per player allowed)
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
