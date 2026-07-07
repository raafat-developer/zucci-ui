<template>
  <div class="zv-module">
    <!-- Header -->
        <PageHeader title="Variant Configuration" subtitle="Add variant types, review product combination stock pricing, and review seller requests" iconColor="var(--zg-accent);">
      <template #icon>
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
      </template>
      <template #actions>
        <!-- Subtab Switcher -->
        <div class="view-mode-toggle" style="display: flex; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); padding: 2px; margin-right: 12px;">
          <button class="mode-btn" :class="{ 'is-active': activeSubtab === 'types' }" @click="activeSubtab = 'types'" style="padding: 4px 12px; border-radius: 4px; border: none; font-size: 11.5px; font-weight: 600; cursor: pointer; color: var(--zg-text); background: transparent;">
            Variant Types
          </button>
          <button class="mode-btn" :class="{ 'is-active': activeSubtab === 'products' }" @click="activeSubtab = 'products'" style="padding: 4px 12px; border-radius: 4px; border: none; font-size: 11.5px; font-weight: 600; cursor: pointer; color: var(--zg-text); background: transparent;">
            Product Configs
          </button>
          <button class="mode-btn" :class="{ 'is-active': activeSubtab === 'requests' }" @click="activeSubtab = 'requests'" style="padding: 4px 12px; border-radius: 4px; border: none; font-size: 11.5px; font-weight: 600; cursor: pointer; color: var(--zg-text); background: transparent;">
            Seller Requests
          </button>
        </div>

        <button v-if="activeSubtab === 'types'" class="zs-btn zs-btn--primary" @click="openTypeDrawer(null)">
          + Add Type
        </button>
      </template>
    </PageHeader>

    <!-- KPI Strip -->
    <div class="zwh-kpi-strip">
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Variant types defined</span>
        <span class="zwh-kpi-val">{{ variantTypes.length }}</span>
        <span class="zwh-kpi-sub">live options (size, color, material)</span>
      </div>
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Active Types</span>
        <span class="zwh-kpi-val is-good">{{ variantTypes.filter(t => t.status === 'active').length }}</span>
        <span class="zwh-kpi-sub">enabled in storefront editor</span>
      </div>
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Product Configs</span>
        <span class="zwh-kpi-val is-accent">{{ productVariants.length }}</span>
        <span class="zwh-kpi-sub">items with variant profiles</span>
      </div>
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Total SKUs</span>
        <span class="zwh-kpi-val">{{ totalSkusCount }}</span>
        <span class="zwh-kpi-sub">unique barcode entries</span>
      </div>
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Disabled SKUs</span>
        <span class="zwh-kpi-val" :class="{ 'is-warn': disabledSkusCount > 0 }">{{ disabledSkusCount }}</span>
        <span class="zwh-kpi-sub">off status / inactive</span>
      </div>
    </div>

    <!-- Body contents -->
    <div class="zv-body" style="overflow-y: auto;">
      
      <!-- ── 1. TAB: VARIANT TYPES LIST ── -->
      <div v-if="activeSubtab === 'types'" style="border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); overflow: hidden;">
        <div style="display: grid; grid-template-columns: 28px 1.5fr 1fr 1.2fr 1.5fr 80px 80px; gap: 10px; padding: 10px 14px; background: var(--zg-panel-hi); border-bottom: 1px solid var(--zg-line); font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--zg-text-dim);">
          <span></span>
          <span>Variant Type</span>
          <span>Input Swatch</span>
          <span>Applies Category</span>
          <span>Sample options</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        <div 
          v-for="(t, idx) in variantTypes" 
          :key="t.id"
          draggable="true"
          @dragstart="handleDragStart(idx)"
          @dragover="handleDragOver"
          @drop="handleDrop(idx)"
          style="display: grid; grid-template-columns: 28px 1.5fr 1fr 1.2fr 1.5fr 80px 80px; gap: 10px; padding: 12px 14px; border-bottom: 1px solid var(--zg-line-soft); align-items: center; background: var(--zg-panel); cursor: grab;"
        >
          <div style="color: var(--zg-text-xdim); display: flex; align-items: center;">
            <svg viewBox="0 0 8 12" width="8" height="12" fill="currentColor">
              <circle cx="2" cy="2" r="1.1"/><circle cx="6" cy="2" r="1.1"/>
              <circle cx="2" cy="6" r="1.1"/><circle cx="6" cy="6" r="1.1"/>
              <circle cx="2" cy="10" r="1.1"/><circle cx="6" cy="10" r="1.1"/>
            </svg>
          </div>
          <div>
            <div style="font-weight: 700; font-size: 13px; color: var(--zg-text);">{{ t.name }} {{ t.icon }}</div>
            <div style="font-family: var(--zg-mono); font-size: 10px; color: var(--zg-text-xdim); margin-top: 2px;">{{ t.code }}</div>
          </div>
          <span style="font-size: 12px; color: var(--zg-text-mid);">
            {{ t.input_type === 'swatch_color' ? 'Color swatches' : t.input_type === 'swatch_text' ? 'Text buttons' : 'Dropdown list' }}
          </span>
          <span style="font-size: 11.5px; color: var(--zg-text-dim); text-transform: capitalize;">
            {{ t.applies_to.join(', ') }}
          </span>
          <div style="display: flex; gap: 4px; flex-wrap: wrap;">
            <span 
              v-for="opt in t.options.slice(0, 3)" 
              :key="typeof opt === 'object' ? opt.label : opt"
              style="font-size: 9.5px; padding: 1px 5px; border-radius: 4px; background: var(--zg-panel-hi); border: 1px solid var(--zg-line);"
            >
              {{ typeof opt === 'object' ? opt.label : opt }}
            </span>
            <span v-if="t.options.length > 3" style="font-size: 9.5px; color: var(--zg-text-xdim); align-self: center;">+{{ t.options.length - 3 }}</span>
          </div>
          <button class="zcat-toggle" :class="t.status === 'active' ? 'on' : 'off'" @click.stop="toggleTypeStatus(t)">
            <div class="zcat-toggle-knob"></div>
          </button>
          <div>
            <button class="zcat-act" @click.stop="openTypeDrawer(t)">Edit</button>
          </div>
        </div>
      </div>

      <!-- ── 2. TAB: PRODUCT CONFIGS LIST ── -->
      <div v-if="activeSubtab === 'products'" style="border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); overflow: hidden;">
        <div style="display: grid; grid-template-columns: 1.5fr 1fr 1.5fr 80px 80px 100px; gap: 10px; padding: 10px 14px; background: var(--zg-panel-hi); border-bottom: 1px solid var(--zg-line); font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--zg-text-dim);">
          <span>Product Name</span>
          <span>Brand</span>
          <span>Variant Types enabled</span>
          <span>Total SKUs</span>
          <span>Disabled</span>
          <span>Actions</span>
        </div>

        <div 
          v-for="pv in productVariants" 
          :key="pv.id"
          class="pv-row"
          style="display: grid; grid-template-columns: 1.5fr 1fr 1.5fr 80px 80px 100px; gap: 10px; padding: 12px 14px; border-bottom: 1px solid var(--zg-line-soft); align-items: center; background: var(--zg-panel);"
        >
          <div>
            <div style="font-weight: 700; font-size: 13px; color: var(--zg-text);">{{ pv.product }}</div>
            <div style="font-family: var(--zg-mono); font-size: 10px; color: var(--zg-text-xdim); margin-top: 2px;">{{ pv.sku }}</div>
          </div>
          <span style="font-size: 12.5px; color: var(--zg-text-mid);">{{ pv.brand }}</span>
          <div style="display: flex; gap: 4px; flex-wrap: wrap;">
            <span 
              v-for="vt in pv.variant_types" 
              :key="vt"
              style="font-size: 9.5px; padding: 1.5px 6px; background: var(--zg-accent-tint); color: var(--zg-accent); border-radius: 4px; font-weight: 600;"
            >
              {{ variantTypes.find(t => t.id === vt)?.name || vt }}
            </span>
          </div>
          <span style="font-family: var(--zg-mono); font-size: 12.5px; color: var(--zg-text-mid);">{{ pv.variants.length }}</span>
          <span style="font-family: var(--zg-mono); font-size: 12.5px;" :class="pv.variants.filter(v => v.status !== 'active').length > 0 ? 'color: var(--zg-warn); font-weight: 700;' : 'color: var(--zg-text-dim);'">
            {{ pv.variants.filter(v => v.status !== 'active').length || '—' }}
          </span>
          <div>
            <button class="zcat-act" @click="manageConfig(pv)">Configure</button>
          </div>
        </div>
      </div>

      <!-- ── 3. TAB: SELLER REQUESTS LIST ── -->
      <div v-if="activeSubtab === 'requests'" style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; gap: 6px; align-items: center;">
          <button 
            v-for="st in ['all', 'cat_review', 'ops_review', 'approved']" 
            :key="st"
            class="zwh-filter-chip"
            :class="{ 'is-active': requestsFilter === st }"
            @click="requestsFilter = st"
          >
            {{ st === 'all' ? 'All Requests' : st === 'cat_review' ? 'Category Review' : st === 'ops_review' ? 'Ops Review' : 'Approved' }}
          </button>
        </div>

        <div style="border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); overflow: hidden;">
          <div style="display: grid; grid-template-columns: 80px 1.5fr 1fr 1.5fr 1fr 100px; gap: 10px; padding: 10px 14px; background: var(--zg-panel-hi); border-bottom: 1px solid var(--zg-line); font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--zg-text-dim);">
            <span>Request ID</span>
            <span>Product / Brand</span>
            <span>Variant Target</span>
            <span>Proposed Values</span>
            <span>Review Status</span>
            <span>Actions</span>
          </div>

          <div 
            v-for="req in variantRequests.filter(r => requestsFilter === 'all' || r.status === requestsFilter)" 
            :key="req.id"
            class="req-row"
            style="display: grid; grid-template-columns: 80px 1.5fr 1fr 1.5fr 1fr 100px; gap: 10px; padding: 12px 14px; border-bottom: 1px solid var(--zg-line-soft); align-items: center; background: var(--zg-panel); cursor: pointer;"
            @click="viewRequest(req)"
          >
            <span style="font-family: var(--zg-mono); font-size: 11.5px; color: var(--zg-text-dim);">{{ req.id }}</span>
            <div>
              <div style="font-weight: 700; font-size: 13px; color: var(--zg-text);">{{ req.product }}</div>
              <div style="font-size: 11px; color: var(--zg-text-dim); margin-top: 2px;">{{ req.vendor }}</div>
            </div>
            <span style="font-weight: 600; font-size: 12.5px; color: var(--zg-text-mid);">{{ req.variant_type_name }}</span>
            <div style="display: flex; gap: 4px; flex-wrap: wrap;">
              <span v-for="val in req.requested_values" :key="val" style="font-size: 9.5px; padding: 1px 5px; background: var(--zg-accent-tint); color: var(--zg-accent); border-radius: 4px; font-weight: 700;">
                {{ val }}
              </span>
            </div>
            <span>
              <span class="zen-bst" :class="req.status === 'approved' ? 'zen-bst--active' : 'zen-bst--pending'">
                {{ req.status === 'cat_review' ? 'Category Review' : req.status === 'ops_review' ? 'Ops Review' : req.status }}
              </span>
            </span>
            <div>
              <button class="zcat-act" @click.stop="viewRequest(req)">Review Request</button>
            </div>
          </div>
          <div v-if="variantRequests.filter(r => requestsFilter === 'all' || r.status === requestsFilter).length === 0" style="padding: 32px; text-align: center; color: var(--zg-text-dim);">No pending requests logged</div>
        </div>
      </div>

    </div>

    <!-- ── TELEPORT OVERLAY: EDIT VARIANT TYPE DRAWER ── -->
    <Teleport to="body">
      <div v-if="typeDrawerOpen" class="drawer-overlay" @click.self="typeDrawerOpen = false" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; justify-content: flex-end;">
        <div class="drawer-panel" style="width: 520px; height: 100%; background: var(--zg-bg-elev); border-left: 1px solid var(--zg-line); display: flex; flex-direction: column; box-shadow: -8px 0 24px rgba(0,0,0,0.3); animation: slideIn 0.25s ease-out;">
          
          <div class="drawer-header" style="padding: 16px 20px; border-bottom: 1px solid var(--zg-line); display: flex; align-items: center; justify-content: space-between;">
            <div>
              <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: var(--zg-text);">
                {{ editingTypeObj ? 'Edit Variant Type' : 'Create Variant Type' }}
              </h3>
              <p style="margin: 3px 0 0 0; font-size: 11.5px; color: var(--zg-text-dim);">Define internal variables and swatches configurations</p>
            </div>
            <button @click="typeDrawerOpen = false" style="background: transparent; border: none; font-size: 20px; cursor: pointer; color: var(--zg-text-dim);">&times;</button>
          </div>

          <div class="drawer-body" style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px;">
            <div class="zcat-field">
              <label class="zcat-label">Name *</label>
              <input type="text" v-model="typeFormName" class="zcat-input" placeholder="e.g. Size" />
            </div>

            <div class="zcat-field">
              <label class="zcat-label">Code (internal slug)</label>
              <input type="text" v-model="typeFormCode" class="zcat-input" style="font-family: var(--zg-mono);" placeholder="e.g. size" />
            </div>

            <div class="zcat-field">
              <label class="zcat-label">Swatch input selector</label>
              <select v-model="typeFormInput" class="zcat-select" style="width: 100%; height: 32px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); padding: 0 8px; color: var(--zg-text); font-family: inherit;">
                <option value="select">Dropdown Select List</option>
                <option value="swatch_text">Text Buttons</option>
                <option value="swatch_color">Color circular swatch</option>
              </select>
            </div>

            <div class="zcat-field">
              <label class="zcat-label">Applies to categories</label>
              <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                <button 
                  v-for="c in CATS" 
                  :key="c" 
                  class="zwh-filter-chip"
                  :class="{ 'is-active': typeFormAppliesTo.includes(c) }"
                  @click="toggleAppliesTo(c)"
                >
                  {{ c }}
                </button>
              </div>
            </div>

            <div class="zcat-field">
              <label class="zcat-label">Options list (One option per line)</label>
              <textarea v-model="typeFormOptionsText" class="zcat-textarea" rows="4" placeholder="e.g.&#10;XS&#10;S&#10;M&#10;L"></textarea>
            </div>

            <div class="zcat-toggle-row" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--zg-line-soft);">
              <div>
                <div style="font-weight: 600; font-size: 12px; color: var(--zg-text);">Requires Size Chart verification</div>
                <div style="font-size: 10px; color: var(--zg-text-dim);">Force sellers to upload a matching guide before publishing</div>
              </div>
              <button class="zcat-toggle" :class="typeFormRequiresChart ? 'on' : 'off'" @click="typeFormRequiresChart = !typeFormRequiresChart"><div class="zcat-toggle-knob"></div></button>
            </div>
          </div>

          <div class="drawer-footer" style="padding: 16px 20px; border-top: 1px solid var(--zg-line); display: flex; gap: 8px; justify-content: flex-end; background: var(--zg-bg);">
            <button class="zen-btn-ghost" @click="typeDrawerOpen = false">Cancel</button>
            <button class="zen-btn-primary" @click="saveTypeChanges">Save changes</button>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- ── TELEPORT OVERLAY: MANAGE PRODUCT CONFIG DRAWER ── -->
    <Teleport to="body">
      <div v-if="configDrawerOpen" class="drawer-overlay" @click.self="configDrawerOpen = false" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; justify-content: flex-end;">
        <div class="drawer-panel" style="width: 720px; height: 100%; background: var(--zg-bg-elev); border-left: 1px solid var(--zg-line); display: flex; flex-direction: column; box-shadow: -8px 0 24px rgba(0,0,0,0.3); animation: slideIn 0.25s ease-out;">
          
          <div class="drawer-header" style="padding: 16px 20px; border-bottom: 1px solid var(--zg-line); display: flex; align-items: center; justify-content: space-between;">
            <div>
              <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: var(--zg-text);">{{ activeConfigProduct.product }}</h3>
              <p style="margin: 3px 0 0 0; font-size: 11.5px; color: var(--zg-text-dim);">SKU: {{ activeConfigProduct.sku }} · Drag rows to reorder combinations</p>
            </div>
            <button @click="configDrawerOpen = false" style="background: transparent; border: none; font-size: 20px; cursor: pointer; color: var(--zg-text-dim);">&times;</button>
          </div>

          <div class="drawer-body" style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px;">
            <div style="display: grid; grid-template-columns: 28px 1.5fr 80px 100px 70px 80px 60px; gap: 8px; padding: 6px; background: var(--zg-panel-hi); border-bottom: 1px solid var(--zg-line); font-size: 9.5px; font-weight: 700; text-transform: uppercase; color: var(--zg-text-dim);">
              <span></span>
              <span>SKU barcode / Specs</span>
              <span>Base price</span>
              <span>Override price</span>
              <span>Stock</span>
              <span>Status</span>
              <span>Enable</span>
            </div>

            <!-- Variants combinations drag list -->
            <div 
              v-for="(v, idx) in configVariantsCopy" 
              :key="v.id"
              draggable="true"
              @dragstart="dragStartVariant(idx)"
              @dragover="handleDragOver"
              @drop="dropVariant(idx)"
              style="display: grid; grid-template-columns: 28px 1.5fr 80px 100px 70px 80px 60px; gap: 8px; padding: 10px 6px; border-bottom: 1px solid var(--zg-line-soft); align-items: center; background: var(--zg-panel); cursor: grab;"
              :style="{ opacity: v.status === 'active' ? 1 : 0.5 }"
            >
              <div style="color: var(--zg-text-xdim); cursor: grab;">
                <svg viewBox="0 0 8 12" width="8" height="12" fill="currentColor">
                  <circle cx="2" cy="2" r="1.1"/><circle cx="6" cy="2" r="1.1"/>
                  <circle cx="2" cy="6" r="1.1"/><circle cx="6" cy="6" r="1.1"/>
                  <circle cx="2" cy="10" r="1.1"/><circle cx="6" cy="10" r="1.1"/>
                </svg>
              </div>
              <div>
                <div style="font-family: var(--zg-mono); font-size: 11px; font-weight: 700; color: var(--zg-text);">{{ v.sku }}</div>
                <div style="font-size: 10.5px; color: var(--zg-text-dim); margin-top: 1px;">
                  {{ [v.size, v.colour, v.material].filter(Boolean).join(' · ') }}
                </div>
              </div>
              <span style="font-family: var(--zg-mono); font-size: 12px; color: var(--zg-text-mid);">AED {{ v.price_base }}</span>
              <input type="number" v-model.number="v.price_override" placeholder="—" style="width: 80px; height: 26px; border: 1px solid var(--zg-line); background: var(--zg-bg); color: var(--zg-accent); font-family: var(--zg-mono); font-weight: 700; border-radius: 4px; padding: 0 4px; text-align: center;" />
              <input type="number" v-model.number="v.stock" style="width: 60px; height: 26px; border: 1px solid var(--zg-line); background: var(--zg-bg); color: var(--zg-text); font-family: var(--zg-mono); border-radius: 4px; padding: 0 4px; text-align: center;" />
              <span>
                <span class="zen-bst" :class="v.status === 'active' ? 'zen-bst--active' : 'zen-bst--inactive'">{{ v.status }}</span>
              </span>
              <button class="zcat-toggle" :class="v.status === 'active' ? 'on' : 'off'" @click="toggleVariantState(v)">
                <div class="zcat-toggle-knob"></div>
              </button>
            </div>
          </div>

          <div class="drawer-footer" style="padding: 16px 20px; border-top: 1px solid var(--zg-line); display: flex; gap: 8px; justify-content: flex-end; background: var(--zg-bg);">
            <button class="zen-btn-ghost" @click="configDrawerOpen = false">Cancel</button>
            <button class="zen-btn-primary" @click="saveConfigChanges">Save Changes</button>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- ── TELEPORT OVERLAY: DETAILED SELLER REQUEST REVIEW DRAWER ── -->
    <Teleport to="body">
      <div v-if="activeRequestObj" class="drawer-overlay" @click.self="requestDrawerOpen = false" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; justify-content: flex-end;">
        <div class="drawer-panel" style="width: 520px; height: 100%; background: var(--zg-bg-elev); border-left: 1px solid var(--zg-line); display: flex; flex-direction: column; box-shadow: -8px 0 24px rgba(0,0,0,0.3); animation: slideIn 0.25s ease-out;">
          
          <div class="drawer-header" style="padding: 16px 20px; border-bottom: 1px solid var(--zg-line); display: flex; align-items: center; justify-content: space-between;">
            <div>
              <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: var(--zg-text);">{{ activeRequestObj.id }} — {{ activeRequestObj.variant_type_name }} proposal</h3>
              <p style="margin: 3px 0 0 0; font-size: 11.5px; color: var(--zg-text-dim);">Product: {{ activeRequestObj.product }} · Vendor: {{ activeRequestObj.vendor }}</p>
            </div>
            <button @click="activeRequestObj = null" style="background: transparent; border: none; font-size: 20px; cursor: pointer; color: var(--zg-text-dim);">&times;</button>
          </div>

          <div class="drawer-body" style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px;">
            <div style="padding: 12px; border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); background: var(--zg-panel); font-size: 12px; color: var(--zg-text-mid); line-height: 1.5;">
              <strong>Reason for proposal:</strong> <br />
              {{ activeRequestObj.reason }}
            </div>

            <div>
              <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--zg-text-dim); margin-bottom: 6px;">Requested new options:</div>
              <div style="display: flex; gap: 6px;">
                <span v-for="val in activeRequestObj.requested_values" :key="val" style="font-size: 11px; font-weight: 700; padding: 3px 10px; background: var(--zg-accent-tint); color: var(--zg-accent); border-radius: 4px;">
                  {{ val }}
                </span>
              </div>
            </div>

            <!-- Approval flow steps -->
            <div>
              <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--zg-text-dim); margin-bottom: 10px;">Approval validation flow</div>
              <div style="display: flex; flex-direction: column; gap: 0;">
                <div v-for="(step, idx) in activeRequestObj.steps" :key="idx" style="display: flex; gap: 12px; padding-bottom: 16px; position: relative;">
                  <div style="position: relative; flex-shrink: 0;">
                    <div 
                      style="width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700;"
                      :style="{
                        background: step.at ? 'var(--zg-good)' : (activeRequestObj.status === 'cat_review' && step.role === 'cat_mgr' ? 'var(--zg-accent)' : 'var(--zg-panel)'),
                        color: step.at ? '#fff' : 'var(--zg-text-dim)',
                        border: step.at ? 'none' : '1px solid var(--zg-line)'
                      }"
                    >
                      {{ step.at ? '✓' : idx + 1 }}
                    </div>
                    <div v-if="idx < activeRequestObj.steps.length - 1" style="position: absolute; left: 11px; top: 24px; width: 2px; height: calc(100% - 2px); background: var(--zg-line);"></div>
                  </div>
                  <div style="flex: 1; padding-top: 2px;">
                    <div style="font-weight: 700; font-size: 12.5px; color: var(--zg-text);">{{ step.label }}</div>
                    <div style="font-size: 11px; color: var(--zg-text-dim); margin-top: 2px;">
                      <span v-if="step.actor">By {{ step.actor }} · {{ new Date(step.at).toLocaleDateString() }}</span>
                      <span v-else style="color: var(--zg-text-xdim);">Awaiting review...</span>
                    </div>
                    <div v-if="step.note" style="font-size: 11.5px; color: var(--zg-text-mid); padding: 6px; border: 1px dashed var(--zg-line); border-radius: 4px; background: var(--zg-bg); margin-top: 4px;">
                      {{ step.note }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Review Actions Inputs -->
            <div v-if="activeRequestObj.status !== 'approved' && activeRequestObj.status !== 'rejected'" class="zcat-field" style="border-top: 1px solid var(--zg-line); padding-top: 12px;">
              <label class="zcat-label">Verification decision note</label>
              <textarea v-model="reviewNoteText" class="zcat-textarea" rows="2" placeholder="e.g. Approved category check..."></textarea>
            </div>

          </div>

          <div class="drawer-footer" style="padding: 16px 20px; border-top: 1px solid var(--zg-line); display: flex; gap: 8px; justify-content: flex-end; background: var(--zg-bg);">
            <button v-if="activeRequestObj.status === 'cat_review'" class="zen-btn-primary" @click="approveCategoryRequest">Approve Category Review</button>
            <button v-if="activeRequestObj.status === 'ops_review'" class="zen-btn-primary" @click="approveOpsRequest">Confirm &amp; Publish</button>
            <button v-if="activeRequestObj.status === 'pending'" class="zs-btn" @click="assignRequest">Assign manager</button>
            <button v-if="activeRequestObj.status !== 'approved' && activeRequestObj.status !== 'rejected'" class="zen-btn-ghost" style="color: var(--zg-danger);" @click="rejectRequest">Reject Request</button>
            <button class="zen-btn-ghost" @click="activeRequestObj = null">Close</button>
          </div>

        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>

import { storeToRefs } from 'pinia'
const { variantTypes, productVariants, variantRequests } = storeToRefs(useVariantsStore())
import { ref, computed } from 'vue'
import { useVariantsStore } from '../../../stores/variants'

// ── State variables ───────────────────────────────────────
const activeSubtab = ref('types') // 'types' | 'products' | 'requests'
// Search & filters
const requestsFilter = ref('all')

// Edit Variant Type Drawer
const typeDrawerOpen = ref(false)
const editingTypeObj = ref(null)
const typeFormName = ref('')
const typeFormCode = ref('')
const typeFormInput = ref('select')
const typeFormStatus = ref('active')
const typeFormRequiresChart = ref(false)
const typeFormOptionsText = ref('')
const typeFormAppliesTo = ref([])

// Manage Product Config Drawer
const configDrawerOpen = ref(false)
const activeConfigProduct = ref(null)
const configVariantsCopy = ref([])

// Detail Variant Request Drawer
const requestDrawerOpen = ref(false)
const activeRequestObj = ref(null)
const reviewNoteText = ref('')

const CATS = ['clothing', 'footwear', 'accessories', 'beauty', 'fragrance', 'kids', 'sportswear', 'jewellery']

// ── Computed Properties ───────────────────────────────────
const disabledSkusCount = computed(() => {
  let count = 0
  productVariants.value.forEach(p => {
    count += p.variants.filter(v => v.status !== 'active').length
  })
  return count
})

const totalSkusCount = computed(() => {
  return productVariants.value.reduce((s, p) => s + p.variants.length, 0)
})

// Drag Index Tracker
const dragIndex = ref(null)

// ── Methods ───────────────────────────────────────────────
const toggleTypeStatus = (type) => {
  type.status = type.status === 'active' ? 'inactive' : 'active'
}

const handleDragStart = (idx) => {
  dragIndex.value = idx
}

const handleDragOver = (e) => {
  e.preventDefault()
}

const handleDrop = (idx) => {
  if (dragIndex.value === null || dragIndex.value === idx) return
  const list = [...variantTypes.value]
  const [moved] = list.splice(dragIndex.value, 1)
  list.splice(idx, 0, moved)
  variantTypes.value = list
  dragIndex.value = null
}

const openTypeDrawer = (typeObj = null) => {
  editingTypeObj.value = typeObj
  if (typeObj) {
    typeFormName.value = typeObj.name
    typeFormCode.value = typeObj.code
    typeFormInput.value = typeObj.input_type
    typeFormStatus.value = typeObj.status
    typeFormRequiresChart.value = typeObj.requires_size_chart
    typeFormOptionsText.value = typeObj.options.map(o => typeof o === 'object' ? o.label : o).join('\n')
    typeFormAppliesTo.value = [...typeObj.applies_to]
  } else {
    typeFormName.value = ''
    typeFormCode.value = ''
    typeFormInput.value = 'select'
    typeFormStatus.value = 'active'
    typeFormRequiresChart.value = false
    typeFormOptionsText.value = ''
    typeFormAppliesTo.value = ['clothing']
  }
  typeDrawerOpen.value = true
}

const saveTypeChanges = () => {
  if (!typeFormName.value.trim()) {
    alert('Name is required')
    return
  }

  const finalOpts = typeFormOptionsText.value.split('\n').filter(o => o.trim())

  const payload = {
    name: typeFormName.value,
    code: typeFormCode.value || typeFormName.value.toLowerCase(),
    input_type: typeFormInput.value,
    status: typeFormStatus.value,
    requires_size_chart: typeFormRequiresChart.value,
    options: finalOpts,
    applies_to: typeFormAppliesTo.value
  }

  if (editingTypeObj.value) {
    Object.assign(editingTypeObj.value, payload)
  } else {
    variantTypes.value.push({
      id: `VT-NEW-${Date.now()}`,
      sort: variantTypes.value.length + 1,
      ...payload
    })
  }
  typeDrawerOpen.value = false
}

const toggleAppliesTo = (c) => {
  if (typeFormAppliesTo.value.includes(c)) {
    typeFormAppliesTo.value = typeFormAppliesTo.value.filter(x => x !== c)
  } else {
    typeFormAppliesTo.value.push(c)
  }
}

// Manage Config Methods
const manageConfig = (pv) => {
  activeConfigProduct.value = pv
  configVariantsCopy.value = JSON.parse(JSON.stringify(pv.variants))
  configDrawerOpen.value = true
}

const toggleVariantState = (variant) => {
  variant.status = variant.status === 'active' ? 'disabled' : 'active'
}

const saveConfigChanges = () => {
  if (activeConfigProduct.value) {
    activeConfigProduct.value.variants = JSON.parse(JSON.stringify(configVariantsCopy.value))
    configDrawerOpen.value = false
    alert('Product variants configuration updated')
  }
}

const dragStartVariant = (idx) => {
  dragIndex.value = idx
}

const dropVariant = (idx) => {
  if (dragIndex.value === null || dragIndex.value === idx) return
  const list = [...configVariantsCopy.value]
  const [moved] = list.splice(dragIndex.value, 1)
  list.splice(idx, 0, moved)
  configVariantsCopy.value = list
  dragIndex.value = null
}

// Request Approvals Methods
const viewRequest = (req) => {
  activeRequestObj.value = req
  reviewNoteText.value = ''
  requestDrawerOpen.value = true
}

const assignRequest = () => {
  if (activeRequestObj.value) {
    activeRequestObj.value.status = 'cat_review'
    alert('Request assigned to Category Manager')
    requestDrawerOpen.value = false
  }
}

const approveCategoryRequest = () => {
  if (activeRequestObj.value) {
    activeRequestObj.value.status = 'ops_review'
    const step = activeRequestObj.value.steps.find(s => s.role === 'cat_mgr')
    if (step) {
      step.actor = 'Sara Ahmed'
      step.at = new Date().toISOString()
      step.note = reviewNoteText.value || 'Approved Category check'
    }
    alert('Category level approved. Sent to Ops review.')
    requestDrawerOpen.value = false
  }
}

const approveOpsRequest = () => {
  if (activeRequestObj.value) {
    activeRequestObj.value.status = 'approved'
    const step = activeRequestObj.value.steps.find(s => s.role === 'ops')
    if (step) {
      step.actor = 'Ops Admin'
      step.at = new Date().toISOString()
      step.note = reviewNoteText.value || 'Confirmed stock and photo alignment'
    }
    alert('Variant Request approved. Notifications sent to seller.')
    requestDrawerOpen.value = false
  }
}

const rejectRequest = () => {
  if (activeRequestObj.value) {
    activeRequestObj.value.status = 'rejected'
    alert('Request rejected')
    requestDrawerOpen.value = false
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
