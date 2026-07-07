<script setup>
/**
 * ItemsStatus — Individual Items Status with per-item QC workflow, stage dots,
 * dispatch-readiness banner, notes and flags. Faithful port of the React
 * IndividualItemsStatus.
 */
import { ref, reactive, computed } from 'vue';

const props = defineProps({ order: { type: Object, required: true } });

const STAGE_META = {
  awaiting_brand:       { label:'Awaiting Brand',       badgeCls:'awaiting',   pos:0, next:'received',   nextLabel:'Mark Received' },
  received:             { label:'Received at WH',       badgeCls:'received',   pos:1, next:'qc_check',   nextLabel:'Start QC Check' },
  qc_check:             { label:'QC Check',             badgeCls:'qc_check',   pos:2, next:null,          nextLabel:null },
  qc_passed:            { label:'QC Passed',            badgeCls:'qc_passed',  pos:3, next:'packed',      nextLabel:'Mark Packed' },
  qc_failed:            { label:'QC Failed',            badgeCls:'qc_failed',  pos:3, next:null,          nextLabel:null },
  awaiting_replacement: { label:'Awaiting Replacement', badgeCls:'replacing',  pos:0, next:'received',   nextLabel:'Mark Received' },
  refund_initiated:     { label:'Refund Initiated',     badgeCls:'refund',     pos:3, next:null,          nextLabel:null },
  packed:               { label:'Packed',               badgeCls:'packed',     pos:4, next:'dispatched', nextLabel:'Mark Dispatched' },
  dispatched:           { label:'Dispatched',           badgeCls:'dispatched', pos:5, next:null,          nextLabel:null },
};
const QC_FAIL_REASONS = ['Damaged', 'Wrong Item', 'Authenticity Issue', 'Other'];
const TOTAL_DOTS = 6;

const states = reactive({});
props.order.brandGroups.forEach((g, gi) => g.items.forEach((item, ii) => {
  states[`${g.name}-${gi}-${ii}`] = {
    stage: item.stage, updatedBy: item.updatedBy, updatedAt: item.updatedAt,
    qcFailReason: item.qcFailReason || null, notes: item.notes ? [...item.notes] : [], flagged: item.flagged || false,
  };
}));

const qcFailKey = ref(null);
const qcReason = ref(null);
const noteKey = ref(null);
const noteText = ref('');
const dispatched = ref(false);

const meta = (stage) => STAGE_META[stage] || STAGE_META.awaiting_brand;
const dotClass = (stage, i) => {
  const m = meta(stage); const isFail = stage === 'qc_failed';
  if (i < m.pos) return 'is-done';
  if (i === m.pos && isFail) return 'is-fail-cur';
  if (i === m.pos) return 'is-current';
  return '';
};
const dots = Array.from({ length: TOTAL_DOTS });

const advance = (key, to) => { states[key].stage = to; states[key].updatedBy = 'You'; states[key].updatedAt = 'just now'; };
const confirmFail = (key) => { states[key].stage = 'qc_failed'; states[key].qcFailReason = qcReason.value; states[key].updatedBy = 'You'; states[key].updatedAt = 'just now'; qcFailKey.value = null; qcReason.value = null; };
const postNote = (key) => { if (!noteText.value.trim()) return; states[key].notes.push({ text: noteText.value, by: 'You', at: 'just now' }); noteKey.value = null; noteText.value = ''; };
const toggleFlag = (key) => { states[key].flagged = !states[key].flagged; };

const allStages = computed(() => Object.values(states).map((s) => s.stage));
const packedCount = computed(() => allStages.value.filter((s) => s === 'packed').length);
const doneCount = computed(() => allStages.value.filter((s) => s === 'dispatched').length);
const holdCount = computed(() => allStages.value.filter((s) => ['qc_failed','awaiting_replacement','refund_initiated'].includes(s)).length);
const pendingCount = computed(() => allStages.value.filter((s) => !['packed','dispatched','qc_failed','awaiting_replacement','refund_initiated'].includes(s)).length);
const total = computed(() => allStages.value.length);
const isPartial = computed(() => holdCount.value > 0 || pendingCount.value > 0);
const canDispatch = computed(() => packedCount.value > 0 && !dispatched.value);

