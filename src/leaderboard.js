import { supabase, getPlayerId } from "./supabase";

// Insert a new run row, then prune player's runs to keep only top 50
export async function submitScore(name, dist, fossils) {
  const player_id = getPlayerId();
  const playerName = name.toUpperCase().slice(0, 20);

  // Insert new run
  const { error } = await supabase.from("leaderboard").insert({
    player_id,
    name: playerName,
    best_dist: dist,
    best_fossils: fossils,
    updated_at: new Date().toISOString(),
  });
  if (error) { console.error("Score submit error:", error.message); return false; }

  // Prune: keep only top 50 runs for this player by distance
  const { data: playerRuns } = await supabase
    .from("leaderboard")
    .select("id, best_dist")
    .eq("player_id", player_id)
    .order("best_dist", { ascending: false });

  if (playerRuns && playerRuns.length > 50) {
    const toDelete = playerRuns.slice(50).map(r => r.id);
    await supabase.from("leaderboard").delete().in("id", toDelete);
  }

  return true;
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
    .select("id, player_id, name, best_dist, best_fossils")
    .order("best_dist", { ascending: false })
    .limit(50);
  if (error) { console.error("Leaderboard fetch error:", error.message); return []; }
  return data || [];
}
