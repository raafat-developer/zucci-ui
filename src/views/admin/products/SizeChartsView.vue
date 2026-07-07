<template>
  <div class="zv-module">
    <!-- Header -->
        <PageHeader title="Sizing Guidelines" subtitle="Review master size charts, partner store guides, and configure AI Fit Finder parameters" iconColor="var(--zg-accent);">
      <template #icon>
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="6" width="18" height="12" rx="2" />
            <line x1="8" y1="6" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="18" />
            <path d="M12 10v4" />
          </svg>
      </template>
      <template #actions>
        <!-- View Toggle between Charts & Fit Finder -->
        <div class="view-mode-toggle" style="display: flex; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); padding: 2px; margin-right: 12px;">
          <button 
            class="mode-btn" 
            :class="{ 'is-active': activeModuleTab === 'charts' }" 
            @click="activeModuleTab = 'charts'"
            style="padding: 4px 12px; border-radius: 4px; border: none; font-size: 11.5px; font-weight: 600; cursor: pointer; color: var(--zg-text); background: transparent;"
          >
            Size Charts
          </button>
          <button 
            class="mode-btn" 
            :class="{ 'is-active': activeModuleTab === 'fitfinder' }" 
            @click="activeModuleTab = 'fitfinder'"
            style="padding: 4px 12px; border-radius: 4px; border: none; font-size: 11.5px; font-weight: 600; cursor: pointer; color: var(--zg-text); background: transparent;"
          >
            Fit Finder
          </button>
        </div>
        
        <button v-if="activeModuleTab === 'charts'" class="zs-btn zs-btn--primary" @click="uploadOpen = true">
          Upload Chart
        </button>
      </template>
    </PageHeader>

    <!-- ── TAB 1. SIZE CHARTS MODULE ── -->
    <div v-if="activeModuleTab === 'charts'" style="display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden;">
      
      <!-- KPI strip -->
      <div class="zwh-kpi-strip">
        <div class="zwh-kpi-cell">
          <span class="zwh-kpi-lbl">Total Charts registered</span>
          <span class="zwh-kpi-val">{{ charts.length }}</span>
          <span class="zwh-kpi-sub">across all vendor brands</span>
        </div>
        <div class="zwh-kpi-cell">
          <span class="zwh-kpi-lbl">Pending Review</span>
          <span class="zwh-kpi-val" :class="{ 'is-warn': charts.filter(c => c.status === 'pending').length > 0 }">
            {{ charts.filter(c => c.status === 'pending').length }}
          </span>
          <span class="zwh-kpi-sub">manual approval required</span>
        </div>
        <div class="zwh-kpi-cell">
          <span class="zwh-kpi-lbl">Approved live</span>
          <span class="zwh-kpi-val is-good">{{ charts.filter(c => c.status === 'approved').length }}</span>
          <span class="zwh-kpi-sub">publishing live on storefront</span>
        </div>
        <div class="zwh-kpi-cell">
          <span class="zwh-kpi-lbl">Registered Brands</span>
          <span class="zwh-kpi-val">{{ new Set(charts.map(c => c.brand)).size }}</span>
          <span class="zwh-kpi-sub">with custom sizing</span>
        </div>
      </div>

      <div class="zv-body" style="flex: 1; overflow-y: auto;">
        
        <!-- Search and Filters Bar -->
        <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 16px; flex-wrap: wrap;">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search by brand, category..." 
            style="width: 240px; height: 32px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); padding: 0 10px; color: var(--zg-text); font-family: inherit; font-size: 12.5px; outline: none;" 
          />

          <button 
            v-for="st in ['all', 'approved', 'pending', 'rejected']" 
            :key="st"
            class="zwh-filter-chip"
            :class="{ 'is-active': statusFilter === st }"
            @click="statusFilter = st"
          >
            {{ st.toUpperCase() }}
          </button>

          <div style="width: 1px; height: 16px; background: var(--zg-line); margin: 0 8px;"></div>

          <button 
            v-for="typ in ['all', 'clothing_intl', 'footwear_eu']" 
            :key="typ"
            class="zwh-filter-chip"
            :class="{ 'is-active': typeFilter === typ }"
            @click="typeFilter = typ"
          >
            {{ typ === 'all' ? 'ALL TYPES' : (SIZE_TYPES[typ]?.label || typ) }}
          </button>
        </div>

        <!-- Size charts grid / table -->
        <div style="border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); overflow: hidden;">
          <div style="display: grid; grid-template-columns: 1.5fr 1fr 1fr 80px 1.2fr 100px; gap: 10px; padding: 10px 14px; background: var(--zg-panel-hi); border-bottom: 1px solid var(--zg-line); font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--zg-text-dim);">
            <span>Chart Name</span>
            <span>Category</span>
            <span>Size type</span>
            <span>Status</span>
            <span>Uploaded By</span>
            <span>Actions</span>
          </div>

          <div 
            v-for="c in filteredCharts" 
            :key="c.id" 
            class="chart-row"
            style="display: grid; grid-template-columns: 1.5fr 1fr 1fr 80px 1.2fr 100px; gap: 10px; padding: 12px 14px; border-bottom: 1px solid var(--zg-line-soft); align-items: center; background: var(--zg-panel); cursor: pointer;"
            @click="viewChart(c)"
          >
            <div style="overflow: hidden;">
              <div style="font-weight: 700; font-size: 13px; color: var(--zg-text);">
                <span v-if="c.is_zucci_master" style="color: var(--zg-accent); font-size: 9.5px; font-weight: 800; margin-right: 4px; border: 1px solid var(--zg-accent); padding: 0.5px 4px; border-radius: 2px;">MASTER</span>
                {{ c.name }}
              </div>
              <div style="font-size: 11px; color: var(--zg-text-dim); margin-top: 2px;">{{ c.brand }}</div>
            </div>
            <span style="font-size: 12.5px; color: var(--zg-text-mid);">{{ c.category }}</span>
            <span style="font-family: var(--zg-mono); font-size: 11.5px; color: var(--zg-text-dim);">{{ SIZE_TYPES[c.size_type]?.label || c.size_type }}</span>
            <span>
              <span class="zen-bst" :class="c.status === 'approved' ? 'zen-bst--active' : c.status === 'pending' ? 'zen-bst--pending' : 'zen-bst--inactive'">
                {{ c.status }}
              </span>
            </span>
            <span style="font-size: 12px; color: var(--zg-text-dim);">{{ c.uploaded_by }}</span>
            <div style="display: flex; gap: 4px;" @click.stop>
              <button class="zcat-act" @click="viewChart(c)">View</button>
              <button v-if="c.status === 'pending'" class="zcat-act" style="color: var(--zg-good); border-color: var(--zg-good);" @click="approveChart(c.id)">Approve</button>
            </div>
          </div>
          <div v-if="filteredCharts.length === 0" style="padding: 48px; text-align: center; color: var(--zg-text-dim);">No charts match search criteria</div>
        </div>

      </div>
    </div>

    <!-- ── TAB 2. FIT FINDER INTERACTIVE FLOW ── -->
    <div v-else class="zv-body" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column;">
      
      <!-- Interactive Quiz Board Layout -->
      <div class="fitfinder-card" style="width: 100%; max-width: 600px; margin: 0 auto; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-lg); overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 8px 32px rgba(0,0,0,0.15);">
        
        <!-- Steps dots indicators header -->
        <div style="padding: 16px; border-bottom: 1px solid var(--zg-line); display: flex; justify-content: space-between; align-items: center; background: var(--zg-panel-hi);">
          <span style="font-weight: 700; font-size: 12px; text-transform: uppercase; color: var(--zg-text-dim);">Fit Finder Calculator</span>
          <span style="font-family: var(--zg-mono); font-weight: 700; font-size: 12px; color: var(--zg-accent);">Accuracy: {{ fitFinderAccuracy }}%</span>
        </div>

        <div style="height: 4px; background: var(--zg-line); width: 100%;">
          <div style="height: 100%; background: var(--zg-accent); transition: width 0.3s;" :style="{ width: (fitStep * 25) + '%' }"></div>
        </div>

        <!-- Quiz bodies -->
        <div style="flex: 1; padding: 24px;">
          
          <!-- STEP 0: Welcome -->
          <div v-if="fitStep === 0" style="text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--zg-accent-tint); display: flex; align-items: center; justify-content: center; color: var(--zg-accent);">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
            </div>
            <h3 style="margin: 0; font-size: 18px; color: var(--zg-text);">Find Storefront size match recommendation</h3>
            <p style="margin: 0; font-size: 12.5px; color: var(--zg-text-dim); max-width: 400px; line-height: 1.5;">This tool estimates body sizing curves of a buyer profile to suggest sizes against master brand charts. Click below to begin calibration.</p>
            <button class="zen-btn-primary" style="height: 38px; padding: 0 24px; font-size: 13px;" @click="nextFitStep">Start calibration quiz</button>
          </div>

          <!-- STEP 1: Wear Brands sizes -->
          <div v-if="fitStep === 1" style="display: flex; flex-direction: column; gap: 14px;">
            <h4 style="margin: 0; font-size: 14px; color: var(--zg-text);">Do you wear any existing partner brands on Zucci?</h4>
            <p style="margin: 0; font-size: 12px; color: var(--zg-text-dim);">Telling us your size in known brands offers the best approximation.</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="font-size: 10.5px; font-weight: 600; color: var(--zg-text-dim);">Selected Brand</label>
                <select v-model="selectedFitBrand" style="width: 100%; height: 32px; background: var(--zg-bg); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); color: var(--zg-text); padding: 0 8px;">
                  <option value="">Select Brand</option>
                  <option value="Zucci Label">Zucci Label</option>
                  <option value="Urban Looms">Urban Looms</option>
                  <option value="Desert Kicks">Desert Kicks</option>
                </select>
              </div>
              <div>
                <label style="font-size: 10.5px; font-weight: 600; color: var(--zg-text-dim);">Category</label>
                <select v-model="selectedFitCat" style="width: 100%; height: 32px; background: var(--zg-bg); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); color: var(--zg-text); padding: 0 8px;">
                  <option value="">Select category</option>
                  <option value="Women's Fashion">Women's Modest wear</option>
                  <option value="Men's Fashion">Men's kandura sizing</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px;">
              <div>
                <label style="font-size: 10.5px; font-weight: 600; color: var(--zg-text-dim);">Your Size in that Brand</label>
                <input type="text" v-model="selectedFitSize" placeholder="e.g. M, L, XL, 42" style="width: 100%; height: 32px; background: var(--zg-bg); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); color: var(--zg-text); padding: 0 8px; font-family: var(--zg-mono);" />
              </div>
              <div>
                <label style="font-size: 10.5px; font-weight: 600; color: var(--zg-text-dim);">Fit style feel</label>
                <select v-model="selectedFitFeel" style="width: 100%; height: 32px; background: var(--zg-bg); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); color: var(--zg-text); padding: 0 8px;">
                  <option value="">How does it feel?</option>
                  <option value="Perfect Fit">Perfect Fit</option>
                  <option value="Too Tight">Too Tight</option>
                  <option value="Loose Fit">Loose Fit</option>
                </select>
              </div>
            </div>

            <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;">
              <button class="zen-btn-ghost" @click="prevFitStep">Back</button>
              <button class="zen-btn-primary" @click="nextFitStep">Next Step</button>
            </div>
          </div>

          <!-- STEP 2: Height / Weight specs -->
          <div v-if="fitStep === 2" style="display: flex; flex-direction: column; gap: 14px;">
            <h4 style="margin: 0; font-size: 14px; color: var(--zg-text);">Personal Specs</h4>
            <p style="margin: 0; font-size: 12px; color: var(--zg-text-dim);">Height and weight measurements help match general sizing charts.</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="font-size: 10.5px; font-weight: 600; color: var(--zg-text-dim);">Height (cm)</label>
                <input type="number" v-model.number="fitPersonal.height" placeholder="e.g. 172" style="width: 100%; height: 32px; background: var(--zg-bg); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); color: var(--zg-text); padding: 0 8px; font-family: var(--zg-mono);" />
              </div>
              <div>
                <label style="font-size: 10.5px; font-weight: 600; color: var(--zg-text-dim);">Weight (kg)</label>
                <input type="number" v-model.number="fitPersonal.weight" placeholder="e.g. 74" style="width: 100%; height: 32px; background: var(--zg-bg); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); color: var(--zg-text); padding: 0 8px; font-family: var(--zg-mono);" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px;">
              <div>
                <label style="font-size: 10.5px; font-weight: 600; color: var(--zg-text-dim);">Gender Curve Type</label>
                <select v-model="fitPersonal.gender" style="width: 100%; height: 32px; background: var(--zg-bg); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); color: var(--zg-text); padding: 0 8px;">
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
              <div>
                <label style="font-size: 10.5px; font-weight: 600; color: var(--zg-text-dim);">Preferred Fit style</label>
                <select v-model="fitPersonal.fit_style" style="width: 100%; height: 32px; background: var(--zg-bg); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); color: var(--zg-text); padding: 0 8px;">
                  <option value="Slim Fit">Slim Fit</option>
                  <option value="Regular Fit">Regular Fit</option>
                  <option value="Loose / Relaxed">Loose / Relaxed</option>
                </select>
              </div>
            </div>

            <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;">
              <button class="zen-btn-ghost" @click="prevFitStep">Back</button>
              <button class="zen-btn-primary" @click="nextFitStep">Next Step</button>
            </div>
          </div>

          <!-- STEP 3: Body measurements specs -->
          <div v-if="fitStep === 3" style="display: flex; flex-direction: column; gap: 14px;">
            <h4 style="margin: 0; font-size: 14px; color: var(--zg-text);">Body specs (Optional)</h4>
            <p style="margin: 0; font-size: 12px; color: var(--zg-text-dim);">Providing exact values ensures 98%+ sizing suggestions.</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="font-size: 10.5px; font-weight: 600; color: var(--zg-text-dim);">Chest (cm)</label>
                <input type="number" v-model.number="fitMeasures.chest" placeholder="e.g. 88" style="width: 100%; height: 32px; background: var(--zg-bg); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); color: var(--zg-text); padding: 0 8px; font-family: var(--zg-mono);" />
              </div>
              <div>
                <label style="font-size: 10.5px; font-weight: 600; color: var(--zg-text-dim);">Waist (cm)</label>
                <input type="number" v-model.number="fitMeasures.waist" placeholder="e.g. 70" style="width: 100%; height: 32px; background: var(--zg-bg); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); color: var(--zg-text); padding: 0 8px; font-family: var(--zg-mono);" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px;">
              <div>
                <label style="font-size: 10.5px; font-weight: 600; color: var(--zg-text-dim);">Hips (cm)</label>
                <input type="number" v-model.number="fitMeasures.hips" placeholder="e.g. 94" style="width: 100%; height: 32px; background: var(--zg-bg); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); color: var(--zg-text); padding: 0 8px; font-family: var(--zg-mono);" />
              </div>
              <div>
                <label style="font-size: 10.5px; font-weight: 600; color: var(--zg-text-dim);">Shoulder (cm)</label>
                <input type="number" v-model.number="fitMeasures.shoulder" placeholder="e.g. 38" style="width: 100%; height: 32px; background: var(--zg-bg); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); color: var(--zg-text); padding: 0 8px; font-family: var(--zg-mono);" />
              </div>
            </div>

            <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;">
              <button class="zen-btn-ghost" @click="prevFitStep">Back</button>
              <button class="zen-btn-primary" @click="nextFitStep">Calculate size</button>
            </div>
          </div>

          <!-- STEP 4: Results recommendation details -->
          <div v-if="fitStep === 4" style="text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px;">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--zg-accent-tint); display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; color: var(--zg-accent); font-family: var(--zg-mono);">
              {{ recommendedSize }}
            </div>
            <div>
              <h3 style="margin: 0; font-size: 18px; color: var(--zg-text);">Recommended size: {{ recommendedSize }}</h3>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--zg-text-dim);">Best fit for general collections under these specifications.</p>
            </div>

            <div style="width: 100%; text-align: left; padding: 12px; border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); background: var(--zg-bg-elev); margin-top: 12px;">
              <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--zg-text-dim); margin-bottom: 6px;">Profile calculations variables</div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; color: var(--zg-text-mid);">
                <div>Height: <strong>{{ fitPersonal.height || '172' }} cm</strong></div>
                <div>Weight: <strong>{{ fitPersonal.weight || '74' }} kg</strong></div>
                <div>Style: <strong>{{ fitPersonal.fit_style }}</strong></div>
                <div>Accuracy: <strong>{{ fitFinderAccuracy }}% Correct</strong></div>
              </div>
            </div>

            <div style="display: flex; gap: 8px; justify-content: center; margin-top: 16px; width: 100%;">
              <button class="zen-btn-ghost" @click="resetFitFinderQuiz">Recalibrate Quiz</button>
              <button class="zen-btn-primary" @click="activeModuleTab = 'charts'">View Size Charts list</button>
            </div>
          </div>

        </div>
      </div>

    </div>

    <!-- ── TELEPORT OVERLAY: SIZE CHART DETAIL DRAWER ── -->
    <Teleport to="body">
      <div v-if="detailChartObj" class="drawer-overlay" @click.self="detailChartObj = null" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; justify-content: flex-end;">
        <div class="drawer-panel" style="width: 600px; height: 100%; background: var(--zg-bg-elev); border-left: 1px solid var(--zg-line); display: flex; flex-direction: column; box-shadow: -8px 0 24px rgba(0,0,0,0.3); animation: slideIn 0.25s ease-out;">
          
          <div class="drawer-header" style="padding: 16px 20px; border-bottom: 1px solid var(--zg-line); display: flex; align-items: center; justify-content: space-between;">
            <div>
              <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: var(--zg-text);">{{ detailChartObj.name }}</h3>
              <p style="margin: 3px 0 0 0; font-size: 11.5px; color: var(--zg-text-dim);">{{ detailChartObj.brand }} · {{ detailChartObj.category }}</p>
            </div>
            <button @click="detailChartObj = null" style="background: transparent; border: none; font-size: 20px; cursor: pointer; color: var(--zg-text-dim);">&times;</button>
          </div>

          <div class="drawer-body" style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px;">
            <!-- Info cells -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
              <div style="background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); padding: 10px;">
                <div style="font-size: 9px; color: var(--zg-text-dim); font-weight: 700; text-transform: uppercase;">Status</div>
                <div style="font-weight: 600; font-size: 12.5px; color: var(--zg-text); margin-top: 2px;">{{ detailChartObj.status }}</div>
              </div>
              <div style="background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); padding: 10px;">
                <div style="font-size: 9px; color: var(--zg-text-dim); font-weight: 700; text-transform: uppercase;">Uploaded By</div>
                <div style="font-weight: 600; font-size: 12.5px; color: var(--zg-text); margin-top: 2px;">{{ detailChartObj.uploaded_by }}</div>
              </div>
              <div style="background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); padding: 10px;">
                <div style="font-size: 9px; color: var(--zg-text-dim); font-weight: 700; text-transform: uppercase;">Size type code</div>
                <div style="font-weight: 600; font-size: 12.5px; color: var(--zg-text); margin-top: 2px;">{{ detailChartObj.size_type }}</div>
              </div>
            </div>

            <!-- Measurements table -->
            <div style="border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); overflow: hidden;">
              <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: center;">
                <thead>
                  <tr style="background: var(--zg-panel-hi); border-bottom: 1px solid var(--zg-line);">
                    <th style="padding: 8px; text-align: left;">Size</th>
                    <th v-for="mkey in SIZE_TYPES[detailChartObj.size_type]?.measurements || []" :key="mkey" style="padding: 8px;">
                      {{ formatMeasureName(mkey) }}
                    </th>
                    <th v-if="editMode" style="width: 40px;"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, idx) in detailedRows" :key="idx" style="border-bottom: 1px solid var(--zg-line-soft);">
                    <td style="padding: 8px; text-align: left; font-weight: 700;">{{ row.size }}</td>
                    <td v-for="mkey in SIZE_TYPES[detailChartObj.size_type]?.measurements || []" :key="mkey" style="padding: 8px;">
                      <input 
                        type="number" 
                        v-if="editMode" 
                        v-model.number="row[mkey]" 
                        style="width: 60px; height: 24px; text-align: center; border: 1px solid var(--zg-line); background: var(--zg-bg); color: var(--zg-text); font-family: var(--zg-mono); border-radius: 4px;" 
                      />
                      <span v-else>{{ row[mkey] || '—' }}</span>
                    </td>
                    <td v-if="editMode" style="padding: 8px;">
                      <button @click="deleteDetailRow(idx)" style="background: transparent; border: none; color: var(--zg-danger); cursor: pointer; font-size: 16px;">&times;</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="editMode" style="display: flex; gap: 8px; justify-content: flex-start;">
              <button class="zs-btn" @click="addMeasurementRow">+ Add Row</button>
            </div>

            <!-- Upload specs details -->
            <div style="padding: 10px; border-radius: var(--zg-radius-md); background: var(--zg-panel); border: 1px solid var(--zg-line); font-size: 11.5px; color: var(--zg-text-dim);">
              Uploaded at Fatima Al-Nuaimi on {{ new Date(detailChartObj.uploaded_at).toLocaleString() }}. Master catalog charts are applied live storefront product templates.
            </div>

          </div>

          <div class="drawer-footer" style="padding: 16px 20px; border-top: 1px solid var(--zg-line); display: flex; gap: 8px; justify-content: flex-end; background: var(--zg-bg);">
            <button v-if="editMode" class="zen-btn-primary" @click="saveDetailedChanges">Save measurements</button>
            <button v-else class="zen-btn-ghost" @click="editMode = true">Edit Chart</button>
            <button class="zen-btn-ghost" @click="detailChartObj = null">Close</button>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- ── TELEPORT OVERLAY: UPLOAD SIZE CHART DRAWER ── -->
    <Teleport to="body">
      <div v-if="uploadOpen" class="drawer-overlay" @click.self="uploadOpen = false" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; justify-content: flex-end;">
        <div class="drawer-panel" style="width: 520px; height: 100%; background: var(--zg-bg-elev); border-left: 1px solid var(--zg-line); display: flex; flex-direction: column; box-shadow: -8px 0 24px rgba(0,0,0,0.3); animation: slideIn 0.25s ease-out;">
          
          <div class="drawer-header" style="padding: 16px 20px; border-bottom: 1px solid var(--zg-line); display: flex; align-items: center; justify-content: space-between;">
            <div>
              <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: var(--zg-text);">Upload Brand Size Chart</h3>
              <p style="margin: 3px 0 0 0; font-size: 11.5px; color: var(--zg-text-dim);">Add brand specific specifications sizing chart</p>
            </div>
            <button @click="uploadOpen = false" style="background: transparent; border: none; font-size: 20px; cursor: pointer; color: var(--zg-text-dim);">&times;</button>
          </div>

          <div class="drawer-body" style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px;">
            <div class="zcat-field">
              <label class="zcat-label">Brand Name *</label>
              <input type="text" v-model="newBrand" class="zcat-input" placeholder="e.g. Zucci Label" />
            </div>

            <div class="zcat-field">
              <label class="zcat-label">Category *</label>
              <input type="text" v-model="newCat" class="zcat-input" placeholder="e.g. Women's Fashion" />
            </div>

            <div class="zcat-field">
              <label class="zcat-label">Size system structure *</label>
              <select v-model="newSizeType" class="zcat-select" style="width: 100%; height: 32px; background: var(--zg-panel); border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); color: var(--zg-text); padding: 0 8px; font-family: inherit;">
                <option value="">Select size type</option>
                <option value="clothing_intl">Clothing (International) — XS, S, M, L</option>
                <option value="clothing_numeric">Clothing (Numeric) — 36, 38, 40, 42</option>
                <option value="footwear_eu">Footwear (EU) — 38, 39, 40, 41</option>
              </select>
            </div>

            <div style="display: flex; border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); overflow: hidden; width: fit-content;">
              <button 
                class="mode-btn" 
                :class="{ 'is-active': uploadMode === 'csv' }" 
                @click="uploadMode = 'csv'"
                style="height: 30px; padding: 0 14px; border: none; font-size: 11.5px; cursor: pointer; background: transparent; color: var(--zg-text);"
              >
                CSV Upload
              </button>
              <button 
                class="mode-btn" 
                :class="{ 'is-active': uploadMode === 'manual' }" 
                @click="uploadMode = 'manual'"
                style="height: 30px; padding: 0 14px; border: none; font-size: 11.5px; cursor: pointer; background: transparent; color: var(--zg-text);"
              >
                Manual Build
              </button>
            </div>

            <!-- CSV build mode -->
            <div v-if="uploadMode === 'csv'" style="display: flex; flex-direction: column; gap: 8px;">
              <div 
                @click="triggerUploadSelect"
                style="border: 2px dashed var(--zg-line); border-radius: var(--zg-radius-md); padding: 24px; text-align: center; cursor: pointer; background: var(--zg-panel);"
              >
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 8px; display: block;">
                  <path d="M12 3v12M8 9l4-4 4 4M3 20h18" stroke-linecap="round" />
                </svg>
                <span v-if="csvFileUploaded" style="font-weight: 700; color: var(--zg-good);">✓ {{ csvFileUploaded }} ({{ parsedCsvData?.rows?.length }} rows parsed)</span>
                <span v-else style="font-weight: 600; color: var(--zg-text-mid);">Click to select brand size CSV</span>
              </div>
            </div>

            <!-- Manual build mode -->
            <div v-if="uploadMode === 'manual'" style="display: flex; flex-direction: column; gap: 10px;">
              <button class="zs-btn" @click="addManualRow">+ Add size row</button>
              
              <div v-if="manualRows.length > 0" style="border: 1px solid var(--zg-line); border-radius: var(--zg-radius-md); overflow: hidden;">
                <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: center;">
                  <thead>
                    <tr style="background: var(--zg-panel-hi); border-bottom: 1px solid var(--zg-line);">
                      <th style="padding: 6px; text-align: left;">Size</th>
                      <th v-for="mkey in SIZE_TYPES[newSizeType]?.measurements || []" :key="mkey" style="padding: 6px;">{{ formatMeasureName(mkey) }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, idx) in manualRows" :key="idx" style="border-bottom: 1px solid var(--zg-line-soft);">
                      <td style="padding: 6px; text-align: left; font-weight: 700;">{{ row.size }}</td>
                      <td v-for="mkey in SIZE_TYPES[newSizeType]?.measurements || []" :key="mkey" style="padding: 6px;">
                        <input type="number" v-model.number="row[mkey]" style="width: 50px; text-align: center; border: 1px solid var(--zg-line); background: var(--zg-bg); color: var(--zg-text); border-radius: 4px;" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          <div class="drawer-footer" style="padding: 16px 20px; border-top: 1px solid var(--zg-line); display: flex; gap: 8px; justify-content: flex-end; background: var(--zg-bg);">
            <button class="zen-btn-ghost" @click="uploadOpen = false">Cancel</button>
            <button class="zen-btn-primary" @click="saveUploadedChart">Upload Chart</button>
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// ── Mock Data: Size Charts & Types ───────────────────────
const SIZE_TYPES = {
  clothing_intl: {
    id: 'clothing_intl', label: 'Clothing (International)',
    columns: ['XXXS', 'XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    measurements: ['chest_cm', 'waist_cm', 'hip_cm', 'shoulder_cm'],
  },
  clothing_numeric: {
    id: 'clothing_numeric', label: 'Clothing (Numeric)',
    columns: ['36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56'],
    measurements: ['chest_cm', 'waist_cm'],
  },
  footwear_eu: {
    id: 'footwear_eu', label: 'Footwear — EU',
    columns: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48'],
    measurements: ['foot_length_cm'],
  },
  footwear_uk: {
    id: 'footwear_uk', label: 'Footwear — UK',
    columns: ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
    measurements: ['foot_length_cm'],
  },
}

const initialCharts = [
  {
    id: 'SC-001', brand: 'Zucci Label', category: "Women's Fashion", size_type: 'clothing_intl',
    name: "Zucci Women's Standard", status: 'approved', is_zucci_master: true,
    uploaded_by: 'Fatima Al-Nuaimi', uploaded_at: '2024-01-15T10:00:00Z',
    approved_by: 'Zucci Admin', approved_at: '2024-01-15T11:00:00Z',
    rows: [
      { size: 'XS',  chest_cm: 80,  waist_cm: 62,  hip_cm: 86,  shoulder_cm: 36 },
      { size: 'S',   chest_cm: 84,  waist_cm: 66,  hip_cm: 90,  shoulder_cm: 37 },
      { size: 'M',   chest_cm: 88,  waist_cm: 70,  hip_cm: 94,  shoulder_cm: 38 },
      { size: 'L',   chest_cm: 93,  waist_cm: 75,  hip_cm: 99,  shoulder_cm: 39.5 },
      { size: 'XL',  chest_cm: 99,  waist_cm: 81,  hip_cm: 105, shoulder_cm: 41 },
      { size: '2XL', chest_cm: 105, waist_cm: 87,  hip_cm: 111, shoulder_cm: 42.5 },
    ]
  },
  {
    id: 'SC-002', brand: 'Urban Looms', category: "Women's Fashion", size_type: 'clothing_intl',
    name: "Urban Looms Women's Sizing", status: 'approved', is_zucci_master: false,
    uploaded_by: 'Rania Al-Qassim', uploaded_at: '2024-03-10T09:30:00Z',
    approved_by: 'Sara Ahmed', approved_at: '2024-03-11T14:00:00Z',
    rows: [
      { size: 'XS',  chest_cm: 78,  waist_cm: 60,  hip_cm: 84,  shoulder_cm: 35.5 },
      { size: 'S',   chest_cm: 82,  waist_cm: 64,  hip_cm: 88,  shoulder_cm: 36.5 },
      { size: 'M',   chest_cm: 86,  waist_cm: 68,  hip_cm: 92,  shoulder_cm: 37.5 },
      { size: 'L',   chest_cm: 92,  waist_cm: 74,  hip_cm: 98,  shoulder_cm: 39 },
      { size: 'XL',  chest_cm: 98,  waist_cm: 80,  hip_cm: 104, shoulder_cm: 40.5 },
    ]
  },
  {
    id: 'SC-003', brand: 'Desert Kicks', category: 'Footwear', size_type: 'footwear_eu',
    name: 'Desert Kicks EU Size Chart', status: 'approved', is_zucci_master: false,
    uploaded_by: 'Khaled Mansouri', uploaded_at: '2024-04-02T08:00:00Z',
    approved_by: 'Ops Admin', approved_at: '2024-04-03T10:00:00Z',
    rows: [
      { size: '38', foot_length_cm: 24.0 },
      { size: '39', foot_length_cm: 24.6 },
      { size: '40', foot_length_cm: 25.3 },
      { size: '41', foot_length_cm: 25.9 },
      { size: '42', foot_length_cm: 26.6 },
      { size: '43', foot_length_cm: 27.3 },
      { size: '44', foot_length_cm: 27.9 },
    ]
  },
  {
    id: 'SC-004', brand: 'Bakhoor House', category: "Men's Fashion", size_type: 'clothing_intl',
    name: 'Bakhoor House Kandura Sizing', status: 'pending', is_zucci_master: false,
    uploaded_by: 'Hassan Al-Otaibi', uploaded_at: '2024-06-05T11:00:00Z',
    approved_by: null, approved_at: null,
    rows: [
      { size: 'S',  chest_cm: 96,  waist_cm: 88,  shoulder_cm: 44 },
      { size: 'M',  chest_cm: 100, waist_cm: 92,  shoulder_cm: 45 },
      { size: 'L',  chest_cm: 104, waist_cm: 96,  shoulder_cm: 46 },
      { size: 'XL', chest_cm: 108, waist_cm: 100, shoulder_cm: 47 },
    ]
  }
]

// ── State Management ──────────────────────────────────────
const activeModuleTab = ref('charts') // 'charts' or 'fitfinder'
const charts = ref(initialCharts)
const searchQuery = ref('')
const statusFilter = ref('all')
const typeFilter = ref('all')

// Detail / Edit modal
const detailChartObj = ref(null)
const editMode = ref(false)
const detailedRows = ref([])
const showLogDrawer = ref(false)

// Upload new chart drawer
const uploadOpen = ref(false)
const newBrand = ref('')
const newCat = ref('')
const newSizeType = ref('')
const uploadMode = ref('csv') // 'csv' or 'manual'
const manualRows = ref([])
const csvFileUploaded = ref(null)
const parsedCsvData = ref(null)

// Fit Finder Step flow
const fitStep = ref(0) // 0: intro, 1: brand matching, 2: personal specs, 3: body specs, 4: results recommendation
const selectedFitBrand = ref('')
const selectedFitCat = ref('')
const selectedFitSize = ref('')
const selectedFitFeel = ref('')
const fitPersonal = ref({ height: '', weight: '', gender: 'Female', fit_style: 'Regular Fit' })
const fitMeasures = ref({ chest: '', waist: '', hips: '', shoulder: '' })

// ── Computed Properties ───────────────────────────────────
const filteredCharts = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return charts.value.filter(c => {
    const matchStatus = statusFilter.value === 'all' || c.status === statusFilter.value
    const matchType = typeFilter.value === 'all' || c.size_type === typeFilter.value
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    return matchStatus && matchType && matchSearch
  })
})

