<template>
  <div class="slds-form-element">
    <label class="slds-checkbox_toggle slds-grid">
      <span class="slds-form-element__label slds-m-bottom_none">{{ label }}</span>
      <input type="checkbox" :value="value" checked="" :disabled="disabled" />
      <span :id="id" class="slds-checkbox_faux_container">
        <span class="slds-checkbox_faux"></span>
        <span class="slds-checkbox_on">True</span>
        <span class="slds-checkbox_off">False</span>
      </span>
    </label>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';

@Component
export default class SldsToggle extends Vue {
  @Prop() id!: string;
  @Prop() value!: any;
  @Prop() label!: string;
  @Prop({default: false}) disabled?: boolean;

  onFocus() {
    this.$emit('input', {...this.value, invalid: false});
  }
}
</script>
