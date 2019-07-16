const apis = {
  // 饿了么登录接口 - 账号密码
  eleUsername: 'https://app-api.shop.ele.me/arena/invoke/?method=LoginService.loginByUsername',
  // 饿了么手机登录 - 获取验证码
  eleVerifyCode: 'https://app-api.shop.ele.me/arena/invoke/?method=LoginService.sendVerifyCode',
  // 饿了么手机登录 - 手机验证码登录
  eleMobile: 'https://app-api.shop.ele.me/arena/invoke/?method=LoginService.loginByMobile',
  // 饿了么订单列表接口
  eleList: 'https://app-api.shop.ele.me/nevermore/invoke/?method=OrderService.queryLatestOrderForPC',
  // 饿了么经纬度
  eleGeo: 'https://app-api.shop.ele.me/nevermore/invoke/?method=DeliveryService.getOrderRelateLocation',
  
  // 饿百 stoken
  ebStoken: 'https://wmpass.ele.me/wmpass/openservice/captchapair',
  // 饿百登录接口 - 账号密码 && 手机验证
  ebLogin: 'https://wmpass.ele.me/api/login',
  // 饿百手机登录 - 获取验证码
  ebVerifyCode: 'https://wmpass.ele.me/api/getsmscode',
  // 饿百登录 - 是否为商家账号
  ebIsShopAccount: 'https://be.ele.me/crm/account/getshopuserinfo',
  // 饿百订单列表接口
  ebList: 'https://be.ele.me/crm/orderlist',
  // 饿百经纬度
  ebGeo: 'https://be.ele.me/crm/getmap',
};

/**
 * 简介：原生 ajax 请求
 * 
 * @param {any} url 
 * @param {any} params 
 */
function ajax(url, params) {
  const request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  request.send(`business_type=1&warning_msg=${JSON.stringify(params)}`)
}

/**
 * 简介：判断是否为空（数组、字符串、null）
 * 
 * @param {any} value 
 * @returns 
 */
function isEmpty(value) {
  var type = Object.prototype.toString.call(value);
  var key;
  if (type === '[object Array]' || type === '[object Arguments]' || type === '[object String]') {
    return value.length === 0;
  }
  if (type === '[object Object]') {
    for (key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        return false;
      }
    }
    return true;
  }
  return !value;
}

/**
 * 简介： 通用的网络请求正常与否的判断逻辑
 * 
 * @param {any} data 
 * @param {any} errObj 
 * @param {any} api 
 * @param {any} flag 
 */
function isNetworkOk(data, errObj, api, flag) {
  if (!data.status || +data.status === 0 || !data.result || +data.result.statusCode < 0) {
    errObj.errmsg = `${api}出错`;
  } else if (+data.result.statusCode < 200) {
    errObj.errmsg = `${api}服务器收到请求，需要请求者继续执行操作`;
  } else if (+data.result.statusCode < 400 && +data.result.statusCode > 299) {
    errObj.errmsg = `${api}重定向问题`;
  } else if (+data.result.statusCode < 500 && +data.result.statusCode > 399) {
    errObj.errmsg = `${api}客户端请求错误`;
  } else if (+data.result.statusCode > 499) {
    errObj.errmsg = `${api}服务器错误`;
  } else if (!data.result.responseBody
    || !Object.prototype.hasOwnProperty.call(JSON.parse(data.result.responseBody), flag)) {
    errObj.errmsg = `${api}返回的responseBody内容有错`;
  }
}
/**
 * 简介：监控饿了么&&饿百接口中服务器请求&&返回数据字段
 * 
 * @param {any} params 
 * @param {any} data 
 */
