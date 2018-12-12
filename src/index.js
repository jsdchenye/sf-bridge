import account from './account';
import device from './device';
import location from './location';
import network from './network';
import page from './page';
import ready from './ready';
import ui from './ui';
import fetch from './fetch';

import { testAgent } from './utils';

// 此处可做适配，通过navigator.userAgent适配不同的环境
let isWeixin = testAgent('micromessenger');
let isBdwm = testAgent('wmapp');

const bridge = {
    account, 
    device, 
    location, 
    network, 
    page, 
    ready,
    ui,
    fetch
}

export default bridge;
