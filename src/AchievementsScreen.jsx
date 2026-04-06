// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────
import { playClick } from "./hooks/useSoundEffects";
export const ACHIEVEMENTS = [
  { id:"first_run",    label:"First Steps",           desc:"Complete your first run",               req:(s)=>s.totalRuns>=1,       reward:5,   tier:"bronze" },
  { id:"run10",        label:"Getting Started",        desc:"Complete 10 runs",                      req:(s)=>s.totalRuns>=10,      reward:10,  tier:"bronze" },
  { id:"dist100",      label:"Century Run",            desc:"Run 100m in a single run",              req:(s)=>s.bestDist>=100,      reward:5,   tier:"bronze" },
  { id:"earn50",       label:"Fossil Collector",        desc:"Earn 50 fossils total",                  req:(s)=>s.totalBones>=50,     reward:10,  tier:"bronze" },
  { id:"first_upgrade",label:"Evolution Begins",       desc:"Buy your first upgrade",                req:(s)=>s.totalUpgrades>=1,   reward:5,   tier:"bronze" },
  { id:"first_skin",   label:"Fashion Forward",        desc:"Unlock a new skin",                     req:(s)=>s.ownedSkins>=2,      reward:20,  tier:"bronze" },
  { id:"combo5",       label:"Combo Starter",          desc:"Reach a x5 combo",                      req:(s)=>s.maxCombo>=5,        reward:15,  tier:"bronze" },
  { id:"run50",        label:"Seasoned Runner",        desc:"Complete 50 runs",                      req:(s)=>s.totalRuns>=50,      reward:20,  tier:"silver" },
  { id:"dist500",      label:"Long Haul",              desc:"Run 500m in a single run",              req:(s)=>s.bestDist>=500,      reward:10,  tier:"silver" },
  { id:"dist1000",     label:"Marathoner",             desc:"Run 1000m in a single run",             req:(s)=>s.bestDist>=1000,     reward:20,  tier:"silver" },
  { id:"earn500",      label:"Fossil Hunter",          desc:"Earn 500 fossils total",                req:(s)=>s.totalBones>=500,    reward:30,  tier:"silver" },
  { id:"earn2000",     label:"Fossil Hoarder",          desc:"Earn 2,000 fossils total",              req:(s)=>s.totalBones>=2000,   reward:150, tier:"silver" },
  { id:"upgrade10",    label:"Evolving Fast",          desc:"Buy 10 upgrades",                       req:(s)=>s.totalUpgrades>=10,  reward:15,  tier:"silver" },
  { id:"combo15",      label:"Combo Artist",           desc:"Reach a x15 combo",                     req:(s)=>s.maxCombo>=15,       reward:30,  tier:"silver" },
  { id:"night3",       label:"Night Owl",              desc:"Survive 3 full night cycles",           req:(s)=>s.nightCycles>=3,     reward:20,  tier:"silver" },
  { id:"skin5",        label:"Collector",              desc:"Own 5 skins",                           req:(s)=>s.ownedSkins>=5,      reward:100, tier:"silver" },
  { id:"scenery3",     label:"World Traveler",         desc:"Own 3 sceneries",                       req:(s)=>s.ownedSceneries>=3,  reward:120, tier:"silver" },
  { id:"all_movement", label:"Full Mobility",          desc:"Max all movement upgrades",             req:(s)=>s.allMovementMax,     reward:200, tier:"silver" },
  { id:"use_shield_100",label:"Bubble Boy",            desc:"Use Shield powerup 100 times",          req:(s)=>(s.powerupUses?.shield_pw||0)>=100,  reward:40,  tier:"silver" },
  { id:"run200",       label:"Unstoppable",            desc:"Complete 200 runs",                     req:(s)=>s.totalRuns>=200,     reward:190, tier:"gold" },
  { id:"dist3000",     label:"Jurassic Journey",       desc:"Run 3,000m in a single run",            req:(s)=>s.bestDist>=3000,     reward:100, tier:"gold" },
  { id:"dist5000",     label:"Epoch Runner",           desc:"Run 5,000m in a single run",            req:(s)=>s.bestDist>=5000,     reward:230, tier:"gold" },
  { id:"earn10k",      label:"Fossil Fortune",         desc:"Earn 10,000 fossils total",             req:(s)=>s.totalBones>=10000,  reward:400, tier:"gold" },
  { id:"earn50k",      label:"Fossil Baron",            desc:"Earn 50,000 fossils total",             req:(s)=>s.totalBones>=50000,  reward:1000,tier:"gold" },
  { id:"combo30",      label:"Combo God",              desc:"Reach a x30 combo",                     req:(s)=>s.maxCombo>=30,       reward:300, tier:"gold" },
  { id:"night10",      label:"Creature of Night",      desc:"Survive 10 full night cycles",          req:(s)=>s.nightCycles>=10,    reward:350, tier:"gold" },
  { id:"upgrade30",    label:"Fully Evolved",          desc:"Buy 30 upgrades total",                 req:(s)=>s.totalUpgrades>=30,  reward:150, tier:"gold" },
  { id:"all_skins",    label:"Wardrobe Complete",      desc:"Own all 12 skins",                      req:(s)=>s.ownedSkins>=12,     reward:600, tier:"gold" },
  { id:"giant10",      label:"Giant Slayer",           desc:"Crush 200 obstacles as GIANT",          req:(s)=>s.giantCrushes>=200,  reward:120, tier:"gold" },
  { id:"playtime1h",   label:"Just One More Run",      desc:"Spend 1 hour playing",                  req:(s)=>(s.totalPlayTime||0)>=3600,   reward:200, tier:"gold" },
  { id:"use_giant_500",label:"Big Guy Energy",         desc:"Use Giant powerup 500 times",           req:(s)=>(s.powerupUses?.giant_pw||0)>=500,   reward:400, tier:"gold" },
  { id:"use_ghost_200",label:"You Can't See Me",       desc:"Use Ghost powerup 200 times",           req:(s)=>(s.powerupUses?.ghost_pw||0)>=200,   reward:350, tier:"gold" },
  { id:"use_any_1000", label:"Button Masher",          desc:"Use any powerup 1,000 times total",     req:(s)=>(s.totalPowerupUses||0)>=1000,       reward:500, tier:"gold" },
  { id:"dino_raptor_10k",  label:"Zoom Zoom",          desc:"Reach 10,000m as Raptor",               req:(s)=>(s.dinoDistances?.raptor||0)>=10000,   reward:400, tier:"gold" },
  { id:"dino_trex_10k",    label:"Tiny Arms, Big Dreams",desc:"Reach 10,000m as T-Rex",             req:(s)=>(s.dinoDistances?.trex||0)>=10000,     reward:400, tier:"gold" },
  { id:"dino_stego_10k",   label:"Plate Carrier",      desc:"Reach 10,000m as Stegosaurus",          req:(s)=>(s.dinoDistances?.stego||0)>=10000,    reward:400, tier:"gold" },
  { id:"dino_pterodac_10k",label:"Frequent Flyer",     desc:"Reach 10,000m as Pterodactyl",          req:(s)=>(s.dinoDistances?.pterodac||0)>=10000, reward:400, tier:"gold" },
  { id:"dino_anky_10k",    label:"Wrecking Ball",      desc:"Reach 10,000m as Ankylosaurus",         req:(s)=>(s.dinoDistances?.anky||0)>=10000,     reward:400, tier:"gold" },
  { id:"dino_tri_10k",     label:"Three-Pointer",      desc:"Reach 10,000m as Triceratops",          req:(s)=>(s.dinoDistances?.tri||0)>=10000,      reward:400, tier:"gold" },
  { id:"dino_brachio_10k", label:"Long Neck, Longer Run",desc:"Reach 10,000m as Brachiosaurus",     req:(s)=>(s.dinoDistances?.brachio||0)>=10000,  reward:400, tier:"gold" },
  { id:"dino_spino_10k",   label:"Sail Through It",    desc:"Reach 10,000m as Spinosaurus",          req:(s)=>(s.dinoDistances?.spino||0)>=10000,    reward:400, tier:"gold" },
  { id:"dino_pachy_10k",   label:"Hardheaded",         desc:"Reach 10,000m as Pachycephalosaurus",   req:(s)=>(s.dinoDistances?.pachy||0)>=10000,    reward:400, tier:"gold" },
  { id:"dino_para_10k",    label:"Honk If You're Fast",desc:"Reach 10,000m as Parasaurolophus",      req:(s)=>(s.dinoDistances?.para||0)>=10000,     reward:400, tier:"gold" },
  { id:"dino_dilopho_10k", label:"Phase Me If You Can",desc:"Reach 10,000m as Dilophosaurus",        req:(s)=>(s.dinoDistances?.dilopho||0)>=10000,  reward:400, tier:"gold" },
  { id:"dist15000",    label:"Endless Wanderer",       desc:"Run 15,000m in a single run",           req:(s)=>s.bestDist>=15000,    reward:2000,tier:"legend" },
  { id:"earn500k",     label:"Fossil King",            desc:"Earn 500,000 fossils total",            req:(s)=>s.totalBones>=500000, reward:5000,tier:"legend" },
  { id:"run1000",      label:"The Long Game",          desc:"Complete 1,000 runs",                   req:(s)=>s.totalRuns>=1000,    reward:3000,tier:"legend" },
  { id:"combo60",      label:"Combo Legend",           desc:"Reach a x60 combo in one run",          req:(s)=>s.maxCombo>=60,       reward:1500,tier:"legend" },
  { id:"dist1_nodash", label:"Pure Runner",            desc:"Run 2,000m without ever dashing",       req:(s)=>s.bestDistNoDash>=2000,reward:1500,tier:"legend" },
  { id:"all_sceneries",label:"Master Explorer",        desc:"Own all sceneries",                     req:(s)=>s.ownedSceneries>=8,  reward:4000,tier:"legend" },
  { id:"passive10k",   label:"The Idle One",           desc:"Earn 10,000 fossils passively in one session",req:(s)=>s.passiveEarned>=10000,reward:500,tier:"legend" },
  { id:"playtime10h",  label:"Send Help",              desc:"Spend 10 hours playing",                req:(s)=>(s.totalPlayTime||0)>=36000,  reward:2000,tier:"legend" },
  { id:"use_any_5000", label:"Powerup Hoarder",        desc:"Use any powerup 5,000 times total",     req:(s)=>(s.totalPowerupUses||0)>=5000,       reward:3000,tier:"legend" },
  { id:"hasim_kills",  label:"I Hate That Guy",        desc:"Die 150 times as Hasim",                req:(s)=>(s.hasimKills||0)>=150,              reward:2500,tier:"legend" },
  { id:"dino_hasim_10k",   label:"He Actually Did It",desc:"Reach 10,000m as Hasim",                req:(s)=>(s.dinoDistances?.hasim||0)>=10000,    reward:1000,tier:"legend" },
  { id:"all_dinos_10k",    label:"Dino Daycare Graduate",desc:"Reach 10,000m with every single dino",req:(s)=>["raptor","trex","stego","pterodac","anky","tri","brachio","spino","pachy","para","dilopho","hasim"].every(id=>(s.dinoDistances?.[id]||0)>=10000), reward:5000,tier:"legend" },
  { id:"playtime50h",  label:"I Live Here Now",        desc:"Spend 50 hours playing",                req:(s)=>(s.totalPlayTime||0)>=180000, reward:10000,tier:"legend" },
  { id:"untouchable",  label:"Are You Even Real?",     desc:"Run 20,000m without taking a single hit or activating a shield", req:(s)=>s.bestDistNoHit>=20000, reward:300,  tier:"impossible" },
  { id:"get_a_partner",label:"Get a Girlfriend/Boyfriend", desc:"Start talking with someone bro, you can do it. Probably.", req:(s)=>s.menuIdleUnlock===true, reward:1, rewardLabel:"1 hope", tier:"impossible" },
];

