import Vue from 'vue';

import Toasted from 'vue-toasted';

Vue.use(Toasted, {
  theme: 'toasted-primary',
  position: 'bottom-center',
  duration: 3000,
  className: 'toasted-item',
});
