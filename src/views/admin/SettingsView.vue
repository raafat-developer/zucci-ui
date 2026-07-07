<script lang="tsx">
import { defineComponent, ref, reactive, computed } from 'vue'

const toast = { success(){}, warn(){}, info(){}, error(){} };

const __UNITLESS = {zIndex:1,zoom:1,opacity:1,fontWeight:1,lineHeight:1,flex:1,flexGrow:1,flexShrink:1,flexBasis:0,order:1,gridColumn:1,gridRow:1,gridRowStart:1,gridColumnStart:1,columns:1,fillOpacity:1,strokeOpacity:1,strokeWidth:1,scale:1,animationIterationCount:1,aspectRatio:1,WebkitLineClamp:1};
function __s(o){ if(!o||typeof o!=='object'||Array.isArray(o)) return o; const r={}; for(const k in o){ const v=o[k]; r[k]=(typeof v==='number' && !__UNITLESS[k])? v+'px' : v; } return r; }


const MARKETS = ['AE','SA','EG','KW','BH','QA','OM'];
const MARKET_NAMES = { AE:'UAE', SA:'Saudi Arabia', EG:'Egypt', KW:'Kuwait', BH:'Bahrain', QA:'Qatar', OM:'Oman' };
const MARKET_FLAGS = { AE:'🇦🇪', SA:'🇸🇦', EG:'🇪🇬', KW:'🇰🇼', BH:'🇧🇭', QA:'🇶🇦', OM:'🇴🇲' };
const MARKET_CURRENCIES = { AE:'AED', SA:'SAR', EG:'EGP', KW:'KWD', BH:'BHD', QA:'QAR', OM:'OMR' };

const SETTINGS_SECTIONS = [
  { id:'company',    label:'Company Info',       icon:'building'  },
  { id:'markets',    label:'Markets',            icon:'globe'     },
  { id:'returns',    label:'Return Policies',    icon:'undo'      },
  { id:'access',     label:'Access Management',  icon:'shield'    },
  { id:'gateways',   label:'Payment Gateways',   icon:'card'      },
  { id:'shipping',   label:'Shipping Providers', icon:'truck'     },
  { id:'tax',        label:'Tax & VAT',          icon:'percent'   },
  { id:'branding',   label:'Appearance',         icon:'palette'   },
  { id:'api',        label:'API & Webhooks',     icon:'plug'      },
  { id:'audit',      label:'Audit Log',          icon:'log'       },
  { id:'flags',      label:'Feature Flags',      icon:'flag'      },
  { id:'tiers',      label:'Tiers Management',    icon:'tier'      },
  { id:'roles',      label:'Roles & Permissions', icon:'shield'    },
];

const SETTINGS_GROUPS = [
  { group:'Company', sections:[
    { id:'company',  label:'Company Info',        icon:'building' },
    { id:'branding', label:'Appearance',          icon:'palette'  },
  ]},
  { group:'Markets & Regions', sections:[
    { id:'markets',  label:'Markets',             icon:'globe'    },
    { id:'returns',  label:'Return Policies',     icon:'undo'     },
    { id:'tax',      label:'Tax & VAT',           icon:'percent'  },
    { id:'flags',    label:'Feature Flags',       icon:'flag'     },
  ]},
  { group:'Team & Access', sections:[
    { id:'access',   label:'Access Management',   icon:'shield'   },
    { id:'roles',    label:'Roles & Permissions', icon:'shield', indent:true },
    { id:'tiers',    label:'Tiers Management',    icon:'tier'     },
  ]},
  { group:'Payments & Shipping', sections:[
    { id:'gateways', label:'Payment Gateways',    icon:'card'     },
    { id:'shipping', label:'Shipping Providers',  icon:'truck'    },
  ]},
  { group:'Developer', sections:[
    { id:'api',      label:'API & Webhooks',      icon:'plug'     },
    { id:'audit',    label:'Audit Log',           icon:'log'      },
  ]},
];

function SIcon({ name, size=15 }) {
  const p = { fill:'none', stroke:'currentColor', strokeWidth:1.5, strokeLinecap:'round', strokeLinejoin:'round' };
  switch(name) {
    case 'building': return <svg viewBox="0 0 16 16" width={size} height={size}><rect x="2" y="2" width="12" height="12" rx="1" {...p}/><path d="M5 6h2M9 6h2M5 9h2M9 9h2M6 14v-4h4v4" {...p}/></svg>;
    case 'globe':    return <svg viewBox="0 0 16 16" width={size} height={size}><circle cx="8" cy="8" r="6" {...p}/><path d="M1 8h14M8 2c-2 3-2 9 0 12M8 2c2 3 2 9 0 12" {...p}/></svg>;
    case 'undo':     return <svg viewBox="0 0 16 16" width={size} height={size}><path d="M3 7V3H7M3 7a6 6 0 100 2" {...p}/></svg>;
    case 'shield':   return <svg viewBox="0 0 16 16" width={size} height={size}><path d="M8 2L3 4v4c0 3 2.5 5 5 6 2.5-1 5-3 5-6V4z" {...p}/></svg>;
    case 'card':     return <svg viewBox="0 0 16 16" width={size} height={size}><rect x="1" y="4" width="14" height="9" rx="1.5" {...p}/><path d="M1 7h14" {...p}/></svg>;
    case 'truck':    return <svg viewBox="0 0 16 16" width={size} height={size}><path d="M1 4h9v8H1zM10 6h3l2 3v3h-5V6z" {...p}/><circle cx="3.5" cy="12.5" r="1" {...p}/><circle cx="12.5" cy="12.5" r="1" {...p}/></svg>;
    case 'percent':  return <svg viewBox="0 0 16 16" width={size} height={size}><line x1="13" y1="3" x2="3" y2="13" {...p}/><circle cx="4.5" cy="4.5" r="1.5" {...p}/><circle cx="11.5" cy="11.5" r="1.5" {...p}/></svg>;
    case 'palette':  return <svg viewBox="0 0 16 16" width={size} height={size}><path d="M8 2a6 6 0 100 12c.5 0 2-.5 2-2 0-.7-.3-1-.3-1.5A1.5 1.5 0 0111.2 9a1.5 1.5 0 011.5 1.5A1.5 1.5 0 0114 12a4 4 0 01-6 3.5" {...p}/><circle cx="5" cy="7" r="1" fill="currentColor"/><circle cx="8" cy="5" r="1" fill="currentColor"/><circle cx="11" cy="7" r="1" fill="currentColor"/></svg>;
    case 'plug':     return <svg viewBox="0 0 16 16" width={size} height={size}><path d="M5 1v4M11 1v4M3 5h10v3a5 5 0 01-10 0V5zM8 13v2" {...p}/></svg>;
    case 'log':      return <svg viewBox="0 0 16 16" width={size} height={size}><rect x="2" y="2" width="12" height="12" rx="1" {...p}/><path d="M5 5h6M5 8h6M5 11h4" {...p}/></svg>;
    case 'flag':     return <svg viewBox="0 0 16 16" width={size} height={size}><path d="M3 2v12M3 2h8l-2 4 2 4H3" {...p}/></svg>;
    case 'tier':     return <svg viewBox="0 0 16 16" width={size} height={size}><path d="M8 2l2 4 4.5.5-3.5 3 1 4.5L8 12l-4 2 1-4.5L1.5 6.5 6 6z" {...p}/></svg>;
    default:         return null;
  }
}

function SField({ label, value, onChange, type='text', mono, ph, disabled }) {
  return (
    <div style={__s({display:'flex',flexDirection:'column',gap:4})}>
      <label style={__s({fontSize:11,fontWeight:600,color:'var(--zg-text-mid)'})}>{label}</label>
      <input type={type} value={value||''} onChange={e=>onChange&&onChange(e.target.value)} placeholder={ph}
        disabled={disabled}
        style={__s({height:32,padding:'0 10px',background:disabled?'var(--zg-panel-hi)':'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',fontFamily:mono?'var(--zg-mono)':'var(--zg-sans)',fontSize:12,color:'var(--zg-text)',outline:'none',opacity:disabled?0.6:1})}/>
    </div>
  );
}
function SToggle({ label, sub, value, onChange }) {
  return (
    <div style={__s({display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,padding:'10px 0',borderBottom:'1px solid var(--zg-line-soft,#1c1f24)'})}>
      <div>
        <div style={__s({fontSize:12.5,fontWeight:500,color:'var(--zg-text)'})}>{label}</div>
        {sub&&<div style={__s({fontSize:11,color:'var(--zg-text-dim)',marginTop:1})}>{sub}</div>}
      </div>
      <button onClick={()=>onChange(!value)} style={__s({width:36,height:20,borderRadius:10,border:'none',cursor:'pointer',background:value?'var(--zg-accent)':'var(--zg-line)',position:'relative',flexShrink:0,transition:'background .14s'})}>
        <div style={__s({width:14,height:14,borderRadius:'50%',background:'#fff',position:'absolute',top:3,left:value?18:3,transition:'left .14s'})}/>
      </button>
    </div>
  );
}

