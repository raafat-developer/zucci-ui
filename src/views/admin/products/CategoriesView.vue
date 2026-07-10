<template>
  <div class="zv-module">
    <!-- Header -->
        <PageHeader title="Categories taxonomy" subtitle="Configure storefront product categories and vendor marketplace mapping tables" iconColor="var(--zg-accent);">
      <template #icon>
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
            <circle cx="7" cy="7" r="1.2" fill="currentColor" />
          </svg>
      </template>
      <template #actions>
        <!-- View Toggle -->
        <div class="view-mode-toggle" style="display: flex; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); padding: 2px; margin-right: 12px;">
          <button 
            class="mode-btn" 
            :class="{ 'is-active': activeView === 'products' }" 
            @click="activeView = 'products'"
            style="padding: 4px 12px; border-radius: 4px; border: none; font-size: 11.5px; font-weight: 600; cursor: pointer; color: var(--zg-text); background: transparent;"
          >
            Internal Categories
          </button>
          <button 
            class="mode-btn" 
            :class="{ 'is-active': activeView === 'marketplace' }" 
            @click="activeView = 'marketplace'"
            style="padding: 4px 12px; border-radius: 4px; border: none; font-size: 11.5px; font-weight: 600; cursor: pointer; color: var(--zg-text); background: transparent;"
          >
            Marketplace Mapping
          </button>
        </div>

        <button class="zs-btn" @click="openImport(activeView)">Bulk Import</button>
        <button class="zs-btn" @click="downloadCsv('categories-export.csv', buildSampleCsv(activeView))">Export CSV</button>
        <button class="zs-btn zs-btn--primary" @click="openCategoryDrawer(null, null, activeView === 'marketplace')">
          + Add Category
        </button>
      </template>
    </PageHeader>

    <!-- KPI KPI Header Strip -->
    <div class="zwh-kpi-strip">
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Total Taxonomy Trees</span>
        <span class="zwh-kpi-val">{{ totalCategoriesCount }}</span>
        <span class="zwh-kpi-sub">parent + nested subcategories</span>
      </div>
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Active Storefront</span>
        <span class="zwh-kpi-val is-good">{{ activeCategoriesCount }}</span>
        <span class="zwh-kpi-sub">publishing live products</span>
      </div>
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Private B2B Tiers</span>
        <span class="zwh-kpi-val is-accent">{{ privateCategoriesCount }}</span>
        <span class="zwh-kpi-sub">restricted login access only</span>
      </div>
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Total Catalog Items</span>
        <span class="zwh-kpi-val">{{ totalProductsCount.toLocaleString() }}</span>
        <span class="zwh-kpi-sub">live mapped SKU inventory</span>
      </div>
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Threshold Warnings</span>
        <span class="zwh-kpi-val" :class="{ 'is-warn': belowMinTotalCount > 0 }">{{ belowMinTotalCount }}</span>
        <span class="zwh-kpi-sub">markets below listing limits</span>
      </div>
    </div>

    <!-- Main View Section -->
    <div class="zv-body" style="overflow-y: auto;">

      <!-- Market filters toolbar -->
      <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 16px; flex-wrap: wrap;">
        <span style="font-size: 11px; font-weight: 700; color: var(--zg-text-dim); text-transform: uppercase;">Filter by active market:</span>
        <button 
          v-for="m in ['all', ...MARKETS]" 
          :key="m" 
          class="zwh-filter-chip"
          :class="{ 'is-active': mktFilter === m }"
          @click="mktFilter = m"
          style="cursor: pointer;"
        >
          {{ m === 'all' ? 'All Markets' : m }}
        </button>
      </div>

      <!-- ── 1. PRODUCTS INTERNAL CATEGORIES PANEL ── -->
      <div v-if="activeView === 'products'" class="zcat-tree">
        <div v-for="(cat, idx) in currentCategories" :key="cat.id">
          
          <!-- Root Category Row -->
          <div 
            class="zcat-root-row"
            draggable="true"
            @dragstart="handleDragStart(idx)"
            @dragover="handleDragOver"
            @drop="handleDrop(idx)"
            style="display: flex; align-items: center; padding: 10px 14px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); margin-bottom: 6px; cursor: grab;"
          >
            <!-- Drag Handle icon -->
            <span class="zcat-drag-handle" style="color: var(--zg-text-xdim); cursor: grab; margin-right: 12px; display: inline-flex; align-items: center;">
              <svg viewBox="0 0 8 12" width="8" height="12" fill="currentColor">
                <circle cx="2" cy="2" r="1.1"/><circle cx="6" cy="2" r="1.1"/>
                <circle cx="2" cy="6" r="1.1"/><circle cx="6" cy="6" r="1.1"/>
                <circle cx="2" cy="10" r="1.1"/><circle cx="6" cy="10" r="1.1"/>
              </svg>
            </span>

            <!-- Expand / collapse child chevron -->
            <button 
              v-if="cat.children && cat.children.length > 0" 
              class="zcat-expand-btn" 
              @click="toggleExpand(cat.id)"
              style="background: transparent; border: none; cursor: pointer; padding: 4px; margin-right: 8px; color: var(--zg-text-dim);"
            >
              <svg 
                viewBox="0 0 8 12" width="7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                :style="{ transform: expandedRoots[cat.id] ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }"
              >
                <path d="M2 2l4 4-4 4"/>
              </svg>
            </button>
            <span v-else style="width: 23px;"></span>

            <!-- Title -->
            <span class="zcat-name" style="font-weight: 700; font-size: 13px; color: var(--zg-text); min-width: 140px;">{{ cat.label }}</span>
            
            <span v-if="hasAnyBelowMin(cat)" title="Some markets are below listing requirements" style="background: var(--zg-danger); color: #fff; border-radius: 50%; font-size: 10px; font-weight: 900; width: 15px; height: 15px; display: inline-flex; align-items: center; justify-content: center; margin-right: 8px; flex-shrink: 0;">!</span>
            <span v-if="cat.private" class="zcat-badge private" style="background: var(--zg-accent-tint); color: var(--zg-accent); border-radius: 4px; font-size: 10px; font-weight: 600; padding: 1px 6px; margin-right: 12px;">Private</span>

            <!-- Market Pill tags -->
            <div style="flex: 1; display: flex; gap: 4px; flex-wrap: wrap; align-items: center; margin-left: 12px; margin-right: 12px;">
              <span 
                v-for="mkt in MARKETS" 
                :key="mkt"
                :style="{
                  opacity: mktFilter !== 'all' && mktFilter !== mkt ? 0.3 : 1,
                  background: isBelowMin(cat, mkt) ? 'oklch(0.70 0.18 25 / 0.12)' : (cat.markets?.[mkt]?.enabled ? 'var(--zg-accent-tint)' : 'var(--zg-panel-hi)'),
                  color: isBelowMin(cat, mkt) ? 'var(--zg-danger)' : (cat.markets?.[mkt]?.enabled ? 'var(--zg-accent)' : 'var(--zg-text-xdim)'),
                  borderColor: isBelowMin(cat, mkt) ? 'oklch(0.70 0.18 25 / 0.3)' : (cat.markets?.[mkt]?.enabled ? 'oklch(0.78 0.18 130 / 0.3)' : 'var(--zg-line)')
                }"
                style="font-family: var(--zg-mono); font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 2px; border: 1px solid;"
              >
                {{ mkt }}
                <span v-if="isBelowMin(cat, mkt)" style="font-size: 8px; font-weight: 900;">!</span>
              </span>
            </div>

            <!-- Products count and switch -->
            <span class="zcat-count" style="font-family: var(--zg-mono); font-size: 12px; color: var(--zg-text-dim); margin-right: 16px;">{{ cat.product_count?.toLocaleString() }} items</span>

            <button 
              class="zcat-toggle" 
              :class="cat.status === 'active' ? 'on' : 'off'"
              @click="toggleRootStatus(cat.id, 'products')"
            >
              <div class="zcat-toggle-knob"></div>
            </button>

            <!-- Actions buttons -->
            <div class="zcat-row-actions" style="margin-left: 16px; display: flex; gap: 4px;">
              <button class="zcat-act" @click="toggleStatsFor(cat.id, 'products')">Stats</button>
              <button class="zcat-act" @click="openCategoryDrawer(null, cat, false)">+ Sub</button>
              <button class="zcat-act" @click="openCategoryDrawer(cat, null, false)">Edit</button>
              <button class="zcat-act danger" @click="deleteCategory(cat.id, 'products')">Del</button>
            </div>
          </div>

          <!-- Market stats details panels -->
          <div v-if="statsForId === cat.id && statsPanelType === 'products'" style="background: var(--zg-bg-elev); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); padding: 14px; margin-bottom: 8px; margin-top: -3px;">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--zg-text-dim); margin-bottom: 10px;">Market Allocation metrics for {{ cat.label }}</div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 8px;">
              <div 
                v-for="m in MARKETS" 
                :key="m" 
                class="market-cell"
                style="padding: 10px; border-radius: var(--zg-radius-md); border: 1px solid var(--zg-line); background: var(--zg-panel);"
                :style="{ opacity: cat.markets?.[m]?.enabled ? 1 : 0.45 }"
              >
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                  <span style="font-weight: 700; font-family: var(--zg-mono); font-size: 11px;">{{ m }}</span>
                  <span style="width: 6px; height: 6px; border-radius: 50%;" :style="{ background: cat.markets?.[m]?.enabled ? (isBelowMin(cat, m) ? 'var(--zg-danger)' : 'var(--zg-good)') : 'var(--zg-line)' }"></span>
                </div>
                <div v-if="cat.markets?.[m]?.enabled">
                  <div style="font-size: 14px; font-weight: 800; font-family: var(--zg-mono);" :style="{ color: isBelowMin(cat, m) ? 'var(--zg-danger)' : 'var(--zg-text)' }">
                    {{ cat.markets[m].listing_count }}
                  </div>
                  <div style="font-size: 9.5px; color: var(--zg-text-dim); margin-top: 1px;">/ {{ cat.markets[m].min_listings }} min</div>
                  <div style="height: 3px; background: var(--zg-panel-hi); border-radius: 2px; margin-top: 6px; overflow: hidden;">
                    <div style="height: 100%; background: var(--zg-good);" :style="{ width: Math.min(100, (cat.markets[m].listing_count / cat.markets[m].min_listings) * 100) + '%', background: isBelowMin(cat, m) ? 'var(--zg-danger)' : 'var(--zg-good)' }"></div>
                  </div>
                  <div style="font-size: 9px; color: var(--zg-text-xdim); margin-top: 4px;">{{ cat.markets[m].vendor_count }} vendors</div>
                </div>
                <div v-else style="font-size: 10px; color: var(--zg-text-xdim); margin-top: 4px;">Disabled</div>
              </div>
            </div>
          </div>

          <!-- Subcategories children lists -->
          <div v-if="expandedRoots[cat.id]" style="padding-left: 28px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 4px;">
            <div 
              v-for="ch in cat.children" 
              :key="ch.id" 
              class="zcat-child-row"
              style="display: flex; align-items: center; padding: 8px 12px; background: var(--zg-panel-hi); border: 1px solid var(--zg-line-soft); border-radius: var(--zg-radius-md);"
            >
              <span style="font-family: monospace; color: var(--zg-text-xdim); font-size: 12px; margin-right: 8px;">└</span>
              <span class="zcat-child-name" style="font-weight: 600; font-size: 12.5px; color: var(--zg-text-mid); min-width: 140px;">{{ ch.label }}</span>
              <span v-if="hasAnyBelowMin(ch)" style="background: var(--zg-danger); color: #fff; border-radius: 50%; font-size: 9px; font-weight: 900; width: 13px; height: 13px; display: inline-flex; align-items: center; justify-content: center; margin-right: 8px; flex-shrink: 0;">!</span>

              <!-- Child Market pill tags -->
              <div style="flex: 1; display: flex; gap: 4px; flex-wrap: wrap; align-items: center; margin-left: 12px; margin-right: 12px;">
                <span 
                  v-for="mkt in MARKETS" 
                  :key="mkt"
                  :style="{
                    opacity: mktFilter !== 'all' && mktFilter !== mkt ? 0.3 : 1,
                    background: isBelowMin(ch, mkt) ? 'oklch(0.70 0.18 25 / 0.12)' : (ch.markets?.[mkt]?.enabled ? 'var(--zg-accent-tint)' : 'var(--zg-panel-hi)'),
                    color: isBelowMin(ch, mkt) ? 'var(--zg-danger)' : (ch.markets?.[mkt]?.enabled ? 'var(--zg-accent)' : 'var(--zg-text-xdim)'),
                    borderColor: isBelowMin(ch, mkt) ? 'oklch(0.70 0.18 25 / 0.3)' : (ch.markets?.[mkt]?.enabled ? 'oklch(0.78 0.18 130 / 0.3)' : 'var(--zg-line)')
                  }"
                  style="font-family: var(--zg-mono); font-size: 8.5px; font-weight: 700; padding: 0.5px 4px; border-radius: 2px; border: 1px solid;"
                >
                  {{ mkt }}
                </span>
              </div>

              <!-- Product count child -->
              <span class="zcat-count" style="font-family: var(--zg-mono); font-size: 11px; color: var(--zg-text-dim); margin-right: 16px;">{{ ch.product_count?.toLocaleString() }} items</span>

              <button 
                class="zcat-toggle" 
                :class="ch.status === 'active' ? 'on' : 'off'"
                @click="toggleChildStatus(cat.id, ch.id)"
              >
                <div class="zcat-toggle-knob"></div>
              </button>

              <div class="zcat-row-actions" style="margin-left: 16px; display: flex; gap: 4px;">
                <button class="zcat-act" @click="toggleStatsFor(ch.id, 'products')">Stats</button>
                <button class="zcat-act" @click="openCategoryDrawer(ch, null, false)">Edit</button>
              </div>
            </div>
            
            <!-- Child Stats detailed panel -->
            <div v-if="statsForId === ch.id && statsPanelType === 'products'" style="background: var(--zg-bg-elev); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); padding: 14px; margin-bottom: 8px; margin-top: -3px; margin-left: 20px;">
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--zg-text-dim); margin-bottom: 10px;">Market Allocation metrics for Subcategory: {{ ch.label }}</div>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 8px;">
                <div 
                  v-for="m in MARKETS" 
                  :key="m" 
                  class="market-cell"
                  style="padding: 10px; border-radius: var(--zg-radius-md); border: 1px solid var(--zg-line); background: var(--zg-panel);"
                  :style="{ opacity: ch.markets?.[m]?.enabled ? 1 : 0.45 }"
                >
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                    <span style="font-weight: 700; font-family: var(--zg-mono); font-size: 11px;">{{ m }}</span>
                    <span style="width: 6px; height: 6px; border-radius: 50%;" :style="{ background: ch.markets?.[m]?.enabled ? (isBelowMin(ch, m) ? 'var(--zg-danger)' : 'var(--zg-good)') : 'var(--zg-line)' }"></span>
                  </div>
                  <div v-if="ch.markets?.[m]?.enabled">
                    <div style="font-size: 14px; font-weight: 800; font-family: var(--zg-mono);" :style="{ color: isBelowMin(ch, m) ? 'var(--zg-danger)' : 'var(--zg-text)' }">
                      {{ ch.markets[m].listing_count }}
                    </div>
                    <div style="font-size: 9.5px; color: var(--zg-text-dim); margin-top: 1px;">/ {{ ch.markets[m].min_listings }} min</div>
                  </div>
                  <div v-else style="font-size: 10px; color: var(--zg-text-xdim); margin-top: 4px;">Disabled</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- ── 2. MARKETPLACE MAPPING TABLES PANEL ── -->
      <div v-else class="marketplace-mapping" style="border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); overflow: hidden; background: var(--zg-panel);">
        <!-- Table Header -->
        <div style="display: grid; grid-template-columns: 1.5fr 1.2fr 80px 80px 80px 1.5fr 100px; gap: 10px; padding: 10px 14px; background: var(--zg-panel-hi); border-bottom: 1px solid var(--zg-line); font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--zg-text-dim); align-items: center;">
          <span>Category Name</span>
          <span>Maps to Internal Category</span>
          <span>Commission</span>
          <span>Sellers</span>
          <span>Listings</span>
          <span>Active Markets</span>
          <span>Actions</span>
        </div>

        <!-- Table Row Loop -->
        <div v-for="cat in currentCategories" :key="cat.id" style="border-bottom: 1px solid var(--zg-line-soft);">
          <div style="display: grid; grid-template-columns: 1.5fr 1.2fr 80px 80px 80px 1.5fr 100px; gap: 10px; padding: 12px 14px; align-items: center; background: var(--zg-panel); cursor: pointer;" @click="toggleExpand(cat.id)">
            <div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-weight: 700; font-size: 12.5px; color: var(--zg-text);">{{ cat.label }}</span>
                <span v-if="hasAnyBelowMin(cat)" style="background: var(--zg-danger); color: #fff; border-radius: 50%; font-size: 9px; font-weight: 900; width: 14px; height: 14px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;">!</span>
                <span v-if="cat.requires_approval" style="background: var(--zg-warn); color: #fff; border-radius: 4px; font-size: 8.5px; font-weight: 700; padding: 1px 4px; text-transform: uppercase;">KYB Review</span>
              </div>
              <div style="font-family: var(--zg-mono); font-size: 10px; color: var(--zg-text-xdim); margin-top: 2px;">{{ cat.slug }}</div>
            </div>
            <div>
              <div style="font-weight: 600; font-size: 12px; color: var(--zg-text-mid);">{{ cat.mapped_label }}</div>
              <div style="font-family: var(--zg-mono); font-size: 9.5px; color: var(--zg-text-xdim);">{{ cat.mapped_to }}</div>
            </div>
            <span style="font-family: var(--zg-mono); font-size: 13px; font-weight: 700; color: var(--zg-accent);">{{ cat.commission_pct }}%</span>
            <span style="font-family: var(--zg-mono); font-size: 12px; color: var(--zg-text-mid);">{{ cat.vendor_count }}</span>
            <span style="font-family: var(--zg-mono); font-size: 12px; color: var(--zg-text-mid);">{{ cat.listing_count }}</span>
            
            <!-- Markets flags tags list -->
            <div style="display: flex; gap: 3px; flex-wrap: wrap;">
              <span 
                v-for="m in MARKETS" 
                :key="m"
                :style="{
                  opacity: cat.markets?.[m]?.enabled ? 1 : 0.3,
                  background: cat.markets?.[m]?.enabled ? 'var(--zg-accent-tint)' : 'var(--zg-panel-hi)',
                  color: cat.markets?.[m]?.enabled ? 'var(--zg-accent)' : 'var(--zg-text-xdim)',
                }"
                style="font-family: var(--zg-mono); font-size: 9px; font-weight: 700; padding: 1px 4px; border-radius: 2px;"
              >
                {{ m }}
              </span>
            </div>

            <!-- Actions buttons -->
            <div style="display: flex; gap: 4px;" @click.stop>
              <button class="zcat-act" @click="toggleStatsFor(cat.id, 'marketplace')">Stats</button>
              <button class="zcat-act" @click="openCategoryDrawer(cat, null, true)">Edit</button>
            </div>
          </div>

          <!-- Marketplace detailed panel stats -->
          <div v-if="statsForId === cat.id && statsPanelType === 'marketplace'" style="background: var(--zg-bg-elev); border-top: 1px solid var(--zg-line); border-bottom: 1px solid var(--zg-line); padding: 14px;">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--zg-text-dim); margin-bottom: 10px;">Marketplace Commission Rates and Volumes for {{ cat.label }}</div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 8px;">
              <div 
                v-for="m in MARKETS" 
                :key="m" 
                class="market-cell"
                style="padding: 10px; border-radius: var(--zg-radius-md); border: 1px solid var(--zg-line); background: var(--zg-panel);"
                :style="{ opacity: cat.markets?.[m]?.enabled ? 1 : 0.45 }"
              >
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                  <span style="font-weight: 700; font-family: var(--zg-mono); font-size: 11px;">{{ m }}</span>
                  <span style="font-family: var(--zg-mono); font-size: 11px; font-weight: 700; color: var(--zg-accent);">{{ cat.markets?.[m]?.commission_pct || cat.commission_pct }}%</span>
                </div>
                <div v-if="cat.markets?.[m]?.enabled">
                  <div style="font-size: 14px; font-weight: 800; font-family: var(--zg-mono);">
                    {{ cat.markets[m].listing_count }}
                  </div>
                  <div style="font-size: 9.5px; color: var(--zg-text-dim); margin-top: 1px;">listings</div>
                  <div style="font-size: 9px; color: var(--zg-text-xdim); margin-top: 4px;">{{ cat.markets[m].vendor_count }} sellers active</div>
                </div>
                <div v-else style="font-size: 10px; color: var(--zg-text-xdim); margin-top: 4px;">Disabled</div>
              </div>
            </div>
            
            <div v-if="cat.listing_requirements && cat.listing_requirements.length > 0" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--zg-line-soft);">
              <div style="font-size: 10.5px; font-weight: 700; color: var(--zg-text-dim); margin-bottom: 6px;">New Listing Verification Rules:</div>
              <ul style="margin: 0; padding-left: 18px; font-size: 11.5px; color: var(--zg-text-mid);">
                <li v-for="(req, i) in cat.listing_requirements" :key="i" style="margin-bottom: 4px;">{{ req }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 16px; border-top: 1px solid var(--zg-line); background: var(--zg-panel);">
      <Paginator 
        :rows="perPage" 
        :totalRecords="total" 
        :first="(page - 1) * perPage" 
        @page="onPageChange"
      />
      <span v-if="loading" style="font-family: var(--zg-mono); font-size: 12px; color: var(--zg-text-xdim); margin-left: 16px;">
        Loading...
      </span>
      <span v-if="error" style="font-family: var(--zg-mono); font-size: 12px; color: var(--zg-danger); margin-left: 16px;">
        {{ error }}
      </span>
    </div>

    <!-- ── TELEPORT OVERLAY: ADD / EDIT CATEGORY DRAWER ── -->
    <Teleport to="body">
      <div v-if="drawerOpen" class="drawer-overlay" @click.self="drawerOpen = false" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; justify-content: flex-end;">
        <div class="drawer-panel" style="width: 520px; height: 100%; background: var(--zg-bg-elev); border-left: 1px solid var(--zg-line); display: flex; flex-direction: column; box-shadow: -8px 0 24px rgba(0,0,0,0.3); animation: slideIn 0.25s ease-out;">
          
          <div class="drawer-header" style="padding: 16px 20px; border-bottom: 1px solid var(--zg-line); display: flex; align-items: center; justify-content: space-between;">
            <div>
              <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: var(--zg-text);">
                {{ editCategoryObj ? 'Modify Category' : (editParentCategoryObj ? 'Add Subcategory' : 'Create Category') }}
              </h3>
              <p style="margin: 3px 0 0 0; font-size: 11.5px; color: var(--zg-text-dim);">
                {{ isMarketplaceDrawer ? 'Marketplace mapping settings' : (editParentCategoryObj ? `Parent: ${editParentCategoryObj.label}` : 'Top-level category') }}
              </p>
            </div>
            <button @click="drawerOpen = false" style="background: transparent; border: none; font-size: 20px; cursor: pointer; color: var(--zg-text-dim);">&times;</button>
          </div>

          <div class="drawer-body" style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px;">
            <!-- Category details form fields -->
            <div class="zcat-field">
              <label class="zcat-label">Category Label <span style="color: var(--zg-danger);">*</span></label>
              <input type="text" v-model="localLabel" class="zcat-input" placeholder="e.g. Traditional Kaftans" />
            </div>
            
            <div class="zcat-field">
              <label class="zcat-label">URL Slug</label>
              <input type="text" v-model="localSlug" class="zcat-input" placeholder="e.g. traditional-kaftans" style="font-family: var(--zg-mono);" />
            </div>

            <div class="zcat-field">
              <label class="zcat-label">Storefront Visibility Status</label>
              <select v-model="localStatus" class="zcat-select" style="width: 100%; height: 32px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); color: var(--zg-text); padding: 0 8px; font-family: inherit;">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div class="zcat-field">
              <label class="zcat-label">Internal Description / Scope</label>
              <textarea v-model="localDescription" class="zcat-textarea" rows="2" placeholder="Brief category description details..." style="width: 100%; padding: 8px; border: 1px solid var(--zg-line); background: var(--zg-panel); color: var(--zg-text); border-radius: var(--zg-radius-md); font-family: inherit; font-size: 12.5px;"></textarea>
            </div>

            <div v-if="!isMarketplaceDrawer" style="display: flex; flex-direction: column; gap: 10px;">
              <div class="zcat-toggle-row" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--zg-line-soft);">
                <div>
                  <div style="font-weight: 600; font-size: 12px; color: var(--zg-text);">Mark as Featured</div>
                  <div style="font-size: 10px; color: var(--zg-text-dim);">Promote in storefront home collections grid</div>
                </div>
                <button class="zcat-toggle" :class="localFeatured ? 'on' : 'off'" @click="localFeatured = !localFeatured"><div class="zcat-toggle-knob"></div></button>
              </div>
              <div class="zcat-toggle-row" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--zg-line-soft);">
                <div>
                  <div style="font-weight: 600; font-size: 12px; color: var(--zg-text);">B2B Private Catalog</div>
                  <div style="font-size: 10px; color: var(--zg-text-dim);">Hide from public users, only show for verified wholesalers</div>
                </div>
                <button class="zcat-toggle" :class="localPrivate ? 'on' : 'off'" @click="localPrivate = !localPrivate"><div class="zcat-toggle-knob"></div></button>
              </div>
            </div>

            <!-- Market Settings -->
            <div>
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--zg-text-dim); margin-bottom: 8px;">Markets specific parameters</div>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                <div 
                  v-for="m in MARKETS" 
                  :key="m" 
                  style="border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); padding: 8px; background: var(--zg-panel);"
                >
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span style="font-weight: 700; font-family: var(--zg-mono); font-size: 11px;">{{ m }} Market</span>
                    <button class="zcat-toggle" :class="localMarketsMap[m]?.enabled ? 'on' : 'off'" @click="localMarketsMap[m].enabled = !localMarketsMap[m].enabled"><div class="zcat-toggle-knob"></div></button>
                  </div>
                  <div v-if="localMarketsMap[m]?.enabled" style="display: flex; flex-direction: column; gap: 4px;">
                    <div>
                      <span style="font-size: 8.5px; color: var(--zg-text-dim);">Min listings limit:</span>
                      <input type="number" v-model.number="localMarketsMap[m].min_listings" style="width: 100%; height: 24px; padding: 2px 4px; background: var(--zg-bg); border: 1px solid var(--zg-line); border-radius: 4px; font-size: 11px; color: var(--zg-text); text-align: center;" />
                    </div>
                    <div v-if="isMarketplaceDrawer">
                      <span style="font-size: 8.5px; color: var(--zg-text-dim);">Commission overriding %:</span>
                      <input type="number" v-model.number="localMarketsMap[m].commission_pct" style="width: 100%; height: 24px; padding: 2px 4px; background: var(--zg-bg); border: 1px solid var(--zg-line); border-radius: 4px; font-size: 11px; color: var(--zg-accent); font-weight: 700; text-align: center;" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Media / SEO sections for Products tab -->
            <div v-if="!isMarketplaceDrawer" style="display: flex; flex-direction: column; gap: 12px; margin-top: 8px; border-top: 1px solid var(--zg-line); padding-top: 12px;">
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--zg-text-dim);">Storefront Branding Assets</div>
              
              <!-- Mock image selectors -->
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <div>
                  <div style="font-size: 10px; font-weight: 600; color: var(--zg-text-mid);">Mobile Banner Banner Image</div>
                  <div style="display: flex; gap: 8px; margin-top: 4px;">
                    <button class="zs-btn" @click="handleFileUpload('mobile', [{name: 'mobile-category-banner.jpg'}])">Upload</button>
                    <span style="font-family: var(--zg-mono); font-size: 11px; color: var(--zg-good);" v-if="bannerMobileFile">✓ {{ bannerMobileFile }}</span>
                  </div>
                </div>
                <div>
                  <div style="font-size: 10px; font-weight: 600; color: var(--zg-text-mid);">Home Grid Thumbnail Image</div>
                  <div style="display: flex; gap: 8px; margin-top: 4px;">
                    <button class="zs-btn" @click="handleFileUpload('home', [{name: 'home-grid-thumb.jpg'}])">Upload</button>
                    <span style="font-family: var(--zg-mono); font-size: 11px; color: var(--zg-good);" v-if="bannerHomeFile">✓ {{ bannerHomeFile }}</span>
                  </div>
                </div>
              </div>

              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--zg-text-dim); margin-top: 8px;">SEO Web Settings</div>
              <div class="zcat-field">
                <label class="zcat-label">SEO Page Title</label>
                <input type="text" v-model="localSeoTitle" class="zcat-input" placeholder="Womens Fashion Modest wear | Zucci" />
              </div>
              <div class="zcat-field">
                <label class="zcat-label">SEO Meta Description</label>
                <textarea v-model="localSeoDesc" class="zcat-textarea" rows="2" placeholder="Search listing page snippet..."></textarea>
              </div>
            </div>

            <!-- Marketplace parameters tab -->
            <div v-if="isMarketplaceDrawer" style="display: flex; flex-direction: column; gap: 12px; margin-top: 8px; border-top: 1px solid var(--zg-line); padding-top: 12px;">
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--zg-text-dim);">Marketplace Commission policies</div>
              <div class="zcat-field">
                <label class="zcat-label">Default Base Commission Rate %</label>
                <input type="number" v-model.number="localCommission" class="zcat-input" style="font-family: var(--zg-mono);" />
              </div>
              
              <div class="zcat-toggle-row" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--zg-line-soft);">
                <div>
                  <div style="font-weight: 600; font-size: 12px; color: var(--zg-text);">Require Listing Review</div>
                  <div style="font-size: 10px; color: var(--zg-text-dim);">Hold new vendor items in pending approval queue</div>
                </div>
                <button class="zcat-toggle" :class="localRequiresApproval ? 'on' : 'off'" @click="localRequiresApproval = !localRequiresApproval"><div class="zcat-toggle-knob"></div></button>
              </div>

              <div class="zcat-field">
                <label class="zcat-label">Vendor Onboarding Verification Rules (One per line)</label>
                <textarea v-model="localRequirements" class="zcat-textarea" rows="3" placeholder="e.g. Brand certificate upload required..."></textarea>
              </div>
            </div>

          </div>

          <div class="drawer-footer" style="padding: 16px 20px; border-top: 1px solid var(--zg-line); display: flex; gap: 8px; justify-content: flex-end; background: var(--zg-bg);">
            <button class="zen-btn-ghost" @click="drawerOpen = false">Cancel</button>
            <button class="zen-btn-primary" @click="saveCategoryChanges">
              {{ editCategoryObj ? 'Save Changes' : 'Create Category' }}
            </button>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- ── TELEPORT OVERLAY: BULK IMPORT MODAL ── -->
    <Teleport to="body">
      <div v-if="importOpen" class="modal-backdrop" @click.self="importOpen = false" style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 9998; display: flex; align-items: center; justify-content: center;">
        <div class="modal-dialog" style="width: 580px; max-height: 80vh; background: var(--zg-bg-elev); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-lg); display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 12px 32px rgba(0,0,0,0.4);">
          
          <div class="modal-header" style="padding: 16px 20px; border-bottom: 1px solid var(--zg-line); display: flex; align-items: center; justify-content: space-between;">
            <div>
              <h3 style="margin: 0; font-size: 14px; font-weight: 700; color: var(--zg-text);">Bulk CSV Category Upload</h3>
              <p style="margin: 2px 0 0 0; font-size: 11px; color: var(--zg-text-dim);">Import schema for {{ importTab === 'products' ? 'internal catalogue taxonomy' : 'marketplace sellers category mapping' }}</p>
            </div>
            <button @click="importOpen = false" style="background: transparent; border: none; font-size: 20px; cursor: pointer; color: var(--zg-text-dim);">&times;</button>
          </div>

          <div class="modal-body" style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 14px;">
            <div v-if="importPhase === 'upload'" style="display: flex; flex-direction: column; gap: 12px;">
              <p style="font-size: 12.5px; color: var(--zg-text-mid); line-height: 1.5; margin: 0;">Upload a standard CSV file to instantly declare categories in bulk. Please ensure headers match the required structure.</p>
              <button class="zs-btn" style="align-self: flex-start;" @click="downloadCsv(`category-sample-${importTab}.csv`, buildSampleCsv(importTab))">Download Sample CSV</button>
              
              <div 
                @click="triggerImportSelect"
                style="border: 2px dashed var(--zg-line); border-radius: var(--zg-radius-md); padding: 32px 20px; text-align: center; cursor: pointer; background: var(--zg-panel); transition: border-color 0.15s;"
                onmouseover="this.style.borderColor='var(--zg-accent)'"
                onmouseout="this.style.borderColor='var(--zg-line)'"
              >
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--zg-text-xdim)" stroke-width="1.5" style="margin: 0 auto 10px; display: block;">
                  <path d="M12 3v12M8 9l4-4 4 4M3 20h18" stroke-linecap="round" />
                </svg>
                <div style="font-weight: 700; font-size: 13px; color: var(--zg-text-mid);">Select CSV File from local computer</div>
                <div style="font-size: 11px; color: var(--zg-text-xdim); margin-top: 4px;">Supports only UTF-8 standard text rows</div>
              </div>
            </div>

            <div v-if="importPhase === 'preview'" style="display: flex; flex-direction: column; gap: 10px;">
              <p style="font-size: 12px; color: var(--zg-text-dim); margin: 0;">{{ importPreviewRows.length }} new categories detected from CSV. Previewing data grid:</p>
              <div style="border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); overflow: hidden;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 12px;">
                  <thead>
                    <tr style="background: var(--zg-panel-hi); border-bottom: 1px solid var(--zg-line);">
                      <th style="padding: 6px 12px;">Slug</th>
                      <th style="padding: 6px 12px;">Label</th>
                      <th style="padding: 6px 12px;">Status</th>
                      <th style="padding: 6px 12px;">Private</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, idx) in importPreviewRows" :key="idx" style="border-bottom: 1px solid var(--zg-line-soft);">
                      <td style="padding: 6px 12px; font-family: var(--zg-mono);">{{ row.slug }}</td>
                      <td style="padding: 6px 12px;">{{ row.label }}</td>
                      <td style="padding: 6px 12px;">{{ row.status }}</td>
                      <td style="padding: 6px 12px;">{{ row.private }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div v-if="importPhase === 'done'" style="text-align: center; padding: 24px 0;">
              <div style="font-size: 40px; color: var(--zg-good); margin-bottom: 12px;">✓</div>
              <h4 style="margin: 0; font-size: 15px; color: var(--zg-text);">Bulk CSV Category Upload completed</h4>
              <p style="margin: 6px 0 0 0; font-size: 12px; color: var(--zg-text-dim);">{{ importPreviewRows.length }} rows have been appended to the active category registry.</p>
            </div>
          </div>

          <div class="modal-footer" style="padding: 14px 20px; border-top: 1px solid var(--zg-line); display: flex; gap: 8px; justify-content: flex-end; background: var(--zg-bg);">
            <button v-if="importPhase === 'preview'" class="zen-btn-ghost" @click="importPhase = 'upload'">Back</button>
            <button v-if="importPhase === 'preview'" class="zen-btn-primary" @click="saveBulkImport">Confirm and Import</button>
            <button v-if="importPhase === 'done'" class="zen-btn-primary" @click="importOpen = false">Close</button>
            <button v-if="importPhase !== 'done'" class="zen-btn-ghost" @click="importOpen = false">Cancel</button>
          </div>

        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>

import { storeToRefs } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import { useCategoriesStore } from '../../../stores/categories'

const categoriesStore = useCategoriesStore()
const { internalCategories, marketplaceCategories, loading, error, page, perPage, total, lastPage, kpis } = storeToRefs(categoriesStore)

const MARKETS = ['AE', 'SA', 'EG', 'KW', 'BH', 'QA', 'OM']

// Load data on mount
onMounted(() => {
  categoriesStore.load()
})

// Pagination
const totalPages = computed(() => lastPage.value)

const onPageChange = (event) => {
  const newPage = event.page + 1
  categoriesStore.load({ page: newPage })
}




// ── State variables ───────────────────────────────────────
const activeView = ref('products') // 'products' (internal) or 'marketplace'
const mktFilter = ref('all')
const expandedRoots = ref({})
const statsForId = ref(null)
const statsPanelType = ref('products') // 'products' or 'marketplace'

// Bulk Import State
const importOpen = ref(false)
const importTab = ref('products')
const importPhase = ref('upload')
const importPreviewRows = ref([])
const importError = ref('')

// Category Edit Drawer State
const drawerOpen = ref(false)
const editCategoryObj = ref(null)
const editParentCategoryObj = ref(null)
const isMarketplaceDrawer = ref(false)

// Forms inputs local refs
const localLabel = ref('')
const localSlug = ref('')
const localStatus = ref('active')
const localDescription = ref('')
const localFeatured = ref(false)
const localPrivate = ref(false)
const localSeoTitle = ref('')
const localSeoDesc = ref('')
const localSeoSlug = ref('')
const localCommission = ref(15)
const localRequiresApproval = ref(false)
const localRequirements = ref('')
const localMarketsMap = ref({})

// Mobile/Home/Hero files upload helpers
const bannerMobileFile = ref(null)
const bannerHomeFile = ref(null)
const bannerHeroFile = ref(null)

// ── Computed Properties ───────────────────────────────────
const currentCategories = computed(() => {
  if (activeView.value === 'products') {
    return mktFilter.value === 'all'
      ? internalCategories.value
      : internalCategories.value.filter(c => c.markets?.[mktFilter.value]?.enabled)
  } else {
    return mktFilter.value === 'all'
      ? marketplaceCategories.value
      : marketplaceCategories.value.filter(c => c.markets?.[mktFilter.value]?.enabled)
  }
})



// KPI Metrics from store
const totalCategoriesCount = computed(() => kpis.value.taxonomyTrees || 0)
const activeCategoriesCount = computed(() => kpis.value.activeStorefront || 0)
const privateCategoriesCount = computed(() => kpis.value.privateB2bTiers || 0)
const totalProductsCount = computed(() => kpis.value.totalCatalogItems || 0)
const belowMinTotalCount = computed(() => kpis.value.thresholdWarnings || 0)

// ── Helpers ───────────────────────────────────────────────
const isBelowMin = (cat, mkt) => {
  const m = cat.markets?.[mkt]
  return m?.enabled && m.listing_count < m.min_listings
}

const hasAnyBelowMin = (cat) => {
  return MARKETS.some(m => isBelowMin(cat, m))
}

const toggleExpand = (id) => {
  expandedRoots.value[id] = !expandedRoots.value[id]
}

const toggleRootStatus = (id, type) => {
  if (type === 'products') {
    const item = internalCategories.value.find(c => c.id === id)
    if (item) {
      item.status = item.status === 'active' ? 'inactive' : 'active'
    }
  } else {
    const item = marketplaceCategories.value.find(c => c.id === id)
    if (item) {
      item.status = item.status === 'active' ? 'inactive' : 'active'
    }
  }
}

const toggleChildStatus = (parentId, childId) => {
  const parent = internalCategories.value.find(c => c.id === parentId)
  if (parent && parent.children) {
    const child = parent.children.find(ch => ch.id === childId)
    if (child) {
      child.status = child.status === 'active' ? 'inactive' : 'active'
    }
  }
}

const toggleStatsFor = (id, type) => {
  if (statsForId.value === id) {
    statsForId.value = null
  } else {
    statsForId.value = id
    statsPanelType.value = type
  }
}

// ── Drag & Drop Mock ──────────────────────────────────────
const dragStartIndex = ref(null)

const handleDragStart = (idx) => {
  dragStartIndex.value = idx
}

const handleDragOver = (e) => {
  e.preventDefault()
}

const handleDrop = (idx) => {
  if (dragStartIndex.value === null || dragStartIndex.value === idx) return
  if (activeView.value === 'products') {
    const list = [...internalCategories.value]
    const [moved] = list.splice(dragStartIndex.value, 1)
    list.splice(idx, 0, moved)
    internalCategories.value = list
  } else {
    const list = [...marketplaceCategories.value]
    const [moved] = list.splice(dragStartIndex.value, 1)
    list.splice(idx, 0, moved)
    marketplaceCategories.value = list
  }
  dragStartIndex.value = null
}

// ── CSV Operations ────────────────────────────────────────
const buildSampleCsv = (tab) => {
  if (tab === 'products') {
    return 'slug,label,parent_slug,status,private,featured\nwomens-fashion,Women\'s Fashion,,active,false,true\nabayas,Abayas,womens-fashion,active,false,false'
  }
  return 'slug,label,mapped_to_slug,commission_pct,requires_approval,status\nwomen-clothing,Women — Clothing,womens-fashion,15,true,active'
}

const downloadCsv = (filename, content) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
}

