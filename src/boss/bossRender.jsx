// ─── BOSS RENDER ───────────────────────────────────────────────────────────────────
import { CANVAS_W, CANVAS_H, GROUND_Y, DINO_W } from "../constants";
import { drawDino }                      from "../rendering/drawDino";
import { drawBoss, drawGround, drawBossBlindOutline } from "../rendering/drawWorld";
import { drawBossAttacks, drawBossTelegraph } from "../rendering/drawBossAttacks";
import { BOSS_MAX_HP, ABYSS_SCENERY, BITE_RANGE } from "./bossConstants";

// ─── CRACK OVERLAY ───────────────────────────────────────────────────────────────────
// corruption: 0 = start of fight, 1 = boss nearly dead / phase 3
export function CrackOverlay({ corruption = 0 }) {
  // Base opacity multiplier — scales up with corruption
  const baseScale = 0.4 + corruption * 0.6;
  // Extra glow on the cracks at high corruption
  const glowCol = corruption > 0.5 ? `rgba(180,0,255,${(corruption - 0.5) * 0.5})` : "none";
  // How far cracks have crept inward (0 = only edges, 1 = deep into frame)
  const spread = corruption;

  return (
    <svg viewBox="0 0 720 270" preserveAspectRatio="none"
      style={{ position:"absolute", inset:"-6%", width:"112%", height:"112%",
               pointerEvents:"none", zIndex:10, overflow:"visible", imageRendering:"pixelated",
               filter: corruption > 0.4 ? `drop-shadow(0 0 ${Math.round(corruption * 8)}px rgba(160,0,255,${corruption * 0.7}))` : "none" }}>
      <rect key="0" x="45" y="0" width="3" height="3" fill="#0a0010" opacity="0.92" shapeRendering="crispEdges" />
      <rect key="1" x="42" y="0" width="3" height="3" fill="#150020" opacity="0.82" shapeRendering="crispEdges" />
      <rect key="2" x="39" y="-3" width="3" height="3" fill="#2a0044" opacity="0.73" shapeRendering="crispEdges" />
      <rect key="3" x="39" y="-6" width="2" height="2" fill="#380060" opacity="0.63" shapeRendering="crispEdges" />
      <rect key="4" x="36" y="-6" width="2" height="2" fill="#5a0099" opacity="0.53" shapeRendering="crispEdges" />
      <rect key="5" x="33" y="-9" width="2" height="2" fill="#5a0099" opacity="0.7" shapeRendering="crispEdges" />
      <rect key="6" x="36" y="-9" width="2" height="2" fill="#6622aa" opacity="0.44" shapeRendering="crispEdges" />
      <rect key="7" x="155" y="0" width="3" height="3" fill="#0a0010" opacity="0.92" shapeRendering="crispEdges" />
      <rect key="8" x="152" y="0" width="3" height="3" fill="#150020" opacity="0.85" shapeRendering="crispEdges" />
      <rect key="9" x="149" y="-3" width="3" height="3" fill="#1e0030" opacity="0.78" shapeRendering="crispEdges" />
      <rect key="10" x="152" y="-3" width="3" height="3" fill="#2a0044" opacity="0.7" shapeRendering="crispEdges" />
      <rect key="11" x="149" y="-6" width="2" height="2" fill="#2a0044" opacity="0.7" shapeRendering="crispEdges" />
      <rect key="12" x="149" y="-9" width="2" height="2" fill="#380060" opacity="0.54" shapeRendering="crispEdges" />
      <rect key="13" x="149" y="-12" width="2" height="2" fill="#4a0077" opacity="0.38" shapeRendering="crispEdges" />
      <rect key="14" x="152" y="-6" width="2" height="2" fill="#380060" opacity="0.63" shapeRendering="crispEdges" />
      <rect key="15" x="149" y="-6" width="2" height="2" fill="#4a0077" opacity="0.56" shapeRendering="crispEdges" />
      <rect key="16" x="155" y="-6" width="2" height="2" fill="#4a0077" opacity="0.7" shapeRendering="crispEdges" />
      <rect key="17" x="158" y="-6" width="2" height="2" fill="#5a0099" opacity="0.46" shapeRendering="crispEdges" />
      <rect key="18" x="152" y="-6" width="2" height="2" fill="#5a0099" opacity="0.49" shapeRendering="crispEdges" />
      <rect key="19" x="152" y="-9" width="2" height="2" fill="#6622aa" opacity="0.41" shapeRendering="crispEdges" />
      <rect key="20" x="149" y="-12" width="2" height="2" fill="#6622aa" opacity="0.7" shapeRendering="crispEdges" />
      <rect key="21" x="149" y="-15" width="2" height="2" fill="#8833cc" opacity="0.46" shapeRendering="crispEdges" />
      <rect key="22" x="275" y="0" width="3" height="3" fill="#0a0010" opacity="0.92" shapeRendering="crispEdges" />
      <rect key="23" x="272" y="-3" width="3" height="3" fill="#0a0010" opacity="0.86" shapeRendering="crispEdges" />
      <rect key="24" x="272" y="-6" width="3" height="3" fill="#150020" opacity="0.8" shapeRendering="crispEdges" />
      <rect key="25" x="272" y="-9" width="3" height="3" fill="#1e0030" opacity="0.75" shapeRendering="crispEdges" />
      <rect key="26" x="272" y="-12" width="3" height="3" fill="#2a0044" opacity="0.69" shapeRendering="crispEdges" />
      <rect key="27" x="269" y="-12" width="2" height="2" fill="#380060" opacity="0.63" shapeRendering="crispEdges" />
      <rect key="28" x="269" y="-15" width="2" height="2" fill="#4a0077" opacity="0.57" shapeRendering="crispEdges" />
      <rect key="29" x="269" y="-18" width="2" height="2" fill="#5a0099" opacity="0.51" shapeRendering="crispEdges" />
      <rect key="30" x="266" y="-18" width="2" height="2" fill="#6622aa" opacity="0.46" shapeRendering="crispEdges" />
      <rect key="31" x="263" y="-21" width="2" height="2" fill="#7733bb" opacity="0.4" shapeRendering="crispEdges" />
      <rect key="32" x="390" y="0" width="3" height="3" fill="#0a0010" opacity="0.92" shapeRendering="crispEdges" />
      <rect key="33" x="390" y="-3" width="3" height="3" fill="#150020" opacity="0.84" shapeRendering="crispEdges" />
      <rect key="34" x="390" y="-6" width="3" height="3" fill="#1e0030" opacity="0.75" shapeRendering="crispEdges" />
      <rect key="35" x="393" y="-6" width="2" height="2" fill="#1e0030" opacity="0.41" shapeRendering="crispEdges" />
      <rect key="36" x="393" y="-9" width="2" height="2" fill="#1e0030" opacity="0.7" shapeRendering="crispEdges" />
      <rect key="37" x="393" y="-12" width="2" height="2" fill="#2a0044" opacity="0.46" shapeRendering="crispEdges" />
      <rect key="38" x="390" y="-9" width="3" height="3" fill="#2a0044" opacity="0.67" shapeRendering="crispEdges" />
      <rect key="39" x="393" y="-12" width="2" height="2" fill="#4a0077" opacity="0.59" shapeRendering="crispEdges" />
      <rect key="40" x="393" y="-15" width="2" height="2" fill="#5a0099" opacity="0.51" shapeRendering="crispEdges" />
      <rect key="41" x="393" y="-18" width="2" height="2" fill="#6622aa" opacity="0.42" shapeRendering="crispEdges" />
      <rect key="42" x="510" y="0" width="3" height="3" fill="#0a0010" opacity="0.92" shapeRendering="crispEdges" />
      <rect key="43" x="507" y="-3" width="3" height="3" fill="#150020" opacity="0.86" shapeRendering="crispEdges" />
      <rect key="44" x="507" y="-6" width="3" height="3" fill="#1e0030" opacity="0.79" shapeRendering="crispEdges" />
      <rect key="45" x="507" y="-9" width="3" height="3" fill="#2a0044" opacity="0.73" shapeRendering="crispEdges" />
      <rect key="46" x="504" y="-9" width="3" height="3" fill="#380060" opacity="0.66" shapeRendering="crispEdges" />
      <rect key="47" x="507" y="-9" width="2" height="2" fill="#4a0077" opacity="0.6" shapeRendering="crispEdges" />
      <rect key="48" x="504" y="-9" width="2" height="2" fill="#4a0077" opacity="0.33" shapeRendering="crispEdges" />
      <rect key="49" x="507" y="-12" width="2" height="2" fill="#5a0099" opacity="0.53" shapeRendering="crispEdges" />
      <rect key="50" x="507" y="-15" width="2" height="2" fill="#6622aa" opacity="0.47" shapeRendering="crispEdges" />
      <rect key="51" x="513" y="-18" width="2" height="2" fill="#6622aa" opacity="0.7" shapeRendering="crispEdges" />
      <rect key="52" x="513" y="-21" width="2" height="2" fill="#7733bb" opacity="0.54" shapeRendering="crispEdges" />
      <rect key="53" x="516" y="-21" width="2" height="2" fill="#8833cc" opacity="0.38" shapeRendering="crispEdges" />
      <rect key="54" x="510" y="-18" width="2" height="2" fill="#7733bb" opacity="0.4" shapeRendering="crispEdges" />
      <rect key="55" x="507" y="-18" width="2" height="2" fill="#7733bb" opacity="0.22" shapeRendering="crispEdges" />
      <rect key="56" x="630" y="0" width="3" height="3" fill="#0a0010" opacity="0.92" shapeRendering="crispEdges" />
      <rect key="57" x="630" y="-3" width="3" height="3" fill="#150020" opacity="0.82" shapeRendering="crispEdges" />
      <rect key="58" x="627" y="-3" width="3" height="3" fill="#2a0044" opacity="0.73" shapeRendering="crispEdges" />
      <rect key="59" x="627" y="-6" width="2" height="2" fill="#380060" opacity="0.63" shapeRendering="crispEdges" />
      <rect key="60" x="624" y="-6" width="2" height="2" fill="#5a0099" opacity="0.53" shapeRendering="crispEdges" />
      <rect key="61" x="627" y="-9" width="2" height="2" fill="#5a0099" opacity="0.7" shapeRendering="crispEdges" />
      <rect key="62" x="624" y="-9" width="2" height="2" fill="#6622aa" opacity="0.44" shapeRendering="crispEdges" />
      <rect key="63" x="685" y="0" width="3" height="3" fill="#0a0010" opacity="0.92" shapeRendering="crispEdges" />
      <rect key="64" x="685" y="-3" width="3" height="3" fill="#1e0030" opacity="0.78" shapeRendering="crispEdges" />
      <rect key="65" x="682" y="-6" width="2" height="2" fill="#380060" opacity="0.63" shapeRendering="crispEdges" />
      <rect key="66" x="679" y="-6" width="2" height="2" fill="#380060" opacity="0.35" shapeRendering="crispEdges" />
      <rect key="67" x="679" y="-9" width="2" height="2" fill="#380060" opacity="0.7" shapeRendering="crispEdges" />
      <rect key="68" x="682" y="-9" width="2" height="2" fill="#5a0099" opacity="0.49" shapeRendering="crispEdges" />
      <rect key="69" x="685" y="-9" width="2" height="2" fill="#5a0099" opacity="0.27" shapeRendering="crispEdges" />
      <rect key="70" x="30" y="270" width="3" height="3" fill="#0a0010" opacity="0.92" shapeRendering="crispEdges" />
      <rect key="71" x="27" y="270" width="2" height="2" fill="#0a0010" opacity="0.51" shapeRendering="crispEdges" />
      <rect key="72" x="30" y="273" width="3" height="3" fill="#150020" opacity="0.8" shapeRendering="crispEdges" />
      <rect key="73" x="33" y="273" width="3" height="3" fill="#2a0044" opacity="0.69" shapeRendering="crispEdges" />
      <rect key="74" x="36" y="273" width="2" height="2" fill="#2a0044" opacity="0.38" shapeRendering="crispEdges" />
      <rect key="75" x="33" y="276" width="2" height="2" fill="#4a0077" opacity="0.57" shapeRendering="crispEdges" />
      <rect key="76" x="36" y="279" width="2" height="2" fill="#4a0077" opacity="0.7" shapeRendering="crispEdges" />
      <rect key="77" x="33" y="279" width="2" height="2" fill="#6622aa" opacity="0.46" shapeRendering="crispEdges" />
      <rect key="78" x="27" y="279" width="2" height="2" fill="#6622aa" opacity="0.7" shapeRendering="crispEdges" />
      <rect key="79" x="27" y="282" width="2" height="2" fill="#8833cc" opacity="0.46" shapeRendering="crispEdges" />
      <rect key="80" x="140" y="270" width="3" height="3" fill="#0a0010" opacity="0.92" shapeRendering="crispEdges" />
      <rect key="81" x="137" y="273" width="3" height="3" fill="#150020" opacity="0.86" shapeRendering="crispEdges" />
      <rect key="82" x="137" y="276" width="3" height="3" fill="#1e0030" opacity="0.79" shapeRendering="crispEdges" />
      <rect key="83" x="137" y="279" width="3" height="3" fill="#2a0044" opacity="0.73" shapeRendering="crispEdges" />
      <rect key="84" x="137" y="282" width="3" height="3" fill="#380060" opacity="0.66" shapeRendering="crispEdges" />
      <rect key="85" x="140" y="285" width="2" height="2" fill="#4a0077" opacity="0.6" shapeRendering="crispEdges" />
      <rect key="86" x="140" y="288" width="2" height="2" fill="#5a0099" opacity="0.53" shapeRendering="crispEdges" />
      <rect key="87" x="140" y="291" width="2" height="2" fill="#6622aa" opacity="0.47" shapeRendering="crispEdges" />
      <rect key="88" x="140" y="294" width="2" height="2" fill="#7733bb" opacity="0.4" shapeRendering="crispEdges" />
      <rect key="89" x="260" y="270" width="3" height="3" fill="#0a0010" opacity="0.92" shapeRendering="crispEdges" />
      <rect key="90" x="257" y="270" width="2" height="2" fill="#0a0010" opacity="0.51" shapeRendering="crispEdges" />
      <rect key="91" x="260" y="273" width="3" height="3" fill="#150020" opacity="0.84" shapeRendering="crispEdges" />
      <rect key="92" x="260" y="276" width="3" height="3" fill="#1e0030" opacity="0.75" shapeRendering="crispEdges" />
      <rect key="93" x="257" y="279" width="3" height="3" fill="#2a0044" opacity="0.67" shapeRendering="crispEdges" />
      <rect key="94" x="257" y="282" width="2" height="2" fill="#4a0077" opacity="0.59" shapeRendering="crispEdges" />
      <rect key="95" x="257" y="285" width="2" height="2" fill="#5a0099" opacity="0.51" shapeRendering="crispEdges" />
      <rect key="96" x="257" y="288" width="2" height="2" fill="#6622aa" opacity="0.42" shapeRendering="crispEdges" />
      <rect key="97" x="380" y="270" width="3" height="3" fill="#0a0010" opacity="0.92" shapeRendering="crispEdges" />
      <rect key="98" x="377" y="270" width="3" height="3" fill="#0a0010" opacity="0.87" shapeRendering="crispEdges" />
      <rect key="99" x="374" y="270" width="3" height="3" fill="#150020" opacity="0.81" shapeRendering="crispEdges" />
      <rect key="100" x="371" y="270" width="2" height="2" fill="#150020" opacity="0.45" shapeRendering="crispEdges" />
      <rect key="101" x="374" y="273" width="3" height="3" fill="#1e0030" opacity="0.76" shapeRendering="crispEdges" />
      <rect key="102" x="374" y="276" width="3" height="3" fill="#2a0044" opacity="0.71" shapeRendering="crispEdges" />
      <rect key="103" x="371" y="279" width="2" height="2" fill="#2a0044" opacity="0.7" shapeRendering="crispEdges" />
      <rect key="104" x="371" y="282" width="2" height="2" fill="#380060" opacity="0.54" shapeRendering="crispEdges" />
      <rect key="105" x="371" y="285" width="2" height="2" fill="#380060" opacity="0.38" shapeRendering="crispEdges" />
      <rect key="106" x="374" y="279" width="2" height="2" fill="#380060" opacity="0.66" shapeRendering="crispEdges" />
      <rect key="107" x="377" y="279" width="2" height="2" fill="#380060" opacity="0.36" shapeRendering="crispEdges" />
      <rect key="108" x="374" y="282" width="2" height="2" fill="#380060" opacity="0.6" shapeRendering="crispEdges" />
      <rect key="109" x="374" y="282" width="2" height="2" fill="#380060" opacity="0.7" shapeRendering="crispEdges" />
      <rect key="110" x="371" y="282" width="2" height="2" fill="#4a0077" opacity="0.54" shapeRendering="crispEdges" />
      <rect key="111" x="368" y="282" width="2" height="2" fill="#5a0099" opacity="0.38" shapeRendering="crispEdges" />
      <rect key="112" x="377" y="282" width="2" height="2" fill="#4a0077" opacity="0.55" shapeRendering="crispEdges" />
      <rect key="113" x="377" y="285" width="2" height="2" fill="#5a0099" opacity="0.5" shapeRendering="crispEdges" />
      <rect key="114" x="377" y="288" width="2" height="2" fill="#6622aa" opacity="0.45" shapeRendering="crispEdges" />
      <rect key="115" x="377" y="291" width="2" height="2" fill="#7733bb" opacity="0.39" shapeRendering="crispEdges" />
      <rect key="116" x="374" y="294" width="2" height="2" fill="#7733bb" opacity="0.7" shapeRendering="crispEdges" />
      <rect key="117" x="374" y="297" width="2" height="2" fill="#8833cc" opacity="0.58" shapeRendering="crispEdges" />
      <rect key="118" x="371" y="300" width="2" height="2" fill="#8833cc" opacity="0.46" shapeRendering="crispEdges" />
      <rect key="119" x="368" y="300" width="2" height="2" fill="#8833cc" opacity="0.34" shapeRendering="crispEdges" />
      <rect key="120" x="500" y="270" width="3" height="3" fill="#0a0010" opacity="0.92" shapeRendering="crispEdges" />
      <rect key="121" x="500" y="273" width="3" height="3" fill="#150020" opacity="0.82" shapeRendering="crispEdges" />
      <rect key="122" x="500" y="276" width="3" height="3" fill="#2a0044" opacity="0.73" shapeRendering="crispEdges" />
      <rect key="123" x="503" y="276" width="2" height="2" fill="#380060" opacity="0.63" shapeRendering="crispEdges" />
      <rect key="124" x="503" y="279" width="2" height="2" fill="#5a0099" opacity="0.53" shapeRendering="crispEdges" />
      <rect key="125" x="503" y="282" width="2" height="2" fill="#6622aa" opacity="0.44" shapeRendering="crispEdges" />
      <rect key="126" x="615" y="270" width="3" height="3" fill="#0a0010" opacity="0.92" shapeRendering="crispEdges" />
      <rect key="127" x="612" y="270" width="2" height="2" fill="#0a0010" opacity="0.51" shapeRendering="crispEdges" />
      <rect key="128" x="615" y="273" width="3" height="3" fill="#150020" opacity="0.85" shapeRendering="crispEdges" />
      <rect key="129" x="615" y="276" width="3" height="3" fill="#1e0030" opacity="0.78" shapeRendering="crispEdges" />
      <rect key="130" x="612" y="276" width="3" height="3" fill="#2a0044" opacity="0.7" shapeRendering="crispEdges" />
      <rect key="131" x="615" y="279" width="2" height="2" fill="#2a0044" opacity="0.7" shapeRendering="crispEdges" />
      <rect key="132" x="618" y="282" width="2" height="2" fill="#380060" opacity="0.46" shapeRendering="crispEdges" />
      <rect key="133" x="612" y="279" width="2" height="2" fill="#380060" opacity="0.63" shapeRendering="crispEdges" />
      <rect key="134" x="615" y="282" width="2" height="2" fill="#380060" opacity="0.7" shapeRendering="crispEdges" />
      <rect key="135" x="618" y="282" width="2" height="2" fill="#4a0077" opacity="0.54" shapeRendering="crispEdges" />
      <rect key="136" x="621" y="285" width="2" height="2" fill="#5a0099" opacity="0.38" shapeRendering="crispEdges" />
      <rect key="137" x="612" y="282" width="2" height="2" fill="#4a0077" opacity="0.56" shapeRendering="crispEdges" />
      <rect key="138" x="612" y="285" width="2" height="2" fill="#5a0099" opacity="0.49" shapeRendering="crispEdges" />
      <rect key="139" x="612" y="288" width="2" height="2" fill="#6622aa" opacity="0.41" shapeRendering="crispEdges" />
      <rect key="140" x="609" y="288" width="2" height="2" fill="#6622aa" opacity="0.23" shapeRendering="crispEdges" />
      <rect key="141" x="710" y="270" width="3" height="3" fill="#0a0010" opacity="0.92" shapeRendering="crispEdges" />
      <rect key="142" x="707" y="270" width="2" height="2" fill="#0a0010" opacity="0.51" shapeRendering="crispEdges" />
      <rect key="143" x="710" y="273" width="3" height="3" fill="#1e0030" opacity="0.78" shapeRendering="crispEdges" />
      <rect key="144" x="710" y="276" width="2" height="2" fill="#380060" opacity="0.63" shapeRendering="crispEdges" />
      <rect key="145" x="716" y="276" width="2" height="2" fill="#380060" opacity="0.7" shapeRendering="crispEdges" />
      <rect key="146" x="713" y="276" width="2" height="2" fill="#5a0099" opacity="0.49" shapeRendering="crispEdges" />
      <rect key="147" x="0" y="20" width="3" height="3" fill="#0a0010" opacity="0.92" shapeRendering="crispEdges" />
      <rect key="148" x="-3" y="20" width="3" height="3" fill="#150020" opacity="0.82" shapeRendering="crispEdges" />
      <rect key="149" x="-3" y="23" width="3" height="3" fill="#2a0044" opacity="0.73" shapeRendering="crispEdges" />
      <rect key="150" x="-6" y="23" width="2" height="2" fill="#380060" opacity="0.63" shapeRendering="crispEdges" />
      <rect key="151" x="-9" y="23" width="2" height="2" fill="#5a0099" opacity="0.53" shapeRendering="crispEdges" />
      <rect key="152" x="-12" y="23" width="2" height="2" fill="#6622aa" opacity="0.44" shapeRendering="crispEdges" />
      <rect key="153" x="-12" y="17" width="2" height="2" fill="#6622aa" opacity="0.7" shapeRendering="crispEdges" />
      <rect key="154" x="-12" y="14" width="2" height="2" fill="#8833cc" opacity="0.46" shapeRendering="crispEdges" />
      <rect key="155" x="0" y="90" width="3" height="3" fill="#0a0010" opacity="0.92" shapeRendering="crispEdges" />
      <rect key="156" x="0" y="87" width="3" height="3" fill="#150020" opacity="0.85" shapeRendering="crispEdges" />
      <rect key="157" x="-3" y="87" width="3" height="3" fill="#1e0030" opacity="0.78" shapeRendering="crispEdges" />
      <rect key="158" x="-6" y="87" width="3" height="3" fill="#2a0044" opacity="0.7" shapeRendering="crispEdges" />
      <rect key="159" x="-9" y="87" width="2" height="2" fill="#380060" opacity="0.63" shapeRendering="crispEdges" />
      <rect key="160" x="-9" y="84" width="2" height="2" fill="#380060" opacity="0.35" shapeRendering="crispEdges" />
      <rect key="161" x="-12" y="87" width="2" height="2" fill="#4a0077" opacity="0.56" shapeRendering="crispEdges" />
      <rect key="162" x="-15" y="87" width="2" height="2" fill="#5a0099" opacity="0.49" shapeRendering="crispEdges" />
      <rect key="163" x="-18" y="87" width="2" height="2" fill="#6622aa" opacity="0.41" shapeRendering="crispEdges" />
      <rect key="164" x="-18" y="90" width="2" height="2" fill="#6622aa" opacity="0.23" shapeRendering="crispEdges" />
      <rect key="165" x="0" y="155" width="3" height="3" fill="#0a0010" opacity="0.92" shapeRendering="crispEdges" />
      <rect key="166" x="-3" y="152" width="3" height="3" fill="#0a0010" opacity="0.86" shapeRendering="crispEdges" />
      <rect key="167" x="-6" y="149" width="3" height="3" fill="#150020" opacity="0.8" shapeRendering="crispEdges" />
      <rect key="168" x="-6" y="146" width="2" height="2" fill="#150020" opacity="0.44" shapeRendering="crispEdges" />
      <rect key="169" x="-9" y="149" width="3" height="3" fill="#1e0030" opacity="0.75" shapeRendering="crispEdges" />
      <rect key="170" x="-12" y="149" width="3" height="3" fill="#2a0044" opacity="0.69" shapeRendering="crispEdges" />
      <rect key="171" x="-15" y="152" width="2" height="2" fill="#380060" opacity="0.63" shapeRendering="crispEdges" />
      <rect key="172" x="-18" y="149" width="2" height="2" fill="#4a0077" opacity="0.57" shapeRendering="crispEdges" />
      <rect key="173" x="-21" y="146" width="2" height="2" fill="#5a0099" opacity="0.51" shapeRendering="crispEdges" />
      <rect key="174" x="-24" y="146" width="2" height="2" fill="#6622aa" opacity="0.46" shapeRendering="crispEdges" />
      <rect key="175" x="-27" y="146" width="2" height="2" fill="#7733bb" opacity="0.4" shapeRendering="crispEdges" />
      <rect key="176" x="0" y="215" width="3" height="3" fill="#0a0010" opacity="0.92" shapeRendering="crispEdges" />
      <rect key="177" x="0" y="212" width="2" height="2" fill="#0a0010" opacity="0.51" shapeRendering="crispEdges" />
      <rect key="178" x="-3" y="215" width="3" height="3" fill="#150020" opacity="0.84" shapeRendering="crispEdges" />
      <rect key="179" x="-6" y="215" width="3" height="3" fill="#1e0030" opacity="0.75" shapeRendering="crispEdges" />
      <rect key="180" x="-9" y="215" width="3" height="3" fill="#2a0044" opacity="0.67" shapeRendering="crispEdges" />
      <rect key="181" x="-12" y="218" width="2" height="2" fill="#4a0077" opacity="0.59" shapeRendering="crispEdges" />
      <rect key="182" x="-15" y="218" width="2" height="2" fill="#5a0099" opacity="0.51" shapeRendering="crispEdges" />
      <rect key="183" x="-18" y="221" width="2" height="2" fill="#6622aa" opacity="0.42" shapeRendering="crispEdges" />
      <rect key="184" x="0" y="248" width="3" height="3" fill="#0a0010" opacity="0.92" shapeRendering="crispEdges" />
      <rect key="185" x="-3" y="248" width="3" height="3" fill="#1e0030" opacity="0.78" shapeRendering="crispEdges" />
      <rect key="186" x="-3" y="251" width="2" height="2" fill="#1e0030" opacity="0.43" shapeRendering="crispEdges" />
      <rect key="187" x="-6" y="248" width="2" height="2" fill="#380060" opacity="0.63" shapeRendering="crispEdges" />
      <rect key="188" x="-9" y="248" width="2" height="2" fill="#5a0099" opacity="0.49" shapeRendering="crispEdges" />
      <rect key="189" x="720" y="15" width="3" height="3" fill="#0a0010" opacity="0.92" shapeRendering="crispEdges" />
      <rect key="190" x="723" y="15" width="3" height="3" fill="#150020" opacity="0.8" shapeRendering="crispEdges" />
      <rect key="191" x="723" y="12" width="2" height="2" fill="#150020" opacity="0.44" shapeRendering="crispEdges" />
      <rect key="192" x="726" y="15" width="3" height="3" fill="#2a0044" opacity="0.69" shapeRendering="crispEdges" />
      <rect key="193" x="729" y="15" width="2" height="2" fill="#4a0077" opacity="0.57" shapeRendering="crispEdges" />
      <rect key="194" x="732" y="15" width="2" height="2" fill="#6622aa" opacity="0.46" shapeRendering="crispEdges" />
      <rect key="195" x="720" y="85" width="3" height="3" fill="#0a0010" opacity="0.92" shapeRendering="crispEdges" />
      <rect key="196" x="720" y="82" width="3" height="3" fill="#150020" opacity="0.86" shapeRendering="crispEdges" />
      <rect key="197" x="723" y="82" width="3" height="3" fill="#1e0030" opacity="0.79" shapeRendering="crispEdges" />
      <rect key="198" x="726" y="82" width="3" height="3" fill="#2a0044" opacity="0.73" shapeRendering="crispEdges" />
      <rect key="199" x="726" y="85" width="3" height="3" fill="#380060" opacity="0.66" shapeRendering="crispEdges" />
      <rect key="200" x="726" y="82" width="2" height="2" fill="#4a0077" opacity="0.6" shapeRendering="crispEdges" />
      <rect key="201" x="729" y="82" width="2" height="2" fill="#5a0099" opacity="0.53" shapeRendering="crispEdges" />
      <rect key="202" x="732" y="82" width="2" height="2" fill="#6622aa" opacity="0.47" shapeRendering="crispEdges" />
      <rect key="203" x="735" y="85" width="2" height="2" fill="#6622aa" opacity="0.7" shapeRendering="crispEdges" />
      <rect key="204" x="735" y="88" width="2" height="2" fill="#7733bb" opacity="0.54" shapeRendering="crispEdges" />
      <rect key="205" x="738" y="91" width="2" height="2" fill="#8833cc" opacity="0.38" shapeRendering="crispEdges" />
      <rect key="206" x="735" y="82" width="2" height="2" fill="#7733bb" opacity="0.4" shapeRendering="crispEdges" />
      <rect key="207" x="720" y="150" width="3" height="3" fill="#0a0010" opacity="0.92" shapeRendering="crispEdges" />
      <rect key="208" x="723" y="150" width="3" height="3" fill="#150020" opacity="0.84" shapeRendering="crispEdges" />
      <rect key="209" x="726" y="150" width="3" height="3" fill="#1e0030" opacity="0.75" shapeRendering="crispEdges" />
      <rect key="210" x="729" y="150" width="3" height="3" fill="#2a0044" opacity="0.67" shapeRendering="crispEdges" />
      <rect key="211" x="729" y="153" width="2" height="2" fill="#4a0077" opacity="0.59" shapeRendering="crispEdges" />
      <rect key="212" x="729" y="156" width="2" height="2" fill="#5a0099" opacity="0.51" shapeRendering="crispEdges" />
      <rect key="213" x="729" y="153" width="2" height="2" fill="#5a0099" opacity="0.28" shapeRendering="crispEdges" />
      <rect key="214" x="732" y="156" width="2" height="2" fill="#6622aa" opacity="0.42" shapeRendering="crispEdges" />
      <rect key="215" x="720" y="210" width="3" height="3" fill="#0a0010" opacity="0.92" shapeRendering="crispEdges" />
      <rect key="216" x="720" y="207" width="3" height="3" fill="#0a0010" opacity="0.86" shapeRendering="crispEdges" />
      <rect key="217" x="723" y="204" width="3" height="3" fill="#150020" opacity="0.8" shapeRendering="crispEdges" />
      <rect key="218" x="723" y="201" width="3" height="3" fill="#1e0030" opacity="0.75" shapeRendering="crispEdges" />
      <rect key="219" x="726" y="201" width="2" height="2" fill="#1e0030" opacity="0.7" shapeRendering="crispEdges" />
      <rect key="220" x="726" y="204" width="2" height="2" fill="#2a0044" opacity="0.46" shapeRendering="crispEdges" />
      <rect key="221" x="726" y="198" width="3" height="3" fill="#2a0044" opacity="0.69" shapeRendering="crispEdges" />
      <rect key="222" x="729" y="198" width="2" height="2" fill="#380060" opacity="0.63" shapeRendering="crispEdges" />
      <rect key="223" x="729" y="201" width="2" height="2" fill="#4a0077" opacity="0.57" shapeRendering="crispEdges" />
      <rect key="224" x="732" y="201" width="2" height="2" fill="#5a0099" opacity="0.51" shapeRendering="crispEdges" />
      <rect key="225" x="735" y="201" width="2" height="2" fill="#6622aa" opacity="0.46" shapeRendering="crispEdges" />
      <rect key="226" x="738" y="198" width="2" height="2" fill="#7733bb" opacity="0.4" shapeRendering="crispEdges" />
      <rect key="227" x="720" y="245" width="3" height="3" fill="#0a0010" opacity="0.92" shapeRendering="crispEdges" />
      <rect key="228" x="720" y="248" width="3" height="3" fill="#1e0030" opacity="0.78" shapeRendering="crispEdges" />
      <rect key="229" x="723" y="248" width="2" height="2" fill="#380060" opacity="0.63" shapeRendering="crispEdges" />
      <rect key="230" x="726" y="248" width="2" height="2" fill="#5a0099" opacity="0.49" shapeRendering="crispEdges" />

      {/* ── Dynamic corruption layer 1: existing cracks get brighter (always visible, scales up) */}
      <g opacity={baseScale}>
        {/* Top edge reinforcement */}
        <rect x="45"  y="-3"  width="6"  height="6"  fill="#5a0099" shapeRendering="crispEdges" />
        <rect x="155" y="-3"  width="6"  height="6"  fill="#5a0099" shapeRendering="crispEdges" />
        <rect x="275" y="-3"  width="6"  height="6"  fill="#5a0099" shapeRendering="crispEdges" />
        <rect x="390" y="-3"  width="6"  height="6"  fill="#5a0099" shapeRendering="crispEdges" />
        <rect x="510" y="-3"  width="6"  height="6"  fill="#5a0099" shapeRendering="crispEdges" />
        <rect x="630" y="-3"  width="6"  height="6"  fill="#5a0099" shapeRendering="crispEdges" />
        {/* Bottom edge reinforcement */}
        <rect x="30"  y="270" width="6"  height="6"  fill="#5a0099" shapeRendering="crispEdges" />
        <rect x="140" y="270" width="6"  height="6"  fill="#5a0099" shapeRendering="crispEdges" />
        <rect x="260" y="270" width="6"  height="6"  fill="#5a0099" shapeRendering="crispEdges" />
        <rect x="380" y="270" width="6"  height="6"  fill="#5a0099" shapeRendering="crispEdges" />
        <rect x="500" y="270" width="6"  height="6"  fill="#5a0099" shapeRendering="crispEdges" />
        <rect x="615" y="270" width="6"  height="6"  fill="#5a0099" shapeRendering="crispEdges" />
        {/* Left edge reinforcement */}
        <rect x="-6"  y="20"  width="6"  height="6"  fill="#5a0099" shapeRendering="crispEdges" />
        <rect x="-6"  y="90"  width="6"  height="6"  fill="#5a0099" shapeRendering="crispEdges" />
        <rect x="-6"  y="155" width="6"  height="6"  fill="#5a0099" shapeRendering="crispEdges" />
        <rect x="-6"  y="215" width="6"  height="6"  fill="#5a0099" shapeRendering="crispEdges" />
        {/* Right edge reinforcement */}
        <rect x="720" y="15"  width="6"  height="6"  fill="#5a0099" shapeRendering="crispEdges" />
        <rect x="720" y="85"  width="6"  height="6"  fill="#5a0099" shapeRendering="crispEdges" />
        <rect x="720" y="150" width="6"  height="6"  fill="#5a0099" shapeRendering="crispEdges" />
        <rect x="720" y="210" width="6"  height="6"  fill="#5a0099" shapeRendering="crispEdges" />
      </g>

      {/* ── Dynamic corruption layer 2: cracks spread inward (visible from ~30% corruption) */}
      {spread > 0.3 && (
        <g opacity={Math.min(1, (spread - 0.3) / 0.4)}>
          {/* Top cracks creeping down */}
          <rect x="42"  y="0"  width="3" height={Math.round(spread * 18)} fill="#7722bb" shapeRendering="crispEdges" />
          <rect x="45"  y="0"  width="2" height={Math.round(spread * 12)} fill="#9933dd" shapeRendering="crispEdges" />
          <rect x="152" y="0"  width="3" height={Math.round(spread * 22)} fill="#7722bb" shapeRendering="crispEdges" />
          <rect x="155" y="0"  width="2" height={Math.round(spread * 14)} fill="#9933dd" shapeRendering="crispEdges" />
          <rect x="272" y="0"  width="3" height={Math.round(spread * 16)} fill="#7722bb" shapeRendering="crispEdges" />
          <rect x="390" y="0"  width="3" height={Math.round(spread * 20)} fill="#7722bb" shapeRendering="crispEdges" />
          <rect x="507" y="0"  width="3" height={Math.round(spread * 24)} fill="#7722bb" shapeRendering="crispEdges" />
          <rect x="627" y="0"  width="3" height={Math.round(spread * 18)} fill="#7722bb" shapeRendering="crispEdges" />
          {/* Bottom cracks creeping up */}
          <rect x="30"  y={270 - Math.round(spread * 20)} width="3" height={Math.round(spread * 20)} fill="#7722bb" shapeRendering="crispEdges" />
          <rect x="140" y={270 - Math.round(spread * 26)} width="3" height={Math.round(spread * 26)} fill="#7722bb" shapeRendering="crispEdges" />
          <rect x="260" y={270 - Math.round(spread * 18)} width="3" height={Math.round(spread * 18)} fill="#7722bb" shapeRendering="crispEdges" />
          <rect x="377" y={270 - Math.round(spread * 30)} width="3" height={Math.round(spread * 30)} fill="#7722bb" shapeRendering="crispEdges" />
          <rect x="500" y={270 - Math.round(spread * 22)} width="3" height={Math.round(spread * 22)} fill="#7722bb" shapeRendering="crispEdges" />
          <rect x="615" y={270 - Math.round(spread * 16)} width="3" height={Math.round(spread * 16)} fill="#7722bb" shapeRendering="crispEdges" />
          {/* Left cracks creeping right */}
          <rect x="0" y="20"  width={Math.round(spread * 20)} height="3" fill="#7722bb" shapeRendering="crispEdges" />
          <rect x="0" y="90"  width={Math.round(spread * 26)} height="3" fill="#7722bb" shapeRendering="crispEdges" />
          <rect x="0" y="155" width={Math.round(spread * 18)} height="3" fill="#7722bb" shapeRendering="crispEdges" />
          <rect x="0" y="215" width={Math.round(spread * 22)} height="3" fill="#7722bb" shapeRendering="crispEdges" />
          {/* Right cracks creeping left */}
          <rect x={720 - Math.round(spread * 22)} y="15"  width={Math.round(spread * 22)} height="3" fill="#7722bb" shapeRendering="crispEdges" />
          <rect x={720 - Math.round(spread * 18)} y="85"  width={Math.round(spread * 18)} height="3" fill="#7722bb" shapeRendering="crispEdges" />
          <rect x={720 - Math.round(spread * 28)} y="150" width={Math.round(spread * 28)} height="3" fill="#7722bb" shapeRendering="crispEdges" />
          <rect x={720 - Math.round(spread * 20)} y="210" width={Math.round(spread * 20)} height="3" fill="#7722bb" shapeRendering="crispEdges" />
        </g>
      )}

      {/* ── Dynamic corruption layer 3: new diagonal cracks + corner bleed (visible from ~55%) */}
      {spread > 0.55 && (
        <g opacity={Math.min(1, (spread - 0.55) / 0.3)}>
          {/* Corner bleeds — dark void eating the corners */}
          <rect x="-12" y="-12" width={Math.round(spread * 40)} height={Math.round(spread * 40)} fill="#0a0010" shapeRendering="crispEdges" />
          <rect x={720 - Math.round(spread * 30)} y="-12" width={Math.round(spread * 42)} height={Math.round(spread * 36)} fill="#0a0010" shapeRendering="crispEdges" />
          <rect x="-12" y={270 - Math.round(spread * 30)} width={Math.round(spread * 38)} height={Math.round(spread * 42)} fill="#0a0010" shapeRendering="crispEdges" />
          <rect x={720 - Math.round(spread * 32)} y={270 - Math.round(spread * 28)} width={Math.round(spread * 44)} height={Math.round(spread * 40)} fill="#0a0010" shapeRendering="crispEdges" />
          {/* Diagonal crack veins */}
          <rect x="60"  y="6"  width="2" height="2" fill="#aa33ff" shapeRendering="crispEdges" />
          <rect x="62"  y="8"  width="2" height="2" fill="#aa33ff" shapeRendering="crispEdges" />
          <rect x="64"  y="10" width="2" height="2" fill="#8822dd" shapeRendering="crispEdges" />
          <rect x="66"  y="12" width="2" height="2" fill="#6611bb" shapeRendering="crispEdges" />
          <rect x="68"  y="14" width="2" height={Math.round((spread - 0.55) * 60)} fill="#550099" shapeRendering="crispEdges" />
          <rect x="340" y="6"  width="2" height="2" fill="#aa33ff" shapeRendering="crispEdges" />
          <rect x="338" y="8"  width="2" height="2" fill="#aa33ff" shapeRendering="crispEdges" />
          <rect x="336" y="10" width="2" height="2" fill="#8822dd" shapeRendering="crispEdges" />
          <rect x="334" y="12" width="2" height={Math.round((spread - 0.55) * 50)} fill="#550099" shapeRendering="crispEdges" />
          <rect x="580" y="6"  width="2" height="2" fill="#aa33ff" shapeRendering="crispEdges" />
          <rect x="582" y="8"  width="2" height="2" fill="#8822dd" shapeRendering="crispEdges" />
          <rect x="584" y="10" width="2" height={Math.round((spread - 0.55) * 55)} fill="#550099" shapeRendering="crispEdges" />
          {/* Bottom diagonal veins */}
          <rect x="100" y={270 - Math.round((spread - 0.55) * 65)} width="2" height={Math.round((spread - 0.55) * 65)} fill="#550099" shapeRendering="crispEdges" />
          <rect x="98"  y={270 - Math.round((spread - 0.55) * 50)} width="2" height="2" fill="#aa33ff" shapeRendering="crispEdges" />
          <rect x="450" y={270 - Math.round((spread - 0.55) * 70)} width="2" height={Math.round((spread - 0.55) * 70)} fill="#550099" shapeRendering="crispEdges" />
          <rect x="448" y={270 - Math.round((spread - 0.55) * 55)} width="2" height="2" fill="#aa33ff" shapeRendering="crispEdges" />
          {/* Purple glow veins on left/right */}
          <rect x="0" y="50"  width={Math.round((spread - 0.55) * 50)} height="2" fill="#aa33ff" shapeRendering="crispEdges" />
          <rect x="0" y="130" width={Math.round((spread - 0.55) * 60)} height="2" fill="#aa33ff" shapeRendering="crispEdges" />
          <rect x="0" y="200" width={Math.round((spread - 0.55) * 45)} height="2" fill="#aa33ff" shapeRendering="crispEdges" />
          <rect x={720 - Math.round((spread - 0.55) * 55)} y="50"  width={Math.round((spread - 0.55) * 55)} height="2" fill="#aa33ff" shapeRendering="crispEdges" />
          <rect x={720 - Math.round((spread - 0.55) * 48)} y="130" width={Math.round((spread - 0.55) * 48)} height="2" fill="#aa33ff" shapeRendering="crispEdges" />
          <rect x={720 - Math.round((spread - 0.55) * 62)} y="200" width={Math.round((spread - 0.55) * 62)} height="2" fill="#aa33ff" shapeRendering="crispEdges" />
        </g>
      )}

      {/* ── Dynamic corruption layer 4: full border vignette + void tendrils (visible from ~80%) */}
      {spread > 0.8 && (
        <g opacity={Math.min(1, (spread - 0.8) / 0.2)}>
          {/* Thick void border eating inward */}
          <rect x="-12" y="-12" width="732" height={Math.round((spread - 0.8) * 80)} fill="#050005" shapeRendering="crispEdges" />
          <rect x="-12" y={270 - Math.round((spread - 0.8) * 80)} width="732" height={Math.round((spread - 0.8) * 92)} fill="#050005" shapeRendering="crispEdges" />
          <rect x="-12" y="-12" width={Math.round((spread - 0.8) * 70)} height="294" fill="#050005" shapeRendering="crispEdges" />
          <rect x={720 - Math.round((spread - 0.8) * 60)} y="-12" width={Math.round((spread - 0.8) * 72)} height="294" fill="#050005" shapeRendering="crispEdges" />
          {/* Bright purple crack lines on the void border */}
          <rect x="0" y={Math.round((spread - 0.8) * 70)} width="720" height="2" fill="#cc44ff" shapeRendering="crispEdges" />
          <rect x="0" y={270 - Math.round((spread - 0.8) * 80)} width="720" height="2" fill="#cc44ff" shapeRendering="crispEdges" />
          <rect x={Math.round((spread - 0.8) * 60)} y="0" width="2" height="270" fill="#cc44ff" shapeRendering="crispEdges" />
          <rect x={720 - Math.round((spread - 0.8) * 52)} y="0" width="2" height="270" fill="#cc44ff" shapeRendering="crispEdges" />
          {/* Tendrils reaching toward center */}
          <rect x="180" y={Math.round((spread - 0.8) * 70)} width="3" height={Math.round((spread - 0.8) * 80)} fill="#9922cc" shapeRendering="crispEdges" />
          <rect x="360" y={Math.round((spread - 0.8) * 70)} width="3" height={Math.round((spread - 0.8) * 100)} fill="#9922cc" shapeRendering="crispEdges" />
          <rect x="540" y={Math.round((spread - 0.8) * 70)} width="3" height={Math.round((spread - 0.8) * 75)} fill="#9922cc" shapeRendering="crispEdges" />
          <rect x="180" y={270 - Math.round((spread - 0.8) * 150)} width="3" height={Math.round((spread - 0.8) * 80)} fill="#9922cc" shapeRendering="crispEdges" />
          <rect x="360" y={270 - Math.round((spread - 0.8) * 170)} width="3" height={Math.round((spread - 0.8) * 100)} fill="#9922cc" shapeRendering="crispEdges" />
          <rect x="540" y={270 - Math.round((spread - 0.8) * 145)} width="3" height={Math.round((spread - 0.8) * 75)} fill="#9922cc" shapeRendering="crispEdges" />
        </g>
      )}
    </svg>
  );
}

