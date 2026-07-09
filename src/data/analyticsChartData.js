// analyticsChartData.js — Analytics module data (faithful port from zucci-analytics.jsx)

export const M6  = ['Jan','Feb','Mar','Apr','May','Jun'];
export const M12 = ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'];
export const DOW = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export const C = {
  lime:'#A3E635', blue:'#60A5FA', purple:'#C084FC',
  pink:'#F472B6', amber:'#FBBF24', red:'#F87171',
  teal:'#2DD4BF', orange:'#FB923C', indigo:'#818CF8',
  panel:'#15171B', bg:'#0E1013', line:'rgba(255,255,255,0.08)',
  textDim:'#6B7280', text:'#D1D5DB',
};

export const D = {
  gmv_monthly:    [284,312,298,341,378,402],
  orders_monthly: [1841,2012,1924,2184,2401,2614],
  aov_monthly:    [154,155,155,156,157,154],
  net_monthly:    [199,218,209,239,265,281],
  refunds_monthly:[18,21,19,24,26,22],
  return_monthly: [4.2,3.8,4.1,3.9,4.3,3.7],
  new_cust:       [420,512,480,561,634,698],
  ret_cust:       [1421,1500,1444,1623,1767,1916],
  ltv_tiers:      [{tier:'Bronze',ltv:180},{tier:'Silver',ltv:420},{tier:'Gold',ltv:980},{tier:'Platinum',ltv:2400},{tier:'VIP',ltv:5800}],
  geo:            [{market:'AE',orders:1200},{market:'SA',orders:930},{market:'EG',orders:320},{market:'QA',orders:120},{market:'KW',orders:40},{market:'BH',orders:15},{market:'OM',orders:6}],
  by_category:    [{name:'Abayas',gmv:82,returnRate:2.1},{name:'Swimwear',gmv:61,returnRate:7.4},{name:'Footwear',gmv:48,returnRate:5.8},{name:'Handbags',gmv:41,returnRate:1.9},{name:'Fragrances',gmv:38,returnRate:0.8},{name:'Kids',gmv:29,returnRate:3.2}],
  top_products:   [{name:'Midnight Abaya',gmv:28.4,sold:284,returnRate:1.2},{name:'Swim Leggings – BLK',gmv:22.1,sold:441,returnRate:8.2},{name:'Cloud Runner Sneakers',gmv:19.8,sold:198,returnRate:5.1},{name:'Silk Hijab Ocean Blue',gmv:18.2,sold:728,returnRate:0.8},{name:'Arabian Night Oud 50ml',gmv:16.4,sold:164,returnRate:0.3},{name:'Gucci-Inspired Tote',gmv:14.1,sold:94,returnRate:3.2}],
  sell_through:   [{cat:'Abayas',rate:84},{cat:'Swimwear',rate:71},{cat:'Footwear',rate:68},{cat:'Handbags',rate:92},{cat:'Fragrances',rate:95},{cat:'Kids',rate:62}],
  price_dist:     [{range:'0–99',count:312},{range:'100–199',count:891},{range:'200–399',count:724},{range:'400–699',count:482},{range:'700–999',count:142},{range:'1000+',count:63}],
  funnel:         [{stage:'Sessions',value:84210},{stage:'PDPs Viewed',value:32840},{stage:'Add to Cart',value:8420},{stage:'Checkout',value:4210},{stage:'Orders',value:2614}],
  satisfaction:   [{name:'5 ★',count:1241},{name:'4 ★',count:820},{name:'3 ★',count:310},{name:'2 ★',count:142},{name:'1 ★',count:61}],
  days_orders:    [320,380,410,430,500,620,480],
  pay_methods:    [{name:'Card',value:58},{name:'Apple Pay',value:18},{name:'Tabby',value:12},{name:'COD',value:8},{name:'Other',value:4}],
  market_monthly: [], // populated below after D is defined
  market_kpis:    [{market:'AE',gmv:181,orders:1200,brands:289,return_rate:3.2},{market:'SA',gmv:128,orders:930,brands:201,return_rate:4.1},{market:'EG',gmv:52,orders:320,brands:98,return_rate:5.8},{market:'QA',gmv:40,orders:120,brands:64,return_rate:2.9}],
};

// Populate market_monthly after D is fully initialized
D.market_monthly = M6.map((m,i) => ({
  m,
  AE: Math.round(D.gmv_monthly[i] * 0.45),
  SA: Math.round(D.gmv_monthly[i] * 0.32),
  EG: Math.round(D.gmv_monthly[i] * 0.13),
  QA: Math.round(D.gmv_monthly[i] * 0.10),
}));
