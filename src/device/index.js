import ready from '../ready';

// 设备信息相关
const device = {
    info() {
        return ready().then(function(){
            let deviceInfo = window.WMApp.device.getDeviceInfo();
            setTimeout(function () { }, 0);
            return {
                client: 'bdwm',
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
                window.WMApp.kernel.invoke('takePhoto', callback);
            }) 
        })
    }
}

export default device;
