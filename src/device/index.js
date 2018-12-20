import ready from '../ready';
import { GLOBAL_NAME } from '../../config';
import { CommonCallback, RejectWrapper, ResolveWrapper } from '../utils';

// 设备信息相关
const device = {
    info() {
        return ready().then(function(){
            let deviceInfo = window[GLOBAL_NAME].device.getDeviceInfo();
            setTimeout(function () { }, 0);
            return {
                cuid: deviceInfo.cuid,
                sv: deviceInfo.sv,
                channel: deviceInfo.channel,
                screen: deviceInfo.screen,
                from: deviceInfo.from,
                os: deviceInfo.os,
                model: deviceInfo.model,
                payPlats: deviceInfo.payPlats,
                refer: deviceInfo.refer
            };
        })
    },

    takePhoto() {
        return ready().then(function(){
            return new Promise(function (resolve, reject) {
                window[GLOBAL_NAME].kernel.invoke('takePhoto', (data) => {
                    if (data) {
                        ResolveWrapper(resolve, data);
                    } else {
                        RejectWrapper(reject);
                    }
                });
            }) 
        })
    },

    scanBarCode() {
        return ready().then(function() {
            return new Promise(function(resolve, reject) {
                window[GLOBAL_NAME].kernel.invoke('scanBarCode', (data) => {
                    CommonCallback(resolve, reject, data);
                });
            })
        })
    }
}

export default device;
