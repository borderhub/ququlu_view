import {GlobalConstants} from '@/common/constants';

class ViewerService {

  public getUserAgent(): string {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('iphone') !== -1) {
        return 'iphone';
    } else if (userAgent.indexOf('ipad') !== -1) {
        return 'ipad';
    } else if (userAgent.indexOf('android') !== -1) {
        if (userAgent.indexOf('mobile') !== -1) {
            return 'android_mobile';
        } else {
            return 'android_tablet';
        }
    } else {
      return 'pc';
    }
  }

  public getNowYMD() {
    const dt = new Date();
    const y = dt.getFullYear();
    const m = ('00' + (dt.getMonth() + 1)).slice(-2);
    const d = ('00' + dt.getDate()).slice(-2);
    const result = y + '/' + m + '/' + d;
    return result;
  }

}

export default new ViewerService();
