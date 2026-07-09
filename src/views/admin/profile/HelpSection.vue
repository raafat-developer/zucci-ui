<template>
  <div>
    <div class="up-section-title">Help & Documentation</div>
    <div class="up-section-sub">
      Resources, support, and documentation links
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
      <div
        v-for="item in [
          {
            title: 'API Documentation',
            desc: 'REST API reference, authentication, and SDKs.',
            icon: 'plug',
            href: '#',
          },
          {
            title: 'Ops Playbook',
            desc: 'Step-by-step guides for common operational tasks.',
            icon: 'log',
            href: '#',
          },
          {
            title: 'Video Tutorials',
            desc: 'Screen-recorded walkthroughs for every module.',
            icon: 'video',
            href: '#',
          },
          {
            title: 'Changelog',
            desc: 'Recent updates, new features, and bug fixes.',
            icon: 'flag',
            href: '#',
          },
          {
            title: 'Submit Support Ticket',
            desc: 'Open a ticket with the platform support team.',
            icon: 'ticket',
            href: '#',
          },
          {
            title: 'Status Page',
            desc: 'Live platform uptime and incident history.',
            icon: 'globe',
            href: '#',
          },
        ]"
        :key="item.title"
        style="
          background: var(--zg-panel);
          border: 1px solid var(--zg-line);
          border-radius: var(--zg-radius-md);
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          cursor: pointer;
          transition: border-color 0.1s;
        "
        @mouseenter="
          (e) => (e.currentTarget.style.borderColor = 'var(--zg-accent)')
        "
        @mouseleave="
          (e) => (e.currentTarget.style.borderColor = 'var(--zg-line)')
        "
        @click=""
      >
        <div style="font-size: 13px; font-weight: 600; color: var(--zg-text)">
          {{ item.title }}
        </div>
        <div
          style="
            font-size: 11.5px;
            color: var(--zg-text-dim);
            line-height: 1.4;
            flex: 1;
          "
        >
          {{ item.desc }}
        </div>
        <div
          style="
            font-size: 11px;
            color: var(--zg-accent);
            font-weight: 600;
            margin-top: 4px;
          "
        >
          Open →
        </div>
      </div>
    </div>

    <div
      style="
        margin-top: 20px;
        padding: 14px 16px;
        background: var(--zg-panel);
        border: 1px solid var(--zg-line);
        border-radius: var(--zg-radius-md);
      "
    >
      <div
        style="
          font-size: 12px;
          font-weight: 600;
          color: var(--zg-text);
          margin-bottom: 4px;
        "
      >
        Platform Version
      </div>
      <div
        style="
          font-family: var(--zg-mono);
          font-size: 11.5px;
          color: var(--zg-text-dim);
        "
      >
        Zucci Admin v2.4.1 — Build 2026.07.09
      </div>
    </div>
  </div>
</template>
