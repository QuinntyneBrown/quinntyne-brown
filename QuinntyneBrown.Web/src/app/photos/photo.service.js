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
var core_1 = require("angular-rx-ui/src/components/core");
var PhotoService = (function (_super) {
    __extends(PhotoService, _super);
    function PhotoService($q, apiEndpoint, fetch, store) {
        var _this = this;
        _super.call(this, $q, apiEndpoint, fetch);
        this.store = store;
        this.tryToUpload = function (options) {
            var deferred = _this.$q.defer();
            var xhr = new XMLHttpRequest();
            var token = _this.store.getValue().token;
            xhr.open("POST", _this.baseUri + "/upload", true);
            xhr.setRequestHeader('Authorization', "Bearer " + token);
            xhr.onload = function (e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        deferred.resolve(JSON.parse(xhr.response));
                    }
                    else {
                        deferred.resolve(xhr.statusText);
                    }
                }
            };
            xhr.send(options.data);
            return deferred.promise;
        };
        this.search = function (options) {
            var deferred = _this.$q.defer();
            _this.fetch.fromService({ method: "GET", url: _this.baseUri + "/search", params: options.params })
                .then(function (results) { return deferred.resolve(results.data); });
            return deferred.promise;
        };
    }
    Object.defineProperty(PhotoService.prototype, "baseUri", {
        get: function () { return this.apiEndpoint.getBaseUrl() + "/photo"; },
        enumerable: true,
        configurable: true
    });
    PhotoService = __decorate([
        core_1.Injectable(),
        core_1.Service({
            serviceName: "photoService",
            viewProviders: ["$q", "apiEndpoint", "fetch", "store"]
        }), 
        __metadata('design:paramtypes', [Function, Object, Object, core_1.Store])
    ], PhotoService);
    return PhotoService;
}(core_1.BaseService));
exports.PhotoService = PhotoService;
