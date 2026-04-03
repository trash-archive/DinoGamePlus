// ─── SCENERY DATA ─────────────────────────────────────────────────────────────
// Each scenery is a named export. SCENERIES array assembles them in order.

export const SCENERY_WASTELAND = {
  id:          "classic",
  label:       "Wasteland",
  cost:        0,
  desc:        "The digital wasteland where it all began",
  dayBg:       "#f5f5f0",
  nightBg:     "#111118",
  groundColor: "#222222",
  groundTop:   "#444444",
  cloudColor:  "#dddddd",
  obstacleSet: "plants",
  accentColor: "#444444",
};

export const SCENERY_GRASSLANDS = {
  id:          "plains",
  label:       "Grasslands",
  cost:        3000,
  desc:        "The classic prehistoric plains",
  dayBg:       "#e8f4d4",
  nightBg:     "#0d1a0a",
  groundColor: "#5a3e1b",
  groundTop:   "#6b8c3e",
  cloudColor:  "#c8ddb0",
  obstacleSet: "plants",
  accentColor: "#6b8c3e",
};

export const SCENERY_DESERT = {
  id:          "desert",
  label:       "Desert",
  cost:        6000,
  desc:        "Scorching sands and ancient dunes",
  dayBg:       "#f5dfa0",
  nightBg:     "#1a0d00",
  groundColor: "#c4883a",
  groundTop:   "#e0a850",
  cloudColor:  "#f0d080",
  obstacleSet: "desert",
  accentColor: "#e07020",
};

export const SCENERY_ARCTIC = {
  id:          "arctic",
  label:       "Arctic Tundra",
  cost:        10000,
  desc:        "Frozen wastes from the ice age",
  dayBg:       "#d8eeff",
  nightBg:     "#050a14",
  groundColor: "#8ab0cc",
  groundTop:   "#ddeeff",
  cloudColor:  "#eef6ff",
  obstacleSet: "arctic",
  accentColor: "#88ccee",
};

export const SCENERY_VOLCANO = {
  id:          "volcano",
  label:       "Volcanic Rift",
  cost:        18000,
  desc:        "Lava flows and volcanic fury",
  dayBg:       "#2a0800",
  nightBg:     "#0a0200",
  groundColor: "#3a1a08",
  groundTop:   "#8a2a00",
  cloudColor:  "#6a2a10",
  obstacleSet: "volcano",
  accentColor: "#ff4400",
};

export const SCENERY_JUNGLE = {
  id:          "jungle",
  label:       "Dense Jungle",
  cost:        25000,
  desc:        "Ancient overgrown rainforest",
  dayBg:       "#0a2a10",
  nightBg:     "#020a04",
  groundColor: "#1a3a10",
  groundTop:   "#2a5a18",
  cloudColor:  "#1a3a20",
  obstacleSet: "jungle",
  accentColor: "#44aa22",
};

export const SCENERY_RUINS = {
  id:          "ruins",
  label:       "Ancient Ruins",
  cost:        40000,
  desc:        "Crumbling stone temples of the ancients",
  dayBg:       "#d4c8a0",
  nightBg:     "#0a0808",
  groundColor: "#8a7a5a",
  groundTop:   "#a89878",
  cloudColor:  "#c4b888",
  obstacleSet: "ruins",
  accentColor: "#a08050",
};

export const SCENERY_CAVE = {
  id:          "cave",
  label:       "Crystal Cave",
  cost:        75000,
  desc:        "Glowing crystals in the deep earth",
  dayBg:       "#080418",
  nightBg:     "#020108",
  groundColor: "#2a1a4a",
  groundTop:   "#3a2a6a",
  cloudColor:  "#3a2a6a",
  obstacleSet: "cave",
  accentColor: "#8844ff",
};

export const SCENERIES = [
  SCENERY_WASTELAND,
  SCENERY_GRASSLANDS,
  SCENERY_DESERT,
  SCENERY_ARCTIC,
  SCENERY_VOLCANO,
  SCENERY_JUNGLE,
  SCENERY_RUINS,
  SCENERY_CAVE,
];
