/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(1);
	__webpack_require__(70);
	__webpack_require__(86);
	__webpack_require__(95);
	__webpack_require__(120);
	__webpack_require__(126);
	__webpack_require__(139);
	var articles_1 = __webpack_require__(1);
	var contacts_1 = __webpack_require__(70);
	var customers_1 = __webpack_require__(86);
	var galleries_1 = __webpack_require__(95);
	var login_1 = __webpack_require__(120);
	var photos_1 = __webpack_require__(126);
	var photographers_1 = __webpack_require__(154);
	var core_1 = __webpack_require__(3);
	var authorization_guard_1 = __webpack_require__(163);
	var route_change_success_is_admin_reducer_1 = __webpack_require__(164);
	var quinntynebrownAppModule = angular.module("quinntynebrownApp", [
	    "components",
	    "quinntynebrown.articles",
	    "quinntynebrown.contacts",
	    "quinntynebrown.customers",
	    "quinntynebrown.galleries",
	    "quinntynebrown.login",
	    "quinntynebrown.photos",
	    "quinntynebrown.photographers",
	    "quinntynebrown.shared"
	]);
	core_1.bootstrap(quinntynebrownAppModule, {
	    api: "http://www.quinntynebrown.com/api",
	    loginRedirectUrl: "/",
	    html5Mode: true,
	    guards: [authorization_guard_1.authorizationGuard],
	    run: [route_change_success_is_admin_reducer_1.routeChangeSuccessIsAdminReducer],
	    routes: articles_1.ArticlesRoutes.concat(contacts_1.ContactsRoutes, customers_1.CustomersRoutes, galleries_1.GalleriesRoutes, login_1.LoginRoutes, photos_1.PhotosRoutes, photographers_1.PhotographersRoutes)
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var article_editor_container_component_1 = __webpack_require__(2);
	var articles_container_component_1 = __webpack_require__(61);
	var article_container_component_1 = __webpack_require__(65);
	var core_1 = __webpack_require__(3);
	var articlesModule = angular.module("quinntynebrown.articles", []);
	core_1.bootstrap(articlesModule, {
	    components: [article_container_component_1.ArticleContainerComponent, article_editor_container_component_1.ArticleEditorContainerComponent, articles_container_component_1.ArticlesContainerComponent],
	});
	__export(__webpack_require__(69));


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var ArticleEditorContainerComponent = (function () {
	    function ArticleEditorContainerComponent() {
	    }
	    ArticleEditorContainerComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(56),
	            styles: [__webpack_require__(57)],
	            selector: "article-editor-container",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], ArticleEditorContainerComponent);
	    return ArticleEditorContainerComponent;
	}());
	exports.ArticleEditorContainerComponent = ArticleEditorContainerComponent;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(4));
	__export(__webpack_require__(5));
	__export(__webpack_require__(6));
	__export(__webpack_require__(7));
	__export(__webpack_require__(8));
	__export(__webpack_require__(10));
	__export(__webpack_require__(11));
	__export(__webpack_require__(12));
	__export(__webpack_require__(13));
	__export(__webpack_require__(14));
	__export(__webpack_require__(15));
	__export(__webpack_require__(16));
	__export(__webpack_require__(18));
	__export(__webpack_require__(19));
	__export(__webpack_require__(20));
	__export(__webpack_require__(21));
	__export(__webpack_require__(22));
	__export(__webpack_require__(23));
	__export(__webpack_require__(24));
	__export(__webpack_require__(25));
	__export(__webpack_require__(26));
	__export(__webpack_require__(27));
	__export(__webpack_require__(28));
	__export(__webpack_require__(29));
	__export(__webpack_require__(30));
	__export(__webpack_require__(31));
	__export(__webpack_require__(32));
	__export(__webpack_require__(33));
	__export(__webpack_require__(34));
	__export(__webpack_require__(35));
	exports.Observable = Rx.Observable;
	__webpack_require__(36);
	__webpack_require__(9);
	__webpack_require__(23);
	__webpack_require__(8);
	__webpack_require__(18);
	__webpack_require__(37);
	__webpack_require__(38);
	__webpack_require__(14);
	__webpack_require__(39);
	__webpack_require__(40);
	__webpack_require__(41);
	__webpack_require__(31);
	__webpack_require__(22);
	__webpack_require__(27);
	__webpack_require__(42);
	__webpack_require__(43);
	__webpack_require__(44);
	__webpack_require__(45);
	__webpack_require__(46);
	__webpack_require__(47);
	__webpack_require__(48);
	__webpack_require__(32);
	__webpack_require__(49);
	__webpack_require__(50);
	__webpack_require__(33);
	__webpack_require__(34);
	__webpack_require__(35);
	__webpack_require__(51);
	__webpack_require__(52);
	__webpack_require__(29);
	__webpack_require__(30);
	__webpack_require__(53);
	__webpack_require__(54);
	__webpack_require__(55);
	var coreApp = angular.module("app.core", [
	    "ngSanitize",
	    "apiEndpoint",
	    "authInterceptor",
	    "localStorageManager",
	    "store",
	    "addOrUpdate",
	    "appendToBodyAsync",
	    "convertUnixTimestampToDate",
	    "debounce",
	    "extendCssAsync",
	    "getFromUrlSync",
	    "getHtml",
	    "getX",
	    "invokeAsync",
	    "fetch",
	    "formEncode",
	    "loginRedirect",
	    "position",
	    "removeElement",
	    "routeResolver",
	    "routeWhenExtension",
	    "rectangle",
	    "renderer",
	    "ruler",
	    "safeDigest",
	    "setElementBackgroundImage",
	    "setElementDimension",
	    "setElementDimensions",
	    "setOpacityAsync",
	    "space",
	    "rectangle",
	    "translateX",
	    "translateXY",
	    "translateXAsync",
	    "template"
	]);


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(3);
	exports.bootstrap = function (app, options) {
	    if (options.api)
	        app.config(["apiEndpointProvider", function (apiEndpointProvider) {
	                apiEndpointProvider.configure(options.api);
	            }]);
	    if (options.loginRedirectUrl)
	        app.config(["loginRedirectProvider", function (loginRedirectProvider) {
	                loginRedirectProvider.setDefaultUrl(options.loginRedirectUrl);
	            }]);
	    if (options.html5Mode)
	        app.config(["$locationProvider", function ($locationProvider) {
	                $locationProvider.html5Mode(options.html5Mode);
	            }]);
	    if (options.reducers)
	        app.config(["reducersProvider", function (reducersProvider) {
	                for (var reducer in options.reducers) {
	                    reducersProvider.configure(options.reducers[reducer]);
	                }
	            }]);
	    if (options.actions)
	        for (var action in options.actions) {
	            core_1.provideAction(app, options.actions[action]);
	        }
	    if (options.components) {
	        for (var i = 0; i < options.components.length; i++) {
	            app.component(options.components[i]);
	        }
	    }
	    if (options.guards)
	        for (var i = 0; i < options.guards.length; i++) {
	            core_1.provideRoutePromise(app, options.guards[i]);
	        }
	    if (options.run)
	        for (var i = 0; i < options.run.length; i++) {
	            app.run(options.run[i]);
	        }
	    if (options.providers) {
	        for (var i = 0; i < options.providers.length; i++) {
	            core_1.provide(app, options.providers[i]);
	        }
	    }
	    if (options.routes) {
	        app.config(["$routeProvider", function ($routeProvider) {
	                for (var i_1 = 0; i_1 < options.routes.length; i_1++) {
	                    var path = options.routes[i_1].path;
	                    var selector = options.routes[i_1].component.prototype.constructor.config.selector;
	                    var template = "<" + selector + "></" + selector + ">";
	                    var authorizationRequired = options.routes[i_1].authorizationRequired;
	                    $routeProvider.when(path, { template: template, authorizationRequired: authorizationRequired });
	                }
	            }]);
	    }
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * Base Service for CRUD: Expects a resultful endpoint available
	 */
	var BaseService = (function () {
	    function BaseService($q, apiEndpoint, fetch) {
	        this.$q = $q;
	        this.apiEndpoint = apiEndpoint;
	        this.fetch = fetch;
	    }
	    BaseService.prototype.get = function () {
	        var deferred = this.$q.defer();
	        this.fetch.fromCacheOrService({ method: "GET", url: this.baseUri + "/get" })
	            .then(function (results) { return deferred.resolve(results.data); });
	        return deferred.promise;
	    };
	    ;
	    BaseService.prototype.getById = function (options) {
	        var deferred = this.$q.defer();
	        this.fetch.fromService({ method: "GET", url: this.baseUri + "/getById", params: { id: options.id } })
	            .then(function (results) { return deferred.resolve(results.data); });
	        return deferred.promise;
	    };
	    ;
	    BaseService.prototype.add = function (options) {
	        var deferred = this.$q.defer();
	        this.fetch.fromService({ method: "POST", url: this.baseUri + "/add", data: options.data })
	            .then(function (results) { return deferred.resolve(results.data); });
	        return deferred.promise;
	    };
	    ;
	    BaseService.prototype.update = function (options) {
	        var deferred = this.$q.defer();
	        this.fetch.fromService({ method: "PUT", url: this.baseUri + "/update", data: options.data })
	            .then(function (results) { return deferred.resolve(results.data); });
	        return deferred.promise;
	    };
	    ;
	    BaseService.prototype.remove = function (options) {
	        var deferred = this.$q.defer();
	        this.fetch.fromService({ method: "DELETE", url: this.baseUri + "/remove", params: { id: options.id } })
	            .then(function (results) { return deferred.resolve(results.data); });
	        return deferred.promise;
	    };
	    ;
	    Object.defineProperty(BaseService.prototype, "baseUri", {
	        get: function () { throw new Error("Not Implemented"); },
	        enumerable: true,
	        configurable: true
	    });
	    return BaseService;
	}());
	exports.BaseService = BaseService;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	function Injectable(noop) {
	    if (noop === void 0) { noop = null; }
	    return function (cls) {
	    };
	}
	exports.Injectable = Injectable;


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	function Inject() {
	    return function (target, name, descriptor) {
	    };
	}
	exports.Inject = Inject;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(9));
	var InitialStateProvider = (function () {
	    function InitialStateProvider() {
	        var _this = this;
	        this.configure = function (value) { return _this.initialState = value; };
	        this.$get = function () { return _this.initialState; };
	    }
	    return InitialStateProvider;
	}());
	exports.InitialStateProvider = InitialStateProvider;
	var ReducersProvider = (function () {
	    function ReducersProvider() {
	        var _this = this;
	        this.reducers = [];
	        this.configure = function (value) { return _this.reducers.push(value); };
	        this.$get = function () { return _this.reducers; };
	    }
	    return ReducersProvider;
	}());
	exports.ReducersProvider = ReducersProvider;
	exports.functionName = function (fun) {
	    var ret = fun.toString();
	    ret = ret.substr('function '.length);
	    ret = ret.substr(0, ret.indexOf('('));
	    return ret;
	};
	var Store = (function (_super) {
	    __extends(Store, _super);
	    function Store(dispatcher, initialState, localStorageManager, reducers) {
	        var _this = this;
	        _super.call(this, initialState || {});
	        this.dispatcher = dispatcher;
	        this.localStorageManager = localStorageManager;
	        this.reducers = reducers;
	        this.onDispatcherNext = function (action) {
	            _this.state = _this.state || {};
	            _this.state = _this.setLastTriggeredByActionId(_this.state, action);
	            for (var i = 0; i < _this.reducers.length; i++) {
	                _this.state = _this.reducers[i](_this.state, action);
	            }
	            _this.localStorageManager.put({ name: "initialState", value: _this.state });
	            _this.onNext(_this.state);
	        };
	        this.setLastTriggeredByActionId = function (state, action) {
	            state.lastTriggeredByActionId = action.id;
	            state.lastTriggeredByAction = action;
	            state.lastTriggeredByActionType = action.constructor.type;
	            return state;
	        };
	        this.functionToString = function (fn) {
	            return fn.toString();
	        };
	        this.dispatch = this.dispatcher.dispatch;
	        this.state = initialState || {};
	        dispatcher.subscribe(function (action) { return _this.onDispatcherNext(action); });
	    }
	    return Store;
	}(Rx.BehaviorSubject));
	exports.Store = Store;
	function guid() {
	    function s4() {
	        return Math.floor((1 + Math.random()) * 0x10000)
	            .toString(16)
	            .substring(1);
	    }
	    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	        s4() + '-' + s4() + s4() + s4();
	}
	exports.guid = guid;
	var Dispatcher = (function (_super) {
	    __extends(Dispatcher, _super);
	    function Dispatcher() {
	        var _this = this;
	        _super.call(this);
	        this.dispatch = function (action) { return _this.onNext(action); };
	    }
	    return Dispatcher;
	}(Rx.Subject));
	exports.Dispatcher = Dispatcher;
	angular.module("store", [])
	    .service("store", ["dispatcher", "initialState", "localStorageManager", "reducers", Store])
	    .service("dispatcher", [Dispatcher])
	    .provider("reducers", ReducersProvider)
	    .provider("initialState", InitialStateProvider)
	    .value("guid", guid)
	    .run(["store", function (store) { }]);


