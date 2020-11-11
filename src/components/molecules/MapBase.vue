<template>
  <v-row>
    <v-card
     id="map"
     flat
     :width="width"
     :height="height"
    />
    <slot />
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Prop, Provide, Emit, Watch } from 'vue-property-decorator';
import mapboxgl, { Map, MapboxOptions, MapboxGeoJSONFeature, MarkerOptions, LngLat, LngLatLike } from 'mapbox-gl';
import { MapboxOptionsInterface } from '@/model/interfaces/map-interface';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import * as MapboxLanguage from '@mapbox/mapbox-gl-language';
import {HTMLElementEvent} from '@/model/interfaces/extends-interface';
import _ from 'lodash';

@Component({})
export default class MapBase extends Vue {

  private map: Map = {} as Map;
  private mapEvent: {features?: MapboxGeoJSONFeature[]} = {} as {features?: MapboxGeoJSONFeature[]};
  @Prop({default: () => ({ accessToken: process.env.VUE_APP_MAPBOX_ACCESSTOKEN })}) public options!: MapboxOptions;
  @Prop({default: 100}) public width!: number;
  @Prop({default: 100}) public height!: number;
  private hoveredStateId: number | null = null;
  private initial: boolean = true;
  private initialized: boolean = false;

  private async mounted() {
    this.map = new mapboxgl.Map(this.options);
    this.map.addControl(
      new MapboxLanguage({
        defaultLanguage: 'ja'
      })
    );

    this.map.on('load', () => {
      this.initial = false;
      this.initialized = true;
      this.mapLoaded();
    });

    this.map.on('click', 'state-fills', (e: {features?: MapboxGeoJSONFeature[]}) => {
      this.mapEvent = e;
      this.clicked();
    });

    this.map.on('mousemove', 'state-fills', (e: {features?: MapboxGeoJSONFeature[]}) => {
      this.mapEvent = e;
      this.mouseMoved();
    });

    this.map.on('mouseleave', 'state-fills', () => {
      this.mouseLeaved();
    });

    this.map.on('zoom', () => {
      this.mapZoomed();
    });

  }

  @Emit('mapLoaded')
  public mapLoaded() {
    return {
      map: this.map,
      component: this
    };
  }

  @Emit('clicked')
  public clicked() {
    return {
      e: this.mapEvent,
      map: this.map,
      component: this
    };
  }

  @Emit('mouseMoved')
  public mouseMoved() {
    return {
      e: this.mapEvent,
      map: this.map,
      component: this
    };
  }

  @Emit('mouseLeaved')
  public mouseLeaved() {
    return {
      map: this.map,
      component: this
    };
  }

  @Emit('mapZoomed')
  public mapZoomed() {
    return {
      map: this.map,
      component: this
    };
  }

  @Watch('mapStyle')
  public onMapStyleChanged(nextStyle: string, prev: string) {
    if (nextStyle !== prev) {
      (this.map as mapboxgl.Map).setStyle(nextStyle);
    }
  }

  @Provide('handlemap')
  public handlemap(found: (map: mapboxgl.Map) => void) {
    const vm = this;
    const checkForMap = () => {
      if (vm.map) {
        found(vm.map);
      } else {
        // waiting for map load
        setTimeout(checkForMap, 50);
      }
    };
    checkForMap();
  }

  public addMarker() {
    const marker = new mapboxgl.Marker({
      draggable: true
    })
      .setLngLat(this.options.center as mapboxgl.LngLatLike)
      .addTo(this.map as mapboxgl.Map);
  }
}
</script>

<style lang="scss" scoped>
#map {
  width: 100%;
  height: 500px;
}
</style>
