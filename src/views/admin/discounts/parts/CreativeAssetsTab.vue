<script setup>
/** CreativeAssetsTab — faithful port from zucci-discounts-completions.jsx. */
import { toast } from '@/composables/useToast';
const ASSETS = [
  { id:'a1', name:'Eid Banner 1920×480', type:'Banner', format:'JPG', size:'3.2 MB', used:8 },
  { id:'a2', name:'Sale Overlay Badge', type:'Badge', format:'PNG', size:'0.4 MB', used:24 },
  { id:'a3', name:'Countdown Timer GIF', type:'Animation', format:'GIF', size:'2.1 MB', used:3 },
  { id:'a4', name:'Push Notification Icon', type:'Icon', format:'PNG', size:'0.1 MB', used:12 },
  { id:'a5', name:'Email Header Template', type:'Template', format:'HTML', size:'0.8 MB', used:0 },
];
</script>
<template>
  <div class="zcd-tab-body">
    <div style="display:flex;gap:6px;justify-content:flex-end;margin-bottom:12px">
      <button class="zen-btn-ghost" @click="toast.info('Upload from Files module')">Upload Asset</button>
      <button class="zen-btn-primary" @click="toast.success('New creative asset created')">+ New Asset</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
      <div v-for="a in ASSETS" :key="a.id" style="background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);overflow:hidden">
        <div style="height:80px;background:var(--zg-panel-hi);display:flex;align-items:center;justify-content:center"><span style="font-family:var(--zg-mono);font-size:20px;font-weight:800;color:var(--zg-text-dim)">{{ a.format }}</span></div>
        <div style="padding:10px 12px">
          <div style="font-size:12.5px;font-weight:600;color:var(--zg-text);margin-bottom:2px">{{ a.name }}</div>
          <div style="font-size:10.5px;color:var(--zg-text-dim)">{{ a.type }} · {{ a.size }} · Used in {{ a.used }} promos</div>
          <div style="display:flex;gap:4px;margin-top:8px">
            <button class="zcat-act" @click="toast.info('Preview asset')">Preview</button>
            <button class="zcat-act" @click="toast.success('Asset copied to clipboard')">Copy URL</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