/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	var LocalStorageManagerProvider = (function () {
	    function LocalStorageManagerProvider() {
	        var _this = this;
	        this.id = "2fcfe918-dc2c-42db-9e88-ee62417651de";
	        this._items = null;
	        this.get = function (options) {
	            var storageItem = null;
	            for (var i = 0; i < _this.items.length; i++) {
	                if (options.name === _this.items[i].name)
	                    storageItem = _this.items[i].value;
	            }
	            return storageItem;
	        };
	        this.put = function (options) {
	            var itemExists = false;
	            _this.items.forEach(function (item) {
	                if (options.name === item.name) {
	                    itemExists = true;
	                    item.value = options.value;
	                }
	            });
	            if (!itemExists) {
	                var items = _this.items;
	                items.push({ name: options.name, value: options.value });
	                _this.items = items;
	                items = null;
	            }
	        };
	        this.clear = function () {
	            _this._items = [];
	        };
	        this.$get = function () { return _this; };
	        try {
	            window.onbeforeunload = function () { return localStorage.setItem(_this.id, JSON.stringify(_this.items)); };
	        }
	        catch (e) {
	        }
	    }
	    Object.defineProperty(LocalStorageManagerProvider.prototype, "items", {
	        get: function () {
	            if (this._items === null) {
	                var storageItems = localStorage.getItem(this.id);
	                if (storageItems === "null") {
	                    storageItems = null;
	                }
	                this._items = JSON.parse(storageItems || "[]");
	            }
	            return this._items;
	        },
	        set: function (value) {
	            this._items = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return LocalStorageManagerProvider;
	}());
	exports.LocalStorageManagerProvider = LocalStorageManagerProvider;
	angular.module("localStorageManager", []).provider("localStorageManager", LocalStorageManagerProvider);


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	function Action(config) {
	    if (config === void 0) { config = {}; }
	    return function (cls) {
	        cls.type = config.type;
	    };
	}
	exports.Action = Action;


/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";
	exports.pluckOut = function (options) {
	    for (var i = 0; i < options.items.length; i++) {
	        if (options.value == options.items[i][options.key || "id"]) {
	            options.items.splice(i, 1);
	        }
	    }
	    return options.items;
	};


/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * Describes within the change detector which strategy will be used the next time change
	 * detection is triggered.
	 */
	(function (ChangeDetectionStrategy) {
	    /**
	     * `CheckedOnce` means that after calling detectChanges the mode of the change detector
	     * will become `Checked`.
	     */
	    ChangeDetectionStrategy[ChangeDetectionStrategy["CheckOnce"] = 0] = "CheckOnce";
	    /**
	     * `Checked` means that the change detector should be skipped until its mode changes to
	     * `CheckOnce`.
	     */
	    ChangeDetectionStrategy[ChangeDetectionStrategy["Checked"] = 1] = "Checked";
	    /**
	     * `CheckAlways` means that after calling detectChanges the mode of the change detector
	     * will remain `CheckAlways`.
	     */
	    ChangeDetectionStrategy[ChangeDetectionStrategy["CheckAlways"] = 2] = "CheckAlways";
	    /**
	     * `Detached` means that the change detector sub tree is not a part of the main tree and
	     * should be skipped.
	     */
	    ChangeDetectionStrategy[ChangeDetectionStrategy["Detached"] = 3] = "Detached";
	    /**
	     * `OnPush` means that the change detector's mode will be set to `CheckOnce` during hydration.
	     */
	    ChangeDetectionStrategy[ChangeDetectionStrategy["OnPush"] = 4] = "OnPush";
	    /**
	     * `Default` means that the change detector's mode will be set to `CheckAlways` during hydration.
	     */
	    ChangeDetectionStrategy[ChangeDetectionStrategy["Default"] = 5] = "Default";
	})(exports.ChangeDetectionStrategy || (exports.ChangeDetectionStrategy = {}));
	var ChangeDetectionStrategy = exports.ChangeDetectionStrategy;


/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";
	exports.Component = function (config) {
	    if (config === void 0) { config = {}; }
	    return function (cls) {
	        config.component = cls;
	        cls.config = config;
	    };
	};
	exports.CanActivate = function (fnDefinition) {
	    return function (cls) { cls.prototype.canActivate = function () { return fnDefinition; }; };
	};


/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	exports.convertUnixTimestampToDate = function (timestamp) { return new Date(timestamp * 1000); };
	angular.module("convertUnixTimestampToDate", []).value("convertUnixTimestampToDate", exports.convertUnixTimestampToDate);


/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";
	function Service(config) {
	    if (config === void 0) { config = {}; }
	    return function (cls) {
	        cls.serviceName = config.serviceName;
	        cls.$inject = config.viewProviders;
	    };
	}
	exports.Service = Service;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var ends_with_1 = __webpack_require__(17);
	var cachedData = {};
	/**
	 * Caches the returned Observable.
	 * The cache key used is either a property with the name ${propertyKey} from the first arg to the function.
	 * If propertyKey isn't specified or not there, then if the first arg is string, it's used as the key
	 * else we stringify the whole object.
	 *
	 * If there are no args passed to the function, then the function name is the key.
	 */
	function Cache(propertyKey) {
	    return function (target, functionName, descriptor) {
	        var originalMethod = descriptor.value;
	        descriptor.value = function () {
	            var args = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                args[_i - 0] = arguments[_i];
	            }
	            var key = getCacheKey(functionName, propertyKey, args);
	            var cache = cachedData[key];
	            if (cache && cache.data) {
	                return Rx.Observable.of(cache.data);
	            }
	            else if (cache && cache.observable) {
	                return cache.observable;
	            }
	            else {
	                cache = {
	                    observable: originalMethod.apply(this, args)
	                        .map(function (r) {
	                        delete cache.observable;
	                        cache.data = r;
	                        return cache.data;
	                    }).share()
	                };
	                cachedData[key] = cache;
	                return cache.observable;
	            }
	        };
	        return descriptor;
	    };
	}
	exports.Cache = Cache;
	/**
	 * This function clears the cache by @Cache based on the same key and functionName logic.
	 * This function requires the name of the function that would have generated the cache that needs to be cleared.
	 * Also if the function called is 'clearAllCachedData()' then all data is cleared.
	 */
	function ClearCache(functionName, propertyKey) {
	    return function (target, propertyName, descriptor) {
	        var originalMethod = descriptor.value;
	        descriptor.value = function () {
	            var args = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                args[_i - 0] = arguments[_i];
	            }
	            if (functionName === 'clearAllCachedData') {
	                cachedData = {};
	            }
	            else {
	                var key = getCacheKey(functionName, propertyKey, args);
	                delete cachedData[key];
	            }
	            return originalMethod.apply(this, args);
	        };
	        return descriptor;
	    };
	}
	exports.ClearCache = ClearCache;
	function ClearAllFunctionCache(functionInfo) {
	    for (var e in cachedData) {
	        var normalizedKey = e.toLocaleLowerCase();
	        var normalizedFunctionName = functionInfo.name.toLocaleLowerCase();
	        if (normalizedKey.indexOf("/" + normalizedFunctionName + "/") !== -1 ||
	            ends_with_1.endsWith(normalizedKey, normalizedFunctionName) ||
	            normalizedKey.indexOf("/" + normalizedFunctionName + ".") !== -1) {
	            delete cachedData[e];
	        }
	    }
	}
	exports.ClearAllFunctionCache = ClearAllFunctionCache;
	function getCacheKey(functionName, propertyName, args) {
	    var key = functionName + "+";
	    if (propertyName && args && args.length > 0 && args[0][propertyName]) {
	        key += args[0][propertyName];
	    }
	    else if (args && args.length > 0 && typeof args[0] === 'string') {
	        key += args[0];
	    }
	    else if (args && args.length > 1) {
	        key += JSON.stringify(args);
	    }
	    return key;
	}


/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";
	exports.endsWith = function (value1, value2) {
	    return value1.toLowerCase().indexOf(value2.toLowerCase()) === value1.length - value2.length;
	};


/***/ },
/* 18 */
/***/ function(module, exports) {

	"use strict";
	exports.addOrUpdate = function (options) {
	    var exists = false;
	    options.items = options.items || [];
	    for (var i = 0; i < options.items.length; i++) {
	        if (options.items[i].id === options.item.id) {
	            options.items[i] = options.item;
	            exists = true;
	        }
	    }
	    if (!exists) {
	        options.items.push(options.item);
	    }
	};
	angular.module("addOrUpdate", []).value("addOrUpdate", exports.addOrUpdate);


/***/ },
/* 19 */
/***/ function(module, exports) {

	"use strict";
	var BaseActionCreator = (function () {
	    function BaseActionCreator($location, service, dispatcher, guid, addOrUpdateAction, allAction, removeAction, setCurrentAction) {
	        var _this = this;
	        this.$location = $location;
	        this.service = service;
	        this.dispatcher = dispatcher;
	        this.guid = guid;
	        this.addOrUpdateAction = addOrUpdateAction;
	        this.allAction = allAction;
	        this.removeAction = removeAction;
	        this.setCurrentAction = setCurrentAction;
	        this.getById = function (options) {
	            var newId = _this.guid();
	            _this.service.getById({ id: options.id }).then(function (results) {
	                var action = new _this.addOrUpdateAction(newId, results);
	                _this.dispatcher.dispatch(action);
	            });
	            return newId;
	        };
	        this.all = function () {
	            var newId = _this.guid();
	            _this.service.get().then(function (results) {
	                var action = new _this.allAction(newId, results);
	                _this.dispatcher.dispatch(action);
	            });
	            return newId;
	        };
	        this.addOrUpdate = function (options) {
	            var newId = _this.guid();
	            _this.service.add({ data: options.data }).then(function (results) {
	                var action = new _this.addOrUpdateAction(newId, results);
	                _this.dispatcher.dispatch(action);
	            });
	            return newId;
	        };
	        this.remove = function (options) {
	            var newId = _this.guid();
	            _this.service.remove({
	                id: options.entity.id
	            }).then(function (results) {
	                _this.dispatcher.dispatch(new _this.removeAction(newId, options.entity));
	            });
	            return newId;
	        };
	        this.edit = function (options) { return _this.dispatcher.dispatch(new _this.setCurrentAction(options.entity)); };
	        this.create = function () { return _this.dispatcher.dispatch(new _this.setCurrentAction(null)); };
	    }
	    return BaseActionCreator;
	}());
	exports.BaseActionCreator = BaseActionCreator;


/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";
	exports.pluck = function (options) {
	    var item = {};
	    for (var i = 0; i < options.items.length; i++) {
	        if (options.value == options.items[i][options.key || "id"]) {
	            item = angular.copy(options.items[i]);
	        }
	    }
	    return item;
	};


/***/ },
/* 21 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * Defines template and style encapsulation options available for Component's {@link View}.
	 *
	 * See {@link ViewMetadata#encapsulation}.
	 */
	(function (ViewEncapsulation) {
	    /**
	     * Emulate `Native` scoping of styles by adding an attribute containing surrogate id to the Host
	     * Element and pre-processing the style rules provided via
	     * {@link ViewMetadata#styles} or {@link ViewMetadata#stylesUrls}, and adding the new Host Element
	     * attribute to all selectors.
	     *
	     * This is the default option.
	     */
	    ViewEncapsulation[ViewEncapsulation["Emulated"] = 0] = "Emulated";
	    /**
	     * Use the native encapsulation mechanism of the renderer.
	     *
	     * For the DOM this means using [Shadow DOM](https://w3c.github.io/webcomponents/spec/shadow/) and
	     * creating a ShadowRoot for Component's Host Element.
	     */
	    ViewEncapsulation[ViewEncapsulation["Native"] = 1] = "Native";
	    /**
	     * Don't provide any template or style encapsulation.
	     */
	    ViewEncapsulation[ViewEncapsulation["None"] = 2] = "None";
	})(exports.ViewEncapsulation || (exports.ViewEncapsulation = {}));
	var ViewEncapsulation = exports.ViewEncapsulation;


