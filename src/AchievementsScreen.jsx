// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────
export const ACHIEVEMENTS = [
  { id:"first_run",    label:"First Steps",      desc:"Complete your first run",               req:(s)=>s.totalRuns>=1,       reward:10,  tier:"bronze" },
  { id:"run10",        label:"Getting Started",   desc:"Complete 10 runs",                      req:(s)=>s.totalRuns>=10,      reward:25,  tier:"bronze" },
  { id:"dist100",      label:"Century Run",       desc:"Run 100m in a single run",              req:(s)=>s.bestDist>=100,      reward:20,  tier:"bronze" },
  { id:"earn50",       label:"Bone Collector",    desc:"Earn 50 bones total",                   req:(s)=>s.totalBones>=50,     reward:15,  tier:"bronze" },
  { id:"first_upgrade",label:"Evolution Begins",  desc:"Buy your first upgrade",                req:(s)=>s.totalUpgrades>=1,   reward:15,  tier:"bronze" },
  { id:"first_skin",   label:"Fashion Forward",   desc:"Unlock a new skin",                     req:(s)=>s.ownedSkins>=2,      reward:20,  tier:"bronze" },
  { id:"combo5",       label:"Combo Starter",     desc:"Reach a x5 combo",                      req:(s)=>s.maxCombo>=5,        reward:25,  tier:"bronze" },
  { id:"run50",        label:"Seasoned Runner",   desc:"Complete 50 runs",                      req:(s)=>s.totalRuns>=50,      reward:60,  tier:"silver" },
  { id:"dist500",      label:"Long Haul",         desc:"Run 500m in a single run",              req:(s)=>s.bestDist>=500,      reward:50,  tier:"silver" },
  { id:"dist1000",     label:"Marathoner",        desc:"Run 1000m in a single run",             req:(s)=>s.bestDist>=1000,     reward:100, tier:"silver" },
  { id:"earn500",      label:"Fossil Hunter",     desc:"Earn 500 bones total",                  req:(s)=>s.totalBones>=500,    reward:75,  tier:"silver" },
  { id:"earn2000",     label:"Bone Hoarder",      desc:"Earn 2,000 bones total",                req:(s)=>s.totalBones>=2000,   reward:150, tier:"silver" },
  { id:"upgrade10",    label:"Evolving Fast",     desc:"Buy 10 upgrades",                       req:(s)=>s.totalUpgrades>=10,  reward:80,  tier:"silver" },
  { id:"combo15",      label:"Combo Artist",      desc:"Reach a x15 combo",                     req:(s)=>s.maxCombo>=15,       reward:75,  tier:"silver" },
  { id:"night3",       label:"Night Owl",         desc:"Survive 3 full night cycles",           req:(s)=>s.nightCycles>=3,     reward:80,  tier:"silver" },
  { id:"nearmiss20",   label:"Daredevil",         desc:"Land 20 near misses",                   req:(s)=>s.totalNearMiss>=20,  reward:60,  tier:"silver" },
  { id:"skin5",        label:"Collector",         desc:"Own 5 skins",                           req:(s)=>s.ownedSkins>=5,      reward:100, tier:"silver" },
  { id:"scenery3",     label:"World Traveler",    desc:"Own 3 sceneries",                       req:(s)=>s.ownedSceneries>=3,  reward:120, tier:"silver" },
  { id:"all_movement", label:"Full Mobility",     desc:"Max all movement upgrades",             req:(s)=>s.allMovementMax,     reward:200, tier:"silver" },
  { id:"run200",       label:"Unstoppable",       desc:"Complete 200 runs",                     req:(s)=>s.totalRuns>=200,     reward:250, tier:"gold" },
  { id:"dist3000",     label:"Jurassic Journey",  desc:"Run 3,000m in a single run",            req:(s)=>s.bestDist>=3000,     reward:300, tier:"gold" },
  { id:"dist5000",     label:"Epoch Runner",      desc:"Run 5,000m in a single run",            req:(s)=>s.bestDist>=5000,     reward:500, tier:"gold" },
  { id:"earn10k",      label:"Fossil Fortune",    desc:"Earn 10,000 bones total",               req:(s)=>s.totalBones>=10000,  reward:400, tier:"gold" },
  { id:"earn50k",      label:"Bone Baron",        desc:"Earn 50,000 bones total",               req:(s)=>s.totalBones>=50000,  reward:1000,tier:"gold" },
  { id:"combo30",      label:"Combo God",         desc:"Reach a x30 combo",                     req:(s)=>s.maxCombo>=30,       reward:300, tier:"gold" },
  { id:"night10",      label:"Creature of Night", desc:"Survive 10 full night cycles",          req:(s)=>s.nightCycles>=10,    reward:350, tier:"gold" },
  { id:"upgrade30",    label:"Fully Evolved",     desc:"Buy 30 upgrades total",                 req:(s)=>s.totalUpgrades>=30,  reward:400, tier:"gold" },
  { id:"all_skins",    label:"Wardrobe Complete", desc:"Own all 12 skins",                      req:(s)=>s.ownedSkins>=12,     reward:600, tier:"gold" },
  { id:"giant10",      label:"Giant Slayer",      desc:"Crush 10 obstacles as GIANT",           req:(s)=>s.giantCrushes>=10,   reward:200, tier:"gold" },
  { id:"dist15000",    label:"Endless Wanderer",  desc:"Run 15,000m in a single run",           req:(s)=>s.bestDist>=15000,    reward:2000,tier:"legend" },
  { id:"earn500k",     label:"Fossil King",       desc:"Earn 500,000 bones total",              req:(s)=>s.totalBones>=500000, reward:5000,tier:"legend" },
  { id:"run1000",      label:"The Long Game",     desc:"Complete 1,000 runs",                   req:(s)=>s.totalRuns>=1000,    reward:3000,tier:"legend" },
  { id:"combo60",      label:"Untouchable",       desc:"Reach a x60 combo in one run",          req:(s)=>s.maxCombo>=60,       reward:1500,tier:"legend" },
  { id:"nearmiss200",  label:"Ghost of the Plains",desc:"Land 200 near misses total",           req:(s)=>s.totalNearMiss>=200, reward:2000,tier:"legend" },
  { id:"dist1_nodash", label:"Pure Runner",       desc:"Run 2,000m without ever dashing",       req:(s)=>s.bestDistNoDash>=2000,reward:2500,tier:"legend" },
  { id:"all_sceneries",label:"Master Explorer",   desc:"Own all sceneries",                     req:(s)=>s.ownedSceneries>=8,  reward:4000,tier:"legend" },
  { id:"passive100",   label:"The Idle One",      desc:"Earn 100 bones passively in one session",req:(s)=>s.passiveEarned>=100,reward:1500,tier:"legend" },
];

