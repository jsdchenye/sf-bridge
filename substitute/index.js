import request, { getRequest, postRequest } from "./network";

const successPromise = (data = {}) => {
  return new Promise((resolve) => {
    resolve(data);
  });
}

const appBridge =  {
  ready: successPromise,
  device: {
    info: successPromise,
    takePhoto: successPromise,
    scanBarCode: successPromise,
  }, 
  network: {
    setHost: () => {},
    get: getRequest,
    post: postRequest,
    sendRequest: (params) => request(params.url, params),
  },
  ui: {
    startLoading: successPromise,
    endLoading: successPromise,
    confirm: successPromise,
    toast: successPromise,
  },
}

export default appBridge;