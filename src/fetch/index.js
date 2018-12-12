import ready from '../ready';
import { isIOS, mergeUrl, ResolveWrapper, RejectWrapper } from '../utils';
import { online, boundary } from '../../config';

const fetchSubstitute = {
  fetch(data) {
    let params = {
        type: data.method,
        url: data.url,
        header: data.headers,
        rawData: data.body
    };
    return this.sendRequest(params);
  },
  sendRequest(params) {
      return ready().then(function() {
          return new Promise(function(resolve, reject) {
              WMApp.kernel.invoke('sendRequest', params, function (data) {
                  if (data.status && data.result && parseInt(data.result.statusCode, 10) === 200) {
                      let r = decodeURIComponent(data.result.responseBody);
                      if (r.indexOf(boundary) === 0) {
                          r = r.split(boundary)[1]
                      }
                      data.result.responseBody = r;
                      console.info('response', data)
                      ResolveWrapper(resolve, data)
                  } else {
                      let info = '数据传输失败，请重试'
                      console.info(info);
                      RejectWrapper(reject, info)
                  }
              })
          })
      })
  },
  makeResponse(response) {
    let init, resp;
    if (response.status == '1') {
      init = { "status" : 200 , "statusText" : "OK" };
      resp = new Response(response.result.responseBody, init);
    } else {
      init = { "status" : 200 , "statusText" : "OK" };
      resp = new Response(response.result.responseBody, init);
    }
    return resp;
  }
}

export default fetchSubstitute;
