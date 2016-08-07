"use strict";
var actions = require("./social-share-item.actions");
var core_1 = require("angular-rx-ui/src/components/core");
exports.removeSocialShareItemReducer = function (state, action) {
    if (action instanceof actions.RemoveSocialShareItemAction)
        core_1.pluckOut({ items: state.socialShareItems, value: action.entity.id });
    return state;
};
exports.addSocialShareItemReducer = function (state, action) {
    if (action instanceof actions.AddOrUpdateSocialShareItemAction) {
        core_1.addOrUpdate({ items: state.socialShareItems, item: action.entity });
    }
    return state;
};
exports.allSocialShareItemsReducer = function (state, action) {
    if (action instanceof actions.AllSocialShareItemsAction) {
        state.socialShareItems = action.entities;
    }
    return state;
};
exports.setCurrentSocialShareItemReducer = function (state, action) {
    if (action instanceof actions.SetCurrentSocialShareItemAction) {
        state.currentSocialShareItemId = action.id;
    }
    return state;
};