/***/ },
/* 22 */
/***/ function(module, exports) {

	"use strict";
	var Fetch = (function () {
	    function Fetch($http, $q, localStorageManager) {
	        var _this = this;
	        this.$http = $http;
	        this.$q = $q;
	        this.localStorageManager = localStorageManager;
	        this.fromService = function (options) {
	            var deferred = _this.$q.defer();
	            _this.$http({ method: options.method, url: options.url, data: options.data, params: options.params, headers: options.headers }).then(function (results) {
	                deferred.resolve(results);
	            }).catch(function (error) {
	                deferred.reject(error);
	            });
	            return deferred.promise;
	        };
	        this.fromCacheOrService = function (options) {
	            var deferred = _this.$q.defer();
	            var cachedData = _this.localStorageManager.get({ name: options.url });
	            if (!cachedData) {
	                _this.fromService(options).then(function (results) {
	                    deferred.resolve(results);
	                }).catch(function (error) {
	                    deferred.reject(error);
	                });
	            }
	            else {
	                deferred.resolve(cachedData.value);
	            }
	            return deferred.promise;
	        };
	        this.fromService$ = function (options) {
	            var deferred = _this.$q.defer();
	            _this.$http({ method: options.method, url: options.url, data: options.data, params: options.params, headers: options.headers }).then(function (results) {
	                deferred.resolve(results);
	            }).catch(function (error) {
	                deferred.reject(error);
	            });
	            return deferred.promise;
	        };
	    }
	    return Fetch;
	}());
	exports.Fetch = Fetch;
	angular.module("fetch", ["localStorageManager"]).service("fetch", ["$http", "$q", "localStorageManager", Fetch]);


/***/ },
/* 23 */
/***/ function(module, exports) {

	"use strict";
	var LoginRedirectProvider = (function () {
	    function LoginRedirectProvider() {
	        var _this = this;
	        this.loginUrl = "/login";
	        this.defaultPath = "/";
	        this.setLoginUrl = function (value) { return _this.loginUrl = value; };
	        this.setDefaultUrl = function (value) { return _this.defaultPath = value; };
	        this.$get = ["$q", "$location", function ($q, $location) {
	                var _this = this;
	                return {
	                    responseError: function (response) {
	                        if (response.status == 401) {
	                            _this.lastPath = $location.path();
	                            $location.path(_this.loginUrl);
	                        }
	                        return $q.reject(response);
	                    },
	                    redirectToLogin: function () {
	                        _this.lastPath = $location.path();
	                        $location.path(_this.loginUrl);
	                    },
	                    redirectPreLogin: function () {
	                        if (_this.lastPath && _this.lastPath != _this.loginUrl) {
	                            $location.path(_this.lastPath);
	                            _this.lastPath = "";
	                        }
	                        else {
	                            $location.path(_this.defaultPath);
	                        }
	                    }
	                };
	            }];
	    }
	    return LoginRedirectProvider;
	}());
	exports.LoginRedirectProvider = LoginRedirectProvider;
	angular.module("loginRedirect", []).provider("loginRedirect", [LoginRedirectProvider])
	    .config(["$httpProvider", function ($httpProvider) { return $httpProvider.interceptors.push("loginRedirect"); }]);


/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";
	exports.provide = function (app, service) {
	    if (service.$inject) {
	        app.service(service.serviceName, service.$inject.concat([service]));
	    }
	    else {
	        app.service(service.serviceName, [service]);
	    }
	};


/***/ },
/* 25 */
/***/ function(module, exports) {

	"use strict";
	exports.provideAction = function (app, value) {
	    app.value(value.type, value);
	};


/***/ },
/* 26 */
/***/ function(module, exports) {

	"use strict";
	exports.provideRoutePromise = function (app, routePromise) {
	    app.config(["routeResolverServiceProvider", function (routeResolverServiceProvider) {
	            routeResolverServiceProvider.configure({
	                route: routePromise.route,
	                routes: routePromise.routes,
	                key: routePromise.key,
	                promise: routePromise.promise
	            });
	        }]);
	};


/***/ },
/* 27 */
/***/ function(module, exports) {

	"use strict";
	exports.getX = function (element) {
	    var transform = angular.element(element).css("transform");
	    if (transform === "none")
	        return 0;
	    var result = JSON.parse(transform.replace(/^\w+\(/, "[").replace(/\)$/, "]"));
	    return JSON.parse(transform.replace(/^\w+\(/, "[").replace(/\)$/, "]"))[4];
	};
	angular.module("getX", []).value("getX", exports.getX);


/***/ },
/* 28 */
/***/ function(module, exports) {

	"use strict";
	exports.isBetween = function (value, lowerLimit, upperLimit) {
	    if (upperLimit === void 0) { upperLimit = null; }
	    return false;
	};


/***/ },
/* 29 */
/***/ function(module, exports) {

	"use strict";
	exports.translateX = function (element, value) {
	    angular.element(element).css({
	        "-moz-transform": "translateX(" + value + "px)",
	        "-webkit-transform": "translateX(" + value + "px)",
	        "-ms-transform": "translateX(" + value + "px)",
	        "-transform": "translateX(" + value + "px)"
	    });
	    return element;
	};
	angular.module("translateX", []).value("translateX", exports.translateX);


/***/ },
/* 30 */
/***/ function(module, exports) {

	"use strict";
	exports.translateXY = function (element, x, y) {
	    angular.element(element).css({
	        "-moz-transform": "translate(" + x + "px, " + y + "px)",
	        "-webkit-transform": "translate(" + x + "px, " + y + "px)",
	        "-ms-transform": "translate(" + x + "px, " + y + "px)",
	        "-transform": "translate(" + x + "px, " + y + "px)"
	    });
	    return element;
	};
	angular.module("translateXY", []).value("translateXY", exports.translateXY);


/***/ },
/* 31 */
/***/ function(module, exports) {

	"use strict";
	exports.getHtml = function (who, deep) {
	    if (!who || !who.tagName)
	        return '';
	    var txt, ax, el = document.createElement("div");
	    el.appendChild(who.cloneNode(false));
	    txt = el.innerHTML;
	    if (deep) {
	        ax = txt.indexOf('>') + 1;
	        txt = txt.substring(0, ax) + who.innerHTML + txt.substring(ax);
	    }
	    el = null;
	    return txt;
	};
	angular.module("getHtml", []).value("getHtml", exports.getHtml);


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var provide_1 = __webpack_require__(24);
	var service_decorator_1 = __webpack_require__(15);
	(function (scopeType) {
	    scopeType[scopeType["isolated"] = 0] = "isolated";
	    scopeType[scopeType["global"] = 1] = "global";
	})(exports.scopeType || (exports.scopeType = {}));
	var scopeType = exports.scopeType;
	(function (renderOutputType) {
	    renderOutputType[renderOutputType["Html"] = 0] = "Html";
	    renderOutputType[renderOutputType["AugmentedJquery"] = 1] = "AugmentedJquery";
	    renderOutputType[renderOutputType["NativeElement"] = 2] = "NativeElement";
	})(exports.renderOutputType || (exports.renderOutputType = {}));
	var renderOutputType = exports.renderOutputType;
	var Renderer = (function () {
	    function Renderer($compile, $rootScope, getHtml) {
	        var _this = this;
	        this.$compile = $compile;
	        this.$rootScope = $rootScope;
	        this.getHtml = getHtml;
	        this.options = {
	            html: "",
	            outputType: renderOutputType.AugmentedJquery,
	            parentScope: this.$rootScope,
	            isScopeIsolated: true,
	            style: {}
	        };
	        this.render = function (options) {
	            angular.extend(_this.options, options);
	            var augmentedJquery = _this.$compile(options.html)(_this.options.parentScope.$new(_this.options.isScopeIsolated));
	            angular.extend(augmentedJquery[0].style, _this.options.style);
	            if (_this.options.outputType === renderOutputType.NativeElement)
	                return augmentedJquery[0];
	            if (_this.options.outputType === renderOutputType.Html)
	                return _this.getHtml(augmentedJquery[0], false);
	            return augmentedJquery;
	        };
	    }
	    Renderer = __decorate([
	        service_decorator_1.Service({
	            serviceName: "renderer",
	            viewProviders: ["$compile", "$rootScope", "getHtml"]
	        }), 
	        __metadata('design:paramtypes', [Function, Object, Object])
	    ], Renderer);
	    return Renderer;
	}());
	exports.Renderer = Renderer;
	var app = angular.module("renderer", ["getHtml"]);
	provide_1.provide(app, Renderer);


/***/ },
/* 33 */
/***/ function(module, exports) {

	"use strict";
	exports.setElementBackgroundImage = function (augmentedJQuery, backgroundImageUrl) {
	    if (backgroundImageUrl)
	        augmentedJQuery[0].style.backgroundImage = "url('" + backgroundImageUrl + "')";
	};
	angular.module("setElementBackgroundImage", [])
	    .value("setElementBackgroundImage", exports.setElementBackgroundImage);


/***/ },
/* 34 */
/***/ function(module, exports) {

	"use strict";
	exports.setElementDimension = function (dimension, augmentedJQuery, value) {
	    if (value && (value.indexOf("%") > -1 || value.indexOf("px") > -1)) {
	        augmentedJQuery[0].style[dimension] = "" + value;
	    }
	    else {
	        augmentedJQuery[0].style[dimension] = value + "px";
	    }
	};
	angular.module("setElementDimension", [])
	    .value("setElementDimension", exports.setElementDimension);


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var set_element_dimension_1 = __webpack_require__(34);
	exports.setElementDimensions = function (augmentedJQuery, height, width) {
	    set_element_dimension_1.setElementDimension("height", augmentedJQuery, height);
	    set_element_dimension_1.setElementDimension("width", augmentedJQuery, width);
	};
	angular.module("setElementDimensions", [])
	    .value("setElementDimensions", exports.setElementDimensions);


/***/ },
/* 36 */
/***/ function(module, exports) {

	"use strict";
	var ApiEndpointProvider = (function () {
	    function ApiEndpointProvider() {
	        var _this = this;
	        this.config = {
	            getBaseUrl: function (name) {
	                var baseUrl = "";
	                if (name) {
	                    _this.config.baseUrls.forEach(function (endpointDefinition) {
	                        if (name === endpointDefinition.name) {
	                            baseUrl = endpointDefinition.url;
	                        }
	                    });
	                }
	                if (!name || baseUrl === "") {
	                    _this.config.baseUrls.forEach(function (endpointDefinition) {
	                        if (!endpointDefinition.name && baseUrl === "") {
	                            baseUrl = endpointDefinition.url;
	                        }
	                    });
	                }
	                return baseUrl;
	            },
	            baseUrls: [],
	            configure: function (baseUrl, name) {
	                var self = this;
	                self.baseUrls.push({ url: baseUrl, name: name });
	            }
	        };
	    }
	    ApiEndpointProvider.prototype.configure = function (baseUrl, name) {
	        this.config.baseUrls.push({ url: baseUrl, name: name });
	    };
	    ApiEndpointProvider.prototype.$get = function () {
	        return this.config;
	    };
	    return ApiEndpointProvider;
	}());
	exports.ApiEndpointProvider = ApiEndpointProvider;
	angular.module("apiEndpoint", []).provider("apiEndpoint", ApiEndpointProvider);


/***/ },
/* 37 */
/***/ function(module, exports) {

	"use strict";
	var $q = angular.injector(['ng']).get("$q");
	/**
	 * @description Append To Body Asynchrously
	 * @param options
	 */
	exports.appendToBodyAsync = function (options) {
	    var deferred = $q.defer();
	    document.body.appendChild(options.nativeElement);
	    setTimeout(function () { deferred.resolve(); }, options.wait || 100);
	    return deferred.promise;
	};
	angular.module("appendToBodyAsync", []).value("appendToBodyAsync", exports.appendToBodyAsync);


/***/ },
/* 38 */
/***/ function(module, exports) {

	var AuthInterceptor = (function () {
	    function AuthInterceptor(store) {
	        var _this = this;
	        this.store = store;
	        this.storeOnChange = function (state) { _this.token = state.token; };
	        this.request = function (config) {
	            if (_this.token)
	                config.headers.Authorization = "Bearer " + _this.token;
	            return config;
	        };
	        this.token = null;
	        store.subscribe(this.storeOnChange);
	    }
	    AuthInterceptor.createInstance = function (store) { return new AuthInterceptor(store); };
	    return AuthInterceptor;
	}());
	angular.module("authInterceptor", ["store"])
	    .factory("authInterceptor", ["store", function (store) { return new AuthInterceptor(store); }])
	    .config(["$httpProvider", function ($httpProvider) { return $httpProvider.interceptors.push("authInterceptor"); }]);


/***/ },
/* 39 */
/***/ function(module, exports) {

	// Extracted from Underscore.js 1.5.2
	function debounce(func, wait, immediate) {
	    var timeout, args, context, timestamp, result;
	    return function () {
	        context = this;
	        args = arguments;
	        timestamp = new Date();
	        var later = function () {
	            var last = (new Date()) - timestamp;
	            if (last < wait) {
	                timeout = setTimeout(later, wait - last);
	            }
	            else {
	                timeout = null;
	                if (!immediate) {
	                    result = func.apply(context, args);
	                }
	            }
	        };
	        var callNow = immediate && !timeout;
	        if (!timeout) {
	            timeout = setTimeout(later, wait);
	        }
	        if (callNow) {
	            result = func.apply(context, args);
	        }
	        return result;
	    };
	}
	angular.module("debounce", []).value("debounce", debounce);


/***/ },
/* 40 */
/***/ function(module, exports) {

	"use strict";
	var $q = angular.injector(['ng']).get("$q");
	exports.extendCssAsync = function (options) {
	    return $q.when(angular.extend(options.nativeHTMLElement.style, options.cssObject));
	};
	angular.module("extendCssAsync", []).value("extendCssAsync", exports.extendCssAsync);


/***/ },
/* 41 */
/***/ function(module, exports) {

	"use strict";
	exports.getFromUrlSync = function (options) {
	    var responseText = "";
	    var xhr = new XMLHttpRequest();
	    xhr.open("GET", options.url, false);
	    xhr.onload = function (e) {
	        if (xhr.readyState === 4) {
	            if (xhr.status === 200) {
	                responseText = xhr.responseText;
	            }
	            else {
	                console.error(xhr.statusText);
	            }
	        }
	    };
	    xhr.send(null);
	    return responseText;
	};
	angular.module("getFromUrlSync", []).value("getFromUrlSync", exports.getFromUrlSync);


/***/ },
/* 42 */
/***/ function(module, exports) {

	"use strict";
	angular.module("invokeAsync", []).value("invokeAsync", function (options) {
	    var store = angular.element(document.body).injector().get("store");
	    var $q = angular.element(document.body).injector().get("$q");
	    if (angular.isFunction(options)) {
	        options = { action: options };
	    }
	    ;
	    var deferred = $q.defer();
	    var actionId = options.params ? options.action(options.params) : options.action();
	    var subscription = store.subscribe(function (state) {
	        if (state.lastTriggeredByActionId == actionId) {
	            if (subscription)
	                subscription.dispose();
	            deferred.resolve();
	        }
	    });
	    return deferred.promise;
	});


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var originalAngularModule = angular.module;
	var componentStyles = {};
	var get_html_1 = __webpack_require__(31);
	angular.module = function () {
	    var m = originalAngularModule.apply(this, arguments);
	    m.component = function (component) {
	        var options = component.config;
	        var componentNameCamelCase = options.selector.replace(/-([a-z])/g, function (g) {
	            return g[1].toUpperCase();
	        });
	        var componentName = componentNameCamelCase + "Component";
	        if (options.component.canActivate) {
	            m.config(["routeResolverServiceProvider", function (routeResolverServiceProvider) {
	                    routeResolverServiceProvider.configure({
	                        routeTemplate: "<" + options.selector + "></" + options.selector + ">",
	                        route: options.route,
	                        routes: options.routes,
	                        key: options.key,
	                        promise: options.component.canActivate()
	                    });
	                }
	            ]);
	        }
	        if (options.component.prototype.canActivate) {
	            m.config(["routeResolverServiceProvider", function (routeResolverServiceProvider) {
	                    routeResolverServiceProvider.configure({
	                        routeTemplate: "<" + options.selector + "></" + options.selector + ">",
	                        route: options.route,
	                        routes: options.routes,
	                        key: options.key,
	                        promise: options.component.prototype.canActivate()
	                    });
	                }
	            ]);
	        }
	        var directiveDefinitionObject = {
	            restrict: options.restrict || "E",
	            template: angular.isArray(options.template) ? options.template.join(" \n ") : options.template,
	            templateUrl: options.templateUrl,
	            replace: options.replace || true,
	            scope: angular.isUndefined(options.scope) ? {} : options.scope,
	            bindToController: options.bindToController || {},
	            transclude: options.transclude,
	            controllerAs: "vm",
	            require: options.require,
	            controller: componentName
	        };
	        options.component.$inject = options.viewProviders;
	        if (options.inputs && options.inputs.length > 0) {
	            for (var i = 0; i < options.inputs.length; i++) {
	                if (options.inputs[i].substring(0, 2) === "on") {
	                    directiveDefinitionObject.bindToController[options.inputs[i]] = "&";
	                }
	                else if (options.inputs[i].substring(0, 1) === "@"
	                    || options.inputs[i].substring(0, 1) === "&"
	                    || options.inputs[i].substring(0, 1) === "=") {
	                    directiveDefinitionObject.bindToController[options.inputs[i].substr(1)] = options.inputs[i].substring(0, 1);
	                }
	                else {
	                    directiveDefinitionObject.bindToController[options.inputs[i]] = "=";
	                }
	            }
	        }
	        directiveDefinitionObject.compile = function (template) {
	            return {
	                pre: function (scope, element, attributes, controller, transcludeFn) {
	                    if (options.transclude)
	                        transcludeFn(scope, function (clone) {
	                        });
	                    if (document.body && angular.element(document.body.childNodes[0]) && angular.element(document.body.childNodes[0]).injector()) {
	                        var $injector = angular.element(document.body.childNodes[0]).injector();
	                        var store = $injector.get("store");
	                        var safeDigest = $injector.get("safeDigest");
	                        if (scope.vm && scope.vm.storeOnChange) {
	                            var subscription = store.subscribe(function (state) {
	                                scope.vm.storeOnChange(state);
	                                safeDigest(scope);
	                            });
	                            scope.$on("$destroy", function () { return subscription.dispose(); });
	                        }
	                    }
	                },
	                post: function (scope, element, attributes, controller) {
	                    if (options.require) {
	                        var requiredComponentName = options.require.replace("^", "");
	                        scope.vm[requiredComponentName] = controller;
	                    }
	                    if (options.transclude && scope.vm.$transclude)
	                        scope.vm.$transclude(scope.$new(), function (clone) {
	                            if (scope.vm.hasOwnProperty("template"))
	                                scope.vm.template = template;
	                            if (template[0].nodeType === 1)
	                                var documentFragment = angular.element("<div></div>");
	                            for (var i = 0; i < clone[0].children[0].children.length; i++) {
	                                documentFragment.append(clone[0].children[0].children[i]);
	                            }
	                            scope.vm.clone = get_html_1.getHtml(documentFragment[0], true);
	                        });
	                    if (scope.vm && scope.vm.ngOnInit)
	                        scope.vm.ngOnInit();
	                    if (scope.vm.ngOnDestroy)
	                        scope.$on("$destroy", function () {
	                            scope.vm.dispose();
	                        });
	                }
	            };
	        };
	        m.directive(componentNameCamelCase, [function () { return directiveDefinitionObject; }]);
	        m.controller(componentName, options.component);
	    };
	    return m;
	};


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var Position = (function () {
	    function Position(ruler, space, translateXY) {
	        var _this = this;
	        this.ruler = ruler;
	        this.space = space;
	        this.translateXY = translateXY;
	        this.somewhere = function (a, b, space, directionPriorityList) {
	            return _this.ruler.measure({ elements: [a, b] })
	                .then(function (resultsArray) {
	                var aRectangle = resultsArray[0];
	                var bRectangle = resultsArray[1];
	                var widthNeeded = bRectangle.width + space;
	                var heightNeeded = bRectangle.height + space;
	                var resolved = false;
	                for (var i = 0; i < directionPriorityList.length; i++) {
	                    switch (directionPriorityList[i]) {
	                        case "top":
	                            if (aRectangle.top > heightNeeded && !resolved) {
	                                _this.translate(b, aRectangle, bRectangle, space, "above");
	                                resolved = true;
	                            }
	                            break;
	                        case "bottom":
	                            if (window.innerHeight - aRectangle.bottom > heightNeeded && !resolved) {
	                                _this.translate(b, aRectangle, bRectangle, space, "below");
	                                resolved = true;
	                            }
	                            break;
	                        case "left":
	                            if (aRectangle.left > widthNeeded && !resolved) {
	                                _this.translate(b, aRectangle, bRectangle, space, "left");
	                                resolved = true;
	                            }
	                            break;
	                        case "right":
	                            if (window.innerWidth - aRectangle.bottom > widthNeeded && !resolved) {
	                                _this.translate(b, aRectangle, bRectangle, space, "right");
	                                resolved = true;
	                            }
	                            break;
	                    }
	                }
	            });
	        };
	        this.above = function (a, b, space) {
	            return _this.ruler.measure({ elements: [a, b] })
	                .then(function (resultsArray) {
	                _this.translate(b, resultsArray[0], resultsArray[1], space, "above");
	            });
	        };
	        this.below = function (a, b, space) {
	            return _this.ruler.measure({ elements: [a, b] })
	                .then(function (resultsArray) {
	                _this.translate(b, resultsArray[0], resultsArray[1], space, "below");
	            });
	        };
	        this.left = function (a, b, space) {
	            return _this.ruler.measure({ elements: [a, b] })
	                .then(function (resultsArray) {
	                _this.translate(b, resultsArray[0], resultsArray[1], space, "left");
	            });
	        };
	        this.right = function (a, b, space) {
	            return _this.ruler.measure({ elements: [a, b] })
	                .then(function (resultsArray) {
	                _this.translate(b, resultsArray[0], resultsArray[1], space, "right");
	            });
	        };
	        this.translate = function (htmlElement, aRectangle, bRectangle, space, side) {
	            if (side === "above")
	                _this.translateXY(htmlElement, aRectangle.centerX - bRectangle.radiusX, aRectangle.top - space - bRectangle.height);
	            if (side === "below")
	                _this.translateXY(htmlElement, aRectangle.centerX - bRectangle.radiusX, aRectangle.bottom + space);
	            if (side === "left")
	                _this.translateXY(htmlElement, aRectangle.left - space - bRectangle.width, aRectangle.centerY - bRectangle.radiusY);
	            if (side === "right")
	                _this.translateXY(htmlElement, aRectangle.right + space, aRectangle.centerY - bRectangle.radiusY);
	        };
	    }
	    Position = __decorate([
	        core_1.Injectable(),
	        core_1.Service({
	            serviceName: "position",
	            viewProviders: ["ruler", "space", "translateXY"]
	        }), 
	        __metadata('design:paramtypes', [Object, Object, Function])
	    ], Position);
	    return Position;
	}());
	exports.Position = Position;
	var app = angular.module("position", [
	    "ruler",
	    "space",
	    "translateXY"
	]);
	core_1.provide(app, Position);


/***/ },
/* 45 */
/***/ function(module, exports) {

	"use strict";
	exports.removeElement = function (options) {
	    if (options.nativeHTMLElement) {
	        var $target = angular.element(options.nativeHTMLElement);
	        options.nativeHTMLElement.parentNode.removeChild(options.nativeHTMLElement);
	        $target.remove();
	        delete options.nativeHTMLElement;
	    }
	};
	angular.module("removeElement", []).value("removeElement", exports.removeElement);


/***/ },
/* 46 */
/***/ function(module, exports) {

	"use strict";
	var RouteResolverServiceProvider = (function () {
	    function RouteResolverServiceProvider() {
	        var _this = this;
	        this.configure = function (routePromise) { _this._routePromises.push(routePromise); };
	        this.$get = ["$injector", "$q", function ($injector, $q) {
	                return {
	                    resolve: function (options) {
	                        _this._routeParams = options.routeParams;
	                        var deferred = $q.defer();
	                        var resolvedRouteData = {};
	                        var routePromises = _this.getRoutePromises({ routeName: options.routeName, routeTemplate: options.routeTemplate });
	                        if (routePromises.length < 1)
	                            return $q.when(true);
	                        var prioritizedGroups = _this.reduceRoutePromisesByPriority(routePromises);
	                        _this.invoke($injector, $q, prioritizedGroups, 0, function () {
	                            deferred.resolve(resolvedRouteData);
	                        }, resolvedRouteData);
	                        return deferred.promise;
	                    }
	                };
	            }
	        ];
	        this._routePromises = [];
	        /**
	        * @name getRoutePromises
	        * @description the route promises that will be resolved on an route
	        * if the value of the route key matches the route definition '/foo/{id}' or '/foos'
	        * include that routePromises
	        * if the route promise has route value of '*' the promise will be resolve on every route
	        * if the selector in template form ie <selector></selector>, matches the template of the route,
	        * the components canActivate route promise will be resolved
	        */
	        this.getRoutePromises = function (options) {
	            return _this._routePromises.filter(function (routePromise) {
	                if (routePromise.route && routePromise.route === "*")
	                    return true;
	                if (routePromise.route)
	                    return routePromise.route === options.routeName;
	                if (routePromise.routes)
	                    return routePromise.routes.indexOf(options.routeName) > -1;
	                if (routePromise.routeTemplate)
	                    return routePromise.routeTemplate === options.routeTemplate;
	                return false;
	            });
	        };
	        /**
	         * Reduce RoutePromises into prioritized groups
	         * Put the route promises with the same priority in the same group
	         * Eventually will be resolve together asynchronously with $q.all
	         */
	        this.reduceRoutePromisesByPriority = function (routePromises) {
	            var priorities = [];
	            var routePromisesPrioritizedGroups = [];
	            routePromises.forEach(function (promise) {
	                if (priorities.indexOf(promise.priority) < 0)
	                    priorities.push(promise.priority);
	            });
	            priorities.forEach(function (priority, index) {
	                routePromisesPrioritizedGroups.push({
	                    promises: routePromises.filter(function (promise) { return promise.priority == priority; }),
	                    priority: priority,
	                    isLast: index == priorities.length - 1
	                });
	            });
	            return routePromisesPrioritizedGroups;
	        };
	        /**
	         * Invoke the grouped promises. Reducing the results into the resolvedRouteData object
	         * If the route promise inside the group has a key defined, the result will be attached to the
	         * resolved object (routeData) using that key
	         * After you reach the last group, call the callback that will resolve the object that
	         * will have a key value dictionary with the results of any promises with a key defined
	         */
	        this.invoke = function ($injector, $q, groups, currentGroupIndex, callback, resolvedRouteData) {
	            var excutedPromises = [];
	            var currentGroup = groups[currentGroupIndex];
	            currentGroup.promises.forEach(function (statePromise) {
	                excutedPromises.push($injector.invoke(statePromise.promise));
	            });
	            $q.all(excutedPromises).then(function (results) {
	                results.forEach(function (result, index) {
	                    if (currentGroup.promises[index].key)
	                        resolvedRouteData[currentGroup.promises[index].key] = results[index];
	                });
	                currentGroup.isLast ? callback() : _this.invoke($injector, $q, groups, currentGroupIndex + 1, callback, resolvedRouteData);
	            });
	        };
	    }
	    Object.defineProperty(RouteResolverServiceProvider.prototype, "routePromises", {
	        /**
	         * get route promises ordered by priority (ASC)
	         * priority 1 runs before priority 10
	         */
	        get: function () {
	            return this._routePromises.sort(function (a, b) {
	                return a.priority - b.priority;
	            });
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return RouteResolverServiceProvider;
	}());
	angular.module("routeResolver", [])
	    .provider("routeResolverService", [RouteResolverServiceProvider]);


/***/ },
/* 47 */
/***/ function(module, exports) {

	"use strict";
	var routeConfigs = [];
	angular.module("routeWhenExtension", ["ngRoute"])
	    .config(["$routeProvider", function ($routeProvider) {
	        var whenFn = $routeProvider.when;
	        function getTemplateUrlFromComponentName(options) {
	            if (options.componentName.length > 9) {
	                if (options.componentName.substr(options.componentName.length - 9) === "Component") {
	                    var componentTemplateFileName = options.componentName.substr(0, options.componentName.length - 9) + ".html";
	                    return "/wwwroot/components/" + componentTemplateFileName;
	                }
	            }
	            return "";
	        }
	        $routeProvider.when = function () {
	            if (arguments[1] && arguments[0]) {
	                var routeName_1 = arguments[0];
	                var routeTemplate_1 = arguments[1].template;
	                arguments[1].caseInsensitiveMatch = true;
	                arguments[1].templateUrl = arguments[1].componentTemplateUrl || arguments[1].templateUrl;
	                arguments[1].controller = arguments[1].componentName || arguments[1].controller;
	                arguments[1].controllerAs = "vm";
	                arguments[1].reloadOnSearch = arguments[1].reloadOnSearch || false;
	                if (arguments[1].componentName && !arguments[1].templateUrl)
	                    arguments[1].templateUrl = getTemplateUrlFromComponentName({
	                        moduleName: arguments[1].moduleName,
	                        componentName: arguments[1].componentName
	                    });
	                arguments[1].resolve = arguments[1].resolve || {};
	                angular.extend(arguments[1].resolve, {
	                    routeData: [
	                        "routeResolverService", function (routeResolverService) { return routeResolverService.resolve({ routeName: routeName_1, routeTemplate: routeTemplate_1 }); }
	                    ]
	                });
	            }
	            routeConfigs.push({
	                when: arguments[0],
	                config: arguments[1]
	            });
	            whenFn.apply($routeProvider, arguments);
	            return $routeProvider;
	        };
	    }]);


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var Rectangle = (function () {
	    function Rectangle() {
	        this.createInstance = function (options) {
	            var instance = new Rectangle();
	            if (options.clientRect) {
	                instance.left = options.clientRect.left;
	                instance.top = options.clientRect.top;
	                instance.height = options.clientRect.height;
	                instance.width = options.clientRect.width;
	            }
	            else {
	                instance.left = options.left;
	                instance.top = options.top;
	                instance.height = options.height;
	                instance.width = options.width;
	            }
	            return instance;
	        };
	    }
	    Object.defineProperty(Rectangle.prototype, "right", {
	        get: function () { return this.left + this.width; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Rectangle.prototype, "bottom", {
	        get: function () { return this.top + this.height; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Rectangle.prototype, "centerX", {
	        get: function () { return this.left + (this.width / 2); },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Rectangle.prototype, "centerY", {
	        get: function () { return this.top + (this.height / 2); },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Rectangle.prototype, "radiusX", {
	        get: function () { return this.width / 2; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Rectangle.prototype, "radiusY", {
	        get: function () { return this.height / 2; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Rectangle.prototype, "middle", {
	        get: function () { return { x: this.centerX, y: this.centerY }; },
	        enumerable: true,
	        configurable: true
	    });
	    Rectangle = __decorate([
	        core_1.Service({
	            serviceName: "rectangle"
	        }), 
	        __metadata('design:paramtypes', [])
	    ], Rectangle);
	    return Rectangle;
	}());
	exports.Rectangle = Rectangle;
	var app = angular.module("rectangle", []);
	core_1.provide(app, Rectangle);


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var Ruler = (function () {
	    function Ruler($document, $q, $timeout, rectangle) {
	        var _this = this;
	        this.$document = $document;
	        this.$q = $q;
	        this.$timeout = $timeout;
	        this.rectangle = rectangle;
	        this.measure = function (options) {
	            if (options.element)
	                return _this.measureHtmlElement(options.element);
	            return _this.$q.all(options.elements.map(function (x) { return _this.measureHtmlElement(x); }));
	        };
	        this.measureHtmlElement = function (element) {
	            var deferred = _this.$q.defer();
	            var documentRef = angular.element(_this.$document)[0];
	            if (documentRef.body.contains(element)) {
	                deferred.resolve(_this.rectangle.createInstance({ clientRect: element.getBoundingClientRect() }));
	            }
	            else {
	                _this.$timeout(function () {
	                    documentRef.body.appendChild(element);
	                    var clientRect = element.getBoundingClientRect();
	                    element.parentNode.removeChild(element);
	                    deferred.resolve(_this.rectangle.createInstance({ clientRect: clientRect }));
	                }, 0, false);
	            }
	            return deferred.promise;
	        };
	    }
	    Ruler = __decorate([
	        core_1.Service({
	            serviceName: "ruler",
	            viewProviders: ["$document", "$q", "$timeout", "rectangle"]
	        }), 
	        __metadata('design:paramtypes', [Object, Function, Function, Object])
	    ], Ruler);
	    return Ruler;
	}());
	exports.Ruler = Ruler;
	var app = angular.module("ruler", [
	    "rectangle",
	]);
	core_1.provide(app, Ruler);


/***/ },
/* 50 */
/***/ function(module, exports) {

	angular.module("safeDigest", []).value("safeDigest", function (scope) {
	    if (!scope.$$phase && (scope.$root && !scope.$root.$$phase))
	        scope.$digest();
	});


/***/ },
/* 51 */
/***/ function(module, exports) {

	"use strict";
	var $q = angular.injector(['ng']).get("$q");
	exports.setOpacityAsync = function (options) {
	    var deferred = $q.defer();
	    if (options.nativeHtmlElement) {
	        options.nativeHtmlElement.style.opacity = options.opacity;
	        options.nativeHtmlElement.addEventListener('transitionend', resolve, false);
	    }
	    function resolve() {
	        options.nativeHtmlElement.removeEventListener('transitionend', resolve);
	        deferred.resolve();
	    }
	    return deferred.promise;
	};
	angular.module("setOpacityAsync", []).value("setOpacityAsync", exports.setOpacityAsync);


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var Space = (function () {
	    function Space() {
	        this.above = function (spaceNeed, rectangle) {
	            return false;
	        };
	        this.below = function (spaceNeed, rectangle) {
	            return false;
	        };
	        this.left = function (spaceNeed, rectangle) {
	            return false;
	        };
	        this.right = function (spaceNeed, rectangle) {
	            return false;
	        };
	    }
	    Space = __decorate([
	        core_1.Service({
	            serviceName: "space"
	        }), 
	        __metadata('design:paramtypes', [])
	    ], Space);
	    return Space;
	}());
	exports.Space = Space;
	var app = angular.module("space", []);
	core_1.provide(app, Space);


/***/ },
/* 53 */
/***/ function(module, exports) {

	"use strict";
	var $q = angular.injector(['ng']).get("$q");
	exports.translateXAsync = function (options) {
	    var deferred = $q.defer();
	    angular.element(options.element).css({
	        "-moz-transform": "translateX(" + options.x + "px)",
	        "-webkit-transform": "translateX(" + options.x + "px)",
	        "-ms-transform": "translateX(" + options.x + "px)",
	        "-transform": "translateX(" + options.x + "px)"
	    });
	    options.element.addEventListener('transitionend', resolve, false);
	    function resolve() {
	        options.element.removeEventListener('transitionend', resolve);
	        deferred.resolve();
	    }
	    return deferred.promise;
	};
	angular.module("translateXAsync", []).value("translateXAsync", exports.translateXAsync);


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var Template = (function () {
	    function Template($http, $q, $templateCache) {
	        var _this = this;
	        this.$http = $http;
	        this.$q = $q;
	        this.$templateCache = $templateCache;
	        this.get = function (options) {
	            var deferred = _this.$q.defer();
	            var cacheResult = _this.$templateCache.get(options.templateUrl);
	            if (cacheResult) {
	                if (Array.isArray(cacheResult))
	                    deferred.resolve(cacheResult[1]);
	                deferred.resolve(cacheResult);
	                return deferred.promise;
	            }
	            _this.$http.get(options.templateUrl, { cache: _this.$templateCache }).then(function (response) {
	                deferred.resolve(response.data);
	            });
	            return deferred.promise;
	        };
	    }
	    Template = __decorate([
	        core_1.Service({
	            serviceName: "template",
	            viewProviders: ["$http", "$q", "$templateCache"]
	        }), 
	        __metadata('design:paramtypes', [Function, Function, Object])
	    ], Template);
	    return Template;
	}());
	exports.Template = Template;
	var app = angular.module("template", []);
	core_1.provide(app, Template);


/***/ },
/* 55 */
/***/ function(module, exports) {

	angular.module("formEncode", []).value("formEncode", function (data) {
	    var pairs = [];
	    for (var name in data) {
	        pairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
	    }
	    return pairs.join('&').replace(/%20/g, '+');
	});


/***/ },
/* 56 */
/***/ function(module, exports) {

	module.exports = "<div class=\"article-editor-container\">\r\n\r\n</div>\r\n"

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(58);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./article-editor-container.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./article-editor-container.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 59 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var ArticlesContainerComponent = (function () {
	    function ArticlesContainerComponent() {
	    }
	    ArticlesContainerComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(62),
	            styles: [__webpack_require__(63)],
	            selector: "articles-container",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], ArticlesContainerComponent);
	    return ArticlesContainerComponent;
	}());
	exports.ArticlesContainerComponent = ArticlesContainerComponent;


/***/ },
/* 62 */
/***/ function(module, exports) {

	module.exports = "<div class=\"articles-container\">\r\n    <h1>Articles</h1>\r\n</div>\r\n"

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(64);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./articles-container.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./articles-container.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var ArticleContainerComponent = (function () {
	    function ArticleContainerComponent() {
	    }
	    ArticleContainerComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(66),
	            styles: [__webpack_require__(67)],
	            selector: "article-container",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], ArticleContainerComponent);
	    return ArticleContainerComponent;
	}());
	exports.ArticleContainerComponent = ArticleContainerComponent;


/***/ },
/* 66 */
/***/ function(module, exports) {

	module.exports = "<div class=\"article-container\">\r\n\r\n</div>\r\n"

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(68);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./article-container.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./article-container.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var article_editor_container_component_1 = __webpack_require__(2);
	var articles_container_component_1 = __webpack_require__(61);
	var article_container_component_1 = __webpack_require__(65);
	exports.ArticlesRoutes = [
	    {
	        path: "/blog",
	        component: articles_container_component_1.ArticlesContainerComponent
	    },
	    {
	        path: "/article/:slug",
	        component: article_container_component_1.ArticleContainerComponent
	    },
	    {
	        path: "/admin/articles",
	        component: article_editor_container_component_1.ArticleEditorContainerComponent,
	        authorizationRequired: true
	    },
	    {
	        path: "/admin/article/:articleid",
	        component: article_editor_container_component_1.ArticleEditorContainerComponent,
	        authorizationRequired: true
	    }
	];


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var core_1 = __webpack_require__(3);
	var contact_container_component_1 = __webpack_require__(71);
	var contact_editor_component_1 = __webpack_require__(80);
	var contact_action_creator_1 = __webpack_require__(72);
	var contact_service_1 = __webpack_require__(84);
	var contactsModule = angular.module("quinntynebrown.contacts", []);
	core_1.bootstrap(contactsModule, {
	    components: [contact_container_component_1.ContactContainerComponent, contact_editor_component_1.ContactEditorComponent],
	    providers: [contact_action_creator_1.ContactActionCreator, contact_service_1.ContactService]
	});
	__export(__webpack_require__(85));


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var contact_action_creator_1 = __webpack_require__(72);
	var contact_model_1 = __webpack_require__(76);
	var contact_actions_1 = __webpack_require__(75);
	var ContactContainerComponent = (function () {
	    function ContactContainerComponent(contactActionCreator) {
	        var _this = this;
	        this.contactActionCreator = contactActionCreator;
	        this.storeOnChange = function (state) {
	            if (state.lastTriggeredByAction instanceof contact_actions_1.AddOrUpdateContactAction) {
	                _this.contactReceived = true;
	                _this.entity = new contact_model_1.Contact();
	            }
	        };
	        this.entity = new contact_model_1.Contact();
	        this.contactReceived = false;
	    }
	    ContactContainerComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(77),
	            styles: [__webpack_require__(78)],
	            selector: "contact-container",
	            viewProviders: ["contactActionCreator"],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [contact_action_creator_1.ContactActionCreator])
	    ], ContactContainerComponent);
	    return ContactContainerComponent;
	}());
	exports.ContactContainerComponent = ContactContainerComponent;


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var modal_action_creator_1 = __webpack_require__(73);
	var contact_actions_1 = __webpack_require__(75);
	var ContactActionCreator = (function (_super) {
	    __extends(ContactActionCreator, _super);
	    function ContactActionCreator($location, dispatcher, contactService, guid, invokeAsync, modalActionCreator) {
	        var _this = this;
	        _super.call(this, $location, contactService, dispatcher, guid, contact_actions_1.AddOrUpdateContactAction, contact_actions_1.AllContactsAction, contact_actions_1.RemoveContactAction, contact_actions_1.SetCurrentContactAction);
	        this.invokeAsync = invokeAsync;
	        this.modalActionCreator = modalActionCreator;
	        this.addOrUpdateSuccess = function (options) { return _this.dispatcher.dispatch(new contact_actions_1.AddOrUpdateContactSuccessAction(options.entity)); };
	        this.currentContactRemoved = function () { return _this.dispatcher.dispatch(new contact_actions_1.CurrentContactRemovedAction()); };
	        this.openAllContactsModal = function () {
	            _this.invokeAsync(_this.all).then(function (results) {
	                _this.modalActionCreator.open({ html: "<all-contact-modal></all-contact-modal>" });
	            });
	        };
	    }
	    ContactActionCreator = __decorate([
	        core_1.Service({
	            serviceName: "contactActionCreator",
	            viewProviders: ["$location", "dispatcher", "contactService", "guid", "invokeAsync", "modalActionCreator"]
	        }), 
	        __metadata('design:paramtypes', [Object, Object, Object, Object, Object, modal_action_creator_1.ModalActionCreator])
	    ], ContactActionCreator);
	    return ContactActionCreator;
	}(core_1.BaseActionCreator));
	exports.ContactActionCreator = ContactActionCreator;


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var modal_actions_1 = __webpack_require__(74);
	var core_1 = __webpack_require__(3);
	var ModalActionCreator = (function () {
	    function ModalActionCreator($rootScope, dispatcher) {
	        var _this = this;
	        this.$rootScope = $rootScope;
	        this.dispatcher = dispatcher;
	        this.open = function (options) { return _this.dispatcher.dispatch(new modal_actions_1.OpenModalAction(options.html)); };
	        this.close = function () { return _this.dispatcher.dispatch(new modal_actions_1.CloseModalAction()); };
	        $rootScope.$on("$routeChangeSuccess", this.close);
	    }
	    ModalActionCreator = __decorate([
	        core_1.Service({
	            serviceName: "modalActionCreator",
	            viewProviders: ["$rootScope", "dispatcher"]
	        }), 
	        __metadata('design:paramtypes', [Object, Object])
	    ], ModalActionCreator);
	    return ModalActionCreator;
	}());
	exports.ModalActionCreator = ModalActionCreator;


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var OpenModalAction = (function () {
	    function OpenModalAction(html) {
	        this.html = html;
	    }
	    OpenModalAction = __decorate([
	        core_1.Action({
	            type: "modal.openModalAction"
	        }), 
	        __metadata('design:paramtypes', [Object])
	    ], OpenModalAction);
	    return OpenModalAction;
	}());
	exports.OpenModalAction = OpenModalAction;
	var CloseModalAction = (function () {
	    function CloseModalAction() {
	    }
	    CloseModalAction = __decorate([
	        core_1.Action({
	            type: "modal.closeModalAction"
	        }), 
	        __metadata('design:paramtypes', [])
	    ], CloseModalAction);
	    return CloseModalAction;
	}());
	exports.CloseModalAction = CloseModalAction;


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var AddOrUpdateContactAction = (function () {
	    function AddOrUpdateContactAction(id, entity) {
	        this.id = id;
	        this.entity = entity;
	    }
	    AddOrUpdateContactAction = __decorate([
	        core_1.Action({
	            type: "contact.addOrUpdatecontactAction"
	        }), 
	        __metadata('design:paramtypes', [Object, Object])
	    ], AddOrUpdateContactAction);
	    return AddOrUpdateContactAction;
	}());
	exports.AddOrUpdateContactAction = AddOrUpdateContactAction;
	var AllContactsAction = (function () {
	    function AllContactsAction(id, entities) {
	        this.id = id;
	        this.entities = entities;
	    }
	    AllContactsAction = __decorate([
	        core_1.Action({
	            type: "contact.allcontactsAction"
	        }), 
	        __metadata('design:paramtypes', [Object, Object])
	    ], AllContactsAction);
	    return AllContactsAction;
	}());
	exports.AllContactsAction = AllContactsAction;
	var RemoveContactAction = (function () {
	    function RemoveContactAction(id, entity) {
	        this.id = id;
	        this.entity = entity;
	    }
	    RemoveContactAction = __decorate([
	        core_1.Action({
	            type: "contact.removecontactAction"
	        }), 
	        __metadata('design:paramtypes', [Object, Object])
	    ], RemoveContactAction);
	    return RemoveContactAction;
	}());
	exports.RemoveContactAction = RemoveContactAction;
	var ContactsFilterAction = (function () {
	    function ContactsFilterAction(id, term) {
	        this.id = id;
	        this.term = term;
	    }
	    ContactsFilterAction = __decorate([
	        core_1.Action({
	            type: "contact.sFilterActioncontactsFilterAction"
	        }), 
	        __metadata('design:paramtypes', [Object, Object])
	    ], ContactsFilterAction);
	    return ContactsFilterAction;
	}());
	exports.ContactsFilterAction = ContactsFilterAction;
	var SetCurrentContactAction = (function () {
	    function SetCurrentContactAction(entity) {
	        this.entity = entity;
	    }
	    SetCurrentContactAction = __decorate([
	        core_1.Action({
	            type: "contact.setCurrentcontactAction"
	        }), 
	        __metadata('design:paramtypes', [Object])
	    ], SetCurrentContactAction);
	    return SetCurrentContactAction;
	}());
	exports.SetCurrentContactAction = SetCurrentContactAction;
	var AddOrUpdateContactSuccessAction = (function () {
	    function AddOrUpdateContactSuccessAction(entity) {
	        this.entity = entity;
	    }
	    AddOrUpdateContactSuccessAction = __decorate([
	        core_1.Action({
	            type: "contact.addOrUpdatecontactSuccessAction"
	        }), 
	        __metadata('design:paramtypes', [Object])
	    ], AddOrUpdateContactSuccessAction);
	    return AddOrUpdateContactSuccessAction;
	}());
	exports.AddOrUpdateContactSuccessAction = AddOrUpdateContactSuccessAction;
	var CurrentContactRemovedAction = (function () {
	    function CurrentContactRemovedAction() {
	    }
	    CurrentContactRemovedAction = __decorate([
	        core_1.Action({
	            type: "contact.currentcontactRemovedAction"
	        }), 
	        __metadata('design:paramtypes', [])
	    ], CurrentContactRemovedAction);
	    return CurrentContactRemovedAction;
	}());
	exports.CurrentContactRemovedAction = CurrentContactRemovedAction;


/***/ },
/* 76 */
/***/ function(module, exports) {

	"use strict";
	var Contact = (function () {
	    function Contact() {
	    }
	    return Contact;
	}());
	exports.Contact = Contact;


/***/ },
/* 77 */
/***/ function(module, exports) {

	module.exports = "<div class=\"contact-container\">\r\n    <contact-editor on-try-to-save-contact=\"vm.onTryToSaveContact\" entity=\"vm.entity\" data-ng-if=\"!vm.contactReceived\"></contact-editor>\r\n    <div class=\"contact-info-received\" data-ng-if=\"vm.contactReceived\">\r\n        <h2>Thank you!</h2>\r\n        <p>Your information has been received. Quinntyne Brown will be in contact with you as soon as possible.</p>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(79);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./contact-container.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./contact-container.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, ".contact-info-received {\n  padding-top: 60px;\n  margin: 0 auto;\n  max-width: 500px; }\n", ""]);

	// exports


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var contact_action_creator_1 = __webpack_require__(72);
	var ContactEditorComponent = (function () {
	    function ContactEditorComponent(contactActionCreator) {
	        var _this = this;
	        this.contactActionCreator = contactActionCreator;
	        this.onTryToSaveContact = function (options) {
	            _this.contactActionCreator.addOrUpdate({
	                data: options.data
	            });
	        };
	    }
	    ContactEditorComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(81),
	            styles: [__webpack_require__(82)],
	            selector: "contact-editor",
	            inputs: ["entity"],
	            viewProviders: ["contactActionCreator"],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [contact_action_creator_1.ContactActionCreator])
	    ], ContactEditorComponent);
	    return ContactEditorComponent;
	}());
	exports.ContactEditorComponent = ContactEditorComponent;


/***/ },
/* 81 */
/***/ function(module, exports) {

	module.exports = "<div class=\"contact-editor\">\r\n\r\n    <div class=\"contact-editor-inner\">\r\n\r\n        <div class=\"contact-editor-form\">\r\n            <h2>Contact</h2>\r\n\r\n            <div>\r\n                <input type=\"text\" class=\"contact-editor-form-input\" placeholder=\"Name\" data-ng-model=\"vm.entity.name\" />\r\n            </div>\r\n            <div>\r\n                <input type=\"text\" class=\"contact-editor-form-input\" placeholder=\"Email\" data-ng-model=\"vm.entity.email\" />\r\n            </div>\r\n            <div>\r\n                <textarea rows=\"10\" class=\"contact-editor-form-input\" placeholder=\"Message\" data-ng-model=\"vm.entity.message\" />\r\n            </div>\r\n\r\n            <div class=\"submit-contact\" data-ng-click=\"vm.onTryToSaveContact({ data: vm.entity })\">Send Message</div>\r\n\r\n        </div>\r\n\r\n    </div>\r\n\r\n</div>\r\n"

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(83);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./contact-editor.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./contact-editor.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, ".contact-editor {\n  width: 100%;\n  padding-top: 60px; }\n\n.contact-editor-inner {\n  margin: 0 auto;\n  max-width: 1280px; }\n\n.contact-editor-form {\n  max-width: 500px;\n  margin: 0 auto; }\n\n.contact-editor-form-input {\n  margin-bottom: 15px;\n  max-width: 500px;\n  width: 100%;\n  padding: 10px; }\n\n.submit-contact {\n  cursor: pointer;\n  line-height: 4em;\n  border: solid 2px #EEE;\n  padding-right: 15px;\n  padding-left: 15px;\n  padding-top: 10px;\n  padding-bottom: 10px;\n  display: inline; }\n", ""]);

	// exports


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var ContactService = (function (_super) {
	    __extends(ContactService, _super);
	    function ContactService($q, apiEndpoint, fetch) {
	        _super.call(this, $q, apiEndpoint, fetch);
	    }
	    Object.defineProperty(ContactService.prototype, "baseUri", {
	        get: function () { return this.apiEndpoint.getBaseUrl() + "/contact"; },
	        enumerable: true,
	        configurable: true
	    });
	    ContactService = __decorate([
	        core_1.Injectable(),
	        core_1.Service({
	            serviceName: "contactService",
	            viewProviders: ["$q", "apiEndpoint", "fetch"]
	        }), 
	        __metadata('design:paramtypes', [Function, Object, Object])
	    ], ContactService);
	    return ContactService;
	}(core_1.BaseService));
	exports.ContactService = ContactService;


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var contact_container_component_1 = __webpack_require__(71);
	exports.ContactsRoutes = [
	    {
	        path: "/contact",
	        component: contact_container_component_1.ContactContainerComponent
	    }
	];


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var core_1 = __webpack_require__(3);
	var customer_component_1 = __webpack_require__(87);
	var customer_action_creator_1 = __webpack_require__(91);
	var reducers = __webpack_require__(92);
	var actions = __webpack_require__(93);
	var customersModule = angular.module("quinntynebrown.customers", []);
	core_1.bootstrap(customersModule, {
	    components: [customer_component_1.CustomerComponent],
	    providers: [customer_action_creator_1.CustomerActionCreator],
	    reducers: reducers,
	    actions: actions
	});
	__export(__webpack_require__(94));


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var CustomerComponent = (function () {
	    function CustomerComponent() {
	    }
	    CustomerComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(88),
	            styles: [__webpack_require__(89)],
	            selector: "customer",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], CustomerComponent);
	    return CustomerComponent;
	}());
	exports.CustomerComponent = CustomerComponent;


