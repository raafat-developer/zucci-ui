// productsData.js — Products module data (ES module port of zucci-products-data.jsx)

// ── Category codes ────────────────────────────────────────
const ZCP_CATEGORY_CODES = {
  'Jeans':                   'JNS',  'Dresses':       'DRS',  'Tops':          'TOP',
  'Swimwear':                'SWM',  'Activewear':    'ACT',  'Jackets':       'JKT',
  'Bags & Accessories':      'BAG',  'Shoes':         'SHO',  'Underwear':     'UND',
  'Beauty & Skincare':       'BTY',  'Loungewear':    'LNG',  'Evening Wear':  'EVN',
  'Formal':                  'FRM',  'Kids':          'KDS',  'Casual Wear':   'CSL',
};

// SKU generator
function generateSKU(categoryName, brandCode, productCode, season, variantColor, variantSize) {
  const catCode  = ZCP_CATEGORY_CODES[categoryName] || 'GEN';
  const col      = (variantColor || '').slice(0,3).toUpperCase();
  const sz       = (String(variantSize || '')).replace(/[^a-z0-9]/gi,'').slice(0,4).toUpperCase();
  return `${catCode}-${brandCode}-${season}-${productCode}-${col}-${sz}`;
}

// ── Size guide library ─────────────────────────────────────
const ZCP_SIZE_GUIDES = [
  {
    id:'sg1', name:"Women's Bottoms — 2024", type:'bottoms_women', brand:'Global Standard',
    entries:[
      { eu:30, us:0,  uk:4,  it:34, jp:5,  fr:34, cm_waist:61, cm_hip:86,  inches_waist:'24' },
      { eu:32, us:2,  uk:6,  it:36, jp:7,  fr:36, cm_waist:63, cm_hip:88,  inches_waist:'24.5' },
      { eu:34, us:4,  uk:8,  it:38, jp:9,  fr:38, cm_waist:66, cm_hip:91,  inches_waist:'26' },
      { eu:36, us:6,  uk:10, it:40, jp:11, fr:40, cm_waist:69, cm_hip:94,  inches_waist:'27' },
      { eu:38, us:8,  uk:12, it:42, jp:13, fr:42, cm_waist:72, cm_hip:97,  inches_waist:'28.5' },
      { eu:40, us:10, uk:14, it:44, jp:15, fr:44, cm_waist:76, cm_hip:101, inches_waist:'30' },
    ],
  },
  {
    id:'sg2', name:"Women's Tops — 2024", type:'tops_women', brand:'Global Standard',
    entries:[
      { eu:'XS', us:'XS', uk:'6',  it:'34', jp:'5',  cm_bust:79,  cm_waist:61, inches_bust:'31' },
      { eu:'S',  us:'S',  uk:'8',  it:'36', jp:'7',  cm_bust:83,  cm_waist:64, inches_bust:'32.5' },
      { eu:'M',  us:'M',  uk:'10', it:'38', jp:'9',  cm_bust:87,  cm_waist:68, inches_bust:'34' },
      { eu:'L',  us:'L',  uk:'12', it:'40', jp:'11', cm_bust:91,  cm_waist:72, inches_bust:'36' },
      { eu:'XL', us:'XL', uk:'14', it:'42', jp:'13', cm_bust:96,  cm_waist:77, inches_bust:'38' },
    ],
  },
  {
    id:'sg3', name:"Men's Shoes — 2024", type:'shoes_men', brand:'Global Standard',
    entries:[
      { eu:39, us:6,   uk:5.5, jp:245, cm:24.5 },
      { eu:40, us:7,   uk:6.5, jp:255, cm:25.5 },
      { eu:41, us:8,   uk:7.5, jp:260, cm:26 },
      { eu:42, us:8.5, uk:8,   jp:265, cm:26.5 },
      { eu:43, us:9.5, uk:9,   jp:275, cm:27.5 },
      { eu:44, us:10,  uk:9.5, jp:280, cm:28 },
      { eu:45, us:11,  uk:10.5,jp:290, cm:29 },
    ],
  },
];

