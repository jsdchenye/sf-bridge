import ready from '../ready';
import monitor from './monitor'; // 添加监控
import { isIOS, mergeUrl, ResolveWrapper, RejectWrapper } from '../utils';
import { GLOBAL_NAME, boundary } from '../../config';

const network = {
    setHost(host) {
        window.__NA_BRIDGE_HOST__ = host;
    },
    /**
     * NA代理发送get请求
     * @param {*} url 为相对路径即可，手动拼接为online+url
     * @param {*} params  可选
     * @param {*} headers 可选 
     */
    get(url, userParams, headers) {
        return ready().then(() => {
            if (isIOS()) {
                for (let key in userParams) {
                    if (userParams.hasOwnProperty(key)) {
                        userParams[key] = encodeURIComponent(userParams[key]);
                    }
                }
            }
            let params = {
                type: 'GET',
                url: mergeUrl( window.__NA_BRIDGE_HOST__ + url, userParams)
            };

            if (headers) {
                params.headers = headers;
            }
            return network.sendRequest(params);
        }
    )},
    /**
     * NA代理发送post请求
     * @param {*} url 为相对路径即可，手动拼接为online+url
     * @param {*} params  可选
     * @param {*} headers 可选 
     */
    post(url, userParams, headers) {
        return ready().then(() => {
            let query = [];
            for (let key in userParams) {
                if (userParams.hasOwnProperty(key)) {
                    query.push(key + '=' + encodeURIComponent(userParams[key]));
                }
            }
            let params = {
                type: 'POST',
                url: window.__NA_BRIDGE_HOST__ + url,
                contentType: 'application/x-www-form-urlencoded',
                httpBody: query.join('&')
            };

            if (headers) {
                params.headers = headers;
            }
            return network.sendRequest(params);
        })
    },
    /**
     * 原始请求，当get、post无法满足需求时请使用此请求；
     * @param {*} params 
     */
    sendRequest(params) {
        return ready().then(function() {
            return new Promise(function(resolve, reject) {
                window[GLOBAL_NAME].kernel.invoke('sendRequest', params, function (data) {
                    console.log(data);
                    monitor(params, data);
                    if (data.status && data.result && parseInt(data.result.statusCode, 10) === 200) {
                        // 由于端上未进行encode操作，此处做出对应的修改；
                        // let r = decodeURIComponent(data.result.responseBody);
                        let r = data.result.responseBody;
                        if (r.indexOf(boundary) === 0) {
                            r = r.split(boundary)[1]
                        }
                        console.info('response', r)
                        try {
                            const responseJson = JSON.parse(r);
                            ResolveWrapper(resolve, responseJson);
                        } catch (error) {
                            ResolveWrapper(resolve, r);
                        }
                    } else {
                        let info = '数据传输失败，请重试'
                        console.info(info);
                        RejectWrapper(reject, info)
                    }
                })
            })
        })
    }
};

export default network;
