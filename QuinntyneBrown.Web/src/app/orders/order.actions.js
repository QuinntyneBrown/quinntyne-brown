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
