// import account from './account';
import device from './device';
// import location from './location';
import network from './network';
// import page from './page';
import ready from './ready';
import ui from './ui';
// import fetch from './fetch';

import { isApp } from './utils';
import substitute from '../substitute';

const appBridge =  {
    ready,
    device, 
    network, 
    ui,
}

const bridge = isApp() ? appBridge : substitute;

bridge.utils = {
    isInApp: isApp,
}

bridge.ready();

export default bridge;
