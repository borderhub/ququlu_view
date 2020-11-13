import axios from 'axios';
import {ApiError} from '@/common/errors/api-error';
import appModule from '@/model/store/modules/app-module';
import userModule from '@/model/store/modules/user-module';
import {GlobalConstants} from '@/common/constants';
import {GetUserInfoRes} from '@/model/dto/res/user/get-user-info-res';
import {GetGeoJsonInfoRes} from '@/model/dto/res/geojson/get-geojson-info-res';
import {GetShareMapInfoRes} from '@/model/dto/res/sharemap/get-sharemap-info-res';
import qs from 'qs';

class API {

  private timeout = { timeout: 10000 };

  /**
   * axiosリクエストのconfig取得
   */
  private getConfig(
    authToken: string,
    crsfTokenName?: string,
    crsfToken?: string,
    image?: boolean
  ) {
    if (!crsfTokenName) {
      return {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      };
    } else {
      if (image) {
        return {
          headers: {
            'Content-Type': 'multipart/form-data',
            'enctype': 'multipart/form-data',
            'Accept': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            [`${crsfTokenName ? crsfTokenName : ''}`]: crsfToken ? crsfToken : ''
          }
        };
      } else {
        return {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            [`${crsfTokenName ? crsfTokenName : ''}`]: crsfToken ? crsfToken : ''
          }
        };
      }

    }
  }

  /**
   * トークンの更新
   *
   * @param token
   */
  private updateToken(token: string) {
    appModule.updateToken({
      token
    });
  }

  /**
   * geoJson情報取得 スタブ
   *
   * @return {GetGeoJsonInfoRes} APIレスポンス
   * @throws {ApiError} APIに関するエラー
   *
   */
  public async getGeoJsonInfo(path: string): Promise<GetGeoJsonInfoRes> {
    const url = `${path}`;
    const config = this.getConfig(appModule.token);
    const response = await axios.get(url, config).catch(err => {
      console.log(err);
      const error = err.response?.data?.error;
      throw new ApiError(error?.name, error?.message);
    });
    this.updateToken(response.headers.hasOwnProperty(GlobalConstants.API.AUTH_TOKEN_NAME) ? response.headers[GlobalConstants.API.AUTH_TOKEN_NAME] : '');
    return response.data as GetGeoJsonInfoRes;
  }

  /**
   * シェアマップ（契約本数）情報取得 スタブ
   *
   * @return {GetShareMapInfoRes} APIレスポンス
   * @throws {ApiError} APIに関するエラー
   *
   */
  public async getShareMapContractInfo(path: string): Promise<GetShareMapInfoRes> {
    const url = `${path}`;
    const config = this.getConfig(appModule.token);
    const response = await axios.get(url, config).catch(err => {
      console.log(err);
      const error = err.response?.data?.error;
      throw new ApiError(error?.name, error?.message);
    });
    this.updateToken(response.headers.hasOwnProperty(GlobalConstants.API.AUTH_TOKEN_NAME) ? response.headers[GlobalConstants.API.AUTH_TOKEN_NAME] : '');
    return response.data as GetShareMapInfoRes;
  }

  /**
   * ユーザ情報取得
   *
   * @return {GetUserInfoRes} APIレスポンス
   * @throws {ApiError} APIに関するエラー
   *
   */
  public async getUserInfo(): Promise<GetUserInfoRes> {
    const url = `${process.env.VUE_APP_API_BASE_URL}/user/me`;
    const config = this.getConfig(appModule.token);
    const response = await axios.get(url, config).catch(err => {
      console.log(err);
      const error = err.response?.data?.error;
      throw new ApiError(error?.name, error?.message);
    });
    this.updateToken(response.headers.hasOwnProperty(GlobalConstants.API.AUTH_TOKEN_NAME) ? response.headers[GlobalConstants.API.AUTH_TOKEN_NAME] : '');
    return response.data as GetUserInfoRes;
  }

}

export default new API();
