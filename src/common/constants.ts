export const GlobalConstants = {
  Viewer: {
    HEADER_HEIGHT: 48,
    MIN_WIDTH: 250,
    MIN_HEIGHT: 250
  },
  LGCAPI: {
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
    USERNAME: '氏名',
    VOTE: {
      TEXT: 'いいね'
    },
    ACCOUNT: {
      TITLE: 'アカウント情報'
    },
    POSTCOUNTMANAGE: {
      TITLE: '投稿数管理',
      SEARCHKEYWORDLABEL: '氏名またはユーザーIDで絞り込み',
      REFINE: '絞り込み'
    },
    CATEGORYMANAGE: {
      TITLE: 'カテゴリ管理',
      LABEL: '名称',
      KEY: 'キー',
      MIN: {VALUE: 3, TEXT: '３文字以上'},
      MAX: {VALUE: 50, TEXT: '50文字以内'},
      REQUIRED: '必須',
      UNIQ: '一意の値にしてください',
      REGEX: 'アルファベットで記入ください',
      SAVECONFIRMATION: '変更したカテゴリーを保存しますか？',
    },
    DIGITALBADGE: {
      NAME: '氏名',
      GETBADGE: '取得したバッジ',
      BADGETYPE: 'バッジの種類',
      CONTENTS: '内容',
      PUBLISH: '記事公開数',
      COOL: 'いいね数',
      POSTS: '投稿数',
      SRC: 'badge/icons',
      STATUS: {
        PUBLISH: {
          BRONZE : '10件の記事が公開されました。次は30件です。',
          SILVER : '30件の記事が公開されました。次は100件です。',
          GOLD : '100件の記事が公開されました。',
          NONE : '獲得したバッジはありません'
        },
        COOL: {
          BRONZE : '記事に対し10件のいいねをされました。次は30件です。',
          SILVER : '記事に対し30件のいいねをされました。次は100件です。',
          GOLD : '記事に対し100件のいいねをされました。',
          NONE : '獲得したバッジはありません'
        },
        POSTS: {
          BRONZE : '10件の記事が投稿されました。次は30件です。',
          SILVER : '30件の記事が投稿されました。次は100件です。',
          GOLD : '100件の記事が投稿されました。',
          NONE : '獲得したバッジはありません'
        }
      }
    }
  }
};
