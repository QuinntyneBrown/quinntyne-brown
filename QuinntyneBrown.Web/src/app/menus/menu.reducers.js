"use strict";
var actions = require("./menu.actions");
var core_1 = require("angular-rx-ui/src/components/core");
exports.removeMenuReducer = function (state, action) {
    if (action instanceof actions.RemoveMenuAction)
        core_1.pluckOut({ items: state.menus, value: action.entity.id });
    return state;
};
exports.addMenuReducer = function (state, action) {
    if (action instanceof actions.AddOrUpdateMenuAction) {
        core_1.addOrUpdate({ items: state.menus, item: action.entity });
    }
    return state;
};
exports.allMenusReducer = function (state, action) {
    if (action instanceof actions.AllMenusAction) {
        state.menus = action.entities;
    }
    return state;
};
exports.setCurrentMenuReducer = function (state, action) {
    if (action instanceof actions.SetCurrentMenuAction) {
        state.currentMenuId = action.id;
    }
    return state;
};
