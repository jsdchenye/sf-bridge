import ready from '../ready';
import { AsynHack, ResolveWrapper } from '../utils';

// 定位相关
const location = {
  getRealTimeLocation() {
    return ready().then(function () {
      let loc = window.WMApp.location.getSyncLocation();
      AsynHack();

      if (loc.lng && loc.lat) {
          return loc;
      }

      return new Promise(function (resolve, reject) {
          window.WMApp.location.getAsyncLocation(function (locAsync) {
            ResolveWrapper(resolve, locAsync);
          });
      });
    });
  }
}

export default location;
