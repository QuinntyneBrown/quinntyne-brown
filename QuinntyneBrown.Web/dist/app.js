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
	__webpack_require__(90);
	__webpack_require__(201);
	__webpack_require__(210);
	__webpack_require__(235);
	__webpack_require__(241);
	__webpack_require__(264);
	__webpack_require__(277);
	__webpack_require__(300);
	__webpack_require__(323);
	__webpack_require__(338);
	//Pages
	__webpack_require__(361);
	__webpack_require__(367);
	var articles_1 = __webpack_require__(1);
	var contacts_1 = __webpack_require__(70);
	var customers_1 = __webpack_require__(201);
	var galleries_1 = __webpack_require__(210);
	var login_1 = __webpack_require__(235);
	var photos_1 = __webpack_require__(264);
	var photographers_1 = __webpack_require__(373);
	var products_1 = __webpack_require__(277);
	var quotes_1 = __webpack_require__(300);
	var orders_1 = __webpack_require__(241);
	var content_aggregation_1 = __webpack_require__(90);
	var social_share_items_1 = __webpack_require__(338);
	var biography_page_1 = __webpack_require__(361);
	var thank_you_page_1 = __webpack_require__(367);
	var core_1 = __webpack_require__(3);
	var authorization_guard_1 = __webpack_require__(382);
	var route_change_success_is_admin_reducer_1 = __webpack_require__(383);
	var app_component_1 = __webpack_require__(384);
	var admin_app_component_1 = __webpack_require__(388);
	var quinntynebrownAppModule = angular.module("quinntynebrownApp", [
	    "components",
	    "quinntynebrown.biographyPage",
	    "quinntynebrown.thankYouPage",
	    "app.contentAggregation",
	    "quinntynebrown.articles",
	    "quinntynebrown.contacts",
	    "quinntynebrown.customers",
	    "quinntynebrown.galleries",
	    "quinntynebrown.login",
	    "quinntynebrown.orders",
	    "quinntynebrown.photos",
	    "quinntynebrown.photographers",
	    "quinntynebrown.products",
	    "quinntynebrown.quotes",
	    "quinntynebrown.shared",
	    "quinntynebrown.socialShareItems"
	]);
	core_1.bootstrap(quinntynebrownAppModule, {
	    api: "api",
	    components: [app_component_1.AppComponent, admin_app_component_1.AdminAppComponent],
	    loginRedirectUrl: "/",
	    html5Mode: true,
	    guards: [authorization_guard_1.authorizationGuard],
	    run: [route_change_success_is_admin_reducer_1.routeChangeSuccessIsAdminReducer],
	    routes: biography_page_1.BiographyPageRoutes.concat(thank_you_page_1.ThankYouPageRoutes, articles_1.ArticlesRoutes, contacts_1.ContactsRoutes, content_aggregation_1.ContentAggregationRoutes, customers_1.CustomersRoutes, galleries_1.GalleriesRoutes, login_1.LoginRoutes, orders_1.OrdersRoutes, photos_1.PhotosRoutes, photographers_1.PhotographersRoutes, products_1.ProductsRoutes, quotes_1.QuotesRoutes, social_share_items_1.SocialShareItemsRoutes)
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
	    if (options.reducers && !angular.isArray(options.reducers)) {
	        app.config(["reducersProvider", function (reducersProvider) {
	                for (var reducer in options.reducers) {
	                    reducersProvider.configure(options.reducers[reducer]);
	                }
	            }]);
	    }
	    if (options.reducers && angular.isArray(options.reducers)) {
	        options.reducers.forEach(function (x) {
	            app.config(["reducersProvider", function (reducersProvider) {
	                    for (var reducer in x) {
	                        reducersProvider.configure(x[reducer]);
	                    }
	                }]);
	        });
	    }
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
	var contacts_container_component_1 = __webpack_require__(80);
	var contact_editor_component_1 = __webpack_require__(84);
	var contact_action_creator_1 = __webpack_require__(72);
	var contact_service_1 = __webpack_require__(88);
	var contactsModule = angular.module("quinntynebrown.contacts", []);
	core_1.bootstrap(contactsModule, {
	    components: [contact_container_component_1.ContactContainerComponent, contacts_container_component_1.ContactsContainerComponent, contact_editor_component_1.ContactEditorComponent],
	    providers: [contact_action_creator_1.ContactActionCreator, contact_service_1.ContactService]
	});
	__export(__webpack_require__(89));


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
	var ContactsContainerComponent = (function () {
	    function ContactsContainerComponent() {
	    }
	    ContactsContainerComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(81),
	            styles: [__webpack_require__(82)],
	            selector: "contacts-container",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], ContactsContainerComponent);
	    return ContactsContainerComponent;
	}());
	exports.ContactsContainerComponent = ContactsContainerComponent;


/***/ },
/* 81 */
/***/ function(module, exports) {

	module.exports = "<div class=\"contacts-container\">\r\n\r\n</div>\r\n"

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
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./contacts-container.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./contacts-container.component.scss");
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
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 84 */
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
	            template: __webpack_require__(85),
	            styles: [__webpack_require__(86)],
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
/* 85 */
/***/ function(module, exports) {

	module.exports = "<div class=\"contact-editor\">\r\n\r\n    <div class=\"contact-editor-inner\">\r\n\r\n        <div class=\"contact-editor-form\">\r\n            <h2>Contact</h2>\r\n\r\n            <div>\r\n                <input type=\"text\" class=\"contact-editor-form-input\" placeholder=\"Name\" data-ng-model=\"vm.entity.name\" />\r\n            </div>\r\n            <div>\r\n                <input type=\"text\" class=\"contact-editor-form-input\" placeholder=\"Email\" data-ng-model=\"vm.entity.email\" />\r\n            </div>\r\n            <div>\r\n                <textarea rows=\"10\" class=\"contact-editor-form-input\" placeholder=\"Message\" data-ng-model=\"vm.entity.message\" />\r\n            </div>\r\n\r\n            <div class=\"submit-contact\" data-ng-click=\"vm.onTryToSaveContact({ data: vm.entity })\">Send Message</div>\r\n\r\n        </div>\r\n\r\n    </div>\r\n\r\n</div>\r\n"

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(87);
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
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, ".contact-editor {\n  width: 100%;\n  padding-top: 60px; }\n\n.contact-editor-inner {\n  margin: 0 auto;\n  max-width: 1280px; }\n\n.contact-editor-form {\n  max-width: 500px;\n  margin: 0 auto; }\n\n.contact-editor-form-input {\n  margin-bottom: 15px;\n  max-width: 500px;\n  width: 100%;\n  padding: 10px; }\n\n.submit-contact {\n  cursor: pointer;\n  line-height: 4em;\n  border: solid 2px #EEE;\n  padding-right: 15px;\n  padding-left: 15px;\n  padding-top: 10px;\n  padding-bottom: 10px;\n  display: inline; }\n", ""]);

	// exports


/***/ },
/* 88 */
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
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var contact_container_component_1 = __webpack_require__(71);
	var contacts_container_component_1 = __webpack_require__(80);
	exports.ContactsRoutes = [
	    {
	        path: "/contact",
	        component: contact_container_component_1.ContactContainerComponent
	    },
	    {
	        path: "/admin/contacts",
	        component: contacts_container_component_1.ContactsContainerComponent,
	        authorizationRequired: true
	    }
	];


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__webpack_require__(91);
	__webpack_require__(100);
	__webpack_require__(101);
	__webpack_require__(168);
	__webpack_require__(189);
	__webpack_require__(190);
	__webpack_require__(195);
	var app = angular.module("app.contentAggregation", [
	    "app.contentAggregation.action-creators",
	    "app.contentAggregation.actions",
	    "app.contentAggregation.components",
	    "app.contentAggregation.containers",
	    "app.contentAggregation.action-creators",
	    "app.contentAggregation.reducers",
	    "app.contentAggregation.services"
	]);
	__export(__webpack_require__(200));


/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(3);
	var app_action_creator_1 = __webpack_require__(92);
	var property_action_creator_1 = __webpack_require__(94);
	var section_action_creator_1 = __webpack_require__(96);
	var ui_action_creator_1 = __webpack_require__(98);
	var contentAggregationActionCreatorsModule = angular.module("app.contentAggregation.action-creators", []);
	core_1.bootstrap(contentAggregationActionCreatorsModule, {
	    providers: [app_action_creator_1.AppActionCreator, property_action_creator_1.PropertyActionCreator, section_action_creator_1.SectionActionCreator, ui_action_creator_1.UIActionCreator]
	});


/***/ },
/* 92 */
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
	var app_actions_1 = __webpack_require__(93);
	var AppActionCreator = (function (_super) {
	    __extends(AppActionCreator, _super);
	    function AppActionCreator($location, dispatcher, appService, guid, invokeAsync, modalActionCreator) {
	        var _this = this;
	        _super.call(this, $location, appService, dispatcher, guid, app_actions_1.AddOrUpdateAppAction, app_actions_1.AllAppsAction, app_actions_1.RemoveAppAction, app_actions_1.SetCurrentAppAction);
	        this.invokeAsync = invokeAsync;
	        this.modalActionCreator = modalActionCreator;
	        this.addOrUpdateSuccess = function (options) { return _this.dispatcher.dispatch(new app_actions_1.AddOrUpdateAppSuccessAction(options.entity)); };
	        this.currentAppRemoved = function () { return _this.dispatcher.dispatch(new app_actions_1.CurrentAppRemovedAction()); };
	        this.openAllAppsModal = function () {
	            _this.invokeAsync(_this.all).then(function (results) {
	                _this.modalActionCreator.open({ html: "<all-app-modal></all-app-modal>" });
	            });
	        };
	    }
	    AppActionCreator = __decorate([
	        core_1.Service({
	            serviceName: "appActionCreator",
	            viewProviders: ["$location", "dispatcher", "appService", "guid", "invokeAsync", "modalActionCreator"]
	        }), 
	        __metadata('design:paramtypes', [Object, Object, Object, Object, Object, modal_action_creator_1.ModalActionCreator])
	    ], AppActionCreator);
	    return AppActionCreator;
	}(core_1.BaseActionCreator));
	exports.AppActionCreator = AppActionCreator;


/***/ },
/* 93 */
/***/ function(module, exports) {

	"use strict";
	var AddOrUpdateAppAction = (function () {
	    function AddOrUpdateAppAction(id, entity) {
	        this.id = id;
	        this.entity = entity;
	    }
	    return AddOrUpdateAppAction;
	}());
	exports.AddOrUpdateAppAction = AddOrUpdateAppAction;
	var AllAppsAction = (function () {
	    function AllAppsAction(id, entities) {
	        this.id = id;
	        this.entities = entities;
	    }
	    return AllAppsAction;
	}());
	exports.AllAppsAction = AllAppsAction;
	var RemoveAppAction = (function () {
	    function RemoveAppAction(id, entity) {
	        this.id = id;
	        this.entity = entity;
	    }
	    return RemoveAppAction;
	}());
	exports.RemoveAppAction = RemoveAppAction;
	var AppsFilterAction = (function () {
	    function AppsFilterAction(id, term) {
	        this.id = id;
	        this.term = term;
	    }
	    return AppsFilterAction;
	}());
	exports.AppsFilterAction = AppsFilterAction;
	var SetCurrentAppAction = (function () {
	    function SetCurrentAppAction(entity) {
	        this.entity = entity;
	    }
	    return SetCurrentAppAction;
	}());
	exports.SetCurrentAppAction = SetCurrentAppAction;
	var AddOrUpdateAppSuccessAction = (function () {
	    function AddOrUpdateAppSuccessAction(entity) {
	        this.entity = entity;
	    }
	    return AddOrUpdateAppSuccessAction;
	}());
	exports.AddOrUpdateAppSuccessAction = AddOrUpdateAppSuccessAction;
	var CurrentAppRemovedAction = (function () {
	    function CurrentAppRemovedAction() {
	    }
	    return CurrentAppRemovedAction;
	}());
	exports.CurrentAppRemovedAction = CurrentAppRemovedAction;


/***/ },
/* 94 */
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
	var property_actions_1 = __webpack_require__(95);
	var PropertyActionCreator = (function (_super) {
	    __extends(PropertyActionCreator, _super);
	    function PropertyActionCreator($location, dispatcher, propertyService, guid, invokeAsync, modalActionCreator) {
	        var _this = this;
	        _super.call(this, $location, propertyService, dispatcher, guid, property_actions_1.AddOrUpdatePropertyAction, property_actions_1.AllPropertiesAction, property_actions_1.RemovePropertyAction, property_actions_1.SetCurrentPropertyAction);
	        this.invokeAsync = invokeAsync;
	        this.modalActionCreator = modalActionCreator;
	        this.addOrUpdateSuccess = function (options) { return _this.dispatcher.dispatch(new property_actions_1.AddOrUpdatePropertySuccessAction(options.entity)); };
	        this.currentPropertyRemoved = function () { return _this.dispatcher.dispatch(new property_actions_1.CurrentPropertyRemovedAction()); };
	        this.openAllPropertysModal = function () {
	            _this.invokeAsync(_this.all).then(function (results) {
	                _this.modalActionCreator.open({ html: "<all-property-modal></all-property-modal>" });
	            });
	        };
	        this.openPropertyPickerModal = function () {
	            _this.invokeAsync(_this.all).then(function (results) {
	                _this.modalActionCreator.open({ html: "<property-picker-modal></property-picker-modal>" });
	            });
	        };
	        this.pick = function (entity) { return _this.dispatcher.dispatch(new property_actions_1.PropertyPickedAction(entity)); };
	        this.openEditPropertyModal = function (options) {
	            if (options === void 0) { options = { property: null }; }
	            _this.modalActionCreator.open({ html: "<edit-property-modal property='" + JSON.stringify(options.property) + "'></edit-property-modal>" });
	        };
	    }
	    PropertyActionCreator = __decorate([
	        core_1.Service({
	            serviceName: "propertyActionCreator",
	            viewProviders: ["$location", "dispatcher", "propertyService", "guid", "invokeAsync", "modalActionCreator"]
	        }), 
	        __metadata('design:paramtypes', [Object, Object, Object, Object, Object, modal_action_creator_1.ModalActionCreator])
	    ], PropertyActionCreator);
	    return PropertyActionCreator;
	}(core_1.BaseActionCreator));
	exports.PropertyActionCreator = PropertyActionCreator;


/***/ },
/* 95 */
/***/ function(module, exports) {

	"use strict";
	var AddOrUpdatePropertyAction = (function () {
	    function AddOrUpdatePropertyAction(id, entity) {
	        this.id = id;
	        this.entity = entity;
	    }
	    return AddOrUpdatePropertyAction;
	}());
	exports.AddOrUpdatePropertyAction = AddOrUpdatePropertyAction;
	var AllPropertiesAction = (function () {
	    function AllPropertiesAction(id, entities) {
	        this.id = id;
	        this.entities = entities;
	    }
	    return AllPropertiesAction;
	}());
	exports.AllPropertiesAction = AllPropertiesAction;
	var RemovePropertyAction = (function () {
	    function RemovePropertyAction(id, entity) {
	        this.id = id;
	        this.entity = entity;
	    }
	    return RemovePropertyAction;
	}());
	exports.RemovePropertyAction = RemovePropertyAction;
	var PropertysFilterAction = (function () {
	    function PropertysFilterAction(id, term) {
	        this.id = id;
	        this.term = term;
	    }
	    return PropertysFilterAction;
	}());
	exports.PropertysFilterAction = PropertysFilterAction;
	var SetCurrentPropertyAction = (function () {
	    function SetCurrentPropertyAction(entity) {
	        this.entity = entity;
	    }
	    return SetCurrentPropertyAction;
	}());
	exports.SetCurrentPropertyAction = SetCurrentPropertyAction;
	var AddOrUpdatePropertySuccessAction = (function () {
	    function AddOrUpdatePropertySuccessAction(entity) {
	        this.entity = entity;
	    }
	    return AddOrUpdatePropertySuccessAction;
	}());
	exports.AddOrUpdatePropertySuccessAction = AddOrUpdatePropertySuccessAction;
	var CurrentPropertyRemovedAction = (function () {
	    function CurrentPropertyRemovedAction() {
	    }
	    return CurrentPropertyRemovedAction;
	}());
	exports.CurrentPropertyRemovedAction = CurrentPropertyRemovedAction;
	var PropertyPickedAction = (function () {
	    function PropertyPickedAction(entity) {
	        this.entity = entity;
	    }
	    return PropertyPickedAction;
	}());
	exports.PropertyPickedAction = PropertyPickedAction;


/***/ },
/* 96 */
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
	var section_actions_1 = __webpack_require__(97);
	var SectionActionCreator = (function (_super) {
	    __extends(SectionActionCreator, _super);
	    function SectionActionCreator($location, dispatcher, sectionService, guid, invokeAsync, modalActionCreator) {
	        var _this = this;
	        _super.call(this, $location, sectionService, dispatcher, guid, section_actions_1.AddOrUpdateSectionAction, section_actions_1.AllSectionsAction, section_actions_1.RemoveSectionAction, section_actions_1.SetCurrentSectionAction);
	        this.invokeAsync = invokeAsync;
	        this.modalActionCreator = modalActionCreator;
	        this.addOrUpdateSuccess = function (options) { return _this.dispatcher.dispatch(new section_actions_1.AddOrUpdateSectionSuccessAction(options.entity)); };
	        this.currentSectionRemoved = function () { return _this.dispatcher.dispatch(new section_actions_1.CurrentSectionRemovedAction()); };
	        this.openAllSectionsModal = function () {
	            _this.invokeAsync(_this.all).then(function (results) {
	                _this.modalActionCreator.open({ html: "<all-section-modal></all-section-modal>" });
	            });
	        };
	    }
	    SectionActionCreator = __decorate([
	        core_1.Service({
	            serviceName: "sectionActionCreator",
	            viewProviders: ["$location", "dispatcher", "sectionService", "guid", "invokeAsync", "modalActionCreator"]
	        }), 
	        __metadata('design:paramtypes', [Object, Object, Object, Object, Object, modal_action_creator_1.ModalActionCreator])
	    ], SectionActionCreator);
	    return SectionActionCreator;
	}(core_1.BaseActionCreator));
	exports.SectionActionCreator = SectionActionCreator;


