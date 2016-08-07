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
var actions = require("./menu.actions");
var menu_action_creator_1 = require("./menu.action-creator");
var menu_model_1 = require("./menu.model");
var MenusContainerComponent = (function () {
    function MenusContainerComponent($location, $routeParams, menuActionCreator, _invokeAsync) {
        var _this = this;
        this.$location = $location;
        this.$routeParams = $routeParams;
        this.menuActionCreator = menuActionCreator;
        this._invokeAsync = _invokeAsync;
        this.storeOnChange = function (state) {
            _this.entities = state.menus;
            if (state.lastTriggeredByAction instanceof actions.SetCurrentMenuAction && !state.lastTriggeredByAction.entity)
                _this.$location.path("/admin/menus");
            if (state.lastTriggeredByAction instanceof actions.SetCurrentMenuAction && state.lastTriggeredByAction.entity)
                _this.$location.path("/admin/menu/edit/" + state.lastTriggeredByAction.entity.id);
            if (state.lastTriggeredByAction instanceof actions.AddOrUpdateMenuAction)
                _this.entity = new menu_model_1.Menu();
            if (state.lastTriggeredByAction instanceof actions.RemoveMenuAction && _this.entity && _this.entity.id) {
                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["menuId"]), items: _this.entities });
                if (Object.keys(_this.entity).length === 0) {
                    _this.$location.path("/admin/menus");
                }
            }
        };
        this.ngOnInit = function () {
            if (_this.$routeParams["menuId"]) {
                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["menuId"]), items: _this.entities });
            }
            else {
                _this.entity = new menu_model_1.Menu();
            }
        };
        this.edit = function (entity) { return _this.menuActionCreator.edit(entity); };
        this.remove = function (entity) { return _this.menuActionCreator.remove(entity); };
        this.create = function (entity) { return _this.menuActionCreator.create(); };
        this.addOrUpdate = function (options) {
            _this._invokeAsync({
                action: _this.menuActionCreator.addOrUpdate,
                params: { data: options.data }
            }).then(function () {
                if (_this.$location.path() === "/admin/menus") {
                    _this.entity = new menu_model_1.Menu();
                }
                else {
                    _this.$location.path("/admin/menus");
                }
            });
        };
    }
    MenusContainerComponent = __decorate([
        core_1.Component({
            routes: ["/admin/menus", "/admin/menu/edit/:menuId"],
            template: require("./menus-container.component.html"),
            styles: [require("./menus-container.component.scss")],
            selector: "menus-container",
            viewProviders: ["$location", "$routeParams", "menuActionCreator", "invokeAsync"],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }),
        core_1.CanActivate(["$q", "$route", "invokeAsync", "menuActionCreator", function ($q, $route, invokeAsync, menuActionCreator) {
                var menuId = $route.current.params.menuId;
                var promises = [invokeAsync(menuActionCreator.all)];
                if (menuId) {
                    promises.push(invokeAsync({ action: menuActionCreator.getById, params: { id: menuId } }));
                }
                ;
                return $q.all(promises);
            }]), 
        __metadata('design:paramtypes', [Object, Object, menu_action_creator_1.MenuActionCreator, Object])
    ], MenusContainerComponent);
    return MenusContainerComponent;
}());
exports.MenusContainerComponent = MenusContainerComponent;
