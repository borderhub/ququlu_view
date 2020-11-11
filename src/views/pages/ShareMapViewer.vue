<template>
  <v-row full-height align-content="center" justify="center">
    <v-col cols="3">
      <v-card
        class="pa-2 ma-2"
      >
        <v-list>
          <v-list-group
            v-for="item in items"
            :key="item.title"
            v-model="item.active"
            :prepend-icon="item.action"
            no-action
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="child in item.items"
              :key="child.title"
              @click="onAreaSelect(child)"
            >
              <v-list-item-content>
                <v-list-item-title v-text="child.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-card>
    </v-col>
    <v-col cols="8">
      <v-row fluid>
        <map-base
        :width="windowWidth"
        :height="windowHeight"
        :options="option"
        @mapLoaded="onMapLoaded"
        @mouseMoved="onMouseMoved"
        @mouseLeaved="onMouseLeaved"
        @mapZoomed="onMapZoomed"
        @clicked="onClicked">
        <template v-for="marker in markers">
          <marker-base
            :coordinates="coordinates"
            :draggable="marker.draggable"
            @added="onMarkerAdded"
          >
            <!--<v-icon slot="marker" color="blue">mdi-map-marker</v-icon>-->
          </marker-base>
        </template>
      </map-base>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Emit, Vue, Watch } from 'vue-property-decorator';
import mapboxgl, { Map, MapboxOptions, MapboxGeoJSONFeature, LngLatLike, LngLat, Marker, MarkerOptions } from 'mapbox-gl';
import { Feature, FeatureCollection, Geometry, GeoJsonProperties, GeoJsonObject } from 'geojson';
import MapBase from '@/components/molecules/MapBase.vue';
import appModule from '@/model/store/modules/app-module';
import mapModule from '@/model/store/modules/map-module';
import mapService from '@/model/services/map-service';
import {GetGeoJsonInfoRes, GGJIFuturesRes, PropertiesInterface} from '@/model/dto/res/geojson/get-geojson-info-res';
import MarkerBase from '@/components/molecules/MarkerBase.vue';
import _ from 'lodash';

@Component({
  components: {
    'map-base': MapBase,
    'marker-base': MarkerBase
  }
})
export default class ShareMapViewer extends Vue {
  private option: MapboxOptions = {
    accessToken: process.env.NODE_ENV === 'production' ? 'pk.eyJ1IjoiaGlkZXRha2F0YWtlbWFzYSIsImEiOiJja2hjdWo3OTUwMWV1MnJtcTI3a2V5dno0In0.UEcWgTxFIK7kYkKVsy4hOg' : process.env.VUE_APP_MAPBOX_ACCESSTOKEN,
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v8',
    center: [130.410767, 33.596383],
    zoom: 10
  };
  private map: Map = {} as Map;
  private hoveredStateId: number | null = null;
  private targetArea: GetGeoJsonInfoRes = {} as GetGeoJsonInfoRes;
  private isBorderZoom: boolean = false;
  private coordinates: LngLatLike = [[130.410767, 33.596383], [130.37427, 33.55402], [130.42678, 33.5631]] as unknown as LngLatLike;

  private markers: object[] = [{
    center: this.option.center,
    draggable: false
  }];

  private items = [
    {
      action: 'mdi-ticket',
      items: [{ title: 'List Item' }],
      title: 'シェア率マップ',
    },
    {
      action: 'map',
      active: true,
      items: [
        {title: '福岡市', lnglat: [[130.36572, 33.56589], [130.36572, 33.56589]] as [LngLatLike, LngLatLike]},
        {title: '太宰府市', lnglat: [[130.52758, 33.52177], [130.52758, 33.52177]] as [LngLatLike, LngLatLike]},
        {title: '糸島市', lnglat: [[130.20705, 33.5375], [130.20705, 33.5375]] as [LngLatLike, LngLatLike]}
      ],
      title: '地域',
    },
  ];

  get isMobile() {
    return window.innerWidth <= 767;
  }