/***/ },
/* 88 */
/***/ function(module, exports) {

	module.exports = "<div class=\"customer\">\r\n\r\n</div>\r\n"

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(90);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./customer.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./customer.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var modal_action_creator_1 = __webpack_require__(73);
	var CustomerActionCreator = (function () {
	    function CustomerActionCreator(dispatcher, guid, invokeAsync, modalActionCreator) {
	        this.dispatcher = dispatcher;
	        this.guid = guid;
	        this.invokeAsync = invokeAsync;
	        this.modalActionCreator = modalActionCreator;
	    }
	    CustomerActionCreator = __decorate([
	        core_1.Service({
	            serviceName: "customerActionCreator",
	            viewProviders: ["dispatcher", "guid", "invokeAsync", "modalActionCreator"]
	        }), 
	        __metadata('design:paramtypes', [Object, Object, Object, modal_action_creator_1.ModalActionCreator])
	    ], CustomerActionCreator);
	    return CustomerActionCreator;
	}());
	exports.CustomerActionCreator = CustomerActionCreator;


/***/ },
/* 92 */
/***/ function(module, exports) {

	"use strict";


/***/ },
/* 93 */
/***/ function(module, exports) {

	"use strict";
	var Default = (function () {
	    function Default() {
	    }
	    return Default;
	}());
	exports.Default = Default;


/***/ },
/* 94 */
/***/ function(module, exports) {

	"use strict";
	exports.CustomersRoutes = [];


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var core_1 = __webpack_require__(3);
	var gallery_component_1 = __webpack_require__(96);
	var galleries_container_component_1 = __webpack_require__(100);
	var featured_gallery_container_component_1 = __webpack_require__(104);
	var gallery_editor_container_component_1 = __webpack_require__(108);
	var gallery_action_creator_1 = __webpack_require__(112);
	var reducers = __webpack_require__(113);
	var actions = __webpack_require__(114);
	var galleriesModule = angular.module("quinntynebrown.galleries", []);
	core_1.bootstrap(galleriesModule, {
	    components: [gallery_component_1.GalleryComponent, gallery_editor_container_component_1.GalleryEditorContainerComponent, galleries_container_component_1.GalleriesContainerComponent, featured_gallery_container_component_1.FeaturedGalleryContainerComponent],
	    providers: [gallery_action_creator_1.GalleryActionCreator],
	    reducers: reducers,
	    actions: actions
	});
	__export(__webpack_require__(115));


/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var GalleryComponent = (function () {
	    function GalleryComponent() {
	    }
	    GalleryComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(97),
	            styles: [__webpack_require__(98)],
	            selector: "gallery",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], GalleryComponent);
	    return GalleryComponent;
	}());
	exports.GalleryComponent = GalleryComponent;


