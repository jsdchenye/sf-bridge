import ready from '../ready';
import { isIOS, mergeUrl, ResolveWrapper, RejectWrapper } from '../utils';
import { online, boundary } from '../../config';
import { GLOBAL_NAME } from '../constants';

const network = {
    /**
     * NA代理发送get请求
     * @param {*} url 为相对路径即可，手动拼接为online+url
     * @param {*} params 
     */
    get(url, params) {
        return ready().then(() => {
            if (isIOS) {
                for (let key in params) {
                    if (params.hasOwnProperty(key)) {
                        params[key] = encodeURIComponent(params[key]);
                    }
                }
            }
            let params = {
                type: 'GET',
                url: mergeUrl(online + url, params)
            };

            return this.sendRequest(params);
        }
    )},
    /**
     * NA代理发送get请求
     * @param {*} url 为相对路径即可，手动拼接为online+url
     * @param {*} params 
     */
    post(url, params) {
        return ready().then(() => {
            let query = [];
            for (let key in params) {
                if (params.hasOwnProperty(key)) {
                    query.push(key + '=' + encodeURIComponent(data[key]));
                }
            }
            let params = {
                type: 'POST',
                url: online + url,
                contentType: 'application/x-www-form-urlencoded',
                rawData: query.join('&')
            };

            return this.sendRequest(params);
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
                    if (data.status && data.result && parseInt(data.result.statusCode, 10) === 200) {
                        let r = decodeURIComponent(data.result.responseBody);
                        if (r.indexOf(boundary) === 0) {
                            r = r.split(boundary)[1]
                        }
                        console.info('response', r)
                        ResolveWrapper(resolve, r)
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
