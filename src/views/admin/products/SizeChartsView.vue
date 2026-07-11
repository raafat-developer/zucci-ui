<script setup>
/**
 * SizeChartsView — Size Charts module. Integrates size charts listing
 * and detail loading from the backend catalog API, including pagination
 * and status/type filters.
 */
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { ZC_SIZE_TYPES } from "@/data/sizeGuidesData";
import SizeChartDetailDrawer from "./sizecharts/SizeChartDetailDrawer.vue";
import ActivityLogDrawer from "./sizecharts/ActivityLogDrawer.vue";
import UploadChartDrawer from "./sizecharts/UploadChartDrawer.vue";
import { toast } from "@/composables/useToast";
import http from "@/api/http";
import { useLookup } from "@/composables/useLookup";

const router = useRouter();
const lookup = useLookup();
import { useConfirm } from "@/composables/useConfirm";
const { confirm } = useConfirm();

function fmtDt(s) {
  return s
    ? new Date(s).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";
}

const charts = ref([]);
const typeF = ref("all");
const statusF = ref("all");
const search = ref("");
const detail = ref(null);
const logChart = ref(null);
const uploadOpen = ref(false);
const IS_SUPER_ADMIN = true;
const loading = ref(false);
const loadingDetail = ref(false);

const pagination = ref({
  page: 1,
  perPage: 5,
  total: 0,
  totalPages: 1,
});

const kpiStats = ref({
  total: 0,
  pending: 0,
  approved: 0,
  brands: 0,
  sizeTypes: Object.keys(ZC_SIZE_TYPES || {}).length,
});

const mapApiChart = (c) => ({
  id: c.id,
  name: c.translations?.[0]?.name || c.name || "SG",
  brand: c.brand?.name || c.brandCode || "—",
  category: c.category?.name || c.category?.slug || "—",
  size_type: c.sizeTypeCode || c.sizeType || "clothing_intl",
  status: c.status || "pending",
  uploaded_by: c.uploadedByName || c.uploadedBy || "System",
  approved_by: c.approvedBy || "—",
  uploaded_at: c.createdAt || c.uploadedAt || new Date().toISOString(),
  is_zucci_master: !!c.isPlatformMaster,
  rows: c.rows || [],
});

const fetchCharts = async () => {
  loading.value = true;
  try {
    const params = {
      page: pagination.value.page,
      perPage: pagination.value.perPage,
    };
    if (search.value) {
      params.search = search.value;
    }
    if (statusF.value !== "all") {
      params.status = statusF.value;
    }
    if (typeF.value !== "all") {
      params.sizeTypeCode = typeF.value;
    }

    const response = await http.get("/catalog/size-guides", { params });
    const responseData = response.data || response;
    const items = Array.isArray(responseData.data)
      ? responseData.data
      : Array.isArray(responseData)
        ? responseData
        : [];

    charts.value = items.map(mapApiChart);

    // Map pagination metadata
    const meta = responseData.meta || response.meta;
    if (meta) {
      pagination.value.page = meta.current_page || pagination.value.page;
      pagination.value.perPage = meta.per_page || pagination.value.perPage;
      pagination.value.total = meta.total || charts.value.length;
      pagination.value.totalPages = meta.last_page || 1;
    } else {
      pagination.value.total = charts.value.length;
      pagination.value.totalPages = 1;
    }

    // Map KPIs
    const kpis = responseData.kpis || response.kpis;
    if (kpis) {
      kpiStats.value.total = kpis.total || 0;
      kpiStats.value.pending = kpis.pending || 0;
      kpiStats.value.approved = kpis.approved || 0;
      kpiStats.value.brands = kpis.registeredBrands || 0;
    } else {
      kpiStats.value.total = pagination.value.total;
      kpiStats.value.pending = charts.value.filter(
        (c) => c.status === "pending",
      ).length;
      kpiStats.value.approved = charts.value.filter(
        (c) => c.status === "approved",
      ).length;
      kpiStats.value.brands = new Set(charts.value.map((c) => c.brand)).size;
    }
  } catch (err) {
    console.error("Failed to load size charts:", err);
    toast.error("Failed to load size charts");
  } finally {
    loading.value = false;
  }
};

