import ready from '../ready';
import { AsynHack } from '../utils';

// 跳转到不同的NA页面
const page = {
     /**
     * 关闭WebView
     */
    close() {
        return ready().then(window.WMApp.page.closePage);
    },
    /**
     * 打开WebView
     * @param {*} url 
     * @param {*} onBack 
     */
    open(url, onBack) {
        if (url.indexOf('bdwm://') !== 0) {
            // header=1 是白色头部，注意兼容
            let header = 1;
            url = 'bdwm://native?pageName=webview&url=' + encodeURIComponent(url) + '&header=' + header;
        }
        window.location.href = url;
    },
    onBack(onBackHandler) {
        return ready().then(function () {
            window.WMApp.entry.setPageAction('onBack', onBackHandler);
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

            window.WMApp.kernel.globalWebInvoke(params);
        }else {
            window.WMApp.kernel.globalAppInvoke(params);
        }
    },
    changePageForResult: function (params, callback) {
        if (typeof callback === "function" && params && params.openUrl) {
            window.WMApp.kernel.invoke('changePageForResult', params, callback);
        }else {
            console.log('callback is required');
        }
    },
    setPageForResult: function (params) {
        kernel.invoke('setPageForResult', params || {});
    },
}

export default page;
