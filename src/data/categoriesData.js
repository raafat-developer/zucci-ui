// zucci-categories-data.jsx — Products + Marketplace categories data

const ZC_MARKETS = ['AE','SA','EG','KW','BH','QA','OM'];

// ── Products (internal Zucci) categories ─────────────────
const ZC_CATEGORIES = [
  {
    id:'CAT-001', slug:'womens-fashion', label:"Women's Fashion",
    description:"All women's clothing, modest wear, and accessories",
    status:'active', private:false, featured:true, sort:1,
    seo_title:"Women's Fashion | Zucci", seo_desc:"Shop the latest women's fashion at Zucci.", seo_slug:'womens-fashion',
    product_count:1842, banner:null, created_by:'Zucci Admin', created_at:'2024-01-15',
    markets:{
      AE:{ enabled:true,  min_listings:80, listing_count:842, vendor_count:28 },
      SA:{ enabled:true,  min_listings:60, listing_count:614, vendor_count:22 },
      EG:{ enabled:true,  min_listings:40, listing_count:218, vendor_count:14 },
      KW:{ enabled:true,  min_listings:30, listing_count:98,  vendor_count:9  },
      BH:{ enabled:true,  min_listings:20, listing_count:42,  vendor_count:6  },
      QA:{ enabled:true,  min_listings:20, listing_count:61,  vendor_count:7  },
      OM:{ enabled:false, min_listings:20, listing_count:0,   vendor_count:0  },
    },
    children:[
      { id:'CAT-001-01', slug:'abayas',           label:'Abayas',            status:'active', private:false, sort:1, product_count:412, markets:{ AE:{enabled:true,min_listings:30,listing_count:184,vendor_count:12}, SA:{enabled:true,min_listings:25,listing_count:142,vendor_count:10}, EG:{enabled:true,min_listings:15,listing_count:62,vendor_count:7}, KW:{enabled:true,min_listings:10,listing_count:24,vendor_count:4}, BH:{enabled:true,min_listings:8,listing_count:9,vendor_count:3}, QA:{enabled:true,min_listings:8,listing_count:11,vendor_count:3}, OM:{enabled:false,min_listings:8,listing_count:0,vendor_count:0} }, children:[] },
      { id:'CAT-001-02', slug:'modest-tops',       label:'Modest Tops',       status:'active', private:false, sort:2, product_count:318, markets:{ AE:{enabled:true,min_listings:25,listing_count:148,vendor_count:10}, SA:{enabled:true,min_listings:20,listing_count:101,vendor_count:8}, EG:{enabled:true,min_listings:12,listing_count:44,vendor_count:5}, KW:{enabled:true,min_listings:8,listing_count:18,vendor_count:3}, BH:{enabled:false,min_listings:8,listing_count:0,vendor_count:0}, QA:{enabled:true,min_listings:8,listing_count:7,vendor_count:2}, OM:{enabled:false,min_listings:8,listing_count:0,vendor_count:0} }, children:[] },
      { id:'CAT-001-03', slug:'modest-dresses',    label:'Modest Dresses',    status:'active', private:false, sort:3, product_count:285, markets:{ AE:{enabled:true,min_listings:20,listing_count:128,vendor_count:9}, SA:{enabled:true,min_listings:15,listing_count:94,vendor_count:7}, EG:{enabled:true,min_listings:10,listing_count:38,vendor_count:5}, KW:{enabled:true,min_listings:8,listing_count:16,vendor_count:3}, BH:{enabled:true,min_listings:6,listing_count:4,vendor_count:2}, QA:{enabled:true,min_listings:6,listing_count:8,vendor_count:2}, OM:{enabled:false,min_listings:6,listing_count:0,vendor_count:0} }, children:[] },
      { id:'CAT-001-04', slug:'hijabs-scarves',    label:'Hijabs & Scarves',  status:'active', private:false, sort:4, product_count:224, markets:{ AE:{enabled:true,min_listings:20,listing_count:98,vendor_count:8}, SA:{enabled:true,min_listings:15,listing_count:78,vendor_count:7}, EG:{enabled:true,min_listings:10,listing_count:32,vendor_count:4}, KW:{enabled:true,min_listings:8,listing_count:14,vendor_count:3}, BH:{enabled:true,min_listings:6,listing_count:6,vendor_count:2}, QA:{enabled:true,min_listings:6,listing_count:7,vendor_count:2}, OM:{enabled:false,min_listings:6,listing_count:0,vendor_count:0} }, children:[] },
      { id:'CAT-001-05', slug:'kaftans-jalabiya',  label:'Kaftans & Jalabiya',status:'active', private:false, sort:5, product_count:198, markets:{ AE:{enabled:true,min_listings:15,listing_count:84,vendor_count:7}, SA:{enabled:true,min_listings:12,listing_count:68,vendor_count:6}, EG:{enabled:true,min_listings:8,listing_count:28,vendor_count:4}, KW:{enabled:false,min_listings:8,listing_count:0,vendor_count:0}, BH:{enabled:false,min_listings:6,listing_count:0,vendor_count:0}, QA:{enabled:true,min_listings:6,listing_count:9,vendor_count:2}, OM:{enabled:false,min_listings:6,listing_count:0,vendor_count:0} }, children:[] },
      { id:'CAT-001-06', slug:'loungewear',        label:'Loungewear',        status:'active', private:false, sort:6, product_count:148, markets:{ AE:{enabled:true,min_listings:15,listing_count:62,vendor_count:6}, SA:{enabled:true,min_listings:12,listing_count:48,vendor_count:5}, EG:{enabled:true,min_listings:8,listing_count:14,vendor_count:3}, KW:{enabled:true,min_listings:6,listing_count:11,vendor_count:2}, BH:{enabled:false,min_listings:6,listing_count:0,vendor_count:0}, QA:{enabled:false,min_listings:6,listing_count:0,vendor_count:0}, OM:{enabled:false,min_listings:6,listing_count:0,vendor_count:0} }, children:[] },
      { id:'CAT-001-07', slug:'swimwear',          label:'Swimwear (Modest)', status:'active', private:false, sort:7, product_count:92,  markets:{ AE:{enabled:true,min_listings:10,listing_count:42,vendor_count:5}, SA:{enabled:false,min_listings:10,listing_count:0,vendor_count:0}, EG:{enabled:true,min_listings:8,listing_count:22,vendor_count:3}, KW:{enabled:false,min_listings:8,listing_count:0,vendor_count:0}, BH:{enabled:false,min_listings:6,listing_count:0,vendor_count:0}, QA:{enabled:false,min_listings:6,listing_count:0,vendor_count:0}, OM:{enabled:false,min_listings:6,listing_count:0,vendor_count:0} }, children:[] },
      { id:'CAT-001-08', slug:'womens-sale',       label:'Sale',              status:'active', private:true,  sort:8, product_count:257, markets:{ AE:{enabled:true,min_listings:20,listing_count:124,vendor_count:10}, SA:{enabled:true,min_listings:15,listing_count:84,vendor_count:8}, EG:{enabled:false,min_listings:10,listing_count:0,vendor_count:0}, KW:{enabled:false,min_listings:8,listing_count:0,vendor_count:0}, BH:{enabled:false,min_listings:6,listing_count:0,vendor_count:0}, QA:{enabled:false,min_listings:6,listing_count:0,vendor_count:0}, OM:{enabled:false,min_listings:6,listing_count:0,vendor_count:0} }, children:[] },
    ]
  },
  {
    id:'CAT-002', slug:'mens-fashion', label:"Men's Fashion",
    description:"Men's clothing, kanduras, thobes, and accessories",
    status:'active', private:false, featured:true, sort:2,
    seo_title:"Men's Fashion | Zucci", seo_desc:"Shop men's fashion at Zucci.", seo_slug:'mens-fashion',
    product_count:986, banner:null, created_by:'Zucci Admin', created_at:'2024-01-15',
    markets:{
      AE:{ enabled:true,  min_listings:50, listing_count:412, vendor_count:18 },
      SA:{ enabled:true,  min_listings:40, listing_count:298, vendor_count:15 },
      EG:{ enabled:true,  min_listings:25, listing_count:142, vendor_count:10 },
      KW:{ enabled:true,  min_listings:20, listing_count:74,  vendor_count:7  },
      BH:{ enabled:true,  min_listings:15, listing_count:38,  vendor_count:5  },
      QA:{ enabled:true,  min_listings:15, listing_count:44,  vendor_count:5  },
      OM:{ enabled:true,  min_listings:15, listing_count:21,  vendor_count:4  },
    },
    children:[
      { id:'CAT-002-01', slug:'kanduras-thobes', label:'Kanduras & Thobes', status:'active', private:false, sort:1, product_count:312, markets:{ AE:{enabled:true,min_listings:20,listing_count:168,vendor_count:12}, SA:{enabled:true,min_listings:18,listing_count:142,vendor_count:10}, EG:{enabled:true,min_listings:10,listing_count:62,vendor_count:7}, KW:{enabled:true,min_listings:8,listing_count:34,vendor_count:5}, BH:{enabled:true,min_listings:6,listing_count:18,vendor_count:3}, QA:{enabled:true,min_listings:6,listing_count:22,vendor_count:3}, OM:{enabled:true,min_listings:6,listing_count:11,vendor_count:2} }, children:[] },
      { id:'CAT-002-02', slug:'mens-casual',     label:'Casual Wear',       status:'active', private:false, sort:2, product_count:198, markets:{ AE:{enabled:true,min_listings:15,listing_count:104,vendor_count:9}, SA:{enabled:true,min_listings:12,listing_count:78,vendor_count:7}, EG:{enabled:true,min_listings:8,listing_count:44,vendor_count:5}, KW:{enabled:true,min_listings:6,listing_count:22,vendor_count:3}, BH:{enabled:true,min_listings:5,listing_count:9,vendor_count:2}, QA:{enabled:true,min_listings:5,listing_count:11,vendor_count:2}, OM:{enabled:true,min_listings:5,listing_count:6,vendor_count:1} }, children:[] },
      { id:'CAT-002-03', slug:'mens-formal',     label:'Formal & Business', status:'active', private:false, sort:3, product_count:145, markets:{ AE:{enabled:true,min_listings:12,listing_count:74,vendor_count:7}, SA:{enabled:true,min_listings:10,listing_count:48,vendor_count:5}, EG:{enabled:true,min_listings:6,listing_count:22,vendor_count:4}, KW:{enabled:true,min_listings:5,listing_count:12,vendor_count:2}, BH:{enabled:false,min_listings:5,listing_count:0,vendor_count:0}, QA:{enabled:true,min_listings:5,listing_count:8,vendor_count:2}, OM:{enabled:false,min_listings:5,listing_count:0,vendor_count:0} }, children:[] },
      { id:'CAT-002-04', slug:'mens-sportswear', label:'Sportswear',         status:'active', private:false, sort:4, product_count:187, markets:{ AE:{enabled:true,min_listings:12,listing_count:98,vendor_count:8}, SA:{enabled:true,min_listings:10,listing_count:62,vendor_count:6}, EG:{enabled:true,min_listings:6,listing_count:28,vendor_count:4}, KW:{enabled:true,min_listings:5,listing_count:14,vendor_count:3}, BH:{enabled:false,min_listings:5,listing_count:0,vendor_count:0}, QA:{enabled:true,min_listings:5,listing_count:9,vendor_count:2}, OM:{enabled:false,min_listings:5,listing_count:0,vendor_count:0} }, children:[] },
      { id:'CAT-002-05', slug:'mens-accessories',label:'Accessories',         status:'active', private:false, sort:5, product_count:144, markets:{ AE:{enabled:true,min_listings:10,listing_count:68,vendor_count:6}, SA:{enabled:true,min_listings:8,listing_count:44,vendor_count:5}, EG:{enabled:true,min_listings:5,listing_count:18,vendor_count:3}, KW:{enabled:false,min_listings:5,listing_count:0,vendor_count:0}, BH:{enabled:false,min_listings:4,listing_count:0,vendor_count:0}, QA:{enabled:false,min_listings:4,listing_count:0,vendor_count:0}, OM:{enabled:false,min_listings:4,listing_count:0,vendor_count:0} }, children:[] },
    ]
  },
  {
    id:'CAT-003', slug:'kids', label:"Kids' Fashion",
    description:"Children's clothing from newborn to 16 years",
    status:'active', private:false, featured:false, sort:3,
    seo_title:"Kids' Fashion | Zucci", seo_desc:"Shop kids' fashion.", seo_slug:'kids',
    product_count:654, banner:null, created_by:'Zucci Admin', created_at:'2024-02-01',
    markets:{
      AE:{ enabled:true,  min_listings:40, listing_count:284, vendor_count:14 },
      SA:{ enabled:true,  min_listings:30, listing_count:198, vendor_count:11 },
      EG:{ enabled:true,  min_listings:20, listing_count:98,  vendor_count:8  },
      KW:{ enabled:true,  min_listings:15, listing_count:44,  vendor_count:5  },
      BH:{ enabled:false, min_listings:10, listing_count:0,   vendor_count:0  },
      QA:{ enabled:true,  min_listings:10, listing_count:28,  vendor_count:4  },
      OM:{ enabled:false, min_listings:10, listing_count:0,   vendor_count:0  },
    },
    children:[
      { id:'CAT-003-01', slug:'babies-0-24m', label:'Babies (0–24m)', status:'active', private:false, sort:1, product_count:198, markets:{ AE:{enabled:true,min_listings:12,listing_count:88,vendor_count:7}, SA:{enabled:true,min_listings:10,listing_count:62,vendor_count:6}, EG:{enabled:true,min_listings:6,listing_count:28,vendor_count:4}, KW:{enabled:true,min_listings:5,listing_count:14,vendor_count:3}, BH:{enabled:false,min_listings:4,listing_count:0,vendor_count:0}, QA:{enabled:true,min_listings:4,listing_count:8,vendor_count:2}, OM:{enabled:false,min_listings:4,listing_count:0,vendor_count:0} }, children:[] },
      { id:'CAT-003-02', slug:'girls-2-12',   label:'Girls (2–12)',   status:'active', private:false, sort:2, product_count:245, markets:{ AE:{enabled:true,min_listings:14,listing_count:108,vendor_count:8}, SA:{enabled:true,min_listings:12,listing_count:78,vendor_count:6}, EG:{enabled:true,min_listings:8,listing_count:38,vendor_count:4}, KW:{enabled:true,min_listings:6,listing_count:18,vendor_count:3}, BH:{enabled:false,min_listings:4,listing_count:0,vendor_count:0}, QA:{enabled:true,min_listings:4,listing_count:12,vendor_count:2}, OM:{enabled:false,min_listings:4,listing_count:0,vendor_count:0} }, children:[] },
      { id:'CAT-003-03', slug:'boys-2-12',    label:'Boys (2–12)',    status:'active', private:false, sort:3, product_count:211, markets:{ AE:{enabled:true,min_listings:14,listing_count:88,vendor_count:7}, SA:{enabled:true,min_listings:12,listing_count:58,vendor_count:5}, EG:{enabled:true,min_listings:8,listing_count:32,vendor_count:4}, KW:{enabled:true,min_listings:6,listing_count:12,vendor_count:2}, BH:{enabled:false,min_listings:4,listing_count:0,vendor_count:0}, QA:{enabled:true,min_listings:4,listing_count:8,vendor_count:2}, OM:{enabled:false,min_listings:4,listing_count:0,vendor_count:0} }, children:[] },
    ]
  },
  {
    id:'CAT-004', slug:'beauty-fragrance', label:'Beauty & Fragrance',
    description:"Perfumes, ouds, skincare, and makeup",
    status:'active', private:false, featured:true, sort:4,
    seo_title:"Beauty & Fragrance | Zucci", seo_desc:"Shop beauty and fragrance.", seo_slug:'beauty-fragrance',
    product_count:743, banner:null, created_by:'Zucci Admin', created_at:'2024-01-20',
    markets:{
      AE:{ enabled:true,  min_listings:40, listing_count:312, vendor_count:24 },
      SA:{ enabled:true,  min_listings:35, listing_count:228, vendor_count:18 },
      EG:{ enabled:true,  min_listings:20, listing_count:112, vendor_count:12 },
      KW:{ enabled:true,  min_listings:15, listing_count:62,  vendor_count:8  },
      BH:{ enabled:true,  min_listings:10, listing_count:28,  vendor_count:5  },
      QA:{ enabled:true,  min_listings:10, listing_count:38,  vendor_count:6  },
      OM:{ enabled:true,  min_listings:10, listing_count:21,  vendor_count:4  },
    },
    children:[
      { id:'CAT-004-01', slug:'oud-bakhoor', label:'Oud & Bakhoor', status:'active', private:false, sort:1, product_count:186, markets:{ AE:{enabled:true,min_listings:15,listing_count:84,vendor_count:12}, SA:{enabled:true,min_listings:12,listing_count:68,vendor_count:10}, EG:{enabled:true,min_listings:8,listing_count:34,vendor_count:6}, KW:{enabled:true,min_listings:6,listing_count:22,vendor_count:4}, BH:{enabled:true,min_listings:4,listing_count:12,vendor_count:3}, QA:{enabled:true,min_listings:4,listing_count:14,vendor_count:3}, OM:{enabled:true,min_listings:4,listing_count:8,vendor_count:2} }, children:[] },
      { id:'CAT-004-02', slug:'perfumes',    label:'Perfumes',       status:'active', private:false, sort:2, product_count:224, markets:{ AE:{enabled:true,min_listings:15,listing_count:104,vendor_count:14}, SA:{enabled:true,min_listings:12,listing_count:82,vendor_count:11}, EG:{enabled:true,min_listings:8,listing_count:42,vendor_count:7}, KW:{enabled:true,min_listings:6,listing_count:24,vendor_count:4}, BH:{enabled:true,min_listings:4,listing_count:8,vendor_count:2}, QA:{enabled:true,min_listings:4,listing_count:14,vendor_count:3}, OM:{enabled:true,min_listings:4,listing_count:7,vendor_count:2} }, children:[] },
      { id:'CAT-004-03', slug:'skincare',    label:'Skincare',        status:'active', private:false, sort:3, product_count:198, markets:{ AE:{enabled:true,min_listings:12,listing_count:82,vendor_count:10}, SA:{enabled:true,min_listings:10,listing_count:52,vendor_count:8}, EG:{enabled:true,min_listings:6,listing_count:22,vendor_count:5}, KW:{enabled:true,min_listings:5,listing_count:12,vendor_count:3}, BH:{enabled:false,min_listings:4,listing_count:0,vendor_count:0}, QA:{enabled:true,min_listings:4,listing_count:7,vendor_count:2}, OM:{enabled:false,min_listings:4,listing_count:0,vendor_count:0} }, children:[] },
      { id:'CAT-004-04', slug:'makeup',      label:'Makeup',          status:'active', private:false, sort:4, product_count:135, markets:{ AE:{enabled:true,min_listings:10,listing_count:42,vendor_count:7}, SA:{enabled:true,min_listings:8,listing_count:26,vendor_count:5}, EG:{enabled:true,min_listings:5,listing_count:14,vendor_count:3}, KW:{enabled:false,min_listings:4,listing_count:0,vendor_count:0}, BH:{enabled:false,min_listings:3,listing_count:0,vendor_count:0}, QA:{enabled:true,min_listings:3,listing_count:3,vendor_count:1}, OM:{enabled:false,min_listings:3,listing_count:0,vendor_count:0} }, children:[] },
    ]
  },
  {
    id:'CAT-005', slug:'accessories', label:'Accessories',
    description:"Bags, sunglasses, jewellery, belts, and wallets",
    status:'active', private:false, featured:false, sort:5,
    seo_title:"Accessories | Zucci", seo_desc:"Shop accessories at Zucci.", seo_slug:'accessories',
    product_count:512, banner:null, created_by:'Zucci Admin', created_at:'2024-01-15',
    markets:{
      AE:{ enabled:true,  min_listings:30, listing_count:198, vendor_count:16 },
      SA:{ enabled:true,  min_listings:25, listing_count:144, vendor_count:12 },
      EG:{ enabled:true,  min_listings:15, listing_count:68,  vendor_count:8  },
      KW:{ enabled:true,  min_listings:10, listing_count:38,  vendor_count:5  },
      BH:{ enabled:false, min_listings:8,  listing_count:0,   vendor_count:0  },
      QA:{ enabled:true,  min_listings:8,  listing_count:22,  vendor_count:4  },
      OM:{ enabled:false, min_listings:8,  listing_count:0,   vendor_count:0  },
    },
    children:[
      { id:'CAT-005-01', slug:'bags-handbags', label:'Bags & Handbags', status:'active', private:false, sort:1, product_count:142, markets:{ AE:{enabled:true,min_listings:12,listing_count:62,vendor_count:8}, SA:{enabled:true,min_listings:10,listing_count:44,vendor_count:6}, EG:{enabled:true,min_listings:6,listing_count:22,vendor_count:4}, KW:{enabled:true,min_listings:5,listing_count:14,vendor_count:3}, BH:{enabled:false,min_listings:4,listing_count:0,vendor_count:0}, QA:{enabled:true,min_listings:4,listing_count:8,vendor_count:2}, OM:{enabled:false,min_listings:4,listing_count:0,vendor_count:0} }, children:[] },
      { id:'CAT-005-02', slug:'sunglasses',    label:'Sunglasses',     status:'active', private:false, sort:2, product_count:98,  markets:{ AE:{enabled:true,min_listings:8,listing_count:44,vendor_count:6}, SA:{enabled:true,min_listings:6,listing_count:32,vendor_count:5}, EG:{enabled:true,min_listings:4,listing_count:18,vendor_count:3}, KW:{enabled:false,min_listings:4,listing_count:0,vendor_count:0}, BH:{enabled:false,min_listings:3,listing_count:0,vendor_count:0}, QA:{enabled:true,min_listings:3,listing_count:6,vendor_count:2}, OM:{enabled:false,min_listings:3,listing_count:0,vendor_count:0} }, children:[] },
      { id:'CAT-005-03', slug:'jewellery',     label:'Jewellery',      status:'active', private:false, sort:3, product_count:164, markets:{ AE:{enabled:true,min_listings:12,listing_count:62,vendor_count:7}, SA:{enabled:true,min_listings:10,listing_count:42,vendor_count:5}, EG:{enabled:true,min_listings:6,listing_count:18,vendor_count:4}, KW:{enabled:true,min_listings:4,listing_count:14,vendor_count:2}, BH:{enabled:false,min_listings:3,listing_count:0,vendor_count:0}, QA:{enabled:true,min_listings:3,listing_count:6,vendor_count:2}, OM:{enabled:false,min_listings:3,listing_count:0,vendor_count:0} }, children:[] },
      { id:'CAT-005-04', slug:'belts-wallets', label:'Belts & Wallets',status:'active', private:false, sort:4, product_count:108, markets:{ AE:{enabled:true,min_listings:8,listing_count:30,vendor_count:5}, SA:{enabled:true,min_listings:6,listing_count:26,vendor_count:4}, EG:{enabled:true,min_listings:4,listing_count:10,vendor_count:3}, KW:{enabled:false,min_listings:3,listing_count:0,vendor_count:0}, BH:{enabled:false,min_listings:2,listing_count:0,vendor_count:0}, QA:{enabled:false,min_listings:2,listing_count:0,vendor_count:0}, OM:{enabled:false,min_listings:2,listing_count:0,vendor_count:0} }, children:[] },
    ]
  },
  {
    id:'CAT-006', slug:'footwear', label:'Footwear',
    description:"Shoes, sandals, and sports footwear",
    status:'active', private:false, featured:true, sort:6,
    seo_title:"Footwear | Zucci", seo_desc:"Shop footwear at Zucci.", seo_slug:'footwear',
    product_count:438, banner:null, created_by:'Zucci Admin', created_at:'2024-01-15',
    markets:{
      AE:{ enabled:true,  min_listings:30, listing_count:188, vendor_count:14 },
      SA:{ enabled:true,  min_listings:25, listing_count:128, vendor_count:10 },
      EG:{ enabled:true,  min_listings:15, listing_count:62,  vendor_count:7  },
      KW:{ enabled:true,  min_listings:10, listing_count:34,  vendor_count:5  },
      BH:{ enabled:true,  min_listings:8,  listing_count:14,  vendor_count:3  },
      QA:{ enabled:true,  min_listings:8,  listing_count:18,  vendor_count:4  },
      OM:{ enabled:false, min_listings:8,  listing_count:0,   vendor_count:0  },
    },
    children:[
      { id:'CAT-006-01', slug:'sneakers',     label:'Sneakers',            status:'active', private:false, sort:1, product_count:187, markets:{ AE:{enabled:true,min_listings:12,listing_count:84,vendor_count:8}, SA:{enabled:true,min_listings:10,listing_count:58,vendor_count:6}, EG:{enabled:true,min_listings:6,listing_count:28,vendor_count:4}, KW:{enabled:true,min_listings:5,listing_count:14,vendor_count:3}, BH:{enabled:true,min_listings:4,listing_count:6,vendor_count:2}, QA:{enabled:true,min_listings:4,listing_count:9,vendor_count:2}, OM:{enabled:false,min_listings:4,listing_count:0,vendor_count:0} }, children:[] },
      { id:'CAT-006-02', slug:'sandals',      label:'Sandals & Slippers',  status:'active', private:false, sort:2, product_count:124, markets:{ AE:{enabled:true,min_listings:10,listing_count:58,vendor_count:6}, SA:{enabled:true,min_listings:8,listing_count:38,vendor_count:5}, EG:{enabled:true,min_listings:5,listing_count:18,vendor_count:3}, KW:{enabled:true,min_listings:4,listing_count:12,vendor_count:2}, BH:{enabled:true,min_listings:3,listing_count:5,vendor_count:1}, QA:{enabled:true,min_listings:3,listing_count:6,vendor_count:2}, OM:{enabled:false,min_listings:3,listing_count:0,vendor_count:0} }, children:[] },
      { id:'CAT-006-03', slug:'formal-shoes', label:'Formal Shoes',        status:'active', private:false, sort:3, product_count:127, markets:{ AE:{enabled:true,min_listings:10,listing_count:46,vendor_count:5}, SA:{enabled:true,min_listings:8,listing_count:32,vendor_count:4}, EG:{enabled:true,min_listings:5,listing_count:16,vendor_count:3}, KW:{enabled:false,min_listings:4,listing_count:0,vendor_count:0}, BH:{enabled:false,min_listings:3,listing_count:0,vendor_count:0}, QA:{enabled:false,min_listings:3,listing_count:0,vendor_count:0}, OM:{enabled:false,min_listings:3,listing_count:0,vendor_count:0} }, children:[] },
    ]
  },
  {
    id:'CAT-007', slug:'sports-outdoor', label:'Sports & Outdoor',
    description:"Activewear, sports equipment, and outdoor gear",
    status:'active', private:false, featured:false, sort:7,
    seo_title:"Sports & Outdoor | Zucci", seo_desc:"Shop sports gear.", seo_slug:'sports-outdoor',
    product_count:321, banner:null, created_by:'Zucci Admin', created_at:'2024-03-01',
    markets:{
      AE:{ enabled:true,  min_listings:25, listing_count:142, vendor_count:11 },
      SA:{ enabled:true,  min_listings:20, listing_count:98,  vendor_count:8  },
      EG:{ enabled:true,  min_listings:12, listing_count:42,  vendor_count:5  },
      KW:{ enabled:true,  min_listings:8,  listing_count:24,  vendor_count:4  },
      BH:{ enabled:false, min_listings:6,  listing_count:0,   vendor_count:0  },
      QA:{ enabled:true,  min_listings:6,  listing_count:14,  vendor_count:3  },
      OM:{ enabled:false, min_listings:6,  listing_count:0,   vendor_count:0  },
    },
    children:[
      { id:'CAT-007-01', slug:'activewear',        label:'Activewear',        status:'active', private:false, sort:1, product_count:198, markets:{ AE:{enabled:true,min_listings:12,listing_count:84,vendor_count:8}, SA:{enabled:true,min_listings:10,listing_count:58,vendor_count:6}, EG:{enabled:true,min_listings:6,listing_count:26,vendor_count:4}, KW:{enabled:true,min_listings:5,listing_count:14,vendor_count:3}, BH:{enabled:false,min_listings:4,listing_count:0,vendor_count:0}, QA:{enabled:true,min_listings:4,listing_count:8,vendor_count:2}, OM:{enabled:false,min_listings:4,listing_count:0,vendor_count:0} }, children:[] },
      { id:'CAT-007-02', slug:'sports-equipment',  label:'Sports Equipment',  status:'active', private:false, sort:2, product_count:123, markets:{ AE:{enabled:true,min_listings:10,listing_count:58,vendor_count:6}, SA:{enabled:true,min_listings:8,listing_count:40,vendor_count:5}, EG:{enabled:true,min_listings:5,listing_count:16,vendor_count:3}, KW:{enabled:true,min_listings:4,listing_count:10,vendor_count:2}, BH:{enabled:false,min_listings:3,listing_count:0,vendor_count:0}, QA:{enabled:false,min_listings:3,listing_count:0,vendor_count:0}, OM:{enabled:false,min_listings:3,listing_count:0,vendor_count:0} }, children:[] },
    ]
  },
  {
    id:'CAT-008', slug:'b2b-wholesale', label:'B2B / Wholesale',
    description:"Private bulk ordering for corporate clients",
    status:'active', private:true, featured:false, sort:8,
    seo_title:'', seo_desc:'', seo_slug:'b2b',
    product_count:124, banner:null, created_by:'Zucci Admin', created_at:'2024-06-01',
    markets:{
      AE:{ enabled:true,  min_listings:10, listing_count:68, vendor_count:8 },
      SA:{ enabled:true,  min_listings:8,  listing_count:42, vendor_count:6 },
      EG:{ enabled:false, min_listings:5,  listing_count:0,  vendor_count:0 },
      KW:{ enabled:false, min_listings:5,  listing_count:0,  vendor_count:0 },
      BH:{ enabled:false, min_listings:4,  listing_count:0,  vendor_count:0 },
      QA:{ enabled:false, min_listings:4,  listing_count:0,  vendor_count:0 },
      OM:{ enabled:false, min_listings:4,  listing_count:0,  vendor_count:0 },
    },
    children:[], _note:'Private — approved B2B accounts only'
  },
];

