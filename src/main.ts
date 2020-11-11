import 'babel-polyfill';
import Vue from 'vue';
import vuetify from '@/plugins/vuetify';
import 'vuetify/dist/vuetify.min.css';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from '@/model/store/store';
import appModule from './model/store/modules/app-module';
import mapModule from '@/model/store/modules/map-module';
import mapService from '@/model/services/map-service';

Vue.config.productionTip = false;

const vue = new Vue({
  router,
  vuetify,
  store,
  render: h => h(App),
  async created() {
    await mapModule.requestGeoJsonInfo('data/geojson/40-fukuoka-all.geojson');
    // 指定した市区町村のデータに絞り込む
    mapModule.updateTargetGeoJsonData(mapService.getTargetArea(mapModule.geoJsonData, '福岡市'));
    this.$mount('#app');
  }
});
