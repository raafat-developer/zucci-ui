<script setup>
import { ref, computed, watch } from 'vue';
import { PRIORITY_META, STATUS_META, CAT_COLORS, TEAMS, ASSIGNEES, CANNED, TIMELINE_DATA } from '@/data/ticketsData';

const props = defineProps({ ticket: { type: Object, required: true } });
const emit  = defineEmits(['update']);

const comment    = ref('');
const cannedOpen = ref(false);
const rating     = ref(0);

watch(() => props.ticket.id, () => { comment.value = ''; cannedOpen.value = false; });

const p = computed(() => PRIORITY_META[props.ticket.priority] || {});
const s = computed(() => STATUS_META[props.ticket.status] || {});

const timeline = computed(() =>
  TIMELINE_DATA[props.ticket.id] || [
    { time: props.ticket.created, user:'System',            action:'Ticket created',  type:'create' },
    { time: props.ticket.updated, user: props.ticket.assignee, action:'Last updated', type:'status' },
  ]
);

const tlDot = (type) => ({
  sla:     'var(--zg-danger)',
  escalate:'var(--zg-warn)',
  create:  'var(--zg-accent)',
})[type] || 'var(--zg-text-dim)';

function slaBadge(ticket) {
  if (ticket.sla_remaining < 0)
    return { color:'var(--zg-danger)', bg:'oklch(0.70 0.18 25 / 0.15)', label:'BREACHED' };
  if (ticket.sla_remaining <= ticket.sla_hours * 0.25)
    return { color:'var(--zg-warn)', bg:'oklch(0.82 0.15 75 / 0.12)', label:`${ticket.sla_remaining}h left` };
  return { color:'var(--zg-good)', bg:'oklch(0.78 0.15 150 / 0.1)', label:`${ticket.sla_remaining}h left` };
}

function updateField(key, val) { emit('update', { id: props.ticket.id, [key]: val }); }
function insertCanned(body) { comment.value = body; cannedOpen.value = false; }
function addComment() { if (!comment.value.trim()) return; comment.value = ''; }
function attachFile(e) { if (e.target.files?.length) e.target.value = ''; }

const isResolved = computed(() => props.ticket.status === 'resolved' || props.ticket.status === 'closed');
const csatScore  = computed(() => props.ticket.csat || rating.value);
const csatLabel  = ['','Poor','Fair','OK','Good','Excellent'];
</script>

