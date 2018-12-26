export const getPageData = () => {
    let search = window.location.search.replace(/^\?/, '');
    let params = {};
    if (search) {
        search.split('&').forEach(v => {
            let param = v.split('=');
            params[param[0]] = param[1] || '';
        });
    }
    if (params.pageData) {
        params.pageData = decodeURIComponent(params.pageData);
        let innerP;
        try {
            innerP = JSON.parse(params.pageData);
        }
        catch (e) {
            innerP = {};
        }

        params = {
            ...params,
            ...innerP,
        }
    }
    return params;
};

export const ResolveWrapper = (resolve, data) => {
    resolve(data || getPageData());
    AsynHack();
}

export const RejectWrapper = (reject, data) => {
    reject(data);
    AsynHack();
}

export const AsynHack = () => {
    setTimeout(function () { }, 0);
}

export const CommonCallback = (resolve, reject, data) => {
    if (data.status) {
        ResolveWrapper(resolve, data);
    } else {
        RejectWrapper(reject, data);
    }
}

export const testAgent = (userAgent) => {
    return new RegExp(userAgent, 'i').test(navigator.userAgent);
}

export const isIOS = () => {
    console.log(navigator.userAgent);
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/**
 * 粗略判断
 */
export const isPC = () => {
    return /Safari|Chrome|Mozilla/i.test(navigator.userAgent);
}

/**
 * 判断是否是在App内部使用
 */
export const isApp = () => {
    return true;
}

export const joinParams = (params) => {
    if (params) {
        const arr = Object.keys(params).map(item => `${item}=${params[item]}`);
        return arr.join('&');
    }
    return '';
}

export const mergeUrl = (url, params) => {
    return url + (url.indexOf("?") > -1 ? "&": "?") + (params ? joinParams(params) : '');
}
