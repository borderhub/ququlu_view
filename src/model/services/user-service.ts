import {UserDataOnSessionStorageDataInterface, UserDataOnSessionStorageInterface} from '@/model/interfaces/user-interface';
import userModule from '@/model/store/modules/user-module';
import appModule from '@/model/store/modules/app-module';
import {GlobalAuthority, AuthorityNum} from '@/common/authority';

class UserService {

  public async requestUserInfo() {
    if (sessionStorage.getItem('lgc')) {
      try {
        const strageData: UserDataOnSessionStorageInterface = JSON.parse(sessionStorage.getItem('ququlu') || '{}');
        if (!userModule.authToken || userModule.authToken !== appModule.token) {
          await userModule.requestUserInfo().catch(err => {
            this.errorPropagation(err);
          });
        } else {
          if (this.dateComparison(this.formatDate(new Date(strageData.userModule.tokenExpire).toISOString(), true), this.formatDate(new Date().toISOString(), true))) {
            if (userModule.isStrage) {
              userModule.clearStrage();
            } else {
              userModule.updateIsStrage(true);
              await userModule.requestUserInfo().catch(err => {
                this.errorPropagation(err);
              });
            }
          } else {
            if (strageData.userModule.tokenExpire === '') {
              await userModule.requestUserInfo().catch(err => {
                this.errorPropagation(err);
              });
            }
          }
        }
      } catch (err) {
        userModule.clearStrage();
        await userModule.requestUserInfo().catch(err => {
          this.errorPropagation(err);
        });
      }
    }
  }

  /*
   * 権限の番号を返す
   * Admin(管理者): 1, Instructor(教師): 2, Learner(生徒): 3
   */
  public isAuthorityNumber(str: string): number {

    const input = str.replace(/urn|lti|sysrole|ims|lis|\/|instrole|:|$/g, ''); // 余計な文字列は削っておく

    const administrators: string[] = GlobalAuthority.Admin;
    let i = administrators.length;

    const authorities: string[] = GlobalAuthority.Instructor;
    let j = authorities.length;

    // 管理者検知
    while (i--) {
      if (input.indexOf(administrators[i]) !== -1) {
        return AuthorityNum.Admin;
        break;
      }
    }

    // 教師検知
    while (j--) {
      if (input.indexOf(authorities[j]) !== -1) {
        return AuthorityNum.Instructor;
        break;
      }
    }
    // その他（生徒）
    return AuthorityNum.Learner;
  }

  /*
   * 日付のフォーマット変換
   * format: yyyy-mm-dd hh:MM:ss
   */
  public formatDate(strDate: string, isJst?: boolean, format?: string): string {
    if (strDate === null) {
      return '';
    }
    let date = '';
    // convert: string -> date
    try {
      if (typeof strDate === 'string') {
        date = isJst !== undefined ? new Date(strDate.replace(/Z$/, '-09:00')).toISOString().replace(/-/g, '/') : new Date(strDate).toISOString().replace(/-/g, '/');
      }
    } catch (e) {
      console.log(e);
    }

    // format: yyy-mm-dd hh:MM:ss
    if (date) {
      switch (format) {
        case 'yyy-mm-dd':
          date = `${date.split('T')[0]}`;
          break;
        default:
          date = `${date.split('T')[0]} ${date.split('T')[1].split('.')[0]}`;
          break;
      }
    }

    return date;
  }

  /*
   * 日付比較 (sessionの期限日と現在の日付を比較。sessionの期限日が過ぎていれば真を返す)
   */
  public dateComparison(sessiondate: string, currentdate: string): boolean {
    return (new Date(sessiondate).getTime() < new Date(currentdate).getTime()) || sessiondate === '' ? true : false;
  }

  /*
   * 名前のフォーマット変換
   * format: first name + last name -> last name + first name
   */
  public formatUserName(str: string): string {
    const arr = str.split(' ');
    let name = str;
    if (arr.length > 0) {
      name = `${arr[1]} ${arr[0]}`;
    }
    return name;
  }

  // エラーの伝搬
  private errorPropagation(err: Error): Error {
    return err;
  }

}

export default new UserService();
