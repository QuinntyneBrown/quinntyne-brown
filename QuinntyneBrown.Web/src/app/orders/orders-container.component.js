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
var actions = require("./order.actions");
var order_action_creator_1 = require("./order.action-creator");
var order_model_1 = require("./order.model");
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
            template: require("./orders-container.component.html"),
            styles: [require("./orders-container.component.scss")],
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