/***/ },
/* 97 */
/***/ function(module, exports) {

	"use strict";
	var AddOrUpdateSectionAction = (function () {
	    function AddOrUpdateSectionAction(id, entity) {
	        this.id = id;
	        this.entity = entity;
	    }
	    return AddOrUpdateSectionAction;
	}());
	exports.AddOrUpdateSectionAction = AddOrUpdateSectionAction;
	var AllSectionsAction = (function () {
	    function AllSectionsAction(id, entities) {
	        this.id = id;
	        this.entities = entities;
	    }
	    return AllSectionsAction;
	}());
	exports.AllSectionsAction = AllSectionsAction;
	var RemoveSectionAction = (function () {
	    function RemoveSectionAction(id, entity) {
	        this.id = id;
	        this.entity = entity;
	    }
	    return RemoveSectionAction;
	}());
	exports.RemoveSectionAction = RemoveSectionAction;
	var SectionsFilterAction = (function () {
	    function SectionsFilterAction(id, term) {
	        this.id = id;
	        this.term = term;
	    }
	    return SectionsFilterAction;
	}());
	exports.SectionsFilterAction = SectionsFilterAction;
	var SetCurrentSectionAction = (function () {
	    function SetCurrentSectionAction(entity) {
	        this.entity = entity;
	    }
	    return SetCurrentSectionAction;
	}());
	exports.SetCurrentSectionAction = SetCurrentSectionAction;
	var AddOrUpdateSectionSuccessAction = (function () {
	    function AddOrUpdateSectionSuccessAction(entity) {
	        this.entity = entity;
	    }
	    return AddOrUpdateSectionSuccessAction;
	}());
	exports.AddOrUpdateSectionSuccessAction = AddOrUpdateSectionSuccessAction;
	var CurrentSectionRemovedAction = (function () {
	    function CurrentSectionRemovedAction() {
	    }
	    return CurrentSectionRemovedAction;
	}());
	exports.CurrentSectionRemovedAction = CurrentSectionRemovedAction;


/***/ },
/* 98 */
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
	var ui_actions_1 = __webpack_require__(99);
	var UIActionCreator = (function (_super) {
	    __extends(UIActionCreator, _super);
	    function UIActionCreator($location, dispatcher, uiService, guid, invokeAsync, modalActionCreator) {
	        var _this = this;
	        _super.call(this, $location, uiService, dispatcher, guid, ui_actions_1.AddOrUpdateUIAction, ui_actions_1.AllUIsAction, ui_actions_1.RemoveUIAction, ui_actions_1.SetCurrentUIAction);
	        this.invokeAsync = invokeAsync;
	        this.modalActionCreator = modalActionCreator;
	        this.addOrUpdateSuccess = function (options) { return _this.dispatcher.dispatch(new ui_actions_1.AddOrUpdateUISuccessAction(options.entity)); };
	        this.currentUiRemoved = function () { return _this.dispatcher.dispatch(new ui_actions_1.CurrentUIRemovedAction()); };
	        this.openAllUisModal = function () {
	            _this.invokeAsync(_this.all).then(function (results) {
	                _this.modalActionCreator.open({ html: "<all-ui-modal></all-ui-modal>" });
	            });
	        };
	    }
	    UIActionCreator = __decorate([
	        core_1.Service({
	            serviceName: "uiActionCreator",
	            viewProviders: ["$location", "dispatcher", "uiService", "guid", "invokeAsync", "modalActionCreator"]
	        }), 
	        __metadata('design:paramtypes', [Object, Object, Object, Object, Object, modal_action_creator_1.ModalActionCreator])
	    ], UIActionCreator);
	    return UIActionCreator;
	}(core_1.BaseActionCreator));
	exports.UIActionCreator = UIActionCreator;


/***/ },
/* 99 */
/***/ function(module, exports) {

	"use strict";
	var AddOrUpdateUIAction = (function () {
	    function AddOrUpdateUIAction(id, entity) {
	        this.id = id;
	        this.entity = entity;
	    }
	    return AddOrUpdateUIAction;
	}());
	exports.AddOrUpdateUIAction = AddOrUpdateUIAction;
	var AllUIsAction = (function () {
	    function AllUIsAction(id, entities) {
	        this.id = id;
	        this.entities = entities;
	    }
	    return AllUIsAction;
	}());
	exports.AllUIsAction = AllUIsAction;
	var RemoveUIAction = (function () {
	    function RemoveUIAction(id, entity) {
	        this.id = id;
	        this.entity = entity;
	    }
	    return RemoveUIAction;
	}());
	exports.RemoveUIAction = RemoveUIAction;
	var UIsFilterAction = (function () {
	    function UIsFilterAction(id, term) {
	        this.id = id;
	        this.term = term;
	    }
	    return UIsFilterAction;
	}());
	exports.UIsFilterAction = UIsFilterAction;
	var SetCurrentUIAction = (function () {
	    function SetCurrentUIAction(entity) {
	        this.entity = entity;
	    }
	    return SetCurrentUIAction;
	}());
	exports.SetCurrentUIAction = SetCurrentUIAction;
	var AddOrUpdateUISuccessAction = (function () {
	    function AddOrUpdateUISuccessAction(entity) {
	        this.entity = entity;
	    }
	    return AddOrUpdateUISuccessAction;
	}());
	exports.AddOrUpdateUISuccessAction = AddOrUpdateUISuccessAction;
	var CurrentUIRemovedAction = (function () {
	    function CurrentUIRemovedAction() {
	    }
	    return CurrentUIRemovedAction;
	}());
	exports.CurrentUIRemovedAction = CurrentUIRemovedAction;


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(3);
	var appActions = __webpack_require__(93);
	var propertyActions = __webpack_require__(95);
	var sectionActions = __webpack_require__(97);
	var uiActions = __webpack_require__(99);
	var contentAggregationActionsModule = angular.module("app.contentAggregation.actions", []);
	core_1.bootstrap(contentAggregationActionsModule, {
	    actions: [appActions, propertyActions, sectionActions, uiActions]
	});


/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(3);
	var app_editor_component_1 = __webpack_require__(102);
	var app_list_component_1 = __webpack_require__(106);
	var app_component_1 = __webpack_require__(110);
	var property_editor_component_1 = __webpack_require__(114);
	var property_list_component_1 = __webpack_require__(118);
	var property_component_1 = __webpack_require__(122);
	var property_paged_list_component_1 = __webpack_require__(126);
	var property_picker_modal_component_1 = __webpack_require__(140);
	var section_editor_component_1 = __webpack_require__(144);
	var section_list_component_1 = __webpack_require__(148);
	var section_component_1 = __webpack_require__(152);
	var ui_editor_component_1 = __webpack_require__(156);
	var ui_list_component_1 = __webpack_require__(160);
	var ui_component_1 = __webpack_require__(164);
	var contentAggregationComponentsModule = angular.module("app.contentAggregation.components", []);
	core_1.bootstrap(contentAggregationComponentsModule, {
	    components: [
	        app_editor_component_1.AppEditorComponent,
	        app_list_component_1.AppListComponent,
	        app_component_1.AppComponent,
	        property_component_1.PropertyComponent,
	        property_editor_component_1.PropertyEditorComponent,
	        property_list_component_1.PropertyListComponent,
	        property_paged_list_component_1.PropertyPagedListComponent,
	        property_picker_modal_component_1.PropertyPickerModalComponent,
	        section_editor_component_1.SectionEditorComponent,
	        section_list_component_1.SectionListComponent,
	        section_component_1.SectionComponent,
	        ui_editor_component_1.UIEditorComponent,
	        ui_list_component_1.UIListComponent,
	        ui_component_1.UIComponent
	    ]
	});


/***/ },
/* 102 */
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
	var AppEditorComponent = (function () {
	    function AppEditorComponent() {
	    }
	    AppEditorComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(103),
	            styles: [__webpack_require__(104)],
	            selector: "app-editor",
	            inputs: ['entity', 'addOrUpdate', 'remove', 'create'],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], AppEditorComponent);
	    return AppEditorComponent;
	}());
	exports.AppEditorComponent = AppEditorComponent;


/***/ },
/* 103 */
/***/ function(module, exports) {

	module.exports = "<div class=\"appEditor\">\r\n\r\n    <h1  data-ng-if=\"!vm.entity.id\">Create App <span data-ng-if=\"vm.entity.name.length > 0\">: {{ vm.entity.name }}</span></h1>\r\n\r\n    <h1 data-ng-if=\"vm.entity.id\">Edit App: {{ vm.entity.name }}</h1>\r\n\r\n    <tabs tabs-name=\"app-editor\">\r\n\r\n        <tab-title>General</tab-title>\r\n\r\n        <tab-content>\r\n            <div>\r\n                <input class=\"inputField\" type=\"text\" placeholder=\"App Name\" data-ng-model=\"vm.entity.name\" />\r\n            </div>\r\n        </tab-content>\r\n\r\n    </tabs>\r\n\r\n    <div>\r\n        <calypso-button on-click=\"vm.addOrUpdate({ data: vm.entity })\" caption=\"Save\"></calypso-button>\r\n\r\n        <calypso-button on-click=\"vm.create()\" caption=\"Create\"></calypso-button>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(105);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./app-editor.component.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./app-editor.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 106 */
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
	var AppListComponent = (function () {
	    function AppListComponent() {
	    }
	    AppListComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(107),
	            styles: [__webpack_require__(108)],
	            selector: "app-list",
	            inputs: ['entities', 'edit', 'remove'],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], AppListComponent);
	    return AppListComponent;
	}());
	exports.AppListComponent = AppListComponent;


/***/ },
/* 107 */
/***/ function(module, exports) {

	module.exports = "<div class=\"appList\">\r\n    <div class=\"appList-header\">\r\n        <h1>Apps</h1>\r\n    </div>\r\n    \r\n    <div data-ng-repeat=\"entity in vm.entities\" class=\"appList-item\">\r\n        <div class=\"appList-name\">\r\n            {{ entity.name }}\r\n        </div>\r\n        <div class=\"appList-actions\">\r\n            <span data-ng-click=\"vm.edit({ entity: this.entity })\">edit</span>&nbsp;&nbsp;|&nbsp;&nbsp;<span data-ng-click=\"vm.remove({ entity: this.entity })\">remove</span>\r\n        </div>\r\n        <div style=\"clear:both;\"></div>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(109);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./app-list.component.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./app-list.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, ".appList-name,\n.appList-actions {\n  position: relative;\n  float: left; }\n\n.appList-name {\n  min-width: 200px; }\n\n.appList-item {\n  height: 50px; }\n\n.appList-actions span {\n  cursor: pointer; }\n\n.appList-actions {\n  text-transform: uppercase; }\n", ""]);

	// exports


/***/ },
/* 110 */
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
	var AppComponent = (function () {
	    function AppComponent() {
	    }
	    AppComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(111),
	            styles: [__webpack_require__(112)],
	            selector: "app",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], AppComponent);
	    return AppComponent;
	}());
	exports.AppComponent = AppComponent;


/***/ },
/* 111 */
/***/ function(module, exports) {

	module.exports = "<div class=\"app\">\r\n\r\n</div>\r\n"

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(113);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./app.component.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./app.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 114 */
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
	var PropertyEditorComponent = (function () {
	    function PropertyEditorComponent() {
	    }
	    PropertyEditorComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(115),
	            styles: [__webpack_require__(116)],
	            selector: "property-editor",
	            inputs: ['entity', 'addOrUpdate', 'remove', 'create'],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], PropertyEditorComponent);
	    return PropertyEditorComponent;
	}());
	exports.PropertyEditorComponent = PropertyEditorComponent;


/***/ },
/* 115 */
/***/ function(module, exports) {

	module.exports = "<div class=\"propertyEditor\">\r\n\r\n    <h1  data-ng-if=\"!vm.entity.id\">Create Property <span data-ng-if=\"vm.entity.name.length > 0\">: {{ vm.entity.name }}</span></h1>\r\n\r\n    <h1 data-ng-if=\"vm.entity.id\">Edit Property: {{ vm.entity.name }}</h1>\r\n\r\n    <tabs tabs-name=\"property-editor\">\r\n\r\n        <tab-title>General</tab-title>\r\n\r\n        <tab-content>\r\n            <div>\r\n                <input class=\"inputField\" type=\"text\" placeholder=\"Name\" data-ng-model=\"vm.entity.name\" />\r\n            </div>\r\n            <div>\r\n                <input class=\"inputField\" type=\"text\" placeholder=\"Key\" data-ng-model=\"vm.entity.key\" />\r\n            </div>\r\n            <div>\r\n                <input class=\"inputField\" type=\"text\" placeholder=\"Value\" data-ng-model=\"vm.entity.value\" />\r\n            </div>\r\n            <div>\r\n                <input class=\"inputField\" type=\"text\" placeholder=\"Base Uri\" data-ng-model=\"vm.entity.baseUri\" />\r\n            </div>\r\n            <div>\r\n                <input class=\"inputField\" type=\"text\" placeholder=\"Uri\" data-ng-model=\"vm.entity.uri\" />\r\n            </div>\r\n            <div>\r\n                <textarea ui-tinymce ng-model=\"vm.entity.htmlBody\"></textarea>\r\n            </div>\r\n        </tab-content>\r\n\r\n    </tabs>\r\n\r\n    <div>\r\n        <calypso-button on-click=\"vm.addOrUpdate({ data: vm.entity })\" caption=\"Save\"></calypso-button>\r\n\r\n        <calypso-button on-click=\"vm.create()\" caption=\"Create\"></calypso-button>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(117);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./property-editor.component.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./property-editor.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 118 */
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
	var PropertyListComponent = (function () {
	    function PropertyListComponent() {
	    }
	    PropertyListComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(119),
	            styles: [__webpack_require__(120)],
	            selector: "property-list",
	            inputs: ['entities', 'edit', 'remove'],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], PropertyListComponent);
	    return PropertyListComponent;
	}());
	exports.PropertyListComponent = PropertyListComponent;


/***/ },
/* 119 */
/***/ function(module, exports) {

	module.exports = "<div class=\"propertyList\">\r\n    <div class=\"propertyList-header\">\r\n        <h1>Properties</h1>\r\n    </div>\r\n    \r\n    <div data-ng-repeat=\"entity in vm.entities\" class=\"propertyList-item\">\r\n        <div class=\"propertyList-name\">\r\n            {{ entity.name }}\r\n        </div>\r\n        <div class=\"propertyList-actions\">\r\n            <span data-ng-click=\"vm.edit({ entity: this.entity })\">edit</span>&nbsp;&nbsp;|&nbsp;&nbsp;<span data-ng-click=\"vm.remove({ entity: this.entity })\">remove</span>\r\n        </div>\r\n        <div style=\"clear:both;\"></div>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(121);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./property-list.component.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./property-list.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, ".propertyList-name,\n.propertyList-actions {\n  position: relative;\n  float: left; }\n\n.propertyList-name {\n  min-width: 200px; }\n\n.propertyList-item {\n  height: 50px; }\n\n.propertyList-actions span {\n  cursor: pointer; }\n\n.propertyList-actions {\n  text-transform: uppercase; }\n", ""]);

	// exports


/***/ },
/* 122 */
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
	var PropertyComponent = (function () {
	    function PropertyComponent() {
	    }
	    PropertyComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(123),
	            styles: [__webpack_require__(124)],
	            selector: "property",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], PropertyComponent);
	    return PropertyComponent;
	}());
	exports.PropertyComponent = PropertyComponent;


/***/ },
/* 123 */
/***/ function(module, exports) {

	module.exports = "<div class=\"property\">\r\n\r\n</div>\r\n"

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(125);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./property.component.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./property.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 126 */
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
	var paged_list_1 = __webpack_require__(127);
	var PropertyPagedListComponent = (function () {
	    function PropertyPagedListComponent() {
	        var _this = this;
	        this.ngOnInit = function () {
	            _this.pagedList = paged_list_1.toPageListFromInMemory(_this.entities, _this.pageNumber, _this.pageSize);
	        };
	        this.next = function () {
	            if (_this.pageNumber == _this.pagedList.totalPages) {
	                _this.pageNumber = 1;
	            }
	            else {
	                _this.pageNumber = _this.pageNumber + 1;
	            }
	            _this.ngOnInit();
	        };
	        this.previous = function () {
	            if (_this.pageNumber == 1) {
	                _this.pageNumber = _this.pagedList.totalPages;
	            }
	            else {
	                _this.pageNumber = _this.pageNumber - 1;
	            }
	            _this.ngOnInit();
	        };
	    }
	    PropertyPagedListComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(137),
	            styles: [__webpack_require__(138)],
	            selector: "property-paged-list",
	            inputs: ['entities', 'edit', 'remove', 'pageNumber', 'pageSize', 'select'],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], PropertyPagedListComponent);
	    return PropertyPagedListComponent;
	}());
	exports.PropertyPagedListComponent = PropertyPagedListComponent;


/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__webpack_require__(3);
	__webpack_require__(128);
	var core_1 = __webpack_require__(3);
	var paged_list_actions_1 = __webpack_require__(130);
	var paging_config_provider_1 = __webpack_require__(131);
	var reducers = __webpack_require__(133);
	__export(__webpack_require__(134));
	__export(__webpack_require__(135));
	var app = angular.module("app.pagedList", [
	    "app.core"
	]);
	app.provider("pagingConfigProvider", paging_config_provider_1.PagingConfigProvider);
	core_1.provide(app, paged_list_actions_1.PagedListActionCreator);
	app.config(["reducersProvider", function (reducersProvider) {
	        for (var reducer in reducers) {
	            reducersProvider.configure(reducers[reducer]);
	        }
	    }]);


/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(129);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../css-loader/index.js!./../../../../sass-loader/index.js!./paged-list.scss", function() {
				var newContent = require("!!./../../../../css-loader/index.js!./../../../../sass-loader/index.js!./paged-list.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, ".previous, .next {\n  cursor: pointer; }\n\n.paged-list-navigation {\n  margin-bottom: 30px; }\n", ""]);

	// exports


/***/ },
/* 130 */
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
	var PagedListActionCreator = (function () {
	    function PagedListActionCreator(dispatcher, guid) {
	        this.dispatcher = dispatcher;
	        this.guid = guid;
	    }
	    PagedListActionCreator = __decorate([
	        core_1.Service({
	            serviceName: "pagedListActionCreator",
	            viewProviders: ["dispatcher", "guid"]
	        }), 
	        __metadata('design:paramtypes', [Object, Object])
	    ], PagedListActionCreator);
	    return PagedListActionCreator;
	}());
	exports.PagedListActionCreator = PagedListActionCreator;


/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var paging_config_model_1 = __webpack_require__(132);
	var PagingConfigProvider = (function () {
	    function PagingConfigProvider() {
	        var _this = this;
	        this.$get = function () { return new paging_config_model_1.PagingConfig(_this.page, _this.pageSize); };
	    }
	    return PagingConfigProvider;
	}());
	exports.PagingConfigProvider = PagingConfigProvider;


