export interface UserDataOnSessionStorageDataInterface {
  // States
  userId: string;
  userName: string; // ユーザー名
  type: string; // ユーザータイプ
  apiToken: string; // token
  csrfHeaderName: string; // CSRFのToken名
  csrfToken: string; // CSRFトークン
  tokenExpire: string; // トークン期限日
  authToken: string;
}

export interface AppDataOnSessionStorageDataInterface {
  // States
  token: string; // token
}

export interface UserDataOnSessionStorageInterface {
  // States
  userModule: UserDataOnSessionStorageDataInterface;
  appModule: AppDataOnSessionStorageDataInterface;
}
