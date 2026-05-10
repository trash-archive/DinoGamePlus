// ─── BOSS CONSTANTS ───────────────────────────────────────────────────────────
import { CANVAS_W, GROUND_Y } from "../constants";
import { SCENERIES }          from "../data/collectionData.jsx";
import { getHudColors }       from "../utils/scenery";

export const BOSS_MAX_HP   = 15;
export const WIN_REWARD    = 5000;
export const BOSS_X        = CANVAS_W * 0.72;
export const BOSS_Y        = GROUND_Y - 60;
export const BITE_RANGE    = [220, 170, 130]; // per phase — gets tighter each phase

// per-phase tuning tables
export const BLIND_DURATION  = [75, 52, 36];  // frames the blind window stays open
export const BARRAGE_GAP     = [90, 60, 35];  // frames between barrages
export const TELEPORT_FLICKER= [35, 26, 16];  // flicker frames before snap

// ─── TELEPORT POSITIONS ───────────────────────────────────────────────────────
export const BOSS_POSITIONS = {
  right:  CANVAS_W * 0.72,   // default
  center: CANVAS_W * 0.50,
  left:   CANVAS_W * 0.28,
};
export const ABYSS_SCENERY = SCENERIES.find(s => s.id === "abyss") || SCENERIES[0];
export const HUD           = getHudColors(ABYSS_SCENERY, 1);

// ─── ATTACK POOL ──────────────────────────────────────────────────────────────
export const ATTACK_POOL = [
  { type:"wave_low",       dodge:"JUMP!",        duration:180, warmup:60 },
  { type:"wave_high",      dodge:"DUCK!",        duration:180, warmup:60 },
  { type:"aimed_shot",     dodge:"DASH!",        duration:120, warmup:50 },
  { type:"ground_slam",    dodge:"JUMP!",        duration:150, warmup:70 },
  { type:"ceiling_drop",   dodge:"STAY LOW!",    duration:150, warmup:70 },
  { type:"void_orb",       dodge:"MOVE!",        duration:200, warmup:40 },
  { type:"tentacle",       dodge:"JUMP HIGH!",   duration:160, warmup:55 },
  { type:"tentacle_sweep", dodge:"JUMP!",        duration:170, warmup:65 },
  { type:"tentacle_combo", dodge:"JUMP+DUCK!",   duration:220, warmup:55 },
  { type:"ground_pound",   dodge:"JUMP!",        duration:180, warmup:75 },
  { type:"void_burst",     dodge:"FIND THE GAP!",duration:160, warmup:55 },
  { type:"tracking_beam",  dodge:"JUMP/DUCK!",   duration:240, warmup:80 },
  { type:"spike_rain",     dodge:"FIND SAFE!",   duration:200, warmup:70 },
];

export const ATTACKS_BY_PHASE = [
  ATTACK_POOL.slice(0, 3),
  [...ATTACK_POOL.slice(0, 5), ATTACK_POOL[7], ATTACK_POOL[9], ATTACK_POOL[10]],
  ATTACK_POOL,
];

export const BARRAGE_SIZE = [2, 4, 5];

export function pickAttack(phase) {
  const pool = ATTACKS_BY_PHASE[phase];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function buildBarrage(phase) {
  const size = BARRAGE_SIZE[phase];
  return Array.from({ length: size }, () => pickAttack(phase));
}

// ─── INITIAL STATE ────────────────────────────────────────────────────────────
import { GROUND_Y as GY, DINO_H } from "../constants";

export function initBossState(stats, skin, design, lives) {
  return {
    dino: {
      x: 80, y: GY - DINO_H, vy: 0,
      onGround: true, doubleJumped: false,
      dashTimer: 0, dashDir: 0, dashCooldown: 0,
      ducking: false, invTimer: 0,
    },
    lives, stats, skin, design,
    bossHp:      BOSS_MAX_HP,
    bossPhase:   0,
    hitFlash:    0,
    barrage:     [], attackIndex: 0, attackTimer: 0,
    blindTimer:  0, blindWindow: false, barrageGap: 0,
    projectiles: [],
    particles:   [],
    shake:       { x: 0, y: 0, trauma: 0 },
    phaseFlash:  0,
    biteCooldown:0, biteFlash: 0,
    bossOpen:    false, biteAnim: 0,
    bossX: CANVAS_W * 0.72, bossY: GROUND_Y - 60,
    teleportFlicker: 0, teleportTarget: null,
    frame:       0, groundOffset: 0,
    alive:       true, won: false,
    floatingTexts: [],
  };
}
