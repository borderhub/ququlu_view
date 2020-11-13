import { Feature, FeatureCollection, Geometry, GeoJsonProperties, GeoJsonTypes, GeoJsonObject } from 'geojson';

export interface PropertiesInterface {
  AREA: string;
  AREA_MAX_F: string;
  CITY: string;
  CSS_NAME: string;
  DUMMY1: string;
  GST_NAME?: string;
  H27KA40_: number;
  H27KA40_ID: number;
  HCODE: number;
  JINKO: number;
  KBSUM: number;
  KCODE1: string;
  KEN: string;
  KEN_NAME: string;
  KEYCODE1: string | null;
  KEYCODE2: string | null;
  KEY_CODE: string | null;
  KIGO_D: string | null;
  KIGO_E: string | null;
  KIGO_I: string | null;
  KIHON1: string | null;
  KIHON2: string | null;
  MOJI: string | null;
  N_CITY: string | null;
  N_KEN: string | null;
  PERIMETER: string | null;
  SETAI: number;
  SITYO_NAME: string | null;
  X_CODE: number;
  Y_CODE: number;
}

export interface GeometryInterface {
  type: GeoJsonTypes;
  coordinates: number[];
}

export interface GGJIFuturesRes {
  id?: number;
  mag?: number;
  geometry: GeometryInterface;
  properties: PropertiesInterface;
  type: GeoJsonTypes;
}

export interface CrsInterface {
  properties: {name: string};
  type: GeoJsonTypes;
}

export interface GetGeoJsonInfoRes extends GeoJsonObject {
  crs: CrsInterface;
  features: FeatureCollection; // ユーザ情報
  type: GeoJsonTypes;
}