<template>
  <div class="tkt-detail">
    <!-- Header -->
    <div class="tkt-detail-head">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:8px;">
        <div>
          <div style="font-size:11px;font-family:var(--zg-mono);color:var(--zg-text-dim);margin-bottom:3px;">{{ ticket.id }} · {{ ticket.market }} · {{ ticket.created }}</div>
          <div style="font-size:15px;font-weight:700;color:var(--zg-text);line-height:1.3;">{{ ticket.subject }}</div>
        </div>
        <div style="display:flex;gap:6px;flex-shrink:0;flex-wrap:wrap;">
          <button class="tkt-btn-sm" @click="">Print</button>
          <span class="tkt-prio-badge" :style="{ background: p.color+'22', color: p.color }">{{ p.label }}</span>
          <span class="tkt-stat-badge" :style="{ color: s.color }">{{ s.label }}</span>
        </div>
      </div>
      <!-- Assignee / Team / SLA / Status -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
        <div class="tkt-meta-field">
          <span class="tkt-field-lbl">Assignee</span>
          <select class="tkt-select" :value="ticket.assignee" @change="updateField('assignee', $event.target.value)">
            <option v-for="a in ASSIGNEES" :key="a" :value="a">{{ a }}</option>
          </select>
        </div>
        <div class="tkt-meta-field">
          <span class="tkt-field-lbl">Team</span>
          <select class="tkt-select" :value="ticket.team" @change="updateField('team', $event.target.value)">
            <option v-for="t in TEAMS" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
        <div class="tkt-meta-field">
          <span class="tkt-field-lbl">SLA</span>
          <div style="height:26px;display:flex;align-items:center;">
            <span class="tkt-sla-badge" :style="{ color: slaBadge(ticket).color, background: slaBadge(ticket).bg }">{{ slaBadge(ticket).label }}</span>
          </div>
        </div>
        <div class="tkt-meta-field">
          <span class="tkt-field-lbl">Status</span>
          <select class="tkt-select" :value="ticket.status" @change="updateField('status', $event.target.value)" :style="{ color: s.color, fontWeight:600 }">
            <option v-for="[v,m] in Object.entries(STATUS_META)" :key="v" :value="v">{{ m.label }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Body scroll -->
    <div class="tkt-detail-body">
      <!-- Meta strip -->
      <div class="tkt-meta-strip">
        <template v-for="[l,v] in [['Entity',ticket.entity],['Category',ticket.cat],ticket.order_ref?['Linked Ref',ticket.order_ref]:null,['Market',ticket.market],['Updated',ticket.updated]].filter(Boolean)" :key="l">
          <div>
            <div class="tkt-field-lbl">{{ l }}</div>
            <div style="font-size:12px;font-weight:600;color:var(--zg-text);">{{ v }}</div>
          </div>
        </template>
        <div style="display:flex;gap:4px;flex-wrap:wrap;margin-left:auto;">
          <span v-for="tg in (ticket.tags||[])" :key="tg" class="tkt-tag">{{ tg }}</span>
        </div>
      </div>

      <!-- Timeline -->
      <div class="tkt-timeline-wrap">
        <div class="tkt-field-lbl" style="margin-bottom:10px;font-size:10px;">Timeline</div>
        <div v-for="(e, i) in timeline" :key="i" style="display:flex;gap:10px;align-items:flex-start;padding-bottom:10px;">
          <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;">
            <div style="width:8px;height:8px;border-radius:50%;margin-top:2px;" :style="{ background: tlDot(e.type) }" />
            <div v-if="i < timeline.length-1" style="width:1px;flex:1;background:var(--zg-line);min-height:12px;margin-top:2px;" />
          </div>
          <div style="flex:1;padding-bottom:2px;">
            <div style="font-size:12px;color:var(--zg-text);" :style="{ fontWeight: e.type==='sla'?700:500 }">{{ e.action }}</div>
            <div style="font-size:10.5px;color:var(--zg-text-dim);margin-top:1px;">{{ e.user }} · {{ e.time }}</div>
          </div>
        </div>
      </div>

      <!-- CSAT (resolved/closed) -->
      <div v-if="isResolved" class="tkt-csat-strip">
        <span style="font-size:11.5px;color:var(--zg-text-mid);">CSAT:</span>
        <button v-for="n in 5" :key="n" class="tkt-csat-btn"
          :style="{ borderColor: csatScore>=n?'var(--zg-accent)':'var(--zg-line)', background: csatScore>=n?'oklch(0.78 0.18 130 / 0.1)':'transparent', color: csatScore>=n?'var(--zg-accent)':'var(--zg-text-dim)' }"
          @click="rating = n">{{ n }}</button>
        <span v-if="csatScore > 0" style="font-size:11px;color:var(--zg-text-dim);margin-left:4px;">{{ csatLabel[csatScore] }}</span>
      </div>
    </div>

    <!-- Reply box -->
    <div class="tkt-reply-box">
      <textarea v-model="comment" placeholder="Add a comment or reply…" class="tkt-textarea" />
      <div style="display:flex;align-items:center;gap:8px;margin-top:6px;">
        <label class="tkt-btn-sm" style="cursor:pointer;">
          <input type="file" multiple style="display:none;" @change="attachFile" />
          <svg viewBox="0 0 12 12" width="11" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M10 5L5.5 9.5a3 3 0 01-4.25-4.25L6.5 1a2 2 0 012.83 2.83L4 9a1 1 0 01-1.42-1.42L7.5 3"/></svg>
          Attach
        </label>
        <div style="position:relative;">
          <button class="tkt-btn-sm" @click="cannedOpen = !cannedOpen">Canned ▾</button>
          <div v-if="cannedOpen" style="position:absolute;bottom:30px;left:0;width:280px;background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);z-index:50;overflow:hidden;">
            <button v-for="c in CANNED" :key="c.id"
              style="display:block;width:100%;padding:8px 12px;text-align:left;border:none;border-bottom:1px solid var(--zg-line);background:transparent;cursor:pointer;font-size:11.5px;color:var(--zg-text-mid);"
              @click="insertCanned(c.body)">{{ c.title }}</button>
          </div>
        </div>
        <div style="margin-left:auto;display:flex;gap:6px;">
          <button class="tkt-action-btn warn" @click="updateField('status','in_progress')">Escalate</button>
          <button class="tkt-action-btn good" @click="updateField('status','resolved')">Resolve</button>
          <button class="tkt-action-btn dim" @click="updateField('status','closed')">Close</button>
          <button class="tkt-action-btn primary" @click="addComment">Send</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tkt-detail { display:flex;flex-direction:column;height:100%;min-height:0; }
.tkt-detail-head { padding:14px 20px;border-bottom:1px solid var(--zg-line);flex-shrink:0;background:var(--zg-bg-elev); }
.tkt-detail-body { flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:0;scrollbar-width:thin;scrollbar-color:var(--zg-line) transparent; }
.tkt-reply-box { padding:12px 16px;border-top:1px solid var(--zg-line);flex-shrink:0;background:var(--zg-bg-elev); }

.tkt-btn-sm { height:22px;padding:0 8px;border:1px solid var(--zg-line);border-radius:3px;background:transparent;cursor:pointer;font-size:10.5px;color:var(--zg-text-dim);font-family:inherit;display:inline-flex;align-items:center;gap:4px; }
.tkt-prio-badge { height:22px;padding:0 8px;border-radius:3px;font-size:10.5px;font-weight:700;display:inline-flex;align-items:center; }
.tkt-stat-badge { height:22px;padding:0 8px;border-radius:3px;font-size:10.5px;font-weight:600;background:var(--zg-panel);border:1px solid var(--zg-line);display:inline-flex;align-items:center; }
.tkt-sla-badge { font-size:10px;padding:2px 6px;border-radius:2px;font-weight:700;font-family:var(--zg-mono); }

.tkt-meta-field { display:flex;flex-direction:column;gap:3px; }
.tkt-field-lbl { font-size:9.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--zg-text-dim);font-weight:600; }
.tkt-select { height:26px;padding:0 6px;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:3px;font-family:inherit;font-size:11px;color:var(--zg-text);outline:none;cursor:pointer;width:100%; }

