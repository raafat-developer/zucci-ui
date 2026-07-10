<template>
<div class="zp-detail-wrap">
   <div class="zp-detail-header">
      <button type="button" class="zp-back-btn" @click="$router.back()">
         <svg viewBox="0 0 14 10" width="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <path d="M5 1L1 5L5 9 M1 5h12"></path>
         </svg>
         Back
      </button>
      <div class="zp-detail-title">New Product</div>
      <div class="zp-detail-meta">
         <div style="position: relative; display: inline-block;">
            <div style="position: relative; width: 100%; display: inline-block;">
               <button type="button" style="width: 100%; height: 32px; padding: 0px 10px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); font-family: var(--zg-sans); font-size: 12px; color: var(--zg-text-dim); cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 6px; text-align: left; opacity: 1; outline: none; transition: border-color 0.12s;">
                  <span style="flex: 1 1 0%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Assign brand…</span>
                  <svg viewBox="0 0 10 6" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="flex-shrink: 0; transition: transform 0.14s; transform: none; color: var(--zg-text-dim);">
                     <path d="M1 1l4 4 4-4"></path>
                  </svg>
               </button>
            </div>
         </div>
         <div style="position: relative;">
            <button type="button" class="zp-status-selector" style="color: oklch(0.82 0.14 215);">
               <span class="zp-status-dot" style="background: oklch(0.82 0.14 215);"></span>Draft
               <svg viewBox="0 0 10 6" width="8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                  <path d="M1 1L5 5L9 1"></path>
               </svg>
            </button>
         </div>
      </div>
      <div class="zp-detail-actions"><button type="button" class="zen-btn-ghost" style="height: 28px; font-size: 11px;">Preview</button>
         <button @click="saveProduct" :loading="saving" type="button" class="zen-btn-ghost" style="height: 28px; font-size: 11px;">Submit for Review</button><button type="button" class="zen-btn-primary" style="height: 28px; font-size: 11px;" @click="saveProduct()">Save</button></div>
   </div>
   <div class="zp-detail-body">
      <div class="zp-section-label">Content</div>
      <div class="zp-content-grid ">
         <div class="zp-content-col">
            <div class="zp-content-col-head"><span class="zp-content-col-title">Live Content</span><span class="zp-lang-badge">English</span></div>
            <input class="zp-name-input" placeholder="Enter product name here…" v-model="productNameEn">
            <div class="zp-rte">
               <div class="zp-rte-toolbar">
                  <select class="zp-rte-select" v-model="rteFormatEn" @change="applyFormat('en')">
                     <option value="" selected="">Format</option>
                     <option value="p">Paragraph</option>
                     <option value="h1">Heading 1</option>
                     <option value="h2">Heading 2</option>
                     <option value="h3">Heading 3</option>
                     <option value="h4">Heading 4</option>
                     <option value="blockquote">Blockquote</option>
                  </select>
                  <div class="zp-rte-sep"></div>
                  <button type="button" class="zp-rte-btn" title="bold" @click="execCommand('bold', 'en')"><span style="font-weight: 700;">B</span></button>
                  <button type="button" class="zp-rte-btn" title="italic" @click="execCommand('italic', 'en')"><span style="font-style: italic;">I</span></button>
                  <button type="button" class="zp-rte-btn" title="underline" @click="execCommand('underline', 'en')"><span style="text-decoration: underline;">U</span></button>
                  <div class="zp-rte-sep"></div>
                  <button type="button" class="zp-rte-btn" title="Bullet list" @click="execCommand('insertUnorderedList', 'en')">• —</button>
                  <button type="button" class="zp-rte-btn" title="Numbered list" @click="execCommand('insertOrderedList', 'en')">1.</button>
                  <div class="zp-rte-sep"></div>
                  <button type="button" class="zp-rte-btn" title="Toggle HTML source" @click="toggleHtmlSource('en')"><span style="font-size: 8.5px; font-family: var(--zg-mono); font-weight: 700; letter-spacing: -0.02em;">&lt;/&gt;</span></button>
               </div>
               <div 
                  v-if="!showHtmlSource.en" 
                  class="zp-rte-body" 
                  dir="ltr" 
                  contenteditable="true" 
                  data-placeholder="Enter product description here…" 
                  style="text-align: left;"
                  @input="updateDescription('en')"
                  ref="rteBodyEnRef"
               ></div>
               <textarea 
                  v-else 
                  class="zp-rte-body" 
                  dir="ltr" 
                  style="text-align: left; font-family: var(--zg-mono); font-size: 12px;"
                  v-model="productDescriptionHtml.en"
                  @blur="updateRteFromHtml('en')"
               ></textarea>
            </div>
         </div>
         <div class="zp-content-col">
            <div class="zp-content-col-head" dir="rtl"><span class="zp-content-col-title">محتوى المنتج المباشر</span><span class="zp-lang-badge">عربي</span><button type="button" class="zp-translate-btn" style="margin-left: auto;" @click="translateToAr()">Translate</button></div>
            <input class="zp-name-input" dir="rtl" placeholder="أدخل اسم المنتج هنا..." v-model="productNameAr">
            <div class="zp-rte">
               <div class="zp-rte-toolbar">
                  <select class="zp-rte-select" v-model="rteFormatAr" @change="applyFormat('ar')">
                     <option value="" selected="">Format</option>
                     <option value="p">Paragraph</option>
                     <option value="h1">Heading 1</option>
                     <option value="h2">Heading 2</option>
                     <option value="h3">Heading 3</option>
                     <option value="h4">Heading 4</option>
                     <option value="blockquote">Blockquote</option>
                  </select>
                  <div class="zp-rte-sep"></div>
                  <button type="button" class="zp-rte-btn" title="bold" @click="execCommand('bold', 'ar')"><span style="font-weight: 700;">B</span></button>
                  <button type="button" class="zp-rte-btn" title="italic" @click="execCommand('italic', 'ar')"><span style="font-style: italic;">I</span></button>
                  <button type="button" class="zp-rte-btn" title="underline" @click="execCommand('underline', 'ar')"><span style="text-decoration: underline;">U</span></button>
                  <div class="zp-rte-sep"></div>
                  <button type="button" class="zp-rte-btn" title="Bullet list" @click="execCommand('insertUnorderedList', 'ar')">• —</button>
                  <button type="button" class="zp-rte-btn" title="Numbered list" @click="execCommand('insertOrderedList', 'ar')">1.</button>
                  <div class="zp-rte-sep"></div>
                  <button type="button" class="zp-rte-btn" title="Toggle HTML source" @click="toggleHtmlSource('ar')"><span style="font-size: 8.5px; font-family: var(--zg-mono); font-weight: 700; letter-spacing: -0.02em;">&lt;/&gt;</span></button>
               </div>
               <div 
                  v-if="!showHtmlSource.ar" 
                  class="zp-rte-body" 
                  dir="rtl" 
                  contenteditable="true" 
                  data-placeholder="أدخل وصف المنتج هنا…" 
                  style="text-align: right;"
                  @input="updateDescription('ar')"
                  ref="rteBodyArRef"
               ></div>
               <textarea 
                  v-else 
                  class="zp-rte-body" 
                  dir="rtl" 
                  style="text-align: right; font-family: var(--zg-mono); font-size: 12px;"
                  v-model="productDescriptionHtml.ar"
                  @blur="updateRteFromHtml('ar')"
               ></textarea>
            </div>
         </div>
      </div>
      <div class="zp-section-label">Media</div>
      <div class="zpm-wrap">
         <div class="zpm-grid" style="display:flex">
            <div class="zpm-main zpm-draggable" v-if="mainImage" draggable="true">
               <img :src="mainImage" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--zg-radius-md);">
            </div>
            <div class="zpm-main zpm-draggable" v-else draggable="true">
               <div class="zpm-img-fallback" style="display: flex;">
                  <svg viewBox="0 0 40 50" width="128" height="160" fill="none">
                     <rect width="40" height="50" rx="3" fill="var(--zg-panel-hi)"></rect>
                     <path d="M5 40L15 27L22 35L30 23L36 40Z" stroke="var(--zg-line)" stroke-width="1" fill="none" stroke-linejoin="round"></path>
                     <circle cx="12" cy="15" r="5" stroke="var(--zg-line)" stroke-width="1"></circle>
                  </svg>
               </div>
            </div>
            <div class="zpm-thumbs-wrap">
               <div class="zpm-thumbs">
                  <div 
                     v-for="(img, idx) in productImages" 
                     :key="idx" 
                     class="zpm-thumb" 
                     :class="{ 'zpm-thumb-active': idx === 0 }"
                     @click="setMainImage(idx)"
                  >
                     <img :src="img" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--zg-radius-md);">
                  </div>
                  <div 
                     class="zpm-add-btn" 
                     @click="triggerFileInput"
                  >
                     <svg viewBox="0 0 20 20" width="16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
                        <line x1="10" y1="3" x2="10" y2="17"></line>
                        <line x1="3" y1="10" x2="17" y2="10"></line>
                     </svg>
                     <span>Add</span>
                  </div>
               </div>
            </div>
         </div>
         <div>
            <div style="aspect-ratio: 4 / 3; max-height: 280px; background: var(--zg-panel); border-color: var(--zg-line); border-radius: var(--zg-radius-md); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: 0.12s;" @click="triggerFileInput" @dragover.prevent @drop="handleDrop">
               <svg viewBox="0 0 48 40" width="40" fill="none" stroke="var(--zg-text-dim)" stroke-width="1.3" stroke-linecap="round">
                  <rect x="2" y="8" width="44" height="30" rx="3"></rect>
                  <circle cx="16" cy="20" r="5"></circle>
                  <path d="M2 32l12-10 8 8 8-6 18 14"></path>
               </svg>
               <div style="font-size: 14px; font-weight: 600; color: var(--zg-text-mid);">Add product images</div>
               <div style="font-size: 12px; color: var(--zg-text-dim);">Click to browse · drag files here · min 4 images recommended</div>
               <div style="display: flex; gap: 8px; margin-top: 4px;">
                  <span style="height: 22px; padding: 0px 10px; border: 1px solid var(--zg-accent); border-radius: var(--zg-radius-md); background: var(--zg-accent-tint); color: var(--zg-accent); font-size: 11.5px; font-weight: 600; display: inline-flex; align-items: center; cursor: pointer;">Browse Library</span>
                  <span style="height: 22px; padding: 0px 10px; border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); color: var(--zg-text-dim); font-size: 11.5px; display: inline-flex; align-items: center;">or drag here</span>
               </div>
            </div>
            <div class="zpm-thumbs-wrap" style="margin-top: 8px;">
               <div class="zpm-thumbs">
                  <div 
                     v-for="(img, idx) in productImages.slice(0, 4)" 
                     :key="'extra-' + idx" 
                     style="width: 72px; height: 72px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: border-color 0.12s;"
                  >
                     <img :src="img" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--zg-radius-md);">
                  </div>
                  <div 
                     v-if="productImages.length < 4" 
                     style="width: 72px; height: 72px; background: var(--zg-panel); border: 1px dashed var(--zg-line); border-radius: var(--zg-radius-md); display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: border-color 0.12s;"
                     @click="triggerFileInput"
                  >
                     <svg viewBox="0 0 24 24" width="18" fill="none" stroke="var(--zg-text-xdim)" stroke-width="1.5" stroke-linecap="round">
                        <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                        <circle cx="9" cy="9" r="2"></circle>
                        <path d="M3 17l5-4 4 4 3-3 6 6"></path>
                     </svg>
                  </div>
                  <div class="zpm-add-btn" @click="triggerFileInput">
                     <svg viewBox="0 0 20 20" width="16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
                        <line x1="10" y1="3" x2="10" y2="17"></line>
                        <line x1="3" y1="10" x2="17" y2="10"></line>
                     </svg>
                     <span>Add</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <input type="file" ref="fileInputRef" accept="image/*" multiple style="display: none;" @change="handleFileSelect">
      <div class="zp-section-label">Product Details</div>
      <div class="zen-card" style="padding: 14px;">
         <div class="zp-details-grid">
            <div class="zf-props-field">
               <label class="zf-props-label">Category</label>
               <div class="zp-cat-wrap" style="position: relative;">
                  <button type="button" class="zp-ss-trigger">
                     <span class="zp-ss-placeholder" style="flex: 1 1 0%; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Select category…</span>
                     <svg viewBox="0 0 10 6" width="9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="flex-shrink: 0; margin-left: auto;">
                        <path d="M1 1L5 5L9 1"></path>
                     </svg>
                  </button>
               </div>
            </div>
            <div class="zf-props-field">
               <label class="zf-props-label">Size Guide</label>
               <div style="position: relative; width: 100%; display: inline-block;">
                  <button type="button" style="width: 100%; height: 32px; padding: 0px 10px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); font-family: var(--zg-sans); font-size: 12px; color: var(--zg-text-dim); cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 6px; text-align: left; opacity: 1; outline: none; transition: border-color 0.12s;">
                     <span style="flex: 1 1 0%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">None (no size guide)</span>
                     <svg viewBox="0 0 10 6" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="flex-shrink: 0; transition: transform 0.14s; transform: none; color: var(--zg-text-dim);">
                        <path d="M1 1l4 4 4-4"></path>
                     </svg>
                  </button>
               </div>
            </div>
            <div class="zf-props-field">
               <label class="zf-props-label">Care Instructions</label>
               <div style="position: relative; width: 100%; display: inline-block;">
                  <button type="button" style="width: 100%; height: 32px; padding: 0px 10px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); font-family: var(--zg-sans); font-size: 12px; color: var(--zg-text-dim); cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 6px; text-align: left; opacity: 1; outline: none; transition: border-color 0.12s;">
                     <span style="flex: 1 1 0%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">None</span>
                     <svg viewBox="0 0 10 6" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="flex-shrink: 0; transition: transform 0.14s; transform: none; color: var(--zg-text-dim);">
                        <path d="M1 1l4 4 4-4"></path>
                     </svg>
                  </button>
               </div>
            </div>
            <div class="zf-props-field">
               <label class="zf-props-label">Return Policy</label>
               <div style="position: relative; width: 100%; display: inline-block;">
                  <button type="button" style="width: 100%; height: 32px; padding: 0px 10px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); font-family: var(--zg-sans); font-size: 12px; color: var(--zg-text); cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 6px; text-align: left; opacity: 1; outline: none; transition: border-color 0.12s;">
                     <span style="flex: 1 1 0%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Standard (14 days)</span>
                     <svg viewBox="0 0 10 6" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="flex-shrink: 0; transition: transform 0.14s; transform: none; color: var(--zg-text-dim);">
                        <path d="M1 1l4 4 4-4"></path>
                     </svg>
                  </button>
               </div>
            </div>
            <div class="zf-props-field">
               <label class="zf-props-label">Shipping Weight</label>
               <div style="display: flex; gap: 4px;">
                  <input type="number" class="zp-field-h" v-model.number="shippingWeight" style="flex: 1 1 0%; min-width: 0px;">
                  <div style="width: 80px; flex-shrink: 0;">
                     <div style="position: relative; width: 100%; display: inline-block;">
                        <button type="button" style="width: 100%; height: 32px; padding: 0px 10px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); font-family: var(--zg-sans); font-size: 12px; color: var(--zg-text); cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 6px; text-align: left; opacity: 1; outline: none; transition: border-color 0.12s;">
                           <span style="flex: 1 1 0%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">kg</span>
                           <svg viewBox="0 0 10 6" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="flex-shrink: 0; transition: transform 0.14s; transform: none; color: var(--zg-text-dim);">
                              <path d="M1 1l4 4 4-4"></path>
                           </svg>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
            <div class="zf-props-field">
               <label class="zf-props-label" style="display: flex; align-items: center; gap: 6px;">
                  HS Code
                  <span class="zp-tooltip" title="Harmonized System Code — international 6-digit code used for customs declarations and cross-border trade classification">
                     <svg viewBox="0 0 14 14" width="12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
                        <circle cx="7" cy="7" r="5.5"></circle>
                        <line x1="7" y1="5" x2="7" y2="7.5"></line>
                        <circle cx="7" cy="9.5" r="0.5" fill="currentColor"></circle>
                     </svg>
                  </span>
               </label>
               <input class="zp-field-h" placeholder="e.g. 6203.42" v-model="hsCode" style="width: 100%; box-sizing: border-box;">
            </div>
            <div class="zf-props-field">
               <label class="zf-props-label">Country of Origin</label>
               <div style="position: relative; width: 100%; display: inline-block;">
                  <button type="button" style="width: 100%; height: 32px; padding: 0px 10px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); font-family: var(--zg-sans); font-size: 12px; color: var(--zg-text); cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 6px; text-align: left; opacity: 1; outline: none; transition: border-color 0.12s;">
                     <span style="flex: 1 1 0%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">🇪🇬 Egypt</span>
                     <svg viewBox="0 0 10 6" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="flex-shrink: 0; transition: transform 0.14s; transform: none; color: var(--zg-text-dim);">
                        <path d="M1 1l4 4 4-4"></path>
                     </svg>
                  </button>
               </div>
            </div>
            <div class="zf-props-field">
               <label class="zf-props-label">Fulfillment</label>
               <div style="position: relative; width: 100%; display: inline-block;">
                  <button type="button" style="width: 100%; height: 32px; padding: 0px 10px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); font-family: var(--zg-sans); font-size: 12px; color: var(--zg-text); cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 6px; text-align: left; opacity: 1; outline: none; transition: border-color 0.12s;">
                     <span style="flex: 1 1 0%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Consignment — Zucci Warehouse</span>
                     <svg viewBox="0 0 10 6" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="flex-shrink: 0; transition: transform 0.14s; transform: none; color: var(--zg-text-dim);">
                        <path d="M1 1l4 4 4-4"></path>
                     </svg>
                  </button>
               </div>
            </div>
            <div class="zf-props-field" style="grid-column: 1 / -1;">
               <label class="zf-props-label">Tags</label>
               <div class="zp-tags-row">
                  <span 
                     v-for="(tag, idx) in productTags" 
                     :key="idx"
                     class="zp-tag"
                  >
                     {{ tag }}
                     <button type="button" class="zp-tag-remove" @click="removeTag(idx)">×</button>
                  </span>
                  <input class="zp-tag-input" placeholder="Add tag + Enter" @keydown.enter="addTag" v-model="newTag">
               </div>
            </div>
            <div class="zf-props-field" style="grid-column: 1 / -1;">
               <label class="zf-props-label">Platform SKU (auto-generated)</label>
               <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;"><code class="zen-field-mono" style="font-size: 11px; padding: 5px 10px; background: var(--zg-bg); border: 1px solid var(--zg-line); border-radius: 5px;">Auto-generated on save</code></div>
            </div>
         </div>
      </div>
      <div class="zp-section-label">Market Availability</div>
      <div class="zp-markets-grid">
         <label class="zp-market-card" style="cursor: pointer;" v-for="market in markets" :key="market.code">
            <div class="zp-market-card-head">
               <span style="font-size: 14px;">{{ market.flag }}</span>
               <span class="zp-market-name">{{ market.name }}</span>
               <input type="checkbox" v-model="market.selected">
            </div>
            <div class="zp-market-currency">{{ market.currency }}</div>
         </label>
      </div>
      <div class="zp-section-label">Live Variants<label class="zp-variable-toggle"><input type="checkbox" v-model="isVariableProduct"><span>Switch to variable product</span></label></div>
      <div class="zp-variants-empty" style="opacity: 0.6; font-size: 12px; color: var(--zg-text-dim); padding: 10px 14px; border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md);">Simple product — no variants. Toggle above to add variations.</div>
      <div class="zp-section-label">Search Engine Listing</div>
      <div class="zp-seo-grid">
         <div class="zp-seo-col">
            <div class="zp-content-col-head" dir="ltr" style="margin-bottom: 10px;"><span class="zp-content-col-title">Search Engine Listing</span><span class="zp-lang-badge">English</span></div>
            <label class="zf-props-label">Page Title</label><input class="zp-field-h" dir="ltr" placeholder="Enter page title…" v-model="seoTitleEn" style="width: 100%; box-sizing: border-box; margin-bottom: 4px;"><span class="zp-char-count" dir="ltr">{{ seoTitleEn.length }} / 70 characters</span><label class="zf-props-label" style="margin-top: 10px;">Meta Description</label>
            <textarea class="zp-seo-textarea" dir="ltr" rows="4" placeholder="Enter meta description…" v-model="seoDescEn"></textarea>
            <span class="zp-char-count" dir="ltr">{{ seoDescEn.length }} / 320 characters</span>
         </div>
         <div class="zp-seo-col">
            <div class="zp-content-col-head" dir="rtl" style="margin-bottom: 10px;"><span class="zp-content-col-title">قائمة محرك البحث</span><span class="zp-lang-badge">عربي</span></div>
            <label class="zf-props-label">عنوان الصفحة</label><input class="zp-field-h" dir="rtl" placeholder="أدخل عنوان الصفحة…" v-model="seoTitleAr" style="width: 100%; box-sizing: border-box; margin-bottom: 4px;"><span class="zp-char-count" dir="rtl">{{ seoTitleAr.length }} من 70 حرفاً</span><label class="zf-props-label" style="margin-top: 10px;">ميتا الوصف</label>
            <textarea class="zp-seo-textarea" dir="rtl" rows="4" placeholder="أدخل ميتا الوصف…" v-model="seoDescAr"></textarea>
            <span class="zp-char-count" dir="rtl">{{ seoDescAr.length }} من 320 حرفاً</span>
         </div>
      </div>
   </div>