const fitFinderAccuracy = computed(() => {
  let score = 30
  if (selectedFitBrand.value && selectedFitSize.value) score += 30
  if (fitPersonal.value.height && fitPersonal.value.weight) score += 20
  if (fitMeasures.value.chest || fitMeasures.value.waist) score += 15
  return Math.min(score, 98)
})

const recommendedSize = computed(() => {
  // Mock logic to calculate size recommendation
  if (fitPersonal.value.weight > 80) return 'XL'
  if (fitPersonal.value.weight > 68) return 'L'
  if (fitPersonal.value.weight > 55) return 'M'
  return 'S'
})

// ── Methods ───────────────────────────────────────────────
const viewChart = (chart) => {
  detailChartObj.value = chart
  detailedRows.value = JSON.parse(JSON.stringify(chart.rows))
  editMode.value = false
}

const approveChart = (id) => {
  const chart = charts.value.find(c => c.id === id)
  if (chart) {
    chart.status = 'approved'
    chart.approved_by = 'Zucci Admin'
    chart.approved_at = new Date().toISOString()
  }
}

const rejectChart = (id) => {
  const chart = charts.value.find(c => c.id === id)
  if (chart) {
    chart.status = 'rejected'
  }
}

const saveDetailedChanges = () => {
  if (detailChartObj.value) {
    detailChartObj.value.rows = JSON.parse(JSON.stringify(detailedRows.value))
    editMode.value = false
    alert('Size chart measurements updated')
  }
}

