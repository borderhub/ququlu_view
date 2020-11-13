export const GlobalConstants = {
  Viewer: {
    HEADER_HEIGHT: 48,
    MIN_WIDTH: 250,
    MIN_HEIGHT: 250
  },
  API: {
    AUTH_TOKEN_NAME: 'x-token'
  },
  IMAGE: {
    QUALITY: 0.6,
    CONVERTSIZE: 1000000
  },
  MENU: [
    { TITLE: 'カレンダー', ROUTE: 'calender', ADMIN: false },
    { TITLE: 'シェア率マップ', ROUTE: 'sharemap', ADMIN: false }
  ],
  TEXT: {
    HOME: 'トップ',
    ARROW: '承認',
    DEARROW: '未承認',
    FEEDBACK: '差戻',
    PUBLIC: '公開',
    LOADING: '読み込み中...',
    NEWPOST: '新規投稿',
    EDIT: '編集',
    SAVE: '記事の保存',
    PREVIEW: 'プレビュー',
    SHOWPREVIEW: 'プレビュー表示',
    COMMENT: 'コメント',
    CREATE: '作成',
    DELETE: '削除',
    DELETECONFIRMATION: 'この記事を削除してもよろしいでしょうか？',
    NOTFOUND: '投稿が見つかりません',
    ERROR: 'エラー',
    SAVECONFIRMATION: '保存すると承認待ちの状態となり、許可又は差し戻しとなります。',
    ALLOWCONFIRMATION: '許可をすると公開の状態となります。',
    FEEDBACKCONFIRMATION: '差戻をすると差戻の状態となります。',
    CAUTIONFEEDBACK: '差戻しコメントを残したい場合は、下記の差戻ボタンを押下してください',
    ISSAVE: '保存しますか？',
    CONFIRM: '確定',
    CANCEL: 'キャンセル',
    CREATED: '作成日',
    SEARCH: '検索',
    MAXLENGTH: {
      VALUE: 25,
      HINT: '２５文字まで',
      LABEL: '制限された文字数以内で入力下さい'
    },
    USERID: 'ID',
    USERNAME: '氏名'
  }
};
