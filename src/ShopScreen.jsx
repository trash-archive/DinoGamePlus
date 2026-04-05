import { useState } from "react";
import { drawPowerupIcon } from "./rendering/drawPowerups";
import { drawUpgradeIcon, drawLockIcon } from "./rendering/drawUpgradeIcons";
import { UPGRADES, UPGRADE_CATS, POWERUP_DEFS, getUpgradeCost } from "./data/gameData";
import { playClick } from "./hooks/useSoundEffects";

const F      = "'Courier New', monospace";
const BG     = "#f0ede6";
const DARK   = "#1a1a1a";
const BORDER = "#2a2a2a";
const MUTED  = "#888";

// Each powerup maps to its own dedicated upgrade id
const PW_UPGRADE_MAP = {
  shield_pw:    ["pwShieldDur"],
  giant_pw:     ["pwGiantDur"],
  magnet_pw:    ["pwMagnetRng"],
  frenzy_pw:    ["pwFrenzyDur"],
  coinmania_pw: ["pwWindfallDur"],
  ghost_pw:     ["pwGhostDur"],
  tiny_pw:      ["pwTinyDur"],
  meteor_pw:    ["pwMeteorCount"],
  doubler_pw:   ["pwDoublerDur"],
  heart_pw:     ["pwHeartChance"],
  slowmo_pw:    ["pwSlowDur"],
};