/***/ },
/* 97 */
/***/ function(module, exports) {

	module.exports = "<div class=\"gallery\">\r\n\r\n</div>\r\n"

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(99);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./gallery.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./gallery.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var GalleriesContainerComponent = (function () {
	    function GalleriesContainerComponent() {
	    }
	    GalleriesContainerComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(101),
	            styles: [__webpack_require__(102)],
	            selector: "galleries-container",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], GalleriesContainerComponent);
	    return GalleriesContainerComponent;
	}());
	exports.GalleriesContainerComponent = GalleriesContainerComponent;


/***/ },
/* 101 */
/***/ function(module, exports) {

	module.exports = "<div class=\"galleries-container\">\r\n\r\n</div>\r\n"

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(103);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./galleries-container.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./galleries-container.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var FeaturedGalleryContainerComponent = (function () {
	    function FeaturedGalleryContainerComponent() {
	    }
	    FeaturedGalleryContainerComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(105),
	            styles: [__webpack_require__(106)],
	            selector: "featured-gallery-container",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], FeaturedGalleryContainerComponent);
	    return FeaturedGalleryContainerComponent;
	}());
	exports.FeaturedGalleryContainerComponent = FeaturedGalleryContainerComponent;


/***/ },
/* 105 */
/***/ function(module, exports) {

	module.exports = "<div class=\"featured-gallery-container\">\r\n    <div class=\"featured-gallery-container-inner\">\r\n        <img class=\"featured-gallery-container-img\" src=\"src/assets/images/Squad.jpg\" />\r\n    </div>    \r\n</div>\r\n"

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(107);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./featured-gallery-container.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./featured-gallery-container.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, ".featured-gallery-container {\n  margin-top: 60px; }\n\n.featured-gallery-container-inner {\n  max-width: 1280px;\n  margin: 0 auto; }\n\n.featured-gallery-container-img {\n  width: 100%;\n  max-width: 1280px; }\n", ""]);

	// exports


