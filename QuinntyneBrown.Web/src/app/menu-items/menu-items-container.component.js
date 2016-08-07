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
var actions = require("./menu-item.actions");
var menu_item_action_creator_1 = require("./menu-item.action-creator");
var menu_item_model_1 = require("./menu-item.model");
var MenuItemsContainerComponent = (function () {
    function MenuItemsContainerComponent($location, $routeParams, menuItemActionCreator, _invokeAsync) {
        var _this = this;
        this.$location = $location;
        this.$routeParams = $routeParams;
        this.menuItemActionCreator = menuItemActionCreator;
        this._invokeAsync = _invokeAsync;
        this.storeOnChange = function (state) {
            _this.entities = state.menuItems;
            if (state.lastTriggeredByAction instanceof actions.SetCurrentMenuItemAction && !state.lastTriggeredByAction.entity)
                _this.$location.path("/admin/menuitems");
            if (state.lastTriggeredByAction instanceof actions.SetCurrentMenuItemAction && state.lastTriggeredByAction.entity)
                _this.$location.path("/admin/menuitem/edit/" + state.lastTriggeredByAction.entity.id);
            if (state.lastTriggeredByAction instanceof actions.AddOrUpdateMenuItemAction)
                _this.entity = new menu_item_model_1.MenuItem();
            if (state.lastTriggeredByAction instanceof actions.RemoveMenuItemAction && _this.entity && _this.entity.id) {
                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["menuItemId"]), items: _this.entities });
                if (Object.keys(_this.entity).length === 0) {
                    _this.$location.path("/admin/menuitems");
                }
            }
        };
        this.ngOnInit = function () {
            if (_this.$routeParams["menuItemId"]) {
                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["menuItemId"]), items: _this.entities });
            }
            else {
                _this.entity = new menu_item_model_1.MenuItem();
            }
        };
        this.edit = function (entity) { return _this.menuItemActionCreator.edit(entity); };
        this.remove = function (entity) { return _this.menuItemActionCreator.remove(entity); };
        this.create = function (entity) { return _this.menuItemActionCreator.create(); };
        this.addOrUpdate = function (options) {
            _this._invokeAsync({
                action: _this.menuItemActionCreator.addOrUpdate,
                params: { data: options.data }
            }).then(function () {
                if (_this.$location.path() === "/admin/menuitems") {
                    _this.entity = new menu_item_model_1.MenuItem();
                }
                else {
                    _this.$location.path("/admin/menuitems");
                }
            });
        };
    }
    MenuItemsContainerComponent = __decorate([
        core_1.Component({
            routes: ["/admin/menuitems", "/admin/menuitem/edit/:menuItemId"],
            template: require("./menu-items-container.component.html"),
            styles: [require("./menu-items-container.component.scss")],
            selector: "menu-items-container",
            viewProviders: ["$location", "$routeParams", "menuItemActionCreator", "invokeAsync"],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }),
        core_1.CanActivate(["$q", "$route", "invokeAsync", "menuItemActionCreator", function ($q, $route, invokeAsync, menuItemActionCreator) {
                var menuItemId = $route.current.params.menuItemId;
                var promises = [invokeAsync(menuItemActionCreator.all)];
                if (menuItemId) {
                    promises.push(invokeAsync({ action: menuItemActionCreator.getById, params: { id: menuItemId } }));
                }
                ;
                return $q.all(promises);
            }]), 
        __metadata('design:paramtypes', [Object, Object, menu_item_action_creator_1.MenuItemActionCreator, Object])
    ], MenuItemsContainerComponent);
    return MenuItemsContainerComponent;
}());
exports.MenuItemsContainerComponent = MenuItemsContainerComponent;
