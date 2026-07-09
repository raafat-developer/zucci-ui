<script setup>
import { reactive } from 'vue';

const props = defineProps({ wh: { type: Object, required: true } });

const vals = reactive({
  name:          props.wh.name,
  city:          props.wh.city,
  district:      props.wh.district || '',
  address:       props.wh.address  || '',
  notes:         props.wh.notes    || '',
  contact_first: props.wh.contact?.first || '',
  contact_last:  props.wh.contact?.last  || '',
  contact_phone: props.wh.contact?.phone || '',
  contact_email: props.wh.contact?.email || '',
  cap_m2:        props.wh.capacity.m2,
  cap_pallets:   props.wh.capacity.pallets,
  cap_bins:      props.wh.capacity.bins,
  cost_m2:       props.wh.costs?.storage_per_m2_per_day     || 0,
  cost_pallet:   props.wh.costs?.storage_per_pallet_per_day || 0,
  cost_recv:     props.wh.costs?.receiving_fee              || 0,
  cost_handle:   props.wh.costs?.handling_fee               || 0,
  cost_fulfill:  props.wh.costs?.fulfillment_fee            || 0,
});
</script>

<template>
  <div class="zwh-tab-body">
    <div class="zwh-settings-grid">
      <!-- Left: warehouse info -->
      <div class="zwh-field-group">
        <div class="zwh-section-label" style="margin-bottom:4px;">Warehouse Info</div>
        <div class="zwh-field">
          <label class="zwh-field-label">Warehouse Name <span style="color:var(--zg-danger);">*</span></label>
          <input class="zwh-field-input" v-model="vals.name" />
        </div>
        <div class="zwh-field">
          <label class="zwh-field-label">City</label>
          <input class="zwh-field-input" v-model="vals.city" />
        </div>
        <div class="zwh-field">
          <label class="zwh-field-label">District / Zone</label>
          <input class="zwh-field-input" v-model="vals.district" />
        </div>
        <div class="zwh-field">
          <label class="zwh-field-label">Address</label>
          <textarea class="zwh-field-textarea" v-model="vals.address" />
        </div>
        <div class="zwh-field">
          <label class="zwh-field-label">Internal Notes</label>
          <textarea class="zwh-field-textarea" v-model="vals.notes" />
        </div>
      </div>

      <!-- Right: contact + capacity + costs -->
      <div style="display:flex;flex-direction:column;gap:16px;">
        <!-- Contact -->
        <div class="zwh-field-group">
          <div class="zwh-section-label" style="margin-bottom:4px;">Contact Person</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div class="zwh-field">
              <label class="zwh-field-label">First Name</label>
              <input class="zwh-field-input" v-model="vals.contact_first" />
            </div>
            <div class="zwh-field">
              <label class="zwh-field-label">Last Name</label>
              <input class="zwh-field-input" v-model="vals.contact_last" />
            </div>
          </div>
          <div class="zwh-field">
            <label class="zwh-field-label">Phone</label>
            <input class="zwh-field-input" v-model="vals.contact_phone" />
          </div>
          <div class="zwh-field">
            <label class="zwh-field-label">Email</label>
            <input class="zwh-field-input" type="email" v-model="vals.contact_email" />
          </div>
        </div>

        <!-- Capacity -->
        <div class="zwh-field-group">
          <div class="zwh-section-label" style="margin-bottom:4px;">Capacity</div>
          <div class="zwh-costs-grid">
            <div class="zwh-field">
              <label class="zwh-field-label">Floor Space (m²)</label>
              <input class="zwh-field-input" type="number" v-model.number="vals.cap_m2" />
            </div>
            <div class="zwh-field">
              <label class="zwh-field-label">Pallet Positions</label>
              <input class="zwh-field-input" type="number" v-model.number="vals.cap_pallets" />
            </div>
            <div class="zwh-field">
              <label class="zwh-field-label">Bin Locations</label>
              <input class="zwh-field-input" type="number" v-model.number="vals.cap_bins" />
            </div>
          </div>
        </div>

        <!-- Cost rates -->
        <div class="zwh-field-group">
          <div class="zwh-section-label" style="margin-bottom:4px;">Cost Rates ({{ wh.currency }})</div>
          <div class="zwh-costs-grid">
            <div class="zwh-field">
              <label class="zwh-field-label">Storage / m² / day</label>
              <input class="zwh-field-input" type="number" v-model.number="vals.cost_m2" />
            </div>
            <div class="zwh-field">
              <label class="zwh-field-label">Storage / pallet / day</label>
              <input class="zwh-field-input" type="number" v-model.number="vals.cost_pallet" />
            </div>
            <div class="zwh-field">
              <label class="zwh-field-label">Receiving / shipment</label>
              <input class="zwh-field-input" type="number" v-model.number="vals.cost_recv" />
            </div>
            <div class="zwh-field">
              <label class="zwh-field-label">Handling / unit</label>
              <input class="zwh-field-input" type="number" v-model.number="vals.cost_handle" />
            </div>
            <div class="zwh-field">
              <label class="zwh-field-label">Fulfillment / order</label>
              <input class="zwh-field-input" type="number" v-model.number="vals.cost_fulfill" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div style="display:flex;gap:8px;padding-top:4px;border-top:1px solid var(--zg-line);margin-top:4px;">
      <button class="zwh-btn-primary" @click="">Save Changes</button>
      <button class="zwh-btn-ghost" @click="">Discard</button>
    </div>
  </div>
</template>
