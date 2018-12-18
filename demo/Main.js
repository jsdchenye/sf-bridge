import React from 'react';
import bridge from '../src';

const { get } = bridge.network;

export default class Main extends React.PureComponent {
  handleTestRequest() {
    const getService = (params) => get('/test/get', params);
    getService({ name: 'lichun' });
  }

  render() {
    return (
      <div>
        <div>
          <button onClick={this.handleTestRequest}>测试发请求</button>
        </div>
      </div>
    )
  }
}