// ── Care instruction library ───────────────────────────────
const ZCP_CARE_INSTRUCTIONS = [
  { id:'ci1', name:'Standard Jeans Care',  instructions:'Machine wash at 30°C · Do not tumble dry · Iron on medium heat · Do not bleach' },
  { id:'ci2', name:'Delicate Swimwear',    instructions:'Hand wash only · Do not tumble dry · Do not iron · Do not bleach · Rinse after use' },
  { id:'ci3', name:'Casual Cotton Tops',   instructions:'Machine wash at 40°C · Tumble dry low · Iron on low heat · Do not dry clean' },
  { id:'ci4', name:'Formal Evening Wear',  instructions:'Dry clean only · Do not wash · Store on hanger · Iron on low heat with cloth' },
  { id:'ci5', name:'Activewear',           instructions:'Machine wash at 30°C · Do not tumble dry · Do not iron · Do not bleach · Air dry flat' },
  { id:'ci6', name:'Leather & PU Bags',    instructions:'Wipe with damp cloth · Do not machine wash · Store in dust bag · Avoid direct sunlight' },
];

// ── Products list ──────────────────────────────────────────
const ZCP_PRODUCTS = [
  { id:'PRD-10001', name:'Levis Black Ripped Jeans with Stitching', nameAr:'جينز ليفيس أسود ممزق مع غرز',
    sku:'JNS-LME-SC24-10001', brand:'Le Maillot', brandCode:'LME', vendor:'24K Fashion House', vendorId:'020239328832',
    category:'Jeans', status:'active', approvalStatus:'approved', approvedBy:'Sara Medhat', approvedAt:'May 10, 2025',
    markets:['AE','EG','SA'], fulfillment:'consignment', warehouse:'WH-DXB-01',
    price:799, currency:'EGP', thumbnail:null, inventoryTotal:249, variantCount:10,
    isVariable:true, syncSource:'shopify', syncStatus:'synced', lastSync:'4 min ago',
    hasArabic:true, arabicStatus:'ai_reviewed',
    returnPolicy:'standard', nonReturnableReason:null,
    createdAt:'Apr 28, 2025', updatedAt:'Jun 1, 2026' },
  { id:'PRD-10002', name:'Le Maillot Beige Swimsuit One-Piece', nameAr:'مايوه لو ماييو بيج قطعة واحدة',
    sku:'SWM-LME-SC24-10002', brand:'Le Maillot', brandCode:'LME', vendor:'24K Fashion House', vendorId:'020239328832',
    category:'Swimwear', status:'active', approvalStatus:'approved', approvedBy:'Sara Medhat', approvedAt:'Apr 15, 2025',
    markets:['AE','EG'], fulfillment:'consignment', warehouse:'WH-DXB-01',
    price:450, currency:'EGP', thumbnail:null, inventoryTotal:83, variantCount:5,
    isVariable:true, syncSource:'shopify', syncStatus:'synced', lastSync:'4 min ago',
    hasArabic:true, arabicStatus:'ai_reviewed',
    returnPolicy:'non_returnable', nonReturnableReason:'Swimwear — non-returnable by law',
    createdAt:'Mar 10, 2025', updatedAt:'May 28, 2026' },
  { id:'PRD-10003', name:'Burgandy Evening Gown Embroidered', nameAr:'فستان سهرة برغاندي مطرز',
    sku:'EVN-BRG-FC24-10003', brand:'Burgandy', brandCode:'BRG', vendor:'24K Fashion House', vendorId:'020239328832',
    category:'Evening Wear', status:'draft', approvalStatus:'pending',
    markets:['AE'], fulfillment:'consignment', warehouse:'WH-DXB-01',
    price:1200, currency:'AED', thumbnail:null, inventoryTotal:14, variantCount:3,
    isVariable:true, syncSource:'shopify', syncStatus:'synced', lastSync:'2 hours ago',
    hasArabic:false, arabicStatus:'not_translated',
    returnPolicy:'standard', nonReturnableReason:null,
    createdAt:'Jun 1, 2026', updatedAt:'Jun 1, 2026' },
  { id:'PRD-10004', name:'7 Wonders Linen Blazer White', nameAr:'بليزر كتان 7 ووندرز أبيض',
    sku:'FRM-7WW-SC25-10004', brand:'7 Wonders Wear', brandCode:'7WW', vendor:'7 Wonders Trading', vendorId:'EG78291039',
    category:'Formal', status:'draft', approvalStatus:'rejected', rejectionReason:'Missing Arabic content. Product images below minimum quality (need 1200×1200px minimum). Please resubmit.',
    markets:['AE','SA'], fulfillment:'direct_ship', warehouse:null,
    price:280, currency:'USD', thumbnail:null, inventoryTotal:0, variantCount:4,
    isVariable:true, syncSource:'manual', syncStatus:'manual',
    hasArabic:false, arabicStatus:'not_translated',
    returnPolicy:'standard', nonReturnableReason:null,
    createdAt:'May 15, 2026', updatedAt:'May 20, 2026' },
  { id:'PRD-10005', name:'Cairo Cotton Essentials Underwear Set', nameAr:'طقم ملابس داخلية قطن كايرو',
    sku:'UND-CCE-SC24-10005', brand:'Cairo Essentials', brandCode:'CCE', vendor:'Cairo Brands Co.', vendorId:'EG29318821',
    category:'Underwear', status:'active', approvalStatus:'approved', approvedBy:'Hana Rashid', approvedAt:'Feb 10, 2025',
    markets:['EG'], fulfillment:'consignment', warehouse:'WH-CAI-01',
    price:180, currency:'EGP', thumbnail:null, inventoryTotal:412, variantCount:8,
    isVariable:true, syncSource:'api', syncStatus:'synced', lastSync:'1 hour ago',
    hasArabic:true, arabicStatus:'human_reviewed',
    returnPolicy:'non_returnable', nonReturnableReason:'Underwear — non-returnable by law',
    createdAt:'Jan 8, 2025', updatedAt:'May 30, 2026' },
  { id:'PRD-10006', name:'Almaz Couture Silk Wrap Dress', nameAr:'فستان ألماز كوتور حريري ملفوف',
    sku:'DRS-ALC-SC25-10006', brand:'Almaz Couture', brandCode:'ALC', vendor:'Almaz Couture LLC', vendorId:'AE38829103',
    category:'Dresses', status:'pending_review', approvalStatus:'pending',
    markets:['AE','SA','EG'], fulfillment:'consignment', warehouse:'WH-DXB-01',
    price:850, currency:'AED', thumbnail:null, inventoryTotal:28, variantCount:6,
    isVariable:true, syncSource:'shopify', syncStatus:'synced', lastSync:'30 min ago',
    hasArabic:true, arabicStatus:'ai_pending',
    returnPolicy:'standard', nonReturnableReason:null,
    createdAt:'Jun 3, 2026', updatedAt:'Jun 3, 2026' },
  { id:'PRD-10007', name:'Aurora Activewear Sports Bra Coral', nameAr:'حمالة صدر رياضية أورورا مرجانية',
    sku:'ACT-AUR-SC25-10007', brand:'Aurora Fashion', brandCode:'AUR', vendor:'Aurora Fashion SA', vendorId:'SA11829302',
    category:'Activewear', status:'out_of_stock', approvalStatus:'approved', approvedBy:'Sara Medhat', approvedAt:'Mar 1, 2025',
    markets:['AE','SA'], fulfillment:'consignment', warehouse:'WH-DXB-01',
    price:220, currency:'SAR', thumbnail:null, inventoryTotal:0, variantCount:5,
    isVariable:true, syncSource:'shopify', syncStatus:'synced', lastSync:'6 min ago',
    hasArabic:true, arabicStatus:'human_reviewed',
    returnPolicy:'standard', nonReturnableReason:null,
    createdAt:'Feb 14, 2025', updatedAt:'Jun 2, 2026' },
];

