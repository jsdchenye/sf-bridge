# Bridge

## 介绍

提供了一套方便使用端能力的api，并且所有api在非APP环境中使用均做了降级替换；提供检查是否在APP内部，如果在APP内部使用NA能力完成，若在纯浏览器环境，则自动切换成Substitute功能，使hybrid H5与浏览器无缝使用同一套代码；

## 一期实现

1. NA代发请求，用于离线、跨域情形；

2. 拍照；

3. 扫条形码；

4. 环境检查；

持续更新ing

## 使用指南

```javascript
// 安装
npm install --save sf-bridge
```

```javascript
// 环境检查
import bridge from 'sf-bridge';
// return bool;
const isInApp = bridge.utils.isInApp(); 
```

```javascript
// NA代发请求
import bridge from 'sf-bridge';

const { get, post, setHost, sendRequest } = bridge.network;

// 设置host 仅需设置一次，且必须设置，若需要跨多个域取数据则设置为'', 而后请求使用完整路径；
setHost('http://gz-loc-development00.gz.sftcwl.com:9949');

// 发送请求 Promise，url为/appname/getsth
get(url, params, headers).then(response => {
  // do sth
});

post(url, params, headers).then(response => {
  // do sth
});

// 直接使用未封装方法与NA交互可配置数据如下
// data = {
//   url: Fullurl,
//   contentType: 'application/x-www-form-urlencoded',
//   httpBody: query.join('&'),
//   headers: {...}
// }
sendRequest(data).then(response => {
  // do sth
});
```

```javascript
// 拍照、扫码
import bridge from 'sf-bridge';
const { scanCode, takePhoto } = bridge.device;

scanCode().then((data) => {
  console.log(data); // {status: "1", result: {code: "6901236341292"}}
});

```

## 注意事项

1. 需要端上提前注入static/base.js；
2. 代发请求需要先行调用network.setHost()设置请求host；
