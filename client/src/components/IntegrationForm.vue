<template>
  <div class="slds-grid slds-m-around_small">
    <div class="slds-col slds-size_12-of-12">
      <form novalidate="novalidate" @submit="checkForm">
        <div class="slds-card slds-p-around_small">
          <div class="slds-grid slds-grid_vertical">
          <div class="slds-col">
              {{ $t('app.header') }}
            </div>

            <slds-input
              class="slds-m-top_medium"
              id="offer-id-input"
              v-model="dataForm.offerId"
              :label="$t('offer_id.label')"
              @onBlur="onBlurField"
              :help="`Example for: <br/>- DE:<br/> {{Event.${eventDefinitionKey}.offerId}}`"
            ></slds-input>
            <slds-input
              class="slds-m-top_xx-small"
              id="customer-name-input"
              v-model="dataForm.customerName"
              :label="$t('customer_name.label')"
              @onBlur="onBlurField"
            ></slds-input>
            <slds-input
              class="slds-m-top_xx-small"
              id="rm-name-input"
              v-model="dataForm.rmName"
              :label="$t('rm_name.label')"
              @onBlur="onBlurField"
            ></slds-input>
            <slds-input
              class="slds-m-top_xx-small"
              id="offer-name-input"
              v-model="dataForm.offerName"
              :label="$t('offer_name.label')"
              @onBlur="onBlurField"
            ></slds-input>
            <slds-input
              class="slds-m-top_xx-small"
              id="product-name-input"
              v-model="dataForm.productName"
              :label="$t('product_name.label')"
              @onBlur="onBlurField"
            ></slds-input>
            <slds-input
              class="slds-m-top_xx-small"
              id="channel-input"
              v-model="dataForm.channel"
              :label="$t('channel.label')"
              @onBlur="onBlurField"
            ></slds-input>
            <slds-input
              class="slds-m-top_xx-small"
              id="action-status-input"
              v-model="dataForm.actionStatus"
              :label="$t('action_status.label')"
              @onBlur="onBlurField"
            ></slds-input>
            <slds-input
              class="slds-m-top_xx-small"
              id="action-detail-input"
              v-model="dataForm.actionDetail"
              :label="$t('action_detail.label')"
              @onBlur="onBlurField"
            ></slds-input>
            <date-picker
              class="slds-m-top_xx-small"
              id="beginning-date-input"
              v-model="dataForm.beginningDate"
              :label="$t('beginning_date.label')"
              @onBlur="onBlurField"
            ></date-picker>
            <date-picker
              class="slds-m-top_xx-small"
              id="end-date-input"
              v-model="dataForm.endDate"
              :label="$t('end_date.label')"
              @onBlur="onBlurField"
            ></date-picker>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';
import SldsSelect from '@/components/Common/SldsSelect.vue';
import SldsInput from '@/components/Common/SldsInput.vue';
import {InputRuleType} from '@/types/InputTypes';
import SldsTextarea from '@/components/Common/SldsTextarea.vue';
import DatePicker from '@/components/Common/DatePicker.vue';

@Component({
  components: {SldsTextarea, SldsInput, SldsSelect, DatePicker},
})
export default class IntegrationForm extends Vue {
  @Prop() args!: any;
  @Prop() connection!: any | null;
  @Prop() eventDefinitionKey!: string;

  buttonSettings = {
    button: 'next',
    text: 'done',
    visible: true,
    enabled: false,
  };

  dataForm: any = {
    offerId: {
      value: '',
      required: true,
      invalid: false,
    },
    customerName: {
      value: '',
      required: true,
      invalid: false,
    },
    rmName: {
      value: '',
      required: true,
      invalid: false,
    },
    offerName: {
      value: '',
      required: true,
      invalid: false,
    },
    productName: {
      value: '',
      required: true,
      invalid: false,
    },
    beginningDate: {
      value: '',
      required: true,
      invalid: false,
    },
    endDate: {
      value: '',
      required: true,
      invalid: false,
    },
    channel: {
      value: '',
      required: true,
      invalid: false,
    },
    actionStatus: {
      value: '',
      required: true,
      invalid: false,
    },
    actionDetail: {
      value: '',
      required: true,
      invalid: false,
    },
  };

  created() {
    if (this.args) {
      this.dataForm.offerId.value = this.args.offerId;
      this.dataForm.customerName.value = this.args.customerName;
      this.dataForm.rmName.value = this.args.rmName;
      this.dataForm.offerName.value = this.args.offerName;
      this.dataForm.productName.value = this.args.productName;
      this.dataForm.beginningDate.value = this.args.beginningDate;
      this.dataForm.endDate.value = this.args.endDate;
      this.dataForm.channel.value = this.args.channel;
      this.dataForm.actionStatus.value = this.args.actionStatus;
      this.dataForm.actionDetail.value = this.args.actionDetail;

      this.isFormValid();
    }
  }

  checkForm(e: any) {
    e.preventDefault();
  }

  isFormValid() {
    const dataFormKeys = Object.keys(this.dataForm);

    return this.validateByKeys(dataFormKeys, this.dataForm);
  }

  onBlurField() {
    this.enableUpdateButton(true);
  }

  enableUpdateButton(enabled: boolean) {
    this.buttonSettings.enabled = enabled;
    this.connection.trigger('updateButton', this.buttonSettings);
  }

  getData() {
    return {
      formData: this.dataForm,
    };
  }

  validateByKeys(keys: string[], form: any) {
    let isValid = true;
    let unPopulatedFields = false;
    keys.forEach((key) => {
      if (form[key].required) {
        if (form[key].value === '') {
          form[key].invalid = true;
          unPopulatedFields = true;
          isValid = false;
        }
      }
      if (form[key].rules) {
        form[key].rules.forEach((rule: any) => {
          switch (rule.key) {
            case InputRuleType.LENGTH:
              if (rule.max !== null && form[key].value.length > rule.max) {
                form[key].invalid = true;
                isValid = false;
              }
              if (rule.min !== null && form[key].value.length < rule.min) {
                form[key].invalid = true;
                isValid = false;
              }
              break;
            case InputRuleType.NUMBER:
              if (form[key].value !== '') {
                const number = parseInt(form[key].value);
                if (!isNaN(number)) {
                  if (rule.max !== null && number > rule.max) {
                    form[key].invalid = true;
                    isValid = false;
                  }
                  if (rule.min !== null && number < rule.min) {
                    form[key].invalid = true;
                    isValid = false;
                  }
                } else {
                  form[key].invalid = true;
                  isValid = false;
                }
              }
              break;
          }
        });
      }
    });
    if (unPopulatedFields) {
      this.$toasted.error(this.$t('error.unpopulated.fields').toString());
    }
    return isValid;
  }
}
</script>
