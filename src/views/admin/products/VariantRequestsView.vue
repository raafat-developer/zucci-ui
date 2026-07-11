<script setup>
/**
 * VariantRequestsView — Variant Requests module. Integrates listing, Detail loading
 * and approval/rejection actions with the catalog Variant Requests API.
 */
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import VRDetailDrawer from "./variants/VRDetailDrawer.vue";
import { toast } from "@/composables/useToast";
import http from "@/api/http";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();
import { useConfirm } from "@/composables/useConfirm";
const { confirm } = useConfirm();

function vTimeAgo(iso) {
  if (!iso) return "—";
  const m = Math.floor((Date.now() - new Date(iso)) / 60000);
  return m < 60
    ? `${m}m ago`
    : m < 1440
      ? `${Math.floor(m / 60)}h ago`
      : `${Math.floor(m / 1440)}d ago`;
}

const reqs = ref([]);
const statusF = ref("all");
const detail = ref(null);
const loading = ref(false);

const pagination = ref({
  page: 1,
  perPage: 5,
  total: 0,
  totalPages: 1,
});

const kpiStats = ref({
  total: 0,
  pending: 0,
  inReview: 0,
  approved: 0,
  rejected: 0,
});

const mapApiRequest = (r) => {
  const stepsList = r.approvalSteps || r.approval_steps || r.steps;
  return {
    id: r.id,
    product_sku: r.productSku || r.product_sku || r.product?.sku || "—",
    product: r.productName || r.product?.name || r.product || "—",
    vendor: r.brandName || r.brand?.name || r.vendor || "—",
    requested_by: r.requesterEmail || r.requestedBy || r.requested_by || "—",
    requested_at: r.requestedAt || r.createdAt || r.requested_at,
    variant_type: r.variantTypeCode || r.variant_type || "—",
    variant_type_name:
      r.variantTypeName || r.variantType?.name || r.variant_type_name || "—",
    requested_values: Array.isArray(r.requestedValues)
      ? r.requestedValues
      : Array.isArray(r.requested_values)
        ? r.requested_values
        : [],
    reason: r.reason || r.reviewNotes || "—",
    status: r.status || "pending",
    steps: Array.isArray(stepsList)
      ? stepsList.map((s) => ({
          role: s.role || "",
          label: s.label || "",
          actor: s.actor || "",
          at: s.at || "",
          note: s.note || "",
        }))
      : [
          {
            role: "vendor",
            label: "Submitted",
            actor: r.requesterEmail || r.requestedBy || "Vendor",
            at: r.requestedAt || r.createdAt,
            note: r.reason || "",
          },
          {
            role: "cat_mgr",
            label: "Category Manager Review",
            actor: null,
            at: null,
            note: null,
          },
          {
            role: "ops",
            label: "Ops Confirmation",
            actor: null,
            at: null,
            note: null,
          },
        ],
  };
};

const fetchRequests = async () => {
  loading.value = true;
  try {
    const params = {
      page: pagination.value.page,
      perPage: pagination.value.perPage,
    };
    if (statusF.value !== "all") {
      params.status = statusF.value;
    }
    const response = await http.get("/catalog/variant-requests", { params });
    const responseData = response.data || response;
    const items = Array.isArray(responseData.data)
      ? responseData.data
      : Array.isArray(responseData)
        ? responseData
        : [];

    reqs.value = items.map(mapApiRequest);

    // Map pagination metadata
    const meta = responseData.meta || response.meta;
    if (meta) {
      pagination.value.page = meta.current_page || pagination.value.page;
      pagination.value.perPage = meta.per_page || pagination.value.perPage;
      pagination.value.total = meta.total || reqs.value.length;
      pagination.value.totalPages = meta.last_page || 1;
    } else {
      pagination.value.total = reqs.value.length;
      pagination.value.totalPages = 1;
    }

    // Map KPIs
    const kpis = responseData.kpis || response.kpis;
    if (kpis) {
      kpiStats.value.total = kpis.all || 0;
      kpiStats.value.pending = kpis.pending || 0;
      kpiStats.value.inReview = (kpis.catReview || 0) + (kpis.opsReview || 0);
      kpiStats.value.approved = kpis.approved || 0;
      kpiStats.value.rejected = kpis.rejected || 0;
    } else {
      kpiStats.value.total = pagination.value.total;
      kpiStats.value.pending = reqs.value.filter(
        (r) => r.status === "pending",
      ).length;
      kpiStats.value.inReview = reqs.value.filter(
        (r) => r.status === "cat_review" || r.status === "ops_review",
      ).length;
      kpiStats.value.approved = reqs.value.filter(
        (r) => r.status === "approved",
      ).length;
      kpiStats.value.rejected = reqs.value.filter(
        (r) => r.status === "rejected",
      ).length;
    }
  } catch (err) {
    console.error("Failed to load variant requests:", err);
    toast.error("Failed to load variant requests");
  } finally {
    loading.value = false;
  }
};

