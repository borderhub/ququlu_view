export interface GUIUserRes {
  user_id: string;
  user_name: string; //  表示用のユーザ名
  initial: string;   // イニシャル
  type: string; // ユーザータイプ
  apiToken: string; // ユーザータイプ
  csrfHeaderName: string; // POSTする際のCSRFトークンヘッダ名
  csrfToken: string; // POSTする際のCSRFトークン値
  tokenExpire: string; // トークン期限日
  authToken: string; // Authトークン
}

export interface GetUserInfoRes {
  result: GUIUserRes; // ユーザ情報
}
