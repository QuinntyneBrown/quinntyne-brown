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
var actions = require("../actions/ui.actions");
var ui_action_creator_1 = require("../action-creators/ui.action-creator");
var ui_model_1 = require("../models/ui.model");
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
            template: require("./uis-container.component.html"),
            styles: [require("./uis-container.component.scss")],
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
