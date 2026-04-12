import { supabase, getPlayerId, getSavedName } from "./supabase";

const PENDING_KEY = "dino_pendingScores";

function getPending() {
  try { return JSON.parse(localStorage.getItem(PENDING_KEY) || "[]"); } catch { return []; }
}
function setPending(list) {
  localStorage.setItem(PENDING_KEY, JSON.stringify(list));
}

// Returns true if the run was inserted (qualifies for top 50 globally or per-map)
async function tryInsertRun(player_id, playerName, dist, fossils, timestamp, map_id = null) {
  // Fetch current top 50 for the relevant scope (global or per-map)
  let query = supabase
    .from("leaderboard")
    .select("id, best_dist")
    .order("best_dist", { ascending: false })
    .limit(50);
  if (map_id) query = query.eq("map_id", map_id);
  else query = query.is("map_id", null);

  const { data: top50 } = await query;
  if (!top50) return false;

  const isFull = top50.length >= 50;
  const worst = isFull ? top50[top50.length - 1] : null;

  if (isFull && dist <= worst.best_dist) return false;

  const { error } = await supabase.from("leaderboard").insert({
    player_id,
    name: playerName,
    best_dist: dist,
    best_fossils: fossils,
    updated_at: timestamp,
    map_id: map_id || null,
  });
  if (error) return false;

  if (isFull) {
    await supabase.from("leaderboard").delete().eq("id", worst.id);
  }

  return true;
}

// Submit a run — stored if it qualifies for global top 50 and/or per-map top 50
export async function submitScore(name, dist, fossils, map_id = null) {
  const player_id  = getPlayerId();
  const playerName = name.toUpperCase().slice(0, 20);
  const timestamp  = new Date().toISOString();

  if (!navigator.onLine) {
    const pending = getPending();
    pending.push({ player_id, name: playerName, dist, fossils, timestamp, map_id });
    setPending(pending);
    return false;
  }

  const [globalOk, mapOk] = await Promise.all([
    tryInsertRun(player_id, playerName, dist, fossils, timestamp, null),
    map_id ? tryInsertRun(player_id, playerName, dist, fossils, timestamp, map_id) : Promise.resolve(true),
  ]);

  // Queue only the scopes that failed
  if (!globalOk || !mapOk) {
    const pending = getPending();
    if (!globalOk) pending.push({ player_id, name: playerName, dist, fossils, timestamp, map_id: null });
    if (!mapOk)    pending.push({ player_id, name: playerName, dist, fossils, timestamp, map_id });
    setPending(pending);
  }

  return globalOk;
}

// Flush queued offline scores — each pending entry has its own specific map_id scope
export async function flushPendingScores() {
  if (!navigator.onLine) return;
  const pending = getPending();
  if (pending.length === 0) return;

  const failed = [];
  for (const run of pending) {
    const ok = await tryInsertRun(run.player_id, run.name, run.dist, run.fossils, run.timestamp, run.map_id ?? null);
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
    .is("map_id", null)
    .order("best_dist", { ascending: false })
    .order("best_fossils", { ascending: false })
    .order("updated_at", { ascending: true })
    .limit(50);
  if (error) { console.error("Leaderboard fetch error:", error.message); return []; }
  return data || [];
}

// Fetch all boards the player appears on — returns every ranked run, sorted global-first then by rank
export async function fetchAllPlayerRanks(player_id) {
  const boards = [
    { board: "global",  label: "GLOBAL",       query: supabase.from("leaderboard").select("id, player_id, name, best_dist, best_fossils, updated_at").is("map_id", null).order("best_dist", { ascending: false }).order("best_fossils", { ascending: false }).order("updated_at", { ascending: true }).limit(50) },
    { board: "classic", label: "WASTELAND"     },
    { board: "plains",  label: "GRASSLANDS"    },
    { board: "desert",  label: "DESERT"        },
    { board: "arctic",  label: "ARCTIC TUNDRA" },
    { board: "volcano", label: "VOLCANIC RIFT" },
    { board: "jungle",  label: "DENSE JUNGLE"  },
    { board: "ruins",   label: "ANCIENT RUINS" },
    { board: "cave",    label: "CRYSTAL CAVE"  },
  ];

  const results = await Promise.all(
    boards.map(b => {
      const q = b.query || supabase.from("leaderboard").select("id, player_id, name, best_dist, best_fossils, updated_at").eq("map_id", b.board).order("best_dist", { ascending: false }).order("best_fossils", { ascending: false }).order("updated_at", { ascending: true }).limit(50);
      return q.then(({ data }) => ({ ...b, data: data || [] }));
    })
  );

  const ranks = [];
  for (const { board, label, data } of results) {
    const myEntries = data.filter(r => r.player_id === player_id);
    for (const entry of myEntries) {
      const rank = data.filter(r =>
        r.best_dist > entry.best_dist ||
        (r.best_dist === entry.best_dist && r.best_fossils > entry.best_fossils) ||
        (r.best_dist === entry.best_dist && r.best_fossils === entry.best_fossils && r.updated_at < entry.updated_at)
      ).length + 1;
      if (rank <= 50) ranks.push({ board, label, rank, dist: entry.best_dist, fossils: entry.best_fossils });
    }
  }

  // Sort: global first, then by rank ascending, then by dist descending
  ranks.sort((a, b) => {
    if (a.board === "global" && b.board !== "global") return -1;
    if (b.board === "global" && a.board !== "global") return 1;
    if (a.rank !== b.rank) return a.rank - b.rank;
    return b.dist - a.dist;
  });

  return ranks;
}

// Fetch top 50 runs for a specific map
export async function fetchMapLeaderboard(map_id) {
  const { data, error } = await supabase
    .from("leaderboard")
    .select("id, player_id, name, best_dist, best_fossils, updated_at")
    .eq("map_id", map_id)
    .order("best_dist", { ascending: false })
    .order("best_fossils", { ascending: false })
    .order("updated_at", { ascending: true })
    .limit(50);
  if (error) { console.error("Map leaderboard fetch error:", error.message); return []; }
  return data || [];
}