// ── Product detail data (for PRD-10001) ───────────────────
const ZCP_DETAIL_10001 = {
  ...ZCP_PRODUCTS[0],
  brandOriginalSku: 'LV-BLK-RIPPED-2024',
  descriptionEn: 'The Levis Black Ripped Jeans feature a modern distressed aesthetic with precision stitching details. Crafted from premium stretch denim for all-day comfort. Mid-rise fit with a straight leg silhouette.',
  descriptionAr: 'تتميز جينز ليفيس الأسود الممزق بجمالية عصرية مع تفاصيل التطريز الدقيقة. مصنوعة من قماش الدنيم المرن المتميز لراحة طوال اليوم. قصة متوسطة الارتفاع بخط ساق مستقيم.',
  hsCode: '6203.42',
  countryOfOrigin: 'Egypt',
  shippingWeight: 0.8,
  shippingUnit: 'kg',
  tags: ['jeans','denim','ripped','black','women','casual'],
  sizeGuideId: 'sg1',
  careInstructionId: 'ci1',
  syncedData: {
    tags: ['jeans','denim','ripped','black','women','casual'],
    shippingWeight: 0.6, shippingUnit: 'kg',
    category: 'Jeans',
    brandOriginalSku: 'LM-BLK-RIP-28',
  },
  syncedTags: ['jeans','denim','ripped','black','women','casual'],
  syncedShippingWeight: 0.6, syncedShippingUnit: 'kg',
  syncedCategory: 'Jeans',
  syncedAttributes: { color:['Black','White'], size:['28','30','32','34'], material:['Denim'], style:['Slim Fit','Ripped'] },
  completenessScore: 88,
  images: ['img1','img2','img3','img4','img5','img6'],
  attributes: {
    color: ['Beige','Black'],
    size:  ['30','32','34','36','38'],
    material:['Polyester','Cotton'],
    style:['Classic'],
  },
  variants: [
    { id:'v1',  color:'Beige', size:'30', material:'Polyester', style:'Classic', sourceCurrency:'EGP', sourcePrice:600, commissionPct:12, netVendor:528,
      marketPrices:{ AE:199, SA:209, EG:700 }, recommendedLow:{ AE:180, SA:190, EG:650 }, recommendedHigh:{ AE:220, SA:230, EG:780 }, stock:83, sku:'JNS-LME-SC24-10001-BEI-30', variantImg:null },
    { id:'v2',  color:'Beige', size:'32', material:'Polyester', style:'Classic', sourceCurrency:'EGP', sourcePrice:600, commissionPct:12, netVendor:528,
      marketPrices:{ AE:199, SA:209, EG:700 }, recommendedLow:{ AE:180, SA:190, EG:650 }, recommendedHigh:{ AE:220, SA:230, EG:780 }, stock:83, sku:'JNS-LME-SC24-10001-BEI-32', variantImg:null },
    { id:'v3',  color:'Beige', size:'34', material:'Polyester', style:'Classic', sourceCurrency:'EGP', sourcePrice:600, commissionPct:12, netVendor:528,
      marketPrices:{ AE:199, SA:209, EG:700 }, recommendedLow:{ AE:180, SA:190, EG:650 }, recommendedHigh:{ AE:220, SA:230, EG:780 }, stock:41, sku:'JNS-LME-SC24-10001-BEI-34', variantImg:null },
    { id:'v4',  color:'Beige', size:'36', material:'Polyester', style:'Classic', sourceCurrency:'EGP', sourcePrice:600, commissionPct:12, netVendor:528,
      marketPrices:{ AE:199, SA:209, EG:700 }, recommendedLow:{ AE:180, SA:190, EG:650 }, recommendedHigh:{ AE:220, SA:230, EG:780 }, stock:19, sku:'JNS-LME-SC24-10001-BEI-36', variantImg:null },
    { id:'v5',  color:'Beige', size:'38', material:'Polyester', style:'Classic', sourceCurrency:'EGP', sourcePrice:600, commissionPct:12, netVendor:528,
      marketPrices:{ AE:199, SA:209, EG:700 }, recommendedLow:{ AE:180, SA:190, EG:650 }, recommendedHigh:{ AE:220, SA:230, EG:780 }, stock:12, sku:'JNS-LME-SC24-10001-BEI-38', variantImg:null },
    { id:'v6',  color:'Black', size:'30', material:'Cotton',    style:'Classic', sourceCurrency:'EGP', sourcePrice:600, commissionPct:12, netVendor:528,
      marketPrices:{ AE:199, SA:209, EG:700 }, recommendedLow:{ AE:180, SA:190, EG:650 }, recommendedHigh:{ AE:220, SA:230, EG:780 }, stock:83, sku:'JNS-LME-SC24-10001-BLK-30', variantImg:null },
    { id:'v7',  color:'Black', size:'32', material:'Cotton',    style:'Classic', sourceCurrency:'EGP', sourcePrice:600, commissionPct:12, netVendor:528,
      marketPrices:{ AE:199, SA:209, EG:700 }, recommendedLow:{ AE:180, SA:190, EG:650 }, recommendedHigh:{ AE:220, SA:230, EG:780 }, stock:74, sku:'JNS-LME-SC24-10001-BLK-32', variantImg:null },
    { id:'v8',  color:'Black', size:'34', material:'Cotton',    style:'Classic', sourceCurrency:'EGP', sourcePrice:600, commissionPct:12, netVendor:528,
      marketPrices:{ AE:199, SA:209, EG:700 }, recommendedLow:{ AE:180, SA:190, EG:650 }, recommendedHigh:{ AE:220, SA:230, EG:780 }, stock:53, sku:'JNS-LME-SC24-10001-BLK-34', variantImg:null },
    { id:'v9',  color:'Black', size:'36', material:'Cotton',    style:'Classic', sourceCurrency:'EGP', sourcePrice:600, commissionPct:12, netVendor:528,
      marketPrices:{ AE:199, SA:209, EG:700 }, recommendedLow:{ AE:180, SA:190, EG:650 }, recommendedHigh:{ AE:220, SA:230, EG:780 }, stock:28, sku:'JNS-LME-SC24-10001-BLK-36', variantImg:null },
    { id:'v10', color:'Black', size:'38', material:'Cotton',    style:'Classic', sourceCurrency:'EGP', sourcePrice:600, commissionPct:12, netVendor:528,
      marketPrices:{ AE:199, SA:209, EG:700 }, recommendedLow:{ AE:180, SA:190, EG:650 }, recommendedHigh:{ AE:220, SA:230, EG:780 }, stock:22, sku:'JNS-LME-SC24-10001-BLK-38', variantImg:null },
  ],
  seoTitleEn: 'Levis Black Ripped Jeans with Stitching',
  seoDescEn:  'Shop the Levis Black Ripped Jeans with Stitching at Zucci. Premium stretch denim with distressed details. Available in sizes 30–38. Free delivery across UAE, KSA & Egypt.',
  seoTitleAr: 'جينز ليفيس أسود ممزق مع غرز',
  seoDescAr:  'تسوقي جينز ليفيس الأسود الممزق مع الغرز في زوتشي. دنيم ممتد ممتاز مع تفاصيل مهترئة. متوفر بالمقاسات ٣٠–٣٨. توصيل مجاني في الإمارات والسعودية ومصر.',
  activityLog: [
    { actor:'Sara Medhat', role:'admin',  action:'Product approved and set to Active', date:'May 10, 2025' },
    { actor:'Ahmed M.',    role:'vendor', action:'Submitted for review',               date:'May 9, 2025' },
    { actor:'Ahmed M.',    role:'vendor', action:'Updated variant pricing for AE market',date:'Apr 30, 2025' },
    { actor:'System',      role:'system', action:'Arabic auto-translated via AI',       date:'Apr 28, 2025' },
    { actor:'Ahmed M.',    role:'vendor', action:'Product created (synced from Shopify)',date:'Apr 28, 2025' },
  ],
};