// ── Company Info ──────────────────────────────────────────
const SettingsCompany = defineComponent({ name:'SettingsCompany', setup() {
    const v = reactive({ name:'Zucci Fashion Platform LLC', name_ar:'زوتشي للأزياء', trade_lic:'CN-1234567', vat:'100234567800003', cr:'1010234567', founded:'2023', address_uae:'Office 2401, Opus Tower, Business Bay, Dubai, UAE', address_eg:'12 Hassan Sabry St, Zamalek, Cairo, Egypt', email:'legal@zucci.com', phone:'+971 4 123 4567', website:'https://zucci.com' });
  const setV = (f)=>{ const nv=(typeof f==='function')?f(v):f; if(Array.isArray(v)){v.splice(0,v.length,...nv);} else {Object.keys(v).forEach(k=>delete v[k]);Object.assign(v,nv);} };
  const u = (k,val) => setV(p=>({...p,[k]:val}));
  return () => (
    <div class="zset-content">
      <div class="zset-content-head"><div><div class="zset-content-title">Company Info</div><div class="zset-content-sub">Legal entity details used on invoices, contracts, and tax documents</div></div><button class="zwh-btn-primary" onClick={()=>toast.success('Company info saved')}>Save Changes</button></div>
      <div style={__s({display:'grid',gridTemplateColumns:'1fr 1fr',gap:14})}>
        <SField label="Legal Name (EN)" value={v.name} onChange={v=>u('name',v)} ph="Company legal name"/>
        <SField label="Legal Name (AR)" value={v.name_ar} onChange={v=>u('name_ar',v)} ph="اسم الشركة"/>
        <SField label="Trade License No." value={v.trade_lic} onChange={v=>u('trade_lic',v)} mono ph="CN-XXXXXXX"/>
        <SField label="VAT Registration No." value={v.vat} onChange={v=>u('vat',v)} mono ph="15 digits"/>
        <SField label="Commercial Registration" value={v.cr} onChange={v=>u('cr',v)} mono/>
        <SField label="Founded Year" value={v.founded} onChange={v=>u('founded',v)} type="number"/>
        <div style={__s({gridColumn:'1 / -1'})}><SField label="UAE Address" value={v.address_uae} onChange={v=>u('address_uae',v)}/></div>
        <div style={__s({gridColumn:'1 / -1'})}><SField label="Egypt Address" value={v.address_eg} onChange={v=>u('address_eg',v)}/></div>
        <SField label="Legal Email" value={v.email} onChange={v=>u('email',v)} type="email"/>
        <SField label="Phone" value={v.phone} onChange={v=>u('phone',v)} mono/>
        <div style={__s({gridColumn:'1 / -1'})}><SField label="Website" value={v.website} onChange={v=>u('website',v)}/></div>
      </div>
    </div>
  );
}});

