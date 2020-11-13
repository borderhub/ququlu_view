import mapboxgl, { Map, MapboxOptions, MapboxGeoJSONFeature, LngLatLike, LngLat, Marker, MarkerOptions } from 'mapbox-gl';

export interface GSMIPropertiesInterface {
  gstName: string;
  cssName: string;
  moji: string;
  xCode: string;
  yCode: string;
  mag: number;
}

export interface GSMIInterface {
  ken: string;
  kenName: string;
  lnglat: LngLat;
  properties: GSMIPropertiesInterface[];
}

export interface GetShareMapInfoRes {
  results: GSMIInterface;
}