/***/ },
/* 132 */
/***/ function(module, exports) {

	"use strict";
	var PagingConfig = (function () {
	    function PagingConfig(page, pageSize) {
	        this.page = page;
	        this.pageSize = pageSize;
	    }
	    return PagingConfig;
	}());
	exports.PagingConfig = PagingConfig;


/***/ },
/* 133 */
/***/ function(module, exports) {

	"use strict";


/***/ },
/* 134 */
/***/ function(module, exports) {

	"use strict";
	var PagedList = (function () {
	    function PagedList(_data, _page, _pageSize, _totalCount) {
	        this._data = _data;
	        this._page = _page;
	        this._pageSize = _pageSize;
	        this._totalCount = _totalCount;
	    }
	    Object.defineProperty(PagedList.prototype, "data", {
	        get: function () { return this._data; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(PagedList.prototype, "page", {
	        get: function () { return this._page; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(PagedList.prototype, "pageSize", {
	        get: function () { return this._pageSize; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(PagedList.prototype, "totalCount", {
	        get: function () { return this._totalCount; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(PagedList.prototype, "totalPages", {
	        get: function () { return Math.ceil(this._totalCount / this._pageSize); },
	        enumerable: true,
	        configurable: true
	    });
	    return PagedList;
	}());
	exports.PagedList = PagedList;


/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var validate_page_properties_and_get_skip_count_1 = __webpack_require__(136);
	var paging_config_model_1 = __webpack_require__(132);
	var paged_list_model_1 = __webpack_require__(134);
	function toPageListFromInMemory(entities, page, pageSize) {
	    if (entities == null)
	        throw new Error("entities");
	    var pagingConfig = new paging_config_model_1.PagingConfig(page, pageSize);
	    var skipCount = validate_page_properties_and_get_skip_count_1.validatePagePropertiesAndGetSkipCount(pagingConfig);
	    var data = entities.slice(skipCount, pageSize + skipCount);
	    return new paged_list_model_1.PagedList(data, page, pageSize, entities.length);
	}
	exports.toPageListFromInMemory = toPageListFromInMemory;


/***/ },
/* 136 */
/***/ function(module, exports) {

	"use strict";
	function validatePagePropertiesAndGetSkipCount(pagingConfig) {
	    if (pagingConfig.page < 1) {
	        pagingConfig.page = 1;
	    }
	    if (pagingConfig.pageSize < 1) {
	        pagingConfig.pageSize = 1;
	    }
	    if (pagingConfig.pageSize > 100) {
	        pagingConfig.pageSize = 100;
	    }
	    return pagingConfig.pageSize * (pagingConfig.page - 1);
	}
	exports.validatePagePropertiesAndGetSkipCount = validatePagePropertiesAndGetSkipCount;


/***/ },
/* 137 */
/***/ function(module, exports) {

	module.exports = "<div class=\"property-paged-list\">\r\n    <div class=\"property-paged-list-header\">\r\n        <h1>Properties</h1>\r\n    </div>\r\n\r\n    <div class=\"paged-list-navigation\">\r\n        <span>{{ vm.pageNumber }}</span>\r\n        <span>of</span>\r\n        <span>{{ vm.pagedList.totalPages }}</span>\r\n        &nbsp;&nbsp;&nbsp;&nbsp;\r\n        <span data-ng-click=\"vm.previous()\" class=\"previous\">previous</span>\r\n        &nbsp;&nbsp;|&nbsp;&nbsp;\r\n        <span data-ng-click=\"vm.next()\" class=\"next\">next</span>\r\n    </div>\r\n\r\n    <div data-ng-repeat=\"entity in vm.pagedList.data\" class=\"property-paged-list-item\">\r\n        <div class=\"property-paged-list-name\">\r\n            {{ entity.name }}\r\n        </div>\r\n        <div class=\"property-paged-list-actions\">\r\n            <span data-ng-click=\"vm.select({ entity: this.entity })\">select</span>&nbsp;&nbsp;|&nbsp;&nbsp;\r\n            <span data-ng-click=\"vm.edit({ entity: this.entity })\">edit</span>&nbsp;&nbsp;|&nbsp;&nbsp;\r\n            <span data-ng-click=\"vm.remove({ entity: this.entity })\">remove</span>\r\n        </div>\r\n        <div style=\"clear:both;\"></div>\r\n    </div>\r\n\r\n\r\n</div>\r\n"

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(139);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./property-paged-list.component.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./property-paged-list.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, ".property-paged-list-name,\n.property-paged-list-actions {\n  position: relative;\n  float: left; }\n\n.property-paged-list-name {\n  min-width: 200px; }\n\n.property-paged-list-item {\n  height: 50px; }\n\n.property-paged-list-actions {\n  text-transform: uppercase; }\n\n.property-paged-list-actions span {\n  cursor: pointer; }\n", ""]);

	// exports


/***/ },
/* 140 */
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
	var property_action_creator_1 = __webpack_require__(94);
	var PropertyPickerModalComponent = (function () {
	    function PropertyPickerModalComponent(modalActionCreator, propertyActionCreator) {
	        var _this = this;
	        this.modalActionCreator = modalActionCreator;
	        this.propertyActionCreator = propertyActionCreator;
	        this.storeOnChange = function (state) { return _this.entities = state.properties; };
	        this.pageNumber = 1;
	        this.pageSize = 4;
	        this.select = function (options) {
	            _this.propertyActionCreator.pick(options.entity);
	            _this.modalActionCreator.close();
	        };
	    }
	    PropertyPickerModalComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(141),
	            styles: [__webpack_require__(142)],
	            selector: "property-picker-modal",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
	            viewProviders: ["modalActionCreator", "propertyActionCreator"]
	        }), 
	        __metadata('design:paramtypes', [modal_action_creator_1.ModalActionCreator, property_action_creator_1.PropertyActionCreator])
	    ], PropertyPickerModalComponent);
	    return PropertyPickerModalComponent;
	}());
	exports.PropertyPickerModalComponent = PropertyPickerModalComponent;


/***/ },
/* 141 */
/***/ function(module, exports) {

	module.exports = "<div class=\"property-picker-modal\">\r\n    <modal>\r\n\r\n        <modal-title>Property Picker</modal-title>\r\n\r\n        <modal-content>\r\n\r\n            <property-paged-list entities=\"vm.entities\" select=\"vm.select\" edit=\"vm.edit\" remove=\"vm.remove\" page-size=\"vm.pageSize\" page-number=\"vm.pageNumber\">\r\n\r\n            </property-paged-list>\r\n\r\n        </modal-content>\r\n\r\n    </modal>\r\n\r\n</div>"

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(143);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./property-picker-modal.component.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./property-picker-modal.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 144 */
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
	var SectionEditorComponent = (function () {
	    function SectionEditorComponent() {
	    }
	    SectionEditorComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(145),
	            styles: [__webpack_require__(146)],
	            selector: "section-editor",
	            inputs: ['entity', 'addOrUpdate', 'remove', 'create'],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], SectionEditorComponent);
	    return SectionEditorComponent;
	}());
	exports.SectionEditorComponent = SectionEditorComponent;


/***/ },
/* 145 */
/***/ function(module, exports) {

	module.exports = "<div class=\"sectionEditor\">\r\n\r\n    <h1  data-ng-if=\"!vm.entity.id\">Create Section <span data-ng-if=\"vm.entity.name.length > 0\">: {{ vm.entity.name }}</span></h1>\r\n\r\n    <h1 data-ng-if=\"vm.entity.id\">Edit Section: {{ vm.entity.name }}</h1>\r\n\r\n    <tabs tabs-name=\"section-editor\">\r\n\r\n        <tab-title>General</tab-title>\r\n\r\n        <tab-content>\r\n            <div>\r\n                <input class=\"inputField\" type=\"text\" placeholder=\"Section Name\" data-ng-model=\"vm.entity.name\" />\r\n            </div>\r\n        </tab-content>\r\n\r\n    </tabs>\r\n\r\n    <div>\r\n        <calypso-button on-click=\"vm.addOrUpdate({ data: vm.entity })\" caption=\"Save\"></calypso-button>\r\n\r\n        <calypso-button on-click=\"vm.create()\" caption=\"Create\"></calypso-button>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(147);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./section-editor.component.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./section-editor.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 148 */
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
	var SectionListComponent = (function () {
	    function SectionListComponent() {
	    }
	    SectionListComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(149),
	            styles: [__webpack_require__(150)],
	            selector: "section-list",
	            inputs: ['entities', 'edit', 'remove'],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], SectionListComponent);
	    return SectionListComponent;
	}());
	exports.SectionListComponent = SectionListComponent;


/***/ },
/* 149 */
/***/ function(module, exports) {

	module.exports = "<div class=\"sectionList\">\r\n    <div class=\"sectionList-header\">\r\n        <h1>Sections</h1>\r\n    </div>\r\n    \r\n    <div data-ng-repeat=\"entity in vm.entities\" class=\"sectionList-item\">\r\n        <div class=\"sectionList-name\">\r\n            {{ entity.name }}\r\n        </div>\r\n        <div class=\"sectionList-actions\">\r\n            <span data-ng-click=\"vm.edit({ entity: this.entity })\">edit</span>&nbsp;&nbsp;|&nbsp;&nbsp;<span data-ng-click=\"vm.remove({ entity: this.entity })\">remove</span>\r\n        </div>\r\n        <div style=\"clear:both;\"></div>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(151);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./section-list.component.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./section-list.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, ".sectionList-name,\n.sectionList-actions {\n  position: relative;\n  float: left; }\n\n.sectionList-name {\n  min-width: 200px; }\n\n.sectionList-item {\n  height: 50px; }\n\n.sectionList-actions span {\n  cursor: pointer; }\n\n.sectionList-actions {\n  text-transform: uppercase; }\n", ""]);

	// exports


/***/ },
/* 152 */
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
	var SectionComponent = (function () {
	    function SectionComponent() {
	    }
	    SectionComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(153),
	            styles: [__webpack_require__(154)],
	            selector: "section",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], SectionComponent);
	    return SectionComponent;
	}());
	exports.SectionComponent = SectionComponent;


/***/ },
/* 153 */
/***/ function(module, exports) {

	module.exports = "<div class=\"section\">\r\n\r\n</div>\r\n"

/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(155);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./section.component.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./section.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 156 */
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
	var UIEditorComponent = (function () {
	    function UIEditorComponent() {
	    }
	    UIEditorComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(157),
	            styles: [__webpack_require__(158)],
	            selector: "ui-editor",
	            inputs: ['entity', 'addOrUpdate', 'remove', 'create'],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], UIEditorComponent);
	    return UIEditorComponent;
	}());
	exports.UIEditorComponent = UIEditorComponent;


/***/ },
/* 157 */
/***/ function(module, exports) {

	module.exports = "<div class=\"uiEditor\">\r\n\r\n    <h1  data-ng-if=\"!vm.entity.id\">Create UI <span data-ng-if=\"vm.entity.name.length > 0\">: {{ vm.entity.name }}</span></h1>\r\n\r\n    <h1 data-ng-if=\"vm.entity.id\">Edit UI: {{ vm.entity.name }}</h1>\r\n\r\n    <tabs tabs-name=\"ui-editor\">\r\n\r\n        <tab-title>General</tab-title>\r\n\r\n        <tab-content>\r\n            <div>\r\n                <input class=\"inputField\" type=\"text\" placeholder=\"UI Name\" data-ng-model=\"vm.entity.name\" />\r\n            </div>\r\n        </tab-content>\r\n\r\n    </tabs>\r\n\r\n    <div>\r\n        <calypso-button on-click=\"vm.addOrUpdate({ data: vm.entity })\" caption=\"Save\"></calypso-button>\r\n\r\n        <calypso-button on-click=\"vm.create()\" caption=\"Create\"></calypso-button>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(159);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./ui-editor.component.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./ui-editor.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 160 */
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
	var UIListComponent = (function () {
	    function UIListComponent() {
	    }
	    UIListComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(161),
	            styles: [__webpack_require__(162)],
	            selector: "ui-list",
	            inputs: ['entities', 'edit', 'remove'],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], UIListComponent);
	    return UIListComponent;
	}());
	exports.UIListComponent = UIListComponent;


/***/ },
/* 161 */
/***/ function(module, exports) {

	module.exports = "<div class=\"uiList\">\r\n    <div class=\"uiList-header\">\r\n        <h1>Uis</h1>\r\n    </div>\r\n    \r\n    <div data-ng-repeat=\"entity in vm.entities\" class=\"uiList-item\">\r\n        <div class=\"uiList-name\">\r\n            {{ entity.name }}\r\n        </div>\r\n        <div class=\"uiList-actions\">\r\n            <span data-ng-click=\"vm.edit({ entity: this.entity })\">edit</span>&nbsp;&nbsp;|&nbsp;&nbsp;<span data-ng-click=\"vm.remove({ entity: this.entity })\">remove</span>\r\n        </div>\r\n        <div style=\"clear:both;\"></div>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 162 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(163);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./ui-list.component.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./ui-list.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, ".uiList-name,\n.uiList-actions {\n  position: relative;\n  float: left; }\n\n.uiList-name {\n  min-width: 200px; }\n\n.uiList-item {\n  height: 50px; }\n\n.uiList-actions span {\n  cursor: pointer; }\n\n.uiList-actions {\n  text-transform: uppercase; }\n", ""]);

	// exports


/***/ },
/* 164 */
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
	var UIComponent = (function () {
	    function UIComponent() {
	    }
	    UIComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(165),
	            styles: [__webpack_require__(166)],
	            selector: "ui",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], UIComponent);
	    return UIComponent;
	}());
	exports.UIComponent = UIComponent;


/***/ },
/* 165 */
/***/ function(module, exports) {

	module.exports = "<div class=\"ui\">\r\n\r\n</div>\r\n"

/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(167);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./ui.component.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./ui.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var core_1 = __webpack_require__(3);
	var apps_container_component_1 = __webpack_require__(169);
	var properties_container_component_1 = __webpack_require__(174);
	var sections_container_component_1 = __webpack_require__(179);
	var uis_container_component_1 = __webpack_require__(184);
	var contentAggregationContainersModule = angular.module("app.contentAggregation.containers", []);
	core_1.bootstrap(contentAggregationContainersModule, {
	    components: [
	        apps_container_component_1.AppsContainerComponent,
	        properties_container_component_1.PropertiesContainerComponent,
	        sections_container_component_1.SectionsContainerComponent,
	        uis_container_component_1.UIsContainerComponent
	    ]
	});
	__export(__webpack_require__(169));
	__export(__webpack_require__(174));
	__export(__webpack_require__(179));
	__export(__webpack_require__(184));


/***/ },
/* 169 */
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
	var actions = __webpack_require__(93);
	var app_action_creator_1 = __webpack_require__(92);
	var app_model_1 = __webpack_require__(170);
	var AppsContainerComponent = (function () {
	    function AppsContainerComponent($location, $routeParams, appActionCreator, _invokeAsync) {
	        var _this = this;
	        this.$location = $location;
	        this.$routeParams = $routeParams;
	        this.appActionCreator = appActionCreator;
	        this._invokeAsync = _invokeAsync;
	        this.storeOnChange = function (state) {
	            _this.entities = state.apps;
	            if (state.lastTriggeredByAction instanceof actions.SetCurrentAppAction && !state.lastTriggeredByAction.entity)
	                _this.$location.path("/admin/apps");
	            if (state.lastTriggeredByAction instanceof actions.SetCurrentAppAction && state.lastTriggeredByAction.entity)
	                _this.$location.path("/admin/app/edit/" + state.lastTriggeredByAction.entity.id);
	            if (state.lastTriggeredByAction instanceof actions.AddOrUpdateAppAction)
	                _this.entity = new app_model_1.App();
	            if (state.lastTriggeredByAction instanceof actions.RemoveAppAction && _this.entity && _this.entity.id) {
	                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["appId"]), items: _this.entities });
	                if (Object.keys(_this.entity).length === 0) {
	                    _this.$location.path("/admin/apps");
	                }
	            }
	        };
	        this.ngOnInit = function () {
	            if (_this.$routeParams["appId"]) {
	                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["appId"]), items: _this.entities });
	            }
	            else {
	                _this.entity = new app_model_1.App();
	            }
	        };
	        this.edit = function (entity) { return _this.appActionCreator.edit(entity); };
	        this.remove = function (entity) { return _this.appActionCreator.remove(entity); };
	        this.create = function (entity) { return _this.appActionCreator.create(); };
	        this.addOrUpdate = function (options) {
	            _this._invokeAsync({
	                action: _this.appActionCreator.addOrUpdate,
	                params: { data: options.data }
	            }).then(function () {
	                if (_this.$location.path() === "/admin/apps") {
	                    _this.entity = new app_model_1.App();
	                }
	                else {
	                    _this.$location.path("/admin/apps");
	                }
	            });
	        };
	        this.addOrUpdateProperty = function () { return alert("add or update property"); };
	        this.addOrUpdateUI = function () { return alert("add or update ui"); };
	    }
	    AppsContainerComponent = __decorate([
	        core_1.Component({
	            routes: ["/admin/apps", "/admin/app/edit/:appId"],
	            template: __webpack_require__(171),
	            styles: [__webpack_require__(172)],
	            selector: "apps-container",
	            viewProviders: ["$location", "$routeParams", "appActionCreator", "invokeAsync"],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }),
	        core_1.CanActivate(["$q", "$route", "invokeAsync", "appActionCreator", function ($q, $route, invokeAsync, appActionCreator) {
	                var appId = $route.current.params.appId;
	                var promises = [invokeAsync(appActionCreator.all)];
	                if (appId) {
	                    promises.push(invokeAsync({ action: appActionCreator.getById, params: { id: appId } }));
	                }
	                ;
	                return $q.all(promises);
	            }]), 
	        __metadata('design:paramtypes', [Object, Object, app_action_creator_1.AppActionCreator, Object])
	    ], AppsContainerComponent);
	    return AppsContainerComponent;
	}());
	exports.AppsContainerComponent = AppsContainerComponent;


/***/ },
/* 170 */
/***/ function(module, exports) {

	"use strict";
	var App = (function () {
	    function App() {
	    }
	    return App;
	}());
	exports.App = App;


/***/ },
/* 171 */
/***/ function(module, exports) {

	module.exports = "<div>\r\n    <a class=\"apps-container-add-or-update-property\" data-ng-click=\"vm.addOrUpdateProperty()\">Add Or Update Property</a>\r\n    <a class=\"apps-container-add-or-update-ui\" data-ng-click=\"vm.addOrUpdateUI()\">Add Or Update UI</a>\r\n    <app-editor entity=\"vm.entity\" edit=\"vm.edit\" remove=\"vm.remove\" add-or-update=\"vm.addOrUpdate\" create=\"vm.create\"></app-editor>\r\n    <app-list entities=\"vm.entities\" edit=\"vm.edit\" remove=\"vm.remove\"></app-list>\r\n</div>\r\n"

/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(173);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./apps-container.component.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./apps-container.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, ".apps-container-add-or-update-property,\n.apps-container-add-or-update-ui {\n  cursor: pointer; }\n", ""]);

	// exports


/***/ },
/* 174 */
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
	var actions = __webpack_require__(95);
	var property_action_creator_1 = __webpack_require__(94);
	var pluck_1 = __webpack_require__(20);
	var property_model_1 = __webpack_require__(175);
	var PropertiesContainerComponent = (function () {
	    function PropertiesContainerComponent($location, $routeParams, propertyActionCreator, _invokeAsync) {
	        var _this = this;
	        this.$location = $location;
	        this.$routeParams = $routeParams;
	        this.propertyActionCreator = propertyActionCreator;
	        this._invokeAsync = _invokeAsync;
	        this.storeOnChange = function (state) {
	            _this.entities = state.properties;
	            if (state.lastTriggeredByAction instanceof actions.SetCurrentPropertyAction && !state.lastTriggeredByAction.entity)
	                _this.$location.path("/admin/properties");
	            if (state.lastTriggeredByAction instanceof actions.SetCurrentPropertyAction && state.lastTriggeredByAction.entity)
	                _this.$location.path("/admin/property/edit/" + state.lastTriggeredByAction.entity.id);
	            if (state.lastTriggeredByAction instanceof actions.AddOrUpdatePropertyAction)
	                _this.entity = new property_model_1.Property();
	            if (state.lastTriggeredByAction instanceof actions.RemovePropertyAction && _this.entity && _this.entity.id) {
	                _this.entity = pluck_1.pluck({ value: Number(_this.$routeParams["propertyId"]), items: _this.entities });
	                if (Object.keys(_this.entity).length === 0) {
	                    _this.$location.path("/admin/properties");
	                }
	            }
	        };
	        this.ngOnInit = function () {
	            if (_this.$routeParams["propertyId"]) {
	                _this.entity = pluck_1.pluck({ value: Number(_this.$routeParams["propertyId"]), items: _this.entities });
	            }
	            else {
	                _this.entity = new property_model_1.Property();
	            }
	        };
	        this.edit = function (entity) { return _this.propertyActionCreator.edit(entity); };
	        this.remove = function (entity) { return _this.propertyActionCreator.remove(entity); };
	        this.create = function (entity) { return _this.propertyActionCreator.create(); };
	        this.addOrUpdate = function (options) {
	            _this._invokeAsync({
	                action: _this.propertyActionCreator.addOrUpdate,
	                params: { data: options.data }
	            }).then(function () {
	                if (_this.$location.path() === "/admin/properties") {
	                    _this.entity = new property_model_1.Property();
	                }
	                else {
	                    _this.$location.path("/admin/properties");
	                }
	            });
	        };
	    }
	    PropertiesContainerComponent = __decorate([
	        core_1.Component({
	            routes: ["/admin/properties", "/admin/property/edit/:propertyId"],
	            template: __webpack_require__(176),
	            styles: [__webpack_require__(177)],
	            selector: "properties-container",
	            viewProviders: ["$location", "$routeParams", "propertyActionCreator", "invokeAsync"],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }),
	        core_1.CanActivate(["$q", "$route", "invokeAsync", "propertyActionCreator", function ($q, $route, invokeAsync, propertyActionCreator) {
	                var propertyId = $route.current.params.propertyId;
	                var promises = [invokeAsync(propertyActionCreator.all)];
	                if (propertyId) {
	                    promises.push(invokeAsync({ action: propertyActionCreator.getById, params: { id: propertyId } }));
	                }
	                ;
	                return $q.all(promises);
	            }]), 
	        __metadata('design:paramtypes', [Object, Object, property_action_creator_1.PropertyActionCreator, Object])
	    ], PropertiesContainerComponent);
	    return PropertiesContainerComponent;
	}());
	exports.PropertiesContainerComponent = PropertiesContainerComponent;


