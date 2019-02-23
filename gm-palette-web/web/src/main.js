// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import './plugins/vuetify'
import App from './App'
import colors from 'vuetify/es5/util/colors'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

Vue.use(Vuetify, {
  theme: {
    primary: colors.grey,
    secondary: colors.grey
  }
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