const addMeasurementRow = () => {
  const size = prompt('Enter Size name (e.g. S, 42):')
  if (!size) return
  const blank = { size }
  const st = SIZE_TYPES[detailChartObj.value.size_type]
  if (st) {
    st.measurements.forEach(m => {
      blank[m] = 0
    })
  }
  detailedRows.value.push(blank)
}

const deleteDetailRow = (idx) => {
  detailedRows.value.splice(idx, 1)
}

// Upload modal helper
const triggerUploadSelect = () => {
  csvFileUploaded.value = 'brand_size_chart.csv'
  parsedCsvData.value = {
    headers: ['size', 'chest_cm', 'waist_cm', 'hip_cm'],
    rows: [
      { size: 'S', chest_cm: '82', waist_cm: '64', hip_cm: '88' },
      { size: 'M', chest_cm: '86', waist_cm: '68', hip_cm: '92' },
      { size: 'L', chest_cm: '92', waist_cm: '74', hip_cm: '98' },
    ]
  }
}

const addManualRow = () => {
  const size = prompt('Enter size (e.g. XXL, 44):')
  if (!size) return
  const blank = { size }
  const st = SIZE_TYPES[newSizeType.value]
  if (st) {
    st.measurements.forEach(m => {
      blank[m] = 0
    })
  }
  manualRows.value.push(blank)
}

