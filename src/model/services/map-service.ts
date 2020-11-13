import {GetGeoJsonInfoRes, GGJIFuturesRes, PropertiesInterface} from '@/model/dto/res/geojson/get-geojson-info-res';
import {GetShareMapInfoRes, GSMIInterface, GSMIPropertiesInterface} from '@/model/dto/res/sharemap/get-sharemap-info-res';
import mapModule from '@/model/store/modules/map-module';
import {GlobalAuthority, AuthorityNum} from '@/common/authority';
import { Feature, FeatureCollection, Geometry, GeoJsonProperties, GeoJsonTypes } from 'geojson';
import _ from 'lodash';

class MapService {

  /*
   * 指定した市区町村を取得
   * geo: geojson形式
   */
  public getTargetArea(geo: GetGeoJsonInfoRes, searchKey?: {ken?: string, gst?: string, css?: string}, targetData?: GetShareMapInfoRes): GetGeoJsonInfoRes {
    const chackTargetData = (properties: PropertiesInterface): GSMIPropertiesInterface[] => {
      const result = _(targetData?.results)
      .map((property: GSMIPropertiesInterface[]) => {
        return _.filter(property, (v: GSMIPropertiesInterface, key: number) => {
          const condition = (properties?.KEN_NAME === targetData?.results.kenName) as boolean &&
            (properties?.GST_NAME === v.gstName) as boolean &&
            (properties?.CSS_NAME === v.cssName) as boolean &&
            (properties?.MOJI === v.moji) as boolean;
          return condition;
        });
      })
      .value();
      return result as unknown as GSMIPropertiesInterface[];
    };
    const data = _(geo)
    .map((features: GGJIFuturesRes[]) => {
      return _.filter(features, (v: GGJIFuturesRes, key: number) => {
        let condition = false;
        if (searchKey?.ken && searchKey?.gst && searchKey?.css && !targetData) {
          condition =
          (v.properties?.KEN_NAME && v.properties?.KEN_NAME === searchKey?.ken) as boolean &&
          (v.properties?.GST_NAME && v.properties?.GST_NAME === searchKey?.gst) as boolean &&
          (v.properties?.CSS_NAME && v.properties?.CSS_NAME === searchKey?.css) as boolean;
        } else if (searchKey?.ken && searchKey?.gst && !searchKey?.css && !targetData) {
          condition =
          (v.properties?.KEN_NAME && v.properties?.KEN_NAME === searchKey?.ken) as boolean &&
          (v.properties?.GST_NAME && v.properties?.GST_NAME === searchKey?.gst) as boolean;
        } else if (searchKey?.ken && !searchKey?.gst && !searchKey?.css && !targetData) {
          condition = (v.properties?.KEN_NAME && v.properties?.KEN_NAME === searchKey?.ken) as boolean;
        } else {
          const checkData = _.reject(chackTargetData(v.properties), _.isEmpty);
          condition = checkData.length > 0;
          if (checkData.length > 0) {
            const cd = checkData[0] as unknown as GSMIPropertiesInterface[];
            if (cd[0].contract) { v.properties.contract = cd[0].contract; }
          }
        }
        if (condition) {
          v.id = key;
        }
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
