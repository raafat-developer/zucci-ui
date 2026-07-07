<script setup>
/**
 * OpsPanel — the live-ops left side of the auth split screen.
 * Ported 1:1 from ZucciOpsPanel (zucci-auth.jsx). Copy + structure unchanged.
 */
import { ZC_OPS_STATS, ZC_OPS_FEED } from '@/data/opsData';

defineProps({ tagline: { type: Boolean, default: true } });

const stats = ZC_OPS_STATS;
const feed = ZC_OPS_FEED;
const emblem =
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 7h16M4 12h16M4 17h10"/></svg>';
</script>

<template>
  <aside class="zauth-ops">
    <div class="zauth-ops-bg">
      <div class="zauth-ops-grid" />
      <div class="zauth-ops-glow" />
    </div>
    <div class="zauth-ops-inner">
      <header class="zauth-brandline">
        <span class="zauth-emblem" v-html="emblem" />
        <span class="zauth-wordmark-txt">ZUCCI</span>
        <span class="zauth-region">
          <span class="zauth-region-dot" />
          DXB · GST
        </span>
      </header>

      <div class="zauth-ops-mid">
        <div v-if="tagline" class="zauth-tagline">Marketplace Admin · Operator console</div>
        <h2 class="zauth-headline">
          3,241 orders are being fulfilled across the marketplace
          <em>● live</em> right now.
        </h2>

        <div class="zauth-ops-stats">
          <div v-for="s in stats" :key="s.lbl" class="zauth-ops-stat">
            <div class="zauth-ops-stat-lbl">{{ s.lbl }}</div>
            <div class="zauth-ops-stat-val">{{ s.val }}</div>
            <div :class="['zauth-ops-stat-sub', s.subClass]">{{ s.sub }}</div>
          </div>
        </div>

        <div class="zauth-feed">
          <div class="zauth-feed-hd">
            <span class="zauth-feed-dot" />
            Live activity
          </div>
          <div class="zauth-feed-list">
            <div v-for="(row, i) in feed" :key="i" class="zauth-feed-row">
              <span class="zauth-feed-time">{{ row.time }}</span>
              <span class="zauth-feed-msg" v-html="row.html" />
              <span v-if="row.tag" :class="['zauth-feed-tag', 'is-' + row.tag]">{{ row.tag }}</span>
            </div>
          </div>
        </div>
      </div>

      <footer class="zauth-ops-foot">
        <span>© 2025 Zucci Technologies FZE</span>
        <span>
          <a href="#">Privacy</a><span class="zauth-ops-foot-sep">·</span>
          <a href="#">Terms</a><span class="zauth-ops-foot-sep">·</span>
          <a href="#">Support</a>
        </span>
      </footer>
    </div>
  </aside>
</template>

<style scoped>
/* Auth ops-panel styles — ported verbatim from styles-auth.css, scoped here. */
.zauth-ops {
  position: relative;
  background: var(--zg-bg-elev);
  border-right: 1px solid var(--zg-line);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}
.zauth-ops-bg { position: absolute; inset: 0; pointer-events: none; opacity: 0.55; }
.zauth-ops-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 48px 48px;
  -webkit-mask-image: radial-gradient(ellipse 80% 70% at 30% 40%, #000 30%, transparent 75%);
  mask-image: radial-gradient(ellipse 80% 70% at 30% 40%, #000 30%, transparent 75%);
}
.zauth-ops-glow {
  position: absolute; width: 480px; height: 480px; left: -120px; top: -120px;
  background: radial-gradient(circle, oklch(0.88 0.19 130 / 0.12), transparent 70%);
  filter: blur(40px);
}
.zauth-ops-inner {
  position: relative; z-index: 2; height: 100%;
  display: grid; grid-template-rows: auto 1fr auto;
  padding: 28px 32px; gap: 24px; min-height: 0;
}
.zauth-brandline { display: flex; align-items: center; gap: 14px; }
.zauth-emblem { color: var(--zg-accent); display: inline-flex; }
.zauth-wordmark-txt {
  font-family: var(--zg-mono); font-weight: 600; letter-spacing: 0.22em;
  font-size: 13px; color: var(--zg-text);
}
.zauth-region {
  margin-left: auto; display: flex; align-items: center; gap: 6px;
  font-family: var(--zg-mono); font-size: 10.5px; color: var(--zg-text-dim);
  letter-spacing: 0.04em; padding: 4px 8px;
  background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: 4px;
}
.zauth-region-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--zg-good); box-shadow: 0 0 6px var(--zg-good); }

