const deploy = require('eden-remote-deploy');

const deployCfg = {
  zhangxu: {
    receiver: 'http://10.188.40.14:8230/receiver.php',
    root: '/home/zhangxu/odp_wms/',
  },
  zhangyi: {
    receiver: 'http://10.188.40.14:8029/receiver.php',
    root: '/home/zhangyi/odp_wms/',
  },
  yanbin: {
    receiver: 'http://10.188.40.14:8765/receiver.php',
    root: '/home/douyanbin/odp_wms/',
  },
  qa: {
    receiver: 'http://10.188.60.73:8333/receiver.php',
    root: '/home/sftcwl/odp_wms/',
  },
};

const edenCfg = [{
  from: 'dist/**',
  to: 'webroot/static/',
}];

const hostName = process.argv[2];// 捕获机器名字

if (hostName && deployCfg[hostName]) {
  // eslint-disable-next-line
  const receiver = deployCfg[hostName].receiver;
  console.info('==>   Receiver:', receiver);

  deploy(edenCfg, receiver, deployCfg[hostName].root);
} else {
  console.error('==>   请输入正确的部署机器名');
}
