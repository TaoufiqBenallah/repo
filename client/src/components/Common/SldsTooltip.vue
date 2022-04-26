<template>
  <div class="slds-form-element__icon slds-m-top__none">
    <span
      class="slds-button slds-button_icon"
      aria-describedby="help"
      @mouseover="showHelp = true"
      @mouseleave="showHelp = false"
    >
      <svg class="slds-button__icon" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#info"></use>
      </svg>
      <span class="slds-assistive-text">Help</span>
    </span>
    <div
      class="slds-popover slds-popover_tooltip slds-nubbin_bottom-left"
      role="tooltip"
      id="help"
      v-bind:style="helpBubbleStyle"
    >
      <div class="slds-popover__body">{{ helpText }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';

@Component
export default class SldsTooltip extends Vue {
  @Prop() helpText!: any;
  @Prop() top!: any;
  @Prop() width!: any;

  showHelp = false;

  get helpBubbleStyle() {
    return {
      display: this.showHelp ? 'block' : 'none',
      position: 'absolute',
      left: '-15px',
      top: this.top ? this.top : '45px',
      width: this.width ? this.width : '250px',
    };
  }
}
</script>
