<template>
  <div class="slds-form-element" :class="value.invalid ? 'slds-has-error' : null">
    <label v-if="label" class="slds-form-element__label" :for="id">
      <abbr v-if="value.required" class="slds-required" title="required">* </abbr>{{ label }}</label
    >
    <div class="slds-form-element__control">
      <div class="slds-select_container">
        <select class="slds-select" :id="id" v-model="value.value" @change="$emit('change')">
          <option v-for="option in options" :value="option" :key="option">{{ option }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';

@Component
export default class SldsSelect extends Vue {
  @Prop() id!: string;
  @Prop() value!: any;
  @Prop() label?: string;
  @Prop() options!: any;
}
</script>