const tierColors = { bronze:"#cd7f32", silver:"#aaa", gold:"#d4a820", legend:"#9944cc" };

export default function AchievementsScreen({ unlockedAch, notification, achivNotif, onBack, F, BG, DARK, BORDER, MUTED }) {
  const outer = { minHeight:"100vh", background:BG, fontFamily:F, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", userSelect:"none", boxSizing:"border-box", width:"100%", overflowX:"hidden" };
  const wrap  = { width:"100%", maxWidth:600, padding:"20px 16px", boxSizing:"border-box", margin:"0 auto" };
  const btn   = { background:BG, color:DARK, border:`2px solid ${BORDER}`, padding:"10px 20px", fontSize:12, fontFamily:F, cursor:"pointer", letterSpacing:2, fontWeight:"bold", boxSizing:"border-box" };
  const notifBox     = { position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:DARK, color:BG, padding:"9px 22px", fontSize:11, letterSpacing:2, zIndex:999, whiteSpace:"nowrap", border:`1px solid #555` };
  const achivNotifBox= { position:"fixed", top:24,   left:"50%", transform:"translateX(-50%)", background:"#1a1a2a", color:"#ffdd44", padding:"10px 24px", fontSize:11, letterSpacing:2, zIndex:999, whiteSpace:"nowrap", border:`1px solid #ffdd44` };

  return (
    <div style={outer}>
      <div style={wrap}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:4, color:MUTED }}>HALL OF FAME</div>
            <div style={{ fontSize:20, fontWeight:"bold", letterSpacing:2 }}>ACHIEVEMENTS</div>
          </div>
          <div style={{ fontSize:12, color:MUTED }}>{unlockedAch.length}/{ACHIEVEMENTS.length}</div>
        </div>
        {["bronze","silver","gold","legend"].map(tier => {
          const tierAchs = ACHIEVEMENTS.filter(a => a.tier === tier);
          return (
            <div key={tier} style={{ marginBottom:18 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <div style={{ width:10, height:10, background:tierColors[tier] }}/>
                <span style={{ fontSize:10, letterSpacing:3, color:tierColors[tier], fontWeight:"bold" }}>{tier.toUpperCase()}</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                {tierAchs.map(a => {
                  const done = unlockedAch.includes(a.id);
                  return (
                    <div key={a.id} style={{ background:done?"#faf8f4":"#ebe8e2", border:`1px solid ${done?tierColors[a.tier]:"#ccc"}`, padding:"10px", boxSizing:"border-box", opacity:done?1:0.5 }}>
                      <div style={{ fontSize:11, fontWeight:"bold", marginBottom:3, color:done?DARK:MUTED }}>{a.label}</div>
                      <div style={{ fontSize:9, color:MUTED, marginBottom:5, lineHeight:1.6 }}>{a.desc}</div>
                      <div style={{ fontSize:9, color:done?tierColors[a.tier]:MUTED, fontWeight:"bold" }}>
                        {done ? "UNLOCKED" : `+${a.reward} bones`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <button style={{ ...btn, width:"100%" }} onClick={onBack}>[ BACK ]</button>
      </div>
      {notification  && <div style={notifBox}>{notification}</div>}
      {achivNotif    && <div style={achivNotifBox}>{achivNotif}</div>}
    </div>
  );
}
