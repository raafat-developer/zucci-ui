<script lang="tsx">
import { defineComponent, ref, reactive } from 'vue'

const toast = { success(){}, warn(){}, info(){} };

const __UNITLESS = {zIndex:1,zoom:1,opacity:1,fontWeight:1,lineHeight:1,flex:1,flexGrow:1,flexShrink:1,flexBasis:0,order:1,gridColumn:1,gridRow:1,gridRowStart:1,gridColumnStart:1,columns:1,fillOpacity:1,strokeOpacity:1,strokeWidth:1,scale:1,animationIterationCount:1,aspectRatio:1,WebkitLineClamp:1};
function __s(o){ if(!o||typeof o!=='object'||Array.isArray(o)) return o; const r={}; for(const k in o){ const v=o[k]; r[k]=(typeof v==='number' && !__UNITLESS[k])? v+'px' : v; } return r; }


const UP_SECTIONS = [
  { id:'profile',     label:'Profile'                },
  { id:'security',    label:'Security'               },
  { id:'devices',     label:'Devices & Sessions'     },
  { id:'activity',    label:'Activity Log'           },
  { id:'notif_prefs', label:'Notification Prefs'     },
  { id:'appearance',  label:'Appearance'             },
  { id:'help',        label:'Help & Documentation'   },
];

function UPField({ label, value, onChange, type='text', mono, ph, disabled }) {
  return (
    <div style={__s({display:'flex',flexDirection:'column',gap:4})}>
      <label style={__s({fontSize:11,fontWeight:600,color:'var(--zg-text-mid)'})}>{label}</label>
      <input type={type} value={value||''} onChange={e=>onChange&&onChange(e.target.value)} placeholder={ph}
        disabled={disabled}
        style={__s({height:32,padding:'0 10px',background:disabled?'var(--zg-panel-hi)':'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',fontFamily:mono?'var(--zg-mono)':'var(--zg-sans)',fontSize:12,color:'var(--zg-text)',outline:'none',opacity:disabled?0.6:1})}/>
    </div>
  );
}
function UPToggle({ label, sub, value, onChange }) {
  return (
    <div style={__s({display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,padding:'11px 0',borderBottom:'1px solid var(--zg-line-soft,#1c1f24)'})}>
      <div><div style={__s({fontSize:12.5,fontWeight:500,color:'var(--zg-text)'})}>{label}</div>{sub&&<div style={__s({fontSize:11,color:'var(--zg-text-dim)',marginTop:1})}>{sub}</div>}</div>
      <button onClick={()=>onChange&&onChange(!value)} style={__s({width:36,height:20,borderRadius:10,border:'none',cursor:'pointer',background:value?'var(--zg-accent)':'var(--zg-line)',position:'relative',flexShrink:0,transition:'background .14s'})}>
        <div style={__s({width:14,height:14,borderRadius:'50%',background:'#fff',position:'absolute',top:3,left:value?18:3,transition:'left .14s'})}/>
      </button>
    </div>
  );
}

