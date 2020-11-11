import {Module, VuexModule, Mutation, Action, getModule, MutationAction} from 'vuex-module-decorators';
import store from '@/model/store/store';
import api from '@/model/api';
import {UserDataOnSessionStorageDataInterface, UserDataOnSessionStorageInterface} from '@/model/interfaces/user-interface';
import userService from '@/model/services/user-service';
import appModule from '@/model/store/modules/app-module';

@Module({dynamic: true, store, namespaced: true, name: 'userModule'})
class UserModule extends VuexModule {

  private strageData: UserDataOnSessionStorageInterface = JSON.parse(sessionStorage.getItem('lgc') || '{}');
  // States
  public userId: string = JSON.stringify(this.strageData) !== '{}' ? this.strageData.userModule.userId : ''; // ユーザー名
  public userName: string = JSON.stringify(this.strageData) !== '{}' ? this.strageData.userModule.userName : ''; // ユーザー名
  public type: string = JSON.stringify(this.strageData) !== '{}' ? this.strageData.userModule.type : ''; // ユーザータイプ
  public apiToken: string = JSON.stringify(this.strageData) !== '{}' ? this.strageData.userModule.apiToken : ''; // CSRFのToken名
  public csrfHeaderName: string = JSON.stringify(this.strageData) !== '{}' ? this.strageData.userModule.csrfHeaderName : ''; // CSRFのToken名
  public csrfToken: string = JSON.stringify(this.strageData) !== '{}' ? this.strageData.userModule.csrfToken : ''; // CSRFトークン
  public tokenExpire: string = JSON.stringify(this.strageData) !== '{}' ? this.strageData.userModule.tokenExpire : ''; // トークン期限日
  public authToken: string = JSON.stringify(this.strageData) !== '{}' ? this.strageData.userModule.authToken : ''; // Authトークン
  public isStrage: boolean = false;

  // Mutations
  @Mutation
  private setUserId(userId: string): void {
    this.userId = userId;
  }

  @Mutation
  private setName(name: string): void {
    this.userName = name;
  }

  @Mutation
  private setType(type: string): void {
    this.type = type;
  }

  @Mutation
  private setApiToken(apiToken: string): void {
    this.apiToken = apiToken;
  }

  @Mutation
  private setCSRFHeaderName(csrfHeaderName: string): void {
    this.csrfHeaderName = csrfHeaderName;
  }

  @Mutation
  private setCSRFToken(csrfToken: string): void {
    this.csrfToken = csrfToken;
  }

  @Mutation
  private setTokenExpire(tokenExpire: string): void {
    this.tokenExpire = tokenExpire;
  }

  @Mutation
  private setAuthToken(authToken: string): void {
    this.authToken = authToken;
  }

  @Mutation
  private setClearStrage(): void {
    this.tokenExpire = '';
    this.csrfToken = '';
    this.apiToken = '';
    this.type = '';
    this.userName = '';
    this.userId = '';
    this.csrfHeaderName = '';
    this.authToken = '';
  }

  @Mutation
  private setIsStrage(state: boolean): void {
    this.isStrage = state;
  }

  // Actions
  @Action
  public clearStrage(): void {
    this.setClearStrage();
  }

  @Action
  public updateIsStrage(state: boolean): void {
    this.setIsStrage(state);
  }

  @Action
  public updateApiToken(token: string): void {
    this.setApiToken(token);
  }

  /**
   * ユーザー情報をリクエスト
   */
  @MutationAction({
    rawError: true,
    mutate: [
      'userId',
      'userName',
      'type',
      'apiToken',
      'csrfHeaderName',
      'csrfToken',
      'tokenExpire',
      'authToken']
  })
  public async requestUserInfo() {
    try {
      const res = await api.getUserInfo();
      return {
        userId: res.result.user_id,
        userName: res.result.user_name,
        type: res.result.type,
        apiToken: res.result.apiToken,
        csrfHeaderName: res.result.csrfHeaderName,
        csrfToken: res.result.csrfToken,
        tokenExpire: res.result.tokenExpire,
        authToken: appModule.token
      };
    } catch (err) {
      throw err;
    }
  }
}

export default getModule(UserModule, store);
