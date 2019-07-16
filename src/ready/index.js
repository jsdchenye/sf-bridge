import { ResolveWrapper, getPageData } from '../utils';
import { TIME_OUT, READY_CHECK_EVENT } from '../../config';

function ready() {
    return new Promise(function (resolve, reject) {
        setTimeout(reject, TIME_OUT, 'AppReady timeout');
        if (window[READY_CHECK_EVENT]) {
            ResolveWrapper(resolve);
        }
        else {
            let AppReady = function (data) {
                let pageData = getPageData();

                if (data.pageData) {
                    pageData = Object.assign({}, pageData, data.pageData);
                    // pageData = {
                    //     ...pageData,
                    //     ...data.pageData,
                    // }
                }
                document.removeEventListener(READY_CHECK_EVENT, AppReady);
                window[READY_CHECK_EVENT] = true;
                ResolveWrapper(resolve, pageData);
            };
            document.addEventListener(READY_CHECK_EVENT, AppReady);
        }
    });
}

export default ready;
