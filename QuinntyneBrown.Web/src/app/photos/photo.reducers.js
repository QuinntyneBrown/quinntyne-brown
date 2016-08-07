"use strict";
var actions = require("./photo.actions");
var core_1 = require("angular-rx-ui/src/components/core");
exports.photoSearchReducer = function (state, action) {
    if (action instanceof actions.PhotoSearchAction) {
        state.photoSearchResults = action.results;
    }
    return state;
};
exports.removePhotoReducer = function (state, action) {
    if (action instanceof actions.RemovePhotoAction)
        core_1.pluckOut({ items: state.photos, value: action.entity.id });
    return state;
};
exports.addPhotoReducer = function (state, action) {
    if (action instanceof actions.AddOrUpdatePhotoAction) {
        core_1.addOrUpdate({ items: state.photos, item: action.entity });
    }
    return state;
};
exports.allPhotosReducer = function (state, action) {
    if (action instanceof actions.AllPhotosAction) {
        state.photos = action.entities;
    }
    return state;
};
exports.setCurrentPhotoReducer = function (state, action) {
    if (action instanceof actions.SetCurrentPhotoAction) {
        state.currentPhotoId = action.id;
    }
    return state;
};
exports.photoUploadReducer = function (state, action) {
    if (action instanceof actions.PhotoUploadAction) {
        state.currentPhotoId = action.id;
        for (var i = 0; i < action.entities.length; i++) {
            core_1.addOrUpdate({ items: state.photos, item: action.entities[i] });
        }
    }
    return state;
};