const tierColors = { bronze:"#cd7f32", silver:"#aaa", gold:"#d4a820", legend:"#9944cc", impossible:"#ff2244" };

const TierIcon = ({ tier, BG }) => {
  const c = tierColors[tier];
  if(tier==="bronze") return (
    <svg width="14" height="14" viewBox="0 0 7 7" shapeRendering="crispEdges" fill="none">
      <rect x="2" y="0" width="3" height="1" fill={c}/>
      <rect x="1" y="1" width="5" height="1" fill={c}/>
      <rect x="0" y="2" width="7" height="3" fill={c}/>
      <rect x="1" y="5" width="5" height="1" fill={c}/>
      <rect x="2" y="6" width="3" height="1" fill={c}/>
    </svg>
  );
  if(tier==="silver") return (
    <svg width="14" height="14" viewBox="0 0 7 7" shapeRendering="crispEdges" fill="none">
      <rect x="2" y="0" width="3" height="1" fill={c}/>
      <rect x="1" y="1" width="1" height="1" fill={c}/><rect x="5" y="1" width="1" height="1" fill={c}/>
      <rect x="0" y="2" width="1" height="3" fill={c}/><rect x="6" y="2" width="1" height="3" fill={c}/>
      <rect x="1" y="5" width="1" height="1" fill={c}/><rect x="5" y="5" width="1" height="1" fill={c}/>
      <rect x="2" y="6" width="3" height="1" fill={c}/>
      <rect x="2" y="2" width="3" height="3" fill={c} opacity="0.35"/>
    </svg>
  );
  if(tier==="gold") return (
    <svg width="14" height="14" viewBox="0 0 7 7" shapeRendering="crispEdges" fill="none">
      <rect x="3" y="0" width="1" height="1" fill={c}/>
      <rect x="2" y="1" width="3" height="1" fill={c}/>
      <rect x="0" y="2" width="7" height="1" fill={c}/>
      <rect x="1" y="3" width="5" height="1" fill={c}/>
      <rect x="0" y="4" width="7" height="1" fill={c}/>
      <rect x="2" y="5" width="3" height="1" fill={c}/>
      <rect x="3" y="6" width="1" height="1" fill={c}/>
    </svg>
  );
  if(tier==="legend") return (
    <svg width="14" height="14" viewBox="0 0 7 7" shapeRendering="crispEdges" fill="none">
      <rect x="3" y="0" width="1" height="2" fill={c}/>
      <rect x="0" y="2" width="7" height="1" fill={c}/>
      <rect x="1" y="3" width="5" height="2" fill={c}/>
      <rect x="0" y="5" width="3" height="1" fill={c}/><rect x="4" y="5" width="3" height="1" fill={c}/>
      <rect x="0" y="6" width="2" height="1" fill={c}/><rect x="5" y="6" width="2" height="1" fill={c}/>
    </svg>
  );
  if(tier==="impossible") return (
    <svg width="14" height="14" viewBox="0 0 7 8" shapeRendering="crispEdges" fill="none">
      {/* skull dome */}
      <rect x="1" y="0" width="5" height="1" fill={c}/>
      <rect x="0" y="1" width="7" height="3" fill={c}/>
      <rect x="0" y="4" width="7" height="1" fill={c}/>
      {/* eyes */}
      <rect x="1" y="2" width="2" height="2" fill={BG}/>
      <rect x="4" y="2" width="2" height="2" fill={BG}/>
      {/* jaw teeth */}
      <rect x="1" y="5" width="1" height="2" fill={c}/>
      <rect x="3" y="5" width="1" height="2" fill={c}/>
      <rect x="5" y="5" width="1" height="2" fill={c}/>
    </svg>
  );
  return null;
};

