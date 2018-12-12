import ready from '../ready';
import { CommonCallback, RejectWrapper, ResolveWrapper } from '../utils';

const account = {
    login() {
        return ready().then(function () {
            return new Promise((resolve, reject) => {
                window.WMApp.account.login((data) => CommonCallback(resolve, reject, data));
            });
        });
    },
    getLoginInfo() {
        return ready().then(function () {
            return new Promise((resolve, reject) => {
                window.WMApp.account.getUserInfo(function (data) {
                    let r = data.result || {};
                    if (data.status) {
                        ResolveWrapper(resolve, r.userInfo);
                    }
                    else {
                        RejectWrapper(reject, r.errorInfo);
                    }
                });
            });
        })
    }
}

export default account;