function UPAvatar({ name, size=56 }) {
  const initials = name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
  return (
    <div style={__s({width:size,height:size,borderRadius:'50%',background:'var(--zg-accent)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:size*0.3,fontWeight:800,color:'oklch(0.18 0.04 130)',letterSpacing:'-0.02em'})}>
      {initials}
    </div>
  );
}

// ── Profile ───────────────────────────────────────────────
const UPProfile = defineComponent({ name:'UPProfile', setup() {
    const v = reactive({ first:'Sara', last:'Medhat', email:'s.medhat@zucci.com', phone:'+971 50 123 4567', role:'Super Admin', dept:'Operations', bio:'', timezone:'Asia/Dubai', lang:'en' });
  const setV = (f)=>{ const nv=(typeof f==='function')?f(v):f; if(Array.isArray(v)){v.splice(0,v.length,...nv);} else {Object.keys(v).forEach(k=>delete v[k]);Object.assign(v,nv);} };
  const u = (k,val) => setV(p=>({...p,[k]:val}));
  const name = `${v.first} ${v.last}`;
  return () => (
    <div style={__s({maxWidth:640})}>
      <div style={__s({fontSize:18,fontWeight:700,color:'var(--zg-text)',marginBottom:4})}>Profile</div>
      <div style={__s({fontSize:12,color:'var(--zg-text-dim)',marginBottom:24})}>Manage your personal information and contact details</div>
      <div style={__s({display:'flex',alignItems:'center',gap:16,marginBottom:24,padding:16,background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)'})}>
        <UPAvatar name={name} size={64}/>
        <div style={__s({flex:1})}>
          <div style={__s({fontSize:16,fontWeight:700,color:'var(--zg-text)'})}>{name}</div>
          <div style={__s({fontSize:12,color:'var(--zg-text-dim)',marginTop:2})}>{v.role} · {v.dept}</div>
          <div style={__s({fontSize:11.5,fontFamily:'var(--zg-mono)',color:'var(--zg-text-dim)',marginTop:2})}>{v.email}</div>
        </div>
        <label style={__s({height:30,padding:'0 12px',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',background:'transparent',fontFamily:'inherit',fontSize:11.5,cursor:'pointer',color:'var(--zg-text-mid)',display:'flex',alignItems:'center'})}>
          <input type="file" accept="image/*" style={__s({display:'none'})} onChange={e=>{const f=e.target.files?.[0];if(f){const url=URL.createObjectURL(f);toast.success('Photo updated: '+f.name);}}}/>
          Change Photo
        </label>
      </div>
      <div style={__s({display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16})}>
        <UPField label="First Name" value={v.first} onChange={val=>u('first',val)}/>
        <UPField label="Last Name"  value={v.last}  onChange={val=>u('last',val)}/>
        <UPField label="Email"      value={v.email} onChange={val=>u('email',val)} type="email"/>
        <UPField label="Phone"      value={v.phone} onChange={val=>u('phone',val)} mono/>
        <UPField label="Role"       value={v.role}  disabled/>
        <UPField label="Department" value={v.dept}  disabled/>
      </div>
      <div style={__s({display:'flex',flexDirection:'column',gap:4,marginBottom:16})}>
        <label style={__s({fontSize:11,fontWeight:600,color:'var(--zg-text-mid)'})}>Bio</label>
        <textarea value={v.bio} onChange={e=>u('bio',e.target.value)} placeholder="A short description about you…" style={__s({height:72,padding:'8px 10px',resize:'vertical',background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',fontFamily:'var(--zg-sans)',fontSize:12,color:'var(--zg-text)',outline:'none'})}/>
      </div>
      <button class="zwh-btn-primary" onClick={()=>toast.success('Profile saved')}>Save Changes</button>
    </div>
  );
}});

// ── Security ──────────────────────────────────────────────
const UPSecurity = defineComponent({ name:'UPSecurity', setup() {
    const pwStep = ref(false);
  const setPwStep = (v)=>{ pwStep.value=(typeof v==='function')?v(pwStep.value):v; };
    const pw = reactive({current:'',next:'',confirm:''});
  const setPw = (f)=>{ const nv=(typeof f==='function')?f(pw):f; if(Array.isArray(pw)){pw.splice(0,pw.length,...nv);} else {Object.keys(pw).forEach(k=>delete pw[k]);Object.assign(pw,nv);} };
    const twoFA = ref(true);
  const setTwoFA = (v)=>{ twoFA.value=(typeof v==='function')?v(twoFA.value):v; };
    const mfaStep = ref(null);
  const setMfaStep = (v)=>{ mfaStep.value=(typeof v==='function')?v(mfaStep.value):v; };
    const mfaCode = ref('');
  const setMfaCode = (v)=>{ mfaCode.value=(typeof v==='function')?v(mfaCode.value):v; };
    const passkeys = reactive([{id:'pk1',name:'MacBook Pro — Touch ID',created:'Jun 1, 2025',last:'2h ago'}]);
  const setPasskeys = (f)=>{ const nv=(typeof f==='function')?f(passkeys):f; if(Array.isArray(passkeys)){passkeys.splice(0,passkeys.length,...nv);} else {Object.keys(passkeys).forEach(k=>delete passkeys[k]);Object.assign(passkeys,nv);} };
    const passkeyStep = ref(false);
  const setPasskeyStep = (v)=>{ passkeyStep.value=(typeof v==='function')?v(passkeyStep.value):v; };
  return () => (
    <div style={__s({maxWidth:640})}>
      <div style={__s({fontSize:18,fontWeight:700,color:'var(--zg-text)',marginBottom:4})}>Security</div>
      <div style={__s({fontSize:12,color:'var(--zg-text-dim)',marginBottom:24})}>Manage your password, two-factor authentication, and passkeys</div>
      {/* Password */}
      <div style={__s({background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',padding:16,marginBottom:12})}>
        <div style={__s({display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:pwStep.value?14:0})}>
          <div><div style={__s({fontSize:13,fontWeight:600,color:'var(--zg-text)'})}>Password</div><div style={__s({fontSize:11,color:'var(--zg-text-dim)',marginTop:1})}>Last changed 30 days ago</div></div>
          <button style={__s({height:28,padding:'0 12px',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',background:'transparent',fontFamily:'inherit',fontSize:11.5,cursor:'pointer',color:'var(--zg-text-mid)'})} onClick={()=>setPwStep(!pwStep.value)}>{pwStep.value?'Cancel':'Change Password'}</button>
        </div>
        {pwStep.value && (
          <div style={__s({display:'flex',flexDirection:'column',gap:10})}>
            {[['current','Current Password',''],['next','New Password',''],['confirm','Confirm New Password','']].map(([k,l])=>(
              <div key={k} style={__s({display:'flex',flexDirection:'column',gap:4})}>
                <label style={__s({fontSize:11,fontWeight:600,color:'var(--zg-text-mid)'})}>{l}</label>
                <input type="password" value={pw[k]} onChange={e=>setPw(p=>({...p,[k]:e.target.value}))} style={__s({height:32,padding:'0 10px',background:'var(--zg-bg)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',fontFamily:'inherit',fontSize:13,color:'var(--zg-text)',outline:'none'})}/>
              </div>
            ))}
            <button class="zwh-btn-primary" style={__s({width:'fit-content',height:32})} onClick={()=>{toast.success('Password updated');setPwStep(false);setPw({current:'',next:'',confirm:''});}}>Update Password</button>
          </div>
        )}
      </div>
      {/* 2FA */}
      <div style={__s({background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',padding:16,marginBottom:12})}>
        <UPToggle label="Two-Factor Authentication" sub="Require TOTP code on every login" value={twoFA.value} onChange={setTwoFA}/>
        {twoFA.value && !mfaStep.value && <div style={__s({marginTop:10,fontSize:11.5,color:'var(--zg-good)',fontWeight:600})}>2FA is active — using authenticator app (TOTP)</div>}
        {!twoFA.value && !mfaStep.value && <div style={__s({marginTop:10,padding:'8px 12px',background:'oklch(0.70 0.18 25 / 0.08)',border:'1px solid oklch(0.70 0.18 25 / 0.3)',borderRadius:'var(--zg-radius-md)',fontSize:11.5,color:'var(--zg-danger)'})}>2FA is disabled. Your account is less secure.</div>}
        {mfaStep.value==='enable' && (
          <div style={__s({marginTop:10,display:'flex',flexDirection:'column',gap:10,padding:12,background:'oklch(0.78 0.15 150 / 0.06)',border:'1px solid oklch(0.78 0.15 150 / 0.25)',borderRadius:'var(--zg-radius-md)'})}>
            <div style={__s({fontSize:12.5,fontWeight:600,color:'var(--zg-good)'})}>Enable Two-Factor Authentication</div>
            <div style={__s({fontSize:12,color:'var(--zg-text-dim)'})}>1. Install an authenticator app (Google Authenticator, Authy, 1Password)</div>
            <div style={__s({display:'flex',gap:12,alignItems:'center'})}>
              <div style={__s({width:80,height:80,background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',display:'flex',alignItems:'center',justifyContent:'center'})}>
                <div style={__s({display:'grid',gridTemplateColumns:'repeat(5,8px)',gridTemplateRows:'repeat(5,8px)',gap:1})}>
                  {[1,1,1,1,1,1,0,0,0,1,1,0,1,0,1,1,0,0,0,1,1,1,1,1,1].map((c,i)=><div key={i} style={__s({width:8,height:8,background:c?'var(--zg-accent)':'transparent'})}/>)}
                </div>
              </div>
              <div style={__s({fontSize:12,color:'var(--zg-text-dim)',flex:1})}>2. Scan the QR code or enter: <span style={__s({fontFamily:'var(--zg-mono)',color:'var(--zg-accent)',fontSize:11})}>JBSWY3DPEHPK3PXP</span></div>
            </div>
            <div style={__s({display:'flex',flexDirection:'column',gap:4})}>
              <label style={__s({fontSize:11,fontWeight:600,color:'var(--zg-text-mid)'})}>3. Enter the 6-digit code to confirm</label>
              <div style={__s({display:'flex',gap:6})}>
                <input value={mfaCode.value} onChange={e=>setMfaCode(e.target.value.replace(/D/g,'').slice(0,6))} placeholder="000000" maxlength={6}
                  style={__s({width:120,height:36,padding:'0 10px',background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',fontFamily:'var(--zg-mono)',fontSize:20,fontWeight:700,color:'var(--zg-text)',outline:'none',textAlign:'center',letterSpacing:'0.15em'})}/>
                <button class="zwh-btn-primary" disabled={mfaCode.value.length<6} style={__s({opacity:mfaCode.value.length>=6?1:0.4,height:36})}
                  onClick={()=>{if(mfaCode.value.length===6){setTwoFA(true);setMfaStep(null);setMfaCode('');toast.success('2FA enabled successfully');}}}> Verify & Enable</button>
                <button class="zwh-btn-ghost" style={__s({height:36})} onClick={()=>{setMfaStep(null);setMfaCode('');}}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        {mfaStep.value==='disable' && (
          <div style={__s({marginTop:10,display:'flex',flexDirection:'column',gap:10,padding:12,background:'oklch(0.70 0.18 25 / 0.06)',border:'1px solid oklch(0.70 0.18 25 / 0.25)',borderRadius:'var(--zg-radius-md)'})}>
            <div style={__s({fontSize:12.5,fontWeight:600,color:'var(--zg-danger)'})}>Disable Two-Factor Authentication</div>
            <div style={__s({fontSize:12,color:'var(--zg-text-dim)'})}>This will make your account less secure. Enter your password to confirm.</div>
            <div style={__s({display:'flex',gap:6})}>
              <input type="password" placeholder="Current password" style={__s({flex:1,height:32,padding:'0 10px',background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',fontFamily:'inherit',fontSize:13,color:'var(--zg-text)',outline:'none'})}/>
              <button style={__s({height:32,padding:'0 14px',border:'1px solid var(--zg-danger)',borderRadius:'var(--zg-radius-md)',background:'transparent',cursor:'pointer',fontFamily:'inherit',fontSize:12,color:'var(--zg-danger)',fontWeight:600})}
                onClick={()=>{setTwoFA(false);setMfaStep(null);toast.warn('2FA disabled');}}>Confirm Disable</button>
              <button class="zwh-btn-ghost" style={__s({height:32})} onClick={()=>setMfaStep(null)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
      {/* Passkeys */}
      <div style={__s({background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',padding:16})}>
        <div style={__s({display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12})}>
          <div><div style={__s({fontSize:13,fontWeight:600,color:'var(--zg-text)'})}>Passkeys</div><div style={__s({fontSize:11,color:'var(--zg-text-dim)',marginTop:1})}>Passwordless login via Face ID, Touch ID, or hardware key</div></div>
          <button style={__s({height:28,padding:'0 12px',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',background:'transparent',fontFamily:'inherit',fontSize:11.5,cursor:'pointer',color:'var(--zg-text-mid)'})} onClick={()=>setPasskeyStep(true)}>+ Add Passkey</button>
        </div>
        {passkeys.map(pk=>(
          <div key={pk.id} style={__s({display:'flex',alignItems:'center',gap:12,padding:'9px 0',borderBottom:'1px solid var(--zg-line-soft,#1c1f24)'})}>
            <svg viewBox="0 0 16 16" width="16" fill="none" stroke="var(--zg-accent)" stroke-width="1.4" stroke-linecap="round"><circle cx="8" cy="6" r="3"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6"/></svg>
            <div style={__s({flex:1})}><div style={__s({fontSize:12.5,fontWeight:600,color:'var(--zg-text)'})}>{pk.name}</div><div style={__s({fontSize:10.5,color:'var(--zg-text-dim)'})}>Added {pk.created} · Last used {pk.last}</div></div>
            <button style={__s({height:24,padding:'0 8px',border:'1px solid var(--zg-line)',borderRadius:3,background:'transparent',fontFamily:'inherit',fontSize:11,cursor:'pointer',color:'var(--zg-danger)'})} onClick={()=>setPasskeys(p=>p.filter(x=>x.id!==pk.id))}>Remove</button>
          </div>
        ))}
        {passkeys.length===0&&<div style={__s({fontSize:12,color:'var(--zg-text-dim)',paddingTop:4})}>No passkeys registered</div>}
        {passkeyStep.value && (
          <div style={__s({marginTop:10,padding:12,background:'var(--zg-panel-hi)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',display:'flex',flexDirection:'column',gap:8})}>
            <div style={__s({fontSize:12.5,fontWeight:600,color:'var(--zg-text)'})}>Register a Passkey</div>
            <div style={__s({fontSize:12,color:'var(--zg-text-dim)',lineHeight:1.5})}>Your browser will prompt you to use Touch ID, Face ID, or a hardware security key. Follow the on-screen instructions.</div>
            <div style={__s({display:'flex',gap:6})}>
              <button class="zwh-btn-primary" style={__s({height:30,fontSize:12})} onClick={()=>{setTimeout(()=>{setPasskeys(p=>[...p,{id:'pk-'+Date.now(),name:navigator.platform+' — Browser',created:'Just now',last:'Just now'}]);setPasskeyStep(false);toast.success('Passkey registered!');},600);}}>Use This Device</button>
              <button class="zwh-btn-ghost" style={__s({height:30,fontSize:12})} onClick={()=>setPasskeyStep(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}});

// ── Devices & Sessions ────────────────────────────────────
const DEVICES_DATA = [
  { id:'d1', name:'MacBook Pro 14"', browser:'Chrome 124', os:'macOS Sonoma', ip:'82.163.x.x',  location:'Dubai, AE',      last:'Active now',   current:true  },
  { id:'d2', name:'iPhone 15 Pro',   browser:'Safari 17',  os:'iOS 17.4',     ip:'82.163.x.x',  location:'Dubai, AE',      last:'2h ago',       current:false },
  { id:'d3', name:'iPad Air',        browser:'Safari 17',  os:'iPadOS 17.3',  ip:'104.21.x.x',  location:'Abu Dhabi, AE',  last:'1d ago',       current:false },
  { id:'d4', name:'Windows PC',      browser:'Edge 124',   os:'Windows 11',   ip:'192.168.x.x', location:'Cairo, EG',      last:'5d ago',       current:false },
];
const UPDevices = defineComponent({ name:'UPDevices', setup() {
    const devices = reactive(DEVICES_DATA);
  const setDevices = (f)=>{ const nv=(typeof f==='function')?f(devices):f; if(Array.isArray(devices)){devices.splice(0,devices.length,...nv);} else {Object.keys(devices).forEach(k=>delete devices[k]);Object.assign(devices,nv);} };
  return () => (
    <div style={__s({maxWidth:700})}>
      <div style={__s({fontSize:18,fontWeight:700,color:'var(--zg-text)',marginBottom:4})}>Devices & Sessions</div>
      <div style={__s({fontSize:12,color:'var(--zg-text-dim)',marginBottom:24})}>All active sessions — revoke any you don't recognise</div>
      <div style={__s({display:'flex',flexDirection:'column',gap:8,marginBottom:16})}>
        {devices.map(d=>(
          <div key={d.id} style={__s({background:'var(--zg-panel)',border:'1px solid '+(d.current?'var(--zg-accent)':'var(--zg-line)'),borderRadius:'var(--zg-radius-md)',padding:'12px 16px',display:'flex',alignItems:'center',gap:14})}>
            <div style={__s({width:40,height:40,borderRadius:'var(--zg-radius-md)',background:'var(--zg-panel-hi)',border:'1px solid var(--zg-line)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0})}>
              <svg viewBox="0 0 16 16" width="18" fill="none" stroke="var(--zg-text-mid)" stroke-width="1.3" stroke-linecap="round"><rect x="2" y="3" width="12" height="8" rx="1"/><path d="M5 14h6M8 11v3"/></svg>
            </div>
            <div style={__s({flex:1})}>
              <div style={__s({display:'flex',alignItems:'center',gap:8})}>
                <span style={__s({fontSize:13,fontWeight:600,color:'var(--zg-text)'})}>{d.name}</span>
                {d.current && <span style={__s({fontSize:10,padding:'1px 6px',background:'var(--zg-accent-tint)',color:'var(--zg-accent)',borderRadius:2,fontWeight:700})}>Current</span>}
              </div>
              <div style={__s({fontSize:11,color:'var(--zg-text-dim)',marginTop:2})}>{d.browser} · {d.os} · {d.location}</div>
              <div style={__s({fontSize:10.5,fontFamily:'var(--zg-mono)',color:'var(--zg-text-xdim)',marginTop:1})}>{d.ip} · {d.last}</div>
            </div>
            {!d.current && <button style={__s({height:28,padding:'0 12px',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',background:'transparent',fontFamily:'inherit',fontSize:11.5,cursor:'pointer',color:'var(--zg-danger)'})} onClick={()=>{setDevices(p=>p.filter(x=>x.id!==d.id));toast.success('Session revoked');}}>Revoke</button>}
          </div>
        ))}
      </div>
      <button style={__s({height:34,padding:'0 16px',border:'1px solid var(--zg-danger)',borderRadius:'var(--zg-radius-md)',background:'transparent',fontFamily:'inherit',fontSize:12.5,cursor:'pointer',color:'var(--zg-danger)',fontWeight:600})} onClick={()=>{setDevices(p=>p.filter(d=>d.current));toast.success('All other sessions signed out');}}>Sign Out All Other Devices</button>
    </div>
  );
}});

// ── Activity Log ──────────────────────────────────────────
const MY_ACTIVITY = [
  { action:'Updated market settings for SA', module:'Settings › Markets',      time:'2 minutes ago',  icon:'gear'  },
  { action:'Exported warehouse finance report', module:'Finance Summary',       time:'18 minutes ago', icon:'export'},
  { action:'Confirmed inbound PO-4821',      module:'Warehouse › Receiving',   time:'1 hour ago',     icon:'check' },
  { action:'Approved vendor listing × 3',    module:'Marketplace › Listings',  time:'3 hours ago',    icon:'check' },
  { action:'Created Size Chart: Zucci Label',module:'Products › Size Charts',  time:'6 hours ago',    icon:'doc'   },
  { action:'Invited user t.saleh@zucci.com', module:'Settings › Access',       time:'Yesterday',      icon:'person'},
  { action:'Resolved ticket TKT-4818',       module:'Tickets',                 time:'Yesterday',      icon:'check' },
  { action:'Updated return rules for EG',    module:'Settings › Returns',      time:'2 days ago',     icon:'gear'  },
  { action:'Bulk exported inventory CSV',    module:'Warehouse › Inventory',   time:'3 days ago',     icon:'export'},
  { action:'Signed in from Safari 17',       module:'Authentication',          time:'5 days ago',     icon:'shield'},
];
function UPActivity() {
  return (
    <div style={__s({maxWidth:700})}>
      <div style={__s({fontSize:18,fontWeight:700,color:'var(--zg-text)',marginBottom:4})}>Activity Log</div>
      <div style={__s({fontSize:12,color:'var(--zg-text-dim)',marginBottom:24})}>Your recent actions in the admin panel</div>
      <div style={__s({border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',overflow:'hidden'})}>
        {MY_ACTIVITY.map((a,i)=>(
          <div key={i} style={__s({display:'flex',alignItems:'center',gap:12,padding:'11px 16px',background:i%2===0?'var(--zg-panel)':'var(--zg-bg)',borderBottom:'1px solid var(--zg-line-soft,#1c1f24)'})}>
            <div style={__s({width:30,height:30,borderRadius:'50%',background:'var(--zg-panel-hi)',border:'1px solid var(--zg-line)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0})}>
              <svg viewBox="0 0 12 12" width="12" fill="none" stroke="var(--zg-text-mid)" stroke-width="1.3" stroke-linecap="round">
                {a.icon==='check'  && <><path d="M2 6l3 3 5-5"/></>}
                {a.icon==='gear'   && <><circle cx="6" cy="6" r="2"/><path d="M6 1v2M6 9v2M1 6h2M9 6h2M2.5 2.5l1.5 1.5M8 8l1.5 1.5M2.5 9.5L4 8M8 4l1.5-1.5"/></>}
                {a.icon==='export' && <><path d="M6 1v6M4 5l2 2 2-2M2 9h8"/></>}
                {a.icon==='doc'    && <><rect x="2" y="1" width="8" height="10" rx="1"/><path d="M4 4h4M4 6h4M4 8h2"/></>}
                {a.icon==='person' && <><circle cx="6" cy="4" r="2"/><path d="M2 11c0-2.2 1.8-4 4-4s4 1.8 4 4"/></>}
                {a.icon==='shield' && <><path d="M6 1L2 3v3c0 2.2 1.8 4 4 4s4-1.8 4-4V3z"/></>}
              </svg>
            </div>
            <div style={__s({flex:1})}>
              <div style={__s({fontSize:12.5,color:'var(--zg-text)',fontWeight:500})}>{a.action}</div>
              <div style={__s({fontSize:10.5,color:'var(--zg-text-dim)',marginTop:1,fontFamily:'var(--zg-mono)'})}>{a.module}</div>
            </div>
            <span style={__s({fontSize:10.5,color:'var(--zg-text-xdim)',flexShrink:0})}>{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Notification Preferences ──────────────────────────────
const NOTIF_PREFS = [
  { id:'order_new',       label:'New Order Placed',          sub:'Notify when a customer places an order',         email:true,  push:true,  in_app:true  },
  { id:'order_issue',     label:'Order Issue / Exception',   sub:'Delivery failure, fraud flag, etc.',             email:true,  push:true,  in_app:true  },
  { id:'warehouse_alert', label:'Warehouse Alerts',          sub:'Low stock, capacity, sync failures',            email:true,  push:false, in_app:true  },
  { id:'return_new',      label:'New Return Submitted',      sub:'Customer return created',                        email:false, push:false, in_app:true  },
  { id:'aging_warn',      label:'Aging / Write-off Flagged', sub:'Item hits Day 30 / 60 / 90 threshold',          email:true,  push:false, in_app:true  },
  { id:'ticket_assigned', label:'Ticket Assigned to Me',     sub:'A support ticket is assigned to you',            email:true,  push:true,  in_app:true  },
  { id:'vendor_action',   label:'Vendor Action Required',    sub:'Vendor application, document expiry',            email:true,  push:false, in_app:true  },
  { id:'sla_breach',      label:'SLA Breached',              sub:'Ticket or shipment exceeds SLA window',          email:true,  push:true,  in_app:true  },
  { id:'payout',          label:'Payout Processed',          sub:'Vendor payout cycle completed',                  email:false, push:false, in_app:true  },
  { id:'system',          label:'System Announcements',      sub:'Platform updates, maintenance windows',          email:true,  push:false, in_app:true  },
];
const UPNotifPrefs = defineComponent({ name:'UPNotifPrefs', setup() {
    const prefs = reactive((()=>NOTIF_PREFS.map(p=>({...p})))());
  const setPrefs = (f)=>{ const nv=(typeof f==='function')?f(prefs):f; if(Array.isArray(prefs)){prefs.splice(0,prefs.length,...nv);} else {Object.keys(prefs).forEach(k=>delete prefs[k]);Object.assign(prefs,nv);} };
  const toggle = (id,ch) => setPrefs(p=>p.map(x=>x.id===id?{...x,[ch]:!x[ch]}:x));
  return () => (
    <div style={__s({maxWidth:700})}>
      <div style={__s({fontSize:18,fontWeight:700,color:'var(--zg-text)',marginBottom:4})}>Notification Preferences</div>
      <div style={__s({fontSize:12,color:'var(--zg-text-dim)',marginBottom:24})}>Choose which events you receive notifications for, and through which channels</div>
      <div style={__s({border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',overflow:'hidden'})}>
        <div style={__s({display:'grid',gridTemplateColumns:'1fr 70px 70px 70px',padding:'0 16px',height:32,background:'var(--zg-panel-hi)',borderBottom:'1px solid var(--zg-line)',alignItems:'center',fontSize:'9.5px',textTransform:'uppercase',letterSpacing:'0.07em',color:'var(--zg-text-dim)',fontWeight:600})}>
          <span>Event</span><span style={__s({textAlign:'center'})}>Email</span><span style={__s({textAlign:'center'})}>Push</span><span style={__s({textAlign:'center'})}>In-App</span>
        </div>
        {prefs.map((p,i)=>(
          <div key={p.id} style={__s({display:'grid',gridTemplateColumns:'1fr 70px 70px 70px',padding:'10px 16px',background:i%2===0?'var(--zg-panel)':'var(--zg-bg)',borderBottom:'1px solid var(--zg-line-soft,#1c1f24)',alignItems:'center'})}>
            <div><div style={__s({fontSize:12.5,fontWeight:500,color:'var(--zg-text)'})}>{p.label}</div><div style={__s({fontSize:11,color:'var(--zg-text-dim)',marginTop:1})}>{p.sub}</div></div>
            {['email','push','in_app'].map(ch=>(
              <div key={ch} style={__s({display:'flex',justifyContent:'center'})}>
                <button onClick={()=>toggle(p.id,ch)} style={__s({width:30,height:16,borderRadius:8,border:'none',cursor:'pointer',background:p[ch]?'var(--zg-accent)':'var(--zg-line)',position:'relative',transition:'background .14s'})}>
                  <div style={__s({width:11,height:11,borderRadius:'50%',background:'#fff',position:'absolute',top:2.5,left:p[ch]?16:2,transition:'left .14s'})}/>
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={__s({marginTop:12})}><button class="zwh-btn-primary" onClick={()=>toast.success('Notification preferences saved')}>Save Preferences</button></div>
    </div>
  );
}});

// ── Appearance ────────────────────────────────────────────
const UPAppearance = defineComponent({ name:'UPAppearance', setup() {
    const v = reactive({ theme:'dark', lang:'en', timezone:'Asia/Dubai', dateFormat:'DD/MM/YYYY', startPage:'dashboard' });
  const setV = (f)=>{ const nv=(typeof f==='function')?f(v):f; if(Array.isArray(v)){v.splice(0,v.length,...nv);} else {Object.keys(v).forEach(k=>delete v[k]);Object.assign(v,nv);} };
  const u = (k,val) => setV(p=>({...p,[k]:val}));
  const Sel = ({label,k,opts}) => (
    <div style={__s({display:'flex',flexDirection:'column',gap:4})}>
      <label style={__s({fontSize:11,fontWeight:600,color:'var(--zg-text-mid)'})}>{label}</label>
      <select value={v[k]} onChange={e=>u(k,e.target.value)} style={__s({height:32,padding:'0 10px',background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',fontFamily:'inherit',fontSize:12,color:'var(--zg-text)',outline:'none',cursor:'pointer'})}>
        {opts.map(([val,lbl])=><option key={val} value={val}>{lbl}</option>)}
      </select>
    </div>
  );
  return () => (
    <div style={__s({maxWidth:520})}>
      <div style={__s({fontSize:18,fontWeight:700,color:'var(--zg-text)',marginBottom:4})}>Appearance</div>
      <div style={__s({fontSize:12,color:'var(--zg-text-dim)',marginBottom:24})}>Personalise your admin panel experience</div>
      <div style={__s({display:'flex',flexDirection:'column',gap:12})}>
        <div>
          <div style={__s({fontSize:11,fontWeight:600,color:'var(--zg-text-mid)',marginBottom:8})}>Theme</div>
          <div style={__s({display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8})}>
            {[['dark','Dark'],['light','Light'],['system','System']].map(([val,lbl])=>(
              <button key={val} onClick={()=>u('theme',val)}
                style={__s({padding:'12px 10px',border:'1px solid',borderRadius:'var(--zg-radius-md)',background:'transparent',cursor:'pointer',fontFamily:'inherit',fontSize:12,fontWeight:600,transition:'all .12s',
                  borderColor:v.theme===val?'var(--zg-accent)':'var(--zg-line)',background:v.theme===val?'var(--zg-accent-tint)':'transparent',color:v.theme===val?'var(--zg-accent)':'var(--zg-text-mid)'})}>
                {lbl}
              </button>
            ))}
          </div>
        </div>
        <Sel label="Language" k="lang" opts={[['en','English'],['ar','العربية'],['fr','Français']]}/>
        <Sel label="Timezone" k="timezone" opts={[['Asia/Dubai','Asia/Dubai (GST +4)'],['Asia/Riyadh','Asia/Riyadh (AST +3)'],['Africa/Cairo','Africa/Cairo (EET +2)'],['Europe/London','Europe/London (GMT)'],['America/New_York','America/New_York (ET -5)']]}/>
        <Sel label="Date Format" k="dateFormat" opts={[['DD/MM/YYYY','DD/MM/YYYY'],['MM/DD/YYYY','MM/DD/YYYY'],['YYYY-MM-DD','YYYY-MM-DD (ISO)']]}/>
        <Sel label="Default Start Page" k="startPage" opts={[['dashboard','Dashboard'],['orders','Orders'],['warehouses','Warehouses'],['tickets','Tickets']]}/>
        <button class="zwh-btn-primary" style={__s({width:'fit-content'})} onClick={()=>toast.success('Appearance saved')}>Save</button>
      </div>
    </div>
  );
}});

// ── Help ──────────────────────────────────────────────────
function UPHelp() {
  const DOCS = [
    { title:'Warehouse & Storage Guide',    desc:'Inbound, inventory, returns, transfers',     link:'#' },
    { title:'Order Management Guide',       desc:'Order lifecycle, statuses, exceptions',      link:'#' },
    { title:'Vendor Onboarding Guide',      desc:'KYC/KYB, documents, approval workflow',      link:'#' },
    { title:'Finance & Payouts Guide',      desc:'Payout cycles, invoices, reconciliation',    link:'#' },
    { title:'API Documentation',            desc:'REST API reference, webhooks, rate limits',   link:'#' },
    { title:'Roles & Permissions Matrix',   desc:'What each role can access',                  link:'#' },
  ];
  return (
    <div style={__s({maxWidth:640})}>
      <div style={__s({fontSize:18,fontWeight:700,color:'var(--zg-text)',marginBottom:4})}>Help & Documentation</div>
      <div style={__s({fontSize:12,color:'var(--zg-text-dim)',marginBottom:24})}>Guides, API docs, and support resources</div>
      <div style={__s({display:'flex',flexDirection:'column',gap:8,marginBottom:20})}>
        {DOCS.map(d=>(
          <a key={d.title} href={d.link} style={__s({display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',textDecoration:'none',transition:'border-color .12s'})}
            onMouseEnter={e=>e.currentTarget.style.borderColor='var(--zg-accent)'}
            onMouseLeave={e=>e.currentTarget.style.borderColor='var(--zg-line)'}>
            <svg viewBox="0 0 14 14" width="14" fill="none" stroke="var(--zg-text-dim)" stroke-width="1.4" stroke-linecap="round"><rect x="2" y="1" width="10" height="12" rx="1"/><path d="M4 4h6M4 6.5h6M4 9h4"/></svg>
            <div style={__s({flex:1})}>
              <div style={__s({fontSize:13,fontWeight:600,color:'var(--zg-text)'})}>{d.title}</div>
              <div style={__s({fontSize:11,color:'var(--zg-text-dim)',marginTop:1})}>{d.desc}</div>
            </div>
            <svg viewBox="0 0 8 14" width="7" fill="none" stroke="var(--zg-text-xdim)" stroke-width="1.5" stroke-linecap="round"><path d="M2 2l4 5-4 5"/></svg>
          </a>
        ))}
      </div>
      <div style={__s({padding:'14px 16px',background:'var(--zg-panel)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)'})}>
        <div style={__s({fontSize:13,fontWeight:600,color:'var(--zg-text)',marginBottom:4})}>Contact Support</div>
        <div style={__s({fontSize:12,color:'var(--zg-text-dim)',marginBottom:10})}>Open a ticket with the internal tech team</div>
        <button class="zwh-btn-primary" onClick={()=>{toast.info('Opening ticket form…');}}>Open Support Ticket</button>
      </div>
    </div>
  );
}



const ZucciUserProfile = defineComponent({
  name: 'ZucciUserProfile',
  setup() {
    const sec = ref('profile');
    const logoutModal = ref(false);
    const onClose = () => {};
    return () => (
      <div style={__s({display:'flex',minHeight:'calc(100vh - 60px)',background:'var(--zg-bg)'})}>
        {/* Sidebar */}
        <div style={__s({width:'220px',flex:'0 0 220px',background:'var(--zg-bg-elev)',borderRight:'1px solid var(--zg-line)',display:'flex',flexDirection:'column'})}>
          <div style={__s({padding:'20px 16px 14px',borderBottom:'1px solid var(--zg-line)',display:'flex',alignItems:'center',gap:10})}>
            <UPAvatar name="Sara Medhat" size={32}/>
            <div><div style={__s({fontSize:13,fontWeight:700,color:'var(--zg-text)'})}>Sara Medhat</div><div style={__s({fontSize:10.5,color:'var(--zg-text-dim)'})}>Super Admin</div></div>
          </div>
          <nav style={__s({flex:1,overflowY:'auto',padding:'8px 0'})}>
            {UP_SECTIONS.map(s=>(
              <button key={s.id} onClick={()=>{sec.value=s.id;}}
                style={__s({width:'100%',height:36,padding:'0 16px',border:'none',background:sec.value===s.id?'var(--zg-panel)':'transparent',cursor:'pointer',fontFamily:'inherit',fontSize:12.5,fontWeight:sec.value===s.id?600:400,color:sec.value===s.id?'var(--zg-text)':'var(--zg-text-mid)',borderLeft:sec.value===s.id?'2px solid var(--zg-accent)':'2px solid transparent',textAlign:'left'})}>
                {s.label}
              </button>
            ))}
          </nav>
          <div style={__s({padding:'12px 16px',borderTop:'1px solid var(--zg-line)'})}>
            <button style={__s({width:'100%',height:34,border:'1px solid var(--zg-danger)',borderRadius:'var(--zg-radius-md)',background:'transparent',fontFamily:'inherit',fontSize:12.5,cursor:'pointer',color:'var(--zg-danger)',fontWeight:600})}
              onClick={()=>{logoutModal.value=true;}}>Log Out</button>
          </div>
        </div>
        {/* Content */}
        <div style={__s({flex:1,overflowY:'auto',padding:32})}>
          {sec.value==='profile' && <UPProfile/>}
          {sec.value==='security' && <UPSecurity/>}
          {sec.value==='devices' && <UPDevices/>}
          {sec.value==='activity' && <UPActivity/>}
          {sec.value==='notif_prefs' && <UPNotifPrefs/>}
          {sec.value==='appearance' && <UPAppearance/>}
          {sec.value==='help' && <UPHelp/>}
        </div>
        {logoutModal.value && (
          <div style={__s({position:'fixed',inset:0,zIndex:9300,background:'oklch(0.1 0.01 250 / 0.8)',display:'flex',alignItems:'center',justifyContent:'center'})}>
            <div style={__s({width:360,background:'var(--zg-bg-elev)',border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-lg)',overflow:'hidden'})}>
              <div style={__s({padding:'16px 20px',borderBottom:'1px solid var(--zg-line)'})}>
                <div style={__s({fontSize:14,fontWeight:700,color:'var(--zg-text)',marginBottom:3})}>Sign Out</div>
                <div style={__s({fontSize:12,color:'var(--zg-text-dim)'})}>You'll need to sign in again to access the dashboard.</div>
              </div>
              <div style={__s({padding:'14px 20px',display:'flex',flexDirection:'column',gap:8})}>
                <button style={__s({width:'100%',height:38,border:'1px solid var(--zg-danger)',borderRadius:'var(--zg-radius-md)',background:'transparent',fontFamily:'inherit',fontSize:13,cursor:'pointer',color:'var(--zg-danger)',fontWeight:600})} onClick={()=>{toast.success('Signed out');logoutModal.value=false;}}>Sign Out of This Device</button>
                <button style={__s({width:'100%',height:38,border:'1px solid var(--zg-danger)',borderRadius:'var(--zg-radius-md)',background:'oklch(0.70 0.18 25 / 0.08)',fontFamily:'inherit',fontSize:13,cursor:'pointer',color:'var(--zg-danger)',fontWeight:600})} onClick={()=>{toast.success('Signed out of all devices');logoutModal.value=false;}}>Sign Out of All Devices</button>
                <button style={__s({width:'100%',height:34,border:'1px solid var(--zg-line)',borderRadius:'var(--zg-radius-md)',background:'transparent',fontFamily:'inherit',fontSize:12.5,cursor:'pointer',color:'var(--zg-text-mid)'})} onClick={()=>{logoutModal.value=false;}}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
});

export default ZucciUserProfile;

</script>