/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var GalleryEditorContainerComponent = (function () {
	    function GalleryEditorContainerComponent() {
	    }
	    GalleryEditorContainerComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(109),
	            styles: [__webpack_require__(110)],
	            selector: "gallery-editor-container",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], GalleryEditorContainerComponent);
	    return GalleryEditorContainerComponent;
	}());
	exports.GalleryEditorContainerComponent = GalleryEditorContainerComponent;


/***/ },
/* 109 */
/***/ function(module, exports) {

	module.exports = "<div class=\"gallery-editor-container\">\r\n    <h1>Gallery Editor Container</h1>\r\n</div>\r\n"

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(111);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./gallery-editor-container.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./gallery-editor-container.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var modal_action_creator_1 = __webpack_require__(73);
	var GalleryActionCreator = (function () {
	    function GalleryActionCreator(dispatcher, guid, invokeAsync, modalActionCreator) {
	        this.dispatcher = dispatcher;
	        this.guid = guid;
	        this.invokeAsync = invokeAsync;
	        this.modalActionCreator = modalActionCreator;
	    }
	    GalleryActionCreator = __decorate([
	        core_1.Service({
	            serviceName: "galleryActionCreator",
	            viewProviders: ["dispatcher", "guid", "invokeAsync", "modalActionCreator"]
	        }), 
	        __metadata('design:paramtypes', [Object, Object, Object, modal_action_creator_1.ModalActionCreator])
	    ], GalleryActionCreator);
	    return GalleryActionCreator;
	}());
	exports.GalleryActionCreator = GalleryActionCreator;


/***/ },
/* 113 */
/***/ function(module, exports) {

	"use strict";


/***/ },
/* 114 */
/***/ function(module, exports) {

	"use strict";
	var Default = (function () {
	    function Default() {
	    }
	    return Default;
	}());
	exports.Default = Default;


/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var gallery_editor_container_component_1 = __webpack_require__(108);
	var gallery_container_component_1 = __webpack_require__(116);
	var featured_gallery_container_component_1 = __webpack_require__(104);
	exports.GalleriesRoutes = [
	    {
	        path: "/",
	        component: featured_gallery_container_component_1.FeaturedGalleryContainerComponent,
	    },
	    {
	        path: "/gallery/:slug",
	        component: gallery_container_component_1.GalleryContainerComponent
	    },
	    {
	        path: "/admin",
	        component: gallery_editor_container_component_1.GalleryEditorContainerComponent,
	        authorizationRequired: true
	    },
	    {
	        path: "/admin/gallery/:galleryid",
	        component: gallery_editor_container_component_1.GalleryEditorContainerComponent,
	        authorizationRequired: true
	    }
	];


/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var GalleryContainerComponent = (function () {
	    function GalleryContainerComponent() {
	    }
	    GalleryContainerComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(117),
	            styles: [__webpack_require__(118)],
	            selector: "gallery-container",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], GalleryContainerComponent);
	    return GalleryContainerComponent;
	}());
	exports.GalleryContainerComponent = GalleryContainerComponent;


