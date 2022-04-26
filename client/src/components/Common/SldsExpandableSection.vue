<template>
  <div class="slds-section" :class="value ? 'slds-is-open' : null">
    <h3 class="slds-section__title">
      <button class="slds-button slds-section__title-action" @click="$emit('input', !value)">
        <svg class="slds-section__title-action-icon slds-button__icon slds-button__icon_left">
          <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#switch"></use>
        </svg>
        <span class="slds-truncate" :title="title">{{ title }}</span>
      </button>
    </h3>
    <div class="slds-section__content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';

@Component
export default class SldsExpandableSection extends Vue {
  @Prop() value!: boolean;
  @Prop() title!: string;
  @Prop() id!: string;
}
</script>
<style lang="scss" scoped></style>
