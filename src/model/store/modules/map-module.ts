import {Action, getModule, Module, Mutation, MutationAction, VuexModule} from 'vuex-module-decorators';
import store from '@/model/store/store';
import {GetGeoJsonInfoRes} from '@/model/dto/res/geojson/get-geojson-info-res';
import {GetShareMapInfoRes} from '@/model/dto/res/sharemap/get-sharemap-info-res';
import api from '@/model/api';

@Module({dynamic: true, store, namespaced: true, name: 'MapModule'})
class MapModule extends VuexModule {

  public upsertStatus: number = 0;
  public geoJsonData: GetGeoJsonInfoRes = {} as GetGeoJsonInfoRes;
  public targetGeoJsonData: GetGeoJsonInfoRes = {} as GetGeoJsonInfoRes;
  public contractData: GetShareMapInfoRes = {} as GetShareMapInfoRes;

  // Mutations
  @Mutation
  private setUpsertStatus(state: number) {
    this.upsertStatus = state;
  }

  @Mutation
  private setTargetGeoJsonData(state: GetGeoJsonInfoRes) {
    this.targetGeoJsonData = state;
  }

  // Actions
  @Action
  public updateUpsertStatus(state: number) {
    this.setUpsertStatus(state);
  }

  @Action
  public updateTargetGeoJsonData(state: GetGeoJsonInfoRes) {
    this.setTargetGeoJsonData(state);
  }

  // MutationAction
  /**
   * geojson情報をリクエスト
   */
  @MutationAction({
    rawError: true,
    mutate: [
      'geoJsonData']
  })
  public async requestGeoJsonInfo(path: string) {
    try {
      console.log(`requestGeoJsonInfo ${path}`);
      const res = await api.getGeoJsonInfo(path);
      return {
        geoJsonData: res
      };
    } catch (err) {
      throw err;
    }
  }

  /**
   * 契約本数情報をリクエスト
   */
  @MutationAction({
    rawError: true,
    mutate: [
      'contractData']
  })
  public async requestShareMapContractInfo(path: string) {
    try {
      console.log(`requestShareMapContractInfo ${path}`);
      const res = await api.getShareMapContractInfo(path);
      return {
        contractData: res
      };
    } catch (err) {
      throw err;
    }
  }

}

export default getModule(MapModule, store);
