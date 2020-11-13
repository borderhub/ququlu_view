ShareMapViewer

<template>
  <v-row full-height align-content="center" justify="center">
    <v-col cols="3">
      <v-card
        class="pa-2 ma-2"
      >
        <v-list expand>
          <v-list-group
            v-for="item in menus"
            :key="item.title"
            :value="item.active"
            :prepend-icon="item.action"
            no-action
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-group
              v-for="child in item.items"
              :key="child.title"
              :value="child.active"
              no-action
              sub-group
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title @click="onAreaSelect(child)" v-text="child.title"></v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-group
                v-for="grandchild in child.items"
                :key="grandchild.title"
                :value="grandchild.active"
                no-action
                sub-group
              >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title @click="onGrandchildAreaSelect(grandchild, child)" v-text="grandchild.title"></v-list-item-title>
                  </v-list-item-content>
                </template>

                  <v-list-item
                    v-for="greatgrandchild in grandchild.items"
                    :key="greatgrandchild.title"
                    @click="onGreatGrandchildAreaSelect(greatgrandchild, grandchild, child)"
                    exact-active-class="blue"
                  >
                    <template v-slot:default="{ active }">
                      <v-list-item-icon>
                        <v-icon v-text="greatgrandchild.action"></v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title v-text="greatgrandchild.title"></v-list-item-title>
                      </v-list-item-content>
                    </template>
                  </v-list-item>

              </v-list-group>

            </v-list-group>

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
        @styleDataLoading="onStyleDataLoading"
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
import * as MapboxLanguage from '@mapbox/mapbox-gl-language';
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
    accessToken: process.env.NODE_ENV === 'production' ? 'pk.eyJ1IjoiaGlkZXRha2F0YWtlbWFzYSIsImEiOiJja2d4MXhucWcwODVnMnpyczgxMjJubnhpIn0.yL-0STU6_WV6QIbQAeKs_w' : process.env.VUE_APP_MAPBOX_ACCESSTOKEN,
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v8',
    center: [130.410767, 33.596383],
    zoom: 10
  };
  private tscope: {map: Map, component: Vue} = {} as {map: Map, component: Vue};
  private map: Map = {} as Map;
  private hoveredStateId: number | null = null;
  private targetArea: GetGeoJsonInfoRes = {} as GetGeoJsonInfoRes;
  private isBorderZoom: boolean = false;
  private coordinates: LngLatLike = [[130.410767, 33.596383], [130.37427, 33.55402], [130.42678, 33.5631]] as unknown as LngLatLike;
  private markers: object[] = [{
    center: this.option.center,
    draggable: false
  }];

  private menus = [
    {
      action: 'mdi-ticket',
      active: true,
      items: [
        {title: 'ストリート', style: 'streets-v8', append: false},
        {title: 'light', style: 'light-v10', append: false},
        {title: 'ダーク', style: 'dark-v10', append: false},
        {title: '衛星', style: 'satellite-v9', append: false}
      ],
      title: 'マップスタイル',
    },
    {
      action: 'mdi-ticket',
      active: true,
      items: [
        {title: '契約週本数', type: 'contract', append: false},
        {title: '商品カテゴリ別週本数', style: 'category', append: false},
        {title: '過去の営業エリア', style: 'history', append: false}
      ],
      title: 'シェア率マップ',
    },
    {
      action: 'my_location',
      active: true,
      items: [
        {
          title: '福岡県',
          lnglat: [[130.36572, 33.56589], [130.36572, 33.56589]] as [LngLatLike, LngLatLike],
          action: 'mdi-menu-right',
          active: true,
          items: [
            {
              title: '福岡市',
              lnglat: [[130.36572, 33.56589], [130.36572, 33.56589]] as [LngLatLike, LngLatLike],
              action: 'mdi-menu-right',
              active: true,
              append: true,
              items: [
                {
                  title: '中央区', lnglat: [[130.38598, 33.58239], [130.38598, 33.58239]] as [LngLatLike, LngLatLike]
                },
                {
                  title: '博多区', lnglat: [[130.43973, 33.58364], [130.43973, 33.58364]] as [LngLatLike, LngLatLike]
                },
                {
                  title: '南区', lnglat: [[130.41142, 33.5425], [130.41142, 33.5425]] as [LngLatLike, LngLatLike]
                }
              ]
            },
            {
              title: '太宰府市',
              action: 'chevron_right',
              append: false,
              lnglat: [[130.52758, 33.52177], [130.52758, 33.52177]] as [LngLatLike, LngLatLike]
            },
            {
              title: '糸島市',
              action: 'chevron_right',
              append: false,
              lnglat: [[130.20705, 33.5375], [130.20705, 33.5375]] as [LngLatLike, LngLatLike]
            }
          ]
        }
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

  get contractData() {
    return mapModule.contractData;
  }

  get targetGeoJsonData() {
    return mapModule.targetGeoJsonData;
  }

  @Watch('contractData')
  private onContractData() {
    mapModule.updateTargetGeoJsonData(mapService.getTargetArea(mapModule.geoJsonData, undefined , this.contractData));
    this.onReSouce({lnglat: [this.contractData.results.lnglat, this.contractData.results.lnglat], zoom: 10, padding: 180});
    if (this.map.getLayer('contract-heat')) {
      this.map.removeLayer('contract-heat');
    }
    if (this.map.getLayer('contract-point')) {
      this.map.removeLayer('contract-point');
    }
    this.addHeatMapLayer(this.tscope);
  }

  @Watch('targetGeoJsonData')
  private onTargetGeoJsonData() {
  //  console.log('onTargetGeoJsonData mapModule.targetGeoJsonData-- ', mapModule.targetGeoJsonData);
  }

  private onReSouce(param: {lnglat: [LngLatLike, LngLatLike], zoom: number, padding: number}) {
    if (param.lnglat) {
      const statesSource: mapboxgl.GeoJSONSource = this.map.getSource('states') as mapboxgl.GeoJSONSource;
      const meshdataSource: mapboxgl.GeoJSONSource = this.map.getSource('meshdata') as mapboxgl.GeoJSONSource;
      const contractSource: mapboxgl.GeoJSONSource = this.map.getSource('contract') as mapboxgl.GeoJSONSource;
      statesSource.setData(mapModule.targetGeoJsonData as unknown as FeatureCollection);
      meshdataSource.setData(mapModule.targetGeoJsonData as unknown as FeatureCollection);
      contractSource.setData(mapModule.targetGeoJsonData as unknown as FeatureCollection);
      this.map.fitBounds(param.lnglat as unknown as [LngLatLike, LngLatLike], {
        padding: param.padding,
        maxZoom: param.zoom
      });
    }
  }

  private async onMapLoaded(t: {map: Map, component: Vue}, onStyleDataLoading?: boolean) {
    this.tscope = t;
    t.map.addControl(
      new MapboxLanguage({
        defaultLanguage: 'ja'
      })
    );
    // console.log(t, 'mapModule.targetGeoJsonData-- ', mapModule.targetGeoJsonData, mapModule.contractData);
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

    if (!t.map.getSource('contract')) {
      // ヒートマップ
      t.map.addSource(
        'contract', {
          'type': 'geojson',
          'data': mapModule.targetGeoJsonData as unknown as FeatureCollection
        }
      );
      if (onStyleDataLoading) {
        this.addHeatMapLayer(t);
      }
    }

    appModule.stopLoading();
  }

  private async onStyleDataLoading(t: {map: Map, component: Vue, state: boolean}) {
    this.tscope = t;
    // mapModule.updateTargetGeoJsonData(mapService.getTargetArea(mapModule.geoJsonData, {ken: '福岡県', gst: '福岡市' }));
    setTimeout(() => {
      this.onMapLoaded(t, true);
    }, 600);
  }

  private onMapZoomed(t: {map: Map, component: Vue}) {
    this.tscope = t;
    // 現在のズームレベル取得
    if (this.isBorderZoom !== t.map.getZoom() >= 13) {
      if (t.map.getZoom() >= 13) {
        // this.addHeatMapLayer(t);
        // this.addMeshdataLayer(t);
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
          /*
          if (t.map.getLayer('2DmeshLayer')) {
            t.map.removeLayer('2DmeshLayer');
          }
          */
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

  private addHeatMapLayer(t: {map: Map, component: Vue}) {
    t.map.addLayer(
      {
        'id': 'contract-heat',
        'type': 'heatmap',
        'source': 'contract',
        'maxzoom': 20,
        'paint': {
          // Increase the heatmap weight based on frequency and property contractnitude
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'contract'],
            0, 0,
            1000, 1
          ],
          // Increase the heatmap color weight weight by zoom level
          // heatmap-intensity is a multiplier on top of heatmap-weight
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 1,
            5, 13
          ],
          // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
          // Begin color ramp at 0-stop with a 0-transparancy color
          // to create a blur-like effect.
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(33,102,172,0)',
            0.2,
            'rgb(103,169,207)',
            0.4,
            'rgb(209,229,240)',
            0.6,
            'rgb(253,219,199)',
            0.8,
            'rgb(239,138,98)',
            1,
            'rgb(178,24,43)'
          ],
          // Adjust the heatmap radius by zoom level
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 2,
            3, 20
          ],
          // Transition from heatmap to circle layer by zoom level
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 1,
            10, 2
          ]
        }
      },
      'waterway-label'
    );

    t.map.addLayer(
      {
        'id': 'contract-point',
        'type': 'circle',
        'source': 'contract',
        'minzoom': 10,
        'paint': {
          // Size circle radius by earthquake contractnitude and zoom level
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7,
            ['interpolate', ['linear'], ['get', 'contract'], 0, 1, 1000, 2],
            13,
            ['interpolate', ['linear'], ['get', 'contract'], 0, 5, 1000, 10]
          ],
          // Color circle by earthquake contractnitude
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'contract'],
            0,
            'rgba(33,102,172,0)',
            200,
            'rgb(103,169,207)',
            400,
            'rgb(209,229,240)',
            600,
            'rgb(253,219,199)',
            800,
            'rgb(239,138,98)',
            1000,
            'rgb(178,24,43)'
          ],
          'circle-stroke-color': 'white',
          'circle-stroke-width': 1,
          // Transition from heatmap to circle layer by zoom level
          'circle-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 0,
            8, 16
          ]
        }
      },
      'waterway-label'
    );
  }

  private async onAreaSelect(ken: {title: string, lnglat?: number[], style?: string[], type?: string}) {
    switch (ken.type) {
      case 'contract':
        await mapModule.requestShareMapContractInfo('data/sharemap/contract.json');
        break;
      case 'category':
        break;
      case 'history':
        break;
    }
    if (ken.style) {
      this.map.setStyle('mapbox://styles/mapbox/' + ken.style);
    }
  }

  private async onGrandchildAreaSelect(
    gst: {title: string, lnglat?: number[], style?: string[]},
    ken: {title: string, lnglat?: number[], style?: string[]}
  ) {
    mapModule.updateTargetGeoJsonData(mapService.getTargetArea(mapModule.geoJsonData, {ken: ken.title, gst: gst.title }));
    this.onReSouce({lnglat: gst.lnglat as unknown as [LngLatLike, LngLatLike], zoom: 10, padding: 180});
    if (this.map.getLayer('contract-heat')) {
      this.map.removeLayer('contract-heat');
    }
    if (this.map.getLayer('contract-point')) {
      this.map.removeLayer('contract-point');
    }
  }

  private async onGreatGrandchildAreaSelect(
    css: {title: string, lnglat?: number[], style?: string[]},
    gst: {title: string, lnglat?: number[], style?: string[]},
    ken: {title: string, lnglat?: number[], style?: string[]}
  ) {
    mapModule.updateTargetGeoJsonData(mapService.getTargetArea(mapModule.geoJsonData, {ken: ken.title, gst: gst.title, css: css.title}));
    this.onReSouce({lnglat: css.lnglat as unknown as [LngLatLike, LngLatLike], zoom: 12, padding: 180});
    if (this.map.getLayer('contract-heat')) {
      this.map.removeLayer('contract-heat');
    }
    if (this.map.getLayer('contract-point')) {
      this.map.removeLayer('contract-point');
    }
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
