var SFApp = SFApp || {};

(function(self) {
    var head = document.getElementsByTagName('head')[0],
        loadingMap = {},
        factoryMap = {},
        modulesMap = {},
        scriptsMap = {},
        resMap, pkgMap;

    function loadScript(id, callback) {
        var queue = loadingMap[id] || (loadingMap[id] = []);
        queue.push(callback);

        var res = resMap ? resMap[id] : {};
        var url = res.pkg
            ? pkgMap[res.pkg].url
            : (res.url || id);

        if (! (url in scriptsMap))  {
            scriptsMap[url] = true;

            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            head.appendChild(script);
        }
    }

    SFApp.define = function(id, factory) {
        factoryMap[id] = factory;

        var queue = loadingMap[id];
        if (queue) {
            for(var i = queue.length - 1; i >= 0; --i) {
                queue[i]();
            }
            delete loadingMap[id];
        }
    };

    SFApp.require = function(id) {
        id = SFApp.require.alias(id);

        var mod = modulesMap[id];
        if (mod) {
            return mod.exports;
        }

        var factory = factoryMap[id];
        if (!factory) {
            throw Error('Cannot find module `' + id + '`');
        }

        mod = modulesMap[id] = {
            'exports': {}
        };

        var ret = (typeof factory == 'function')
            ? factory.apply(mod, [SFApp.require, mod.exports, mod])
            : factory;

        if (ret) {
            mod.exports = ret;
        }
        return mod.exports;
    };

    SFApp.require.async = function(names, callback) {
        if (typeof names == 'string') {
            names = [names];
        }

        for(var i = names.length - 1; i >= 0; --i) {
            names[i] = SFApp.require.alias(names[i]);
        }

        var needMap = {};
        var needNum = 0;

        function findNeed(depArr) {
            for(var i = depArr.length - 1; i >= 0; --i) {
                //
                // skip loading or loaded
                //
                var dep = depArr[i];
                if (dep in factoryMap || dep in needMap) {
                    continue;
                }

                needMap[dep] = true;
                needNum++;
                loadScript(dep, updateNeed);

                var child = resMap && resMap[dep];
                if (child && 'deps' in child) {
                    findNeed(child.deps);
                }
            }
        }

        function updateNeed() {
            if (0 == needNum--) {
                var i, n, args = [];
                for(i = 0, n = names.length; i < n; ++i) {
                    args[i] = SFApp.require(names[i]);
                }
                callback && callback.apply(self, args);
            }
        }
        findNeed(names);
        updateNeed();
    };

    SFApp.require.resourceMap = function(obj) {
        resMap = obj['res'] || {};
        pkgMap = obj['pkg'] || {};
    };

    SFApp.require.alias = function(id) {return id};

})(this);

SFApp.define('core/util.js', function(require, exports, module) {
    var cache = {};

    module.exports = {
        joinParams: function(obj) {
            var objArr = [];

            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    objArr.push(key + '=' + obj[key]);
                }
            }

            return objArr.join('&');
        },

        isString: function(obj) {
            return typeof obj == 'string';
        },

        isFunction: function(obj) {
            return typeof obj == 'function';
        },

        cache: function(key, value) {
            if (value !== undefined) {
                cache[key] = value;
            }else {
                return cache[key];
            }
        }
    };
});