export default function AchievementsScreen({ unlockedAch, claimableAch, onClaim, notification, achivNotif, onBack, F, BG, DARK, BORDER, MUTED }) {
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
        {["bronze","silver","gold","legend","impossible"].map(tier => {
          const tierAchs = ACHIEVEMENTS.filter(a => a.tier === tier);
          return (
            <div key={tier} style={{ marginBottom:18 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <TierIcon tier={tier} BG={BG} />
                <span style={{ fontSize:10, letterSpacing:3, color:tierColors[tier], fontWeight:"bold" }}>{tier.toUpperCase()}</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                {tierAchs.map(a => {
                  const done = unlockedAch.includes(a.id);
                  const claimable = claimableAch.includes(a.id);
                  return (
                    <div key={a.id} style={{ background:done?"#faf8f4":"#ebe8e2", border:`1px solid ${done?tierColors[a.tier]:"#ccc"}`, padding:"10px", boxSizing:"border-box", opacity:done?1:0.5 }}>
                      <div style={{ fontSize:11, fontWeight:"bold", marginBottom:3, color:done?DARK:MUTED }}>{a.label}</div>
                      <div style={{ fontSize:9, color:MUTED, marginBottom:5, lineHeight:1.6 }}>{a.desc}</div>
                      {claimable ? (
                        <button onClick={()=>{ playClick(); onClaim(a.id, a.reward, a.rewardLabel); }} style={{ background:tierColors[a.tier], color:"#fff", border:"none", padding:"3px 8px", fontSize:9, fontFamily:F, cursor:"pointer", letterSpacing:1, fontWeight:"bold" }}>
                          [ CLAIM +{a.rewardLabel || `${a.reward} fossils`} ]
                        </button>
                      ) : (
                        <div style={{ fontSize:9, color:done?tierColors[a.tier]:MUTED, fontWeight:"bold" }}>
                          {done ? "CLAIMED" : `+${a.rewardLabel || `${a.reward} fossils`}`}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <button style={{ ...btn, width:"100%" }} onClick={() => { playClick(); onBack(); }}>[ BACK ]</button>
      </div>
      {notification  && <div style={notifBox}>{notification}</div>}
      {achivNotif    && <div style={achivNotifBox}>{achivNotif}</div>}
    </div>
  );
}