const openImport = (tab) => {
  importTab.value = tab
  importPhase.value = 'upload'
  importError.value = ''
  importPreviewRows.value = []
  importOpen.value = true
}

const triggerImportSelect = () => {
  // Mock parse CSV upload
  importPreviewRows.value = [
    { slug: 'new-trend', label: 'New Trends Modest', status: 'active', private: 'false', featured: 'true' },
    { slug: 'abaya-classic', label: 'Classic Embroidered Abayas', status: 'active', private: 'false', featured: 'false' },
    { slug: 'velvet-kaftans', label: 'Velvet Winter Kaftans', status: 'draft', private: 'true', featured: 'false' },
  ]
  importPhase.value = 'preview'
}

const saveBulkImport = () => {
  if (importTab.value === 'products') {
    importPreviewRows.value.forEach((row, i) => {
      internalCategories.value.push({
        id: `CAT-IMPORT-${i}`,
        slug: row.slug,
        label: row.label,
        description: 'Bulk imported row description details',
        status: row.status,
        private: row.private === 'true',
        featured: row.featured === 'true',
        product_count: 0,
        markets: {
          AE: { enabled: true, min_listings: 10, listing_count: 12, vendor_count: 1 }
        },
        children: []
      })
    })
  } else {
    importPreviewRows.value.forEach((row, i) => {
      marketplaceCategories.value.push({
        id: `MC-IMPORT-${i}`,
        slug: row.slug,
        label: row.label,
        mapped_to: 'CAT-001',
        mapped_label: "Women's Fashion",
        status: row.status,
        vendor_count: 0,
        listing_count: 0,
        commission_pct: 15,
        requires_approval: true,
        listing_requirements: [],
        markets: {
          AE: { enabled: true, commission_pct: 15, min_listings: 10, listing_count: 0, vendor_count: 0 }
        }
      })
    })
  }
  importPhase.value = 'done'
}

