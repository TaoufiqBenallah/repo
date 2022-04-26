<template>
  <div class="slds-form-element" :class="value.invalid ? 'slds-has-error' : null">
    <label v-if="!hideLabel" class="slds-form-element__label" :for="id">
      <abbr v-if="value.required" class="slds-required" title="required">* </abbr>{{ label }}</label
    >
    <div class="slds-form-element__control">
      <textarea
        v-model="value.value"
        :id="id"
        :placeholder="placeholder"
        required=""
        :disabled="disabled"
        class="slds-textarea"
        @focus="onFocus"
        @blur="$emit('onBlur')"
      ></textarea>
    </div>
    <div v-if="help" class="slds-form-element__help">{{ help }}</div>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';

@Component
export default class SldsTextarea extends Vue {
  @Prop() id!: string;
  @Prop() value!: any;
  @Prop() label!: string;
  @Prop({default: ''}) placeholder?: string;
  @Prop({default: ''}) help?: string;
  @Prop({default: false}) disabled?: boolean;
  @Prop({default: false}) hideLabel?: boolean;

  onFocus() {
    this.$emit('input', {...this.value, invalid: false});
  }
}
</script>
