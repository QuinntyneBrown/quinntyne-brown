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
var core_1 = require("angular-rx-ui/src/components/core");
var actions = require("../actions/app.actions");
var property_actions_1 = require("../actions/property.actions");
var app_action_creator_1 = require("../action-creators/app.action-creator");
var app_model_1 = require("../models/app.model");
var property_action_creator_1 = require("../action-creators/property.action-creator");
var AppsContainerComponent = (function () {
    function AppsContainerComponent($location, $routeParams, appActionCreator, _invokeAsync, propertyActionCreator) {
        var _this = this;
        this.$location = $location;
        this.$routeParams = $routeParams;
        this.appActionCreator = appActionCreator;
        this._invokeAsync = _invokeAsync;
        this.propertyActionCreator = propertyActionCreator;
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
            if (state.lastTriggeredByAction instanceof property_actions_1.PropertyPickedAction && _this.entity && _this.entity.id) {
                _this.entity.properties.push(state.lastTriggeredByAction.entity);
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
        this.addOrUpdateProperty = function () { return _this.propertyActionCreator.openPropertyPickerModal(); };
        this.addOrUpdateUI = function () { return alert("add or update ui"); };
    }
    AppsContainerComponent = __decorate([
        core_1.Component({
            routes: ["/admin/apps", "/admin/app/edit/:appId"],
            template: require("./apps-container.component.html"),
            styles: [require("./apps-container.component.scss")],
            selector: "apps-container",
            viewProviders: ["$location", "$routeParams", "appActionCreator", "invokeAsync", "propertyActionCreator"],
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
        __metadata('design:paramtypes', [Object, Object, app_action_creator_1.AppActionCreator, Object, property_action_creator_1.PropertyActionCreator])
    ], AppsContainerComponent);
    return AppsContainerComponent;
}());
exports.AppsContainerComponent = AppsContainerComponent;