// ── Marketplace (vendor-facing) categories ────────────────
const ZC_MARKETPLACE_CATS = [
  {
    id:'MC-001', slug:'women-clothing', label:'Women — Clothing',
    mapped_to:'CAT-001', mapped_label:"Women's Fashion",
    status:'active', vendor_count:48, listing_count:3241,
    commission_pct:15, requires_approval:true,
    listing_requirements:['Brand certification','Authentic product photos','Size chart upload required'],
    markets:{
      AE:{ enabled:true,  commission_pct:15, min_listings:80, listing_count:1484, vendor_count:28 },
      SA:{ enabled:true,  commission_pct:14, min_listings:60, listing_count:984,  vendor_count:22 },
      EG:{ enabled:true,  commission_pct:16, min_listings:40, listing_count:412,  vendor_count:14 },
      KW:{ enabled:true,  commission_pct:15, min_listings:30, listing_count:184,  vendor_count:9  },
      BH:{ enabled:true,  commission_pct:15, min_listings:20, listing_count:82,   vendor_count:6  },
      QA:{ enabled:true,  commission_pct:15, min_listings:20, listing_count:95,   vendor_count:7  },
      OM:{ enabled:false, commission_pct:15, min_listings:20, listing_count:0,    vendor_count:0  },
    },
    children:[
      { id:'MC-001-01', slug:'modest-clothing', label:'Modest Wear',    mapped_to:'CAT-001-01', commission_pct:15, status:'active', listing_count:1102 },
      { id:'MC-001-02', slug:'formal-wear',     label:'Formal & Evening',mapped_to:'CAT-001-03', commission_pct:14, status:'active', listing_count:544  },
      { id:'MC-001-03', slug:'casual-tops',     label:'Casual Tops',    mapped_to:'CAT-001-02', commission_pct:15, status:'active', listing_count:711  },
    ]
  },
  {
    id:'MC-002', slug:'men-clothing', label:"Men — Clothing",
    mapped_to:'CAT-002', mapped_label:"Men's Fashion",
    status:'active', vendor_count:32, listing_count:1654,
    commission_pct:13, requires_approval:false,
    listing_requirements:['Authentic product photos','Size chart upload required'],
    markets:{
      AE:{ enabled:true,  commission_pct:13, min_listings:50, listing_count:684, vendor_count:18 },
      SA:{ enabled:true,  commission_pct:12, min_listings:40, listing_count:484, vendor_count:15 },
      EG:{ enabled:true,  commission_pct:14, min_listings:25, listing_count:284, vendor_count:10 },
      KW:{ enabled:true,  commission_pct:13, min_listings:20, listing_count:124, vendor_count:7  },
      BH:{ enabled:true,  commission_pct:13, min_listings:15, listing_count:48,  vendor_count:5  },
      QA:{ enabled:true,  commission_pct:13, min_listings:15, listing_count:62,  vendor_count:5  },
      OM:{ enabled:true,  commission_pct:13, min_listings:15, listing_count:28,  vendor_count:4  },
    },
    children:[
      { id:'MC-002-01', slug:'traditional-wear', label:'Traditional & Cultural', mapped_to:'CAT-002-01', commission_pct:12, status:'active', listing_count:612 },
      { id:'MC-002-02', slug:'men-casual',        label:'Casual & Streetwear',   mapped_to:'CAT-002-02', commission_pct:13, status:'active', listing_count:541 },
    ]
  },
  {
    id:'MC-003', slug:'fragrance-beauty', label:'Fragrance & Beauty',
    mapped_to:'CAT-004', mapped_label:'Beauty & Fragrance',
    status:'active', vendor_count:61, listing_count:2187,
    commission_pct:18, requires_approval:true,
    listing_requirements:['Health/Safety compliance doc','Ingredient list (INCI)','Batch codes required','Fragrance concentration disclosure'],
    markets:{
      AE:{ enabled:true,  commission_pct:18, min_listings:40, listing_count:884,  vendor_count:24 },
      SA:{ enabled:true,  commission_pct:18, min_listings:35, listing_count:684,  vendor_count:18 },
      EG:{ enabled:true,  commission_pct:20, min_listings:20, listing_count:298,  vendor_count:12 },
      KW:{ enabled:true,  commission_pct:18, min_listings:15, listing_count:144,  vendor_count:8  },
      BH:{ enabled:true,  commission_pct:18, min_listings:10, listing_count:84,   vendor_count:5  },
      QA:{ enabled:true,  commission_pct:18, min_listings:10, listing_count:93,   vendor_count:6  },
      OM:{ enabled:true,  commission_pct:18, min_listings:10, listing_count:48,   vendor_count:4  },
    },
    children:[
      { id:'MC-003-01', slug:'oud-attar',      label:'Oud & Attar',         mapped_to:'CAT-004-01', commission_pct:18, status:'active', listing_count:614  },
      { id:'MC-003-02', slug:'branded-perfume', label:'Branded Perfume',    mapped_to:'CAT-004-02', commission_pct:20, status:'active', listing_count:811  },
      { id:'MC-003-03', slug:'skincare-beauty', label:'Skincare & Cosmetics',mapped_to:'CAT-004-03', commission_pct:16, status:'active', listing_count:762  },
    ]
  },
  {
    id:'MC-004', slug:'footwear-mkt', label:'Footwear',
    mapped_to:'CAT-006', mapped_label:'Footwear',
    status:'active', vendor_count:24, listing_count:892,
    commission_pct:14, requires_approval:false,
    listing_requirements:['Size chart upload required — EU + UK + US','Authentic product photos','Sole material declaration'],
    markets:{
      AE:{ enabled:true,  commission_pct:14, min_listings:30, listing_count:384, vendor_count:14 },
      SA:{ enabled:true,  commission_pct:13, min_listings:25, listing_count:248, vendor_count:10 },
      EG:{ enabled:true,  commission_pct:15, min_listings:15, listing_count:124, vendor_count:7  },
      KW:{ enabled:true,  commission_pct:14, min_listings:10, listing_count:68,  vendor_count:5  },
      BH:{ enabled:true,  commission_pct:14, min_listings:8,  listing_count:28,  vendor_count:3  },
      QA:{ enabled:true,  commission_pct:14, min_listings:8,  listing_count:34,  vendor_count:4  },
      OM:{ enabled:false, commission_pct:14, min_listings:8,  listing_count:0,   vendor_count:0  },
    },
    children:[
      { id:'MC-004-01', slug:'sneakers-mkt',   label:'Sneakers & Trainers', mapped_to:'CAT-006-01', commission_pct:14, status:'active', listing_count:487 },
      { id:'MC-004-02', slug:'formal-footwear',label:'Formal Footwear',     mapped_to:'CAT-006-03', commission_pct:14, status:'active', listing_count:245 },
    ]
  },
  {
    id:'MC-005', slug:'accessories-mkt', label:'Accessories',
    mapped_to:'CAT-005', mapped_label:'Accessories',
    status:'active', vendor_count:38, listing_count:1344,
    commission_pct:16, requires_approval:false,
    listing_requirements:['Authentic product photos','Material composition'],
    markets:{
      AE:{ enabled:true,  commission_pct:16, min_listings:30, listing_count:484, vendor_count:16 },
      SA:{ enabled:true,  commission_pct:15, min_listings:25, listing_count:348, vendor_count:12 },
      EG:{ enabled:true,  commission_pct:17, min_listings:15, listing_count:148, vendor_count:8  },
      KW:{ enabled:true,  commission_pct:16, min_listings:10, listing_count:84,  vendor_count:5  },
      BH:{ enabled:false, commission_pct:16, min_listings:8,  listing_count:0,   vendor_count:0  },
      QA:{ enabled:true,  commission_pct:16, min_listings:8,  listing_count:48,  vendor_count:4  },
      OM:{ enabled:false, commission_pct:16, min_listings:8,  listing_count:0,   vendor_count:0  },
    },
    children:[]
  },
];

export { ZC_MARKETS, ZC_CATEGORIES, ZC_MARKETPLACE_CATS };
