// ─── BITE ANIMATION ──────────────────────────────────────────────────────────
// biteAnim counts 18 → 0.
// Phase 1 (t > 0.5): wind-up lean back, jaw opens wide.
// Phase 2 (t ≤ 0.5): snap forward lunge, jaw slams shut.

import { drawRaptor }  from "../dinos/raptor";
import { drawTrex }    from "../dinos/trex";
import { drawStego }   from "../dinos/stego";
import { drawPterodac }from "../dinos/pterodac";
import { drawAnky }    from "../dinos/anky";
import { drawTri }     from "../dinos/tri";
import { drawBrachio } from "../dinos/brachio";
import { drawSpino }   from "../dinos/spino";
import { drawPachy }   from "../dinos/pachy";
import { drawPara }    from "../dinos/para";
import { drawDilopho } from "../dinos/dilopho";
import { drawHasim }   from "../dinos/hasim";

// Eases in fast, out slow — snappy feel
function easeSnap(t) { return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2; }

export function drawBiteAnim(ctx, biteAnim, x, y, skin, design, frame) {
  if (biteAnim <= 0) return;

  const t   = biteAnim / 18;           // 1 → 0
  const id  = design?.id || "raptor";
  const c   = skin?.color      || "#2a2a2a";
  const ec  = skin?.eyeColor   || "#f0f0f0";
  const ac  = skin?.accent     || "#3a3a3a";
  const pc  = skin?.plateColor || "#333";
  const fc  = skin?.frillColor || "#444";

  // Animation curve:
  // t 1→0.5 = wind-up: lean back slightly, jaw opens
  // t 0.5→0 = lunge: whole body surges forward, jaw snaps shut
  const lungeT  = t > 0.5 ? 0 : easeSnap(1 - t * 2);   // 0→1 during snap phase
  const jawT    = t > 0.5 ? easeSnap((1 - t) * 2) : easeSnap(t * 2); // opens then closes
  const leanT   = t > 0.5 ? easeSnap((1 - t) * 2) : 0; // lean back during wind-up only

  const lunge   = lungeT * 18;         // max 18px forward surge
  const lean    = leanT  * -4;         // max 4px lean back
  const jawOpen = jawT   * 12;         // max 12px jaw gap
  const jo      = Math.round(jawOpen);

  const animLegs = true;
  const f = Math.floor(frame / 5) % 2;
  const wf = Math.floor(frame / 6) % 2;

  ctx.save();

  // ── Step 1: draw full dino shifted by lunge + lean (body moves as one unit) ──
  ctx.save();
  ctx.translate(Math.round(lunge + lean), 0);
  switch(id) {
    case "raptor":  drawRaptor(ctx, x, y, false, c, ec, ac, false, f); break;
    case "trex":    drawTrex(ctx, x, y, false, c, ec, ac, false, f); break;
    case "stego":   drawStego(ctx, x, y, false, c, ec, pc, false, f); break;
    case "pterodac":drawPterodac(ctx, x, y, false, c, ec, ac, fc, wf, false); break;
    case "anky":    drawAnky(ctx, x, y, false, c, ec, ac, pc, false, f); break;
    case "tri":     drawTri(ctx, x, y, false, c, ec, ac, pc, fc, false, f); break;
    case "brachio": drawBrachio(ctx, x, y, false, c, ec, ac, false, f); break;
    case "spino":   drawSpino(ctx, x, y, false, c, ec, ac, fc, false, f); break;
    case "pachy":   drawPachy(ctx, x, y, false, c, ec, ac, pc, false, f); break;
    case "para":    drawPara(ctx, x, y, false, c, ec, ac, fc, false, f); break;
    case "dilopho": drawDilopho(ctx, x, y, false, c, ec, ac, fc, false, f); break;
    case "hasim":   drawHasim(ctx, x, y, false, c, ec, ac, pc, fc, false, f); break;
  }
  ctx.restore();

  if (jo < 1) { ctx.restore(); return; }

  // ── Step 2: overdraw open jaw on top of the shifted head ──
  // All coords are relative to the lunged+leaned dino position
  const bx = x + Math.round(lunge + lean);
  const by = y;

  ctx.save();

  switch(id) {

    case "raptor": {
      // Head: x+20,y+2 size 20×16. Jaw hinge at right edge of neck (~x+20).
      // Upper jaw stays, lower jaw drops. Cover original head first.
      ctx.fillStyle = c;
      ctx.fillRect(bx+20, by+2, 20, 16);           // erase original head
      // Upper jaw
      ctx.fillRect(bx+20, by+2,  20, 7);
      // Lower jaw drops
      ctx.fillRect(bx+20, by+9+jo, 18, 6);
      // Mouth cavity
      ctx.fillStyle = "#220000";
      ctx.fillRect(bx+21, by+8, 17, jo+1);
      // Teeth — upper (pointed down)
      ctx.fillStyle = "#f5f0e8";
      for(let i=0;i<4;i++) ctx.fillRect(bx+22+i*4, by+8, 2, Math.max(1,Math.round(jo*0.55)));
      // Teeth — lower (pointed up)
      for(let i=0;i<3;i++) ctx.fillRect(bx+24+i*4, by+9+jo, 2, Math.max(1,Math.round(jo*0.45)));
      // Tongue
      if(jo >= 4) {
        ctx.fillStyle = "#cc3344";
        ctx.fillRect(bx+24, by+9+Math.round(jo*0.3), 8, Math.round(jo*0.35));
      }
      // Eye redrawn on shifted head
      ctx.fillStyle = ec; ctx.fillRect(bx+32, by+3, 6, 6);
      ctx.fillStyle = "#000"; ctx.fillRect(bx+34, by+5, 3, 3);
      ctx.fillStyle = ac; ctx.fillRect(bx+38, by+5, 2, 2);
      break;
    }

    case "trex": {
      // Head: x+16,y+0 size 22×14
      ctx.fillStyle = c;
      ctx.fillRect(bx+16, by+0, 22, 14);
      // Upper jaw
      ctx.fillRect(bx+16, by+0, 22, 6);
      // Lower jaw
      ctx.fillRect(bx+16, by+6+jo, 20, 7);
      // Cavity
      ctx.fillStyle = "#220000";
      ctx.fillRect(bx+17, by+5, 20, jo+1);
      // Teeth upper
      ctx.fillStyle = "#f5f0e8";
      for(let i=0;i<5;i++) ctx.fillRect(bx+18+i*4, by+5, 2, Math.max(1,Math.round(jo*0.55)));
      // Teeth lower
      for(let i=0;i<4;i++) ctx.fillRect(bx+20+i*4, by+6+jo, 2, Math.max(1,Math.round(jo*0.45)));
      // Tongue
      if(jo >= 4) {
        ctx.fillStyle = "#cc3344";
        ctx.fillRect(bx+22, by+6+Math.round(jo*0.3), 10, Math.round(jo*0.35));
      }
      // Eye
      ctx.fillStyle = ec; ctx.fillRect(bx+32, by+2, 7, 7);
      ctx.fillStyle = "#000"; ctx.fillRect(bx+34, by+4, 4, 4);
      break;
    }

    case "stego": {
      // Head: x+18,y+4 size 18×14
      ctx.fillStyle = c;
      ctx.fillRect(bx+18, by+4, 18, 14);
      ctx.fillRect(bx+18, by+4, 18, 6);
      ctx.fillRect(bx+18, by+10+jo, 16, 6);
      ctx.fillStyle = "#220000";
      ctx.fillRect(bx+19, by+9, 15, jo+1);
      ctx.fillStyle = "#f5f0e8";
      for(let i=0;i<3;i++) ctx.fillRect(bx+20+i*5, by+9, 2, Math.max(1,Math.round(jo*0.5)));
      for(let i=0;i<2;i++) ctx.fillRect(bx+22+i*5, by+10+jo, 2, Math.max(1,Math.round(jo*0.4)));
      if(jo >= 4) { ctx.fillStyle = "#cc3344"; ctx.fillRect(bx+22, by+10+Math.round(jo*0.3), 7, Math.round(jo*0.3)); }
      ctx.fillStyle = ec; ctx.fillRect(bx+28, by+6, 6, 6);
      ctx.fillStyle = "#000"; ctx.fillRect(bx+30, by+8, 3, 3);
      break;
    }

    case "pterodac": {
      // Beak: upper x+20,y+6 lower splits. No teeth — sharp beak.
      ctx.fillStyle = c;
      ctx.fillRect(bx+20, by+6, 18, 8);
      // Upper beak (tapers to point)
      ctx.fillRect(bx+20, by+6,  18, 3);
      ctx.fillRect(bx+24, by+4,  14, 3);
      ctx.fillRect(bx+28, by+2,  10, 3);
      ctx.fillRect(bx+32, by+0,   6, 3);
      // Lower beak drops
      ctx.fillRect(bx+20, by+9+jo, 16, 3);
      ctx.fillRect(bx+24, by+11+jo, 12, 2);
      ctx.fillRect(bx+28, by+13+jo,  8, 2);
      // Cavity
      ctx.fillStyle = "#220000";
      ctx.fillRect(bx+21, by+8, 15, jo+1);
      // Eye
      ctx.fillStyle = ec; ctx.fillRect(bx+32, by+8, 5, 5);
      ctx.fillStyle = "#000"; ctx.fillRect(bx+33, by+9, 3, 3);
      break;
    }

    case "anky": {
      // Head: x+16,y+4 size 20×12. Armored — small jaw
      ctx.fillStyle = c;
      ctx.fillRect(bx+16, by+4, 20, 12);
      ctx.fillRect(bx+16, by+4, 20, 5);
      ctx.fillRect(bx+16, by+9+jo, 18, 6);
      ctx.fillStyle = "#220000";
      ctx.fillRect(bx+17, by+8, 17, jo+1);
      ctx.fillStyle = "#f5f0e8";
      for(let i=0;i<3;i++) ctx.fillRect(bx+18+i*5, by+8, 2, Math.max(1,Math.round(jo*0.5)));
      for(let i=0;i<2;i++) ctx.fillRect(bx+20+i*5, by+9+jo, 2, Math.max(1,Math.round(jo*0.4)));
      if(jo >= 4) { ctx.fillStyle = "#cc3344"; ctx.fillRect(bx+20, by+9+Math.round(jo*0.3), 8, Math.round(jo*0.3)); }
      // Armored brow ridge
      ctx.fillStyle = pc;
      ctx.fillRect(bx+16, by+4, 20, 3);
      ctx.fillStyle = ec; ctx.fillRect(bx+28, by+6, 6, 6);
      ctx.fillStyle = "#000"; ctx.fillRect(bx+30, by+8, 3, 3);
      break;
    }

    case "tri": {
      // Head: x+16,y+2 size 24×16. Wide ceratopsian beak.
      ctx.fillStyle = c;
      ctx.fillRect(bx+16, by+2, 24, 16);
      ctx.fillRect(bx+16, by+2, 24, 7);
      ctx.fillRect(bx+16, by+9+jo, 22, 7);
      ctx.fillStyle = "#220000";
      ctx.fillRect(bx+17, by+8, 22, jo+1);
      ctx.fillStyle = "#f5f0e8";
      for(let i=0;i<5;i++) ctx.fillRect(bx+18+i*4, by+8, 2, Math.max(1,Math.round(jo*0.5)));
      for(let i=0;i<4;i++) ctx.fillRect(bx+20+i*4, by+9+jo, 2, Math.max(1,Math.round(jo*0.4)));
      if(jo >= 4) { ctx.fillStyle = "#cc3344"; ctx.fillRect(bx+22, by+9+Math.round(jo*0.3), 12, Math.round(jo*0.3)); }
      // Beak tip (horn-colored)
      ctx.fillStyle = pc;
      ctx.fillRect(bx+36, by+4, 4, 10);
      ctx.fillRect(bx+38, by+6, 3, 6);
      ctx.fillStyle = ec; ctx.fillRect(bx+28, by+4, 6, 6);
      ctx.fillStyle = "#000"; ctx.fillRect(bx+30, by+6, 3, 3);
      break;
    }

    case "brachio": {
      // Head: x+22,y-6 size 12×12. Small head high up.
      ctx.fillStyle = c;
      ctx.fillRect(bx+22, by-6, 12, 12);
      ctx.fillRect(bx+22, by-6, 12, 5);
      ctx.fillRect(bx+22, by-2+jo, 10, 5);
      ctx.fillStyle = "#220000";
      ctx.fillRect(bx+23, by-2, 10, jo+1);
      ctx.fillStyle = "#f5f0e8";
      for(let i=0;i<2;i++) ctx.fillRect(bx+24+i*4, by-2, 2, Math.max(1,Math.round(jo*0.5)));
      for(let i=0;i<2;i++) ctx.fillRect(bx+25+i*4, by-1+jo, 2, Math.max(1,Math.round(jo*0.4)));
      ctx.fillStyle = ec; ctx.fillRect(bx+28, by-4, 5, 5);
      ctx.fillStyle = "#000"; ctx.fillRect(bx+29, by-3, 3, 3);
      break;
    }

    case "spino": {
      // Head: x+20,y+2 size 18×14 + snout x+32,y+6
      ctx.fillStyle = c;
      ctx.fillRect(bx+20, by+2, 22, 14);
      ctx.fillRect(bx+20, by+2, 22, 6);
      ctx.fillRect(bx+20, by+8+jo, 20, 6);
      ctx.fillStyle = "#220000";
      ctx.fillRect(bx+21, by+7, 20, jo+1);
      ctx.fillStyle = "#f5f0e8";
      for(let i=0;i<5;i++) ctx.fillRect(bx+22+i*4, by+7, 2, Math.max(1,Math.round(jo*0.55)));
      for(let i=0;i<4;i++) ctx.fillRect(bx+24+i*4, by+8+jo, 2, Math.max(1,Math.round(jo*0.45)));
      if(jo >= 4) { ctx.fillStyle = "#cc3344"; ctx.fillRect(bx+25, by+8+Math.round(jo*0.3), 10, Math.round(jo*0.35)); }
      ctx.fillStyle = ec; ctx.fillRect(bx+30, by+4, 6, 6);
      ctx.fillStyle = "#000"; ctx.fillRect(bx+32, by+6, 3, 3);
      break;
    }

    case "pachy": {
      // Head: x+18,y+6 size 18×12. Dome head — jaw opens from bottom.
      ctx.fillStyle = c;
      ctx.fillRect(bx+18, by+6, 18, 12);
      // Dome top stays solid
      ctx.fillStyle = pc;
      ctx.fillRect(bx+18, by-4, 18, 12);
      ctx.fillRect(bx+20, by-8, 14,  6);
      ctx.fillStyle = c;
      ctx.fillRect(bx+18, by+6, 18, 5);
      ctx.fillRect(bx+18, by+11+jo, 16, 6);
      ctx.fillStyle = "#220000";
      ctx.fillRect(bx+19, by+10, 15, jo+1);
      ctx.fillStyle = "#f5f0e8";
      for(let i=0;i<3;i++) ctx.fillRect(bx+20+i*5, by+10, 2, Math.max(1,Math.round(jo*0.5)));
      for(let i=0;i<2;i++) ctx.fillRect(bx+22+i*5, by+11+jo, 2, Math.max(1,Math.round(jo*0.4)));
      if(jo >= 4) { ctx.fillStyle = "#cc3344"; ctx.fillRect(bx+22, by+11+Math.round(jo*0.3), 7, Math.round(jo*0.3)); }
      ctx.fillStyle = ec; ctx.fillRect(bx+30, by+8, 5, 5);
      ctx.fillStyle = "#000"; ctx.fillRect(bx+31, by+9, 3, 3);
      break;
    }

    case "para": {
      // Head: x+18,y+4 size 18×14 + duck bill x+34,y+8
      ctx.fillStyle = c;
      ctx.fillRect(bx+18, by+4, 24, 14);
      ctx.fillRect(bx+18, by+4, 24, 6);
      ctx.fillRect(bx+18, by+10+jo, 22, 6);
      ctx.fillStyle = "#220000";
      ctx.fillRect(bx+19, by+9, 22, jo+1);
      // Duck bill has flat teeth-like ridges
      ctx.fillStyle = "#f5f0e8";
      for(let i=0;i<5;i++) ctx.fillRect(bx+20+i*4, by+9, 2, Math.max(1,Math.round(jo*0.45)));
      for(let i=0;i<4;i++) ctx.fillRect(bx+22+i*4, by+10+jo, 2, Math.max(1,Math.round(jo*0.35)));
      if(jo >= 4) { ctx.fillStyle = "#cc3344"; ctx.fillRect(bx+24, by+10+Math.round(jo*0.3), 10, Math.round(jo*0.3)); }
      // Crest
      ctx.fillStyle = fc;
      ctx.fillRect(bx+18, by-4,  8, 10);
      ctx.fillRect(bx+10, by-8, 10,  6);
      ctx.fillRect(bx+0,  by-10,12,  5);
      ctx.fillStyle = ec; ctx.fillRect(bx+30, by+6, 6, 6);
      ctx.fillStyle = "#000"; ctx.fillRect(bx+32, by+8, 3, 3);
      break;
    }

    case "dilopho": {
      // Head: x+20,y+2 size 18×14 + side frill
      ctx.fillStyle = c;
      ctx.fillRect(bx+20, by+2, 18, 14);
      ctx.fillRect(bx+20, by+2, 18, 6);
      ctx.fillRect(bx+20, by+8+jo, 16, 6);
      ctx.fillStyle = "#220000";
      ctx.fillRect(bx+21, by+7, 16, jo+1);
      ctx.fillStyle = "#f5f0e8";
      for(let i=0;i<3;i++) ctx.fillRect(bx+22+i*5, by+7, 2, Math.max(1,Math.round(jo*0.55)));
      for(let i=0;i<2;i++) ctx.fillRect(bx+24+i*5, by+8+jo, 2, Math.max(1,Math.round(jo*0.45)));
      if(jo >= 4) { ctx.fillStyle = "#cc3344"; ctx.fillRect(bx+24, by+8+Math.round(jo*0.3), 7, Math.round(jo*0.35)); }
      // Frill fans out wider when jaw opens
      ctx.fillStyle = fc;
      const frillSpread = Math.round(jo * 0.5);
      ctx.fillRect(bx+34, by+2-frillSpread, 10, 6+frillSpread*2);
      ctx.fillRect(bx+36, by+0-frillSpread,  6, 10+frillSpread*2);
      // Crest
      ctx.fillRect(bx+22, by-6, 4, 10);
      ctx.fillRect(bx+28, by-6, 4, 10);
      ctx.fillRect(bx+20, by-8, 16,  4);
      ctx.fillStyle = ec; ctx.fillRect(bx+30, by+4, 6, 6);
      ctx.fillStyle = "#000"; ctx.fillRect(bx+32, by+6, 3, 3);
      break;
    }

    case "hasim": {
      // Human — head lunges, mouth opens wide with visible teeth
      const skin2 = c || "#f5c89a";
      const hair  = fc || "#2a1a08";
      ctx.fillStyle = skin2;
      ctx.fillRect(bx+13, by+1, 16, 12);
      // Hair
      ctx.fillStyle = hair;
      ctx.fillRect(bx+13, by+1, 16, 4);
      ctx.fillRect(bx+11, by+2,  4, 6);
      // Eyes wide open (alarmed expression during bite)
      ctx.fillStyle = ec;
      ctx.fillRect(bx+15, by+5, 4, 4);
      ctx.fillRect(bx+23, by+5, 4, 4);
      ctx.fillStyle = "#000";
      ctx.fillRect(bx+16, by+6, 2, 2);
      ctx.fillRect(bx+24, by+6, 2, 2);
      // Mouth open
      ctx.fillStyle = "#220000";
      ctx.fillRect(bx+15, by+10, 12, jo+2);
      // Upper teeth
      ctx.fillStyle = "#f5f0e8";
      for(let i=0;i<3;i++) ctx.fillRect(bx+16+i*4, by+10, 2, Math.max(1,Math.round(jo*0.45)));
      // Lower teeth
      for(let i=0;i<2;i++) ctx.fillRect(bx+18+i*4, by+11+jo, 2, Math.max(1,Math.round(jo*0.35)));
      // Tongue
      if(jo >= 3) {
        ctx.fillStyle = "#cc3344";
        ctx.fillRect(bx+18, by+11+Math.round(jo*0.3), 6, Math.round(jo*0.3));
      }
      break;
    }
  }

  ctx.restore();
  ctx.restore();
}
