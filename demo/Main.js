import React from 'react';
import bridge from '../src';

const { get, post, setHost } = bridge.network;
const { takePhoto, scanCode } = bridge.device;

setHost('http://gz-loc-development00.gz.sftcwl.com:7300/mock/5c21fc70a9b82994f6c1ed18/subway');

export default class Main extends React.PureComponent {
  handleTestRequest() {
    const getService = (params) => get('www.baidu.com', params);
    getService({ name: 'lichun', chinese: '李淳' }).then((data) => {
      console.log(data);
    });
  }

  handleTestPostRequest() {
    const postService = (params) => post('/management/pcs/v100/modifyorder', params);
    postService({ testName: 'postService', name: 'lichun' }).then((data) => {
      console.log(data);
    });
  }

  handleTestTakePhoto() {
    takePhoto().then((data) => {
      console.log(data);
    })
  }

  handleTestScan() {
    scanCode().then((data) => {
      console.log(data);
    })
  }

  render() {
    return (
      <div>
        <div>
          <button onClick={this.handleTestRequest}>测试发get请求</button>
          <button onClick={this.handleTestPostRequest}>测试发post请求</button>
          <button onClick={this.handleTestTakePhoto}>测试调起相机</button>
          <button onClick={this.handleTestScan}>测试扫码</button>
        </div>
      </div>
    )
  }
}