SFApp.define('core/event.js', function(require, exports, module) {
    var slice = [].slice,
        separator = /\s+/,

        returnFalse = function() {
            return false;
        },

        returnTrue = function() {
            return true;
        };

    function eachEvent( events, callback, iterator ) {

        // 不支持对象，只支持多个event用空格隔开
        (events || '').split( separator ).forEach(function( type ) {
            iterator( type, callback );
        });
    }

    // 生成匹配namespace正则
    function matcherFor( ns ) {
        return new RegExp( '(?:^| )' + ns.replace( ' ', ' .* ?' ) + '(?: |$)' );
    }

    // 分离event name和event namespace
    function parse( name ) {
        var parts = ('' + name).split( '.' );

        return {
            e: parts[ 0 ],
            ns: parts.slice( 1 ).sort().join( ' ' )
        };
    }

    function findHandlers( arr, name, callback, context ) {
        var matcher,
            obj;

        obj = parse( name );
        obj.ns && (matcher = matcherFor( obj.ns ));
        return arr.filter(function( handler ) {
            return handler &&
                (!obj.e || handler.e === obj.e) &&
                (!obj.ns || matcher.test( handler.ns )) &&
                (!callback || handler.cb === callback ||
                handler.cb._cb === callback) &&
                (!context || handler.ctx === context);
        });
    }

    function Event( type, props ) {
        if ( !(this instanceof Event) ) {
            return new Event( type, props );
        }

        props && $.extend( this, props );
        this.type = type;

        return this;
    }

    Event.prototype = {

        isDefaultPrevented: returnFalse,

        isPropagationStopped: returnFalse,

        preventDefault: function() {
            this.isDefaultPrevented = returnTrue;
        },

        stopPropagation: function() {
            this.isPropagationStopped = returnTrue;
        }
    };

    module.exports = {

        on: function( name, callback, context ) {
            var me = this,
                set;

            if ( !callback ) {
                return this;
            }

            set = this._events || (this._events = []);

            eachEvent( name, callback, function( name, callback ) {
                var handler = parse( name );

                handler.cb = callback;
                handler.ctx = context;
                handler.ctx2 = context || me;
                handler.id = set.length;
                set.push( handler );
            } );

            return this;
        },

        one: function( name, callback, context ) {
            var me = this;

            if ( !callback ) {
                return this;
            }

            eachEvent( name, callback, function( name, callback ) {
                var once = function() {
                    me.off( name, once );
                    return callback.apply( context || me, arguments );
                };

                once._cb = callback;
                me.on( name, once, context );
            } );

            return this;
        },

        off: function( name, callback, context ) {
            var events = this._events;

            if ( !events ) {
                return this;
            }

            if ( !name && !callback && !context ) {
                this._events = [];
                return this;
            }

            eachEvent( name, callback, function( name, callback ) {
                findHandlers( events, name, callback, context )
                    .forEach(function( handler ) {
                        delete events[ handler.id ];
                    });
            } );

            return this;
        },

        trigger: function( evt ) {
            var i = -1,
                args,
                events,
                stoped,
                len,
                ev;

            if ( !this._events || !evt ) {
                return this;
            }

            typeof evt === 'string' && (evt = new Event( evt ));

            args = slice.call( arguments, 1 );
            evt.args = args;    // handler中可以直接通过e.args获取trigger数据
            args.unshift( evt );

            events = findHandlers( this._events, evt.type );

            if ( events ) {
                len = events.length;

                while ( ++i < len ) {
                    if ( (stoped = evt.isPropagationStopped()) ||  false ===
                        (ev = events[ i ]).cb.apply( ev.ctx2, args )
                    ) {

                        // 如果return false则相当于stopPropagation()和preventDefault();
                        stoped || (evt.stopPropagation(), evt.preventDefault());
                        break;
                    }
                }
            }

            return this;
        }
    };
});

SFApp.define('core/listener.js', function(require, exports, module) {
    var listeners = {};

    module.exports = {

        getListeners: function() {
            return listeners || {};
        },

        addListener: function(name, callback) {
            if (!name || typeof callback !== 'function') {
                return;
            }

            if (typeof callback === 'function') {
                listeners[name] = function(data) {
                    return callback.call(null, data ? JSON.parse(data) : '');
                };
            } else {
                listeners[name] = function(data) {};
            }
        },

        removeListener: function(name) {
            if (name && listeners[name]) {
                delete listeners[name];
            }
        }
    };
});

