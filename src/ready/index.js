import 'es6-promise/auto';
import { ResolveWrapper, getPageData } from '../utils';
import { TIME_OUT } from '../../config';

function ready() {
    return new Promise(function (resolve, reject) {
        setTimeout(reject, TIME_OUT, 'AppReady timeout');
        if (window.AppReady) {
            ResolveWrapper(resolve);
        }
        else {
            let AppReady = function (data) {
                let pageData = getPageData();

                if (data.pageData) {
                    objectAssign(pageData, data.pageData);
                }
                document.removeEventListener('AppReady', AppReady);
                ResolveWrapper(resolve, pageData);
            };
            document.addEventListener('AppReady', AppReady);
        }
    });
}

export default ready;
