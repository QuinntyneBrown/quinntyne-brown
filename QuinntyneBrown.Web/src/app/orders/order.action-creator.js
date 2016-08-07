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
var modal_action_creator_1 = require("angular-rx-ui/src/components/modal/modal.action-creator");
var order_actions_1 = require("./order.actions");
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
