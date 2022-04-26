import Vue from 'vue';
import '@/plugins/toasted';
import App from '@/App.vue';
import i18n from '@/i18n';
import VCalendar from 'v-calendar';
import moment from 'moment-timezone';

Vue.config.productionTip = false;

moment.locale(i18n.locale);
Vue.prototype.$moment = moment;

Vue.use(VCalendar);

new Vue({
  render: (h) => h(App),
  i18n,
}).$mount('#app');