function monitor(params, data) {
  try {
    const errObj = { params: params, detail: data };
    const _response_body = JSON.parse(data.result.responseBody);
    /* ---- 饿了么相关 --- */
    if (params.url === apis.eleUsername) { // 登录 - 用户名
      const text = '饿了么用户名登录接口';
      isNetworkOk(data, errObj, text, 'result');
      if (!errObj.errmsg) {
        const res = _response_body.result;
        if (_response_body.error) {
          errObj.errmsg = `${text}报错`;
        } else if (isEmpty(res)) {
          errObj.errmsg = `${text}返回的结果中字段<result>有问题`;
        } else if (!res.succeed) {
          return; // 用户密码错误之类的
        } else if (isEmpty(res.successData)) {
          errObj.errmsg = `${text}返回的结果中字段<successData>有问题`;
        } else if (isEmpty(res.successData.shops)) {
          errObj.errmsg = `${text}返回的结果中字段<shops>有问题`;
        } else if (res.successData.shops[0] && !res.successData.shops[0].address) {
          return;
        } else if (!res.successData.shops[0] || isEmpty(res.successData.shops[0].id)) {
          errObj.errmsg = `${text}返回的结果中字段<shops的id>有问题`;
        } else if (isEmpty(res.successData.ksid)) {
          errObj.errmsg = `${text}返回的结果中字段<ksid>有问题`;
        }
      }
    } else if (params.url === apis.eleVerifyCode) {  // 登录 - 获取验证码
      const text = '获取饿了么手机验证码接口';
      isNetworkOk(data, errObj, text, 'result');
      if (!errObj.errmsg && _response_body.error) {
        errObj.errmsg = `${text}报错`;
      }
    } else if (params.url === apis.eleMobile) { // 登录 - 手机验证码登录
      const text = '饿了么手机验证码登录接口';
      isNetworkOk(data, errObj, text, 'result');
      if (!errObj.errmsg) {
        const res = _response_body.result;
        if (_response_body.error) {
          errObj.errmsg = `${text}报错`;
        } else if (isEmpty(res)) {
          errObj.errmsg = `${text}返回的结果中字段<result>有问题`;
        } else if (!res.succeed) {
          return; // 用户密码错误之类的
        } else if (isEmpty(res.successData)) {
          errObj.errmsg = `${text}返回的结果中字段<successData>有问题`;
        } else if (isEmpty(res.successData.shops)) {
          errObj.errmsg = `${text}返回的结果中字段<shops>有问题`;
        } else if (res.successData.shops[0] && !res.successData.shops[0].address) {
          return;
        } else if (!res.successData.shops[0] || isEmpty(res.successData.shops[0].id)) {
          errObj.errmsg = `${text}返回的结果中字段<shops的id>有问题`;
        } else if (isEmpty(res.successData.ksid)) {
          errObj.errmsg = `${text}返回的结果中字段<ksid>有问题`;
        }
      }
    } else if (params.url === apis.eleList) { // 列表
      const text = '饿了么订单列表接口';
      const needParams = ['consigneeAddress', 'activeTime', 'consigneeSecretPhones', 'consigneeName', 'payAmount'];
      isNetworkOk(data, errObj, text, 'result');
      // 网络请求没报错，判断接口返回数据结构
      if (!errObj.errmsg) {
        if (_response_body.error) {
          errObj.errmsg = `${text}报错`;
        } else {
          let targetKey;
          const temp = _response_body.result;
          if (isEmpty(temp)) return;
          const res = temp && temp[0] || {};
          const flag = needParams.every(function(ele) {
            if (isEmpty(res[ele])) {
              targetKey = ele;
              return false;
            }
            return true;
          });
          if (!flag) {
            errObj.errmsg = `${text}返回的列表中字段<${targetKey}>有问题`;
          }
        }
      }
    } else if (params.url === apis.eleGeo) { // 经纬度
      const text = '饿了么经纬度接口';
      isNetworkOk(data, errObj, text, 'result');
      if (!errObj.errmsg) {
        const res = _response_body.result;
        if (_response_body.error) {
          errObj.errmsg = `${text}报错`;
        } else if (isEmpty(res)) {
          errObj.errmsg = `${text}返回的结果中字段<result>有问题`;
        } else if (isEmpty(res.customerLocation)) {
          errObj.errmsg = `${text}返回的结果中字段<customerLocation>有问题`;
        } else if (isEmpty(res.customerLocation.latitude)) {
          errObj.errmsg = `${text}返回的结果中字段<latitude>有问题`;
        } else if (isEmpty(res.customerLocation.longitude)) {
          errObj.errmsg = `${text}返回的结果中字段<longitude>有问题`;
        }
      }
    }

    /* ---- 饿百相关 --- */
    if (params.url.indexOf(apis.ebStoken) > -1) { // stoken
      const text = '饿百token接口';
      isNetworkOk(data, errObj, text, 'data');
      if (!errObj.errmsg) {
        const res = _response_body.data;
        if (+_response_body.errno !== 0) {
          errObj.errmsg = `${text}报错`;
        } else if (isEmpty(res)) {
          errObj.errmsg = `${text}返回的结果中字段<data>有问题`;
        } else if (isEmpty(res.token)) {
          errObj.errmsg = `${text}返回的结果中字段<token>有问题`;
        } else if (isEmpty(res.url)) {
          errObj.errmsg = `${text}返回的结果中字段<url>有问题`;
        }
      }

    } else if (params.url === apis.ebLogin) { // 登录 - 用户名 && 手机验证
      const typeObj = {};
      params.httpBody.split('&').forEach(function(v) {
        const temp = v.split('=');
        typeObj[temp[0]] = temp[1];
      });
      const text = +typeObj.type === 1 ? '饿百用户名登录接口' : '饿百手机验证登录接口';
      isNetworkOk(data, errObj, text, 'data');
      if (!errObj.errmsg) {
        const _header = JSON.parse(data.result.responseHeaders);
        const res = _response_body.data;
        const cookieArr = (_header['Set-Cookie'] || _header['set-cookie'] || '').split(';');
        const cookieMap = {}
        cookieArr.forEach(function(v) {
            const temp = v.split('=');
            if (temp[0] && temp[1]) {
                cookieMap[temp[0]] = temp[1]
            }
        });
        if (+_response_body.errno !== 0) {
          errObj.errmsg = `${text}报错`;
        } else if (isEmpty(res)) {
          errObj.errmsg = `${text}返回的结果中字段<data>有问题`;
        } else if (isEmpty(res.WMSTOKEN)) {
          errObj.errmsg = `${text}返回的结果中字段<WMSTOKEN>有问题`;
        } else if (isEmpty(cookieMap.WMUSS)) {
          errObj.errmsg = `${text}返回的结果中字段<WMUSS>有问题`;
        }
      }
    } else if (params.url === apis.ebVerifyCode) { // 手机验证码
      const text = '获取饿百手机验证码接口';
      isNetworkOk(data, errObj, text, 'data');
      if (!errObj.errmsg && +_response_body.errno !== 0) {
        errObj.errmsg = `${text}报错`;
      }
    } else if (params.url === apis.ebIsShopAccount) { // 是否为商家端账号
      const text = '判断饿百登录是否为商家端账号接口';
      isNetworkOk(data, errObj, text, 'data');
      if (!errObj.errmsg && +_response_body.errno !== 0) {
        errObj.errmsg = `${text}报错`;
      }
    } else if (params.url.indexOf(apis.ebList) > -1) { // 列表
      const text = '饿百订单列表接口';
      const needParams = ['order_index', 'user_address', 'create_time', 'user_phone', 'user_real_name', 'invoice_price', 'order_id'];
      isNetworkOk(data, errObj, text, 'data');
      // 网络请求没报错，判断接口返回数据结构
      if (!errObj.errmsg) {
        if (+_response_body.errno !== 0) {
          errObj.errmsg = `${text}报错`;
        } else {
          let targetKey;
          const temp = _response_body.data;
          if (isEmpty(temp)) {
            errObj.errmsg = `${text}返回的列表中字段<data>有问题`;
          } else {
            if (isEmpty(temp.order_list)) return;
            const res = temp.order_list[0] && temp.order_list[0].order_basic || {};
            const flag = needParams.every(function(ele) {
              if (isEmpty(res[ele])) {
                targetKey = ele;
                return false;
              }
              return true;
            });
            if (!flag) {
              errObj.errmsg = `${text}返回的列表中字段<${targetKey}>有问题`;
            }
          }
        }
      }
    } else if (params.url === apis.ebGeo) { // 经纬度
      const text = '饿百经纬度接口';
      isNetworkOk(data, errObj, text, 'data');
      if (!errObj.errmsg) {
        const res = _response_body.data;
        if (+_response_body.errno !== 0) {
          errObj.errmsg = `${text}报错`;
        } else if (isEmpty(res)) {
          errObj.errmsg = `${text}返回的结果中字段<data>有问题`;
        } else if (isEmpty(res.position)) {
          errObj.errmsg = `${text}返回的结果中字段<position>有问题`;
        } else if (isEmpty(res.position.userPosition)) {
          errObj.errmsg = `${text}返回的结果中字段<userPosition>有问题`;
        } else if (isEmpty(res.position.userPosition.latitude)) {
          errObj.errmsg = `${text}返回的结果中字段<latitude>有问题`;
        } else if (isEmpty(res.position.userPosition.longitude)) {
          errObj.errmsg = `${text}返回的结果中字段<longitude>有问题`;
        }
      }
    }
    if (errObj.errmsg) {
      // ajax('http://10.59.57.146:8800/crm/common/uploadwarning', errObj);
      ajax('http://shopic.sf-express.com/crm/common/uploadwarning', errObj);
    }
  } catch (error) {
    // console.error(error, '这是一条错误信息');
  }
}

export default monitor;