// ─── RENDER BOSS FRAME ───────────────────────────────────────────────────────────────────
export function renderBoss(ctx, gs) {
  const f = gs.frame;

  ctx.save();
  ctx.translate(Math.round(gs.shake.x), Math.round(gs.shake.y));

  // Background — deep teal abyss, shifts color with phase
  const p0 = gs.bossPhase === 0, p1 = gs.bossPhase === 1, p2 = gs.bossPhase >= 2;
  const bgBase   = p2 ? "#140200" : p1 ? "#0e0a00" : "#020e14";
  const blockA   = p2 ? "#1a0400" : p1 ? "#120c00" : "#041018";
  const blockB   = p2 ? "#180300" : p1 ? "#100a00" : "#051218";
  const mortarC  = p2 ? "#2a0800" : p1 ? "#1e1400" : "#0a2030";
  const runeCol  = p2 ? "#ff4400" : p1 ? "#cc8800" : "#00aacc";
  const runeHi   = p2 ? "#ff8844" : p1 ? "#ffcc44" : "#44ddff";
  const dustA    = p2 ? "#ff2200" : p1 ? "#cc6600" : "#00aacc";
  const dustB    = p2 ? "#880000" : p1 ? "#664400" : "#006688";
  const dustC    = p2 ? "#440000" : p1 ? "#332200" : "#004455";
  const fogCol   = p2 ? "#220000" : p1 ? "#1a0e00" : "#003344";
  const pillarV  = p2 ? "#ff2200" : p1 ? "#aa6600" : "#00aacc";

  ctx.fillStyle = bgBase;
  ctx.fillRect(-20, -20, CANVAS_W+40, CANVAS_H+40);

  // Back wall stone blocks
  const blockCols = [blockA, blockB, blockA, blockB];
  for(let row = 0; row < 4; row++) {
    for(let col = 0; col < 10; col++) {
      const bw = 76, bh = 52;
      const bx = col * bw - (row % 2) * 38;
      const by = row * bh;
      ctx.fillStyle = blockCols[(row + col) % blockCols.length];
      ctx.fillRect(bx, by, bw - 2, bh - 2);
      ctx.fillStyle = mortarC;
      ctx.fillRect(bx, by, bw - 2, 1);
      ctx.fillRect(bx, by, 1, bh - 2);
    }
  }

  // Glowing rune cracks — color shifts with phase
  const runePositions = [
    {x:60,  y:30,  w:28, h:2}, {x:62,  y:28, w:2,  h:8},
    {x:180, y:55,  w:22, h:2}, {x:196, y:50, w:2,  h:10},
    {x:310, y:20,  w:18, h:2}, {x:312, y:18, w:2,  h:12},
    {x:440, y:45,  w:30, h:2}, {x:442, y:40, w:2,  h:14},
    {x:560, y:25,  w:20, h:2}, {x:574, y:22, w:2,  h:8},
    {x:650, y:60,  w:24, h:2}, {x:652, y:55, w:2,  h:10},
    {x:120, y:80,  w:16, h:2}, {x:240, y:100, w:20, h:2},
    {x:380, y:75,  w:14, h:2}, {x:500, y:90,  w:18, h:2},
    {x:620, y:110, w:22, h:2}, {x:700, y:40,  w:12, h:2},
  ];
  const runePulse = 0.5 + Math.sin(f * 0.018) * 0.3;
  ctx.globalAlpha = runePulse * 0.55;
  ctx.fillStyle = runeCol;
  for(const r of runePositions) ctx.fillRect(r.x, r.y, r.w, r.h);
  ctx.globalAlpha = runePulse * 0.25;
  ctx.fillStyle = runeHi;
  for(const r of runePositions) ctx.fillRect(r.x + 1, r.y, r.w - 2, 1);
  ctx.globalAlpha = 1;

  // Pillars
  for(const px of [0, 20, CANVAS_W - 36, CANVAS_W - 16]) {
    ctx.fillStyle = blockA;
    ctx.fillRect(px, 0, 18, GROUND_Y);
    ctx.fillStyle = mortarC;
    ctx.fillRect(px, 0, 2, GROUND_Y);
    ctx.fillRect(px + 16, 0, 2, GROUND_Y);
    ctx.globalAlpha = runePulse * 0.4;
    ctx.fillStyle = pillarV;
    ctx.fillRect(px + 7, 20, 2, 60);
    ctx.fillRect(px + 7, 100, 2, 40);
    ctx.globalAlpha = 1;
  }

  // Floating dust
  const particleSeed = Math.floor(f * 0.3);
  for(let i = 0; i < 18; i++) {
    const px = ((i*137 + particleSeed*7) % CANVAS_W);
    const py = ((i*89  + particleSeed*3) % (GROUND_Y - 20));
    ctx.globalAlpha = 0.12 + (i%3)*0.06;
    ctx.fillStyle = i%3===0 ? dustA : i%3===1 ? dustB : dustC;
    ctx.fillRect(px, py, 2, 2);
  }
  ctx.globalAlpha = 1;

  // Ground fog
  ctx.globalAlpha = 0.06 + Math.sin(f * 0.012) * 0.02;
  ctx.fillStyle = fogCol;
  ctx.fillRect(-20, GROUND_Y - 40, CANVAS_W + 40, 40);
  ctx.globalAlpha = 1;

  // Phase flash
  if(gs.phaseFlash > 0) {
    ctx.fillStyle = `rgba(180,50,255,${(gs.phaseFlash/25)*0.65})`;
    ctx.fillRect(-20, -20, CANVAS_W+40, CANVAS_H+40);
  }

  drawGround(ctx, gs.groundOffset, ABYSS_SCENERY, gs.bossPhase);

  const hpFrac = gs.bossHp / BOSS_MAX_HP;
  const flickering = gs.teleportFlicker > 0;

  // Death animation
  if(gs.won && gs.deathAnim > 0) {
    const dt = gs.deathAnim / 120;  // 1 → 0
    const shatter = 1 - dt;         // 0 → 1 as animation progresses

    // Boss flickers and shrinks/dissolves
    if(dt > 0.15) {
      const flickerOn = Math.floor(gs.frame * 0.4) % 3 !== 0;
      if(flickerOn) {
        ctx.save();
        // Scale boss down as it dies
        const scale = 0.4 + dt * 0.6;
        ctx.translate(gs.bossX, gs.bossY);
        ctx.scale(scale, scale);
        ctx.translate(-gs.bossX, -gs.bossY);
        // White flash overlay on boss
        ctx.globalAlpha = shatter * 0.8;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(gs.bossX - 70, gs.bossY - 80, 140, 160);
        ctx.globalAlpha = 1;
        drawBoss(ctx, gs.bossX, gs.bossY, f, gs.bossPhase, 0, false, 1, false);
        ctx.restore();
      }
    }

    // Pixel chunk shards flying outward
    const chunkSeed = Math.floor(shatter * 18);
    const chunkCols = ["#8833cc", "#cc44ff", "#5a1e88", "#ffffff", "#ff88cc"];
    for(let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const dist  = shatter * (60 + (i % 4) * 40);
      const cx2   = gs.bossX + Math.cos(angle + chunkSeed * 0.3) * dist;
      const cy2   = gs.bossY + Math.sin(angle + chunkSeed * 0.3) * dist - shatter * 20;
      const size  = Math.max(1, (1 - shatter) * (4 + i % 5));
      ctx.globalAlpha = Math.max(0, dt * 1.2);
      ctx.fillStyle = chunkCols[i % chunkCols.length];
      ctx.fillRect(cx2, cy2, size, size);
    }
    ctx.globalAlpha = 1;

    // Screen fade to white in final frames
    if(dt < 0.35) {
      ctx.globalAlpha = 1 - dt / 0.35;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-20, -20, CANVAS_W+40, CANVAS_H+40);
      ctx.globalAlpha = 1;
    }
  } else if(!flickering || gs.frame % 2 === 0) {
    if(gs.blindWindow) drawBossBlindOutline(ctx, gs.bossX, gs.bossY, f, gs.bossPhase);
    drawBoss(ctx, gs.bossX, gs.bossY, f, gs.bossPhase, hpFrac, gs.blindWindow, gs.hitFlash, gs.bossOpen);
  }
  if(gs.hitFlash > 0) gs.hitFlash--;

  // Telegraph
  if(!gs.blindWindow && gs.barrage.length > 0 && gs.attackIndex < gs.barrage.length) {
    const atk = gs.barrage[gs.attackIndex];
    if(gs.attackTimer < atk.warmup)
      drawBossTelegraph(ctx, atk, gs.attackTimer, atk.warmup, gs.bossX, gs.bossY, gs.dino.x+20, gs.dino.y+24, f);
  }

  drawBossAttacks(ctx, gs.projectiles, f);

  // Particles
  for(const p of gs.particles) {
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    if(p.ring) {
      ctx.strokeStyle = p.col; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.stroke();
    } else {
      ctx.fillStyle = p.col;
      ctx.fillRect(Math.round(p.x-p.size/2), Math.round(p.y-p.size/2), p.size, p.size);
    }
  }
  ctx.globalAlpha = 1;

  // Only animate legs when dino is actively dashing
  const dinoMoving = gs.dino.dashTimer > 0;
  const dinoF = dinoMoving ? f : 0;

  drawDino(ctx, gs.dino.x, gs.dino.y, dinoF, false,
    gs.skin, gs.design, false, gs.dino.ducking, false, false,
    gs.dino.invTimer, gs.dino.onGround, null);

  // Dino bite animation
  if(gs.biteAnim > 0) {
    const t       = gs.biteAnim / 18;
    const lunge   = Math.sin(t * Math.PI) * 12;
    const jawOpen = Math.sin(t * Math.PI) * 11;
    const jo      = Math.round(jawOpen);
    const bx      = gs.dino.x + Math.round(lunge);
    const by      = gs.dino.y;
    const c  = gs.skin?.color      || "#2a2a2a";
    const ec = gs.skin?.eyeColor   || "#f0f0f0";
    const ac = gs.skin?.accent     || "#3a3a3a";
    const pc = gs.skin?.plateColor || "#333";
    const fc = gs.skin?.frillColor || "#444";
    const id = gs.design?.id || "raptor";
    ctx.save();
    // helpers
    const fill  = col => { ctx.fillStyle = col; };
    const rect  = (rx,ry,rw,rh) => ctx.fillRect(bx+rx, by+ry, rw, rh);
    const teeth = (rx,ry,count,gap,th,bh) => {
      ctx.fillStyle = "#f5f0e8";
      for(let i=0;i<count;i++) { ctx.fillRect(bx+rx+i*gap, by+ry, 2, th); }
      if(bh>0) for(let i=0;i<count-1;i++) { ctx.fillRect(bx+rx+gap/2+i*gap, by+ry+jo+1, 2, bh); }
    };
    const cavity = (rx,ry,rw) => {
      ctx.fillStyle = "#1a0000"; ctx.fillRect(bx+rx, by+ry, rw, jo+1);
      if(jo>=4){ ctx.fillStyle="#cc3344"; ctx.fillRect(bx+rx+2, by+ry+Math.round(jo*0.35), rw-4, Math.round(jo*0.3)); }
    };
    if(id==="raptor") {
      fill(c); rect(20,2,20,16); rect(20,2,20,7);           // cover + upper jaw
      rect(20,9+jo,18,6);                                   // lower jaw
      cavity(21,8,17); teeth(22,8,4,4,Math.round(jo*.55),Math.round(jo*.4));
      fill(ec); rect(32,3,6,6); fill("#000"); rect(34,5,3,3); fill(ac); rect(38,5,2,2);
    } else if(id==="trex") {
      fill(c); rect(16,0,22,14); rect(16,0,22,6); rect(16,6+jo,20,7);
      cavity(17,5,20); teeth(18,5,5,4,Math.round(jo*.55),Math.round(jo*.4));
      fill(ec); rect(32,2,7,7); fill("#000"); rect(34,4,4,4);
    } else if(id==="stego") {
      fill(c); rect(18,4,18,14); rect(18,4,18,6); rect(18,10+jo,16,6);
      cavity(19,9,15); teeth(20,9,3,5,Math.round(jo*.5),Math.round(jo*.4));
      fill(ec); rect(28,6,6,6); fill("#000"); rect(30,8,3,3);
    } else if(id==="pterodac") {
      fill(c);
      rect(20,6,18,8); rect(20,6,18,3); rect(24,4,14,3); rect(28,2,10,3); rect(32,0,6,3); // upper beak
      rect(20,9+jo,16,3); rect(24,11+jo,12,2); rect(28,13+jo,8,2);                         // lower beak
      ctx.fillStyle="#1a0000"; ctx.fillRect(bx+21,by+8,15,jo+1);
      fill(ec); rect(32,8,5,5); fill("#000"); rect(33,9,3,3);
    } else if(id==="anky") {
      fill(c); rect(16,4,20,12); rect(16,4,20,5); rect(16,9+jo,18,6);
      cavity(17,8,17); teeth(18,8,3,5,Math.round(jo*.5),Math.round(jo*.4));
      fill(pc); rect(16,4,20,3);                            // armored brow
      fill(ec); rect(28,6,6,6); fill("#000"); rect(30,8,3,3);
    } else if(id==="tri") {
      fill(c); rect(16,2,24,16); rect(16,2,24,7); rect(16,9+jo,22,7);
      cavity(17,8,22); teeth(18,8,5,4,Math.round(jo*.5),Math.round(jo*.4));
      fill(pc); rect(36,4,4,10); rect(38,6,3,6);            // beak tip
      fill(ec); rect(28,4,6,6); fill("#000"); rect(30,6,3,3);
    } else if(id==="brachio") {
      fill(c); rect(22,-6,12,12); rect(22,-6,12,5); rect(22,-2+jo,10,5);
      cavity(23,-2,10); teeth(24,-2,2,4,Math.round(jo*.5),Math.round(jo*.4));
      fill(ec); rect(28,-4,5,5); fill("#000"); rect(29,-3,3,3);
    } else if(id==="spino") {
      fill(c); rect(20,2,22,14); rect(20,2,22,6); rect(20,8+jo,20,6);
      cavity(21,7,20); teeth(22,7,5,4,Math.round(jo*.55),Math.round(jo*.45));
      fill(ec); rect(30,4,6,6); fill("#000"); rect(32,6,3,3);
    } else if(id==="pachy") {
      fill(pc); rect(18,-4,18,12); rect(20,-8,14,6);        // dome (stays)
      fill(c); rect(18,6,18,12); rect(18,6,18,5); rect(18,11+jo,16,6);
      cavity(19,10,15); teeth(20,10,3,5,Math.round(jo*.5),Math.round(jo*.4));
      fill(ec); rect(30,8,5,5); fill("#000"); rect(31,9,3,3);
    } else if(id==="para") {
      fill(fc); rect(18,-4,8,10); rect(10,-8,10,6); rect(0,-10,12,5); rect(-6,-8,8,4); // crest
      fill(c); rect(18,4,24,14); rect(18,4,24,6); rect(18,10+jo,22,6);
      cavity(19,9,22); teeth(20,9,5,4,Math.round(jo*.45),Math.round(jo*.35));
      fill(ec); rect(30,6,6,6); fill("#000"); rect(32,8,3,3);
    } else if(id==="dilopho") {
      fill(c); rect(20,2,18,14); rect(20,2,18,6); rect(20,8+jo,16,6);
      cavity(21,7,16); teeth(22,7,3,5,Math.round(jo*.55),Math.round(jo*.45));
      fill(fc);                                             // frill fans with jaw
      const fs = Math.round(jo*0.5);
      rect(34,2-fs,10,6+fs*2); rect(36,0-fs,6,10+fs*2);
      rect(22,-6,4,10); rect(28,-6,4,10); rect(20,-8,16,4); // crest
      fill(ec); rect(30,4,6,6); fill("#000"); rect(32,6,3,3);
    } else if(id==="hasim") {
      // Hasim stabs with a knife instead of biting
      // Arm raises and thrusts forward with the lunge
      const sk   = c  || "#f5c89a";
      const shirt = ac || "#3a7acc";
      const hair  = fc || "#2a1a08";
      // Cover original right arm + redraw raised
      fill(shirt); rect(32,13,7,16);           // erase original arm with shirt
      fill(sk);    rect(32,13,7,12);           // upper arm (skin)
      // Raised forearm — lifts up as jaw opens (reuse jo for raise amount)
      const raise = Math.round(jo * 0.7);      // arm raises up to ~8px
      rect(32, 13-raise, 6, 10);               // forearm raised
      rect(32, 3-raise,  5,  6);               // hand
      // Knife handle (dark brown)
      fill("#3a2008"); rect(33, -1-raise, 4, 5);
      fill("#5a3010"); rect(34, -1-raise, 2, 4); // handle highlight
      // Knife guard (small crossguard)
      fill("#888"); rect(31, -2-raise, 8, 2);
      // Blade — extends forward with lunge
      const bladeLen = 8 + Math.round(jo * 0.8); // grows as arm thrusts
      fill("#d0d8e0"); rect(35, -3-raise, bladeLen, 3);   // blade body
      fill("#ffffff"); rect(35, -3-raise, bladeLen-2, 1); // blade shine
      fill("#c0c8d0"); rect(35+bladeLen-2, -3-raise, 2, 2); // blade tip
      // Determined face — drawn at original x, not lunged bx
      const hx = gs.dino.x;
      fill(sk); ctx.fillRect(hx+13,by+1,16,12);
      fill(hair); ctx.fillRect(hx+13,by+1,16,4); ctx.fillRect(hx+11,by+2,4,6);
      fill(ec); ctx.fillRect(hx+15,by+5,4,4); ctx.fillRect(hx+23,by+5,4,4);
      fill("#000"); ctx.fillRect(hx+16,by+6,2,2); ctx.fillRect(hx+24,by+6,2,2);
      // Gritted teeth
      fill("#1a0a00"); ctx.fillRect(hx+16,by+10,10,2);
      fill("#f5f0e8"); ctx.fillRect(hx+17,by+10,2,1); ctx.fillRect(hx+20,by+10,2,1); ctx.fillRect(hx+23,by+10,2,1);
    }
    ctx.restore();
  }

  // Phase transition animation
  if(gs.phaseTransition > 0) {
    const pt = gs.phaseTransition / 90;          // 1 → 0
    const col1 = gs.bossPhase === 2 ? "#ff2200" : "#ff8800";
    const col2 = gs.bossPhase === 2 ? "#ff6600" : "#ffcc00";
    // Full-screen color pulse — fades out
    ctx.globalAlpha = pt * 0.45;
    ctx.fillStyle = col1;
    ctx.fillRect(-20, -20, CANVAS_W+40, CANVAS_H+40);
    ctx.globalAlpha = 1;
    // 4 expanding shockwave rings from boss center
    for(let i = 0; i < 4; i++) {
      const delay = i * 0.18;
      const progress = Math.max(0, (1 - pt) - delay);
      if(progress <= 0) continue;
      const r = progress * 320;
      const alpha = Math.max(0, (1 - progress) * 0.9);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = i % 2 === 0 ? col1 : col2;
      ctx.lineWidth = 4 - i;
      ctx.beginPath();
      ctx.arc(gs.bossX, gs.bossY, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // Phase label — fades in then out
    const labelAlpha = pt < 0.3 ? pt / 0.3 : pt > 0.7 ? (1 - pt) / 0.3 : 1;
    ctx.globalAlpha = labelAlpha;
    ctx.font = "bold 18px 'Courier New'";
    ctx.textAlign = "center";
    ctx.fillStyle = col2;
    ctx.fillText(`— PHASE ${gs.bossPhase + 1} —`, CANVAS_W / 2, CANVAS_H / 2 - 10);
    ctx.font = "bold 10px 'Courier New'";
    ctx.fillStyle = col1;
    const phaseGlitch = ["▓▒░█▓▒░", "█░▒▓░▒█", "░▓█▒░▓▒", "▒█░▓▒░█"];
    const pg = phaseGlitch[Math.floor(gs.frame / 5) % phaseGlitch.length];
    ctx.fillText(gs.bossPhase === 2 ? `${pg} UNLEASHED` : `${pg} ENRAGED`, CANVAS_W / 2, CANVAS_H / 2 + 10);
    ctx.textAlign = "left";
    ctx.globalAlpha = 1;
  }

  // Floating texts
  for(const t of gs.floatingTexts) {
    ctx.globalAlpha = Math.min(1, t.life/t.maxLife*2);
    ctx.fillStyle = t.color; ctx.font = "bold 11px 'Courier New'";
    ctx.fillText(t.text, t.x, t.y); ctx.globalAlpha = 1;
  }

  ctx.restore(); // end shake

  // HUD — boss name + HP bar fixed at top center
  const barW = 200, barX = CANVAS_W/2 - barW/2, barY = 16;
  const hpFracHud = gs.bossHp / BOSS_MAX_HP;
  const barCol = gs.bossPhase === 2 ? "#cc2200" : gs.bossPhase === 1 ? "#aa4400" : "#7722bb";
  const barFill = Math.floor(barW * hpFracHud);
  // Name — completely unreadable corrupted glitch text
  const corruptedNames = [
    "▓▒░█▓▒░", "█░▒▓░▒█", "░▓█▒░▓▒", "▒█░▓▒░█",
    "▓░▒█░▓▒", "░█▓▒█░▓", "▒▓░█▓░▒", "█▒░▓█▒░",
  ];
  const nameIdx = Math.floor(gs.frame / 6) % corruptedNames.length;
  const nameW = 80;
  ctx.font = "bold 9px 'Courier New'";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(CANVAS_W/2 - nameW/2, barY - 12, nameW, 11);
  ctx.fillStyle = "#d8b8ff";
  ctx.fillText(corruptedNames[nameIdx], CANVAS_W/2, barY - 3);
  ctx.textAlign = "left";
  // Bar
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(barX - 2, barY - 2, barW + 4, 10);
  ctx.fillStyle = "#0d0018";
  ctx.fillRect(barX, barY, barW, 6);
  ctx.fillStyle = barCol;
  ctx.fillRect(barX, barY, barFill, 6);
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.fillRect(barX, barY, barFill, 2);

  // HUD — lives
  const heartSize = 14, heartGap = 4;
  const totalW = gs.lives*(heartSize+heartGap)-heartGap;
  const startX = CANVAS_W-totalW-8, heartY = CANVAS_H-heartSize-8;
  for(let i = 0; i < gs.lives; i++) {
    const hx = startX+i*(heartSize+heartGap), hy = heartY;
    ctx.fillStyle = "#ff2244";
    ctx.fillRect(hx+1,hy,6,4); ctx.fillRect(hx+7,hy,6,4);
    ctx.fillRect(hx,hy+3,14,5); ctx.fillRect(hx+1,hy+8,12,3);
    ctx.fillRect(hx+3,hy+11,8,2); ctx.fillRect(hx+5,hy+13,4,1);
  }

  // HUD — dodge hint
  if(!gs.blindWindow && gs.barrage.length > 0 && gs.attackIndex < gs.barrage.length) {
    const atk = gs.barrage[gs.attackIndex];
    if(gs.attackTimer < atk.warmup) {
      ctx.globalAlpha = 0.5 + Math.sin(f*0.35)*0.5;
      ctx.fillStyle = "#ff4400"; ctx.font = "bold 11px 'Courier New'";
      ctx.textAlign = "center"; ctx.fillText(atk.dodge, CANVAS_W/2, CANVAS_H-10);
      ctx.textAlign = "left"; ctx.globalAlpha = 1;
    }
  }
}
