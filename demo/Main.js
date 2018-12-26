import React from 'react';
import bridge from '../src';

const { get, post, setHost } = bridge.network;
const { takePhoto, scanBarCode } = bridge.device;

setHost('https://');

export default class Main extends React.PureComponent {
  handleTestRequest() {
    const getService = (params) => get('www.baidu.com', params);
    getService({ name: 'lichun', chinese: '李淳' }).then((data) => {
      console.log(data);
    });
  }

  handleTestPostRequest() {
    const postService = (params) => post('https://www.baidu.com', params);
    postService({ testName: 'postService', name: 'lichun' });
  }

  handleTestTakePhoto() {
    takePhoto().then((data) => {
      console.log(data);
    })
  }

  render() {
    return (
      <div>
        <div>
          <button onClick={this.handleTestRequest}>测试发get请求</button>
          <button onClick={this.handleTestRequest}>测试发post请求</button>
          <button onClick={this.handleTestTakePhoto}>测试调起相机</button>
        </div>
      </div>
    )
  }
}