const brandStatus = computed(() => {
  const s = allStages.value;
  if (s.some((x) => x === 'qc_failed')) return { cls: 'issue', label: 'Issue' };
  if (s.every((x) => x === 'dispatched')) return { cls: 'done', label: 'Done' };
  if (s.every((x) => ['packed','dispatched','qc_passed'].includes(x))) return { cls: 'track', label: 'On Track' };
  return { cls: '', label: 'In Progress' };
});

const dispatchAll = () => {
  Object.keys(states).forEach((k) => { if (states[k].stage === 'packed') { states[k].stage = 'dispatched'; states[k].updatedBy = 'You'; states[k].updatedAt = 'just now'; } });
  dispatched.value = true;
};
const keyFor = (name, gi, ii) => `${name}-${gi}-${ii}`;
const reasons = QC_FAIL_REASONS;
</script>

<template>
  <div class="zco-section">
    <div class="zco-section-head">
      <div class="zco-section-title">Individual Items Status</div>
      <span class="zco-brand-status" :class="`zco-brand-status--${brandStatus.cls}`">{{ brandStatus.label }}</span>
    </div>

    <!-- Dispatch banner -->
    <div class="zco-dispatch-banner">
      <div class="zco-dispatch-counts">
        <span v-if="packedCount" class="zco-dc zco-dc--packed">{{ packedCount }} packed</span>
        <span v-if="doneCount" class="zco-dc zco-dc--done">{{ doneCount }} dispatched</span>
        <span v-if="holdCount" class="zco-dc zco-dc--hold">{{ holdCount }} on hold</span>
        <span v-if="pendingCount" class="zco-dc zco-dc--pending">{{ pendingCount }} in progress</span>
        <span class="zco-dc zco-dc--total">of {{ total }} items</span>
      </div>
      <button v-if="canDispatch" class="zco-dispatch-btn" @click="dispatchAll">
        {{ isPartial ? `Partial dispatch · ${packedCount} item${packedCount > 1 ? 's' : ''} →` : `Dispatch all ${packedCount} items →` }}
      </button>
      <span v-if="dispatched" class="zco-dispatch-done">✓ Dispatched</span>
    </div>

    <div v-for="(group, gi) in order.brandGroups" :key="group.name">
      <div class="zco-brand-header"><span class="zco-brand-header-name">{{ group.name }}</span></div>

      <div
        v-for="(item, ii) in group.items"
        :key="ii"
        class="zco-ist-row"
        :class="{ 'is-flagged': states[keyFor(group.name, gi, ii)].flagged }"
      >
        <div class="zco-ist-top">
          <div class="zco-ist-info">
            <div class="zco-ist-name">{{ item.name }}</div>
            <div class="zco-ist-meta"><span>{{ item.variant }}</span><span class="zco-ist-meta-sep">·</span><span>{{ item.sku }}</span></div>
          </div>
          <div class="zco-ist-dots">
            <template v-for="(d, i) in dots" :key="i">
              <div v-if="i > 0" class="zco-ist-conn" :class="{ 'is-done': i <= meta(states[keyFor(group.name, gi, ii)].stage).pos }" />
              <div class="zco-ist-dot" :class="dotClass(states[keyFor(group.name, gi, ii)].stage, i)" />
            </template>
          </div>
          <span class="zco-ist-badge" :class="`zco-ist-badge--${meta(states[keyFor(group.name, gi, ii)].stage).badgeCls}`">{{ meta(states[keyFor(group.name, gi, ii)].stage).label }}</span>
        </div>

        <div class="zco-ist-bottom">
          <span v-if="states[keyFor(group.name, gi, ii)].updatedBy" class="zco-ist-updated">{{ states[keyFor(group.name, gi, ii)].updatedBy }} · {{ states[keyFor(group.name, gi, ii)].updatedAt }}</span>
          <span v-else class="zco-ist-updated" style="color:var(--zg-text-xdim)">Not yet updated</span>

          <template v-if="states[keyFor(group.name, gi, ii)].stage === 'qc_check'">
            <button class="zco-ist-primary zco-ist-primary--pass" @click="advance(keyFor(group.name, gi, ii), 'qc_passed')">✓ Pass QC</button>
            <button class="zco-ist-primary zco-ist-primary--fail" @click="qcFailKey = keyFor(group.name, gi, ii); qcReason = null">✕ Fail QC</button>
          </template>
          <template v-else-if="states[keyFor(group.name, gi, ii)].stage === 'qc_failed'">
            <button class="zco-ist-primary" @click="advance(keyFor(group.name, gi, ii), 'awaiting_replacement')">↩ Request Replacement</button>
            <button class="zco-ist-primary zco-ist-primary--fail" @click="advance(keyFor(group.name, gi, ii), 'refund_initiated')">✕ Issue Refund</button>
          </template>
          <span v-else-if="states[keyFor(group.name, gi, ii)].stage === 'refund_initiated'" class="zco-ist-updated" style="color:var(--zg-danger)">Refund in progress · customer notified</span>
          <button v-else-if="meta(states[keyFor(group.name, gi, ii)].stage).next" class="zco-ist-primary" @click="advance(keyFor(group.name, gi, ii), meta(states[keyFor(group.name, gi, ii)].stage).next)">{{ meta(states[keyFor(group.name, gi, ii)].stage).nextLabel }} →</button>
          <span v-else-if="states[keyFor(group.name, gi, ii)].stage === 'dispatched'" class="zco-ist-updated" style="color:var(--zg-good)">✓ Dispatched</span>

          <button class="zco-ist-secondary" :class="{ 'has-notes': states[keyFor(group.name, gi, ii)].notes.length }" @click="noteKey = noteKey === keyFor(group.name, gi, ii) ? null : keyFor(group.name, gi, ii); noteText = ''">
            Note<template v-if="states[keyFor(group.name, gi, ii)].notes.length"> ({{ states[keyFor(group.name, gi, ii)].notes.length }})</template>
          </button>
          <button class="zco-ist-secondary" :class="{ 'is-on': states[keyFor(group.name, gi, ii)].flagged }" @click="toggleFlag(keyFor(group.name, gi, ii))">
            {{ states[keyFor(group.name, gi, ii)].flagged ? 'Flagged' : 'Flag' }}
          </button>

          <div v-if="qcFailKey === keyFor(group.name, gi, ii)" class="zco-ist-fail-picker" style="width:100%">
            <div class="zco-ist-fail-picker-label">Select failure reason</div>
            <div class="zco-ist-fail-reasons">
              <button v-for="r in reasons" :key="r" class="zco-ist-fail-reason" :class="{ 'is-selected': qcReason === r }" @click="qcReason = r">{{ r }}</button>
            </div>
            <div class="zco-ist-fail-actions">
              <button class="zco-ist-fail-confirm" :disabled="!qcReason" @click="confirmFail(keyFor(group.name, gi, ii))">Confirm Failure</button>
              <button class="zco-ist-fail-cancel" @click="qcFailKey = null; qcReason = null">Cancel</button>
            </div>
          </div>
        </div>

        <div v-if="noteKey === keyFor(group.name, gi, ii)" class="zco-ist-note-area">
          <textarea rows="2" placeholder="Add a note for this item (visible to all staff)…" v-model="noteText" />
          <div class="zco-ist-note-actions">
            <button class="zco-ist-note-post" @click="postNote(keyFor(group.name, gi, ii))">Post</button>
            <button class="zco-ist-note-cancel" @click="noteKey = null">Cancel</button>
          </div>
        </div>

        <div v-if="states[keyFor(group.name, gi, ii)].notes.length" class="zco-ist-notes-list">
          <div v-for="(n, ni) in states[keyFor(group.name, gi, ii)].notes" :key="ni" class="zco-ist-note-item">
            {{ n.text }}
            <div class="zco-ist-note-item-meta">{{ n.by }} · {{ n.at }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