/***/ },
/* 175 */
/***/ function(module, exports) {

	"use strict";
	var Property = (function () {
	    function Property() {
	    }
	    return Property;
	}());
	exports.Property = Property;


/***/ },
/* 176 */
/***/ function(module, exports) {

	module.exports = "<div>\r\n    <property-editor entity=\"vm.entity\" edit=\"vm.edit\" remove=\"vm.remove\" add-or-update=\"vm.addOrUpdate\" create=\"vm.create\"></property-editor>\r\n    <property-list entities=\"vm.entities\" edit=\"vm.edit\" remove=\"vm.remove\"></property-list>\r\n</div>\r\n"

/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(178);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./properties-container.component.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./properties-container.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 178 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 179 */
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
	var actions = __webpack_require__(97);
	var section_action_creator_1 = __webpack_require__(96);
	var section_model_1 = __webpack_require__(180);
	var SectionsContainerComponent = (function () {
	    function SectionsContainerComponent($location, $routeParams, sectionActionCreator, _invokeAsync) {
	        var _this = this;
	        this.$location = $location;
	        this.$routeParams = $routeParams;
	        this.sectionActionCreator = sectionActionCreator;
	        this._invokeAsync = _invokeAsync;
	        this.storeOnChange = function (state) {
	            _this.entities = state.sections;
	            if (state.lastTriggeredByAction instanceof actions.SetCurrentSectionAction && !state.lastTriggeredByAction.entity)
	                _this.$location.path("/admin/sections");
	            if (state.lastTriggeredByAction instanceof actions.SetCurrentSectionAction && state.lastTriggeredByAction.entity)
	                _this.$location.path("/admin/section/edit/" + state.lastTriggeredByAction.entity.id);
	            if (state.lastTriggeredByAction instanceof actions.AddOrUpdateSectionAction)
	                _this.entity = new section_model_1.Section();
	            if (state.lastTriggeredByAction instanceof actions.RemoveSectionAction && _this.entity && _this.entity.id) {
	                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["sectionId"]), items: _this.entities });
	                if (Object.keys(_this.entity).length === 0) {
	                    _this.$location.path("/admin/sections");
	                }
	            }
	        };
	        this.ngOnInit = function () {
	            if (_this.$routeParams["sectionId"]) {
	                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["sectionId"]), items: _this.entities });
	            }
	            else {
	                _this.entity = new section_model_1.Section();
	            }
	        };
	        this.edit = function (entity) { return _this.sectionActionCreator.edit(entity); };
	        this.remove = function (entity) { return _this.sectionActionCreator.remove(entity); };
	        this.create = function (entity) { return _this.sectionActionCreator.create(); };
	        this.addOrUpdate = function (options) {
	            _this._invokeAsync({
	                action: _this.sectionActionCreator.addOrUpdate,
	                params: { data: options.data }
	            }).then(function () {
	                if (_this.$location.path() === "/admin/sections") {
	                    _this.entity = new section_model_1.Section();
	                }
	                else {
	                    _this.$location.path("/admin/sections");
	                }
	            });
	        };
	    }
	    SectionsContainerComponent = __decorate([
	        core_1.Component({
	            routes: ["/admin/sections", "/admin/section/edit/:sectionId"],
	            template: __webpack_require__(181),
	            styles: [__webpack_require__(182)],
	            selector: "sections-container",
	            viewProviders: ["$location", "$routeParams", "sectionActionCreator", "invokeAsync"],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }),
	        core_1.CanActivate(["$q", "$route", "invokeAsync", "sectionActionCreator", function ($q, $route, invokeAsync, sectionActionCreator) {
	                var sectionId = $route.current.params.sectionId;
	                var promises = [invokeAsync(sectionActionCreator.all)];
	                if (sectionId) {
	                    promises.push(invokeAsync({ action: sectionActionCreator.getById, params: { id: sectionId } }));
	                }
	                ;
	                return $q.all(promises);
	            }]), 
	        __metadata('design:paramtypes', [Object, Object, section_action_creator_1.SectionActionCreator, Object])
	    ], SectionsContainerComponent);
	    return SectionsContainerComponent;
	}());
	exports.SectionsContainerComponent = SectionsContainerComponent;


/***/ },
/* 180 */
/***/ function(module, exports) {

	"use strict";
	var Section = (function () {
	    function Section() {
	    }
	    return Section;
	}());
	exports.Section = Section;


/***/ },
/* 181 */
/***/ function(module, exports) {

	module.exports = "<div>\r\n    <section-editor entity=\"vm.entity\" edit=\"vm.edit\" remove=\"vm.remove\" add-or-update=\"vm.addOrUpdate\" create=\"vm.create\"></section-editor>\r\n    <section-list entities=\"vm.entities\" edit=\"vm.edit\" remove=\"vm.remove\"></section-list>\r\n</div>\r\n"

/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(183);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./sections-container.component.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./sections-container.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 183 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 184 */
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
	var actions = __webpack_require__(99);
	var ui_action_creator_1 = __webpack_require__(98);
	var ui_model_1 = __webpack_require__(185);
	var UIsContainerComponent = (function () {
	    function UIsContainerComponent($location, $routeParams, uiActionCreator, _invokeAsync) {
	        var _this = this;
	        this.$location = $location;
	        this.$routeParams = $routeParams;
	        this.uiActionCreator = uiActionCreator;
	        this._invokeAsync = _invokeAsync;
	        this.storeOnChange = function (state) {
	            _this.entities = state.uis;
	            if (state.lastTriggeredByAction instanceof actions.SetCurrentUIAction && !state.lastTriggeredByAction.entity)
	                _this.$location.path("/admin/uis");
	            if (state.lastTriggeredByAction instanceof actions.SetCurrentUIAction && state.lastTriggeredByAction.entity)
	                _this.$location.path("/admin/ui/edit/" + state.lastTriggeredByAction.entity.id);
	            if (state.lastTriggeredByAction instanceof actions.AddOrUpdateUIAction)
	                _this.entity = new ui_model_1.UI();
	            if (state.lastTriggeredByAction instanceof actions.RemoveUIAction && _this.entity && _this.entity.id) {
	                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["uiId"]), items: _this.entities });
	                if (Object.keys(_this.entity).length === 0) {
	                    _this.$location.path("/admin/uis");
	                }
	            }
	        };
	        this.ngOnInit = function () {
	            if (_this.$routeParams["uiId"]) {
	                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["uiId"]), items: _this.entities });
	            }
	            else {
	                _this.entity = new ui_model_1.UI();
	            }
	        };
	        this.edit = function (entity) { return _this.uiActionCreator.edit(entity); };
	        this.remove = function (entity) { return _this.uiActionCreator.remove(entity); };
	        this.create = function (entity) { return _this.uiActionCreator.create(); };
	        this.addOrUpdate = function (options) {
	            _this._invokeAsync({
	                action: _this.uiActionCreator.addOrUpdate,
	                params: { data: options.data }
	            }).then(function () {
	                if (_this.$location.path() === "/admin/uis") {
	                    _this.entity = new ui_model_1.UI();
	                }
	                else {
	                    _this.$location.path("/admin/uis");
	                }
	            });
	        };
	    }
	    UIsContainerComponent = __decorate([
	        core_1.Component({
	            routes: ["/admin/uis", "/admin/ui/edit/:uiId"],
	            template: __webpack_require__(186),
	            styles: [__webpack_require__(187)],
	            selector: "uis-container",
	            viewProviders: ["$location", "$routeParams", "uiActionCreator", "invokeAsync"],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }),
	        core_1.CanActivate(["$q", "$route", "invokeAsync", "uiActionCreator", function ($q, $route, invokeAsync, uiActionCreator) {
	                var uiId = $route.current.params.uiId;
	                var promises = [invokeAsync(uiActionCreator.all)];
	                if (uiId) {
	                    promises.push(invokeAsync({ action: uiActionCreator.getById, params: { id: uiId } }));
	                }
	                ;
	                return $q.all(promises);
	            }]), 
	        __metadata('design:paramtypes', [Object, Object, ui_action_creator_1.UIActionCreator, Object])
	    ], UIsContainerComponent);
	    return UIsContainerComponent;
	}());
	exports.UIsContainerComponent = UIsContainerComponent;


/***/ },
/* 185 */
/***/ function(module, exports) {

	"use strict";
	var UI = (function () {
	    function UI() {
	    }
	    return UI;
	}());
	exports.UI = UI;


/***/ },
/* 186 */
/***/ function(module, exports) {

	module.exports = "<div>\r\n    <ui-editor entity=\"vm.entity\" edit=\"vm.edit\" remove=\"vm.remove\" add-or-update=\"vm.addOrUpdate\" create=\"vm.create\"></ui-editor>\r\n    <ui-list entities=\"vm.entities\" edit=\"vm.edit\" remove=\"vm.remove\"></ui-list>\r\n</div>\r\n"

/***/ },
/* 187 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(188);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./uis-container.component.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./uis-container.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 188 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 189 */
/***/ function(module, exports) {

	

/***/ },
/* 190 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(3);
	var AppReducers = __webpack_require__(191);
	var PropertyReducers = __webpack_require__(192);
	var SectionReducers = __webpack_require__(193);
	var UIReducers = __webpack_require__(194);
	var contentAggregationReducersModule = angular.module("app.contentAggregation.reducers", []);
	core_1.bootstrap(contentAggregationReducersModule, {
	    reducers: [AppReducers, PropertyReducers, SectionReducers, UIReducers]
	});


/***/ },
/* 191 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var actions = __webpack_require__(93);
	var core_1 = __webpack_require__(3);
	exports.removeAppReducer = function (state, action) {
	    if (action instanceof actions.RemoveAppAction)
	        core_1.pluckOut({ items: state.apps, value: action.entity.id });
	    return state;
	};
	exports.addAppReducer = function (state, action) {
	    if (action instanceof actions.AddOrUpdateAppAction) {
	        core_1.addOrUpdate({ items: state.apps, item: action.entity });
	    }
	    return state;
	};
	exports.allAppsReducer = function (state, action) {
	    if (action instanceof actions.AllAppsAction) {
	        state.apps = action.entities;
	    }
	    return state;
	};
	exports.setCurrentAppReducer = function (state, action) {
	    if (action instanceof actions.SetCurrentAppAction) {
	        state.currentAppId = action.id;
	    }
	    return state;
	};


/***/ },
/* 192 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var actions = __webpack_require__(95);
	var core_1 = __webpack_require__(3);
	exports.removePropertyReducer = function (state, action) {
	    if (action instanceof actions.RemovePropertyAction)
	        core_1.pluckOut({ items: state.properties, value: action.entity.id });
	    return state;
	};
	exports.addPropertyReducer = function (state, action) {
	    if (action instanceof actions.AddOrUpdatePropertyAction) {
	        core_1.addOrUpdate({ items: state.properties, item: action.entity });
	    }
	    return state;
	};
	exports.allPropertiesReducer = function (state, action) {
	    if (action instanceof actions.AllPropertiesAction) {
	        state.properties = action.entities;
	    }
	    return state;
	};
	exports.setCurrentPropertyReducer = function (state, action) {
	    if (action instanceof actions.SetCurrentPropertyAction) {
	        state.currentPropertyId = action.id;
	    }
	    return state;
	};


/***/ },
/* 193 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var actions = __webpack_require__(97);
	var core_1 = __webpack_require__(3);
	exports.removeSectionReducer = function (state, action) {
	    if (action instanceof actions.RemoveSectionAction)
	        core_1.pluckOut({ items: state.sections, value: action.entity.id });
	    return state;
	};
	exports.addSectionReducer = function (state, action) {
	    if (action instanceof actions.AddOrUpdateSectionAction) {
	        core_1.addOrUpdate({ items: state.sections, item: action.entity });
	    }
	    return state;
	};
	exports.allSectionsReducer = function (state, action) {
	    if (action instanceof actions.AllSectionsAction) {
	        state.sections = action.entities;
	    }
	    return state;
	};
	exports.setCurrentSectionReducer = function (state, action) {
	    if (action instanceof actions.SetCurrentSectionAction) {
	        state.currentSectionId = action.id;
	    }
	    return state;
	};


/***/ },
/* 194 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var actions = __webpack_require__(99);
	var core_1 = __webpack_require__(3);
	exports.removeUIReducer = function (state, action) {
	    if (action instanceof actions.RemoveUIAction)
	        core_1.pluckOut({ items: state.uis, value: action.entity.id });
	    return state;
	};
	exports.addUIReducer = function (state, action) {
	    if (action instanceof actions.AddOrUpdateUIAction) {
	        core_1.addOrUpdate({ items: state.uis, item: action.entity });
	    }
	    return state;
	};
	exports.allUIsReducer = function (state, action) {
	    if (action instanceof actions.AllUIsAction) {
	        state.uis = action.entities;
	    }
	    return state;
	};
	exports.setCurrentUIReducer = function (state, action) {
	    if (action instanceof actions.SetCurrentUIAction) {
	        state.currentUiId = action.id;
	    }
	    return state;
	};


/***/ },
/* 195 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var core_1 = __webpack_require__(3);
	var app_service_1 = __webpack_require__(196);
	var property_service_1 = __webpack_require__(197);
	var section_service_1 = __webpack_require__(198);
	var ui_service_1 = __webpack_require__(199);
	var contentAggregationServicesModule = angular.module("app.contentAggregation.services", []);
	core_1.bootstrap(contentAggregationServicesModule, {
	    providers: [app_service_1.AppService, property_service_1.PropertyService, section_service_1.SectionService, ui_service_1.UIService]
	});
	__export(__webpack_require__(196));
	__export(__webpack_require__(197));
	__export(__webpack_require__(198));
	__export(__webpack_require__(199));


/***/ },
/* 196 */
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
	var AppService = (function (_super) {
	    __extends(AppService, _super);
	    function AppService($q, apiEndpoint, fetch) {
	        _super.call(this, $q, apiEndpoint, fetch);
	    }
	    Object.defineProperty(AppService.prototype, "baseUri", {
	        get: function () { return this.apiEndpoint.getBaseUrl() + "/app"; },
	        enumerable: true,
	        configurable: true
	    });
	    AppService = __decorate([
	        core_1.Injectable(),
	        core_1.Service({
	            serviceName: "appService",
	            viewProviders: ["$q", "apiEndpoint", "fetch"]
	        }), 
	        __metadata('design:paramtypes', [Function, Object, Object])
	    ], AppService);
	    return AppService;
	}(core_1.BaseService));
	exports.AppService = AppService;


/***/ },
/* 197 */
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
	var PropertyService = (function (_super) {
	    __extends(PropertyService, _super);
	    function PropertyService($q, apiEndpoint, fetch) {
	        _super.call(this, $q, apiEndpoint, fetch);
	    }
	    Object.defineProperty(PropertyService.prototype, "baseUri", {
	        get: function () { return this.apiEndpoint.getBaseUrl() + "/property"; },
	        enumerable: true,
	        configurable: true
	    });
	    PropertyService = __decorate([
	        core_1.Injectable(),
	        core_1.Service({
	            serviceName: "propertyService",
	            viewProviders: ["$q", "apiEndpoint", "fetch"]
	        }), 
	        __metadata('design:paramtypes', [Function, Object, Object])
	    ], PropertyService);
	    return PropertyService;
	}(core_1.BaseService));
	exports.PropertyService = PropertyService;


/***/ },
/* 198 */
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
	var SectionService = (function (_super) {
	    __extends(SectionService, _super);
	    function SectionService($q, apiEndpoint, fetch) {
	        _super.call(this, $q, apiEndpoint, fetch);
	    }
	    Object.defineProperty(SectionService.prototype, "baseUri", {
	        get: function () { return this.apiEndpoint.getBaseUrl() + "/section"; },
	        enumerable: true,
	        configurable: true
	    });
	    SectionService = __decorate([
	        core_1.Injectable(),
	        core_1.Service({
	            serviceName: "sectionService",
	            viewProviders: ["$q", "apiEndpoint", "fetch"]
	        }), 
	        __metadata('design:paramtypes', [Function, Object, Object])
	    ], SectionService);
	    return SectionService;
	}(core_1.BaseService));
	exports.SectionService = SectionService;


/***/ },
/* 199 */
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
	var UIService = (function (_super) {
	    __extends(UIService, _super);
	    function UIService($q, apiEndpoint, fetch) {
	        _super.call(this, $q, apiEndpoint, fetch);
	    }
	    Object.defineProperty(UIService.prototype, "baseUri", {
	        get: function () { return this.apiEndpoint.getBaseUrl() + "/ui"; },
	        enumerable: true,
	        configurable: true
	    });
	    UIService = __decorate([
	        core_1.Injectable(),
	        core_1.Service({
	            serviceName: "uiService",
	            viewProviders: ["$q", "apiEndpoint", "fetch"]
	        }), 
	        __metadata('design:paramtypes', [Function, Object, Object])
	    ], UIService);
	    return UIService;
	}(core_1.BaseService));
	exports.UIService = UIService;


/***/ },
/* 200 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var containers_1 = __webpack_require__(168);
	exports.ContentAggregationRoutes = [
	    {
	        path: "/admin/apps",
	        component: containers_1.AppsContainerComponent,
	        authorizationRequired: true
	    },
	    {
	        path: "/admin/app/:appid",
	        component: containers_1.AppsContainerComponent,
	        authorizationRequired: true
	    },
	    {
	        path: "/admin/properties",
	        component: containers_1.PropertiesContainerComponent,
	        authorizationRequired: true
	    },
	    {
	        path: "/admin/properties/:propertyid",
	        component: containers_1.PropertiesContainerComponent,
	        authorizationRequired: true
	    },
	    {
	        path: "/admin/sections",
	        component: containers_1.SectionsContainerComponent,
	        authorizationRequired: true
	    },
	    {
	        path: "/admin/sections/:sectionid",
	        component: containers_1.SectionsContainerComponent,
	        authorizationRequired: true
	    },
	    {
	        path: "/admin/uis",
	        component: containers_1.UIsContainerComponent,
	        authorizationRequired: true
	    },
	    {
	        path: "/admin/properties/:uiid",
	        component: containers_1.UIsContainerComponent,
	        authorizationRequired: true
	    }
	];


/***/ },
/* 201 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var core_1 = __webpack_require__(3);
	var customer_component_1 = __webpack_require__(202);
	var customer_action_creator_1 = __webpack_require__(206);
	var reducers = __webpack_require__(207);
	var actions = __webpack_require__(208);
	var customersModule = angular.module("quinntynebrown.customers", []);
	core_1.bootstrap(customersModule, {
	    components: [customer_component_1.CustomerComponent],
	    providers: [customer_action_creator_1.CustomerActionCreator],
	    reducers: reducers,
	    actions: actions
	});
	__export(__webpack_require__(209));


/***/ },
/* 202 */
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
	            template: __webpack_require__(203),
	            styles: [__webpack_require__(204)],
	            selector: "customer",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], CustomerComponent);
	    return CustomerComponent;
	}());
	exports.CustomerComponent = CustomerComponent;