</div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useProductsStore } from '../../../stores/products';
// import { storeToRefs } from 'pinia'
const productStore = useProductsStore()
const {saving} = storeToRefs(productStore)
const { createProduct } = productStore;
const productNameEn = ref('');
const productNameAr = ref('');
const productDescription = ref({
  en: '',
  ar: ''
});
const productDescriptionHtml = ref({
  en: '',
  ar: ''
});
const showHtmlSource = ref({
  en: false,
  ar: false
});
const rteFormatEn = ref('');
const rteFormatAr = ref('');
const rteBodyEnRef = ref(null);
const rteBodyArRef = ref(null);
const productImages = ref([]);
const mainImage = computed(() => productImages.value[0] || null);
const shippingWeight = ref(0);
const hsCode = ref('');
const productTags = ref([]);
const newTag = ref('');
const isVariableProduct = ref(false);
const seoTitleEn = ref('');
const seoDescEn = ref('');
const seoTitleAr = ref('');
const seoDescAr = ref('');
const fileInputRef = ref(null);

const markets = ref([
  { code: 'AE', name: 'UAE', flag: '🇦🇪', currency: 'AED', selected: true },
  { code: 'SA', name: 'KSA', flag: '🇸🇦', currency: 'SAR', selected: true },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', currency: 'EGP', selected: true },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', currency: 'KWD', selected: false },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', currency: 'QAR', selected: false },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', currency: 'BHD', selected: false },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', currency: 'OMR', selected: false },
]);