const viewDetail = async (c) => {
  loadingDetail.value = true;
  try {
    const response = await http.get(`/catalog/size-guides/${c.id}`);
    const fullData = response.data || response;

    // Extract column definitions and flat rows from the cells
    const rawRows = fullData.rows || [];
    const measurements = [];
    const flatRows = rawRows.map((row) => {
      const flat = { size: "" };
      if (Array.isArray(row.cells)) {
        row.cells.forEach((cell) => {
          if (cell.code === "size") {
            flat.size = cell.value;
          } else {
            flat[cell.code] = cell.value;
            // Record measurement columns dynamically
            if (!measurements.some((m) => m.key === cell.code)) {
              measurements.push({
                key: cell.code,
                label: cell.label || cell.code,
              });
            }
          }
        });
      }
      return flat;
    });

    const mapped = mapApiChart({ ...c, ...fullData });
    mapped.rows = flatRows;
    mapped.measurements = measurements;
    mapped.rawRows = rawRows;

    detail.value = mapped;
  } catch (err) {
    console.error("Failed to load size chart details:", err);
    toast.error("Failed to load details");
  } finally {
    loadingDetail.value = false;
  }
};

onMounted(async () => {
  await lookup.load();
  await fetchCharts();
});

watch([statusF, typeF], () => {
  pagination.value.page = 1;
  fetchCharts();
});

let searchTimeout = null;
watch(search, () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1;
    fetchCharts();
  }, 300);
});

const types = computed(() => {
  const localTypes = new Set(
    charts.value.map((c) => c.size_type).filter(Boolean),
  );
  Object.keys(ZC_SIZE_TYPES || {}).forEach((k) => localTypes.add(k));
  return [...localTypes];
});

const filtered = computed(() => charts.value);

const approve = async (id) => {
  const chartName =
    charts.value.find((c) => c.id === id)?.name || "this size chart";
  const ok = await confirm({
    title: "Approve Size Chart",
    message: `Are you sure you want to approve "${chartName}"? This will make it available for all matching catalog products.`,
    confirmText: "Approve",
    cancelText: "Cancel",
    variant: "primary",
  });
  if (!ok) return;

  try {
    await http.post(`/catalog/size-guides/${id}/approve`);
    toast.success("Size chart approved");
    fetchCharts();
    if (detail.value && detail.value.id === id) {
      detail.value = null;
    }
  } catch (err) {
    console.error("Failed to approve size chart:", err);
    toast.error("Failed to approve size chart");
  }
};

const reject = async (id) => {
  const chartName =
    charts.value.find((c) => c.id === id)?.name || "this size chart";
  const ok = await confirm({
    title: "Reject Size Chart",
    message: `Are you sure you want to reject "${chartName}"?`,
    confirmText: "Reject",
    cancelText: "Cancel",
    variant: "danger",
  });
  if (!ok) return;

  try {
    await http.post(`/catalog/size-guides/${id}/reject`);
    toast.warn("Size chart rejected");
    fetchCharts();
    if (detail.value && detail.value.id === id) {
      detail.value = null;
    }
  } catch (err) {
    console.error("Failed to reject size chart:", err);
    toast.error("Failed to reject size chart");
  }
};

