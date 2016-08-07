"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require("angular-rx-ui/src/components/core");
var order_editor_component_1 = require("./order-editor.component");
var order_list_component_1 = require("./order-list.component");
var order_component_1 = require("./order.component");
var orders_container_component_1 = require("./orders-container.component");
var order_action_creator_1 = require("./order.action-creator");
var order_service_1 = require("./order.service");
var reducers = require("./order.reducers");
var actions = require("./order.actions");
var appOrdersModule = angular.module("quinntynebrown.orders", []);
core_1.bootstrap(appOrdersModule, {
    components: [order_component_1.OrderComponent, order_editor_component_1.OrderEditorComponent, orders_container_component_1.OrdersContainerComponent, order_list_component_1.OrderListComponent],
    providers: [order_action_creator_1.OrderActionCreator, order_service_1.OrderService],
    reducers: reducers,
    actions: actions
});
__export(require("./orders.routes"));
