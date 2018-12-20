import React from 'react';
import bridge from '../src';

const { get } = bridge.network;
const { takePhoto, scanBarCode } = bridge.device;

export default class Main extends React.PureComponent {
  handleTestRequest() {
    const getService = (params) => get('/wms/basic/getcommonlist', params);
    getService({ name: 'lichun' });
  }

  handleTestTakePhoto() {
    takePhoto().then((data) => {
      console.log(data);
    })
  }

  render() {
    return (
      <div>
        <div>17：16</div>
        <div>
          <button onClick={this.handleTestRequest}>测试发请求</button>
          <button onClick={this.handleTestTakePhoto}>测试调起相机</button>
        </div>
      </div>
    )
  }
}
