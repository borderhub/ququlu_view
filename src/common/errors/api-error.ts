import appModule from '@/model/store/modules/app-module';

// TODO: 適切なErrorメッセージ
export class ApiError implements Error {
  public name: string = 'APIError';
  public message: string = 'サーバーとの通信でエラーが発生しました。';
  public status: number = 0;
  public toString(): string {
   return this.name + ': ' + this.message;
  }
  constructor(name?: string, message?: string, status?: number) {
    this.name = name ? name : this.name;
    this.message = message ? message : this.message;
    this.status = status ? status : this.status;
    const param = {
      state: true,
      title: this.name,
      message: this.message,
      status: this.status
    };
    appModule.updateIsError(param);
  }
}
