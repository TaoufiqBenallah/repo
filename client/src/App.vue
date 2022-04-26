<template>
  <div id="app" class="slds-brand-band slds-brand-band_large">
    <!-- NOT AUTHENTICATED: -->
    <div v-if="!authenticated && !loading">
      <div class="demo-only" style="height:24rem">
        <section
          role="alertdialog"
          tabindex="0"
          aria-labelledby="prompt-heading-id"
          aria-describedby="prompt-message-wrapper"
          class="slds-modal slds-fade-in-open slds-modal_prompt"
          aria-modal="true"
        >
          <div class="slds-modal__container">
            <header class="slds-modal__header slds-theme_error slds-theme_alert-texture">
              <button class="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse" title="Close">
                <svg class="slds-button__icon slds-button__icon_large" aria-hidden="true">
                  <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span class="slds-assistive-text">Close</span>
              </button>
              <h2 class="slds-text-heading_medium" id="prompt-heading-id">Application not available</h2>
            </header>
            <div class="slds-modal__content slds-p-around_medium" id="prompt-message-wrapper">
              <p>
                The Application you are looking for is not available OR you are not allowed to use it.
              </p>
            </div>
          </div>
        </section>
        <div class="slds-backdrop slds-backdrop_open"></div>
      </div>
    </div>

    <div v-if="authenticated && !loading && token">
      <integration-form
        ref="configurator"
        :args="args"
        :connection="connection"
        :token="token"
        :event-definition-key="eventDefinitionKey"
      ></integration-form>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import Postmonger from 'postmonger';
import AuthService from '@/service/api/AuthService';
import IntegrationForm from '@/components/IntegrationForm.vue';

@Component({
  components: {IntegrationForm},
})
export default class App extends Vue {
  $refs!: {
    configurator: IntegrationForm;
  };

  connection: any = null;
  authenticated: boolean = false;
  payload: any = {};
  loading: boolean = true;
  token: string | null = '';
  args: any = null;
  eventDefinitionKey: string = '';
  initialized: boolean = false;

  created() {
    this.setupPostmonger();
    this.runPostmongerInit();
  }

  setupPostmonger() {
    this.connection = new Postmonger.Session();
    // Register Postmonger events:
    this.connection.on('initActivity', this.initialize);

    this.connection.on('requestedTokens', this.onGetTokens);
    this.connection.on('requestedInteraction', this.requestedInteractionHandler);
    this.connection.on('requestedTriggerEventDefinition', this.requestTriggerEventDefinitionHandler);
    this.connection.on('clickedNext', this.save);
  }

  runPostmongerInit() {
    // Ready:
    this.connection.trigger('ready');
    this.connection.trigger('requestTokens');
    this.connection.trigger('requestInteraction');
    // this.connection.trigger('requestTriggerEventDefinition');
  }

  async initialize(data: any) {
    console.log('initialize: ' + JSON.stringify(data));
    if (data) {
      this.payload = data;
    }
    if (
      this.payload['arguments'] &&
      this.payload['arguments'].execute &&
      this.payload['arguments'].execute.inArguments &&
      this.payload['arguments'].execute.inArguments.length > 0
    ) {
      this.loadArgs(this.payload['arguments'].execute.inArguments);
    } else {
      console.warn(`=>=> init - NO Args found`);
    }
    this.initialized = true;
  }

  loadArgs(args: any) {
    // get arguments stored in JSON:
    const inArgs = this.findArgumentsKey(args);
    if (inArgs) {
      if (Object.keys(inArgs)) {
        console.log('initialize: ', inArgs);

        this.args = inArgs;
        console.log(inArgs);
        console.log('Arguments loaded!');
      } else {
        console.warn('No Arguments found.');
      }
    } else {
      console.warn('Activity Arguments not found.');
    }
  }

  findArgumentsKey(args: any): any {
    let inArgs = {};

    args.forEach((argItem: any) => {
      inArgs = {...argItem, ...inArgs}
    });

    return inArgs;
  }

  onGetTokens(tokens: any) {
    this.loading = true;
    console.log('onGetTokens()', tokens);
    // we can use this to verify, that UI-API was called from MC:

    this.token = tokens['fuel2token'];
    if (typeof this.token === 'string' && this.token.length > 0) {
      AuthService.authenticate(this.token)
        .then(() => {
          // console.log(`token valid: `, data)
          this.authenticated = true;
          this.loading = false;
        })
        .catch(() => {
          console.log('Not authenticated - token not valid.');
          this.loading = false;
          // console.log(err);
        });
      // this.authenticated = true;
      // this.loading = false;
    } else {
      console.log('Not authenticated - token not found.');
      this.loading = false;
    }
  }

  requestedInteractionHandler(settings: any) {
    if (settings.triggers[0] && settings.triggers[0].metaData && settings.triggers[0].metaData.eventDefinitionKey) {
      this.eventDefinitionKey = settings.triggers[0].metaData.eventDefinitionKey;
    }
  }

  requestTriggerEventDefinitionHandler(settings: any) {
    // just discovery, nothing more for now:
    console.log('requestTriggerEventDefinition => ' + JSON.stringify(settings));
  }

  save() {
    if (this.$refs.configurator.isFormValid()) {
      // payload is the thing from metadata
      this.payload['arguments'].execute.inArguments = this.buildInArgs();
      this.payload['metaData'].isConfigured = true;
      console.log('save: ' + JSON.stringify(this.payload));
      this.connection.trigger('updateActivity', this.payload);
    } else {
      this.connection.trigger('prevStep');
    }
  }

  buildInArgs() {
    const data = this.$refs.configurator.getData();

    const beginningDate = new Date(data.formData.beginningDate.value)
    beginningDate.setUTCHours(0,0,0,0);

    const endDate = new Date(data.formData.endDate.value)
    endDate.setUTCHours(23,59,59,999);

    return [
      {
        offerId: data.formData.offerId.value,
      },
      {
        customerName: data.formData.customerName.value,
      },
      {
        rmName: data.formData.rmName.value,
      },
      {
        offerName: data.formData.offerName.value,
      },
      {
        productName: data.formData.productName.value,
      },
      {
        beginningDate: beginningDate.toISOString(),
      },
      {
        endDate: endDate.toISOString(),
      },
      {
        channel: data.formData.channel.value,
      },
      {
        actionStatus: data.formData.actionStatus.value,
      },
      {
        actionDetail: data.formData.actionDetail.value,
      },
      {
        contactKey: '{{Contact.Key}}',
      },
      {
        PublicationId: '{{Context.PublicationId}}',
      },
      {
        DefinitionInstanceId: '{{Context.DefinitionInstanceId}}',
      },
      {
        VersionNumber: '{{Context.VersionNumber}}',
      },
    ];
  }
}
</script>
<style lang="scss">
@import '../public/assets/styles/salesforce-lightning-design-system.css';
@import 'styles/main.scss';
@import 'styles/overrides.scss';
</style>
