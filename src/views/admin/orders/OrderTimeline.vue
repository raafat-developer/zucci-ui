<script setup>
/**
 * OrderTimeline — the order activity timeline with composer (@mention, #tag,
 * attach), visibility toggle, and rendered entries. Faithful port of the
 * React OrderTimeline. @user drawer open handled by parent via `user-click`.
 */
import { ref, computed } from 'vue';
import { ZC_TIMELINE_USERS } from '@/data/ordersData';

const props = defineProps({ order: { type: Object, required: true } });
const emit = defineEmits(['user-click']);

const ACTOR_META = {
  system:   { label:'SYS',  bg:'var(--zg-panel-hi)',            color:'var(--zg-text-dim)' },
  admin:    { label:'ADM',  bg:'var(--zg-accent-tint)',         color:'var(--zg-accent)' },
  customer: { label:'CST',  bg:'oklch(0.82 0.14 215 / 0.15)',   color:'oklch(0.82 0.14 215)' },
  vendor:   { label:'VND',  bg:'oklch(0.82 0.15 75 / 0.12)',    color:'var(--zg-warn)' },
  note:     { label:'NOTE', bg:'oklch(0.88 0.19 130 / 0.08)',   color:'var(--zg-text-mid)' },
};
const PRESET_TAGS = ['Fraud','Urgent','VIP','Damaged','Replacement','Refund','Priority','Review'];

const comment = ref('');
const visibility = ref('internal');
const showMention = ref(false);
const mentionQ = ref('');
const showTag = ref(false);
const tagQ = ref('');
const entries = ref(JSON.parse(JSON.stringify(props.order.timeline)));