SFApp.define('bridge/jsBridge.js', function(require, exports, module) {
    var event = require('core/event.js'),
        util = require('core/util.js'),
        listeners = require('core/listener.js'),
        schemaCfg = {
            scheme: 'sftc',
            webHost: 'websdk',
            nativeHost: 'native',
            pluginHost: 'plugin'
        };

    function sendUrl(urlString) {
        console.log(urlString);

        // 采用iframe向na发送消息，不直接用location是因为同步向na发送消息时，location跳转只会执行一次
        var iFrame = document.createElement("iframe");
        iFrame.setAttribute("src", urlString);
        iFrame.style.display = 'none';
        document.body.appendChild(iFrame);

        iFrame.parentNode.removeChild(iFrame);
        iFrame = null;
    }

    function JsBridge(){
        this.init();
    }

    function joinSchemeHost(scheme, host) {
        return scheme + '://' + host + '?';
    }

    function createReadyEvent(){
        var readyEvent = window.document.createEvent('Event');
        readyEvent.initEvent('SFAppReady', true, true);

        return readyEvent;
    }

    // 协议解析器
    var commandParser = {
        getCommand: function (action, params, callback) {
            return joinSchemeHost(schemaCfg.scheme, schemaCfg.webHost) + util.joinParams({
                    'action': action,
                    'params': encodeURIComponent(JSON.stringify(params)),
                    'callback': callback
                });
        },

        getGlobalWebCommand: function(params) {
            var pageParams = params.pageParams,
                paramQuery = pageParams ? '&' + util.joinParams(pageParams) : '';

            if (pageParams && !pageParams.url) {
                return '';
            }

            return joinSchemeHost(schemaCfg.scheme, schemaCfg.nativeHost) + util.joinParams({
                    "pageName": "webview"
                }) + paramQuery;
        },

        getGlobalAppCommand: function(params) {
            var pageName = params.pageName,
                pageParams = params.pageParams;

            if (!pageName) {
                return '';
            }

            var paramQuery = pageParams ? '&' + util.joinParams(pageParams) : '';

            return joinSchemeHost(schemaCfg.scheme, schemaCfg.nativeHost) + util.joinParams({
                    "pageName": pageName
                }) + paramQuery;
        },

        getGlobalPluginCommand: function(params) {
            var pluginId = params.pluginId,
                pageName = params.pageName,
                pageParams = params.pageParams;

            if (!pageName) {
                return '';
            }

            var paramQuery = pageParams ? '&' + util.joinParams(pageParams) : '';

            return joinSchemeHost(schemaCfg.scheme, schemaCfg.pluginHost) + util.joinParams({
                    "pluginId": pluginId,
                    "pageName": pageName
                }) + paramQuery;
        }

    };

    /**
     * App回调bridge
     * @returns {{notify: Function, initReadyEvent: Function, initData: Function}}
     */
    var getBridgeSandbox = function(instance) {
        var bridge = instance;

        return {

            /**
             * App回调通知
             * @param msg
             * {
             *      callback: xxx,
             *      data: {
             *          status: 1/0,  // 成功1， 失败0,
             *          result: {},   // 各接口自定义信息
             *      }
             * }
             */
            notify: function(msg) {
                var paramJson = JSON.parse(msg);

                if (paramJson && paramJson.callback) {
                    bridge.onReceiveMessage(paramJson.callback, paramJson.data);
                }
            },

            /**
             * 回调数据不进行json解析，场景是图片进行base64时
             * @param callback
             * @param data
             */
            singleNotify: function(callback, data) {
                if (callback) {
                    bridge.onReceiveMessage(callback, data);
                }
            },

            /**
             * 通知回调，场景是前端先注册回调，NA进行动作时执行回调
             * @param name
             * @param data
             */
            notifyListener: function(name, data) {
                var listener = listeners.getListeners() && listeners.getListeners()[name] ;

                typeof listener === 'function' && listener(data);
            },

            /**
             * 初始化ready事件，bridge加载完后App回调
             */
            initReadyEvent: function(data) {
                var readyEvent = createReadyEvent();
                if (data) {
                    readyEvent.pageData = JSON.parse(data);
                }

                window.document.dispatchEvent(readyEvent);
            },

            /**
             * 同步数据，包含设备信息、定位信息等
             * @param data
             */
            initData: function(data) {
                var appData = null;

                try{
                    appData = JSON.parse(data);

                    if (appData) {
                        util.cache('SFAppData', appData);
                    }

                }catch(e) {
                    console.log(e);
                }
            },

            setScheme: function(scheme) {
                if (scheme) {
                    schemaCfg.scheme = scheme;
                }
            }
        };
    };

    JsBridge.prototype = {
        constructor: JsBridge,

        init: function() {
            // 用于App回调bridge
            window.SFAppBridge = getBridgeSandbox(this) || {};
        },

        /**
         * 前端向App发送消息
         * @param type
         * @param action
         * @param params
         * @param callback
         */
        sendNotifyRequest: function (type, action, params, callback) {
            var command = '';

            if (type == 'websdk') {
                command = commandParser.getCommand(action, params, callback)
            }else if(type == 'globalweb'){
                command = commandParser.getGlobalWebCommand(params);
            }else if(type == 'globalapp') {
                command = commandParser.getGlobalAppCommand(params);
            }else if (type == 'globalplugin') {
                command = commandParser.getGlobalPluginCommand(params)
            }

            sendUrl(command);
        },

        /**
         * 接收到App消息
         * @param eventName
         * @param data
         */
        onReceiveMessage: function(eventName, data) {
            event.trigger(eventName, data);
        }
    };

    module.exports = JsBridge;
});