// ── Edit Drawer Operations ────────────────────────────────
const openCategoryDrawer = (catObj = null, parentObj = null, isMkt = false) => {
  editCategoryObj.value = catObj
  editParentCategoryObj.value = parentObj
  isMarketplaceDrawer.value = isMkt

  // Populate form fields
  if (catObj) {
    localLabel.value = catObj.label || ''
    localSlug.value = catObj.slug || ''
    localStatus.value = catObj.status || 'active'
    localDescription.value = catObj.description || ''
    localFeatured.value = catObj.featured || false
    localPrivate.value = catObj.private || false
    localSeoTitle.value = catObj.seo_title || ''
    localSeoDesc.value = catObj.seo_desc || ''
    localSeoSlug.value = catObj.seo_slug || ''
    localCommission.value = catObj.commission_pct || 15
    localRequiresApproval.value = catObj.requires_approval || false
    localRequirements.value = catObj.listing_requirements ? catObj.listing_requirements.join('\n') : ''
    localMarketsMap.value = JSON.parse(JSON.stringify(catObj.markets || {}))
  } else {
    localLabel.value = ''
    localSlug.value = ''
    localStatus.value = 'active'
    localDescription.value = ''
    localFeatured.value = false
    localPrivate.value = false
    localSeoTitle.value = ''
    localSeoDesc.value = ''
    localSeoSlug.value = ''
    localCommission.value = 15
    localRequiresApproval.value = false
    localRequirements.value = ''
    localMarketsMap.value = Object.fromEntries(MARKETS.map(m => [m, { enabled: false, min_listings: 10, commission_pct: 15 }]))
  }

  // Files uploads empty reset
  bannerMobileFile.value = null
  bannerHomeFile.value = null
  bannerHeroFile.value = null

  drawerOpen.value = true
}

