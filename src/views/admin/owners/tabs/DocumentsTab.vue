<script setup>
import { ref } from 'vue';
// import { ZC_COUNTRY_DOCS } from '@/data/ownersData';
const props = defineProps({ entity: { type: Object, required: true } });

// const docs = ZC_COUNTRY_DOCS[props.entity.country] || ZC_COUNTRY_DOCS['DEFAULT'];
const required = props.entity.entityType === 'individual' ? docs.individual : docs.business;

const DOC_STATUS = {
  active:     { label:'Valid',         cls:'zen-bst--active',    color:'var(--zg-good)' },
  warning:    { label:'Expiring Soon', cls:'zen-bst--pending',   color:'var(--zg-warn)' },
  expired:    { label:'Expired',       cls:'zen-bst--suspended', color:'var(--zg-danger)' },
  pending:    { label:'Pending',       cls:'zen-bst--pending',   color:'var(--zg-warn)' },
  not_submitted:{ label:'Missing',     cls:'zen-bst--inactive',  color:'var(--zg-text-dim)' },
};
const ds = s => DOC_STATUS[s] || DOC_STATUS.not_submitted;

const uploadOpen = ref(false);
const uploadDoc  = ref('');
</script>

<template>
  <div class="zen-tab-body">
    <div class="zen-tab-toolbar">
      <div class="zen-tab-toolbar-title">Required Documents · {{ entity.country }}</div>
      <button class="zen-btn-primary" @click="uploadOpen = true">+ Upload Document</button>
    </div>

    <!-- Required docs list -->
    <div class="zen-card" style="margin-bottom:14px;">
      <div class="zen-card-head"><span class="zen-card-title">KYB / KYC Checklist</span></div>
      <div v-for="(doc, i) in required" :key="i" style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--zg-line);">
        <div style="flex:1;">
          <div style="font-size:12.5px;font-weight:500;color:var(--zg-text);">{{ doc }}</div>
        </div>
        <span class="zen-bst" :class="i < 2 ? 'zen-bst--active' : i === 2 ? 'zen-bst--suspended' : 'zen-bst--inactive'">
          {{ i < 2 ? 'Valid' : i === 2 ? 'Expired' : 'Missing' }}
        </span>
        <button class="zen-doc-card-btn" @click="uploadDoc = doc; uploadOpen = true">{{ i < 2 ? 'Replace' : 'Upload' }}</button>
      </div>
    </div>

    <!-- Uploaded files -->
    <div class="zen-card">
      <div class="zen-card-head"><span class="zen-card-title">Uploaded Files</span></div>
      <div v-if="entity.documents?.length" v-for="d in entity.documents" :key="d.id" class="zen-doc-card">
        <div class="zen-doc-icon">
          <svg viewBox="0 0 16 20" width="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M9 1H3a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V7z"/><path d="M9 1v6h6"/></svg>
        </div>
        <div class="zen-doc-info">
          <div class="zen-doc-name">{{ d.name }}</div>
          <div class="zen-doc-meta">{{ d.size }} · Uploaded {{ d.uploadDate }}</div>
        </div>
        <span :class="`zen-bst ${ds(d.status).cls}`">{{ ds(d.status).label }}</span>
        <div style="display:flex;gap:4px;">
          <button class="zen-doc-card-btn">View</button>
          <button class="zen-doc-card-btn">Download</button>
        </div>
      </div>
      <div v-else style="padding:16px 0;font-size:12px;color:var(--zg-text-dim);text-align:center;">No files uploaded yet</div>
    </div>

    <!-- Upload Modal -->
    <Teleport to="body">
      <div v-if="uploadOpen" style="position:fixed;inset:0;z-index:9300;background:oklch(0.1 0.01 250 / 0.7);display:flex;align-items:center;justify-content:center;" @click="uploadOpen = false">
        <div style="width:440px;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-lg,12px);overflow:hidden;" @click.stop>
          <div style="padding:14px 20px;border-bottom:1px solid var(--zg-line);font-size:14px;font-weight:700;color:var(--zg-text);display:flex;justify-content:space-between;">
            Upload Document <button style="width:28px;height:28px;border:none;background:var(--zg-panel);border-radius:4px;cursor:pointer;color:var(--zg-text-dim);font-size:16px;" @click="uploadOpen = false">×</button>
          </div>
          <div style="padding:16px 20px;display:flex;flex-direction:column;gap:12px;">
            <div><label class="zen-field-label">Document Type</label><input class="zen-field-input" :value="uploadDoc" /></div>
            <div style="border:2px dashed var(--zg-line);border-radius:var(--zg-radius-md);padding:24px;text-align:center;cursor:pointer;">
              <svg viewBox="0 0 24 24" width="28" fill="none" stroke="var(--zg-text-dim)" stroke-width="1.4" stroke-linecap="round" style="margin:0 auto 8px;display:block;"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
              <div style="font-size:12px;color:var(--zg-text-dim);">Click to browse or drag & drop</div>
              <div style="font-size:11px;color:var(--zg-text-dim);margin-top:4px;">PDF, JPG, PNG — Max 10MB</div>
            </div>
            <div><label class="zen-field-label">Expiry Date (if applicable)</label><input class="zen-field-input" type="date" /></div>
            <div><label class="zen-field-label">Notes</label><textarea class="zen-field-textarea" rows="2" /></div>
          </div>
          <div style="padding:12px 20px;border-top:1px solid var(--zg-line);display:flex;gap:8px;">
            <button class="zen-btn-primary" @click="uploadOpen = false">Upload</button>
            <button class="zen-doc-card-btn" @click="uploadOpen = false">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
