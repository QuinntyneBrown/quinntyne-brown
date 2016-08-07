"use strict";
var actions = require("../actions/app.actions");
var core_1 = require("angular-rx-ui/src/components/core");
exports.removeAppReducer = function (state, action) {
    if (action instanceof actions.RemoveAppAction)
        core_1.pluckOut({ items: state.apps, value: action.entity.id });
    return state;
};
exports.addAppReducer = function (state, action) {
    if (action instanceof actions.AddOrUpdateAppAction) {
        core_1.addOrUpdate({ items: state.apps, item: action.entity });
    }
    return state;
};
exports.allAppsReducer = function (state, action) {
    if (action instanceof actions.AllAppsAction) {
        state.apps = action.entities;
    }
    return state;
};
exports.setCurrentAppReducer = function (state, action) {
    if (action instanceof actions.SetCurrentAppAction) {
        state.currentAppId = action.id;
    }
    return state;
};
