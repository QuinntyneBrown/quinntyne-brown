"use strict";
var actions = require("../actions/property.actions");
var core_1 = require("angular-rx-ui/src/components/core");
exports.removePropertyReducer = function (state, action) {
    if (action instanceof actions.RemovePropertyAction)
        core_1.pluckOut({ items: state.properties, value: action.entity.id });
    return state;
};
exports.addPropertyReducer = function (state, action) {
    if (action instanceof actions.AddOrUpdatePropertyAction) {
        core_1.addOrUpdate({ items: state.properties, item: action.entity });
    }
    return state;
};
exports.allPropertiesReducer = function (state, action) {
    if (action instanceof actions.AllPropertiesAction) {
        state.properties = action.entities;
    }
    return state;
};
exports.setCurrentPropertyReducer = function (state, action) {
    if (action instanceof actions.SetCurrentPropertyAction) {
        state.currentPropertyId = action.id;
    }
    return state;
};