const onInput = (e) => {
  const val = e.target.value; comment.value = val;
  const at = val.match(/@([\w]*)$/); const tag = val.match(/#([\w]*)$/);
  if (at) { mentionQ.value = at[1].toLowerCase(); showMention.value = true; showTag.value = false; }
  else if (tag) { tagQ.value = tag[1].toLowerCase(); showTag.value = true; showMention.value = false; }
  else { showMention.value = false; showTag.value = false; }
};
const insertMention = (u) => { comment.value = comment.value.replace(/@[\w]*$/, '@' + u.name.replace(/\s+/g, '_') + ' '); showMention.value = false; };
const insertTag = (t) => { comment.value = comment.value.replace(/#[\w]*$/, '#' + t + ' '); showTag.value = false; };
const post = () => {
  if (!comment.value.trim()) return;
  entries.value.unshift({ date: 'Today', entries: [{ type: 'note', actor: { id:'u-cur', name:'You', role:'admin', initials:'ME' }, text: comment.value.trim(), time: 'just now', visibility: visibility.value }] });
  comment.value = '';
};

const filteredUsers = computed(() => (ZC_TIMELINE_USERS || []).filter((u) =>
  mentionQ.value === '' || (u.name || '').toLowerCase().includes(mentionQ.value) || (u.brand && u.brand.toLowerCase().includes(mentionQ.value))
).slice(0, 6));
const filteredTags = computed(() => PRESET_TAGS.filter((t) => tagQ.value === '' || t.toLowerCase().includes(tagQ.value)));

const meta = (type) => ACTOR_META[type] || ACTOR_META.system;
const isSystem = (e) => !e.actor || e.actor.role === 'system';
const parts = (text) => (text || '').split(/(@[\w_]+|#[\w_]+)/g);
</script>

<template>
  <div class="zco-timeline">
    <div class="zco-section-head" style="margin-bottom:14px">
      <div class="zco-section-title">Timeline</div>
      <div style="display:flex;gap:4px">
        <button class="zco-tl-vis-btn" :class="{ 'is-on': visibility === 'internal' }" @click="visibility = 'internal'">🔒 Internal</button>
        <button class="zco-tl-vis-btn" :class="{ 'is-on': visibility === 'shared' }" @click="visibility = 'shared'">👁 Shared</button>
      </div>
    </div>

    <div class="zco-timeline-composer" style="position:relative">
      <div class="zco-timeline-avatar">ME</div>
      <div class="zco-timeline-input-wrap">
        <textarea
          class="zco-timeline-input"
          :placeholder="visibility === 'internal' ? 'Leave an internal note… (@mention, #tag, 📎 attach)' : 'Leave a comment visible to @mentioned vendors…'"
          :value="comment"
          rows="2"
          @input="onInput"
        />
        <div class="zco-timeline-toolbar">
          <div class="zco-timeline-tool-left">
            <button class="zco-timeline-tool-btn" title="Mention" @click="comment += '@'">@</button>
            <button class="zco-timeline-tool-btn" title="Tag" @click="comment += '#'">#</button>
          </div>
          <button class="zco-timeline-post" @click="post">Post</button>
        </div>
      </div>

      <div v-if="showMention && filteredUsers.length" class="zco-mention-dropdown">
        <button v-for="u in filteredUsers" :key="u.id" class="zco-mention-row" @click="insertMention(u)">
          <span class="zco-mention-avatar" :style="{ background: u.role==='vendor' ? 'oklch(0.82 0.15 75 / 0.2)' : 'var(--zg-accent-tint)', color: u.role==='vendor' ? 'var(--zg-warn)' : 'var(--zg-accent)' }">{{ u.initials }}</span>
          <span class="zco-mention-name">{{ u.name }}</span>
          <span class="zco-mention-role" :class="{ 'is-vendor': u.role==='vendor' }">{{ u.role==='vendor' ? 'Vendor' : u.role==='customer' ? 'Customer' : 'Admin' }}</span>
        </button>
      </div>
      <div v-if="showTag" class="zco-mention-dropdown">
        <button v-for="t in filteredTags" :key="t" class="zco-mention-row" @click="insertTag(t)">
          <span class="zco-tag-hash">#</span><span class="zco-mention-name">{{ t }}</span><span class="zco-mention-role">Tag</span>
        </button>
      </div>
    </div>

    <div class="zco-timeline-note">
      {{ visibility === 'internal' ? '🔒 Only Zucci staff can see this. Use @ to mention users, # to tag, 📎 to attach.' : '👁 Vendors you @mention will see this comment.' }}
    </div>

    <div v-for="(group, gi) in entries" :key="gi">
      <div class="zco-tl-date">{{ group.date }}</div>
      <div v-for="(entry, ei) in group.entries" :key="ei" class="zco-tl-entry-v2" :class="{ 'is-note': entry.type === 'note' }">
        <div class="zco-tl-entry-left">
          <div v-if="isSystem(entry)" class="zco-tl-sys-dot" />
          <button v-else class="zco-tl-avatar-btn" :style="{ background: meta(entry.type).bg, color: meta(entry.type).color }" @click="emit('user-click', entry.actor)">{{ entry.actor.initials }}</button>
          <div class="zco-tl-v-line" />
        </div>
        <div class="zco-tl-entry-body">
          <div class="zco-tl-entry-head">
            <span v-if="isSystem(entry)" class="zco-tl-sys-label">System</span>
            <button v-else class="zco-tl-actor-name" @click="emit('user-click', entry.actor)">{{ entry.actor.name }}</button>
            <span class="zco-tl-type-badge" :class="`zco-tl-type-badge--${entry.type}`">{{ meta(entry.type).label }}</span>
            <span v-if="entry.visibility === 'internal'" class="zco-tl-internal">🔒 Internal</span>
            <span class="zco-tl-time-v2">{{ entry.time }}</span>
          </div>
          <div v-if="entry.text" class="zco-tl-body-text">
            <template v-for="(part, pi) in parts(entry.text)" :key="pi"><span v-if="part.startsWith('@')" class="zco-tl-mention">{{ part }}</span><span v-else-if="part.startsWith('#')" class="zco-tl-tag-pill">{{ part }}</span><template v-else>{{ part }}</template></template>
          </div>
          <button v-if="entry.viewEmail" class="zco-tl-email-btn" style="margin-top:6px">View Email</button>
        </div>
      </div>
    </div>
  </div>
</template>
