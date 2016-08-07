"use strict";
var actions = require("./article.actions");
var core_1 = require("angular-rx-ui/src/components/core");
exports.removeArticleReducer = function (state, action) {
    if (action instanceof actions.RemoveArticleAction)
        core_1.pluckOut({ items: state.articles, value: action.entity.id });
    return state;
};
exports.addArticleReducer = function (state, action) {
    if (action instanceof actions.AddOrUpdateArticleAction) {
        core_1.addOrUpdate({ items: state.articles, item: action.entity });
    }
    return state;
};
exports.allArticlesReducer = function (state, action) {
    if (action instanceof actions.AllArticlesAction) {
        state.articles = action.entities;
    }
    return state;
};
exports.setCurrentArticleReducer = function (state, action) {
    if (action instanceof actions.SetCurrentArticleAction) {
        state.currentArticleId = action.id;
    }
    return state;
};