.zauth-ops-mid { display: flex; flex-direction: column; justify-content: center; gap: 28px; min-height: 0; }
.zauth-tagline {
  font-size: 11px; color: var(--zg-text-dim); letter-spacing: 0.16em;
  text-transform: uppercase; display: flex; align-items: center; gap: 8px;
}
.zauth-tagline::before { content: ''; width: 18px; height: 1px; background: var(--zg-accent); }
.zauth-headline {
  font-size: 38px; line-height: 1.05; letter-spacing: -0.02em;
  font-weight: 500; color: var(--zg-text); max-width: 460px;
}
.zauth-headline em {
  color: var(--zg-accent); font-style: normal; font-family: var(--zg-mono);
  font-size: 0.78em; letter-spacing: 0.02em; display: inline-flex; align-items: center; gap: 6px;
}
.zauth-ops-stats {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px;
  background: var(--zg-line); border: 1px solid var(--zg-line);
  border-radius: var(--zg-radius-md); overflow: hidden; max-width: 540px;
}
.zauth-ops-stat { background: var(--zg-bg-elev); padding: 12px 14px; display: flex; flex-direction: column; gap: 4px; }
.zauth-ops-stat-lbl { font-size: 9.5px; color: var(--zg-text-dim); text-transform: uppercase; letter-spacing: 0.08em; }
.zauth-ops-stat-val { font-family: var(--zg-mono); font-size: 18px; color: var(--zg-text); font-variant-numeric: tabular-nums; font-weight: 500; letter-spacing: -0.01em; }
.zauth-ops-stat-sub { font-family: var(--zg-mono); font-size: 10px; color: var(--zg-text-dim); display: flex; align-items: center; gap: 4px; }
.zauth-ops-stat-sub.is-pos { color: var(--zg-good); }
.zauth-ops-stat-sub.is-neg { color: var(--zg-danger); }

.zauth-feed { display: flex; flex-direction: column; gap: 8px; max-width: 540px; }
.zauth-feed-hd { display: flex; align-items: center; gap: 8px; font-family: var(--zg-mono); font-size: 10px; color: var(--zg-text-dim); letter-spacing: 0.08em; text-transform: uppercase; }
.zauth-feed-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--zg-good); box-shadow: 0 0 8px var(--zg-good); animation: zauth-pulse 1.8s infinite; }
@keyframes zauth-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.zauth-feed-list { display: flex; flex-direction: column; border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); overflow: hidden; background: var(--zg-panel); }
.zauth-feed-row { display: grid; grid-template-columns: 70px 1fr auto; gap: 12px; padding: 8px 12px; border-bottom: 1px solid var(--zg-line-soft); align-items: center; }
.zauth-feed-row:last-child { border-bottom: 0; }
.zauth-feed-time { font-family: var(--zg-mono); font-size: 10.5px; color: var(--zg-text-dim); font-variant-numeric: tabular-nums; }
.zauth-feed-msg { font-size: 12px; color: var(--zg-text-mid); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.zauth-feed-msg :deep(b) { color: var(--zg-text); font-weight: 500; }
.zauth-feed-msg :deep(code) { font-family: var(--zg-mono); font-size: 10.5px; color: var(--zg-accent); background: oklch(0.88 0.19 130 / 0.1); padding: 1px 5px; border-radius: 3px; }
.zauth-feed-tag { font-family: var(--zg-mono); font-size: 9.5px; letter-spacing: 0.06em; color: var(--zg-text-dim); padding: 1px 6px; border: 1px solid var(--zg-line); border-radius: 999px; }
.zauth-feed-tag.is-good { color: var(--zg-good); border-color: oklch(0.78 0.15 150 / 0.4); background: oklch(0.78 0.15 150 / 0.08); }
.zauth-feed-tag.is-warn { color: var(--zg-warn); border-color: oklch(0.82 0.15 75 / 0.4); background: oklch(0.82 0.15 75 / 0.08); }

.zauth-ops-foot { display: flex; align-items: center; justify-content: space-between; font-family: var(--zg-mono); font-size: 10.5px; color: var(--zg-text-xdim); letter-spacing: 0.04em; }
.zauth-ops-foot a { color: var(--zg-text-dim); text-decoration: none; }
.zauth-ops-foot a:hover { color: var(--zg-text); }
.zauth-ops-foot-sep { color: var(--zg-text-xdim); margin: 0 6px; }

@media (max-width: 880px) {
  .zauth-ops { display: none; }
}
</style>