function getRteRef(lang) {
  return lang === 'en' ? rteBodyEnRef : rteBodyArRef;
}

function triggerFileInput() {
  fileInputRef.value.click();
}

function handleFileSelect(e) {
  const files = Array.from(e.target.files);
  files.forEach(file => {
    const url = URL.createObjectURL(file);
    productImages.value.push(url);
  });
}

function handleDrop(e) {
  e.preventDefault();
  const files = Array.from(e.dataTransfer.files);
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      productImages.value.push(url);
    }
  });
}

function setMainImage(idx) {
  const [img] = productImages.value.splice(idx, 1);
  productImages.value.unshift(img);
}

function addTag(e) {
  e.preventDefault();
  const tag = newTag.value.trim();
  if (tag && !productTags.value.includes(tag)) {
    productTags.value.push(tag);
    newTag.value = '';
  }
}

function removeTag(idx) {
  productTags.value.splice(idx, 1);
}

function execCommand(command, lang) {
  document.execCommand(command, false, null);
  const ref = getRteRef(lang);
  if (ref.value) {
    ref.value.focus();
  }
}

function applyFormat(lang) {
  const format = lang === 'en' ? rteFormatEn : rteFormatAr;
  if (format) {
    document.execCommand('formatBlock', false, format);
    const ref = getRteRef(lang);
    if (ref.value) {
      ref.value.focus();
    }
  }
}

