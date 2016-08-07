"use strict";
var actions = require("../actions/ui.actions");
var core_1 = require("angular-rx-ui/src/components/core");
exports.removeUIReducer = function (state, action) {
    if (action instanceof actions.RemoveUIAction)
        core_1.pluckOut({ items: state.uis, value: action.entity.id });
    return state;
};
exports.addUIReducer = function (state, action) {
    if (action instanceof actions.AddOrUpdateUIAction) {
        core_1.addOrUpdate({ items: state.uis, item: action.entity });
    }
    return state;
};
exports.allUIsReducer = function (state, action) {
    if (action instanceof actions.AllUIsAction) {
        state.uis = action.entities;
    }
    return state;
};
exports.setCurrentUIReducer = function (state, action) {
    if (action instanceof actions.SetCurrentUIAction) {
        state.currentUiId = action.id;
    }
    return state;
};
