"use strict";
var actions = require("./product.actions");
var core_1 = require("angular-rx-ui/src/components/core");
exports.removeProductReducer = function (state, action) {
    if (action instanceof actions.RemoveProductAction)
        core_1.pluckOut({ items: state.products, value: action.entity.id });
    return state;
};
exports.addProductReducer = function (state, action) {
    if (action instanceof actions.AddOrUpdateProductAction) {
        core_1.addOrUpdate({ items: state.products, item: action.entity });
    }
    return state;
};
exports.allProductsReducer = function (state, action) {
    if (action instanceof actions.AllProductsAction) {
        state.products = action.entities;
    }
    return state;
};
exports.setCurrentProductReducer = function (state, action) {
    if (action instanceof actions.SetCurrentProductAction) {
        state.currentProductId = action.id;
    }
    return state;
};