const handleUploaded = async (newChart) => {
  try {
    // Look up brand and category IDs from lookup to post to API
    const foundBrand = lookup
      .get("brands")
      .find((b) => b.name === newChart.brand);
    const foundCat = lookup
      .get("categories")
      .find((c) => c.name === newChart.cat || c.label === newChart.cat);

    // Find any existing size guide of the same sizeTypeCode to clone the measurementColumnIds
    const existing = charts.value.find(
      (c) => c.size_type === newChart.sizeType,
    );
    const columnIdMap = {};

    if (existing) {
      const detailRes = await http.get(`/catalog/size-guides/${existing.id}`);
      const fullDetail = detailRes.data || detailRes;
      if (
        fullDetail.rows &&
        fullDetail.rows[0] &&
        Array.isArray(fullDetail.rows[0].cells)
      ) {
        fullDetail.rows[0].cells.forEach((cell) => {
          columnIdMap[cell.code] = cell.measurementColumnId;
        });
      }
    } else {
      // Fallback column IDs
      columnIdMap["size"] = "4dd86a58-118a-492e-bfab-e3a4ddca6141";
      columnIdMap["bust"] = "ea1f9362-c8a8-48d0-bf17-43cd3b9288d4";
      columnIdMap["waist"] = "067f9e40-540e-4a5f-a699-16894dc2a55f";
      columnIdMap["hips"] = "bec66e87-e0e8-4128-9131-42f04aad1a73";
      columnIdMap["chest"] = "ea1f9362-c8a8-48d0-bf17-43cd3b9288d4";
    }

    const rowsPayload = newChart.rows.map((row, ri) => {
      const cells = [];

      // Always include 'size'
      const sizeColId =
        columnIdMap["size"] || "4dd86a58-118a-492e-bfab-e3a4ddca6141";
      cells.push({
        measurementColumnId: sizeColId,
        value: String(row.size || ""),
      });

      // Include all other properties from row
      Object.keys(row).forEach((key) => {
        if (key !== "size") {
          const mapKey = columnIdMap[key]
            ? key
            : key === "chest" && columnIdMap["bust"]
              ? "bust"
              : key;
          const colId = columnIdMap[mapKey] || columnIdMap[key];
          if (colId) {
            cells.push({
              measurementColumnId: colId,
              value: String(
                row[key] !== undefined && row[key] !== null ? row[key] : "",
              ),
            });
          }
        }
      });

      return {
        sortOrder: ri,
        cells,
      };
    });

    const payload = {
      code: `demo-sg-${Date.now()}`,
      gender: 3,
      brandId: foundBrand?.id || null,
      measurementSystemId: 1,
      categoryId: foundCat?.id || null,
      translations: [
        { localeId: 1, name: `${newChart.brand} ${newChart.cat} Size Chart` },
        { localeId: 2, name: `${newChart.brand} دليل مقاسات` },
        { localeId: 3, name: `${newChart.brand} دليل مقاسات الإمارات` },
      ],
      rows: rowsPayload,
    };

    await http.post("/catalog/size-guides", payload);
    toast.success("Size chart uploaded successfully");
    fetchCharts();
  } catch (err) {
    console.error("Failed to upload size chart:", err);
    toast.error("Failed to upload size chart");
  }
};

const saveChart = async ({ chart, rows }) => {
  try {
    const columnIdMap = {};
    if (
      chart.rawRows &&
      chart.rawRows[0] &&
      Array.isArray(chart.rawRows[0].cells)
    ) {
      chart.rawRows[0].cells.forEach((cell) => {
        columnIdMap[cell.code] = cell.measurementColumnId;
      });
    }

    const mkeys = chart.measurements
      ? chart.measurements.map((m) => m.key)
      : [];

    const rowsPayload = rows.map((row, ri) => {
      const cells = [];
      if (columnIdMap["size"]) {
        cells.push({
          measurementColumnId: columnIdMap["size"],
          value: String(row.size || ""),
        });
      }
      mkeys.forEach((key) => {
        const colId = columnIdMap[key];
        if (colId) {
          cells.push({
            measurementColumnId: colId,
            value: String(
              row[key] !== undefined && row[key] !== null ? row[key] : "",
            ),
          });
        }
      });
      return {
        sortOrder: ri,
        cells,
      };
    });

    const payload = {
      code: chart.code || `demo-sg-${Date.now()}`,
      gender: chart.gender || 3,
      translations: chart.translations?.length
        ? chart.translations.map((t) => ({
            localeId: t.localeId,
            name: t.name || chart.name,
          }))
        : [{ localeId: 1, name: chart.name }],
      rows: rowsPayload,
    };

    await http.patch(`/catalog/size-guides/${chart.id}`, payload);
    toast.success("Size chart updated successfully");
    fetchCharts();
    detail.value = null;
  } catch (err) {
    console.error("Failed to update size chart:", err);
    toast.error("Failed to update size chart");
  }
};

const sizeTypeLabel = (t) => (ZC_SIZE_TYPES || {})[t]?.label || t;
</script>

