"use strict";
var actions = require("../actions/section.actions");
var core_1 = require("angular-rx-ui/src/components/core");
exports.removeSectionReducer = function (state, action) {
    if (action instanceof actions.RemoveSectionAction)
        core_1.pluckOut({ items: state.sections, value: action.entity.id });
    return state;
};
exports.addSectionReducer = function (state, action) {
    if (action instanceof actions.AddOrUpdateSectionAction) {
        core_1.addOrUpdate({ items: state.sections, item: action.entity });
    }
    return state;
};
exports.allSectionsReducer = function (state, action) {
    if (action instanceof actions.AllSectionsAction) {
        state.sections = action.entities;
    }
    return state;
};
exports.setCurrentSectionReducer = function (state, action) {
    if (action instanceof actions.SetCurrentSectionAction) {
        state.currentSectionId = action.id;
    }
    return state;
};
