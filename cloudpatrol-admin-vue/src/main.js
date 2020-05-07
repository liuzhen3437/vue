import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import VCharts from 'v-charts'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import i18n from './lang' // internationalization

import '@/icons' // icon
import '@/permission' // permission control

import Print from '@/plugs/print'
Vue.use(Print)

Vue.use(ElementUI, { locale })
Vue.use(VCharts)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})


import exportToPdf　from '@/utils/exportToPdf'
Vue.use(exportToPdf)

    import VueAMap from "vue-amap";
    Vue.use(VueAMap);
    VueAMap.initAMapApiLoader({
      key: "5e9626bffdee967b9f32a39b84fc278b",
      plugin: ["AMap.Scale", "AMap.OverView", "AMap.ToolBar", "AMap.MapType",'AMap.Geolocation'],
      uiVersion: "1.0.11", // ui库版本，不配置不加载,
      v: "1.4.4"
    });

// import AMap from "vue-amap";
// Vue.use(AMap);
// AMap.initAMapApiLoader({
//   key: "5e9626bffdee967b9f32a39b84fc278b",
//   plugin: ["AMap.Scale", "AMap.OverView", "AMap.ToolBar", "AMap.MapType",'AMap.Geolocation'],
//   uiVersion: "1.0.11", // ui库版本，不配置不加载,
//   v: "1.4.4"
// });
