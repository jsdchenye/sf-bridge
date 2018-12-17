import ready from '../ready';
import { GLOBAL_NAME } from '../../config';

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

    takePhoto(callback) {
        return ready().then(function(){
            return new Promise(function (resolve, reject) {
                window[GLOBAL_NAME].kernel.invoke('takePhoto', callback);
            }) 
        })
    }
}

export default device;
