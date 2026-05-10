// ─── BOSS RENDER ───────────────────────────────────────────────────────────────────
import { CANVAS_W, CANVAS_H, GROUND_Y, DINO_W } from "../constants";
import { drawDino }                      from "../rendering/drawDino";
import { drawBoss, drawGround }          from "../rendering/drawWorld";
import { drawBossAttacks, drawBossTelegraph } from "../rendering/drawBossAttacks";
import { BOSS_MAX_HP, ABYSS_SCENERY, BITE_RANGE, BLIND_DURATION } from "./bossConstants";

// ─── CRACK OVERLAY ───────────────────────────────────────────────────────────────────
export function CrackOverlay() {
  return (
    <svg viewBox="0 0 720 270" preserveAspectRatio="none"
      style={{ position:"absolute", inset:"-6%", width:"112%", height:"112%",
               pointerEvents:"none", zIndex:10, overflow:"visible", imageRendering:"pixelated" }}>
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
    </svg>
  );
}

// ─── RENDER BOSS FRAME ───────────────────────────────────────────────────────────────────
export function renderBoss(ctx, gs) {
  const f = gs.frame;

  ctx.save();
  ctx.translate(Math.round(gs.shake.x), Math.round(gs.shake.y));

  // Background
  ctx.fillStyle = "#0d0018";
  ctx.fillRect(-20, -20, CANVAS_W+40, CANVAS_H+40);

  // Tendrils
  const tendrilCount = 6 + gs.bossPhase * 4;
  for(let i = 0; i < tendrilCount; i++) {
    const angle = (i / tendrilCount) * Math.PI * 2 + f * 0.004;
    const len   = 70 + gs.bossPhase * 35 + Math.sin(f * 0.02 + i) * 20;
    ctx.globalAlpha = 0.10 + gs.bossPhase * 0.04;
    ctx.fillStyle = "#6600cc";
    for(let s = 0; s < 5; s++) {
      const r  = (s / 5) * len;
      const px = Math.round(gs.bossX + Math.cos(angle + s * 0.15) * r);
      const py = Math.round(gs.bossY + Math.sin(angle + s * 0.15) * r);
      ctx.fillRect(px-2, py-2, 5-s, 5-s);
    }
  }
  ctx.globalAlpha = 1;

  // Void particles
  const particleSeed = Math.floor(f * 0.3);
  for(let i = 0; i < 12; i++) {
    const px = ((i*137 + particleSeed*7) % CANVAS_W);
    const py = ((i*89  + particleSeed*3) % (GROUND_Y - 20));
    ctx.globalAlpha = 0.15 + (i%3)*0.08;
    ctx.fillStyle = i%2===0 ? "#8833cc" : "#cc44ff";
    ctx.fillRect(px, py, 2, 2);
  }
  ctx.globalAlpha = 1;

  // Vignette
  ctx.fillStyle = `rgba(60,0,100,${(0.10 + gs.bossPhase*0.05) + Math.sin(f*0.025)*0.04})`;
  ctx.fillRect(-20, -20, CANVAS_W+40, CANVAS_H+40);

  // Phase 2 scanlines
  if(gs.bossPhase >= 2) {
    ctx.fillStyle = `rgba(120,0,60,${Math.sin(f*0.15)*0.04+0.04})`;
    for(let y = 0; y < CANVAS_H; y += 4) ctx.fillRect(-20, y, CANVAS_W+40, 2);
  }

  // Phase flash
  if(gs.phaseFlash > 0) {
    ctx.fillStyle = `rgba(180,50,255,${(gs.phaseFlash/25)*0.65})`;
    ctx.fillRect(-20, -20, CANVAS_W+40, CANVAS_H+40);
  }

  drawGround(ctx, gs.groundOffset, ABYSS_SCENERY, 1);

  const hpFrac = gs.bossHp / BOSS_MAX_HP;
  // Flicker: skip drawing boss every other frame during teleport wind-up
  const flickering = gs.teleportFlicker > 0;
  if(!flickering || gs.frame % 2 === 0)
    drawBoss(ctx, gs.bossX, gs.bossY, f, gs.bossPhase, hpFrac, gs.blindWindow, gs.hitFlash, gs.bossOpen);
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

  // Bite range indicator — shown during blind window
  if(gs.blindWindow && gs.stats.hasBite) {
    const range = BITE_RANGE[gs.bossPhase];
    const rangeX = gs.bossX - range;
    ctx.globalAlpha = 0.18 + Math.sin(f * 0.2) * 0.08;
    ctx.fillStyle = "#ffdd00";
    ctx.fillRect(rangeX, GROUND_Y - 4, range, 4);
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = "#ffdd00";
    ctx.fillRect(rangeX - 2, 0, 2, GROUND_Y);
    ctx.globalAlpha = 1;
  }

  // Dino bite lunge flash
  if(gs.biteAnim > 0) {
    const a = gs.biteAnim / 18;
    ctx.globalAlpha = a * 0.7;
    ctx.fillStyle = "#ffdd00";
    ctx.fillRect(gs.dino.x + DINO_W - 4, gs.dino.y + 4, Math.floor(a * 28), 8);
    ctx.globalAlpha = a * 0.4;
    ctx.fillRect(gs.dino.x + DINO_W,     gs.dino.y + 8, Math.floor(a * 18), 4);
    ctx.globalAlpha = 1;
  }

  drawDino(ctx, gs.dino.x, gs.dino.y, f, false,
    gs.skin, gs.design, false, gs.dino.ducking, false, false,
    gs.dino.invTimer, gs.dino.onGround, null);

  // Floating texts
  for(const t of gs.floatingTexts) {
    ctx.globalAlpha = Math.min(1, t.life/t.maxLife*2);
    ctx.fillStyle = t.color; ctx.font = "bold 11px 'Courier New'";
    ctx.fillText(t.text, t.x, t.y); ctx.globalAlpha = 1;
  }

  ctx.restore(); // end shake

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

  // HUD — bite bar
  if(gs.stats.hasBite) {
    const biteReady = gs.biteCooldown <= 0;
    ctx.fillStyle = "rgba(0,0,0,0.4)"; ctx.fillRect(8, CANVAS_H-28, 60, 6);
    ctx.fillStyle = biteReady ? "#ffdd00" : "#884400";
    ctx.fillRect(8, CANVAS_H-28, Math.floor(60*(biteReady?1:1-gs.biteCooldown/45)), 6);
    ctx.fillStyle = biteReady ? "#ffdd00" : "#666";
    ctx.font = "bold 9px 'Courier New'";
    ctx.fillText(biteReady ? "[F] BITE READY" : "[F] BITE...", 8, CANVAS_H-14);
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

  // HUD — blind window
  if(gs.blindWindow) {
    const phase      = gs.bossPhase;
    const urgentCol  = phase >= 2 ? "#ff2200" : phase >= 1 ? "#ff8800" : "#ffdd00";
    const timerFrac  = Math.max(0, gs.blindTimer / BLIND_DURATION[phase]);
    // Countdown bar across top
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, CANVAS_W, 8);
    ctx.fillStyle = urgentCol;
    ctx.fillRect(0, 0, Math.floor(CANVAS_W * timerFrac), 8);
    // Flashing text
    ctx.fillStyle = `rgba(${phase>=2?"255,34,0":phase>=1?"255,136,0":"255,220,0"},${0.7+Math.sin(f*0.3)*0.3})`;
    ctx.font = `bold ${phase>=2?"14":"13"}px 'Courier New'`; ctx.textAlign = "center";
    ctx.fillText(
      phase >= 2 ? "BITE NOW! GET CLOSE!" : "BLIND SPOT! PRESS [F] TO BITE!",
      CANVAS_W/2, 24
    );
    ctx.textAlign = "left";
  }

  // HUD — phase label
  ctx.fillStyle = "rgba(255,50,0,0.5)"; ctx.font = "9px 'Courier New'";
  const posLabel = gs.bossX < CANVAS_W * 0.35 ? " [LEFT]" : gs.bossX < CANVAS_W * 0.6 ? " [CENTER]" : "";
  ctx.fillText(`PHASE ${gs.bossPhase+1}  |  HP ${gs.bossHp}/${BOSS_MAX_HP}${posLabel}`, 8, 20);
}