const viewDetail = async (req) => {
  try {
    const res = await http.get(`/catalog/variant-requests/${req.id}`);
    const fullData = res.data || res;
    detail.value = mapApiRequest({ ...req, ...fullData });
  } catch (err) {
    console.error("Failed to fetch variant request detail:", err);
    toast.error("Failed to load details");
  }
};

const handleAction = async (id, action, noteValue) => {
  try {
    if (action === "assign") {
      const assigneeId = authStore.user?.id || "ZC-4178";
      await http.post(`/catalog/variant-requests/${id}/assign`, { assigneeId });
      toast.info("Assigned to Category Manager");
    } else if (action === "cat_approve") {
      const ok = await confirm({
        title: "Category Manager Approval",
        message:
          "Are you sure you want to approve this variant request and forward it to Operations review?",
        confirmText: "Approve",
        cancelText: "Cancel",
        variant: "primary",
      });
      if (!ok) return;
      await http.post(`/catalog/variant-requests/${id}/cat-approve`);
      toast.success("Approved — sent to Ops");
    } else if (action === "ops_approve") {
      const ok = await confirm({
        title: "Operations Approval",
        message:
          "Are you sure you want to finalize and approve this variant request?",
        confirmText: "Final Approve",
        cancelText: "Cancel",
        variant: "primary",
      });
      if (!ok) return;
      await http.post(`/catalog/variant-requests/${id}/approve`);
      toast.success("Approved — vendor notified");
    } else if (action === "reject") {
      const ok = await confirm({
        title: "Reject Variant Request",
        message: "Are you sure you want to reject this variant request?",
        confirmText: "Reject",
        cancelText: "Cancel",
        variant: "danger",
      });
      if (!ok) return;
      await http.post(`/catalog/variant-requests/${id}/reject`, {
        reason: noteValue || "Rejected",
      });
      toast.warn("Request rejected");
    }
    fetchRequests();
    if (detail.value && detail.value.id === id) {
      detail.value = null;
    }
  } catch (err) {
    console.error(`Failed to perform action ${action}:`, err);
    toast.error(`Failed to perform action`);
  }
};

onMounted(() => {
  fetchRequests();
});

watch(statusF, () => {
  pagination.value.page = 1;
  fetchRequests();
});

const countFor = (s) => {
  if (s === "pending") return kpiStats.value.pending;
  if (s === "cat_review" || s === "ops_review")
    return reqs.value.filter((r) => r.status === s).length;
  if (s === "approved") return kpiStats.value.approved;
  if (s === "rejected") return kpiStats.value.rejected;
  return 0;
};

const filtered = computed(() => reqs.value);

const SM = {
  pending: "inactive",
  cat_review: "pending",
  ops_review: "pending",
  approved: "approved",
  rejected: "rejected",
};
const SL = {
  pending: "Pending",
  cat_review: "Cat. Review",
  ops_review: "Ops Review",
  approved: "Approved",
  rejected: "Rejected",
};

const statusChips = computed(() => [
  ["all", "All", kpiStats.value.total],
  ["pending", "Pending", kpiStats.value.pending],
  [
    "cat_review",
    "Cat. Review",
    reqs.value.filter((r) => r.status === "cat_review").length,
  ],
  [
    "ops_review",
    "Ops Review",
    reqs.value.filter((r) => r.status === "ops_review").length,
  ],
  ["approved", "Approved", kpiStats.value.approved],
  ["rejected", "Rejected", kpiStats.value.rejected],
]);

const kpis = computed(() => [
  ["Total", kpiStats.value.total, "", "all requests"],
  [
    "Pending",
    kpiStats.value.pending,
    kpiStats.value.pending > 0 ? "is-warn" : "",
    "unassigned",
  ],
  [
    "In Review",
    kpiStats.value.inReview,
    kpiStats.value.inReview > 0 ? "is-accent" : "",
    "cat + ops",
  ],
  ["Approved", kpiStats.value.approved, "is-good", ""],
  ["Rejected", kpiStats.value.rejected, "", ""],
]);
</script>

