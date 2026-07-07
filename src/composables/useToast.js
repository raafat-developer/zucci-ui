// src/composables/useToast.js — lightweight toast (ported from window.toast usage).
// Renders via a singleton container appended to <body>. Import { toast } anywhere.
let container = null;
function ensure() {
  if (container) return container;
  container = document.createElement('div');
  container.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:99999;display:flex;flex-direction:column;gap:8px;align-items:center';
  document.body.appendChild(container);
  return container;
}
function show(message, kind = 'info') {
  const c = ensure();
  const el = document.createElement('div');
  const color = kind === 'success' ? 'var(--zg-good)' : kind === 'error' ? 'var(--zg-danger)' : kind === 'warn' ? 'var(--zg-warn)' : 'var(--zg-accent)';
  el.style.cssText = `background:var(--zg-bg-elev);border:1px solid var(--zg-line);border-left:3px solid ${color};color:var(--zg-text);font-size:12.5px;padding:9px 16px;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.4);opacity:0;transition:opacity .18s,transform .18s;transform:translateY(6px);font-family:var(--zg-sans)`;
  el.textContent = message;
  c.appendChild(el);
  requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(6px)'; setTimeout(() => el.remove(), 200); }, 2600);
}
export const toast = {
  info: (m) => show(m, 'info'),
  success: (m) => show(m, 'success'),
  error: (m) => show(m, 'error'),
  warn: (m) => show(m, 'warn'),
};