// ── Fashion image pool (Unsplash) ─────────────────────────
const ZCP_IMG_POOL = [10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200];
const PICSUM_SEEDS = [10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300];
function imgUrl(id, w=80, h=100) {
  // Convert legacy unsplash id or numeric index to a stable picsum seed
  const seed = typeof id === 'number' ? PICSUM_SEEDS[id % PICSUM_SEEDS.length] : PICSUM_SEEDS[String(id).length * 3 % PICSUM_SEEDS.length];
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

// Enrich detail images immediately (module load)
function enrichDetailImages() {
  ZCP_DETAIL_10001.images = [
    { id:'img1', url:'https://picsum.photos/seed/10/800/1000', alt:'Front view' },
    { id:'img2', url:'https://picsum.photos/seed/20/800/1000', alt:'Model wearing' },
    { id:'img3', url:'https://picsum.photos/seed/30/800/1000', alt:'Detail shot' },
    { id:'img4', url:'https://picsum.photos/seed/40/800/1000', alt:'Editorial' },
    { id:'img5', url:'https://picsum.photos/seed/50/800/1000', alt:'Full look' },
    { id:'img6', url:'https://picsum.photos/seed/60/800/1000', alt:'Alternative angle' },
  ];
  ZCP_DETAIL_10001.syncedImages = [
    { id:'si1', url:'https://picsum.photos/seed/10/800/1000', alt:'Synced main' },
    { id:'si2', url:'https://picsum.photos/seed/30/800/1000', alt:'Synced 2' },
    { id:'si3', url:'https://picsum.photos/seed/20/800/1000', alt:'Synced 3' },
  ];
}
enrichDetailImages();

// ── 300 product generator ─────────────────────────────────
(function generateBulkProducts() {
  const BRANDS = [
    { name:'Le Maillot', code:'LME', vendor:'24K Fashion House', vendorId:'020239328832', cats:['Swimwear','Jeans','Casual Wear','Tops'] },
    { name:'Burgandy',   code:'BRG', vendor:'24K Fashion House', vendorId:'020239328832', cats:['Evening Wear','Dresses','Formal','Jackets'] },
    { name:'7 Wonders',  code:'7WW', vendor:'7 Wonders Trading',  vendorId:'EG78291039',   cats:['Formal','Jackets','Casual Wear','Tops'] },
    { name:'Aurora Fashion',code:'AUR',vendor:'Aurora Fashion SA', vendorId:'SA11829302',  cats:['Activewear','Tops','Swimwear','Casual Wear'] },
    { name:'Almaz Couture',code:'ALC',vendor:'Almaz Couture LLC', vendorId:'AE38829103',   cats:['Dresses','Evening Wear','Tops'] },
    { name:'Cairo Essentials',code:'CCE',vendor:'Cairo Brands Co.',vendorId:'EG29318821',  cats:['Casual Wear','Underwear','Tops','Jeans'] },
    { name:'Zeyylan',    code:'ZYL', vendor:'24K Fashion House', vendorId:'020239328832',   cats:['Casual Wear','Jeans','Activewear','Tops'] },
    { name:'909 Designs',code:'909', vendor:'909 Design Group',  vendorId:'EG91829301',    cats:['Dresses','Tops','Bags & Accessories','Jackets'] },
  ];
  const PROD_NAMES = {
    'Swimwear':          ['Classic One-Piece','High-Neck Bikini','Cut-Out Swimsuit','Bandeau Set','Halter Neck One-Piece','Ribbed Bikini Set','Wrap Coverup','Sporty Swimsuit','Floral Bikini'],
    'Jeans':             ['Slim Fit Denim','High Waist Straight','Ripped Skinny Jeans','Mom Jeans','Wide Leg Denim','Cropped Bootcut','Super Skinny','Boyfriend Jeans','Tapered Jeans'],
    'Casual Wear':       ['Linen Shirt Dress','Jersey Jumpsuit','Casual Midi Dress','Relaxed Co-ord Set','Knit Sweater','Wide Leg Trousers','Casual Shirt','Oversized Tee','Relaxed Trousers'],
    'Tops':              ['Ribbed Tank Top','Sleeveless Blouse','Cropped Jacket','Puff Sleeve Top','Wrap Blouse','Cami Top','Knit Vest','Satin Camisole','Printed Tee'],
    'Evening Wear':      ['Sequin Midi Dress','Draped Gown','Satin Slip Dress','Embellished Mini','Velvet Maxi','One-Shoulder Dress','Ruched Party Dress','Asymmetric Gown'],
    'Dresses':           ['Floral Wrap Dress','A-Line Mini','Shirt Dress','Smocked Midi','Tie-Front Dress','Bodycon Dress','Broderie Midi','Halter Maxi','Pleated Mini'],
    'Formal':            ['Tailored Blazer','Straight Leg Trousers','Double Breasted Suit','Pencil Skirt','Formal Shirt','Structured Jacket','Wide Leg Suit'],
    'Jackets':           ['Oversized Blazer','Leather Biker Jacket','Denim Jacket','Trench Coat','Puffer Jacket','Quilted Vest','Track Jacket'],
    'Activewear':        ['High Waist Leggings','Sports Bra','Running Shorts','Workout Set','Yoga Pants','Racerback Tank','Compression Tights','Zip-Up Hoodie'],
    'Underwear':         ['Cotton Briefs Set','Seamless Brief','Lace Bralette','Comfort Bra','High Waist Brief','Microfibre Set'],
    'Bags & Accessories':['Mini Crossbody Bag','Tote Bag','Chain Shoulder Bag','Clutch Bag','Bucket Bag','Leather Belt','Canvas Tote'],
  };
  const COLORS = ['Black','White','Beige','Navy','Olive','Coral','Cream','Charcoal','Sand','Rust','Forest','Blush','Burgundy','Stone'];
  const SEASONS = ['SC24','FC24','SC25','FC25'];
  const STATUSES = ['active','active','active','active','active','draft','draft','draft','pending_review','pending_review','out_of_stock','archived','rejected'];
  const MARKET_SETS = [['AE','SA'],['AE','SA','EG'],['AE','SA','EG'],['AE'],['EG'],['SA'],['AE','EG'],['AE','SA']];
  const SYNCS = ['shopify','shopify','shopify','api','manual'];
  const PRICES = { 'EGP':[300,2400], 'AED':[80,600], 'SAR':[90,700], 'USD':[40,350] };
  const VENDOR_CURRENCY = { 'LME':'EGP','BRG':'AED','7WW':'USD','AUR':'SAR','ALC':'AED','CCE':'EGP','ZYL':'EGP','909':'EGP' };
  const NON_RETURN_CATS = new Set(['Underwear','Swimwear']);

  let counter = 10008;
  const generated = [];

  for (let i = 0; i < 293; i++) {
    const brand   = BRANDS[i % BRANDS.length];
    const cat     = brand.cats[i % brand.cats.length];
    const names   = PROD_NAMES[cat] || PROD_NAMES['Tops'];
    const pName   = names[i % names.length];
    const color   = COLORS[i % COLORS.length];
    const season  = SEASONS[i % SEASONS.length];
    const status  = STATUSES[i % STATUSES.length];
    const markets = MARKET_SETS[i % MARKET_SETS.length];
    const sync    = SYNCS[i % SYNCS.length];
    const cur     = VENDOR_CURRENCY[brand.code];
    const pRange  = PRICES[cur] || PRICES['EGP'];
    const price   = pRange[0] + Math.round(((i * 37 + 19) % (pRange[1]-pRange[0])) / 50) * 50;
    const imgId   = ZCP_IMG_POOL[(i * 3 + 7) % ZCP_IMG_POOL.length];

    generated.push({
      id: 'PRD-' + (++counter),
      name: brand.name + ' ' + color + ' ' + pName,
      nameAr: '',
      sku: (ZCP_CATEGORY_CODES[cat]||'GEN') + '-' + brand.code + '-' + season + '-' + counter,
      brand: brand.name, brandCode: brand.code, vendor: brand.vendor, vendorId: brand.vendorId,
      category: cat,
      status: status,
      approvalStatus: status === 'pending_review' ? 'pending' : status === 'rejected' ? 'rejected' : status === 'active' ? 'approved' : 'draft',
      markets: markets,
      fulfillment: i % 3 === 0 ? 'direct_ship' : 'consignment',
      warehouse: i % 3 === 0 ? null : (markets.includes('AE') ? 'WH-DXB-01' : 'WH-CAI-01'),
      price: price, currency: cur,
      thumbnail: imgUrl(imgId, 80, 100),
      inventoryTotal: status === 'out_of_stock' ? 0 : 10 + (i * 7) % 200,
      variantCount: 1 + (i % 6),
      isVariable: i % 4 !== 0,
      syncSource: sync,
      syncStatus: sync !== 'manual' ? 'synced' : 'manual',
      lastSync: sync !== 'manual' ? (i % 3 === 0 ? '2 min ago' : i % 3 === 1 ? '1 hour ago' : '3 hours ago') : null,
      hasArabic: i % 3 !== 0,
      arabicStatus: i % 3 === 1 ? 'ai_reviewed' : i % 3 === 2 ? 'human_reviewed' : 'not_translated',
      returnPolicy: NON_RETURN_CATS.has(cat) ? 'non_returnable' : 'standard',
      nonReturnableReason: NON_RETURN_CATS.has(cat) ? cat + ' — non-returnable by law' : null,
      completenessScore: 40 + (i * 13) % 60,
      createdAt: 'Jan 1, 2025', updatedAt: 'Jun 1, 2026',
    });
  }

  // Push directly to local ZCP_PRODUCTS array (window assignment happens after)
  if (typeof ZCP_PRODUCTS !== 'undefined') ZCP_PRODUCTS.push(...generated);
})();


export {
  ZCP_PRODUCTS,
  ZCP_DETAIL_10001,
  ZCP_SIZE_GUIDES,
  ZCP_CARE_INSTRUCTIONS,
  ZCP_CATEGORY_CODES,
  generateSKU,
  imgUrl,
};
