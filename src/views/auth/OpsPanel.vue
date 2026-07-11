<script setup>
/**
 * OpsPanel — the live-ops left side of the auth split screen.
 * Ported 1:1 from ZucciOpsPanel (zucci-auth.jsx). Copy + structure unchanged.
 */
import { ZC_OPS_STATS, ZC_OPS_FEED } from "@/data/opsData";

defineProps({ tagline: { type: Boolean, default: true } });

const stats = ZC_OPS_STATS;
const feed = ZC_OPS_FEED;
const emblem = `
<svg
  viewBox="0 0 596.53 377.57"
  fill="currentColor"
  width="100"
  aria-label="Zucci"
  data-om-id="jsx:/https:/3c5c305d-dc09-4ce7-87b1-8c9656647325.claudeusercontent.com/v1/design/projects/3c5c305d-dc09-4ce7-87b1-8c9656647325/serve/zucci-brand.jsx:153:5:3"
  data-om-text-attrs='{"aria-label":"txt:/https:/3c5c305d-dc09-4ce7-87b1-8c9656647325.claudeusercontent.com/v1/design/projects/3c5c305d-dc09-4ce7-87b1-8c9656647325/serve/zucci-brand.jsx:217:224"}'
  style="display: block;"
>
  <g data-om-id="jsx:/https:/3c5c305d-dc09-4ce7-87b1-8c9656647325.claudeusercontent.com/v1/design/projects/3c5c305d-dc09-4ce7-87b1-8c9656647325/serve/zucci-brand.jsx:256:6:5">
    <path
      d="M194.85,127.94v-18.04l30.51-43.15h-29.33v-23.26h70.12v18.2l-28.99,42.98h29.67v23.26h-71.98Z"
      data-om-id="jsx:/https:/3c5c305d-dc09-4ce7-87b1-8c9656647325.claudeusercontent.com/v1/design/projects/3c5c305d-dc09-4ce7-87b1-8c9656647325/serve/zucci-brand.jsx:266:7:7"
    ></path>
    <path
      d="M325.15,129.29c-14.27,0-25.43-3.62-33.46-10.87-8.04-7.25-12.05-17.28-12.05-30.09v-44.84h34.72v46.35c0,4.5.98,7.81,2.95,9.95,1.96,2.14,4.64,3.2,8.01,3.2s5.81-1.07,7.67-3.2c1.85-2.13,2.78-5.45,2.78-9.95v-46.35h34.05v44.84c0,12.92-3.91,22.98-11.72,30.17-7.81,7.19-18.79,10.79-32.95,10.79Z"
      data-om-id="jsx:/https:/3c5c305d-dc09-4ce7-87b1-8c9656647325.claudeusercontent.com/v1/design/projects/3c5c305d-dc09-4ce7-87b1-8c9656647325/serve/zucci-brand.jsx:376:8:7"
    ></path>
    <path
      d="M427.47,129.29c-9.44,0-17.59-1.85-24.44-5.56-6.86-3.71-12.14-8.79-15.84-15.25-3.71-6.46-5.56-13.91-5.56-22.33s1.91-15.79,5.73-22.42c3.82-6.63,9.19-11.85,16.1-15.68,6.91-3.82,14.92-5.73,24.02-5.73,10.9,0,19.49,2.25,25.79,6.74l-3.71,22.92c-2.81-1.24-5.45-2.11-7.92-2.61-2.47-.51-4.83-.76-7.08-.76-5.51,0-9.86,1.55-13.06,4.64-3.2,3.09-4.8,7.28-4.8,12.56s1.57,9.35,4.72,12.56c3.14,3.2,7.3,4.81,12.47,4.81,4.49,0,9.78-.95,15.84-2.87l3.2,23.6c-3.71,1.8-7.56,3.15-11.55,4.05-3.99.9-8.63,1.35-13.91,1.35Z"
      data-om-id="jsx:/https:/3c5c305d-dc09-4ce7-87b1-8c9656647325.claudeusercontent.com/v1/design/projects/3c5c305d-dc09-4ce7-87b1-8c9656647325/serve/zucci-brand.jsx:680:9:7"
    ></path>
    <path
      d="M506.52,129.29c-9.44,0-17.59-1.85-24.44-5.56-6.86-3.71-12.14-8.79-15.84-15.25-3.71-6.46-5.56-13.91-5.56-22.33s1.91-15.79,5.73-22.42c3.82-6.63,9.19-11.85,16.1-15.68,6.91-3.82,14.92-5.73,24.02-5.73,10.9,0,19.49,2.25,25.79,6.74l-3.71,22.92c-2.81-1.24-5.45-2.11-7.92-2.61-2.47-.51-4.83-.76-7.08-.76-5.51,0-9.86,1.55-13.06,4.64-3.2,3.09-4.8,7.28-4.8,12.56s1.57,9.35,4.72,12.56c3.14,3.2,7.3,4.81,12.47,4.81,4.49,0,9.78-.95,15.84-2.87l3.2,23.6c-3.71,1.8-7.56,3.15-11.55,4.05-3.99.9-8.63,1.35-13.91,1.35Z"
      data-om-id="jsx:/https:/3c5c305d-dc09-4ce7-87b1-8c9656647325.claudeusercontent.com/v1/design/projects/3c5c305d-dc09-4ce7-87b1-8c9656647325/serve/zucci-brand.jsx:1195:10:7"
    ></path>
    <path
      d="M562.31,34.22c-5.17,0-9.61-1.66-13.32-4.97-3.71-3.31-5.56-7.39-5.56-12.22,0-3.37.9-6.32,2.7-8.85,1.8-2.53,4.16-4.52,7.08-5.98,2.92-1.46,5.95-2.19,9.1-2.19,3.48,0,6.66.79,9.52,2.36,2.87,1.57,5.17,3.65,6.91,6.24,1.74,2.58,2.61,5.39,2.61,8.43,0,3.37-.93,6.35-2.78,8.94s-4.21,4.61-7.08,6.07c-2.86,1.46-5.93,2.19-9.19,2.19ZM576.13,129.29c-7.53,0-13.63-1.35-18.29-4.05-4.66-2.7-8.06-6.35-10.2-10.96-2.14-4.61-3.2-9.78-3.2-15.51v-55.29h35.57v50.4c0,2.59.76,4.58,2.28,5.98,1.52,1.41,3.34,2.11,5.48,2.11,2.25,0,4.55-.67,6.91-2.02l1.85,23.43c-2.47,1.91-5.67,3.37-9.61,4.38-3.94,1.01-7.53,1.52-10.79,1.52Z"
      data-om-id="jsx:/https:/3c5c305d-dc09-4ce7-87b1-8c9656647325.claudeusercontent.com/v1/design/projects/3c5c305d-dc09-4ce7-87b1-8c9656647325/serve/zucci-brand.jsx:1710:11:7"
    ></path>
  </g>
  <g data-om-id="jsx:/https:/3c5c305d-dc09-4ce7-87b1-8c9656647325.claudeusercontent.com/v1/design/projects/3c5c305d-dc09-4ce7-87b1-8c9656647325/serve/zucci-brand.jsx:2330:13:5">
    <path
      d="M359.02,206.65l-.11,30.45v31.68c0,6.71-4.52,12.92-11.13,14.12-8.68,1.57-16.23-5.06-16.23-13.45v-1.9h-24.43l-18.95,49.65,67.27-.58c26.07-.22,47.09-21.43,47.09-47.5v-62.47h-43.51Z"
      data-om-id="jsx:/https:/3c5c305d-dc09-4ce7-87b1-8c9656647325.claudeusercontent.com/v1/design/projects/3c5c305d-dc09-4ce7-87b1-8c9656647325/serve/zucci-brand.jsx:2340:14:7"
    ></path>
    <path
      d="M95.35,222.93c2.46.16,4.91.46,7.34.9,14.77,2.69,28.79,11.08,36.57,23.92,5.03,8.3,7.31,18.13,7.1,27.83-.3,13.96-6.61,10.46-4.26,24.22-2.36-2.79-3.68,11.79-6.04,8.99-7.14,9.43-17.67,15.94-28.92,19.63-11.24,3.69-23.2,4.71-35.03,4.6-14.58-.14-29.57-2.09-42.3-9.2-13.47-7.53-23.6-20.74-27.6-35.65-5.67-21.16.7-43.47,7.04-64.45,13.14,0,26.27,0,39.41-.01-2.75,8.5-6.61,16.62-9.15,25.19-2.54,8.57-3.72,17.87-1.01,26.39,1.6,5.03,5.35,9.97,9.02,13.79,2.25,2.34,11.36,8.43,19.26,9.52,10.85,1.5,22.18-1.31,27.19-4.06,5.89-3.24,9.06-10.23,9.44-16.94.4-7.07-2.49-14.48-8.25-18.6-4.02-2.88-9.07-3.97-14.04-3.88"
      data-om-id="jsx:/https:/3c5c305d-dc09-4ce7-87b1-8c9656647325.claudeusercontent.com/v1/design/projects/3c5c305d-dc09-4ce7-87b1-8c9656647325/serve/zucci-brand.jsx:2536:15:7"
    ></path>
    <path
      d="M287.15,206.61v63.36c0,3.42-2.77,6.19-6.19,6.19s-6.19-2.77-6.19-6.19v-63.32h-44.45v58.62c0,.52-.03.92-.04,1.37v3.41c0,3.42-2.77,6.19-6.19,6.19s-6.19-2.77-6.19-6.19v-63.4h-44.44v69.35l-51.28.22.11,40.1,105.51.44c12.78,0,21.07-3.62,24.87-10.85,9.86,7.52,21.69,11.28,35.5,11.28,12.85,0,23.34-4.23,31.44-12.71,8.11-8.47,12.23-18.19,11.94-29.14l.22-68.7-44.63-.04Z"
      data-om-id="jsx:/https:/3c5c305d-dc09-4ce7-87b1-8c9656647325.claudeusercontent.com/v1/design/projects/3c5c305d-dc09-4ce7-87b1-8c9656647325/serve/zucci-brand.jsx:3150:16:7"
    ></path>
    <path
      d="M575.52,194.65c-5.59,0-10.38-1.79-14.39-5.37-4.01-3.58-6.01-7.98-6.01-13.21,0-3.64.97-6.83,2.91-9.56,1.94-2.73,4.49-4.89,7.65-6.47,3.16-1.58,6.43-2.37,9.83-2.37,3.76,0,7.19.85,10.29,2.55,3.1,1.7,5.58,3.95,7.47,6.74,1.88,2.79,2.83,5.83,2.83,9.11,0,3.64-1,6.86-3.01,9.65-2,2.79-4.56,4.98-7.65,6.56-3.1,1.58-6.41,2.36-9.93,2.36Z"
      data-om-id="jsx:/https:/3c5c305d-dc09-4ce7-87b1-8c9656647325.claudeusercontent.com/v1/design/projects/3c5c305d-dc09-4ce7-87b1-8c9656647325/serve/zucci-brand.jsx:3528:17:7"
    ></path>
    <path
      d="M402.04,195.3c-5.59,0-10.38-1.79-14.39-5.37-4.01-3.58-6.01-7.98-6.01-13.21,0-3.64.97-6.83,2.91-9.56,1.94-2.73,4.49-4.89,7.65-6.47,3.16-1.58,6.43-2.37,9.83-2.37,3.76,0,7.19.85,10.29,2.55,3.1,1.7,5.58,3.95,7.47,6.74,1.88,2.79,2.83,5.83,2.83,9.11,0,3.64-1,6.86-3.01,9.65-2,2.79-4.56,4.98-7.65,6.56-3.1,1.58-6.41,2.36-9.93,2.36Z"
      data-om-id="jsx:/https:/3c5c305d-dc09-4ce7-87b1-8c9656647325.claudeusercontent.com/v1/design/projects/3c5c305d-dc09-4ce7-87b1-8c9656647325/serve/zucci-brand.jsx:3872:18:7"
    ></path>
    <path
      d="M359.33,195.3c-5.59,0-10.38-1.79-14.39-5.37-4.01-3.58-6.01-7.98-6.01-13.21,0-3.64.97-6.83,2.91-9.56,1.94-2.73,4.49-4.89,7.65-6.47,3.16-1.58,6.43-2.37,9.83-2.37,3.76,0,7.19.85,10.29,2.55,3.1,1.7,5.58,3.95,7.47,6.74,1.88,2.79,2.83,5.83,2.83,9.11,0,3.64-1,6.86-3.01,9.65-2,2.79-4.56,4.98-7.65,6.56-3.1,1.58-6.41,2.36-9.93,2.36Z"
      data-om-id="jsx:/https:/3c5c305d-dc09-4ce7-87b1-8c9656647325.claudeusercontent.com/v1/design/projects/3c5c305d-dc09-4ce7-87b1-8c9656647325/serve/zucci-brand.jsx:4215:19:7"
    ></path>
    <path
      d="M549.75,362.82c-5.44,0-10.49-.5-15.13-1.49-4.64-.99-8.69-2.22-12.14-3.68l5.97-28.47c2.26.8,4.52,1.39,6.77,1.79,2.26.4,4.31.6,6.17.6,4.64,0,7.99-1.19,10.05-3.58,2.06-2.39,3.09-6.24,3.09-11.54v-110.23h42v106.65c0,16.06-3.85,28.4-11.54,37.03-7.7,8.63-19.44,12.94-35.23,12.94Z"
      data-om-id="jsx:/https:/3c5c305d-dc09-4ce7-87b1-8c9656647325.claudeusercontent.com/v1/design/projects/3c5c305d-dc09-4ce7-87b1-8c9656647325/serve/zucci-brand.jsx:4558:20:7"
    ></path>
    <path
      d="M468.88,205.11c-10.89,0-20.46,2.4-28.73,7.18-8.27,4.79-14.69,11.34-19.25,19.65-3.78,6.87-5.9,14.5-6.56,22.81-.14,1.75-.3,3.48-.3,5.3,0,10.56,2.22,19.9,6.66,28,4.43,8.1,10.75,14.47,18.95,19.12l.17.1c10.08,5.65,22.19,6.5,33.31,3.34.52-.15,1.08-.35,1.61-.51v6.36c0,5.31-1.03,9.16-3.09,11.54-2.06,2.39-5.41,3.58-10.05,3.58-1.86,0-3.91-.2-6.17-.6-2.25-.4-4.51-.99-6.77-1.79l-5.97,28.47c3.45,1.46,7.5,2.69,12.14,3.68,4.65,1,9.69,1.49,15.13,1.49,15.79,0,27.54-4.31,35.23-12.94,7.7-8.63,11.55-20.97,11.55-37.03v-107.75h-47.85ZM479.7,274.79h-13.42c-7.41,0-13.42-6.01-13.42-13.42s6.01-13.42,13.42-13.42h13.42v26.84Z"
      data-om-id="jsx:/https:/3c5c305d-dc09-4ce7-87b1-8c9656647325.claudeusercontent.com/v1/design/projects/3c5c305d-dc09-4ce7-87b1-8c9656647325/serve/zucci-brand.jsx:4849:21:7"
    ></path>
    <path
      d="M252.48,195.3c-5.59,0-10.38-1.79-14.39-5.37-4.01-3.58-6.01-7.98-6.01-13.21,0-3.64.97-6.83,2.91-9.56,1.94-2.73,4.49-4.89,7.65-6.47,3.16-1.58,6.43-2.37,9.83-2.37,3.76,0,7.19.85,10.29,2.55,3.1,1.7,5.58,3.95,7.47,6.74,1.88,2.79,2.83,5.83,2.83,9.11,0,3.64-1,6.86-3.01,9.65-2,2.79-4.56,4.98-7.65,6.56-3.1,1.58-6.41,2.36-9.93,2.36Z"
      data-om-id="jsx:/https:/3c5c305d-dc09-4ce7-87b1-8c9656647325.claudeusercontent.com/v1/design/projects/3c5c305d-dc09-4ce7-87b1-8c9656647325/serve/zucci-brand.jsx:5473:22:7"
    ></path>
    <path
      d="M209.78,195.3c-5.59,0-10.38-1.79-14.39-5.37-4.01-3.58-6.01-7.98-6.01-13.21,0-3.64.97-6.83,2.91-9.56,1.94-2.73,4.49-4.89,7.65-6.47,3.16-1.58,6.43-2.37,9.83-2.37,3.76,0,7.19.85,10.29,2.55,3.1,1.7,5.58,3.95,7.47,6.74,1.88,2.79,2.83,5.83,2.83,9.11,0,3.64-1,6.86-3.01,9.65-2,2.79-4.56,4.98-7.65,6.56-3.1,1.58-6.41,2.36-9.93,2.36Z"
      data-om-id="jsx:/https:/3c5c305d-dc09-4ce7-87b1-8c9656647325.claudeusercontent.com/v1/design/projects/3c5c305d-dc09-4ce7-87b1-8c9656647325/serve/zucci-brand.jsx:5816:23:7"
    ></path>
    <path
      d="M295.19,195.3c-5.59,0-10.38-1.79-14.39-5.37-4.01-3.58-6.01-7.98-6.01-13.21,0-3.64.97-6.83,2.91-9.56,1.94-2.73,4.49-4.89,7.65-6.47,3.16-1.58,6.43-2.37,9.83-2.37,3.76,0,7.19.85,10.29,2.55,3.1,1.7,5.58,3.95,7.47,6.74,1.88,2.79,2.83,5.83,2.83,9.11,0,3.64-1,6.86-3.01,9.65-2,2.79-4.56,4.98-7.65,6.56-3.1,1.58-6.41,2.36-9.93,2.36Z"
      data-om-id="jsx:/https:/3c5c305d-dc09-4ce7-87b1-8c9656647325.claudeusercontent.com/v1/design/projects/3c5c305d-dc09-4ce7-87b1-8c9656647325/serve/zucci-brand.jsx:6159:24:7"
    ></path>
    <path
      d="M93.58,377.57c-5.59,0-10.38-1.79-14.39-5.37-4.01-3.58-6.01-7.98-6.01-13.21,0-3.64.97-6.83,2.91-9.56,1.94-2.73,4.49-4.89,7.65-6.47,3.16-1.58,6.43-2.37,9.83-2.37,3.76,0,7.19.85,10.29,2.55,3.1,1.7,5.58,3.95,7.47,6.74,1.88,2.79,2.83,5.83,2.83,9.11,0,3.64-1,6.86-3.01,9.65s-4.56,4.98-7.65,6.56c-3.1,1.58-6.41,2.36-9.93,2.36Z"
      data-om-id="jsx:/https:/3c5c305d-dc09-4ce7-87b1-8c9656647325.claudeusercontent.com/v1/design/projects/3c5c305d-dc09-4ce7-87b1-8c9656647325/serve/zucci-brand.jsx:6502:25:7"
    ></path>
    <path
      d="M50.88,377.57c-5.59,0-10.38-1.79-14.39-5.37-4.01-3.58-6.01-7.98-6.01-13.21,0-3.64.97-6.83,2.91-9.56,1.94-2.73,4.49-4.89,7.65-6.47,3.16-1.58,6.43-2.37,9.83-2.37,3.76,0,7.19.85,10.29,2.55,3.1,1.7,5.58,3.95,7.47,6.74,1.88,2.79,2.83,5.83,2.83,9.11,0,3.64-1,6.86-3.01,9.65-2,2.79-4.56,4.98-7.65,6.56-3.1,1.58-6.41,2.36-9.93,2.36Z"
      data-om-id="jsx:/https:/3c5c305d-dc09-4ce7-87b1-8c9656647325.claudeusercontent.com/v1/design/projects/3c5c305d-dc09-4ce7-87b1-8c9656647325/serve/zucci-brand.jsx:6840:26:7"
    ></path>
  </g>
</svg>;
`;
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
        <span class="zauth-region">
          <span class="zauth-region-dot" />
          DXB · GST
        </span>
      </header>

      <div class="zauth-ops-mid">
        <div v-if="tagline" class="zauth-tagline">
          Marketplace Admin · Operator console
        </div>
        <h2 class="zauth-headline">
          3,241 orders are being fulfilled across the marketplace
          <em>● live</em> right now.
        </h2>
      </div>
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
.zauth-ops-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.55;
}
.zauth-ops-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 48px 48px;
  -webkit-mask-image: radial-gradient(
    ellipse 80% 70% at 30% 40%,
    #000 30%,
    transparent 75%
  );
  mask-image: radial-gradient(
    ellipse 80% 70% at 30% 40%,
    #000 30%,
    transparent 75%
  );
}
.zauth-ops-glow {
  position: absolute;
  width: 480px;
  height: 480px;
  left: -120px;
  top: -120px;
  background: radial-gradient(
    circle,
    oklch(0.88 0.19 130 / 0.12),
    transparent 70%
  );
  filter: blur(40px);
}
.zauth-ops-inner {
  position: relative;
  z-index: 2;
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: 28px 32px;
  gap: 24px;
  min-height: 0;
}
.zauth-brandline {
  display: flex;
  align-items: center;
  gap: 14px;
}
.zauth-emblem {
  color: var(--zg-accent);
  display: inline-flex;
}
.zauth-wordmark-txt {
  font-family: var(--zg-mono);
  font-weight: 600;
  letter-spacing: 0.22em;
  font-size: 13px;
  color: var(--zg-text);
}
.zauth-region {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--zg-mono);
  font-size: 10.5px;
  color: var(--zg-text-dim);
  letter-spacing: 0.04em;
  padding: 4px 8px;
  background: var(--zg-panel);
  border: 1px solid var(--zg-line);
  border-radius: 4px;
}
.zauth-region-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--zg-good);
  box-shadow: 0 0 6px var(--zg-good);
}