<template>
  <div class="zcat-wrap">
    <div class="zwh-header">
      <div class="zwh-header-left">
        <div style="display: flex; align-items: center; gap: 8px">
          <span style="font-size: 13px; font-weight: 600; color: var(--zg-text)"
            >Variant Requests</span
          >
        </div>
        <div class="zwh-subtitle">
          {{
            countFor("pending") +
            countFor("cat_review") +
            countFor("ops_review")
          }}
          pending review
        </div>
      </div>
    </div>

    <div class="zwh-kpi-strip">
      <div v-for="[l, v, cls, sub] in kpis" :key="l" class="zwh-kpi-cell">
        <span class="zwh-kpi-lbl">{{ l }}</span
        ><span class="zwh-kpi-val" :class="cls">{{ v }}</span
        ><span class="zwh-kpi-sub">{{ sub }}</span>
      </div>
    </div>

    <div class="zcat-content">
      <div style="display: flex; gap: 6px; flex-wrap: wrap">
        <button
          v-for="[v, l, cnt] in statusChips"
          :key="v"
          class="zwh-filter-chip"
          :class="{ 'is-active': statusF === v }"
          @click="statusF = v"
        >
          {{ l }} ({{ cnt }})
        </button>
      </div>

      <div
        style="
          border: 1px solid var(--zg-line);
          border-radius: var(--zg-radius-md);
          overflow: hidden;
        "
      >
        <div
          style="
            display: grid;
            grid-template-columns: 80px 1.5fr 1fr 1.5fr 100px 100px;
            gap: 10px;
            padding: 0 14px;
            height: 32px;
            background: var(--zg-panel-hi);
            border-bottom: 1px solid var(--zg-line);
            font-size: 9.5px;
            text-transform: uppercase;
            letter-spacing: 0.07em;
            color: var(--zg-text-dim);
            font-weight: 600;
            align-items: center;
          "
        >
          <span>ID</span><span>Product / Brand</span><span>Variant Type</span
          ><span>Requested Values</span><span>Submitted</span
          ><span>Status</span>
        </div>
        <div
          v-if="!filtered.length"
          style="
            padding: 40px 20px;
            text-align: center;
            color: var(--zg-text-dim);
            font-size: 12px;
          "
        >
          No requests match filter
        </div>
        <div
          v-for="req in filtered"
          :key="req.id"
          style="
            display: grid;
            grid-template-columns: 80px 1.5fr 1fr 1.5fr 100px 100px;
            gap: 10px;
            padding: 12px 14px;
            background: var(--zg-panel);
            border-bottom: 1px solid var(--zg-line-soft);
            align-items: center;
            cursor: pointer;
          "
          @click="viewDetail(req)"
        >
          <span
            style="
              font-family: var(--zg-mono);
              font-size: 11px;
              color: var(--zg-text-dim);
            "
            >{{ req.id }}</span
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
              {{ req.product }}
            </div>
            <div
              style="
                font-size: 11px;
                color: var(--zg-text-dim);
                margin-top: 1px;
              "
            >
              {{ req.vendor }}
            </div>
          </div>
          <div>
            <div
              style="
                font-size: 12px;
                color: var(--zg-text-mid);
                font-weight: 500;
              "
            >
              {{ req.variant_type_name }}
            </div>
            <div
              style="
                font-size: 10px;
                color: var(--zg-text-dim);
                margin-top: 1px;
              "
            >
              {{ req.requested_by }}
            </div>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 3px">
            <span
              v-for="v in (req.requested_values || []).slice(0, 3)"
              :key="v"
              style="
                height: 18px;
                padding: 0 7px;
                background: var(--zg-accent-tint);
                color: var(--zg-accent);
                border-radius: 3px;
                font-size: 10.5px;
                font-weight: 600;
                display: inline-flex;
                align-items: center;
              "
              >{{ v }}</span
            >
            <span
              v-if="(req.requested_values || []).length > 3"
              style="font-size: 10px; color: var(--zg-text-dim)"
              >+{{ req.requested_values.length - 3 }}</span
            >
          </div>
          <span
            style="
              font-family: var(--zg-mono);
              font-size: 10.5px;
              color: var(--zg-text-dim);
            "
            >{{ vTimeAgo(req.requested_at) }}</span
          >
          <span class="zcat-badge" :class="SM[req.status] || 'inactive'">{{
            SL[req.status] || req.status
          }}</span>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="pagination.totalPages > 1"
        class="zsc-pagination"
        style="
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 16px;
        "
      >
        <button
          class="zsc-page-btn"
          style="
            height: 28px;
            padding: 0 12px;
            border: 1px solid var(--zg-line);
            background: var(--zg-panel);
            border-radius: var(--zg-radius-sm);
            color: var(--zg-text);
            font-size: 11.5px;
            cursor: pointer;
          "
          :disabled="pagination.page === 1"
          @click="
            pagination.page--;
            fetchRequests();
          "
        >
          Prev
        </button>
        <span style="font-size: 11.5px; color: var(--zg-text-mid)"
          >Page {{ pagination.page }} of {{ pagination.totalPages }}</span
        >
        <button
          class="zsc-page-btn"
          style="
            height: 28px;
            padding: 0 12px;
            border: 1px solid var(--zg-line);
            background: var(--zg-panel);
            border-radius: var(--zg-radius-sm);
            color: var(--zg-text);
            font-size: 11.5px;
            cursor: pointer;
          "
          :disabled="pagination.page === pagination.totalPages"
          @click="
            pagination.page++;
            fetchRequests();
          "
        >
          Next
        </button>
      </div>
    </div>

    <VRDetailDrawer
      :open="!!detail"
      :req="detail"
      @close="detail = null"
      @action="handleAction"
    />
  </div>
</template>
