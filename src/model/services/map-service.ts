import {GetGeoJsonInfoRes, GGJIFuturesRes, PropertiesInterface} from '@/model/dto/res/geojson/get-geojson-info-res';
import mapModule from '@/model/store/modules/map-module';
import {GlobalAuthority, AuthorityNum} from '@/common/authority';
import { Feature, FeatureCollection, Geometry, GeoJsonProperties, GeoJsonTypes } from 'geojson';
import _ from 'lodash';

class MapService {

  /*
   * 指定した市区町村を取得
   * geo: geojson形式
   */
  public getTargetArea(geo: GetGeoJsonInfoRes, searchKey: string): GetGeoJsonInfoRes {
    const data = _(geo)
    .map((features: GGJIFuturesRes[]) => {
      return _.filter(features, (v: GGJIFuturesRes, key: number) => {
        const condition = v.properties?.GST_NAME && v.properties.GST_NAME === searchKey;
        if (condition) { v.id = key; }
        return condition;
      });
    })
    .value();
    const d = _.reject(data, _.isEmpty) as unknown as GGJIFuturesRes[];
    return {
      type: geo.type,
      crs: geo.crs,
      features: d[0] as unknown as FeatureCollection
    };
  }

  // エラーの伝搬
  private errorPropagation(err: Error): Error {
    return err;
  }

}

export default new MapService();