.tkt-meta-strip { padding:12px 20px;border-bottom:1px solid var(--zg-line);display:flex;gap:16px;flex-wrap:wrap;flex-shrink:0; }
.tkt-tag { height:18px;padding:0 6px;border-radius:2px;background:var(--zg-panel);border:1px solid var(--zg-line);font-size:10px;color:var(--zg-text-dim);display:inline-flex;align-items:center; }

.tkt-timeline-wrap { padding:14px 20px;border-bottom:1px solid var(--zg-line);flex-shrink:0; }
.tkt-csat-strip { padding:10px 20px;border-bottom:1px solid var(--zg-line);flex-shrink:0;display:flex;align-items:center;gap:6px; }
.tkt-csat-btn { width:24px;height:24px;border-radius:50%;border:1px solid;cursor:pointer;background:transparent;font-size:12px;display:flex;align-items:center;justify-content:center;transition:all .12s; }

.tkt-textarea { width:100%;height:72px;padding:8px 10px;resize:none;background:var(--zg-panel);border:1px solid var(--zg-line);border-radius:var(--zg-radius-md);font-family:inherit;font-size:12px;color:var(--zg-text);outline:none;box-sizing:border-box; }

.tkt-action-btn { height:28px;padding:0 12px;border-radius:var(--zg-radius-md);font-size:12px;font-weight:600;cursor:pointer;border:none;font-family:inherit; }
.tkt-action-btn.primary { background:var(--zg-accent);color:oklch(0.18 0.04 130); }
.tkt-action-btn.good { background:oklch(0.78 0.15 150 / 0.15);color:var(--zg-good);border:1px solid oklch(0.78 0.15 150 / 0.3); }
.tkt-action-btn.warn { background:oklch(0.82 0.15 75 / 0.15);color:var(--zg-warn);border:1px solid oklch(0.82 0.15 75 / 0.3); }
.tkt-action-btn.dim { background:var(--zg-panel);color:var(--zg-text-dim);border:1px solid var(--zg-line); }
</style>
