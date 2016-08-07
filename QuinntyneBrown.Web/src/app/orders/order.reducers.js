"use strict";
var actions = require("./order.actions");
var core_1 = require("angular-rx-ui/src/components/core");
exports.removeOrderReducer = function (state, action) {
    if (action instanceof actions.RemoveOrderAction)
        core_1.pluckOut({ items: state.orders, value: action.entity.id });
    return state;
};
exports.addOrderReducer = function (state, action) {
    if (action instanceof actions.AddOrUpdateOrderAction) {
        core_1.addOrUpdate({ items: state.orders, item: action.entity });
    }
    return state;
};
exports.allOrdersReducer = function (state, action) {
    if (action instanceof actions.AllOrdersAction) {
        state.orders = action.entities;
    }
    return state;
};
exports.setCurrentOrderReducer = function (state, action) {
    if (action instanceof actions.SetCurrentOrderAction) {
        state.currentOrderId = action.id;
    }
    return state;
};
