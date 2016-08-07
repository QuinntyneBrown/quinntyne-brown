"use strict";
var actions = require("./menu-item.actions");
var core_1 = require("angular-rx-ui/src/components/core");
exports.removeMenuItemReducer = function (state, action) {
    if (action instanceof actions.RemoveMenuItemAction)
        core_1.pluckOut({ items: state.menuItems, value: action.entity.id });
    return state;
};
exports.addMenuItemReducer = function (state, action) {
    if (action instanceof actions.AddOrUpdateMenuItemAction) {
        core_1.addOrUpdate({ items: state.menuItems, item: action.entity });
    }
    return state;
};
exports.allMenuItemsReducer = function (state, action) {
    if (action instanceof actions.AllMenuItemsAction) {
        state.menuItems = action.entities;
    }
    return state;
};
exports.setCurrentMenuItemReducer = function (state, action) {
    if (action instanceof actions.SetCurrentMenuItemAction) {
        state.currentMenuItemId = action.id;
    }
    return state;
};