/***/ },
/* 117 */
/***/ function(module, exports) {

	module.exports = "<div class=\"gallery-container\">\r\n\r\n</div>\r\n"

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(119);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./gallery-container.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./gallery-container.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var core_1 = __webpack_require__(3);
	var login_container_component_1 = __webpack_require__(121);
	var loginModule = angular.module("quinntynebrown.login", []);
	core_1.bootstrap(loginModule, {
	    components: [login_container_component_1.LoginContainerComponent]
	});
	__export(__webpack_require__(125));


/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var LoginContainerComponent = (function () {
	    function LoginContainerComponent(loginRedirect) {
	        var _this = this;
	        this.loginRedirect = loginRedirect;
	        this.storeOnChange = function (state) {
	            if (state.lastTriggeredByActionType == "login.userLoggedInAction")
	                _this.loginRedirect.redirectPreLogin();
	        };
	    }
	    LoginContainerComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(122),
	            styles: [__webpack_require__(123)],
	            selector: "da-login-container",
	            viewProviders: ["loginRedirect"],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [Object])
	    ], LoginContainerComponent);
	    return LoginContainerComponent;
	}());
	exports.LoginContainerComponent = LoginContainerComponent;


/***/ },
/* 122 */
/***/ function(module, exports) {

	module.exports = "<div class=\"login-container\">\r\n    <login></login>\r\n</div>\r\n"

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(124);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./login-container.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./login-container.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var login_container_component_1 = __webpack_require__(121);
	exports.LoginRoutes = [
	    {
	        path: "/login",
	        component: login_container_component_1.LoginContainerComponent
	    }
	];


/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var core_1 = __webpack_require__(3);
	var photo_component_1 = __webpack_require__(127);
	var photo_editor_container_component_1 = __webpack_require__(131);
	var photo_action_creator_1 = __webpack_require__(135);
	var reducers = __webpack_require__(136);
	var actions = __webpack_require__(137);
	var photosModule = angular.module("quinntynebrown.photos", []);
	core_1.bootstrap(photosModule, {
	    components: [photo_component_1.PhotoComponent, photo_editor_container_component_1.PhotoEditorContainerComponent],
	    providers: [photo_action_creator_1.PhotoActionCreator],
	    reducers: reducers,
	    actions: actions
	});
	__export(__webpack_require__(138));


/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var PhotoComponent = (function () {
	    function PhotoComponent() {
	    }
	    PhotoComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(128),
	            styles: [__webpack_require__(129)],
	            selector: "photo",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], PhotoComponent);
	    return PhotoComponent;
	}());
	exports.PhotoComponent = PhotoComponent;