  get windowWidth() {
    return window.innerWidth / 1.5;
  }

  get windowHeight() {
    return window.innerHeight / 1.5;
  }

  private async onMapLoaded(t: {map: Map, component: Vue}) {
    console.log(t, mapModule.targetGeoJsonData);
    this.map = t.map;
    if (!t.map.getSource('states')) {
      t.map.addSource(
        'states', {
          'type': 'geojson',
          'data': mapModule.targetGeoJsonData as unknown as FeatureCollection
        }
      );
      this.addStateLayer(t);
    }

    if (!t.map.getSource('meshdata')) {
      // メッシュ
      t.map.addSource(
        'meshdata', {
          'type': 'geojson',
          'data': mapModule.targetGeoJsonData as unknown as FeatureCollection
        }
      );
    }
    appModule.stopLoading();
  }

  private onMapZoomed(t: {map: Map, component: Vue}) {
    // 現在のズームレベル取得
    if (this.isBorderZoom !== t.map.getZoom() >= 13) {
      if (t.map.getZoom() >= 13) {
        this.addMeshdataLayer(t);
        const func = _.debounce(() => {
          if (t.map.getLayer('state-fills')) {
            t.map.removeLayer('state-fills');
          }
          if (t.map.getLayer('state-borders')) {
            t.map.removeLayer('state-borders');
          }
        }, 400);
        func();
      } else {
        this.addStateLayer(t);
        const func = _.debounce(() => {
          if (t.map.getLayer('2DmeshLayer')) {
            t.map.removeLayer('2DmeshLayer');
          }
        }, 400);
        func();
      }
    }
    this.isBorderZoom = t.map.getZoom() >= 13;
  }

  private onMouseMoved(t: {e: {features?: MapboxGeoJSONFeature[]}, map: Map, component: Vue}) {
    if (t.e && t.e.features && t.e.features.length > 0) {
      if (this.hoveredStateId) {
        t.map.setFeatureState(
          { source: 'states', id: this.hoveredStateId as unknown as number },
          { hover: false }
        );
      }
      this.hoveredStateId = t.e.features[0].id as unknown as number;
      t.map.setFeatureState(
        { source: 'states', id: this.hoveredStateId as unknown as number },
        { hover: true }
      );
    }
  }

  private onMouseLeaved(t: { map: Map, component: Vue}) {
    if (this.hoveredStateId) {
      t.map.setFeatureState(
        { source: 'states', id: this.hoveredStateId as unknown as number },
        { hover: false }
      );
    }
    this.hoveredStateId = null;
  }

  private onClicked(t: {e: {features?: MapboxGeoJSONFeature[]}, map: Map, component: Vue}) {
    if (t.e && t.e.features && t.e.features.length > 0) {
      if (this.hoveredStateId) {
        t.map.setFeatureState(
          { source: 'states', id: this.hoveredStateId as unknown as number },
          { hover: false }
        );
      }
      this.hoveredStateId = t.e.features[0].id as unknown as number;
      t.map.setFeatureState(
        { source: 'states', id: this.hoveredStateId as unknown as number },
        { hover: true }
      );
      if (t.e.features[0].properties) {
        console.log('onClicked-- ', '経度--', t.e.features[0].properties.X_CODE, '緯度--', t.e.features[0].properties.Y_CODE, t.e.features[0]);
        t.map.fitBounds([
          [t.e.features[0].properties.X_CODE, t.e.features[0].properties.Y_CODE], [t.e.features[0].properties.X_CODE, t.e.features[0].properties.Y_CODE]
        ], {
          padding: 180,
          maxZoom: 13
        });
      }
    }
  }

  private addStateLayer(t: {map: Map, component: Vue}) {
    t.map.addLayer({
      'id': 'state-fills',
      'type': 'fill',
      'source': 'states',
      'layout': {},
      'paint': {
        'fill-color': '#627BC1',
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          1,
          0.5
        ]
      }
    });

