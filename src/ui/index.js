import ready from '../ready';
import { CommonCallback } from '../utils';
import { GLOBAL_NAME } from '../../config';

// 调用NA的UI
const ui = {
    /**
     * 显示NA Loading
     */
    startLoading() {
        return ready().then(function() {
            return new Promise(function (resolve, reject) {
                let params = {
                    show: 1
                };
                window[GLOBAL_NAME].kernel.invoke('loading', params, (data) => CommonCallback(resolve, reject, data));
            })
        })
    },
    /**
     * 去除NA Loading
     */
    endLoading() {
        return ready().then(function() {
            return new Promise(function (resolve, reject) {
                let params = {
                    show: 0
                };
                window[GLOBAL_NAME].kernel.invoke('loading', params, (data) => CommonCallback(resolve, reject, data));
            })
        })
    },
    /**
     * 调用NA对话框
     * @param {*} title 标题
     * @param {*} content 内容
     */
    confirm(title, content) {
        return ready().then(function () {
            return new Promise(function (resolve, reject) {
                let params = {
                    title: title,
                    content: content,
                    cancelBtnText: '取消',
                    confirmBtnText: '确认'
                };
                window[GLOBAL_NAME].kernel.invoke('dialog', params, (data) => CommonCallback(resolve, reject, data));
            });
        });
    },
    /**
     * 调用NA toastr
     * @param {*} text 
     * @param {*} duration:short或long，short是2秒，long是3.5秒
     */
    toast(text, duration = 'short') {
        return ready().then(function () {
            return new Promise(function (resolve, reject) {
                let params = {
                    text: text,
                    duration: duration 
                }
                window[GLOBAL_NAME].kernel.invoke('toast', params, (data) => CommonCallback(resolve, reject, data));
            })
        });
    }
}

export default ui;