SFApp.define('bridge/kernel.js', function(require, exports, module) {
	var baseUtil = require('core/util.js'),
        jsBridge = require('bridge/jsBridge.js'),
        event = require('core/event.js'),
        listener = require('core/listener.js'),
        util = require('core/util.js'),
        bridge = new jsBridge(),

        num = 0;

    function getRandomEventKey(action) {
        return 'sf_event' + '_' + action + '_' + num++;
    }

    function _invoke(type, action, params, callback) {
        var callbackEvent = getRandomEventKey(action),
            notifyCb = callback,
            notifyParams = params;

        if (baseUtil.isFunction(params)) {
            notifyCb = params;
            notifyParams = {};
        }

        if (baseUtil.isFunction(notifyCb)) {
            event.on(callbackEvent, function (data) {
                var cbData;

                if (data && data.args) {
                    cbData = data.args.slice(1);
                }

                notifyCb.apply(null, cbData);
                event.off(callbackEvent, arguments.callee);
            });
        }

        // 解决部分安卓连续消息不触发的问题
        setTimeout(function() {
            bridge.sendNotifyRequest(type, action, notifyParams, callbackEvent);
        }, 0);
    }

    module.exports = {
        invoke: function(action, params, callback) {
            return _invoke('websdk', action, params, callback);
        },

        globalWebInvoke: function(params) {
            return _invoke('globalweb', 'native', params);
        },

        globalAppInvoke: function(params) {
            return _invoke('globalapp', 'native', params);
        },

        globalPluginInvoke: function(params) {
            return _invoke('globalplugin', 'plugin', params);
        },

        addListener: function(name, callback) {
            listener.addListener(name, callback);
        },

        removeListener: function(name) {
            listener.removeListener(name);
        },

        /**
         * 获取页面初始化数据，同步获取的数据
         * @returns {*}
         */
        getInitData: function() {
            return util.cache('SFAppData')
        }
    };
});

(function(win) {
    var appModule = win.SFApp,
        require = win.SFApp.require;

    // 如果bridge在App中已经注入过一遍，则不再重复注入
    if (win.SFAppBridge) {
        return;
    }

    appModule['kernel'] = require('bridge/kernel.js');
    appModule['jsBridge'] = require('bridge/jsBridge.js');

    appModule['event'] = require('core/event.js');

    // 安卓4.4以下无法直接获取js函数返回值，通过console传递返回值
    console.log('SFAppReady');

})(window);

