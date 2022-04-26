<template>
  <div :style="toastStyling" class="slds-m-bottom_none">
    <!-- style="height:3.5rem" -->
    <div class="slds-notify_container slds-is-relative">
      <div :class="toastClass" class="slds-notify slds-notify_toast" role="status">
        <span class="slds-assistive-text">{{ assistiveText }}</span>
        <!-- <span class="slds-icon_container slds-icon-utility-success slds-m-right_small slds-no-flex slds-align-top" title="Description of icon when needed"> -->
        <!-- <svg class="slds-icon slds-icon_small" aria-hidden="true">
            <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#success"></use>
          </svg> -->
        <!-- </span> -->
        <div class="slds-notify__content slds-align_absolute-center">
          <h2 class="slds-text-heading_small ">{{ msg }}</h2>
        </div>
        <!-- <div class="slds-notify__close">
          <button class="slds-button slds-button_icon slds-button_icon-inverse" title="Close">
            <svg class="slds-button__icon slds-button__icon_large" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
            </svg>
            <span class="slds-assistive-text">Close</span>
          </button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';

@Component
export default class SldsErrorMessage extends Vue {
  @Prop() msg!: string;
  @Prop() success!: boolean;
  @Prop() show!: boolean;

  getDisplay() {
    return this.show ? 'block' : 'none'; // for display
    // let d = this.show ? 'visible' : 'hidden' // for visibility
    // return d;
  }

  get toastClass() {
    return {
      'slds-theme_success': this.success,
      'slds-theme_error': !this.success,
    };
  }

  get toastStyling() {
    return {
      display: this.getDisplay(),
      // visibility: this.getDisplay()
    };
  }

  get assistiveText() {
    return this.success ? 'success' : 'error';
  }
}
</script>