/***/ },
/* 203 */
/***/ function(module, exports) {

	module.exports = "<div class=\"customer\">\r\n\r\n</div>\r\n"

/***/ },
/* 204 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(205);
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
/* 205 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 206 */
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
/* 207 */
/***/ function(module, exports) {

	"use strict";


/***/ },
/* 208 */
/***/ function(module, exports) {

	"use strict";
	var Default = (function () {
	    function Default() {
	    }
	    return Default;
	}());
	exports.Default = Default;


/***/ },
/* 209 */
/***/ function(module, exports) {

	"use strict";
	exports.CustomersRoutes = [];


/***/ },
/* 210 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var core_1 = __webpack_require__(3);
	var gallery_component_1 = __webpack_require__(211);
	var galleries_container_component_1 = __webpack_require__(215);
	var featured_gallery_container_component_1 = __webpack_require__(219);
	var gallery_editor_container_component_1 = __webpack_require__(223);
	var gallery_action_creator_1 = __webpack_require__(227);
	var reducers = __webpack_require__(228);
	var actions = __webpack_require__(229);
	var galleriesModule = angular.module("quinntynebrown.galleries", []);
	core_1.bootstrap(galleriesModule, {
	    components: [gallery_component_1.GalleryComponent, gallery_editor_container_component_1.GalleryEditorContainerComponent, galleries_container_component_1.GalleriesContainerComponent, featured_gallery_container_component_1.FeaturedGalleryContainerComponent],
	    providers: [gallery_action_creator_1.GalleryActionCreator],
	    reducers: reducers,
	    actions: actions
	});
	__export(__webpack_require__(230));


/***/ },
/* 211 */
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
	            template: __webpack_require__(212),
	            styles: [__webpack_require__(213)],
	            selector: "gallery",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], GalleryComponent);
	    return GalleryComponent;
	}());
	exports.GalleryComponent = GalleryComponent;


/***/ },
/* 212 */
/***/ function(module, exports) {

	module.exports = "<div class=\"gallery\">\r\n\r\n</div>\r\n"

/***/ },
/* 213 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(214);
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
/* 214 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 215 */
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
	            template: __webpack_require__(216),
	            styles: [__webpack_require__(217)],
	            selector: "galleries-container",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], GalleriesContainerComponent);
	    return GalleriesContainerComponent;
	}());
	exports.GalleriesContainerComponent = GalleriesContainerComponent;


/***/ },
/* 216 */
/***/ function(module, exports) {

	module.exports = "<div class=\"galleries-container\">\r\n\r\n</div>\r\n"

/***/ },
/* 217 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(218);
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
/* 218 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 219 */
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
	            template: __webpack_require__(220),
	            styles: [__webpack_require__(221)],
	            selector: "featured-gallery-container",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], FeaturedGalleryContainerComponent);
	    return FeaturedGalleryContainerComponent;
	}());
	exports.FeaturedGalleryContainerComponent = FeaturedGalleryContainerComponent;


/***/ },
/* 220 */
/***/ function(module, exports) {

	module.exports = "<div class=\"featured-gallery-container\">\r\n    <div class=\"featured-gallery-container-inner\">\r\n        <img class=\"featured-gallery-container-img\" src=\"src/assets/images/Squad.jpg\" />\r\n    </div>    \r\n</div>\r\n"

/***/ },
/* 221 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(222);
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
/* 222 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, ".featured-gallery-container {\n  margin-top: 60px; }\n\n.featured-gallery-container-inner {\n  max-width: 1280px;\n  margin: 0 auto; }\n\n.featured-gallery-container-img {\n  width: 100%;\n  max-width: 1280px; }\n", ""]);

	// exports


/***/ },
/* 223 */
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
	            template: __webpack_require__(224),
	            styles: [__webpack_require__(225)],
	            selector: "gallery-editor-container",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], GalleryEditorContainerComponent);
	    return GalleryEditorContainerComponent;
	}());
	exports.GalleryEditorContainerComponent = GalleryEditorContainerComponent;


/***/ },
/* 224 */
/***/ function(module, exports) {

	module.exports = "<div class=\"gallery-editor-container\">\r\n    <h1>Gallery Editor Container</h1>\r\n</div>\r\n"

/***/ },
/* 225 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(226);
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
/* 226 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 227 */
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
/* 228 */
/***/ function(module, exports) {

	"use strict";


/***/ },
/* 229 */
/***/ function(module, exports) {

	"use strict";
	var Default = (function () {
	    function Default() {
	    }
	    return Default;
	}());
	exports.Default = Default;


/***/ },
/* 230 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var gallery_editor_container_component_1 = __webpack_require__(223);
	var gallery_container_component_1 = __webpack_require__(231);
	var featured_gallery_container_component_1 = __webpack_require__(219);
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
/* 231 */
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
	            template: __webpack_require__(232),
	            styles: [__webpack_require__(233)],
	            selector: "gallery-container",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], GalleryContainerComponent);
	    return GalleryContainerComponent;
	}());
	exports.GalleryContainerComponent = GalleryContainerComponent;


/***/ },
/* 232 */
/***/ function(module, exports) {

	module.exports = "<div class=\"gallery-container\">\r\n\r\n</div>\r\n"

/***/ },
/* 233 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(234);
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
/* 234 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 235 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var core_1 = __webpack_require__(3);
	var login_container_component_1 = __webpack_require__(236);
	var loginModule = angular.module("quinntynebrown.login", []);
	core_1.bootstrap(loginModule, {
	    components: [login_container_component_1.LoginContainerComponent]
	});
	__export(__webpack_require__(240));


/***/ },
/* 236 */
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
	            template: __webpack_require__(237),
	            styles: [__webpack_require__(238)],
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
/* 237 */
/***/ function(module, exports) {

	module.exports = "<div class=\"login-container\">\r\n    <login></login>\r\n</div>\r\n"

/***/ },
/* 238 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(239);
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
/* 239 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 240 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var login_container_component_1 = __webpack_require__(236);
	exports.LoginRoutes = [
	    {
	        path: "/login",
	        component: login_container_component_1.LoginContainerComponent
	    }
	];


/***/ },
/* 241 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var core_1 = __webpack_require__(3);
	var order_editor_component_1 = __webpack_require__(242);
	var order_list_component_1 = __webpack_require__(246);
	var order_component_1 = __webpack_require__(250);
	var orders_container_component_1 = __webpack_require__(254);
	var order_action_creator_1 = __webpack_require__(256);
	var order_service_1 = __webpack_require__(261);
	var reducers = __webpack_require__(262);
	var actions = __webpack_require__(255);
	var appOrdersModule = angular.module("quinntynebrown.orders", []);
	core_1.bootstrap(appOrdersModule, {
	    components: [order_component_1.OrderComponent, order_editor_component_1.OrderEditorComponent, orders_container_component_1.OrdersContainerComponent, order_list_component_1.OrderListComponent],
	    providers: [order_action_creator_1.OrderActionCreator, order_service_1.OrderService],
	    reducers: reducers,
	    actions: actions
	});
	__export(__webpack_require__(263));


/***/ },
/* 242 */
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
	var OrderEditorComponent = (function () {
	    function OrderEditorComponent() {
	    }
	    OrderEditorComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(243),
	            styles: [__webpack_require__(244)],
	            selector: "order-editor",
	            inputs: ['entity', 'addOrUpdate', 'remove', 'create'],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], OrderEditorComponent);
	    return OrderEditorComponent;
	}());
	exports.OrderEditorComponent = OrderEditorComponent;


/***/ },
/* 243 */
/***/ function(module, exports) {

	module.exports = "<div class=\"orderEditor\">\r\n\r\n    <h1  data-ng-if=\"!vm.entity.id\">Create Order <span data-ng-if=\"vm.entity.name.length > 0\">: {{ vm.entity.name }}</span></h1>\r\n\r\n    <h1 data-ng-if=\"vm.entity.id\">Edit Order: {{ vm.entity.name }}</h1>\r\n\r\n    <tabs tabs-name=\"order-editor\">\r\n\r\n        <tab-title>General</tab-title>\r\n\r\n        <tab-content>\r\n            <div>\r\n                <input class=\"inputField\" type=\"text\" placeholder=\"Order Name\" data-ng-model=\"vm.entity.name\" />\r\n            </div>\r\n        </tab-content>\r\n\r\n    </tabs>\r\n\r\n    <div>\r\n        <calypso-button on-click=\"vm.addOrUpdate({ data: vm.entity })\" caption=\"Save\"></calypso-button>\r\n\r\n        <calypso-button on-click=\"vm.create()\" caption=\"Create\"></calypso-button>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 244 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(245);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./order-editor.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./order-editor.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 245 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 246 */
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
	var OrderListComponent = (function () {
	    function OrderListComponent() {
	    }
	    OrderListComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(247),
	            styles: [__webpack_require__(248)],
	            selector: "order-list",
	            inputs: ['entities', 'edit', 'remove'],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], OrderListComponent);
	    return OrderListComponent;
	}());
	exports.OrderListComponent = OrderListComponent;


/***/ },
/* 247 */
/***/ function(module, exports) {

	module.exports = "<div class=\"orderList\">\r\n    <div class=\"orderList-header\">\r\n        <h1>Orders</h1>\r\n    </div>\r\n    \r\n    <div data-ng-repeat=\"entity in vm.entities\" class=\"orderList-item\">\r\n        <div class=\"orderList-name\">\r\n            {{ entity.name }}\r\n        </div>\r\n        <div class=\"orderList-actions\">\r\n            <span data-ng-click=\"vm.edit({ entity: this.entity })\">edit</span>&nbsp;&nbsp;|&nbsp;&nbsp;<span data-ng-click=\"vm.remove({ entity: this.entity })\">remove</span>\r\n        </div>\r\n        <div style=\"clear:both;\"></div>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 248 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(249);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./order-list.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./order-list.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 249 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, ".orderList-name,\n.orderList-actions {\n  position: relative;\n  float: left; }\n\n.orderList-name {\n  min-width: 200px; }\n\n.orderList-item {\n  height: 50px; }\n\n.orderList-actions span {\n  cursor: pointer; }\n\n.orderList-actions {\n  text-transform: uppercase; }\n", ""]);

	// exports


/***/ },
/* 250 */
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
	var OrderComponent = (function () {
	    function OrderComponent() {
	    }
	    OrderComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(251),
	            styles: [__webpack_require__(252)],
	            selector: "order",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], OrderComponent);
	    return OrderComponent;
	}());
	exports.OrderComponent = OrderComponent;


/***/ },
/* 251 */
/***/ function(module, exports) {

	module.exports = "<div class=\"order\">\r\n\r\n</div>\r\n"

/***/ },
/* 252 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(253);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./order.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./order.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 253 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 254 */
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
	var actions = __webpack_require__(255);
	var order_action_creator_1 = __webpack_require__(256);
	var order_model_1 = __webpack_require__(257);
	var OrdersContainerComponent = (function () {
	    function OrdersContainerComponent($location, $routeParams, orderActionCreator, _invokeAsync) {
	        var _this = this;
	        this.$location = $location;
	        this.$routeParams = $routeParams;
	        this.orderActionCreator = orderActionCreator;
	        this._invokeAsync = _invokeAsync;
	        this.storeOnChange = function (state) {
	            _this.entities = state.orders;
	            if (state.lastTriggeredByAction instanceof actions.SetCurrentOrderAction && !state.lastTriggeredByAction.entity)
	                _this.$location.path("/admin/orders");
	            if (state.lastTriggeredByAction instanceof actions.SetCurrentOrderAction && state.lastTriggeredByAction.entity)
	                _this.$location.path("/admin/order/edit/" + state.lastTriggeredByAction.entity.id);
	            if (state.lastTriggeredByAction instanceof actions.AddOrUpdateOrderAction)
	                _this.entity = new order_model_1.Order();
	            if (state.lastTriggeredByAction instanceof actions.RemoveOrderAction && _this.entity && _this.entity.id) {
	                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["orderId"]), items: _this.entities });
	                if (Object.keys(_this.entity).length === 0) {
	                    _this.$location.path("/admin/orders");
	                }
	            }
	        };
	        this.ngOnInit = function () {
	            if (_this.$routeParams["orderId"]) {
	                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["orderId"]), items: _this.entities });
	            }
	            else {
	                _this.entity = new order_model_1.Order();
	            }
	        };
	        this.edit = function (entity) { return _this.orderActionCreator.edit(entity); };
	        this.remove = function (entity) { return _this.orderActionCreator.remove(entity); };
	        this.create = function (entity) { return _this.orderActionCreator.create(); };
	        this.addOrUpdate = function (options) {
	            _this._invokeAsync({
	                action: _this.orderActionCreator.addOrUpdate,
	                params: { data: options.data }
	            }).then(function () {
	                if (_this.$location.path() === "/admin/orders") {
	                    _this.entity = new order_model_1.Order();
	                }
	                else {
	                    _this.$location.path("/admin/orders");
	                }
	            });
	        };
	    }
	    OrdersContainerComponent = __decorate([
	        core_1.Component({
	            routes: ["/admin/orders", "/admin/order/edit/:orderId"],
	            template: __webpack_require__(258),
	            styles: [__webpack_require__(259)],
	            selector: "orders-container",
	            viewProviders: ["$location", "$routeParams", "orderActionCreator", "invokeAsync"],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }),
	        core_1.CanActivate(["$q", "$route", "invokeAsync", "orderActionCreator", function ($q, $route, invokeAsync, orderActionCreator) {
	                var orderId = $route.current.params.orderId;
	                var promises = [invokeAsync(orderActionCreator.all)];
	                if (orderId) {
	                    promises.push(invokeAsync({ action: orderActionCreator.getById, params: { id: orderId } }));
	                }
	                ;
	                return $q.all(promises);
	            }]), 
	        __metadata('design:paramtypes', [Object, Object, order_action_creator_1.OrderActionCreator, Object])
	    ], OrdersContainerComponent);
	    return OrdersContainerComponent;
	}());
	exports.OrdersContainerComponent = OrdersContainerComponent;


/***/ },
/* 255 */
/***/ function(module, exports) {

	"use strict";
	var AddOrUpdateOrderAction = (function () {
	    function AddOrUpdateOrderAction(id, entity) {
	        this.id = id;
	        this.entity = entity;
	    }
	    return AddOrUpdateOrderAction;
	}());
	exports.AddOrUpdateOrderAction = AddOrUpdateOrderAction;
	var AllOrdersAction = (function () {
	    function AllOrdersAction(id, entities) {
	        this.id = id;
	        this.entities = entities;
	    }
	    return AllOrdersAction;
	}());
	exports.AllOrdersAction = AllOrdersAction;
	var RemoveOrderAction = (function () {
	    function RemoveOrderAction(id, entity) {
	        this.id = id;
	        this.entity = entity;
	    }
	    return RemoveOrderAction;
	}());
	exports.RemoveOrderAction = RemoveOrderAction;
	var OrdersFilterAction = (function () {
	    function OrdersFilterAction(id, term) {
	        this.id = id;
	        this.term = term;
	    }
	    return OrdersFilterAction;
	}());
	exports.OrdersFilterAction = OrdersFilterAction;
	var SetCurrentOrderAction = (function () {
	    function SetCurrentOrderAction(entity) {
	        this.entity = entity;
	    }
	    return SetCurrentOrderAction;
	}());
	exports.SetCurrentOrderAction = SetCurrentOrderAction;
	var AddOrUpdateOrderSuccessAction = (function () {
	    function AddOrUpdateOrderSuccessAction(entity) {
	        this.entity = entity;
	    }
	    return AddOrUpdateOrderSuccessAction;
	}());
	exports.AddOrUpdateOrderSuccessAction = AddOrUpdateOrderSuccessAction;
	var CurrentOrderRemovedAction = (function () {
	    function CurrentOrderRemovedAction() {
	    }
	    return CurrentOrderRemovedAction;
	}());
	exports.CurrentOrderRemovedAction = CurrentOrderRemovedAction;


/***/ },
/* 256 */
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
	var order_actions_1 = __webpack_require__(255);
	var OrderActionCreator = (function (_super) {
	    __extends(OrderActionCreator, _super);
	    function OrderActionCreator($location, dispatcher, orderService, guid, invokeAsync, modalActionCreator) {
	        var _this = this;
	        _super.call(this, $location, orderService, dispatcher, guid, order_actions_1.AddOrUpdateOrderAction, order_actions_1.AllOrdersAction, order_actions_1.RemoveOrderAction, order_actions_1.SetCurrentOrderAction);
	        this.invokeAsync = invokeAsync;
	        this.modalActionCreator = modalActionCreator;
	        this.addOrUpdateSuccess = function (options) { return _this.dispatcher.dispatch(new order_actions_1.AddOrUpdateOrderSuccessAction(options.entity)); };
	        this.currentOrderRemoved = function () { return _this.dispatcher.dispatch(new order_actions_1.CurrentOrderRemovedAction()); };
	        this.openAllOrdersModal = function () {
	            _this.invokeAsync(_this.all).then(function (results) {
	                _this.modalActionCreator.open({ html: "<all-order-modal></all-order-modal>" });
	            });
	        };
	    }
	    OrderActionCreator = __decorate([
	        core_1.Service({
	            serviceName: "orderActionCreator",
	            viewProviders: ["$location", "dispatcher", "orderService", "guid", "invokeAsync", "modalActionCreator"]
	        }), 
	        __metadata('design:paramtypes', [Object, Object, Object, Object, Object, modal_action_creator_1.ModalActionCreator])
	    ], OrderActionCreator);
	    return OrderActionCreator;
	}(core_1.BaseActionCreator));
	exports.OrderActionCreator = OrderActionCreator;


/***/ },
/* 257 */
/***/ function(module, exports) {

	"use strict";
	var Order = (function () {
	    function Order() {
	    }
	    return Order;
	}());
	exports.Order = Order;


/***/ },
/* 258 */
/***/ function(module, exports) {

	module.exports = "<div>\r\n    <order-editor entity=\"vm.entity\" edit=\"vm.edit\" remove=\"vm.remove\" add-or-update=\"vm.addOrUpdate\" create=\"vm.create\"></order-editor>\r\n    <order-list entities=\"vm.entities\" edit=\"vm.edit\" remove=\"vm.remove\"></order-list>\r\n</div>\r\n"

/***/ },
/* 259 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(260);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./orders-container.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./orders-container.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 260 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 261 */
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
	var OrderService = (function (_super) {
	    __extends(OrderService, _super);
	    function OrderService($q, apiEndpoint, fetch) {
	        _super.call(this, $q, apiEndpoint, fetch);
	    }
	    Object.defineProperty(OrderService.prototype, "baseUri", {
	        get: function () { return this.apiEndpoint.getBaseUrl() + "/order"; },
	        enumerable: true,
	        configurable: true
	    });
	    OrderService = __decorate([
	        core_1.Injectable(),
	        core_1.Service({
	            serviceName: "orderService",
	            viewProviders: ["$q", "apiEndpoint", "fetch"]
	        }), 
	        __metadata('design:paramtypes', [Function, Object, Object])
	    ], OrderService);
	    return OrderService;
	}(core_1.BaseService));
	exports.OrderService = OrderService;


