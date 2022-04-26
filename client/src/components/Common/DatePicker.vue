<template>
  <div class="slds-form-element" :class="value.invalid ? 'slds-has-error' : null">
    <label class="slds-form-element__label" :for="id">
      <abbr v-if="value.required" class="slds-required" title="required">* </abbr
      ><span class="input-label">{{ label }}</span>
      <span v-if="tooltip" style="margin-left: 2px; line-height: 22px;">
        <slds-tooltip :helpText="tooltip" top="-40px" width="250px"></slds-tooltip> </span
    ></label>
    <div class="slds-form-element__control slds-input-has-icon slds-input-has-icon_right">
      <svg class="slds-icon slds-input__icon slds-input__icon_right slds-icon-text-default" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#date_input"></use>
      </svg>
      <v-date-picker v-model="value.value" mode="date" is24hr timezone="Europe/Vienna">
        <template v-slot="{inputValue, togglePopover}">
          <input
            v-model="inputDate"
            type="text"
            :id="id"
            :placeholder="placeholder"
            @click="togglePopover"
            autocomplete="off"
            required=""
            class="slds-input"
            @focus="onFocus"
            @blur="$emit('onBlur')"
            :disabled="disabled"
          />
        </template>
      </v-date-picker>
    </div>
    <div v-if="help" class="slds-form-element__help">
      <span v-html="help"></span>
    </div>
  </div>
</template>
<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';
import SldsTooltip from '@/components/Common/SldsTooltip.vue';
@Component({
  components: {SldsTooltip},
})
export default class DatePicker extends Vue {
  @Prop() id!: string;
  @Prop() value!: any;
  @Prop() label!: string;
  @Prop({default: ''}) placeholder?: string;
  @Prop({default: false}) disabled?: boolean;
  @Prop({default: ''}) help?: string;
  @Prop({default: ''}) tooltip?: string;

  onFocus() {
    this.$emit('input', {...this.value, invalid: false});
  }

  get inputDate() {
    return this.value.value
      ? this.$moment(this.value.value)
          .tz('Europe/Prague')
          .format('DD. MM. YYYY')
      : '';
  }
}
</script>
