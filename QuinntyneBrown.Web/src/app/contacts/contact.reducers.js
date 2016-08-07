"use strict";
var actions = require("./contact.actions");
var core_1 = require("angular-rx-ui/src/components/core");
exports.removeContactReducer = function (state, action) {
    if (action instanceof actions.RemoveContactAction)
        core_1.pluckOut({ items: state.contacts, value: action.entity.id });
    return state;
};
exports.addContactReducer = function (state, action) {
    if (action instanceof actions.AddOrUpdateContactAction) {
        core_1.addOrUpdate({ items: state.contacts, item: action.entity });
    }
    return state;
};
exports.allContactsReducer = function (state, action) {
    if (action instanceof actions.AllContactsAction) {
        state.contacts = action.entities;
    }
    return state;
};
exports.setCurrentContactReducer = function (state, action) {
    if (action instanceof actions.SetCurrentContactAction) {
        state.currentContactId = action.id;
    }
    return state;
};