/***/ },
/* 262 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var actions = __webpack_require__(255);
	var core_1 = __webpack_require__(3);
	exports.removeOrderReducer = function (state, action) {
	    if (action instanceof actions.RemoveOrderAction)
	        core_1.pluckOut({ items: state.orders, value: action.entity.id });
	    return state;
	};
	exports.addOrderReducer = function (state, action) {
	    if (action instanceof actions.AddOrUpdateOrderAction) {
	        core_1.addOrUpdate({ items: state.orders, item: action.entity });
	    }
	    return state;
	};
	exports.allOrdersReducer = function (state, action) {
	    if (action instanceof actions.AllOrdersAction) {
	        state.orders = action.entities;
	    }
	    return state;
	};
	exports.setCurrentOrderReducer = function (state, action) {
	    if (action instanceof actions.SetCurrentOrderAction) {
	        state.currentOrderId = action.id;
	    }
	    return state;
	};


/***/ },
/* 263 */
/***/ function(module, exports) {

	"use strict";
	exports.OrdersRoutes = [];


/***/ },
/* 264 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var core_1 = __webpack_require__(3);
	var photo_component_1 = __webpack_require__(265);
	var photo_editor_container_component_1 = __webpack_require__(269);
	var photo_action_creator_1 = __webpack_require__(273);
	var reducers = __webpack_require__(274);
	var actions = __webpack_require__(275);
	var photosModule = angular.module("quinntynebrown.photos", []);
	core_1.bootstrap(photosModule, {
	    components: [photo_component_1.PhotoComponent, photo_editor_container_component_1.PhotoEditorContainerComponent],
	    providers: [photo_action_creator_1.PhotoActionCreator],
	    reducers: reducers,
	    actions: actions
	});
	__export(__webpack_require__(276));


/***/ },
/* 265 */
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
	            template: __webpack_require__(266),
	            styles: [__webpack_require__(267)],
	            selector: "photo",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], PhotoComponent);
	    return PhotoComponent;
	}());
	exports.PhotoComponent = PhotoComponent;


/***/ },
/* 266 */
/***/ function(module, exports) {

	module.exports = "<div class=\"photo\">\r\n\r\n</div>\r\n"

/***/ },
/* 267 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(268);
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
/* 268 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 269 */
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
	            template: __webpack_require__(270),
	            styles: [__webpack_require__(271)],
	            selector: "photo-editor-container",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], PhotoEditorContainerComponent);
	    return PhotoEditorContainerComponent;
	}());
	exports.PhotoEditorContainerComponent = PhotoEditorContainerComponent;


/***/ },
/* 270 */
/***/ function(module, exports) {

	module.exports = "<div class=\"photo-editor-container\">\r\n\r\n</div>\r\n"

/***/ },
/* 271 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(272);
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
/* 272 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 273 */
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
/* 274 */
/***/ function(module, exports) {

	"use strict";


/***/ },
/* 275 */
/***/ function(module, exports) {

	"use strict";
	var Default = (function () {
	    function Default() {
	    }
	    return Default;
	}());
	exports.Default = Default;


/***/ },
/* 276 */
/***/ function(module, exports) {

	"use strict";
	exports.PhotosRoutes = [];


/***/ },
/* 277 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var core_1 = __webpack_require__(3);
	var product_editor_component_1 = __webpack_require__(278);
	var product_list_component_1 = __webpack_require__(282);
	var product_component_1 = __webpack_require__(286);
	var products_container_component_1 = __webpack_require__(290);
	var product_action_creator_1 = __webpack_require__(292);
	var product_service_1 = __webpack_require__(297);
	var reducers = __webpack_require__(298);
	var actions = __webpack_require__(291);
	var quinntynebrownProductsModule = angular.module("quinntynebrown.products", []);
	core_1.bootstrap(quinntynebrownProductsModule, {
	    components: [product_component_1.ProductComponent, product_editor_component_1.ProductEditorComponent, products_container_component_1.ProductsContainerComponent, product_list_component_1.ProductListComponent],
	    providers: [product_action_creator_1.ProductActionCreator, product_service_1.ProductService],
	    reducers: reducers,
	    actions: actions
	});
	__export(__webpack_require__(299));


/***/ },
/* 278 */
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
	var ProductEditorComponent = (function () {
	    function ProductEditorComponent() {
	    }
	    ProductEditorComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(279),
	            styles: [__webpack_require__(280)],
	            selector: "product-editor",
	            inputs: ['entity', 'addOrUpdate', 'remove', 'create'],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], ProductEditorComponent);
	    return ProductEditorComponent;
	}());
	exports.ProductEditorComponent = ProductEditorComponent;


/***/ },
/* 279 */
/***/ function(module, exports) {

	module.exports = "<div class=\"productEditor\">\r\n\r\n    <h1  data-ng-if=\"!vm.entity.id\">Create Product <span data-ng-if=\"vm.entity.name.length > 0\">: {{ vm.entity.name }}</span></h1>\r\n\r\n    <h1 data-ng-if=\"vm.entity.id\">Edit Product: {{ vm.entity.name }}</h1>\r\n\r\n    <tabs tabs-name=\"product-editor\">\r\n\r\n        <tab-title>General</tab-title>\r\n\r\n        <tab-content>\r\n            <div>\r\n                <input class=\"inputField\" type=\"text\" placeholder=\"Product Name\" data-ng-model=\"vm.entity.name\" />\r\n            </div>\r\n        </tab-content>\r\n\r\n    </tabs>\r\n\r\n    <div>\r\n        <calypso-button on-click=\"vm.addOrUpdate({ data: vm.entity })\" caption=\"Save\"></calypso-button>\r\n\r\n        <calypso-button on-click=\"vm.create()\" caption=\"Create\"></calypso-button>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 280 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(281);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./product-editor.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./product-editor.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 281 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 282 */
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
	var ProductListComponent = (function () {
	    function ProductListComponent() {
	    }
	    ProductListComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(283),
	            styles: [__webpack_require__(284)],
	            selector: "product-list",
	            inputs: ['entities', 'edit', 'remove'],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], ProductListComponent);
	    return ProductListComponent;
	}());
	exports.ProductListComponent = ProductListComponent;


/***/ },
/* 283 */
/***/ function(module, exports) {

	module.exports = "<div class=\"productList\">\r\n    <div class=\"productList-header\">\r\n        <h1>Products</h1>\r\n    </div>\r\n    \r\n    <div data-ng-repeat=\"entity in vm.entities\" class=\"productList-item\">\r\n        <div class=\"productList-name\">\r\n            {{ entity.name }}\r\n        </div>\r\n        <div class=\"productList-actions\">\r\n            <span data-ng-click=\"vm.edit({ entity: this.entity })\">edit</span>&nbsp;&nbsp;|&nbsp;&nbsp;<span data-ng-click=\"vm.remove({ entity: this.entity })\">remove</span>\r\n        </div>\r\n        <div style=\"clear:both;\"></div>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 284 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(285);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./product-list.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./product-list.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 285 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, ".productList-name,\n.productList-actions {\n  position: relative;\n  float: left; }\n\n.productList-name {\n  min-width: 200px; }\n\n.productList-item {\n  height: 50px; }\n\n.productList-actions span {\n  cursor: pointer; }\n\n.productList-actions {\n  text-transform: uppercase; }\n", ""]);

	// exports


/***/ },
/* 286 */
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
	var ProductComponent = (function () {
	    function ProductComponent() {
	    }
	    ProductComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(287),
	            styles: [__webpack_require__(288)],
	            selector: "product",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], ProductComponent);
	    return ProductComponent;
	}());
	exports.ProductComponent = ProductComponent;


/***/ },
/* 287 */
/***/ function(module, exports) {

	module.exports = "<div class=\"product\">\r\n\r\n</div>\r\n"

/***/ },
/* 288 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(289);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./product.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./product.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 289 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 290 */
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
	var actions = __webpack_require__(291);
	var product_action_creator_1 = __webpack_require__(292);
	var product_model_1 = __webpack_require__(293);
	var ProductsContainerComponent = (function () {
	    function ProductsContainerComponent($location, $routeParams, productActionCreator, _invokeAsync) {
	        var _this = this;
	        this.$location = $location;
	        this.$routeParams = $routeParams;
	        this.productActionCreator = productActionCreator;
	        this._invokeAsync = _invokeAsync;
	        this.storeOnChange = function (state) {
	            _this.entities = state.products;
	            if (state.lastTriggeredByAction instanceof actions.SetCurrentProductAction && !state.lastTriggeredByAction.entity)
	                _this.$location.path("/admin/products");
	            if (state.lastTriggeredByAction instanceof actions.SetCurrentProductAction && state.lastTriggeredByAction.entity)
	                _this.$location.path("/admin/product/edit/" + state.lastTriggeredByAction.entity.id);
	            if (state.lastTriggeredByAction instanceof actions.AddOrUpdateProductAction)
	                _this.entity = new product_model_1.Product();
	            if (state.lastTriggeredByAction instanceof actions.RemoveProductAction && _this.entity && _this.entity.id) {
	                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["productId"]), items: _this.entities });
	                if (Object.keys(_this.entity).length === 0) {
	                    _this.$location.path("/admin/products");
	                }
	            }
	        };
	        this.ngOnInit = function () {
	            if (_this.$routeParams["productId"]) {
	                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["productId"]), items: _this.entities });
	            }
	            else {
	                _this.entity = new product_model_1.Product();
	            }
	        };
	        this.edit = function (entity) { return _this.productActionCreator.edit(entity); };
	        this.remove = function (entity) { return _this.productActionCreator.remove(entity); };
	        this.create = function (entity) { return _this.productActionCreator.create(); };
	        this.addOrUpdate = function (options) {
	            _this._invokeAsync({
	                action: _this.productActionCreator.addOrUpdate,
	                params: { data: options.data }
	            }).then(function () {
	                if (_this.$location.path() === "/admin/products") {
	                    _this.entity = new product_model_1.Product();
	                }
	                else {
	                    _this.$location.path("/admin/products");
	                }
	            });
	        };
	    }
	    ProductsContainerComponent = __decorate([
	        core_1.Component({
	            routes: ["/admin/products", "/admin/product/edit/:productId"],
	            template: __webpack_require__(294),
	            styles: [__webpack_require__(295)],
	            selector: "products-container",
	            viewProviders: ["$location", "$routeParams", "productActionCreator", "invokeAsync"],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }),
	        core_1.CanActivate(["$q", "$route", "invokeAsync", "productActionCreator", function ($q, $route, invokeAsync, productActionCreator) {
	                var productId = $route.current.params.productId;
	                var promises = [invokeAsync(productActionCreator.all)];
	                if (productId) {
	                    promises.push(invokeAsync({ action: productActionCreator.getById, params: { id: productId } }));
	                }
	                ;
	                return $q.all(promises);
	            }]), 
	        __metadata('design:paramtypes', [Object, Object, product_action_creator_1.ProductActionCreator, Object])
	    ], ProductsContainerComponent);
	    return ProductsContainerComponent;
	}());
	exports.ProductsContainerComponent = ProductsContainerComponent;


/***/ },
/* 291 */
/***/ function(module, exports) {

	"use strict";
	var AddOrUpdateProductAction = (function () {
	    function AddOrUpdateProductAction(id, entity) {
	        this.id = id;
	        this.entity = entity;
	    }
	    return AddOrUpdateProductAction;
	}());
	exports.AddOrUpdateProductAction = AddOrUpdateProductAction;
	var AllProductsAction = (function () {
	    function AllProductsAction(id, entities) {
	        this.id = id;
	        this.entities = entities;
	    }
	    return AllProductsAction;
	}());
	exports.AllProductsAction = AllProductsAction;
	var RemoveProductAction = (function () {
	    function RemoveProductAction(id, entity) {
	        this.id = id;
	        this.entity = entity;
	    }
	    return RemoveProductAction;
	}());
	exports.RemoveProductAction = RemoveProductAction;
	var ProductsFilterAction = (function () {
	    function ProductsFilterAction(id, term) {
	        this.id = id;
	        this.term = term;
	    }
	    return ProductsFilterAction;
	}());
	exports.ProductsFilterAction = ProductsFilterAction;
	var SetCurrentProductAction = (function () {
	    function SetCurrentProductAction(entity) {
	        this.entity = entity;
	    }
	    return SetCurrentProductAction;
	}());
	exports.SetCurrentProductAction = SetCurrentProductAction;
	var AddOrUpdateProductSuccessAction = (function () {
	    function AddOrUpdateProductSuccessAction(entity) {
	        this.entity = entity;
	    }
	    return AddOrUpdateProductSuccessAction;
	}());
	exports.AddOrUpdateProductSuccessAction = AddOrUpdateProductSuccessAction;
	var CurrentProductRemovedAction = (function () {
	    function CurrentProductRemovedAction() {
	    }
	    return CurrentProductRemovedAction;
	}());
	exports.CurrentProductRemovedAction = CurrentProductRemovedAction;


/***/ },
/* 292 */
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
	var product_actions_1 = __webpack_require__(291);
	var ProductActionCreator = (function (_super) {
	    __extends(ProductActionCreator, _super);
	    function ProductActionCreator($location, dispatcher, productService, guid, invokeAsync, modalActionCreator) {
	        var _this = this;
	        _super.call(this, $location, productService, dispatcher, guid, product_actions_1.AddOrUpdateProductAction, product_actions_1.AllProductsAction, product_actions_1.RemoveProductAction, product_actions_1.SetCurrentProductAction);
	        this.invokeAsync = invokeAsync;
	        this.modalActionCreator = modalActionCreator;
	        this.addOrUpdateSuccess = function (options) { return _this.dispatcher.dispatch(new product_actions_1.AddOrUpdateProductSuccessAction(options.entity)); };
	        this.currentProductRemoved = function () { return _this.dispatcher.dispatch(new product_actions_1.CurrentProductRemovedAction()); };
	        this.openAllProductsModal = function () {
	            _this.invokeAsync(_this.all).then(function (results) {
	                _this.modalActionCreator.open({ html: "<all-product-modal></all-product-modal>" });
	            });
	        };
	    }
	    ProductActionCreator = __decorate([
	        core_1.Service({
	            serviceName: "productActionCreator",
	            viewProviders: ["$location", "dispatcher", "productService", "guid", "invokeAsync", "modalActionCreator"]
	        }), 
	        __metadata('design:paramtypes', [Object, Object, Object, Object, Object, modal_action_creator_1.ModalActionCreator])
	    ], ProductActionCreator);
	    return ProductActionCreator;
	}(core_1.BaseActionCreator));
	exports.ProductActionCreator = ProductActionCreator;


/***/ },
/* 293 */
/***/ function(module, exports) {

	"use strict";
	var Product = (function () {
	    function Product() {
	    }
	    return Product;
	}());
	exports.Product = Product;


/***/ },
/* 294 */
/***/ function(module, exports) {

	module.exports = "<div>\r\n    <product-editor entity=\"vm.entity\" edit=\"vm.edit\" remove=\"vm.remove\" add-or-update=\"vm.addOrUpdate\" create=\"vm.create\"></product-editor>\r\n    <product-list entities=\"vm.entities\" edit=\"vm.edit\" remove=\"vm.remove\"></product-list>\r\n</div>\r\n"

/***/ },
/* 295 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(296);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./products-container.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./products-container.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 296 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 297 */
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
	var ProductService = (function (_super) {
	    __extends(ProductService, _super);
	    function ProductService($q, apiEndpoint, fetch) {
	        _super.call(this, $q, apiEndpoint, fetch);
	    }
	    Object.defineProperty(ProductService.prototype, "baseUri", {
	        get: function () { return this.apiEndpoint.getBaseUrl() + "/product"; },
	        enumerable: true,
	        configurable: true
	    });
	    ProductService = __decorate([
	        core_1.Injectable(),
	        core_1.Service({
	            serviceName: "productService",
	            viewProviders: ["$q", "apiEndpoint", "fetch"]
	        }), 
	        __metadata('design:paramtypes', [Function, Object, Object])
	    ], ProductService);
	    return ProductService;
	}(core_1.BaseService));
	exports.ProductService = ProductService;


/***/ },
/* 298 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var actions = __webpack_require__(291);
	var core_1 = __webpack_require__(3);
	exports.removeProductReducer = function (state, action) {
	    if (action instanceof actions.RemoveProductAction)
	        core_1.pluckOut({ items: state.products, value: action.entity.id });
	    return state;
	};
	exports.addProductReducer = function (state, action) {
	    if (action instanceof actions.AddOrUpdateProductAction) {
	        core_1.addOrUpdate({ items: state.products, item: action.entity });
	    }
	    return state;
	};
	exports.allProductsReducer = function (state, action) {
	    if (action instanceof actions.AllProductsAction) {
	        state.products = action.entities;
	    }
	    return state;
	};
	exports.setCurrentProductReducer = function (state, action) {
	    if (action instanceof actions.SetCurrentProductAction) {
	        state.currentProductId = action.id;
	    }
	    return state;
	};


/***/ },
/* 299 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var products_container_component_1 = __webpack_require__(290);
	exports.ProductsRoutes = [
	    {
	        path: "/admin/products",
	        component: products_container_component_1.ProductsContainerComponent,
	        authorizationRequired: true
	    },
	    {
	        path: "/admin/product/edit/:productId",
	        component: products_container_component_1.ProductsContainerComponent,
	        authorizationRequired: true
	    }
	];


/***/ },
/* 300 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var core_1 = __webpack_require__(3);
	var quote_editor_component_1 = __webpack_require__(301);
	var quote_list_component_1 = __webpack_require__(305);
	var quote_component_1 = __webpack_require__(309);
	var quotes_container_component_1 = __webpack_require__(313);
	var quote_action_creator_1 = __webpack_require__(315);
	var quote_service_1 = __webpack_require__(320);
	var reducers = __webpack_require__(321);
	var actions = __webpack_require__(314);
	var appQuotesModule = angular.module("quinntynebrown.quotes", []);
	core_1.bootstrap(appQuotesModule, {
	    components: [quote_component_1.QuoteComponent, quote_editor_component_1.QuoteEditorComponent, quotes_container_component_1.QuotesContainerComponent, quote_list_component_1.QuoteListComponent],
	    providers: [quote_action_creator_1.QuoteActionCreator, quote_service_1.QuoteService],
	    reducers: reducers,
	    actions: actions
	});
	__export(__webpack_require__(322));


/***/ },
/* 301 */
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
	var QuoteEditorComponent = (function () {
	    function QuoteEditorComponent() {
	    }
	    QuoteEditorComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(302),
	            styles: [__webpack_require__(303)],
	            selector: "quote-editor",
	            inputs: ['entity', 'addOrUpdate', 'remove', 'create'],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], QuoteEditorComponent);
	    return QuoteEditorComponent;
	}());
	exports.QuoteEditorComponent = QuoteEditorComponent;


/***/ },
/* 302 */
/***/ function(module, exports) {

	module.exports = "<div class=\"quoteEditor\">\r\n\r\n    <h1  data-ng-if=\"!vm.entity.id\">Create Quote <span data-ng-if=\"vm.entity.name.length > 0\">: {{ vm.entity.name }}</span></h1>\r\n\r\n    <h1 data-ng-if=\"vm.entity.id\">Edit Quote: {{ vm.entity.name }}</h1>\r\n\r\n    <tabs tabs-name=\"quote-editor\">\r\n\r\n        <tab-title>General</tab-title>\r\n\r\n        <tab-content>\r\n            <div>\r\n                <input class=\"inputField\" type=\"text\" placeholder=\"Quote Name\" data-ng-model=\"vm.entity.name\" />\r\n            </div>\r\n        </tab-content>\r\n\r\n    </tabs>\r\n\r\n    <div>\r\n        <calypso-button on-click=\"vm.addOrUpdate({ data: vm.entity })\" caption=\"Save\"></calypso-button>\r\n\r\n        <calypso-button on-click=\"vm.create()\" caption=\"Create\"></calypso-button>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 303 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(304);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./quote-editor.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./quote-editor.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 304 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 305 */
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
	var QuoteListComponent = (function () {
	    function QuoteListComponent() {
	    }
	    QuoteListComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(306),
	            styles: [__webpack_require__(307)],
	            selector: "quote-list",
	            inputs: ['entities', 'edit', 'remove'],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], QuoteListComponent);
	    return QuoteListComponent;
	}());
	exports.QuoteListComponent = QuoteListComponent;