function updateDescription(lang) {
  const ref = getRteRef(lang);
  if (ref.value) {
    productDescription.value[lang] = ref.value.innerHTML;
    productDescriptionHtml.value[lang] = productDescription.value[lang];
  }
}

function updateRteFromHtml(lang) {
  const ref = getRteRef(lang);
  if (ref.value) {
    ref.value.innerHTML = productDescriptionHtml.value[lang];
    productDescription.value[lang] = productDescriptionHtml.value[lang];
    showHtmlSource.value[lang] = false;
  }
}

function toggleHtmlSource(lang) {
  showHtmlSource.value[lang] = !showHtmlSource.value[lang];
  if (!showHtmlSource.value[lang]) {
    updateRteFromHtml(lang);
  } else {
    productDescriptionHtml.value[lang] = productDescription.value[lang];
  }
}

function translateToAr() {
  productNameAr.value = productNameEn.value + ' (ترجمة)';
  productDescription.value.ar = productDescription.value.en + ' (ترجمة)';
  if (rteBodyArRef.value) {
    rteBodyArRef.value.innerHTML = productDescription.value.ar;
  }
  window.toast?.info('Translation placeholder added');
}

async function saveProduct() {
   const payload = {
      productNameEn: productNameEn.value,
      productNameAr: productNameAr.value,
      productDescriptionEn: productDescription.value.en,
      productDescriptionAr: productDescription.value.ar,
      productImages: productImages.value.length,
      shippingWeight: shippingWeight.value,
      hsCode: hsCode.value,
      productTags: productTags.value,
      markets: markets.value.filter(m => m.selected),
      seoTitleEn: seoTitleEn.value,
      seoDescEn: seoDescEn.value,
      seoTitleAr: seoTitleAr.value,
      seoDescAr: seoDescAr.value,
   }
   await createProduct(payload);
}
</script>
