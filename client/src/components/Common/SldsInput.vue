<template>
  <div class="slds-form-element" :class="value.invalid ? 'slds-has-error' : null">
    <label v-if="label" class="slds-form-element__label" :for="id">
      <abbr v-if="value.required" class="slds-required" title="required">* </abbr><span>{{ label }}</span>
      <span v-if="tooltip" style="margin-left: 2px; line-height: 22px;">
        <slds-tooltip :helpText="tooltip" top="-48px" width="250px"></slds-tooltip>
      </span>
    </label>
    <div class="slds-form-element__control">
      <input
        v-model="value.value"
        type="text"
        :id="id"
        :placeholder="placeholder"
        required=""
        class="slds-input"
        @focus="onFocus"
        @blur="$emit('onBlur')"
        :disabled="disabled"
        autocomplete="off"
      />
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
export default class SldsInput extends Vue {
  @Prop() id!: string;
  @Prop() value!: any;
  @Prop() label!: string;
  @Prop({default: ''}) placeholder?: string;
  @Prop({default: ''}) help?: string;
  @Prop({default: ''}) tooltip?: string;
  @Prop({default: false}) disabled?: boolean;

  onFocus() {
    this.$emit('input', {...this.value, invalid: false});
    this.$emit('onFocus');
  }
}
</script>
<style lang="scss" scoped>
</style>