<template>
  <div class="zcat-wrap">
    <div class="zwh-header">
      <div class="zwh-header-left">
        <div style="display: flex; align-items: center; gap: 8px">
          <span style="font-size: 13px; font-weight: 600; color: var(--zg-text)"
            >Size Charts</span
          >
        </div>
        <div class="zwh-subtitle">
          {{ kpiStats.total }} charts · {{ kpiStats.pending }} pending approval
        </div>
      </div>
      <div class="zwh-header-right">
        <button class="zwh-btn-primary" @click="uploadOpen = true">
          Upload Chart
        </button>
      </div>
    </div>

    <div class="zwh-kpi-strip">
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Total Charts</span
        ><span class="zwh-kpi-val">{{ kpiStats.total }}</span
        ><span class="zwh-kpi-sub">all brands</span>
      </div>
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Pending</span
        ><span
          class="zwh-kpi-val"
          :class="{ 'is-warn': kpiStats.pending > 0 }"
          >{{ kpiStats.pending }}</span
        ><span class="zwh-kpi-sub">need review</span>
      </div>
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Approved</span
        ><span class="zwh-kpi-val is-good">{{ kpiStats.approved }}</span
        ><span class="zwh-kpi-sub">live</span>
      </div>
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Brands</span
        ><span class="zwh-kpi-val">{{ kpiStats.brands }}</span
        ><span class="zwh-kpi-sub">with charts</span>
      </div>
      <div class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">Size Types</span
        ><span class="zwh-kpi-val is-accent">{{ kpiStats.sizeTypes }}</span
        ><span class="zwh-kpi-sub">supported</span>
      </div>
    </div>

    <div class="zcat-content">
      <div
        style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap"
      >
        <div style="position: relative; flex-shrink: 0">
          <svg
            viewBox="0 0 14 14"
            width="12"
            fill="none"
            stroke="var(--zg-text-dim)"
            stroke-width="1.5"
            stroke-linecap="round"
            style="
              position: absolute;
              left: 8px;
              top: 50%;
              transform: translateY(-50%);
              pointer-events: none;
            "
          >
            <circle cx="5.5" cy="5.5" r="4" />
            <path d="M9.5 9.5l3 3" />
          </svg>
          <input
            v-model="search"
            placeholder="Search by brand, chart name, category…"
            style="
              height: 30px;
              padding-left: 26px;
              padding-right: 10px;
              width: 260px;
              background: var(--zg-panel);
              border: 1px solid var(--zg-line);
              border-radius: var(--zg-radius-md);
              font-family: var(--zg-sans);
              font-size: 12px;
              color: var(--zg-text);
              outline: none;
            "
          />
          <button
            v-if="search"
            style="
              position: absolute;
              right: 6px;
              top: 50%;
              transform: translateY(-50%);
              border: none;
              background: transparent;
              color: var(--zg-text-dim);
              cursor: pointer;
              font-size: 14px;
              line-height: 1;
            "
            @click="search = ''"
          >
            ×
          </button>
        </div>
        <button
          v-for="[v, l] in [
            ['all', 'All'],
            ['approved', 'Approved'],
            ['pending', 'Pending'],
            ['rejected', 'Rejected'],
          ]"
          :key="v"
          class="zwh-filter-chip"
          :class="{ 'is-active': statusF === v }"
          @click="statusF = v"
        >
          {{ l }}
        </button>
        <div class="zwh-filter-sep" />
        <button
          class="zwh-filter-chip"
          :class="{ 'is-active': typeF === 'all' }"
          @click="typeF = 'all'"
        >
          All Types
        </button>
        <button
          v-for="t in types"
          :key="t"
          class="zwh-filter-chip"
          :class="{ 'is-active': typeF === t }"
          @click="typeF = typeF === t ? 'all' : t"
        >
          {{ sizeTypeLabel(t) }}
        </button>
      </div>

      <div
        style="
          border: 1px solid var(--zg-line);
          border-radius: var(--zg-radius-md);
          overflow: hidden;
          background: var(--zg-panel);
        "
      >
        <div class="zsc-head">
          <span>Chart / Brand</span><span>Category</span><span>Size Type</span
          ><span>Status</span><span>Uploaded By</span><span>Approved By</span
          ><span>Date</span><span>Actions</span>
        </div>
        <div
          v-if="loading"
          style="
            padding: 40px 20px;
            text-align: center;
            color: var(--zg-text-dim);
            font-size: 12.5px;
          "
        >
          Loading size charts…
        </div>
        <div
          v-else-if="!filtered.length"
          style="
            padding: 40px 20px;
            text-align: center;
            color: var(--zg-text-dim);
            font-size: 12px;
          "
        >
          No charts match filter
        </div>
        <template v-else>
          <div
            v-for="c in filtered"
            :key="c.id"
            class="zsc-row"
            style="cursor: pointer"
            @click="viewDetail(c)"
          >
            <div style="overflow: hidden">
              <div
                style="
                  font-size: 12.5px;
                  font-weight: 600;
                  color: var(--zg-text);
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                "
              >
                <span
                  v-if="c.is_zucci_master"
                  style="
                    color: var(--zg-accent);
                    margin-right: 4px;
                    font-size: 10px;
                    font-weight: 700;
                  "
                  >MASTER</span
                >{{ c.name }}
              </div>
              <div
                style="
                  font-size: 11px;
                  color: var(--zg-text-dim);
                  margin-top: 1px;
                "
              >
                {{ c.brand }}
              </div>
            </div>
            <span style="font-size: 12px; color: var(--zg-text-mid)">{{
              c.category
            }}</span>
            <span style="font-size: 11.5px; color: var(--zg-text-dim)">{{
              sizeTypeLabel(c.size_type)
            }}</span>
            <span class="zcat-badge" :class="c.status">{{
              c.status.charAt(0).toUpperCase() + c.status.slice(1)
            }}</span>
            <span style="font-size: 11.5px; color: var(--zg-text-mid)">{{
              c.uploaded_by || "—"
            }}</span>
            <span style="font-size: 11.5px; color: var(--zg-text-mid)">{{
              c.approved_by || "—"
            }}</span>
            <span
              style="
                font-family: var(--zg-mono);
                font-size: 10.5px;
                color: var(--zg-text-dim);
              "
              >{{ fmtDt(c.uploaded_at) }}</span
            >
            <div style="display: flex; gap: 4px" @click.stop>
              <button class="zcat-act" @click="viewDetail(c)">View</button>
              <button
                v-if="c.status === 'pending'"
                class="zcat-act"
                style="
                  border-color: oklch(0.78 0.15 150 / 0.4);
                  color: var(--zg-good);
                "
                @click="approve(c.id)"
              >
                Approve
              </button>
              <button
                v-if="c.status !== 'pending'"
                class="zcat-act"
                @click="logChart = c"
              >
                Log
              </button>
            </div>
          </div>
        </template>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="zsc-pagination">
        <button
          class="zsc-page-btn"
          :disabled="pagination.page === 1"
          @click="
            pagination.page--;
            fetchCharts();
          "
        >
          Previous
        </button>
        <span class="zsc-page-info"
          >Page {{ pagination.page }} of {{ pagination.totalPages }}</span
        >
        <button
          class="zsc-page-btn"
          :disabled="pagination.page === pagination.totalPages"
          @click="
            pagination.page++;
            fetchCharts();
          "
        >
          Next
        </button>
      </div>
    </div>

    <SizeChartDetailDrawer
      :open="!!detail"
      :chart="detail"
      :is-super-admin="IS_SUPER_ADMIN"
      @close="detail = null"
      @approve="approve"
      @reject="reject"
      @save="saveChart"
      @log-open="
        logChart = detail;
        detail = null;
      "
    />
    <ActivityLogDrawer
      :open="!!logChart"
      :chart="logChart"
      @close="logChart = null"
    />
    <UploadChartDrawer
      :open="uploadOpen"
      @close="uploadOpen = false"
      @uploaded="handleUploaded"
    />
  </div>
</template>

<style scoped>
.zsc-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 14px;
  border-top: 1px solid var(--zg-line);
  flex-shrink: 0;
}
.zsc-page-btn {
  height: 28px;
  padding: 0 12px;
  border: 1px solid var(--zg-line);
  border-radius: var(--zg-radius-md);
  background: var(--zg-panel);
  cursor: pointer;
  font-size: 12px;
  color: var(--zg-text);
  font-family: var(--zg-sans);
}
.zsc-page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.zsc-page-info {
  font-size: 12px;
  color: var(--zg-text-dim);
  font-family: var(--zg-sans);
}
</style>