.zauth-ops-mid {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 28px;
  min-height: 0;
}
.zauth-tagline {
  font-size: 11px;
  color: var(--zg-text-dim);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
}
.zauth-tagline::before {
  content: "";
  width: 18px;
  height: 1px;
  background: var(--zg-accent);
}
.zauth-headline {
  font-size: 38px;
  line-height: 1.05;
  letter-spacing: -0.02em;
  font-weight: 500;
  color: var(--zg-text);
  max-width: 460px;
}
.zauth-headline em {
  color: var(--zg-accent);
  font-style: normal;
  font-family: var(--zg-mono);
  font-size: 0.78em;
  letter-spacing: 0.02em;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.zauth-ops-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--zg-line);
  border: 1px solid var(--zg-line);
  border-radius: var(--zg-radius-md);
  overflow: hidden;
  max-width: 540px;
}
.zauth-ops-stat {
  background: var(--zg-bg-elev);
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.zauth-ops-stat-lbl {
  font-size: 9.5px;
  color: var(--zg-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.zauth-ops-stat-val {
  font-family: var(--zg-mono);
  font-size: 18px;
  color: var(--zg-text);
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  letter-spacing: -0.01em;
}
.zauth-ops-stat-sub {
  font-family: var(--zg-mono);
  font-size: 10px;
  color: var(--zg-text-dim);
  display: flex;
  align-items: center;
  gap: 4px;
}
.zauth-ops-stat-sub.is-pos {
  color: var(--zg-good);
}
.zauth-ops-stat-sub.is-neg {
  color: var(--zg-danger);
}

.zauth-feed {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 540px;
}
.zauth-feed-hd {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--zg-mono);
  font-size: 10px;
  color: var(--zg-text-dim);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.zauth-feed-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--zg-good);
  box-shadow: 0 0 8px var(--zg-good);
  animation: zauth-pulse 1.8s infinite;
}
@keyframes zauth-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
.zauth-feed-list {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--zg-line);
  border-radius: var(--zg-radius-md);
  overflow: hidden;
  background: var(--zg-panel);
}
.zauth-feed-row {
  display: grid;
  grid-template-columns: 70px 1fr auto;
  gap: 12px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--zg-line-soft);
  align-items: center;
}
.zauth-feed-row:last-child {
  border-bottom: 0;
}
.zauth-feed-time {
  font-family: var(--zg-mono);
  font-size: 10.5px;
  color: var(--zg-text-dim);
  font-variant-numeric: tabular-nums;
}
.zauth-feed-msg {
  font-size: 12px;
  color: var(--zg-text-mid);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.zauth-feed-msg :deep(b) {
  color: var(--zg-text);
  font-weight: 500;
}
.zauth-feed-msg :deep(code) {
  font-family: var(--zg-mono);
  font-size: 10.5px;
  color: var(--zg-accent);
  background: oklch(0.88 0.19 130 / 0.1);
  padding: 1px 5px;
  border-radius: 3px;
}
.zauth-feed-tag {
  font-family: var(--zg-mono);
  font-size: 9.5px;
  letter-spacing: 0.06em;
  color: var(--zg-text-dim);
  padding: 1px 6px;
  border: 1px solid var(--zg-line);
  border-radius: 999px;
}
.zauth-feed-tag.is-good {
  color: var(--zg-good);
  border-color: oklch(0.78 0.15 150 / 0.4);
  background: oklch(0.78 0.15 150 / 0.08);
}
.zauth-feed-tag.is-warn {
  color: var(--zg-warn);
  border-color: oklch(0.82 0.15 75 / 0.4);
  background: oklch(0.82 0.15 75 / 0.08);
}

.zauth-ops-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--zg-mono);
  font-size: 10.5px;
  color: var(--zg-text-xdim);
  letter-spacing: 0.04em;
}
.zauth-ops-foot a {
  color: var(--zg-text-dim);
  text-decoration: none;
}
.zauth-ops-foot a:hover {
  color: var(--zg-text);
}
.zauth-ops-foot-sep {
  color: var(--zg-text-xdim);
  margin: 0 6px;
}

@media (max-width: 880px) {
  .zauth-ops {
    display: none;
  }
}
</style>
