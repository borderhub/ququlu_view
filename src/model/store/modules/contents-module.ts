import {Action, getModule, Module, Mutation, MutationAction, VuexModule} from 'vuex-module-decorators';
import store from '@/model/store/store';
import api from '@/model/api';

@Module({dynamic: true, store, namespaced: true, name: 'ContentsModule'})
class ContentsModule extends VuexModule {

  public contents: string = ''; // ID
  public isAside: boolean = false;
  public isEditMode: boolean = false;
  public innerWidth: number = 0;
  public innerYOffset: number = 0;
  public upsertStatus: number = 0;
  public deleteStatus: number = 0;

  // Mutations
  @Mutation
  private setContents(contents: string): void {
    this.contents = contents;
  }

  @Mutation
  private setIsAside(status: boolean): void {
    this.isAside = status;
  }

  @Mutation
  private setIsEditMode(status: boolean): void {
    this.isEditMode = status;
  }

  @Mutation
  private setInnerWidth(width: number): void {
    this.innerWidth = width;
  }

  @Mutation
  private setInnerYOffset(offset: number): void {
    this.innerYOffset = offset;
  }

  @Mutation
  private setUpsertStatus(state: number) {
    this.upsertStatus = state;
  }

  // Actions
  /**
   * コンテンツの初期化
   *
   * @param param
   */
  @Action
  public initContents(
    param: {
      contents: string
    }
  ): void {
    this.setContents(param.contents);
  }

  @Action
  public pushIsAside(
    status: boolean
  ): void {
    this.setIsAside(status);
  }

  @Action
  public pushIsEditMode(
    status: boolean
  ): void {
    this.setIsEditMode(status);
  }

  @Action
  public pushInnerWidth(
    width: number
  ): void {
    this.setInnerWidth(width);
  }

  @Action
  public pushInnerYOffset(
    offset: number
  ): void {
    this.setInnerYOffset(offset);
  }

  @Action
  public updateUpsertStatus(state: number) {
    this.setUpsertStatus(state);
  }

}

export default getModule(ContentsModule, store);
