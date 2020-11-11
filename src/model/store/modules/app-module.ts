import {Module, VuexModule, Mutation, Action, getModule, MutationAction} from 'vuex-module-decorators';
import store from '@/model/store/store';
import api from '@/model/api';
import _ from 'lodash';

@Module({dynamic: true, store, namespaced: true, name: 'appModule'})
class AppModule extends VuexModule {
  // States
  public isLoading: boolean = false as boolean; // ローディングフラグ
  public isError: { state: boolean, title?: string, message?: string, status?: number } = {state: false}; // エラーフラグ
  public token: string = ''; // 認証トークン(JWT)

  // Mutations
  @Mutation
  private setToken(token: string): void {
    // localStorage.setItem('token', token); // ローカルストレージにtokenを保存する。
    this.token = token;
  }

  @Mutation
  private setIsLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
  }

  @Mutation
  private setIsError(param: {state: boolean, title?: string, message?: string, status?: number}): void {
    this.isError = param;
  }

  // Actions
  /**
   * アプリケーション全体で用いる共通情報の初期化
   *
   * @param param
   */
  @Action
  public initApp(
    param: {
      token: string
    }
  ): void {
    this.setToken(param.token);
  }

  /**
   * ローディングスタート
   */
  @Action
  public startLoading(): void {
    this.setIsLoading(true);
  }

  /**
   * ローディングストップ
   */
  @Action
  public stopLoading(): void {
    this.setIsLoading(false);
  }

  /**
   * 認証用トークンのアップデート
   *
   * @param param
   */
  @Action
  public updateToken(
    param: {
      token: string
    }
  ) {
    this.setToken(param.token);
  }

  /**
   * apiエラー用ダイアログを表示・非表示
   */
  @Action
  public updateIsError(param: {state: boolean, title?: string, message?: string, status?: number}): void {
    this.setIsError(param);
  }

  // MutationAction

}

export default getModule(AppModule);