export default function ShopScreen({
  fossils, passiveRate,
  shopTab, setShopTab,
  upgradeLevels,
  unlockedPowerups,
  buyUpgrade, unlockPowerup,
  stats,
  startGame, setScreen,
  notification, achivNotif,
  abyssUnlocked,
  startBossFight,
  activeScenery,
}) {
  const outer = { minHeight:"100vh", background:BG, fontFamily:F, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", userSelect:"none", boxSizing:"border-box", width:"100%", overflowX:"hidden" };
  const wrap  = { width:"100%", maxWidth:620, padding:"20px 16px", boxSizing:"border-box", margin:"0 auto" };
  const btn   = (primary=false, small=false) => ({ background:primary?DARK:BG, color:primary?BG:DARK, border:`2px solid ${BORDER}`, padding:small?"5px 12px":"10px 20px", fontSize:small?10:12, fontFamily:F, cursor:"pointer", letterSpacing:2, fontWeight:"bold", boxSizing:"border-box", transition:"opacity 0.1s" });
  const notifBox     = { position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:DARK, color:BG, padding:"9px 22px", fontSize:11, letterSpacing:2, zIndex:999, whiteSpace:"nowrap", border:"1px solid #555" };
  const achivNotifBox= { position:"fixed", top:24,    left:"50%", transform:"translateX(-50%)", background:"#1a1a2a", color:"#ffdd44", padding:"10px 24px", fontSize:11, letterSpacing:2, zIndex:999, whiteSpace:"nowrap", border:"1px solid #ffdd44" };

  const catUpgrades = UPGRADES.filter(u => u.cat === shopTab);

  // Dash Cooldown requires at least one dash unlocked
  // Speed Bonus requires Fossil Trail unlocked
  const isLocked = (up) =>
    (up.id === "dashCd"   && !(upgradeLevels.dash >= 1) && !(upgradeLevels.backdash >= 1)) ||
    (up.id === "speedBonus" && !(upgradeLevels.runDrip >= 1));

  const noOwnedPowerups = unlockedPowerups.length === 0;
  const [statsOpen, setStatsOpen] = useState(false);

  return (
    <div style={outer}>
      <div style={wrap}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:4, color:MUTED }}>UPGRADE LAB</div>
            <div style={{ fontSize:20, fontWeight:"bold", letterSpacing:2 }}>FOSSIL SHOP</div>
          </div>
          <div style={{ textAlign:"right", display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:16 }}>◈</span>
            <div>
              <div style={{ fontSize:16, fontWeight:"bold" }}>{Math.floor(fossils)}</div>
              {passiveRate > 0 && <div style={{ fontSize:9, color:MUTED }}>+{passiveRate.toFixed(1)}/sec</div>}
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap" }}>
          {UPGRADE_CATS.map(cat => (
            <button key={cat} style={btn(shopTab===cat, true)} onClick={() => { playClick(); setShopTab(cat); }}>
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Regular upgrades (non-powerups) */}
        {shopTab !== "powerups" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
            {catUpgrades.filter(up => !up.abyssOnly || abyssUnlocked).map(up => {
              const level     = upgradeLevels[up.id] || 0;
              const maxed     = level >= up.maxLevel;
              const locked    = isLocked(up);
              const cost      = maxed ? 0 : getUpgradeCost(up, level);
              const canAfford = !locked && fossils >= cost;
              const iconCol   = up.color || DARK;
              return (
                <div key={up.id}
                  onClick={() => { if(locked){ playClick(); } else if(!maxed){ playClick(); buyUpgrade(up); } }}
                  style={{ background:maxed?"#ebe8e2":locked?"#eeeae4":"#faf8f4", border:`2px solid ${maxed||locked?"#ccc":canAfford?BORDER:"#ccc"}`, padding:"11px", cursor:locked?"default":maxed?"default":canAfford?"pointer":"not-allowed", opacity:maxed?0.65:locked?0.45:1, boxSizing:"border-box" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, alignItems:"flex-start" }}>
                    <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                      {up.color
                        ? <canvas width={22} height={22} style={{ display:"block", flexShrink:0, background:"transparent" }}
                            ref={el => { if(!el) return; const c=el.getContext("2d"); c.clearRect(0,0,22,22); drawUpgradeIcon(c, up.id, 0, 0, locked?"#aaa":iconCol); }}/>
                        : <span style={{ fontSize:14, color:DARK }}>{up.icon}</span>
                      }
                      <span style={{ fontSize:11, fontWeight:"bold" }}>{up.label}</span>
                    </div>
                    <span style={{ fontSize:9, color:MUTED }}>{locked ? "" : `${level}/${up.maxLevel}`}</span>
                  </div>
                  <div style={{ fontSize:10, color:MUTED, marginBottom:7, lineHeight:1.6 }}>
                    {locked
                      ? up.id === "speedBonus" ? "Requires Fossil Trail" : "Requires Forward Dash or Back Dash"
                      : up.desc}
                  </div>
                  <div style={{ height:2, background:"#e0ddd8", marginBottom:7, overflow:"hidden" }}>
                    <div style={{ height:"100%", background:locked?"#ccc":DARK, width:`${Math.min(100,(level/up.maxLevel)*100)}%` }}/>
                  </div>
                  <div style={{ fontSize:11, fontWeight:"bold", color:maxed||locked?"#bbb":canAfford?DARK:"#bbb" }}>
                    {maxed ? "MAX" : locked ? "LOCKED" : `◈ ${cost}`}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Powerups tab */}
        {shopTab === "powerups" && (() => {
          const luckUp = UPGRADES.find(u => u.id === "powerupLuck");
          const luckLevel = upgradeLevels[luckUp?.id] || 0;
          const luckMaxed = luckLevel >= (luckUp?.maxLevel || 1);
          const luckCost  = luckMaxed ? 0 : getUpgradeCost(luckUp, luckLevel);
          const luckAfford = fossils >= luckCost;
          return (
          <div style={{ marginBottom:14 }}>
            {/* Standalone Powerup Luck card */}
            {luckUp && (() => {
              const luckLocked = noOwnedPowerups;
              return (
              <div onClick={() => { if(!luckMaxed && !luckLocked){ playClick(); buyUpgrade(luckUp); } }}
                style={{ background:luckMaxed?"#ebe8e2":luckLocked?"#eeeae4":"#faf8f4", border:`2px solid ${luckMaxed||luckLocked?"#ccc":luckAfford?BORDER:"#ccc"}`, padding:"11px", marginBottom:10, cursor:luckMaxed||luckLocked?"default":luckAfford?"pointer":"not-allowed", opacity:luckMaxed?0.65:luckLocked?0.45:1, boxSizing:"border-box" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, alignItems:"center" }}>
                  <span style={{ fontSize:11, fontWeight:"bold", color:luckLocked?"#aaa":luckUp.color }}>★ {luckUp.label}</span>
                  <span style={{ fontSize:9, color:MUTED }}>{luckLocked ? "" : `${luckLevel}/${luckUp.maxLevel}`}</span>
                </div>
                <div style={{ fontSize:10, color:MUTED, marginBottom:7 }}>{luckLocked ? "Unlock at least one powerup first" : luckUp.desc}</div>
                <div style={{ height:2, background:"#e0ddd8", marginBottom:7, overflow:"hidden" }}>
                  <div style={{ height:"100%", background:luckLocked?"#ccc":luckUp.color, width:`${Math.min(100,(luckLevel/luckUp.maxLevel)*100)}%` }}/>
                </div>
                <div style={{ fontSize:11, fontWeight:"bold", color:luckMaxed||luckLocked?"#bbb":luckAfford?DARK:"#bbb" }}>
                  {luckMaxed ? "MAX" : luckLocked ? "LOCKED" : `◈ ${luckCost}`}
                </div>
              </div>
              );
            })()}
            {/* Powerup cards grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {POWERUP_DEFS.map(def => {
              const owned           = unlockedPowerups.includes(def.id);
              const canAffordUnlock = fossils >= def.unlockCost;
              const relatedUps      = (PW_UPGRADE_MAP[def.id] || [])
                .map(uid => UPGRADES.find(u => u.id === uid))
                .filter(Boolean);
              const anyAffordable   = owned && relatedUps.some(up => {
                const lvl = Math.min(upgradeLevels[up.id]||0, up.maxLevel);
                return lvl < up.maxLevel && fossils >= getUpgradeCost(up, lvl);
              });

              return (
                <div key={def.id} style={{
                  background: owned ? "#faf8f4" : "#f5f2ec",
                  border: `2px solid ${owned ? (anyAffordable ? BORDER : "#ccc") : canAffordUnlock ? "#aaa" : "#ccc"}`,
                  padding: "11px",
                  boxSizing: "border-box",
                  opacity: !owned && !canAffordUnlock ? 0.6 : 1,
                }}>
                  {/* Header: icon + name + desc */}
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8 }}>
                    <canvas width={22} height={22} style={{ display:"block", flexShrink:0, background:"transparent" }}
                      ref={el => { if(!el) return; const c=el.getContext("2d"); c.clearRect(0,0,22,22); drawPowerupIcon(c,def.id,0,0,def.color); }}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:11, fontWeight:"bold", letterSpacing:1 }}>{def.label}</div>
                      <div style={{ fontSize:9, color:MUTED, lineHeight:1.4 }}>{def.desc}</div>
                    </div>
                  </div>

                  {/* Not yet unlocked: show unlock button */}
                  {!owned && (
                    <div onClick={() => { if(canAffordUnlock) { playClick(); unlockPowerup(def); } }}
                      style={{
                        fontSize:10, fontWeight:"bold", padding:"6px 8px",
                        background: canAffordUnlock ? DARK : "#bbb",
                        color: "#f0ede6",
                        cursor: canAffordUnlock ? "pointer" : "not-allowed",
                        textAlign:"center", letterSpacing:1,
                        border: canAffordUnlock ? "none" : "1px solid #aaa",
                      }}>
                      {`◈ ${def.unlockCost}  UNLOCK`}
                    </div>
                  )}

                  {/* Owned: show inline upgrades */}
                  {owned && relatedUps.map(up => {
                    const level     = Math.min(upgradeLevels[up.id] || 0, up.maxLevel);
                    const maxed     = level >= up.maxLevel;
                    const cost      = maxed ? 0 : getUpgradeCost(up, level);
                    const canAfford = fossils >= cost;
                    return (
                      <div key={up.id} onClick={() => { if(!maxed) { playClick(); buyUpgrade(up); } }}
                        style={{ borderTop:"1px solid #ddd", paddingTop:7, cursor:maxed?"default":canAfford?"pointer":"not-allowed", opacity:maxed?0.65:canAfford?1:0.5 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                          <span style={{ fontSize:10, fontWeight:"bold" }}>{up.label}</span>
                          <span style={{ fontSize:9, color:MUTED }}>{level}/{up.maxLevel}</span>
                        </div>
                        <div style={{ fontSize:9, color:MUTED, marginBottom:5, lineHeight:1.4 }}>{up.desc}</div>
                        <div style={{ height:2, background:"#e0ddd8", marginBottom:5, overflow:"hidden" }}>
                          <div style={{ height:"100%", background:def.color, width:`${Math.min(100,(level/up.maxLevel)*100)}%` }}/>
                        </div>
                        <div style={{ fontSize:10, fontWeight:"bold", color:maxed?"#bbb":canAfford?DARK:"#bbb" }}>
                          {maxed ? "MAX" : `◈ ${cost}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
            </div>
          </div>
          );
        })()}

        {/* Current stats panel */}
        <div style={{ border:"1px solid #ddd", background:"#f5f2ec", marginBottom:12, fontSize:10, color:MUTED }}>
          <div onClick={() => setStatsOpen(o => !o)}
            style={{ padding:"10px 12px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", userSelect:"none" }}>
            <span style={{ letterSpacing:3, fontSize:9 }}>CURRENT STATS</span>
            <span style={{ fontSize:11, color:MUTED }}>{statsOpen ? "▲" : "▼"}</span>
          </div>
          {statsOpen && (
            <div style={{ padding:"0 12px 12px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:5, marginBottom:8 }}>
                {[
                  ["Fossil/pick",  `${stats.fossilValue}`],
                  ["Sense x",      `${stats.fossilSenseMult.toFixed(2)}`],
                  ["Pickup x",     `${stats.fossilPickupMult}x`],
                  stats.passiveFossils > 0 && ["Passive", `${stats.passiveFossils.toFixed(2)}/s`],
                  stats.runDripRate > 0    && ["Trail",   `${(stats.runDripRate*1000).toFixed(1)}/s`],
                  stats.comboBonus > 0     && ["Combo+",  `${stats.comboBonus.toFixed(2)}`],
                  stats.nightBonus > 0     && ["Night+",  `${(stats.nightBonus*100).toFixed(0)}%`],
                  stats.transBonus > 0     && ["Cycle+",  `${(stats.transBonus*100).toFixed(0)}%`],
                  stats.jumpBoost > 0      && ["Jump",    `+${stats.jumpBoost.toFixed(1)}`],
                  stats.shieldChance > 0   && ["Block%",  `${(stats.shieldChance*100).toFixed(0)}%`],
                  stats.invFramesBonus > 0 && ["I-Frames",`+${stats.invFramesBonus}`],
                  stats.extraLives > 0     && ["+Lives",  `${stats.extraLives}`],
                  stats.shieldHits > 1     && ["Shield",  `${stats.shieldHits} hits`],
                  stats.rareDrop > 0       && ["PwLuck",  `+${(stats.rareDrop*100).toFixed(0)}%`],
                  stats.heartChance > 0    && ["Heart%",  `+${(stats.heartChance*100).toFixed(0)}%`],
                  stats.magnetLevel > 0    && ["Magnet",  `${55+stats.magnetLevel*28}px`],
                ].filter(Boolean).map(([l,v]) => (
                  <div key={l}><span style={{ color:"#aaa" }}>{l}: </span><b style={{ color:DARK }}>{v}</b></div>
                ))}
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                {[
                  stats.hasDoubleJump && "DBL JUMP",
                  stats.hasDash       && "DASH FWD",
                  stats.hasBackDash   && "DASH BCK",
                  stats.hasFastDrop   && "FAST DROP",
                  stats.hasDuck       && "DUCK",
                  stats.hasMagnet     && "MAGNET",
                ].filter(Boolean).map(s => (
                  <span key={s} style={{ background:DARK, color:BG, fontSize:9, padding:"2px 7px", letterSpacing:1 }}>{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div style={{ display:"flex", gap:8 }}>
          {activeScenery === "abyss" && abyssUnlocked
            ? <button style={{ ...btn(true), flex:1, background:"#b52d2d", color:"#ffffff", border:"2px solid #b52d2d" }} onClick={() => { playClick(); startBossFight(); }}>[ BATTLE ]</button>
            : <button style={{ ...btn(true), flex:1 }} onClick={() => { playClick(); startGame(); }}>[ RUN ]</button>
          }
          <button style={{ ...btn(false), flex:1 }} onClick={() => { playClick(); setScreen("menu"); }}>[ MENU ]</button>
        </div>
      </div>
      {notification  && <div style={notifBox}>{notification}</div>}
      {achivNotif    && <div style={achivNotifBox}>{achivNotif}</div>}
    </div>
  );
}