/***/ },
/* 306 */
/***/ function(module, exports) {

	module.exports = "<div class=\"quoteList\">\r\n    <div class=\"quoteList-header\">\r\n        <h1>Quotes</h1>\r\n    </div>\r\n    \r\n    <div data-ng-repeat=\"entity in vm.entities\" class=\"quoteList-item\">\r\n        <div class=\"quoteList-name\">\r\n            {{ entity.name }}\r\n        </div>\r\n        <div class=\"quoteList-actions\">\r\n            <span data-ng-click=\"vm.edit({ entity: this.entity })\">edit</span>&nbsp;&nbsp;|&nbsp;&nbsp;<span data-ng-click=\"vm.remove({ entity: this.entity })\">remove</span>\r\n        </div>\r\n        <div style=\"clear:both;\"></div>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 307 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(308);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./quote-list.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./quote-list.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 308 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, ".quoteList-name,\n.quoteList-actions {\n  position: relative;\n  float: left; }\n\n.quoteList-name {\n  min-width: 200px; }\n\n.quoteList-item {\n  height: 50px; }\n\n.quoteList-actions span {\n  cursor: pointer; }\n\n.quoteList-actions {\n  text-transform: uppercase; }\n", ""]);

	// exports


/***/ },
/* 309 */
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
	var QuoteComponent = (function () {
	    function QuoteComponent() {
	    }
	    QuoteComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(310),
	            styles: [__webpack_require__(311)],
	            selector: "quote",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], QuoteComponent);
	    return QuoteComponent;
	}());
	exports.QuoteComponent = QuoteComponent;


/***/ },
/* 310 */
/***/ function(module, exports) {

	module.exports = "<div class=\"quote\">\r\n\r\n</div>\r\n"

/***/ },
/* 311 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(312);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./quote.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./quote.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 312 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 313 */
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
	var actions = __webpack_require__(314);
	var quote_action_creator_1 = __webpack_require__(315);
	var quote_model_1 = __webpack_require__(316);
	var QuotesContainerComponent = (function () {
	    function QuotesContainerComponent($location, $routeParams, quoteActionCreator, _invokeAsync) {
	        var _this = this;
	        this.$location = $location;
	        this.$routeParams = $routeParams;
	        this.quoteActionCreator = quoteActionCreator;
	        this._invokeAsync = _invokeAsync;
	        this.storeOnChange = function (state) {
	            _this.entities = state.quotes;
	            if (state.lastTriggeredByAction instanceof actions.SetCurrentQuoteAction && !state.lastTriggeredByAction.entity)
	                _this.$location.path("/admin/quotes");
	            if (state.lastTriggeredByAction instanceof actions.SetCurrentQuoteAction && state.lastTriggeredByAction.entity)
	                _this.$location.path("/admin/quote/edit/" + state.lastTriggeredByAction.entity.id);
	            if (state.lastTriggeredByAction instanceof actions.AddOrUpdateQuoteAction)
	                _this.entity = new quote_model_1.Quote();
	            if (state.lastTriggeredByAction instanceof actions.RemoveQuoteAction && _this.entity && _this.entity.id) {
	                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["quoteId"]), items: _this.entities });
	                if (Object.keys(_this.entity).length === 0) {
	                    _this.$location.path("/admin/quotes");
	                }
	            }
	        };
	        this.ngOnInit = function () {
	            if (_this.$routeParams["quoteId"]) {
	                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["quoteId"]), items: _this.entities });
	            }
	            else {
	                _this.entity = new quote_model_1.Quote();
	            }
	        };
	        this.edit = function (entity) { return _this.quoteActionCreator.edit(entity); };
	        this.remove = function (entity) { return _this.quoteActionCreator.remove(entity); };
	        this.create = function (entity) { return _this.quoteActionCreator.create(); };
	        this.addOrUpdate = function (options) {
	            _this._invokeAsync({
	                action: _this.quoteActionCreator.addOrUpdate,
	                params: { data: options.data }
	            }).then(function () {
	                if (_this.$location.path() === "/admin/quotes") {
	                    _this.entity = new quote_model_1.Quote();
	                }
	                else {
	                    _this.$location.path("/admin/quotes");
	                }
	            });
	        };
	    }
	    QuotesContainerComponent = __decorate([
	        core_1.Component({
	            routes: ["/admin/quotes", "/admin/quote/edit/:quoteId"],
	            template: __webpack_require__(317),
	            styles: [__webpack_require__(318)],
	            selector: "quotes-container",
	            viewProviders: ["$location", "$routeParams", "quoteActionCreator", "invokeAsync"],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }),
	        core_1.CanActivate(["$q", "$route", "invokeAsync", "quoteActionCreator", function ($q, $route, invokeAsync, quoteActionCreator) {
	                var quoteId = $route.current.params.quoteId;
	                var promises = [invokeAsync(quoteActionCreator.all)];
	                if (quoteId) {
	                    promises.push(invokeAsync({ action: quoteActionCreator.getById, params: { id: quoteId } }));
	                }
	                ;
	                return $q.all(promises);
	            }]), 
	        __metadata('design:paramtypes', [Object, Object, quote_action_creator_1.QuoteActionCreator, Object])
	    ], QuotesContainerComponent);
	    return QuotesContainerComponent;
	}());
	exports.QuotesContainerComponent = QuotesContainerComponent;


/***/ },
/* 314 */
/***/ function(module, exports) {

	"use strict";
	var AddOrUpdateQuoteAction = (function () {
	    function AddOrUpdateQuoteAction(id, entity) {
	        this.id = id;
	        this.entity = entity;
	    }
	    return AddOrUpdateQuoteAction;
	}());
	exports.AddOrUpdateQuoteAction = AddOrUpdateQuoteAction;
	var AllQuotesAction = (function () {
	    function AllQuotesAction(id, entities) {
	        this.id = id;
	        this.entities = entities;
	    }
	    return AllQuotesAction;
	}());
	exports.AllQuotesAction = AllQuotesAction;
	var RemoveQuoteAction = (function () {
	    function RemoveQuoteAction(id, entity) {
	        this.id = id;
	        this.entity = entity;
	    }
	    return RemoveQuoteAction;
	}());
	exports.RemoveQuoteAction = RemoveQuoteAction;
	var QuotesFilterAction = (function () {
	    function QuotesFilterAction(id, term) {
	        this.id = id;
	        this.term = term;
	    }
	    return QuotesFilterAction;
	}());
	exports.QuotesFilterAction = QuotesFilterAction;
	var SetCurrentQuoteAction = (function () {
	    function SetCurrentQuoteAction(entity) {
	        this.entity = entity;
	    }
	    return SetCurrentQuoteAction;
	}());
	exports.SetCurrentQuoteAction = SetCurrentQuoteAction;
	var AddOrUpdateQuoteSuccessAction = (function () {
	    function AddOrUpdateQuoteSuccessAction(entity) {
	        this.entity = entity;
	    }
	    return AddOrUpdateQuoteSuccessAction;
	}());
	exports.AddOrUpdateQuoteSuccessAction = AddOrUpdateQuoteSuccessAction;
	var CurrentQuoteRemovedAction = (function () {
	    function CurrentQuoteRemovedAction() {
	    }
	    return CurrentQuoteRemovedAction;
	}());
	exports.CurrentQuoteRemovedAction = CurrentQuoteRemovedAction;


/***/ },
/* 315 */
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
	var quote_actions_1 = __webpack_require__(314);
	var QuoteActionCreator = (function (_super) {
	    __extends(QuoteActionCreator, _super);
	    function QuoteActionCreator($location, dispatcher, quoteService, guid, invokeAsync, modalActionCreator) {
	        var _this = this;
	        _super.call(this, $location, quoteService, dispatcher, guid, quote_actions_1.AddOrUpdateQuoteAction, quote_actions_1.AllQuotesAction, quote_actions_1.RemoveQuoteAction, quote_actions_1.SetCurrentQuoteAction);
	        this.invokeAsync = invokeAsync;
	        this.modalActionCreator = modalActionCreator;
	        this.addOrUpdateSuccess = function (options) { return _this.dispatcher.dispatch(new quote_actions_1.AddOrUpdateQuoteSuccessAction(options.entity)); };
	        this.currentQuoteRemoved = function () { return _this.dispatcher.dispatch(new quote_actions_1.CurrentQuoteRemovedAction()); };
	        this.openAllQuotesModal = function () {
	            _this.invokeAsync(_this.all).then(function (results) {
	                _this.modalActionCreator.open({ html: "<all-quote-modal></all-quote-modal>" });
	            });
	        };
	    }
	    QuoteActionCreator = __decorate([
	        core_1.Service({
	            serviceName: "quoteActionCreator",
	            viewProviders: ["$location", "dispatcher", "quoteService", "guid", "invokeAsync", "modalActionCreator"]
	        }), 
	        __metadata('design:paramtypes', [Object, Object, Object, Object, Object, modal_action_creator_1.ModalActionCreator])
	    ], QuoteActionCreator);
	    return QuoteActionCreator;
	}(core_1.BaseActionCreator));
	exports.QuoteActionCreator = QuoteActionCreator;


/***/ },
/* 316 */
/***/ function(module, exports) {

	"use strict";
	var Quote = (function () {
	    function Quote() {
	    }
	    return Quote;
	}());
	exports.Quote = Quote;


/***/ },
/* 317 */
/***/ function(module, exports) {

	module.exports = "<div>\r\n    <quote-editor entity=\"vm.entity\" edit=\"vm.edit\" remove=\"vm.remove\" add-or-update=\"vm.addOrUpdate\" create=\"vm.create\"></quote-editor>\r\n    <quote-list entities=\"vm.entities\" edit=\"vm.edit\" remove=\"vm.remove\"></quote-list>\r\n</div>\r\n"

/***/ },
/* 318 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(319);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./quotes-container.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./quotes-container.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 319 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 320 */
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
	var QuoteService = (function (_super) {
	    __extends(QuoteService, _super);
	    function QuoteService($q, apiEndpoint, fetch) {
	        _super.call(this, $q, apiEndpoint, fetch);
	    }
	    Object.defineProperty(QuoteService.prototype, "baseUri", {
	        get: function () { return this.apiEndpoint.getBaseUrl() + "/quote"; },
	        enumerable: true,
	        configurable: true
	    });
	    QuoteService = __decorate([
	        core_1.Injectable(),
	        core_1.Service({
	            serviceName: "quoteService",
	            viewProviders: ["$q", "apiEndpoint", "fetch"]
	        }), 
	        __metadata('design:paramtypes', [Function, Object, Object])
	    ], QuoteService);
	    return QuoteService;
	}(core_1.BaseService));
	exports.QuoteService = QuoteService;


/***/ },
/* 321 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var actions = __webpack_require__(314);
	var core_1 = __webpack_require__(3);
	exports.removeQuoteReducer = function (state, action) {
	    if (action instanceof actions.RemoveQuoteAction)
	        core_1.pluckOut({ items: state.quotes, value: action.entity.id });
	    return state;
	};
	exports.addQuoteReducer = function (state, action) {
	    if (action instanceof actions.AddOrUpdateQuoteAction) {
	        core_1.addOrUpdate({ items: state.quotes, item: action.entity });
	    }
	    return state;
	};
	exports.allQuotesReducer = function (state, action) {
	    if (action instanceof actions.AllQuotesAction) {
	        state.quotes = action.entities;
	    }
	    return state;
	};
	exports.setCurrentQuoteReducer = function (state, action) {
	    if (action instanceof actions.SetCurrentQuoteAction) {
	        state.currentQuoteId = action.id;
	    }
	    return state;
	};


/***/ },
/* 322 */
/***/ function(module, exports) {

	"use strict";
	exports.QuotesRoutes = [];


/***/ },
/* 323 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(324);
	var core_1 = __webpack_require__(3);
	var app_footer_component_1 = __webpack_require__(326);
	var app_header_component_1 = __webpack_require__(330);
	var admin_header_component_1 = __webpack_require__(334);
	var sharedModule = angular.module("quinntynebrown.shared", []);
	core_1.bootstrap(sharedModule, {
	    components: [app_footer_component_1.AppFooterComponent, app_header_component_1.AppHeaderComponent, admin_header_component_1.AdminHeaderComponent],
	});


/***/ },
/* 324 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(325);
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
/* 325 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, ".admin-content-container:after {\n  content: \" \";\n  display: block; }\n\n.admin-side-nav {\n  position: relative;\n  float: left;\n  width: 200px; }\n\n.admin-main-content {\n  position: relative;\n  float: left; }\n\n.admin-app {\n  padding-left: 10px;\n  padding-right: 10px; }\n\n.admin-side-nav ul {\n  list-style-type: none; }\n\n.admin-side-nav a {\n  cursor: pointer;\n  text-decoration: none;\n  color: #272727;\n  line-height: 1.5em; }\n", ""]);

	// exports


/***/ },
/* 326 */
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
	            template: __webpack_require__(327),
	            styles: [__webpack_require__(328)],
	            selector: "app-footer",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], AppFooterComponent);
	    return AppFooterComponent;
	}());
	exports.AppFooterComponent = AppFooterComponent;


/***/ },
/* 327 */
/***/ function(module, exports) {

	module.exports = "<div class=\"app-footer\">\r\n\r\n</div>\r\n"

/***/ },
/* 328 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(329);
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
/* 329 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 330 */
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
	            template: __webpack_require__(331),
	            styles: [__webpack_require__(332)],
	            selector: "app-header",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], AppHeaderComponent);
	    return AppHeaderComponent;
	}());
	exports.AppHeaderComponent = AppHeaderComponent;


/***/ },
/* 331 */
/***/ function(module, exports) {

	module.exports = "<div class=\"app-header\">\r\n    <div class=\"app-header-inner\">\r\n        <h1>\r\n            {{ ::vm.title }}\r\n        </h1>\r\n        <div class=\"app-header-sub-nav\">\r\n            <a href=\"/\">Home</a>\r\n            &nbsp;&nbsp;|&nbsp;&nbsp;\r\n            <a>Blog</a>\r\n            &nbsp;&nbsp;|&nbsp;&nbsp;\r\n            <a>About</a>\r\n            &nbsp;&nbsp;|&nbsp;&nbsp;\r\n            <a href=\"/contact\">Contact</a>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 332 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(333);
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
/* 333 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, ".app-header {\n  width: 100%;\n  font-family: Lato;\n  color: #272727; }\n  .app-header a {\n    text-decoration: none;\n    color: #272727; }\n\n.app-header-inner {\n  max-width: 1280px;\n  margin: 0 auto;\n  text-align: center;\n  letter-spacing: -0.5px; }\n\n.app-header-sub-nav {\n  text-transform: uppercase;\n  font-family: Roboto;\n  font-weight: 100;\n  cursor: pointer; }\n", ""]);

	// exports


/***/ },
/* 334 */
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
	    function AdminHeaderComponent($location) {
	        var _this = this;
	        this.$location = $location;
	        this.onTitleClick = function () { return _this.$location.path("/"); };
	    }
	    AdminHeaderComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(335),
	            styles: [__webpack_require__(336)],
	            selector: "admin-header",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
	            viewProviders: ["$location"]
	        }), 
	        __metadata('design:paramtypes', [Object])
	    ], AdminHeaderComponent);
	    return AdminHeaderComponent;
	}());
	exports.AdminHeaderComponent = AdminHeaderComponent;


/***/ },
/* 335 */
/***/ function(module, exports) {

	module.exports = "<div class=\"admin-header\">\r\n    <div class=\"admin-header-inner\">\r\n        <h1 class=\"admin-header-title\" data-ng-click=\"vm.onTitleClick()\">\r\n            Admin\r\n        </h1>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 336 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(337);
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
/* 337 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, ".admin-header-title {\n  cursor: pointer; }\n", ""]);

	// exports


/***/ },
/* 338 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var core_1 = __webpack_require__(3);
	var social_share_item_editor_component_1 = __webpack_require__(339);
	var social_share_item_list_component_1 = __webpack_require__(343);
	var social_share_item_component_1 = __webpack_require__(347);
	var social_share_items_container_component_1 = __webpack_require__(351);
	var social_share_item_action_creator_1 = __webpack_require__(353);
	var social_share_item_service_1 = __webpack_require__(358);
	var reducers = __webpack_require__(359);
	var actions = __webpack_require__(352);
	var appSocialShareItemsModule = angular.module("quinntynebrown.socialShareItems", []);
	core_1.bootstrap(appSocialShareItemsModule, {
	    components: [social_share_item_component_1.SocialShareItemComponent, social_share_item_editor_component_1.SocialShareItemEditorComponent, social_share_items_container_component_1.SocialShareItemsContainerComponent, social_share_item_list_component_1.SocialShareItemListComponent],
	    providers: [social_share_item_action_creator_1.SocialShareItemActionCreator, social_share_item_service_1.SocialShareItemService],
	    reducers: reducers,
	    actions: actions
	});
	__export(__webpack_require__(360));


/***/ },
/* 339 */
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
	var SocialShareItemEditorComponent = (function () {
	    function SocialShareItemEditorComponent() {
	    }
	    SocialShareItemEditorComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(340),
	            styles: [__webpack_require__(341)],
	            selector: "social-share-item-editor",
	            inputs: ['entity', 'addOrUpdate', 'remove', 'create'],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], SocialShareItemEditorComponent);
	    return SocialShareItemEditorComponent;
	}());
	exports.SocialShareItemEditorComponent = SocialShareItemEditorComponent;


/***/ },
/* 340 */
/***/ function(module, exports) {

	module.exports = "<div class=\"socialShareItemEditor\">\r\n\r\n    <h1  data-ng-if=\"!vm.entity.id\">Create Social Share Item <span data-ng-if=\"vm.entity.name.length > 0\">: {{ vm.entity.name }}</span></h1>\r\n\r\n    <h1 data-ng-if=\"vm.entity.id\">Edit Social Share Item: {{ vm.entity.name }}</h1>\r\n\r\n    <tabs tabs-name=\"social-share-item-editor\">\r\n\r\n        <tab-title>General</tab-title>\r\n\r\n        <tab-content>\r\n            <div>\r\n                <input class=\"inputField\" type=\"text\" placeholder=\"Social Share Item Name\" data-ng-model=\"vm.entity.name\" />\r\n            </div>\r\n        </tab-content>\r\n\r\n    </tabs>\r\n\r\n    <div>\r\n        <calypso-button on-click=\"vm.addOrUpdate({ data: vm.entity })\" caption=\"Save\"></calypso-button>\r\n\r\n        <calypso-button on-click=\"vm.create()\" caption=\"Create\"></calypso-button>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 341 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(342);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./social-share-item-editor.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./social-share-item-editor.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 342 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 343 */
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
	var SocialShareItemListComponent = (function () {
	    function SocialShareItemListComponent() {
	    }
	    SocialShareItemListComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(344),
	            styles: [__webpack_require__(345)],
	            selector: "social-share-item-list",
	            inputs: ['entities', 'edit', 'remove'],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], SocialShareItemListComponent);
	    return SocialShareItemListComponent;
	}());
	exports.SocialShareItemListComponent = SocialShareItemListComponent;


