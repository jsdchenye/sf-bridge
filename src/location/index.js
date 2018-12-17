import ready from '../ready';
import { AsynHack, ResolveWrapper } from '../utils';
import { GLOBAL_NAME } from '../constants';

// 定位相关
const location = {
  getRealTimeLocation() {
    return ready().then(function () {
      let loc = window[GLOBAL_NAME].location.getSyncLocation();
      AsynHack();

      if (loc.lng && loc.lat) {
          return loc;
      }

      return new Promise(function (resolve, reject) {
          window[GLOBAL_NAME].location.getAsyncLocation(function (locAsync) {
            ResolveWrapper(resolve, locAsync);
          });
      });
    });
  }
}

export default location;
