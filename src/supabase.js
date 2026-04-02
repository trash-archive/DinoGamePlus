import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Generate or retrieve a persistent anonymous player ID
export function getPlayerId() {
  let id = localStorage.getItem("dino_player_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("dino_player_id", id);
  }
  return id;
}

// Get saved name, or generate a unique default using the player's own UUID suffix
export function getSavedName() {
  let name = localStorage.getItem("dino_player_name");
  if (!name) {
    const id = getPlayerId();
    const suffix = id.replace(/-/g, "").slice(-6).toUpperCase();
    name = `PLAYER_${suffix}`;
    localStorage.setItem("dino_player_name", name);
  }
  return name;
}

export function savePlayerName(name) {
  localStorage.setItem("dino_player_name", name);
}