/***/ },
/* 344 */
/***/ function(module, exports) {

	module.exports = "<div class=\"socialShareItemList\">\r\n    <div class=\"socialShareItemList-header\">\r\n        <h1>SocialShareItems</h1>\r\n    </div>\r\n    \r\n    <div data-ng-repeat=\"entity in vm.entities\" class=\"socialShareItemList-item\">\r\n        <div class=\"socialShareItemList-name\">\r\n            {{ entity.name }}\r\n        </div>\r\n        <div class=\"socialShareItemList-actions\">\r\n            <span data-ng-click=\"vm.edit({ entity: this.entity })\">edit</span>&nbsp;&nbsp;|&nbsp;&nbsp;<span data-ng-click=\"vm.remove({ entity: this.entity })\">remove</span>\r\n        </div>\r\n        <div style=\"clear:both;\"></div>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 345 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(346);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./social-share-item-list.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./social-share-item-list.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 346 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, ".socialShareItemList-name,\n.socialShareItemList-actions {\n  position: relative;\n  float: left; }\n\n.socialShareItemList-name {\n  min-width: 200px; }\n\n.socialShareItemList-item {\n  height: 50px; }\n\n.socialShareItemList-actions span {\n  cursor: pointer; }\n\n.socialShareItemList-actions {\n  text-transform: uppercase; }\n", ""]);

	// exports


/***/ },
/* 347 */
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
	var SocialShareItemComponent = (function () {
	    function SocialShareItemComponent() {
	    }
	    SocialShareItemComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(348),
	            styles: [__webpack_require__(349)],
	            selector: "social-share-item",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], SocialShareItemComponent);
	    return SocialShareItemComponent;
	}());
	exports.SocialShareItemComponent = SocialShareItemComponent;


/***/ },
/* 348 */
/***/ function(module, exports) {

	module.exports = "<div class=\"social-share-item\">\r\n\r\n</div>\r\n"

/***/ },
/* 349 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(350);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./social-share-item.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./social-share-item.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 350 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 351 */
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
	var actions = __webpack_require__(352);
	var social_share_item_action_creator_1 = __webpack_require__(353);
	var social_share_item_model_1 = __webpack_require__(354);
	var SocialShareItemsContainerComponent = (function () {
	    function SocialShareItemsContainerComponent($location, $routeParams, socialShareItemActionCreator, _invokeAsync) {
	        var _this = this;
	        this.$location = $location;
	        this.$routeParams = $routeParams;
	        this.socialShareItemActionCreator = socialShareItemActionCreator;
	        this._invokeAsync = _invokeAsync;
	        this.storeOnChange = function (state) {
	            _this.entities = state.socialShareItems;
	            if (state.lastTriggeredByAction instanceof actions.SetCurrentSocialShareItemAction && !state.lastTriggeredByAction.entity)
	                _this.$location.path("/admin/socialshareitems");
	            if (state.lastTriggeredByAction instanceof actions.SetCurrentSocialShareItemAction && state.lastTriggeredByAction.entity)
	                _this.$location.path("/admin/socialshareitem/edit/" + state.lastTriggeredByAction.entity.id);
	            if (state.lastTriggeredByAction instanceof actions.AddOrUpdateSocialShareItemAction)
	                _this.entity = new social_share_item_model_1.SocialShareItem();
	            if (state.lastTriggeredByAction instanceof actions.RemoveSocialShareItemAction && _this.entity && _this.entity.id) {
	                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["socialShareItemId"]), items: _this.entities });
	                if (Object.keys(_this.entity).length === 0) {
	                    _this.$location.path("/admin/socialshareitems");
	                }
	            }
	        };
	        this.ngOnInit = function () {
	            if (_this.$routeParams["socialShareItemId"]) {
	                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["socialShareItemId"]), items: _this.entities });
	            }
	            else {
	                _this.entity = new social_share_item_model_1.SocialShareItem();
	            }
	        };
	        this.edit = function (entity) { return _this.socialShareItemActionCreator.edit(entity); };
	        this.remove = function (entity) { return _this.socialShareItemActionCreator.remove(entity); };
	        this.create = function (entity) { return _this.socialShareItemActionCreator.create(); };
	        this.addOrUpdate = function (options) {
	            _this._invokeAsync({
	                action: _this.socialShareItemActionCreator.addOrUpdate,
	                params: { data: options.data }
	            }).then(function () {
	                if (_this.$location.path() === "/admin/socialshareitems") {
	                    _this.entity = new social_share_item_model_1.SocialShareItem();
	                }
	                else {
	                    _this.$location.path("/admin/socialshareitems");
	                }
	            });
	        };
	    }
	    SocialShareItemsContainerComponent = __decorate([
	        core_1.Component({
	            routes: ["/admin/socialshareitems", "/admin/socialshareitem/edit/:socialShareItemId"],
	            template: __webpack_require__(355),
	            styles: [__webpack_require__(356)],
	            selector: "social-share-items-container",
	            viewProviders: ["$location", "$routeParams", "socialShareItemActionCreator", "invokeAsync"],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }),
	        core_1.CanActivate(["$q", "$route", "invokeAsync", "socialShareItemActionCreator", function ($q, $route, invokeAsync, socialShareItemActionCreator) {
	                var socialShareItemId = $route.current.params.socialShareItemId;
	                var promises = [invokeAsync(socialShareItemActionCreator.all)];
	                if (socialShareItemId) {
	                    promises.push(invokeAsync({ action: socialShareItemActionCreator.getById, params: { id: socialShareItemId } }));
	                }
	                ;
	                return $q.all(promises);
	            }]), 
	        __metadata('design:paramtypes', [Object, Object, social_share_item_action_creator_1.SocialShareItemActionCreator, Object])
	    ], SocialShareItemsContainerComponent);
	    return SocialShareItemsContainerComponent;
	}());
	exports.SocialShareItemsContainerComponent = SocialShareItemsContainerComponent;


/***/ },
/* 352 */
/***/ function(module, exports) {

	"use strict";
	var AddOrUpdateSocialShareItemAction = (function () {
	    function AddOrUpdateSocialShareItemAction(id, entity) {
	        this.id = id;
	        this.entity = entity;
	    }
	    return AddOrUpdateSocialShareItemAction;
	}());
	exports.AddOrUpdateSocialShareItemAction = AddOrUpdateSocialShareItemAction;
	var AllSocialShareItemsAction = (function () {
	    function AllSocialShareItemsAction(id, entities) {
	        this.id = id;
	        this.entities = entities;
	    }
	    return AllSocialShareItemsAction;
	}());
	exports.AllSocialShareItemsAction = AllSocialShareItemsAction;
	var RemoveSocialShareItemAction = (function () {
	    function RemoveSocialShareItemAction(id, entity) {
	        this.id = id;
	        this.entity = entity;
	    }
	    return RemoveSocialShareItemAction;
	}());
	exports.RemoveSocialShareItemAction = RemoveSocialShareItemAction;
	var SocialShareItemsFilterAction = (function () {
	    function SocialShareItemsFilterAction(id, term) {
	        this.id = id;
	        this.term = term;
	    }
	    return SocialShareItemsFilterAction;
	}());
	exports.SocialShareItemsFilterAction = SocialShareItemsFilterAction;
	var SetCurrentSocialShareItemAction = (function () {
	    function SetCurrentSocialShareItemAction(entity) {
	        this.entity = entity;
	    }
	    return SetCurrentSocialShareItemAction;
	}());
	exports.SetCurrentSocialShareItemAction = SetCurrentSocialShareItemAction;
	var AddOrUpdateSocialShareItemSuccessAction = (function () {
	    function AddOrUpdateSocialShareItemSuccessAction(entity) {
	        this.entity = entity;
	    }
	    return AddOrUpdateSocialShareItemSuccessAction;
	}());
	exports.AddOrUpdateSocialShareItemSuccessAction = AddOrUpdateSocialShareItemSuccessAction;
	var CurrentSocialShareItemRemovedAction = (function () {
	    function CurrentSocialShareItemRemovedAction() {
	    }
	    return CurrentSocialShareItemRemovedAction;
	}());
	exports.CurrentSocialShareItemRemovedAction = CurrentSocialShareItemRemovedAction;


/***/ },
/* 353 */
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
	var social_share_item_actions_1 = __webpack_require__(352);
	var SocialShareItemActionCreator = (function (_super) {
	    __extends(SocialShareItemActionCreator, _super);
	    function SocialShareItemActionCreator($location, dispatcher, socialShareItemService, guid, invokeAsync, modalActionCreator) {
	        var _this = this;
	        _super.call(this, $location, socialShareItemService, dispatcher, guid, social_share_item_actions_1.AddOrUpdateSocialShareItemAction, social_share_item_actions_1.AllSocialShareItemsAction, social_share_item_actions_1.RemoveSocialShareItemAction, social_share_item_actions_1.SetCurrentSocialShareItemAction);
	        this.invokeAsync = invokeAsync;
	        this.modalActionCreator = modalActionCreator;
	        this.addOrUpdateSuccess = function (options) { return _this.dispatcher.dispatch(new social_share_item_actions_1.AddOrUpdateSocialShareItemSuccessAction(options.entity)); };
	        this.currentSocialShareItemRemoved = function () { return _this.dispatcher.dispatch(new social_share_item_actions_1.CurrentSocialShareItemRemovedAction()); };
	        this.openAllSocialShareItemsModal = function () {
	            _this.invokeAsync(_this.all).then(function (results) {
	                _this.modalActionCreator.open({ html: "<all-social-share-item-modal></all-social-share-item-modal>" });
	            });
	        };
	    }
	    SocialShareItemActionCreator = __decorate([
	        core_1.Service({
	            serviceName: "socialShareItemActionCreator",
	            viewProviders: ["$location", "dispatcher", "socialShareItemService", "guid", "invokeAsync", "modalActionCreator"]
	        }), 
	        __metadata('design:paramtypes', [Object, Object, Object, Object, Object, modal_action_creator_1.ModalActionCreator])
	    ], SocialShareItemActionCreator);
	    return SocialShareItemActionCreator;
	}(core_1.BaseActionCreator));
	exports.SocialShareItemActionCreator = SocialShareItemActionCreator;


/***/ },
/* 354 */
/***/ function(module, exports) {

	"use strict";
	var SocialShareItem = (function () {
	    function SocialShareItem() {
	    }
	    return SocialShareItem;
	}());
	exports.SocialShareItem = SocialShareItem;


/***/ },
/* 355 */
/***/ function(module, exports) {

	module.exports = "<div>\r\n    <social-share-item-editor entity=\"vm.entity\" edit=\"vm.edit\" remove=\"vm.remove\" add-or-update=\"vm.addOrUpdate\" create=\"vm.create\"></social-share-item-editor>\r\n    <social-share-item-list entities=\"vm.entities\" edit=\"vm.edit\" remove=\"vm.remove\"></social-share-item-list>\r\n</div>\r\n"

/***/ },
/* 356 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(357);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./social-share-items-container.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./social-share-items-container.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 357 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 358 */
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
	var SocialShareItemService = (function (_super) {
	    __extends(SocialShareItemService, _super);
	    function SocialShareItemService($q, apiEndpoint, fetch) {
	        _super.call(this, $q, apiEndpoint, fetch);
	    }
	    Object.defineProperty(SocialShareItemService.prototype, "baseUri", {
	        get: function () { return this.apiEndpoint.getBaseUrl() + "/v1/socialShareItem"; },
	        enumerable: true,
	        configurable: true
	    });
	    SocialShareItemService = __decorate([
	        core_1.Injectable(),
	        core_1.Service({
	            serviceName: "socialShareItemService",
	            viewProviders: ["$q", "apiEndpoint", "fetch"]
	        }), 
	        __metadata('design:paramtypes', [Function, Object, Object])
	    ], SocialShareItemService);
	    return SocialShareItemService;
	}(core_1.BaseService));
	exports.SocialShareItemService = SocialShareItemService;


/***/ },
/* 359 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var actions = __webpack_require__(352);
	var core_1 = __webpack_require__(3);
	exports.removeSocialShareItemReducer = function (state, action) {
	    if (action instanceof actions.RemoveSocialShareItemAction)
	        core_1.pluckOut({ items: state.socialShareItems, value: action.entity.id });
	    return state;
	};
	exports.addSocialShareItemReducer = function (state, action) {
	    if (action instanceof actions.AddOrUpdateSocialShareItemAction) {
	        core_1.addOrUpdate({ items: state.socialShareItems, item: action.entity });
	    }
	    return state;
	};
	exports.allSocialShareItemsReducer = function (state, action) {
	    if (action instanceof actions.AllSocialShareItemsAction) {
	        state.socialShareItems = action.entities;
	    }
	    return state;
	};
	exports.setCurrentSocialShareItemReducer = function (state, action) {
	    if (action instanceof actions.SetCurrentSocialShareItemAction) {
	        state.currentSocialShareItemId = action.id;
	    }
	    return state;
	};


/***/ },
/* 360 */
/***/ function(module, exports) {

	"use strict";
	exports.SocialShareItemsRoutes = [];


/***/ },
/* 361 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var core_1 = __webpack_require__(3);
	var biography_page_container_component_1 = __webpack_require__(362);
	var bioModule = angular.module("quinntynebrown.biographyPage", []);
	core_1.bootstrap(bioModule, {
	    components: [biography_page_container_component_1.BiographyPageContainerComponent]
	});
	__export(__webpack_require__(366));


/***/ },
/* 362 */
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
	var BiographyPageContainerComponent = (function () {
	    function BiographyPageContainerComponent() {
	    }
	    BiographyPageContainerComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(363),
	            styles: [__webpack_require__(364)],
	            selector: "biography-page-container",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], BiographyPageContainerComponent);
	    return BiographyPageContainerComponent;
	}());
	exports.BiographyPageContainerComponent = BiographyPageContainerComponent;


/***/ },
/* 363 */
/***/ function(module, exports) {

	module.exports = "<div class=\"biography-page-container\">\r\n</div>\r\n"

/***/ },
/* 364 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(365);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./biography-page-container.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./biography-page-container.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 365 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 366 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var biography_page_container_component_1 = __webpack_require__(362);
	exports.BiographyPageRoutes = [
	    {
	        path: "/about",
	        component: biography_page_container_component_1.BiographyPageContainerComponent
	    }
	];


/***/ },
/* 367 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var core_1 = __webpack_require__(3);
	var thank_you_page_container_component_1 = __webpack_require__(368);
	var bioModule = angular.module("quinntynebrown.thankYouPage", []);
	core_1.bootstrap(bioModule, {
	    components: [thank_you_page_container_component_1.ThankYouPageContainerComponent]
	});
	__export(__webpack_require__(372));


/***/ },
/* 368 */
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
	var ThankYouPageContainerComponent = (function () {
	    function ThankYouPageContainerComponent() {
	    }
	    ThankYouPageContainerComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(369),
	            styles: [__webpack_require__(370)],
	            selector: "thank-you-page-container",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], ThankYouPageContainerComponent);
	    return ThankYouPageContainerComponent;
	}());
	exports.ThankYouPageContainerComponent = ThankYouPageContainerComponent;


/***/ },
/* 369 */
/***/ function(module, exports) {

	module.exports = "<div class=\"thank-you-page-container\">\r\n    \r\n</div>\r\n"

/***/ },
/* 370 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(371);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./thank-you-page-container.component.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./thank-you-page-container.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 371 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 372 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var thank_you_page_container_component_1 = __webpack_require__(368);
	exports.ThankYouPageRoutes = [
	    {
	        path: "/thankyou",
	        component: thank_you_page_container_component_1.ThankYouPageContainerComponent
	    }
	];


/***/ },
/* 373 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var core_1 = __webpack_require__(3);
	var photographer_component_1 = __webpack_require__(374);
	var photographer_action_creator_1 = __webpack_require__(378);
	var reducers = __webpack_require__(379);
	var actions = __webpack_require__(380);
	var photographersModule = angular.module("quinntynebrown.photographers", []);
	core_1.bootstrap(photographersModule, {
	    components: [photographer_component_1.PhotographerComponent],
	    providers: [photographer_action_creator_1.PhotographerActionCreator],
	    reducers: reducers,
	    actions: actions
	});
	__export(__webpack_require__(381));


/***/ },
/* 374 */
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
	            template: __webpack_require__(375),
	            styles: [__webpack_require__(376)],
	            selector: "photographer",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], PhotographerComponent);
	    return PhotographerComponent;
	}());
	exports.PhotographerComponent = PhotographerComponent;


/***/ },
/* 375 */
/***/ function(module, exports) {

	module.exports = "<div class=\"photographer\">\r\n\r\n</div>\r\n"

/***/ },
/* 376 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(377);
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
/* 377 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 378 */
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
/* 379 */
/***/ function(module, exports) {

	"use strict";


/***/ },
/* 380 */
/***/ function(module, exports) {

	"use strict";
	var Default = (function () {
	    function Default() {
	    }
	    return Default;
	}());
	exports.Default = Default;


/***/ },
/* 381 */
/***/ function(module, exports) {

	"use strict";
	exports.PhotographersRoutes = [];


/***/ },
/* 382 */
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
/* 383 */
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


/***/ },
/* 384 */
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
	var AppComponent = (function () {
	    function AppComponent() {
	    }
	    AppComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(385),
	            styles: [__webpack_require__(386)],
	            selector: "root-app",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], AppComponent);
	    return AppComponent;
	}());
	exports.AppComponent = AppComponent;


/***/ },
/* 385 */
/***/ function(module, exports) {

	module.exports = "<div class=\"app\">\r\n    <app-header></app-header>\r\n    <div data-ng-view></div>\r\n    <app-footer></app-footer>\r\n</div>"

/***/ },
/* 386 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(387);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./app.component.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./app.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 387 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ },
/* 388 */
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
	var AdminAppComponent = (function () {
	    function AdminAppComponent() {
	        var _this = this;
	        this.storeOnChange = function (state) { return _this.currentUser = state.currentUser; };
	    }
	    AdminAppComponent = __decorate([
	        core_1.Component({
	            template: __webpack_require__(389),
	            styles: [__webpack_require__(390)],
	            selector: "admin-app",
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], AdminAppComponent);
	    return AdminAppComponent;
	}());
	exports.AdminAppComponent = AdminAppComponent;


/***/ },
/* 389 */
/***/ function(module, exports) {

	module.exports = "<div class=\"admin-app\">\r\n    <admin-header></admin-header>\r\n    <div class=\"admin-content-container\">\r\n        <div class=\"admin-side-nav\" data-ng-if=\"vm.currentUser\">\r\n            <ul>\r\n                <li><a href=\"/admin/articles\">Articles</a></li>\r\n                <li><a href=\"/admin/contacts\">Contacts</a></li>\r\n                <li><a href=\"/admin\">Galleries</a></li>\r\n                <li><a href=\"/admin/orders\">Orders</a></li>\r\n                <li><a href=\"/admin/photos\">Photos</a></li>\r\n                <li><a href=\"/admin/products\">Products</a></li>\r\n                <li><a href=\"/admin/apps\">Apps</a></li>\r\n                <li><a href=\"/admin/uis\">UIs</a></li>\r\n                <li><a href=\"/admin/sections\">Sections</a></li>\r\n                <li><a href=\"/admin/properties\">Properties</a></li>\r\n            </ul>\r\n        </div>\r\n        <div class=\"admin-main-content\" data-ng-view></div>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 390 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(391);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(60)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./admin-app.component.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./admin-app.component.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 391 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(59)();
	// imports


	// module
	exports.push([module.id, "", ""]);

	// exports


/***/ }
/******/ ]);