import {Action, getModule, Module, Mutation, MutationAction, VuexModule} from 'vuex-module-decorators';
import store from '@/model/store/store';
import {GetGeoJsonInfoRes} from '@/model/dto/res/geojson/get-geojson-info-res';
import api from '@/model/api';

@Module({dynamic: true, store, namespaced: true, name: 'MapModule'})
class MapModule extends VuexModule {

  public upsertStatus: number = 0;
  public geoJsonData: GetGeoJsonInfoRes = {} as GetGeoJsonInfoRes;
  public targetGeoJsonData: GetGeoJsonInfoRes = {} as GetGeoJsonInfoRes;

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
   * ユーザー情報をリクエスト
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

}

export default getModule(MapModule, store);