    t.map.addLayer({
      'id': 'state-borders',
      'type': 'line',
      'source': 'states',
      'layout': {},
      'paint': {
        'line-color': '#627BC1',
        'line-width': 2
      }
    });
  }

  private addMeshdataLayer(t: {map: Map, component: Vue}) {
    // 2050年の人口から10段階のカテゴリ別に分類するためのフィルタ
    const SETAI_1 = ['<', ['get', 'SETAI'], 100];
    const SETAI_2 = ['all', ['>=', ['get', 'SETAI'], 100], ['<', ['get', 'SETAI'], 200]];
    const SETAI_3 = ['all', ['>=', ['get', 'SETAI'], 200], ['<', ['get', 'SETAI'], 300]];
    const SETAI_4 = ['all', ['>=', ['get', 'SETAI'], 300], ['<', ['get', 'SETAI'], 400]];
    const SETAI_5 = ['all', ['>=', ['get', 'SETAI'], 400], ['<', ['get', 'SETAI'], 500]];
    const SETAI_6 = ['all', ['>=', ['get', 'SETAI'], 600], ['<', ['get', 'SETAI'], 700]];
    const SETAI_7 = ['all', ['>=', ['get', 'SETAI'], 800], ['<', ['get', 'SETAI'], 1000]];
    const SETAI_8 = ['all', ['>=', ['get', 'SETAI'], 1000], ['<', ['get', 'SETAI'], 4000]];

    // 色の設定
    const colors = ['rgb(215, 25, 28)',   'rgb(232, 91, 58)',
                  'rgb(249, 158, 89)',  'rgb(254, 201, 128)',
                  'rgb(255, 237, 170)', 'rgb(237, 247, 201)',
                  'rgb(199, 230, 219)', 'rgb(157, 207, 228)'];
    // map.addLayer で メッシュの色や幅、塗り潰し等の見た目を設定して、メッシュを表示
    // メッシュの色分け表示は、case オプションにより人口の属性値で分けて表示するように設定
    t.map.addLayer({
      'id': '2DmeshLayer',
      'type': 'fill',
      'source': 'meshdata',
      'layout': {},
      'paint': {
          'fill-color':
            ['case',
              SETAI_1, colors[0],
              SETAI_2, colors[1],
              SETAI_3, colors[2],
              SETAI_4, colors[3],
              SETAI_5, colors[4],
              SETAI_6, colors[5],
              SETAI_7, colors[6],
              SETAI_8, colors[7],
              colors[7]
            ],
          'fill-outline-color': 'white'
        }
    });
  }

  private async onAreaSelect(s: {title: string, lnglat: number[]}) {
    mapModule.updateTargetGeoJsonData(mapService.getTargetArea(mapModule.geoJsonData, s.title));
    const statesSource: mapboxgl.GeoJSONSource = this.map.getSource('states') as mapboxgl.GeoJSONSource;
    const meshdataSource: mapboxgl.GeoJSONSource = this.map.getSource('meshdata') as mapboxgl.GeoJSONSource;
    statesSource.setData(mapModule.targetGeoJsonData as unknown as FeatureCollection);
    meshdataSource.setData(mapModule.targetGeoJsonData as unknown as FeatureCollection);
    this.map.fitBounds(s.lnglat as unknown as [LngLatLike, LngLatLike], {
      padding: 180,
      maxZoom: 10
    });
  }

  // marker
  public addMarker() {
    const center = new LngLat(this.randomLng(), this.randomLat());
    this.markers.push({
      center,
      draggable: Math.random() > 0.5 ? true : false
    });
  }

  public onMarkerAdded(e: {
    marker: Marker
  }) {
    const marker = e.marker;
  }

  public randomLng() {
    return 106 + Math.random() * (130 - 106);
  }
  public randomLat() {
    return 29 + Math.random() * (42 - 29);
  }

  // エラーの伝搬
  @Emit('error')
  private errorPropagation(err: Error): Error {
    console.log(err);
    return err;
  }
}

</script>
