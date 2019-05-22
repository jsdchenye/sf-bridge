import ready from '../ready';
import { ResolveWrapper, RejectWrapper } from '../utils';
import { boundary, GLOBAL_NAME } from '../../config';

const fetchSubstitute = {
  fetch(data) {
    let params = {
        type: data.method,
        url: data.url,
        header: data.headers,
        httpBody: data.body
    };
    return this.sendRequest(params);
  },
  sendRequest(params) {
      return ready().then(function() {
          return new Promise(function(resolve, reject) {
              window[GLOBAL_NAME].kernel.invoke('sendRequest', params, function (data) {
                  if (data.status && data.result && parseInt(data.result.statusCode, 10) === 200) {
                      // 由于端上未进行encode操作，此处做出对应的修改；
                      // let r = decodeURIComponent(data.result.responseBody);
                      let r = data.result.responseBody;
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
