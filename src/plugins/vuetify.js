import Vue from 'vue'
import {
  Vuetify,
  VApp,
  VBtn,
  transitions
} from 'vuetify'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  components: {
    VApp,
    VBtn,
    transitions
  },
})