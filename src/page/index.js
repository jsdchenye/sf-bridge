import ready from '../ready';
import { AsynHack } from '../utils';
import { SCHEME_NAME, GLOBAL_NAME } from '../../config';

// 跳转到不同的NA页面
const page = {
     /**
     * 关闭WebView
     */
    close() {
        return ready().then(window[GLOBAL_NAME].page.closePage);
    },
    /**
     * 打开WebView
     * @param {*} url 
     * @param {*} onBack 
     */
    open(url, onBack) {
        if (url.indexOf(`${SCHEME_NAME}://`) !== 0) {
            // header=1 是白色头部，注意兼容
            let header = 1;
            url = `${SCHEME_NAME}://native?pageName=webview&url=${encodeURIComponent(url)}&header=' + ${header}`;
        }
        window.location.href = url;
    },
    onBack(onBackHandler) {
        return ready().then(function () {
            window[GLOBAL_NAME].entry.setPageAction('onBack', onBackHandler);
            AsynHack();
        });
    },
    setTitle() {

    },
    changePage: function (params) {
        var pageParams = params.pageParams;

        if (params.pageName == 'webview' && pageParams && pageParams.url) {
            if (pageParams.pageData) {
                pageParams.pageData = JSON.stringify(pageParams.pageData);
            }

            window[GLOBAL_NAME].kernel.globalWebInvoke(params);
        }else {
            window[GLOBAL_NAME].kernel.globalAppInvoke(params);
        }
    },
    changePageForResult: function (params, callback) {
        if (typeof callback === "function" && params && params.openUrl) {
            window[GLOBAL_NAME].kernel.invoke('changePageForResult', params, callback);
        }else {
            console.log('callback is required');
        }
    },
    setPageForResult: function (params) {
        kernel.invoke('setPageForResult', params || {});
    },
}

export default page;