// ── Markets ───────────────────────────────────────────────
const MKT_DATA = {
  AE:{name:'UAE',         currency:'AED',rate:3.672,  vat:5,  langs:['en','ar'],payMethods:['card','apple_pay','google_pay','cod'],status:'active',  launchDate:'2024-01-15'},
  SA:{name:'Saudi Arabia',currency:'SAR',rate:3.75,   vat:15, langs:['ar','en'],payMethods:['card','apple_pay','stc_pay','cod'],   status:'active',  launchDate:'2024-03-01'},
  EG:{name:'Egypt',       currency:'EGP',rate:49.2,   vat:14, langs:['ar','en'],payMethods:['card','fawry','valu','cod'],          status:'active',  launchDate:'2024-02-15'},
  KW:{name:'Kuwait',      currency:'KWD',rate:0.308,  vat:0,  langs:['ar','en'],payMethods:['card','knet','cod'],                  status:'pending', launchDate:'2025-Q2'},
  BH:{name:'Bahrain',     currency:'BHD',rate:0.376,  vat:10, langs:['ar','en'],payMethods:['card','benefit','cod'],               status:'pending', launchDate:'2025-Q3'},
  QA:{name:'Qatar',       currency:'QAR',rate:3.641,  vat:0,  langs:['ar','en'],payMethods:['card','cod'],                        status:'active',  launchDate:'2024-06-01'},
  OM:{name:'Oman',        currency:'OMR',rate:0.385,  vat:5,  langs:['ar','en'],payMethods:['card','omannet','cod'],               status:'planned', launchDate:'2025-Q4'},
};
const SettingsMarkets = defineComponent({ name:'SettingsMarkets', setup() {
    const sel = ref('AE');
  const setSel = (v)=>{ sel.value=(typeof v==='function')?v(sel.value):v; };
    const data = reactive((()=>({...MKT_DATA}))());
  const setData = (f)=>{ const nv=(typeof f==='function')?f(data):f; if(Array.isArray(data)){data.splice(0,data.length,...nv);} else {Object.keys(data).forEach(k=>delete data[k]);Object.assign(data,nv);} };
  const m = data[sel.value];
  const u = (k,v) => setData(p=>({...p,[sel.value]:{...p[sel.value],[k]:v}}));
  const STATUS_COLORS = { active:'var(--zg-good)', pending:'var(--zg-warn)', planned:'var(--zg-text-dim)' };
  return () => (
    <div class="zset-content">
      <div class="zset-content-head"><div><div class="zset-content-title">Markets</div><div class="zset-content-sub">Per-market currency, tax, payment methods, and language configuration</div></div><button class="zwh-btn-primary" onClick={()=>toast.success(`${m.name} settings saved`)}>Save Changes</button></div>
      <div style={__s({display:'flex',gap:6,flexWrap:'wrap',marginBottom:16})}>
        {MARKETS.map(code=>{
          const md=data[code];
          return <button key={code} onClick={()=>setSel(code)}
            style={__s({height:32,padding:'0 12px',border:'1px solid',borderRadius:'var(--zg-radius-md)',background:'transparent',cursor:'pointer',fontFamily:'inherit',fontSize:12,fontWeight:sel.value===code?700:400,transition:'all .12s',
              borderColor:sel.value===code?'var(--zg-accent)':'var(--zg-line)',background:sel.value===code?'var(--zg-accent-tint)':'transparent',color:sel.value===code?'var(--zg-accent)':'var(--zg-text-mid)'})}>
            {MARKET_FLAGS[code]} {code} <span style={__s({fontSize:10,marginLeft:3,color:STATUS_COLORS[md.status]||'var(--zg-text-dim)'})}>●</span>
          </button>;
        })}
      </div>
      <div style={__s({background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',padding:16,display:'grid',gridTemplateColumns:'1fr 1fr',gap:14})}>
        <SField label="Country Name" value={m.name} disabled/>
        <SField label="Currency Code" value={m.currency} disabled mono/>
        <SField label="Exchange Rate (vs USD)" value={m.rate} onChange={v=>u('rate',parseFloat(v))} type="number" mono/>
        <div style={__s({display:'flex',flexDirection:'column',gap:4})}>
          <label style={__s({fontSize:11,fontWeight:600,color:'var(--zg-text-mid)'})}>Status</label>
          <select value={m.status} onChange={e=>u('status',e.target.value)} style={__s({height:32,padding:'0 10px',background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',fontFamily:'inherit',fontSize:12,color:'var(--zg-text)',outline:'none',cursor:'pointer'})}>
            <option value="active">Active</option><option value="pending">Pending</option><option value="planned">Planned</option><option value="suspended">Suspended</option>
          </select>
        </div>
        <SField label="Launch Date" value={m.launchDate} onChange={v=>u('launchDate',v)} disabled={m.status==='active'}/>
        <div style={__s({gridColumn:'1 / -1'})}>
          <div style={__s({fontSize:11,fontWeight:600,color:'var(--zg-text-mid)',marginBottom:6})}>Payment Methods</div>
          <div style={__s({display:'flex',gap:6,flexWrap:'wrap'})}>
            {['card','apple_pay','google_pay','cod','stc_pay','knet','benefit','fawry','valu','omannet','tabby','tamara'].map(pm=>{
              const on = m.payMethods?.includes(pm);
              return <button key={pm} onClick={()=>u('payMethods',on?m.payMethods.filter(x=>x!==pm):[...(m.payMethods||[]),pm])}
                style={__s({height:26,padding:'0 10px',borderRadius:3,border:'1px solid',cursor:'pointer',fontSize:11,fontFamily:'var(--zg-mono)',fontWeight:600,transition:'all .12s',
                  borderColor:on?'var(--zg-accent)':'var(--zg-line)',background:on?'var(--zg-accent-tint)':'transparent',color:on?'var(--zg-accent)':'var(--zg-text-dim)'})}>
                {pm}
              </button>;
            })}
          </div>
        </div>
        <div style={__s({gridColumn:'1 / -1'})}>
          <div style={__s({fontSize:11,fontWeight:600,color:'var(--zg-text-mid)',marginBottom:6})}>Languages</div>
          <div style={__s({display:'flex',gap:6})}>
            {['ar','en','fr','tr'].map(lang=>{
              const on = m.langs?.includes(lang);
              return <button key={lang} onClick={()=>u('langs',on?m.langs.filter(x=>x!==lang):[...(m.langs||[]),lang])}
                style={__s({height:26,padding:'0 10px',borderRadius:3,border:'1px solid',cursor:'pointer',fontSize:11,fontFamily:'var(--zg-mono)',fontWeight:700,transition:'all .12s',
                  borderColor:on?'var(--zg-accent)':'var(--zg-line)',background:on?'var(--zg-accent-tint)':'transparent',color:on?'var(--zg-accent)':'var(--zg-text-dim)'})}>
                {lang.toUpperCase()}
              </button>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}});

// ── Return Policies ───────────────────────────────────────
const RETURN_RULES = {
  AE:{ window:14, cross_border:false, aging:[{day:30,action:'10% off'},{day:60,action:'25% off'},{day:90,action:'40% off'},{day:120,action:'vendor notified'},{day:180,action:'write-off'}], cond_new:true, cond_used:false },
  SA:{ window:14, cross_border:false, aging:[{day:30,action:'10% off'},{day:60,action:'25% off'},{day:90,action:'40% off'},{day:120,action:'vendor notified'},{day:180,action:'write-off'}], cond_new:true, cond_used:false },
  EG:{ window:14, cross_border:true,  aging:[{day:30,action:'15% off'},{day:60,action:'30% off'},{day:90,action:'50% off'},{day:120,action:'vendor notified'},{day:180,action:'write-off'}], cond_new:true, cond_used:true  },
  KW:{ window:7,  cross_border:false, aging:[{day:30,action:'10% off'},{day:60,action:'25% off'},{day:180,action:'write-off'}], cond_new:true, cond_used:false },
  BH:{ window:7,  cross_border:false, aging:[{day:30,action:'10% off'},{day:60,action:'25% off'},{day:180,action:'write-off'}], cond_new:true, cond_used:false },
  QA:{ window:14, cross_border:false, aging:[{day:30,action:'10% off'},{day:60,action:'25% off'},{day:180,action:'write-off'}], cond_new:true, cond_used:false },
  OM:{ window:14, cross_border:false, aging:[{day:30,action:'10% off'},{day:60,action:'25% off'},{day:180,action:'write-off'}], cond_new:true, cond_used:false },
};
const SettingsReturns = defineComponent({ name:'SettingsReturns', setup() {
    const sel = ref('AE');
  const setSel = (v)=>{ sel.value=(typeof v==='function')?v(sel.value):v; };
  const r = RETURN_RULES[sel.value]||RETURN_RULES.AE;
  return () => (
    <div class="zset-content">
      <div class="zset-content-head"><div><div class="zset-content-title">Return Policies</div><div class="zset-content-sub">Market-specific return windows, conditions, and aging escalation rules</div></div></div>
      <div style={__s({display:'flex',gap:6,flexWrap:'wrap',marginBottom:16})}>
        {MARKETS.map(code=><button key={code} onClick={()=>setSel(code)}
          style={__s({height:28,padding:'0 12px',border:'1px solid',borderRadius:'var(--zg-radius-md)',background:'transparent',cursor:'pointer',fontFamily:'inherit',fontSize:12,fontWeight:sel.value===code?700:400,borderColor:sel.value===code?'var(--zg-accent)':'var(--zg-line)',background:sel.value===code?'var(--zg-accent-tint)':'transparent',color:sel.value===code?'var(--zg-accent)':'var(--zg-text-mid)'})}>
          {MARKET_FLAGS[code]} {code}
        </button>)}
      </div>
      <div style={__s({display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16})}>
        <div style={__s({background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',padding:14})}>
          <div style={__s({fontSize:11,fontWeight:700,color:'var(--zg-text-dim)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:10})}>Policy</div>
          <div style={__s({display:'grid',gap:8})}>
            <div style={__s({display:'flex',justifyContent:'space-between',fontSize:12})}><span style={__s({color:'var(--zg-text-mid)'})}>Return window</span><span style={__s({fontFamily:'var(--zg-mono)',fontWeight:700,color:'var(--zg-text)'})}>{r.window} days</span></div>
            <div style={__s({display:'flex',justifyContent:'space-between',fontSize:12})}><span style={__s({color:'var(--zg-text-mid)'})}>Cross-border allowed</span><span style={__s({fontWeight:600,color:r.cross_border?'var(--zg-good)':'var(--zg-danger)'})}>{r.cross_border?'Yes':'No'}</span></div>
            <div style={__s({display:'flex',justifyContent:'space-between',fontSize:12})}><span style={__s({color:'var(--zg-text-mid)'})}>New condition returns</span><span style={__s({fontWeight:600,color:r.cond_new?'var(--zg-good)':'var(--zg-danger)'})}>{r.cond_new?'Accepted':'Rejected'}</span></div>
            <div style={__s({display:'flex',justifyContent:'space-between',fontSize:12})}><span style={__s({color:'var(--zg-text-mid)'})}>Used condition returns</span><span style={__s({fontWeight:600,color:r.cond_used?'var(--zg-good)':'var(--zg-danger)'})}>{r.cond_used?'Accepted':'Rejected'}</span></div>
          </div>
        </div>
        <div style={__s({background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',padding:14})}>
          <div style={__s({fontSize:11,fontWeight:700,color:'var(--zg-text-dim)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:10})}>Aging Escalation</div>
          <div style={__s({display:'flex',flexDirection:'column',gap:6})}>
            {r.aging.map((a,i)=>(
              <div key={i} style={__s({display:'flex',alignItems:'center',gap:8})}>
                <div style={__s({width:48,height:20,borderRadius:3,background:a.day>=180?'oklch(0.70 0.18 25 / 0.15)':a.day>=120?'oklch(0.82 0.15 75 / 0.15)':'var(--zg-panel-hi)',border:'1px solid var(--zg-line)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0})}>
                  <span style={__s({fontFamily:'var(--zg-mono)',fontSize:10.5,fontWeight:700,color:a.day>=180?'var(--zg-danger)':a.day>=120?'var(--zg-warn)':'var(--zg-text-mid)'})}>D{a.day}</span>
                </div>
                <span style={__s({fontSize:11.5,color:'var(--zg-text-mid)'})}>{a.action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={__s({padding:'10px 14px',background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',fontSize:11,color:'var(--zg-text-dim)'})}>
        Return policies are defined per market and enforced automatically. To edit rules, update RULES.md or contact the operations team.
      </div>
    </div>
  );
}});

// ── Access Management ─────────────────────────────────────
const ROLES_DATA = [
  { id:'super_admin',   label:'Super Admin',       perms:['all'],                  users:2  },
  { id:'ops_admin',     label:'Ops Admin',         perms:['orders','warehouse','returns'],   users:3  },
  { id:'finance_admin', label:'Finance Admin',     perms:['finance','payouts','invoices'],   users:2  },
  { id:'cs_agent',      label:'CS Agent',          perms:['tickets','orders_read','customers'], users:4 },
  { id:'merch_manager', label:'Merch Manager',     perms:['products','categories','brands'], users:3  },
  { id:'warehouse_ops', label:'Warehouse Ops',     perms:['warehouse','inventory'],          users:6  },
  { id:'compliance',    label:'Compliance',        perms:['kyc','documents','brands_read'],  users:2  },
  { id:'read_only',     label:'Read Only',         perms:['all_read'],                       users:1  },
];
const USERS_DATA = [
  { id:'u-001', name:'Sara Medhat',    email:'s.medhat@zucci.com',   role:'super_admin',   mfa:true,  status:'active',  last:'2h ago'  },
  { id:'u-002', name:'Ahmed Khalil',   email:'a.khalil@zucci.com',   role:'finance_admin', mfa:true,  status:'active',  last:'1d ago'  },
  { id:'u-003', name:'Omar Hassan',    email:'o.hassan@zucci.com',   role:'warehouse_ops', mfa:false, status:'active',  last:'4h ago'  },
  { id:'u-004', name:'Layla Haddad',   email:'l.haddad@zucci.com',   role:'cs_agent',      mfa:true,  status:'active',  last:'30m ago' },
  { id:'u-005', name:'Khaled Nour',    email:'k.nour@zucci.com',     role:'compliance',    mfa:false, status:'inactive',last:'14d ago' },
  { id:'u-006', name:'Nada Ibrahim',   email:'n.ibrahim@zucci.com',  role:'merch_manager', mfa:true,  status:'active',  last:'6h ago'  },
  { id:'u-007', name:'Tariq Saleh',    email:'t.saleh@zucci.com',    role:'ops_admin',     mfa:true,  status:'active',  last:'3h ago'  },
];
const SettingsAccess = defineComponent({ name:'SettingsAccess', setup() {
    const tab = ref('users');
  const setTab = (v)=>{ tab.value=(typeof v==='function')?v(tab.value):v; };
    const users = reactive(USERS_DATA.map(u=>({...u,markets:['AE','SA','EG','QA','KW','BH','OM']})));
  const setUsers = (f)=>{ const nv=(typeof f==='function')?f(users):f; if(Array.isArray(users)){users.splice(0,users.length,...nv);} else {Object.keys(users).forEach(k=>delete users[k]);Object.assign(users,nv);} };
    const inviteOpen = ref(false);
  const setInviteOpen = (v)=>{ inviteOpen.value=(typeof v==='function')?v(inviteOpen.value):v; };
    const invEmail = ref('');
  const setInvEmail = (v)=>{ invEmail.value=(typeof v==='function')?v(invEmail.value):v; };
    const invRole = ref('cs_agent');
  const setInvRole = (v)=>{ invRole.value=(typeof v==='function')?v(invRole.value):v; };
    const invMarkets = reactive(['AE','SA','EG']);
  const setInvMarkets = (f)=>{ const nv=(typeof f==='function')?f(invMarkets):f; if(Array.isArray(invMarkets)){invMarkets.splice(0,invMarkets.length,...nv);} else {Object.keys(invMarkets).forEach(k=>delete invMarkets[k]);Object.assign(invMarkets,nv);} };
    const editUser = ref(null);
  const setEditUser = (v)=>{ editUser.value=(typeof v==='function')?v(editUser.value):v; };
    const deactivateUser = ref(null);
  const setDeactivateUser = (v)=>{ deactivateUser.value=(typeof v==='function')?v(deactivateUser.value):v; };
    const editRole = ref(null);
  const setEditRole = (v)=>{ editRole.value=(typeof v==='function')?v(editRole.value):v; };
  return () => (
    <div class="zset-content">
      <div class="zset-content-head">
        <div><div class="zset-content-title">Access Management</div><div class="zset-content-sub">Platform users, roles, and permissions</div></div>
        <button class="zwh-btn-primary" onClick={()=>setInviteOpen(true)}>+ Invite User</button>
      </div>
      <div style={__s({display:'flex',gap:0,borderBottom:'1px solid var(--zg-line)',marginBottom:16})}>
        {[['users',`Users (${USERS_DATA.length})`],['roles',`Roles (${ROLES_DATA.length})`]].map(([v,l])=>(
          <button key={v} onClick={()=>setTab(v)} style={__s({height:34,padding:'0 14px',border:'none',background:'transparent',fontFamily:'inherit',fontSize:12.5,cursor:'pointer',color:tab.value===v?'var(--zg-accent)':'var(--zg-text-dim)',borderBottom:tab.value===v?'2px solid var(--zg-accent)':'2px solid transparent',marginBottom:-1,fontWeight:tab.value===v?600:400})}>{l}</button>
        ))}
      </div>
      {tab.value==='users' && (
        <div style={__s({border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',overflow:'hidden'})}>
          <div style={__s({display:'grid',gridTemplateColumns:'1fr 130px 60px 70px 80px 100px',gap:10,padding:'0 14px',height:30,background:'var(--zg-panel-hi)',borderBottom:'1px solid var(--zg-line)',fontSize:'9.5px',textTransform:'uppercase',letterSpacing:'0.07em',color:'var(--zg-text-dim)',fontWeight:600,alignItems:'center'})}>
            <span>User</span><span>Role</span><span>MFA</span><span>Status</span><span>Last Active</span><span>Actions</span>
          </div>
          {USERS_DATA.map(u=>(
            <div key={u.id} style={__s({display:'grid',gridTemplateColumns:'1fr 130px 60px 70px 80px 100px',gap:10,padding:'10px 14px',background:'var(--zg-panel)',borderBottom:'1px solid var(--zg-line-soft,#1c1f24)',alignItems:'center'})}>
              <div><div style={__s({fontWeight:600,fontSize:12.5,color:'var(--zg-text)'})}>{u.name}</div><div style={__s({fontFamily:'var(--zg-mono)',fontSize:10.5,color:'var(--zg-text-dim)'})}>{u.email}</div></div>
              <span style={__s({fontSize:11.5,color:'var(--zg-text-mid)'})}>{ROLES_DATA.find(r=>r.id===u.role)?.label||u.role}</span>
              <span style={__s({fontSize:11,fontWeight:600,color:u.mfa?'var(--zg-good)':'var(--zg-danger)'})}>{u.mfa?'On':'Off'}</span>
              <span style={__s({fontSize:11,fontWeight:600,color:u.status==='active'?'var(--zg-good)':'var(--zg-text-dim)'})}>{u.status}</span>
              <span style={__s({fontSize:11,color:'var(--zg-text-dim)'})}>{u.last}</span>
              <div style={__s({display:'flex',gap:4})}>
                <button class="zcat-act" onClick={()=>setEditUser(u)}>Edit</button>
                <button class="zcat-act danger" onClick={()=>setDeactivateUser(u)}>{u.status==='active'?'Deactivate':'Activate'}</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab.value==='roles' && (
        <div style={__s({display:'grid',gridTemplateColumns:'1fr 1fr',gap:10})}>
          {ROLES_DATA.map(r=>(
            <div key={r.id} style={__s({background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',padding:14})}>
              <div style={__s({display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8})}>
                <span style={__s({fontSize:13,fontWeight:600,color:'var(--zg-text)'})}>{r.label}</span>
                <span style={__s({fontSize:11,color:'var(--zg-text-dim)'})}>{r.users} user{r.users!==1?'s':''}</span>
              </div>
              <div style={__s({display:'flex',gap:4,flexWrap:'wrap'})}>
                {r.perms.map(p=><span key={p} style={__s({height:18,padding:'0 7px',borderRadius:2,background:'var(--zg-panel-hi)',border:'1px solid var(--zg-line)',fontSize:10,fontFamily:'var(--zg-mono)',color:'var(--zg-text-dim)',display:'inline-flex',alignItems:'center'})}>{p}</span>)}
              </div>
              <button class="zcat-act" style={__s({marginTop:8})} onClick={()=>setEditRole(r)}>Edit Permissions</button>
            </div>
          ))}
        </div>
      )}
      {editUser.value && window.EditUserDrawer ? React.createElement(window.EditUserDrawer, {user:editUser.value, onClose:()=>setEditUser(null), onSave:saved=>setUsers(p=>p.map(u=>u.id===saved.id?{...u,...saved}:u))}) : null}
      {deactivateUser.value && window.DeactivateUserModal ? React.createElement(window.DeactivateUserModal, {user:deactivateUser.value, onClose:()=>setDeactivateUser(null), onConfirm:(u,reason)=>setUsers(p=>p.map(x=>x.id===u.id?{...x,status:x.status==='active'?'inactive':'active'}:x))}) : null}
      {editRole.value && window.EditRolePermissionsDrawer ? React.createElement(window.EditRolePermissionsDrawer, {role:editRole.value, onClose:()=>setEditRole(null), onSave:()=>{}}) : null}
      {inviteOpen.value && (
        <div style={__s({position:'fixed',inset:0,zIndex:9999,background:'oklch(0.1 0.01 250 / 0.7)',display:'flex',alignItems:'center',justifyContent:'center'})} onClick={()=>setInviteOpen(false)}>
          <div style={__s({width:440,background:'var(--zg-bg-elev)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-lg)',padding:24,display:'flex',flexDirection:'column',gap:14})} onClick={e=>e.stopPropagation()}>
            <div style={__s({fontSize:15,fontWeight:700,color:'var(--zg-text)'})}>Invite User</div>
            <SField label="Email Address" value={invEmail.value} onChange={setInvEmail} type="email" ph="name@company.com"/>
            <div style={__s({display:'flex',flexDirection:'column',gap:4})}>
              <label style={__s({fontSize:11,fontWeight:600,color:'var(--zg-text-mid)'})}>Role</label>
              <select value={invRole.value} onChange={e=>setInvRole(e.target.value)} style={__s({height:32,padding:'0 10px',background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',fontFamily:'inherit',fontSize:12,color:'var(--zg-text)',outline:'none',cursor:'pointer'})}>
                {ROLES_DATA.map(r=><option key={r.id} value={r.id}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <div style={__s({fontSize:11,fontWeight:600,color:'var(--zg-text-mid)',marginBottom:8})}>Market Access</div>
              <div style={__s({display:'flex',gap:5,flexWrap:'wrap'})}>
                {['AE','SA','EG','KW','BH','QA','OM'].map(m=>{const on=invMarkets.includes(m);return <button key={m} onClick={()=>setInvMarkets(p=>p.includes(m)?p.filter(x=>x!==m):[...p,m])} style={__s({height:24,padding:'0 9px',border:'1px solid',borderRadius:3,cursor:'pointer',fontFamily:'var(--zg-mono)',fontSize:11,fontWeight:700,borderColor:on?'var(--zg-accent)':'var(--zg-line)',background:on?'var(--zg-accent-tint)':'transparent',color:on?'var(--zg-accent)':'var(--zg-text-dim)'})}>{m}</button>;})}
              </div>
            </div>
            <div style={__s({display:'flex',gap:8})}>
              <button class="zwh-btn-primary" disabled={!invEmail.value} style={__s({opacity:invEmail.value?1:0.4})} onClick={()=>{toast.success(`Invite sent to ${invEmail.value}`);setInviteOpen(false);}}>Send Invite</button>
              <button class="zwh-btn-ghost" onClick={()=>setInviteOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}});

// ── Payment Gateways ──────────────────────────────────────
const GATEWAYS = [
  { id:'checkout',  name:'Checkout.com',   env:'production', status:'active',  markets:['AE','SA','EG','QA','KW','BH','OM'], key:'pk_live_••••••••xxxx4821', webhook:'https://api.zucci.com/webhooks/checkout' },
  { id:'tabby',     name:'Tabby (BNPL)',   env:'production', status:'active',  markets:['AE','SA'],                          key:'tabby_pk_••••••••xxx2341', webhook:'https://api.zucci.com/webhooks/tabby' },
  { id:'tamara',    name:'Tamara (BNPL)',  env:'production', status:'active',  markets:['AE','SA'],                          key:'tam_pk_••••••••xxx8821',   webhook:'https://api.zucci.com/webhooks/tamara' },
  { id:'fawry',     name:'Fawry',          env:'production', status:'active',  markets:['EG'],                              key:'fawry_••••••••xxx1122',    webhook:'https://api.zucci.com/webhooks/fawry' },
  { id:'valu',      name:'valU (BNPL)',    env:'sandbox',    status:'pending', markets:['EG'],                              key:'valu_pk_sandbox_••••1234', webhook:'https://api.zucci.com/webhooks/valu' },
  { id:'stc',       name:'STC Pay',        env:'production', status:'active',  markets:['SA'],                              key:'stc_••••••••xxx7731',      webhook:'https://api.zucci.com/webhooks/stc' },
  { id:'knet',      name:'KNET',           env:'sandbox',    status:'pending', markets:['KW'],                              key:'knet_sandbox_••••4422',    webhook:'https://api.zucci.com/webhooks/knet' },
];
const SettingsGateways = defineComponent({ name:'SettingsGateways', setup() {
    const gateways = reactive(GATEWAYS);
  const setGateways = (f)=>{ const nv=(typeof f==='function')?f(gateways):f; if(Array.isArray(gateways)){gateways.splice(0,gateways.length,...nv);} else {Object.keys(gateways).forEach(k=>delete gateways[k]);Object.assign(gateways,nv);} };
    const configGw = ref(null);
  const setConfigGw = (v)=>{ configGw.value=(typeof v==='function')?v(configGw.value):v; };
    const testGw = ref(null);
  const setTestGw = (v)=>{ testGw.value=(typeof v==='function')?v(testGw.value):v; };
    const addOpen = ref(false);
  const setAddOpen = (v)=>{ addOpen.value=(typeof v==='function')?v(addOpen.value):v; };
  return () => (
    <div class="zset-content">
      <div class="zset-content-head"><div><div class="zset-content-title">Payment Gateways</div><div class="zset-content-sub">Per-market payment gateway configuration and API keys</div></div><button class="zwh-btn-primary" onClick={()=>setAddOpen(true)}>+ Add Gateway</button></div>
      <div style={__s({display:'flex',flexDirection:'column',gap:8})}>
        {gateways.map(g=>(
          <div key={g.id} style={__s({background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',padding:'14px 16px',display:'grid',gridTemplateColumns:'180px 1fr 120px 100px 80px',gap:12,alignItems:'center'})}>
            <div>
              <div style={__s({fontSize:13,fontWeight:700,color:'var(--zg-text)'})}>{g.name}</div>
              <span style={__s({fontSize:10,padding:'1px 5px',background:g.env==='production'?'oklch(0.78 0.15 150 / 0.1)':'oklch(0.82 0.15 75 / 0.1)',color:g.env==='production'?'var(--zg-good)':'var(--zg-warn)',borderRadius:2,fontWeight:600,fontFamily:'var(--zg-mono)'})}>{g.env}</span>
            </div>
            <div style={__s({display:'flex',gap:4,flexWrap:'wrap'})}>
              {g.markets.map(m=><span key={m} style={__s({height:18,padding:'0 6px',borderRadius:2,background:'var(--zg-accent-tint)',color:'var(--zg-accent)',fontSize:10,fontFamily:'var(--zg-mono)',fontWeight:700,display:'inline-flex',alignItems:'center'})}>{m}</span>)}
            </div>
            <div style={__s({fontFamily:'var(--zg-mono)',fontSize:11,color:'var(--zg-text-dim)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'})}>{g.key}</div>
            <span style={__s({fontSize:11,fontWeight:600,color:g.status==='active'?'var(--zg-good)':'var(--zg-warn)'})}>{g.status==='active'?'Active':'Pending'}</span>
            <div style={__s({display:'flex',gap:4})}>
              <button class="zcat-act" onClick={()=>setConfigGw(g)}>Config</button>
              <button class="zcat-act" onClick={()=>setTestGw(g)}>Test</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}});

// ── Shipping Providers ────────────────────────────────────
const CARRIERS = [
  { id:'aramex', name:'Aramex',  markets:['AE','SA','EG','QA','KW','BH','OM'], status:'active',  services:['standard','express','same_day'],  cod:true  },
  { id:'dhl',    name:'DHL',     markets:['AE','SA','EG'],                     status:'active',  services:['express','international'],         cod:false },
  { id:'fedex',  name:'FedEx',   markets:['AE','SA'],                          status:'active',  services:['express','ground','international'],cod:false },
  { id:'smsa',   name:'SMSA',    markets:['SA'],                               status:'active',  services:['standard','express'],              cod:true  },
  { id:'bosta',  name:'Bosta',   markets:['EG'],                               status:'active',  services:['standard','same_day'],             cod:true  },
  { id:'j_t',    name:'J&T',     markets:['EG'],                               status:'active',  services:['standard'],                        cod:true  },
  { id:'naqel',  name:'Naqel',   markets:['SA','AE'],                          status:'pending', services:['standard'],                        cod:true  },
];
const SettingsShipping = defineComponent({ name:'SettingsShipping', setup() {
    const carriers = reactive(CARRIERS);
  const setCarriers = (f)=>{ const nv=(typeof f==='function')?f(carriers):f; if(Array.isArray(carriers)){carriers.splice(0,carriers.length,...nv);} else {Object.keys(carriers).forEach(k=>delete carriers[k]);Object.assign(carriers,nv);} };
    const configC = ref(null);
  const setConfigC = (v)=>{ configC.value=(typeof v==='function')?v(configC.value):v; };
    const addCOpen = ref(false);
  const setAddCOpen = (v)=>{ addCOpen.value=(typeof v==='function')?v(addCOpen.value):v; };
  return () => (
    <div class="zset-content">
      <div class="zset-content-head"><div><div class="zset-content-title">Shipping Providers</div><div class="zset-content-sub">Carriers per market, service types, and COD availability</div></div><button class="zwh-btn-primary" onClick={()=>setAddCOpen(true)}>+ Add Carrier</button></div>
      <div style={__s({display:'flex',flexDirection:'column',gap:8})}>
        {carriers.map(c=>(
          <div key={c.id} style={__s({background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',padding:'12px 16px',display:'grid',gridTemplateColumns:'120px 1fr 1fr 50px 80px',gap:12,alignItems:'center'})}>
            <div style={__s({fontSize:13,fontWeight:700,color:'var(--zg-text)'})}>{c.name}</div>
            <div style={__s({display:'flex',gap:4,flexWrap:'wrap'})}>
              {c.markets.map(m=><span key={m} style={__s({height:18,padding:'0 6px',borderRadius:2,background:'var(--zg-accent-tint)',color:'var(--zg-accent)',fontSize:10,fontFamily:'var(--zg-mono)',fontWeight:700,display:'inline-flex',alignItems:'center'})}>{m}</span>)}
            </div>
            <div style={__s({display:'flex',gap:4,flexWrap:'wrap'})}>
              {c.services.map(s=><span key={s} style={__s({height:18,padding:'0 6px',borderRadius:2,background:'var(--zg-panel-hi)',border:'1px solid var(--zg-line)',fontSize:10,fontFamily:'var(--zg-mono)',color:'var(--zg-text-dim)',display:'inline-flex',alignItems:'center'})}>{s}</span>)}
            </div>
            <span style={__s({fontSize:11,fontWeight:600,color:c.cod?'var(--zg-good)':'var(--zg-text-dim)'})}>{c.cod?'COD':'—'}</span>
            <div style={__s({display:'flex',gap:4})}>
              <button class="zcat-act" onClick={()=>setConfigC(c)}>Config</button>
              <span style={__s({fontSize:11,fontWeight:600,color:c.status==='active'?'var(--zg-good)':'var(--zg-warn)',marginLeft:2})}>{c.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}});

// ── Tax & VAT ─────────────────────────────────────────────
const SettingsTax = defineComponent({ name:'SettingsTax', setup() {
    const sel = ref('AE');
  const setSel = (v)=>{ sel.value=(typeof v==='function')?v(sel.value):v; };
  const taxes = { AE:{vat:5,reg:'100234567800003',threshold:375000,filing:'quarterly',inc:true}, SA:{vat:15,reg:'310234567800003',threshold:375000,filing:'monthly',inc:true}, EG:{vat:14,reg:'234567891',threshold:0,filing:'monthly',inc:true}, KW:{vat:0,reg:'',threshold:0,filing:'n/a',inc:false}, BH:{vat:10,reg:'',threshold:0,filing:'quarterly',inc:false}, QA:{vat:0,reg:'',threshold:0,filing:'n/a',inc:false}, OM:{vat:5,reg:'',threshold:0,filing:'quarterly',inc:false} };
  const t = taxes[sel.value]||taxes.AE;
  return () => (
    <div class="zset-content">
      <div class="zset-content-head"><div><div class="zset-content-title">Tax & VAT</div><div class="zset-content-sub">VAT rates, registration numbers, and filing schedules per market</div></div></div>
      <div style={__s({display:'flex',gap:6,flexWrap:'wrap',marginBottom:16})}>
        {MARKETS.map(code=><button key={code} onClick={()=>setSel(code)} style={__s({height:28,padding:'0 12px',border:'1px solid',borderRadius:'var(--zg-radius-md)',background:'transparent',cursor:'pointer',fontFamily:'inherit',fontSize:12,fontWeight:sel.value===code?700:400,borderColor:sel.value===code?'var(--zg-accent)':'var(--zg-line)',background:sel.value===code?'var(--zg-accent-tint)':'transparent',color:sel.value===code?'var(--zg-accent)':'var(--zg-text-mid)'})}>{MARKET_FLAGS[code]} {code}</button>)}
      </div>
      <div style={__s({display:'grid',gridTemplateColumns:'1fr 1fr',gap:12})}>
        {[['VAT Rate',t.vat+'%','var(--zg-accent)'],['VAT Registration',t.reg||'Not registered',''],['Filing Frequency',t.filing,''],['Registration Threshold',t.threshold?'AED '+t.threshold.toLocaleString():'None','']].map(([l,v,c])=>(
          <div key={l} style={__s({background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',padding:14})}>
            <div style={__s({fontSize:10.5,color:'var(--zg-text-dim)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4})}>{l}</div>
            <div style={__s({fontSize:16,fontWeight:700,fontFamily:'var(--zg-mono)',color:c||'var(--zg-text)'})}>{v}</div>
          </div>
        ))}
        <div style={__s({gridColumn:'1 / -1',background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',padding:14})}>
          <SToggle label="VAT Included in Display Prices" sub="Show prices inclusive of VAT on storefront" value={t.inc} onChange={()=>toast.success('Tax display setting updated')}/>
        </div>
      </div>
    </div>
  );
}});

// ── Appearance / Branding ─────────────────────────────────
const SettingsBranding = defineComponent({ name:'SettingsBranding', setup() {
    const v = reactive({ primary:'#b5f23d', secondary:'#1a1e24', font:'system', radius:'medium', density:'comfortable' });
  const setV = (f)=>{ const nv=(typeof f==='function')?f(v):f; if(Array.isArray(v)){v.splice(0,v.length,...nv);} else {Object.keys(v).forEach(k=>delete v[k]);Object.assign(v,nv);} };
  const u = (k,val) => setV(p=>({...p,[k]:val}));
  return () => (
    <div class="zset-content">
      <div class="zset-content-head"><div><div class="zset-content-title">Appearance</div><div class="zset-content-sub">Brand colours, typography, and UI density</div></div><button class="zwh-btn-primary" onClick={()=>toast.success('Appearance saved')}>Save</button></div>
      <div style={__s({display:'grid',gridTemplateColumns:'1fr 1fr',gap:14})}>
        {[['primary','Brand Colour (Primary)','#b5f23d'],['secondary','Brand Colour (Dark)','#1a1e24']].map(([k,l,def])=>(
          <div key={k} style={__s({display:'flex',flexDirection:'column',gap:6})}>
            <label style={__s({fontSize:11,fontWeight:600,color:'var(--zg-text-mid)'})}>{l}</label>
            <div style={__s({display:'flex',alignItems:'center',gap:8})}>
              <input type="color" value={v[k]} onChange={e=>u(k,e.target.value)} style={__s({width:36,height:32,border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',cursor:'pointer',background:'transparent',padding:2})}/>
              <input value={v[k]} onChange={e=>u(k,e.target.value)} style={__s({flex:1,height:32,padding:'0 10px',background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',fontFamily:'var(--zg-mono)',fontSize:12,color:'var(--zg-text)',outline:'none'})}/>
            </div>
          </div>
        ))}
        <div style={__s({display:'flex',flexDirection:'column',gap:5})}>
          <label style={__s({fontSize:11,fontWeight:600,color:'var(--zg-text-mid)'})}>Admin Font</label>
          <select value={v.font} onChange={e=>u('font',e.target.value)} style={__s({height:32,padding:'0 10px',background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',fontFamily:'inherit',fontSize:12,color:'var(--zg-text)',outline:'none',cursor:'pointer'})}>
            {['system','IBM Plex Sans','Geist','Sora','Plus Jakarta Sans'].map(f=><option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div style={__s({display:'flex',flexDirection:'column',gap:5})}>
          <label style={__s({fontSize:11,fontWeight:600,color:'var(--zg-text-mid)'})}>UI Density</label>
          <select value={v.density} onChange={e=>u('density',e.target.value)} style={__s({height:32,padding:'0 10px',background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',fontFamily:'inherit',fontSize:12,color:'var(--zg-text)',outline:'none',cursor:'pointer'})}>
            {['compact','comfortable','spacious'].map(d=><option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div style={__s({gridColumn:'1 / -1'})}>
          <div style={__s({fontSize:11,fontWeight:600,color:'var(--zg-text-mid)',marginBottom:8})}>Logo Upload</div>
          <div style={__s({display:'grid',gridTemplateColumns:'1fr 1fr',gap:10})}>
            {['Logo (Light BG)', 'Logo (Dark BG)', 'Favicon', 'App Icon'].map(l=>(
              <label key={l} style={__s({height:60,border:'1px dashed var(--zg-line)',borderRadius:'var(--zg-radius-md)',display:'flex',alignItems:'center',justifyContent:'center',gap:8,cursor:'pointer',background:'var(--zg-panel)',fontSize:12,color:'var(--zg-text-dim)',transition:'border-color .12s'})}
                onMouseEnter={e=>e.currentTarget.style.borderColor='var(--zg-accent)'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='var(--zg-line)'}>
                <input type="file" accept="image/*" style={__s({display:'none'})} onChange={e=>{const f=e.target.files?.[0];if(f)toast.success(l+' uploaded: '+f.name);}}/>
                <svg viewBox="0 0 14 14" width="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M7 1v8M4 6l3-3 3 3M2 12h10"/></svg> {l}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}});

// ── API Keys & Webhooks ───────────────────────────────────
const API_KEYS = [
  { id:'k1', name:'Production API Key', key:'zuc_live_••••••••••••••••••xxxx8821', created:'2024-01-15', last:'2h ago', scope:'full_access' },
  { id:'k2', name:'Analytics Read Key', key:'zuc_live_••••••••••••••••••xxxx3301', created:'2024-03-01', last:'12h ago', scope:'read_only' },
  { id:'k3', name:'Webhook Signing Key',key:'whsk_••••••••••••••••••••••xxxx1122', created:'2024-01-15', last:'—', scope:'webhooks' },
];
const WEBHOOKS = [
  { id:'w1', url:'https://erp.partner.com/zucci-orders',    events:['order.created','order.shipped','order.delivered'], status:'active',  last:'3m ago',   failures:0 },
  { id:'w2', url:'https://analytics.zucci.com/events',       events:['product.created','order.created','return.created'],status:'active',  last:'1m ago',   failures:0 },
  { id:'w3', url:'https://finance.partner.com/webhooks',     events:['payout.sent','invoice.created'],                  status:'active',  last:'2h ago',   failures:0 },
  { id:'w4', url:'https://legacy.zucci.com/sync',            events:['inventory.updated'],                              status:'failing', last:'4h ago',   failures:12 },
];
const SettingsAPI = defineComponent({ name:'SettingsAPI', setup() {
    const keys = reactive(API_KEYS);
  const setKeys = (f)=>{ const nv=(typeof f==='function')?f(keys):f; if(Array.isArray(keys)){keys.splice(0,keys.length,...nv);} else {Object.keys(keys).forEach(k=>delete keys[k]);Object.assign(keys,nv);} };
    const hooks = reactive(WEBHOOKS);
  const setHooks = (f)=>{ const nv=(typeof f==='function')?f(hooks):f; if(Array.isArray(hooks)){hooks.splice(0,hooks.length,...nv);} else {Object.keys(hooks).forEach(k=>delete hooks[k]);Object.assign(hooks,nv);} };
    const genOpen = ref(false);
  const setGenOpen = (v)=>{ genOpen.value=(typeof v==='function')?v(genOpen.value):v; };
    const revokeKey = ref(null);
  const setRevokeKey = (v)=>{ revokeKey.value=(typeof v==='function')?v(revokeKey.value):v; };
    const editHook = ref(null);
  const setEditHook = (v)=>{ editHook.value=(typeof v==='function')?v(editHook.value):v; };
    const addHook = ref(false);
  const setAddHook = (v)=>{ addHook.value=(typeof v==='function')?v(addHook.value):v; };
  return () => (
    <div class="zset-content">
      <div class="zset-content-head"><div><div class="zset-content-title">API Keys & Webhooks</div><div class="zset-content-sub">Manage API credentials and outbound webhook endpoints</div></div><button class="zwh-btn-primary" onClick={()=>setGenOpen(true)}>+ New Key</button></div>
      <div style={__s({marginBottom:20})}>
        <div style={__s({fontSize:11,fontWeight:700,color:'var(--zg-text-dim)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:10})}>API Keys</div>
        <div style={__s({display:'flex',flexDirection:'column',gap:6})}>
          {keys.map(k=>(
            <div key={k.id} style={__s({background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',padding:'12px 14px',display:'grid',gridTemplateColumns:'180px 1fr 80px 80px 80px',gap:10,alignItems:'center'})}>
              <div style={__s({fontWeight:600,fontSize:12.5,color:'var(--zg-text)'})}>{k.name}</div>
              <div style={__s({fontFamily:'var(--zg-mono)',fontSize:11,color:'var(--zg-text-dim)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'})}>{k.key}</div>
              <span style={__s({fontSize:10,padding:'2px 6px',borderRadius:2,background:'var(--zg-panel-hi)',border:'1px solid var(--zg-line)',color:'var(--zg-text-dim)',fontFamily:'var(--zg-mono)'})}>{k.scope}</span>
              <span style={__s({fontSize:11,color:'var(--zg-text-dim)'})}>Used {k.last}</span>
              <div style={__s({display:'flex',gap:4})}>
                <button class="zcat-act" onClick={()=>{navigator.clipboard?.writeText(k.key);toast.success('Copied!');}}>Copy</button>
                <button class="zcat-act danger" onClick={()=>setRevokeKey(k)}>Revoke</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={__s({display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10})}>
          <div style={__s({fontSize:11,fontWeight:700,color:'var(--zg-text-dim)',textTransform:'uppercase',letterSpacing:'0.07em'})}>Webhooks</div>
          <button class="zwh-btn-ghost" style={__s({height:26,fontSize:11})} onClick={()=>setAddHook(true)}>+ Add Endpoint</button>
        </div>
        <div style={__s({display:'flex',flexDirection:'column',gap:6})}>
          {hooks.map(w=>(
            <div key={w.id} style={__s({background:'var(--zg-panel)',border:'1px solid '+(w.status==='failing'?'oklch(0.70 0.18 25 / 0.4)':'var(--zg-line)'),borderRadius:'var(--zg-radius-md)',padding:'12px 14px'})}>
              <div style={__s({display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6})}>
                <span style={__s({fontFamily:'var(--zg-mono)',fontSize:11.5,color:'var(--zg-text)',fontWeight:500})}>{w.url}</span>
                <div style={__s({display:'flex',alignItems:'center',gap:8})}>
                  {w.failures>0&&<span style={__s({fontSize:10.5,fontWeight:700,color:'var(--zg-danger)'})}>{w.failures} failures</span>}
                  <span style={__s({fontSize:11,fontWeight:600,color:w.status==='active'?'var(--zg-good)':'var(--zg-danger)'})}>{w.status}</span>
                  <button class="zcat-act" onClick={()=>setEditHook(w)}>Edit</button>
                </div>
              </div>
              <div style={__s({display:'flex',gap:4,flexWrap:'wrap'})}>
                {w.events.map(e=><span key={e} style={__s({height:17,padding:'0 6px',borderRadius:2,background:'var(--zg-panel-hi)',border:'1px solid var(--zg-line)',fontSize:10,fontFamily:'var(--zg-mono)',color:'var(--zg-text-dim)',display:'inline-flex',alignItems:'center'})}>{e}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
      {genOpen.value   && window.GenerateAPIKeyModal ? React.createElement(window.GenerateAPIKeyModal, {onClose:()=>setGenOpen(false), onSave:k=>setKeys(p=>[...p,k])}) : null}
      {revokeKey.value && window.RevokeKeyModal      ? React.createElement(window.RevokeKeyModal,      {apiKey:revokeKey.value, onClose:()=>setRevokeKey(null), onRevoke:id=>setKeys(p=>p.filter(k=>k.id!==id))}) : null}
      {addHook.value   && window.WebhookModal        ? React.createElement(window.WebhookModal,        {onClose:()=>setAddHook(false), onSave:h=>setHooks(p=>[...p,{...h,id:'w'+Date.now(),status:'active',last:'—',failures:0}])}) : null}
      {editHook.value  && window.WebhookModal        ? React.createElement(window.WebhookModal,        {webhook:editHook.value, onClose:()=>setEditHook(null), onSave:h=>setHooks(p=>p.map(w=>w.id===h.id?{...w,...h}:w))}) : null}
    </div>
  );
}});

// ── Audit Log ─────────────────────────────────────────────
const AUDIT_ENTRIES = [
  { id:'a1', user:'Sara Medhat',   action:'Updated market settings',   module:'Settings › Markets',    time:'2m ago',   ip:'82.163.x.x'  },
  { id:'a2', user:'Ahmed Khalil',  action:'Exported finance report',   module:'Finance',               time:'18m ago',  ip:'82.163.x.x'  },
  { id:'a3', user:'Omar Hassan',   action:'Confirmed inbound PO-4821', module:'Warehouse › Receiving', time:'1h ago',   ip:'212.1.x.x'   },
  { id:'a4', user:'Layla Haddad',  action:'Resolved ticket TKT-4820',  module:'Tickets',               time:'2h ago',   ip:'104.21.x.x'  },
  { id:'a5', user:'Nada Ibrahim',  action:'Created variant rule',      module:'Products › Variants',   time:'3h ago',   ip:'82.163.x.x'  },
  { id:'a6', user:'System',        action:'Automated write-off run',   module:'Warehouse › Aging',     time:'6h ago',   ip:'—'           },
  { id:'a7', user:'Tariq Saleh',   action:'Approved vendor listing',   module:'Marketplace › Listings',time:'8h ago',   ip:'195.229.x.x' },
  { id:'a8', user:'Sara Medhat',   action:'Invited user k.nour@zucci', module:'Settings › Access',     time:'1d ago',   ip:'82.163.x.x'  },
  { id:'a9', user:'Ahmed Khalil',  action:'Changed payment gateway',   module:'Settings › Gateways',   time:'2d ago',   ip:'82.163.x.x'  },
  { id:'a10',user:'Omar Hassan',   action:'Updated bin locations',     module:'Warehouse › Detail',    time:'3d ago',   ip:'212.1.x.x'   },
];
const SettingsAudit = defineComponent({ name:'SettingsAudit', setup() {
    const search = ref('');
  const setSearch = (v)=>{ search.value=(typeof v==='function')?v(search.value):v; };
    const page = ref(0);
  const setPage = (v)=>{ page.value=(typeof v==='function')?v(page.value):v; };
    const detail = ref(null);
  const setDetail = (v)=>{ detail.value=(typeof v==='function')?v(detail.value):v; };
  const PAGE_SIZE = 8;
  const q = search.value.toLowerCase();
  const filtered = AUDIT_ENTRIES.filter(a=>!q||a.user.toLowerCase().includes(q)||a.action.toLowerCase().includes(q)||a.module.toLowerCase().includes(q));
  const paginated = filtered.slice(page.value*PAGE_SIZE,(page.value+1)*PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length/PAGE_SIZE);
  return () => (
    <div class="zset-content">
      <div class="zset-content-head"><div><div class="zset-content-title">Audit Log</div><div class="zset-content-sub">All admin actions with user, timestamp, and IP address</div></div><button class="zwh-btn-ghost" onClick={()=>{
          const rows = [['User','Action','Module','IP','Time'],...AUDIT_ENTRIES.map(a=>[a.user,a.action,a.module,a.ip,a.time])];
          const csv  = rows.map(r=>r.join(',')).join('\n');
          const blob = new Blob([csv],{type:'text/csv'});
          const a    = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='audit-log.csv'; a.click();
          toast.success('Audit log exported');
        }}>Export CSV</button></div>
      <div style={__s({position:'relative',marginBottom:12})}>
        <svg viewBox="0 0 14 14" width="12" fill="none" stroke="var(--zg-text-dim)" stroke-width="1.5" stroke-linecap="round" style={__s({position:'absolute',left:8,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'})}><circle cx="5.5" cy="5.5" r="4"/><path d="M9.5 9.5l3 3"/></svg>
        <input value={search.value} onChange={e=>setSearch(e.target.value)} placeholder="Search by user, action, or module…" style={__s({width:'100%',height:30,paddingLeft:26,paddingRight:10,background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',fontFamily:'inherit',fontSize:12,color:'var(--zg-text)',outline:'none',boxSizing:'border-box'})}/>
      </div>
      <div style={__s({border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',overflow:'hidden'})}>
        {paginated.map((a,i)=>(
          <div key={a.id} onClick={()=>setDetail(detail.value?.id===a.id?null:a)} style={__s({display:'grid',gridTemplateColumns:'130px 1fr 160px 80px 80px',gap:10,padding:'9px 14px',background:detail.value?.id===a.id?'var(--zg-panel-hi)':i%2===0?'var(--zg-panel)':'var(--zg-bg)',borderBottom:'1px solid var(--zg-line-soft,#1c1f24)',alignItems:'center',fontSize:12,cursor:'pointer'})}>
            <span style={__s({fontWeight:600,color:'var(--zg-text)'})}>{a.user}</span>
            <span style={__s({color:'var(--zg-text-mid)'})}>{a.action}</span>
            <span style={__s({fontFamily:'var(--zg-mono)',fontSize:10.5,color:'var(--zg-text-dim)'})}>{a.module}</span>
            <span style={__s({fontFamily:'var(--zg-mono)',fontSize:10.5,color:'var(--zg-text-xdim)'})}>{a.ip}</span>
            <span style={__s({fontSize:10.5,color:'var(--zg-text-dim)'})}>{a.time}</span>
          </div>
        ))}
      </div>
      <div style={__s({display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 14px',borderTop:'1px solid var(--zg-line)',fontSize:11,color:'var(--zg-text-dim)'})}>
        <span>{filtered.length} entries</span>
        <div style={__s({display:'flex',gap:4})}>
          <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page.value===0} style={__s({height:24,padding:'0 10px',border:'1px solid var(--zg-line)',borderRadius:3,background:'transparent',cursor:'pointer',color:'var(--zg-text-dim)',fontSize:11,opacity:page.value===0?0.3:1})}>←</button>
          <span style={__s({padding:'0 8px',lineHeight:'24px'})}>Page {page.value+1} of {totalPages||1}</span>
          <button onClick={()=>setPage(p=>Math.min(totalPages-1,p+1))} disabled={page.value>=totalPages-1} style={__s({height:24,padding:'0 10px',border:'1px solid var(--zg-line)',borderRadius:3,background:'transparent',cursor:'pointer',color:'var(--zg-text-dim)',fontSize:11,opacity:page.value>=totalPages-1?0.3:1})}>→</button>
        </div>
      </div>
      {detail.value && window.AuditDetailPanel && React.createElement(window.AuditDetailPanel, {entry:detail.value, onClose:()=>setDetail(null)})}
    </div>
  );
}});

// ── Feature Flags ─────────────────────────────────────────
const FLAGS_DATA = [
  { id:'fit_finder',      label:'Size Picker / Fit Finder',     desc:'Customer-facing size recommendation widget', global:true, markets:{AE:true,SA:true,EG:true,KW:false,BH:false,QA:true,OM:false} },
  { id:'bnpl',            label:'Buy Now Pay Later',            desc:'Tabby / Tamara payment options',             global:true, markets:{AE:true,SA:true,EG:false,KW:false,BH:false,QA:false,OM:false} },
  { id:'b2b',             label:'B2B / Wholesale Portal',       desc:'Corporate bulk ordering channel',            global:true, markets:{AE:true,SA:true,EG:false,KW:false,BH:false,QA:false,OM:false} },
  { id:'dark_store',      label:'Dark Store Fulfillment',       desc:'Same-day last-mile from dark stores',        global:true, markets:{AE:true,SA:false,EG:false,KW:false,BH:false,QA:false,OM:false} },
  { id:'loyalty',         label:'Loyalty & Rewards Program',    desc:'Points, tiers, referrals',                  global:true, markets:{AE:true,SA:true,EG:true,KW:false,BH:false,QA:false,OM:false} },
  { id:'ai_search',       label:'AI-Powered Search',            desc:'Semantic search across listings',            global:false, markets:{AE:false,SA:false,EG:false,KW:false,BH:false,QA:false,OM:false} },
  { id:'marketplace_b2b', label:'Marketplace B2B Channel',      desc:'Vendors selling to businesses direct',       global:false, markets:{AE:false,SA:false,EG:false,KW:false,BH:false,QA:false,OM:false} },
  { id:'live_commerce',   label:'Live Commerce / Stream',       desc:'Live video shopping',                        global:false, markets:{AE:false,SA:false,EG:false,KW:false,BH:false,QA:false,OM:false} },
];
const SettingsFlags = defineComponent({ name:'SettingsFlags', setup() {
    const flags = reactive((()=>FLAGS_DATA.map(f=>({...f,markets:{...f.markets}})))());
  const setFlags = (f)=>{ const nv=(typeof f==='function')?f(flags):f; if(Array.isArray(flags)){flags.splice(0,flags.length,...nv);} else {Object.keys(flags).forEach(k=>delete flags[k]);Object.assign(flags,nv);} };
  const toggle = (id,mkt) => setFlags(p=>p.map(f=>f.id===id ? (mkt ? {...f,markets:{...f.markets,[mkt]:!f.markets[mkt]}} : {...f,global:!f.global}) : f));
  return () => (
    <div class="zset-content">
      <div class="zset-content-head"><div><div class="zset-content-title">Feature Flags</div><div class="zset-content-sub">Enable or disable features globally or per market</div></div></div>
      <div style={__s({display:'flex',flexDirection:'column',gap:6})}>
        {flags.map(f=>(
          <div key={f.id} style={__s({background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',padding:'12px 16px'})}>
            <div style={__s({display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8})}>
              <div>
                <div style={__s({fontSize:13,fontWeight:600,color:'var(--zg-text)'})}>{f.label}</div>
                <div style={__s({fontSize:11,color:'var(--zg-text-dim)',marginTop:1})}>{f.desc}</div>
              </div>
              <div style={__s({display:'flex',alignItems:'center',gap:8})}>
                <span style={__s({fontSize:11,color:'var(--zg-text-dim)'})}>Global</span>
                <button onClick={()=>toggle(f.id,null)} style={__s({width:36,height:20,borderRadius:10,border:'none',cursor:'pointer',background:f.global?'var(--zg-accent)':'var(--zg-line)',position:'relative',flexShrink:0,transition:'background .14s'})}>
                  <div style={__s({width:14,height:14,borderRadius:'50%',background:'#fff',position:'absolute',top:3,left:f.global?18:3,transition:'left .14s'})}/>
                </button>
              </div>
            </div>
            <div style={__s({display:'flex',gap:6,flexWrap:'wrap'})}>
              {MARKETS.map(m=>(
                <button key={m} onClick={()=>toggle(f.id,m)}
                  style={__s({height:22,padding:'0 8px',borderRadius:3,border:'1px solid',cursor:'pointer',fontSize:10.5,fontFamily:'var(--zg-mono)',fontWeight:600,transition:'all .12s',
                    borderColor:f.markets[m]?'var(--zg-accent)':'var(--zg-line)',background:f.markets[m]?'var(--zg-accent-tint)':'transparent',color:f.markets[m]?'var(--zg-accent)':'var(--zg-text-xdim)'})}>
                  {m}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}});

// ── Shell ─────────────────────────────────────────────────


const ZucciSettings = defineComponent({
  name:'ZucciSettings',
  setup(){
    const sec = ref('company');
    const Placeholder = (label)=>(<div style={__s({padding:32,color:'var(--zg-text-dim)',fontSize:13})}>{label} module — managed separately.</div>);
    const VIEWS = {
      company:<SettingsCompany/>, markets:<SettingsMarkets/>, returns:<SettingsReturns/>,
      access:<SettingsAccess/>, gateways:<SettingsGateways/>, shipping:<SettingsShipping/>,
      tax:<SettingsTax/>, branding:<SettingsBranding/>, api:<SettingsAPI/>,
      audit:<SettingsAudit/>, flags:<SettingsFlags/>,
      tiers:Placeholder('Membership Tiers'), roles:Placeholder('Roles & Permissions'),
    };
    return () => (
      <div style={__s({display:'flex',minHeight:'calc(100vh - 60px)',background:'var(--zg-bg)'})}>
        <div style={__s({width:'240px',flex:'0 0 240px',background:'var(--zg-bg-elev)',borderRight:'1px solid var(--zg-line)',display:'flex',flexDirection:'column'})}>
          <div style={__s({padding:'18px 18px 12px',borderBottom:'1px solid var(--zg-line)'})}>
            <div style={__s({fontSize:15,fontWeight:800,color:'var(--zg-text)'})}>Settings</div>
            <div style={__s({fontSize:11,color:'var(--zg-text-dim)',marginTop:2})}>Global configuration</div>
          </div>
          <nav style={__s({flex:1,overflowY:'auto',padding:'8px 0'})}>
            {SETTINGS_GROUPS.map(g=>(
              <div key={g.group}>
                <div style={__s({padding:'12px 18px 4px',fontSize:10,fontWeight:700,letterSpacing:'0.5px',textTransform:'uppercase',color:'var(--zg-text-dim)'})}>{g.group}</div>
                {g.sections.map(it=>(
                  <button key={it.id} onClick={()=>{sec.value=it.id;}}
                    style={__s({width:'100%',height:34,padding:it.indent?'0 18px 0 34px':'0 18px',border:'none',background:sec.value===it.id?'var(--zg-panel)':'transparent',cursor:'pointer',fontFamily:'inherit',fontSize:12.5,fontWeight:sec.value===it.id?600:400,color:sec.value===it.id?'var(--zg-text)':'var(--zg-text-mid)',borderLeft:sec.value===it.id?'2px solid var(--zg-accent)':'2px solid transparent',textAlign:'left',display:'flex',alignItems:'center',gap:9})}>
                    <SIcon name={it.icon} size={14}/>{it.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </div>
        <div style={__s({flex:1,overflowY:'auto'})}>
          {VIEWS[sec.value] || null}
        </div>
      </div>
    );
  }
});

export default ZucciSettings;

</script>