const saveUploadedChart = () => {
  if (!newBrand.value || !newCat.value || !newSizeType.value) {
    alert('All fields marked * are required')
    return
  }

  const finalRows = uploadMode.value === 'csv' ? (parsedCsvData.value?.rows || []) : manualRows.value

  const newChart = {
    id: `SC-NEW-${Date.now()}`,
    brand: newBrand.value,
    category: newCat.value,
    size_type: newSizeType.value,
    name: `${newBrand.value} ${newCat.value} Sizing Chart`,
    status: 'pending',
    is_zucci_master: false,
    uploaded_by: 'Zucci Partner Store',
    uploaded_at: new Date().toISOString(),
    approved_by: null,
    approved_at: null,
    rows: finalRows
  }

  charts.value.unshift(newChart)
  uploadOpen.value = false
  alert('New size chart uploaded successfully and is pending review')
}

// Fit Finder Step Helpers
const nextFitStep = () => {
  fitStep.value++
}

const prevFitStep = () => {
  fitStep.value--
}

const resetFitFinderQuiz = () => {
  fitStep.value = 0
  selectedFitBrand.value = ''
  selectedFitCat.value = ''
  selectedFitSize.value = ''
  selectedFitFeel.value = ''
  fitPersonal.value = { height: '', weight: '', gender: 'Female', fit_style: 'Regular Fit' }
  fitMeasures.value = { chest: '', waist: '', hips: '', shoulder: '' }
}

const formatMeasureName = (name) => {
  return name.replace('_cm', ' (cm)').replace('_', ' ')
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
