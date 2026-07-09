// filesData.js — Files module data

export const FILE_DATA = [
  { id:'f001', name:'hero-eid-2025.jpg',      type:'image', size:'2.4 MB', dims:'1920×480',  folder:'images',    uploaded:'Jun 3, 2025',  uploader:'Nada Ibrahim',   url:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=60', tags:['hero','banner','eid'] },
  { id:'f002', name:'category-women.jpg',      type:'image', size:'1.1 MB', dims:'800×800',   folder:'images',    uploaded:'Jun 1, 2025',  uploader:'Nada Ibrahim',   url:'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=60', tags:['category','women'] },
  { id:'f003', name:'category-men.jpg',        type:'image', size:'0.9 MB', dims:'800×800',   folder:'images',    uploaded:'Jun 1, 2025',  uploader:'Nada Ibrahim',   url:'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400&q=60', tags:['category','men'] },
  { id:'f004', name:'banner-sa-launch.jpg',    type:'image', size:'3.2 MB', dims:'1920×600',  folder:'images',    uploaded:'May 28, 2025', uploader:'Sara Medhat',    url:'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=60', tags:['banner','sa','launch'] },
  { id:'f005', name:'og-image-ae.jpg',         type:'image', size:'0.8 MB', dims:'1200×630',  folder:'images',    uploaded:'May 15, 2025', uploader:'Sara Medhat',    url:'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&q=60', tags:['og','social','ae'] },
  { id:'f006', name:'app-icon.png',            type:'image', size:'0.1 MB', dims:'1024×1024', folder:'images',    uploaded:'Jan 15, 2025', uploader:'Admin',          url:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=60', tags:['app','icon','brand'] },
  { id:'f007', name:'logo-dark.svg',           type:'image', size:'0.04 MB',dims:'—',          folder:'images',    uploaded:'Jan 10, 2025', uploader:'Admin',          url:null, tags:['logo','brand'] },
  { id:'f008', name:'favicon.ico',             type:'image', size:'0.01 MB',dims:'32×32',      folder:'images',    uploaded:'Jan 10, 2025', uploader:'Admin',          url:null, tags:['favicon','brand'] },
  { id:'f020', name:'vendor-agreement-v3.pdf',  type:'pdf',  size:'1.2 MB', dims:'12 pages',  folder:'documents', uploaded:'May 20, 2025', uploader:'Sara Medhat',    url:null, tags:['legal','agreement','vendor'] },
  { id:'f021', name:'returns-policy-ae.pdf',    type:'pdf',  size:'0.4 MB', dims:'5 pages',   folder:'documents', uploaded:'Apr 10, 2025', uploader:'Sara Medhat',    url:null, tags:['policy','returns','ae'] },
  { id:'f022', name:'zucci-brand-guidelines.pdf',type:'pdf', size:'8.1 MB', dims:'42 pages',  folder:'documents', uploaded:'Feb 1, 2025',  uploader:'Admin',          url:null, tags:['brand','guidelines'] },
  { id:'f023', name:'q1-2025-finance-report.xlsx',type:'doc',size:'0.9 MB', dims:'—',          folder:'documents', uploaded:'Apr 5, 2025',  uploader:'Ahmed Khalil',   url:null, tags:['finance','q1','2025'] },
  { id:'f024', name:'q2-2025-finance-report.xlsx',type:'doc',size:'1.1 MB', dims:'—',          folder:'documents', uploaded:'Jul 5, 2025',  uploader:'Ahmed Khalil',   url:null, tags:['finance','q2','2025'] },
  { id:'f025', name:'warehouse-sops-v2.docx',   type:'doc',  size:'0.7 MB', dims:'—',          folder:'documents', uploaded:'Mar 12, 2025', uploader:'Omar Hassan',    url:null, tags:['warehouse','sops','ops'] },
  { id:'f040', name:'product-shoot-eid.mp4',    type:'video',size:'142 MB', dims:'1920×1080', folder:'videos',    uploaded:'Jun 2, 2025',  uploader:'Nada Ibrahim',   url:null, tags:['video','eid','product'] },
  { id:'f041', name:'brand-story-zucci.mp4',    type:'video',size:'84 MB',  dims:'1920×1080', folder:'videos',    uploaded:'Jan 20, 2025', uploader:'Admin',          url:null, tags:['brand','video','story'] },
  { id:'f042', name:'how-to-return-tutorial.mp4',type:'video',size:'28 MB', dims:'1280×720',  folder:'videos',    uploaded:'Mar 5, 2025',  uploader:'Sara Medhat',    url:null, tags:['tutorial','returns'] },
  { id:'f060', name:'summer-collection-hero.jpg',type:'image',size:'3.8 MB',dims:'1920×600',  folder:'media',     uploaded:'Jun 4, 2025',  uploader:'Nada Ibrahim',   url:'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=60', tags:['summer','hero','collection'] },
  { id:'f061', name:'influencer-hessa-1.jpg',   type:'image',size:'2.1 MB', dims:'1200×1500', folder:'media',     uploaded:'Jun 1, 2025',  uploader:'Nada Ibrahim',   url:'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=400&q=60', tags:['influencer','campaign'] },
  { id:'f062', name:'product-grid-sale.jpg',    type:'image',size:'1.8 MB', dims:'1600×900',  folder:'media',     uploaded:'May 30, 2025', uploader:'Nada Ibrahim',   url:'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=60', tags:['sale','grid','product'] },
];

export const FOLDERS = [
  { id:'all',       label:'All Files' },
  { id:'images',    label:'Images' },
  { id:'videos',    label:'Videos' },
  { id:'documents', label:'Documents' },
  { id:'media',     label:'Media Library' },
];

export const TYPE_COLORS = {
  image: 'oklch(0.82 0.14 215)',
  pdf:   'var(--zg-danger)',
  doc:   'oklch(0.82 0.14 250)',
  video: 'var(--zg-warn)',
};
