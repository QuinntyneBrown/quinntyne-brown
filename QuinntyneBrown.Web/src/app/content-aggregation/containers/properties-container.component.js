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
var actions = require("../actions/property.actions");
var property_action_creator_1 = require("../action-creators/property.action-creator");
var pluck_1 = require("angular-rx-ui/src/components/core/pluck");
var property_model_1 = require("../models/property.model");
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
            template: require("./properties-container.component.html"),
            styles: [require("./properties-container.component.scss")],
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