const saveCategoryChanges = () => {
  if (!localLabel.value.trim()) {
    alert('Category Name is required')
    return
  }

  const generatedSlug = localSlug.value.trim() || localLabel.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const payload = {
    label: localLabel.value,
    slug: generatedSlug,
    status: localStatus.value,
    description: localDescription.value,
    featured: localFeatured.value,
    private: localPrivate.value,
    seo_title: localSeoTitle.value,
    seo_desc: localSeoDesc.value,
    seo_slug: localSeoSlug.value,
    commission_pct: localCommission.value,
    requires_approval: localRequiresApproval.value,
    listing_requirements: localRequirements.value.split('\n').filter(r => r.trim()),
    markets: localMarketsMap.value
  }

  if (editCategoryObj.value) {
    // Update existing
    Object.assign(editCategoryObj.value, payload)
  } else {
    // Add new
    const newId = `CAT-NEW-${Date.now()}`
    const newCat = {
      id: newId,
      product_count: 0,
      children: [],
      ...payload
    }

    if (isMarketplaceDrawer.value) {
      newCat.vendor_count = 0
      newCat.listing_count = 0
      newCat.mapped_to = 'CAT-001'
      newCat.mapped_label = "Women's Fashion"
      marketplaceCategories.value.push(newCat)
    } else {
      if (editParentCategoryObj.value) {
        editParentCategoryObj.value.children.push(newCat)
      } else {
        internalCategories.value.push(newCat)
      }
    }
  }

  drawerOpen.value = false
}

const handleFileUpload = (type, files) => {
  if (files && files[0]) {
    if (type === 'mobile') bannerMobileFile.value = files[0].name
    if (type === 'home') bannerHomeFile.value = files[0].name
    if (type === 'hero') bannerHeroFile.value = files[0].name
  }
}

const deleteCategory = (catId, type) => {
  if (confirm('Are you sure you want to delete this category? All its subcategories will be removed.')) {
    if (type === 'products') {
      internalCategories.value = internalCategories.value.filter(c => c.id !== catId)
    } else {
      marketplaceCategories.value = marketplaceCategories.value.filter(c => c.id !== catId)
    }
    statsForId.value = null
  }
}
</script>

<style scoped>
@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.zv-module {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.mode-btn.is-active {
  background: var(--zg-accent) !important;
  color: #fff !important;
  box-shadow: 0 2px 8px var(--zg-accent-tint);
}
</style>