/***/ },
/* 128 */
/***/ function(module, exports) {

	module.exports = "<div class=\"photo\">\r\n\r\n</div>\r\n"

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(130);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./photo.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./photo.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var PhotoEditorContainerComponent = (function () {
	    function PhotoEditorContainerComponent() {
	    }
	    PhotoEditorContainerComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(132),
	            styles: [__webpack_require__(133)],
	            selector: "photo-editor-container",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], PhotoEditorContainerComponent);
	    return PhotoEditorContainerComponent;
	}());
	exports.PhotoEditorContainerComponent = PhotoEditorContainerComponent;


/***/ },
/* 132 */
/***/ function(module, exports) {

	module.exports = "<div class=\"photo-editor-container\">\r\n\r\n</div>\r\n"

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(134);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./photo-editor-container.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./photo-editor-container.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var modal_action_creator_1 = __webpack_require__(73);
	var PhotoActionCreator = (function () {
	    function PhotoActionCreator(dispatcher, guid, invokeAsync, modalActionCreator) {
	        this.dispatcher = dispatcher;
	        this.guid = guid;
	        this.invokeAsync = invokeAsync;
	        this.modalActionCreator = modalActionCreator;
	    }
	    PhotoActionCreator = __decorate([
	        core_1.Service({
	            serviceName: "photoActionCreator",
	            viewProviders: ["dispatcher", "guid", "invokeAsync", "modalActionCreator"]
	        }), 
	        __metadata('design:paramtypes', [Object, Object, Object, modal_action_creator_1.ModalActionCreator])
	    ], PhotoActionCreator);
	    return PhotoActionCreator;
	}());
	exports.PhotoActionCreator = PhotoActionCreator;


/***/ },
/* 136 */
/***/ function(module, exports) {

	"use strict";


/***/ },
/* 137 */
/***/ function(module, exports) {

	"use strict";
	var Default = (function () {
	    function Default() {
	    }
	    return Default;
	}());
	exports.Default = Default;


/***/ },
/* 138 */
/***/ function(module, exports) {

	"use strict";
	exports.PhotosRoutes = [];


/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(140);
	var core_1 = __webpack_require__(3);
	var app_footer_component_1 = __webpack_require__(142);
	var app_header_component_1 = __webpack_require__(146);
	var admin_header_component_1 = __webpack_require__(150);
	var sharedModule = angular.module("quinntynebrown.shared", []);
	core_1.bootstrap(sharedModule, {
	    components: [app_footer_component_1.AppFooterComponent, app_header_component_1.AppHeaderComponent, admin_header_component_1.AdminHeaderComponent],
	});


/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(141);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./shared.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./shared.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, ".admin-content-container:after {\n  content: \" \";\n  display: block; }\n\n.admin-side-nav {\n  position: relative;\n  float: left;\n  width: 200px; }\n\n.admin-main-content {\n  position: relative;\n  float: left; }\n\n.admin-app {\n  padding-left: 10px;\n  padding-right: 10px; }\n\n.admin-side-nav ul {\n  list-style-type: none; }\n\n.admin-side-nav a {\n  cursor: pointer;\n  text-decoration: none;\n  color: #272727;\n  line-height: 1.5em; }\n", ""]);

	// exports


/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var AppFooterComponent = (function () {
	    function AppFooterComponent() {
	    }
	    AppFooterComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(143),
	            styles: [__webpack_require__(144)],
	            selector: "app-footer",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], AppFooterComponent);
	    return AppFooterComponent;
	}());
	exports.AppFooterComponent = AppFooterComponent;


/***/ },
/* 143 */
/***/ function(module, exports) {

	module.exports = "<div class=\"app-footer\">\r\n\r\n</div>\r\n"

/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(145);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./app-footer.component.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./app-footer.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var AppHeaderComponent = (function () {
	    function AppHeaderComponent() {
	        this._title = "Quinntyne Brown";
	    }
	    Object.defineProperty(AppHeaderComponent.prototype, "title", {
	        get: function () { return this._title; },
	        enumerable: true,
	        configurable: true
	    });
	    AppHeaderComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(147),
	            styles: [__webpack_require__(148)],
	            selector: "app-header",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], AppHeaderComponent);
	    return AppHeaderComponent;
	}());
	exports.AppHeaderComponent = AppHeaderComponent;


/***/ },
/* 147 */
/***/ function(module, exports) {

	module.exports = "<div class=\"app-header\">\r\n    <div class=\"app-header-inner\">\r\n        <h1>\r\n            {{ ::vm.title }}\r\n        </h1>\r\n        <div class=\"app-header-sub-nav\">\r\n            <a href=\"/\">Home</a>\r\n            &nbsp;&nbsp;|&nbsp;&nbsp;\r\n            <a>Blog</a>\r\n            &nbsp;&nbsp;|&nbsp;&nbsp;\r\n            <a>About</a>\r\n            &nbsp;&nbsp;|&nbsp;&nbsp;\r\n            <a href=\"/contact\">Contact</a>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(149);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./app-header.component.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./app-header.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, ".app-header {\n  width: 100%;\n  font-family: Lato;\n  color: #272727; }\n  .app-header a {\n    text-decoration: none;\n    color: #272727; }\n\n.app-header-inner {\n  max-width: 1280px;\n  margin: 0 auto;\n  text-align: center;\n  letter-spacing: -0.5px; }\n\n.app-header-sub-nav {\n  text-transform: uppercase;\n  font-family: Roboto;\n  font-weight: 100;\n  cursor: pointer; }\n", ""]);

	// exports


/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var AdminHeaderComponent = (function () {
	    function AdminHeaderComponent() {
	    }
	    AdminHeaderComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(151),
	            styles: [__webpack_require__(152)],
	            selector: "admin-header",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], AdminHeaderComponent);
	    return AdminHeaderComponent;
	}());
	exports.AdminHeaderComponent = AdminHeaderComponent;


/***/ },
/* 151 */
/***/ function(module, exports) {

	module.exports = "<div class=\"admin-header\">\r\n    <div class=\"admin-header-inner\">\r\n        <h1>\r\n            QB: Admin\r\n        </h1>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(153);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./admin-header.component.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./admin-header.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var core_1 = __webpack_require__(3);
	var photographer_component_1 = __webpack_require__(155);
	var photographer_action_creator_1 = __webpack_require__(159);
	var reducers = __webpack_require__(160);
	var actions = __webpack_require__(161);
	var photographersModule = angular.module("quinntynebrown.photographers", []);
	core_1.bootstrap(photographersModule, {
	    components: [photographer_component_1.PhotographerComponent],
	    providers: [photographer_action_creator_1.PhotographerActionCreator],
	    reducers: reducers,
	    actions: actions
	});
	__export(__webpack_require__(162));


/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var PhotographerComponent = (function () {
	    function PhotographerComponent() {
	    }
	    PhotographerComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(156),
	            styles: [__webpack_require__(157)],
	            selector: "photographer",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], PhotographerComponent);
	    return PhotographerComponent;
	}());
	exports.PhotographerComponent = PhotographerComponent;


/***/ },
/* 156 */
/***/ function(module, exports) {

	module.exports = "<div class=\"photographer\">\r\n\r\n</div>\r\n"

/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(158);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./photographer.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./photographer.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var modal_action_creator_1 = __webpack_require__(73);
	var PhotographerActionCreator = (function () {
	    function PhotographerActionCreator(dispatcher, guid, invokeAsync, modalActionCreator) {
	        this.dispatcher = dispatcher;
	        this.guid = guid;
	        this.invokeAsync = invokeAsync;
	        this.modalActionCreator = modalActionCreator;
	    }
	    PhotographerActionCreator = __decorate([
	        core_1.Service({
	            serviceName: "photographerActionCreator",
	            viewProviders: ["dispatcher", "guid", "invokeAsync", "modalActionCreator"]
	        }), 
	        __metadata('design:paramtypes', [Object, Object, Object, modal_action_creator_1.ModalActionCreator])
	    ], PhotographerActionCreator);
	    return PhotographerActionCreator;
	}());
	exports.PhotographerActionCreator = PhotographerActionCreator;


/***/ },
/* 160 */
/***/ function(module, exports) {

	"use strict";


/***/ },
/* 161 */
/***/ function(module, exports) {

	"use strict";
	var Default = (function () {
	    function Default() {
	    }
	    return Default;
	}());
	exports.Default = Default;


/***/ },
/* 162 */
/***/ function(module, exports) {

	"use strict";
	exports.PhotographersRoutes = [];


/***/ },
/* 163 */
/***/ function(module, exports) {

	"use strict";
	exports.authorizationGuard = {
	    route: "*",
	    promise: ["loginRedirect", "$q", "$route", "invokeAsync", "store", "userActionCreator", function (loginRedirect, $q, $route, invokeAsync, store, userActionCreator) {
	            var deferred = $q.defer();
	            invokeAsync(userActionCreator.current).then(function (results) {
	                if ($route.current.$$route.authorizationRequired && !store.getValue().currentUser) {
	                    loginRedirect.redirectToLogin();
	                    deferred.reject();
	                }
	                else {
	                    deferred.resolve();
	                }
	            });
	            return deferred.promise;
	        }],
	    priority: -999
	};


/***/ },
/* 164 */
/***/ function(module, exports) {

	"use strict";
	exports.routeChangeSuccessIsAdminReducer = ["$location", "$rootScope", function ($location, $rootScope) {
	        $rootScope.$on("$routeChangeSuccess", function () {
	            var path = $location.path();
	            if (path.length >= 6 && (path.substring(0, 6) == "/admin" || path.substring(0, 6) == "/login")) {
	                $rootScope.isAdmin = true;
	            }
	            else {
	                $rootScope.isAdmin = false;
	            }
	        });
	    }];


/***/ }
/******/ ]);